import { S3Service } from './s3-service';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../../server/utils/logger';

export interface CleanupOptions {
  dryRun?: boolean;
  maxAge?: number; // hours
  maxSize?: number; // bytes
  categories?: string[];
}

export interface CleanupResult {
  filesDeleted: number;
  spaceFreed: number;
  errors: string[];
  summary: string;
}

export class StorageCleanupService {
  private s3Service: S3Service;
  private prisma: PrismaClient;

  constructor() {
    this.s3Service = new S3Service();
    this.prisma = new PrismaClient();
  }

  /**
   * Clean up temporary files older than specified age
   */
  async cleanupTempFiles(options: CleanupOptions = {}): Promise<CleanupResult> {
    const { dryRun = false, maxAge = 24 } = options;
    const result: CleanupResult = {
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      summary: '',
    };

    try {
      logger.info(`Starting temp files cleanup (maxAge: ${maxAge}h, dryRun: ${dryRun})`);

      // Clean up S3 temp files
      const s3DeletedCount = await this.s3Service.cleanupTempFiles(maxAge);
      result.filesDeleted += s3DeletedCount;

      // Clean up database records for temp files
      const cutoffTime = new Date(Date.now() - maxAge * 60 * 60 * 1000);
      
      if (!dryRun) {
        const dbResult = await this.prisma.file.deleteMany({
          where: {
            category: 'temp',
            createdAt: {
              lt: cutoffTime,
            },
          },
        });
        
        logger.info(`Deleted ${dbResult.count} temp file records from database`);
      } else {
        const tempFiles = await this.prisma.file.findMany({
          where: {
            category: 'temp',
            createdAt: {
              lt: cutoffTime,
            },
          },
        });
        
        logger.info(`Would delete ${tempFiles.length} temp file records from database`);
      }

      result.summary = `Cleaned up ${result.filesDeleted} temporary files older than ${maxAge} hours`;
      logger.info(result.summary);

      return result;
    } catch (error) {
      const errorMessage = `Temp files cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMessage);
      logger.error(errorMessage, error);
      return result;
    }
  }

  /**
   * Clean up expired export files
   */
  async cleanupExpiredExports(options: CleanupOptions = {}): Promise<CleanupResult> {
    const { dryRun = false } = options;
    const result: CleanupResult = {
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      summary: '',
    };

    try {
      logger.info(`Starting expired exports cleanup (dryRun: ${dryRun})`);

      // Find expired export jobs
      const expiredExports = await this.prisma.exportJob.findMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
          status: 'COMPLETED',
          s3Key: {
            not: null,
          },
        },
      });

      logger.info(`Found ${expiredExports.length} expired export files`);

      for (const exportJob of expiredExports) {
        try {
          if (exportJob.s3Key) {
            // Check if file exists in S3 before attempting deletion
            const fileExists = await this.s3Service.fileExists(exportJob.s3Key);
            
            if (fileExists) {
              if (!dryRun) {
                await this.s3Service.deleteFile(exportJob.s3Key);
                logger.info(`Deleted expired export file: ${exportJob.s3Key}`);
              } else {
                logger.info(`Would delete expired export file: ${exportJob.s3Key}`);
              }
              
              result.filesDeleted++;
            }

            // Update export job to remove file references
            if (!dryRun) {
              await this.prisma.exportJob.update({
                where: { id: exportJob.id },
                data: {
                  fileUrl: null,
                  s3Key: null,
                  status: 'EXPIRED',
                },
              });
            }
          }
        } catch (error) {
          const errorMessage = `Failed to delete export file ${exportJob.s3Key}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          logger.error(errorMessage, error);
        }
      }

      result.summary = `Cleaned up ${result.filesDeleted} expired export files`;
      logger.info(result.summary);

      return result;
    } catch (error) {
      const errorMessage = `Expired exports cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMessage);
      logger.error(errorMessage, error);
      return result;
    }
  }

  /**
   * Clean up orphaned files (files in S3 but not in database)
   */
  async cleanupOrphanedFiles(options: CleanupOptions = {}): Promise<CleanupResult> {
    const { dryRun = false } = options;
    const result: CleanupResult = {
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      summary: '',
    };

    try {
      logger.info(`Starting orphaned files cleanup (dryRun: ${dryRun})`);

      // Get all files from database
      const dbFiles = await this.prisma.file.findMany({
        select: { s3Key: true },
      });
      
      const dbS3Keys = new Set(dbFiles.map(f => f.s3Key));

      // Get all export files from database
      const dbExports = await this.prisma.exportJob.findMany({
        where: { s3Key: { not: null } },
        select: { s3Key: true },
      });
      
      dbExports.forEach(exp => {
        if (exp.s3Key) dbS3Keys.add(exp.s3Key);
      });

      // List all files in S3 (excluding temp files which have their own cleanup)
      const s3Files = await this.s3Service.listFiles('users/');
      const exportFiles = await this.s3Service.listFiles('exports/');
      
      const allS3Files = [...s3Files, ...exportFiles];

      logger.info(`Found ${allS3Files.length} files in S3, ${dbS3Keys.size} in database`);

      // Find orphaned files
      const orphanedFiles = allS3Files.filter(file => !dbS3Keys.has(file.key));

      logger.info(`Found ${orphanedFiles.length} orphaned files`);

      for (const file of orphanedFiles) {
        try {
          if (!dryRun) {
            await this.s3Service.deleteFile(file.key);
            logger.info(`Deleted orphaned file: ${file.key}`);
          } else {
            logger.info(`Would delete orphaned file: ${file.key}`);
          }
          
          result.filesDeleted++;
          result.spaceFreed += file.size;
        } catch (error) {
          const errorMessage = `Failed to delete orphaned file ${file.key}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          logger.error(errorMessage, error);
        }
      }

      result.summary = `Cleaned up ${result.filesDeleted} orphaned files, freed ${this.formatBytes(result.spaceFreed)}`;
      logger.info(result.summary);

      return result;
    } catch (error) {
      const errorMessage = `Orphaned files cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMessage);
      logger.error(errorMessage, error);
      return result;
    }
  }

  /**
   * Clean up large files for users exceeding storage quota
   */
  async cleanupLargeFiles(options: CleanupOptions = {}): Promise<CleanupResult> {
    const { dryRun = false, maxSize = 100 * 1024 * 1024 } = options; // 100MB default
    const result: CleanupResult = {
      filesDeleted: 0,
      spaceFreed: 0,
      errors: [],
      summary: '',
    };

    try {
      logger.info(`Starting large files cleanup (maxSize: ${this.formatBytes(maxSize)}, dryRun: ${dryRun})`);

      // Find users with excessive storage usage
      const userStorageUsage = await this.prisma.file.groupBy({
        by: ['userId'],
        _sum: { size: true },
        _count: true,
        having: {
          size: {
            _sum: {
              gt: maxSize,
            },
          },
        },
      });

      logger.info(`Found ${userStorageUsage.length} users exceeding storage quota`);

      for (const userUsage of userStorageUsage) {
        try {
          // Get largest files for this user
          const largeFiles = await this.prisma.file.findMany({
            where: { userId: userUsage.userId },
            orderBy: { size: 'desc' },
            take: 10, // Top 10 largest files
          });

          logger.info(`User ${userUsage.userId} has ${userUsage._sum.size} bytes, ${largeFiles.length} large files`);

          // For now, just log the large files - in production you might want to notify users
          // or implement a more sophisticated cleanup policy
          for (const file of largeFiles) {
            logger.info(`Large file: ${file.filename} (${this.formatBytes(file.size)})`);
          }
        } catch (error) {
          const errorMessage = `Failed to process large files for user ${userUsage.userId}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          logger.error(errorMessage, error);
        }
      }

      result.summary = `Analyzed storage usage for ${userStorageUsage.length} users exceeding quota`;
      logger.info(result.summary);

      return result;
    } catch (error) {
      const errorMessage = `Large files cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMessage);
      logger.error(errorMessage, error);
      return result;
    }
  }

  /**
   * Run comprehensive storage cleanup
   */
  async runFullCleanup(options: CleanupOptions = {}): Promise<CleanupResult> {
    const { dryRun = false } = options;
    
    logger.info(`Starting full storage cleanup (dryRun: ${dryRun})`);

    const results: CleanupResult[] = [];

    // Run all cleanup operations
    results.push(await this.cleanupTempFiles(options));
    results.push(await this.cleanupExpiredExports(options));
    results.push(await this.cleanupOrphanedFiles(options));
    results.push(await this.cleanupLargeFiles(options));

    // Combine results
    const combinedResult: CleanupResult = {
      filesDeleted: results.reduce((sum, r) => sum + r.filesDeleted, 0),
      spaceFreed: results.reduce((sum, r) => sum + r.spaceFreed, 0),
      errors: results.flatMap(r => r.errors),
      summary: '',
    };

    combinedResult.summary = `Full cleanup completed: ${combinedResult.filesDeleted} files deleted, ${this.formatBytes(combinedResult.spaceFreed)} freed`;
    
    if (combinedResult.errors.length > 0) {
      combinedResult.summary += `, ${combinedResult.errors.length} errors`;
    }

    logger.info(combinedResult.summary);

    return combinedResult;
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    userFiles: number;
    userSize: number;
    exportFiles: number;
    exportSize: number;
    tempFiles: number;
    tempSize: number;
  }> {
    try {
      const [fileStats, exportStats] = await Promise.all([
        this.prisma.file.aggregate({
          _count: true,
          _sum: { size: true },
        }),
        this.prisma.exportJob.aggregate({
          where: { s3Key: { not: null } },
          _count: true,
        }),
      ]);

      const userFileStats = await this.prisma.file.aggregate({
        where: { category: { not: 'temp' } },
        _count: true,
        _sum: { size: true },
      });

      const tempFileStats = await this.prisma.file.aggregate({
        where: { category: 'temp' },
        _count: true,
        _sum: { size: true },
      });

      return {
        totalFiles: fileStats._count,
        totalSize: fileStats._sum.size || 0,
        userFiles: userFileStats._count,
        userSize: userFileStats._sum.size || 0,
        exportFiles: exportStats._count,
        exportSize: 0, // Would need to calculate from S3
        tempFiles: tempFileStats._count,
        tempSize: tempFileStats._sum.size || 0,
      };
    } catch (error) {
      logger.error('Failed to get storage stats', error);
      throw error;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
