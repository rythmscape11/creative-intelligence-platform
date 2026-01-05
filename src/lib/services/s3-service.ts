import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '../../../server/utils/logger';

export interface S3UploadOptions {
  contentType?: string;
  contentDisposition?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
  expires?: Date;
  serverSideEncryption?: 'AES256' | 'aws:kms';
  kmsKeyId?: string;
  acl?: 'private' | 'public-read' | 'public-read-write';
}

export interface S3DownloadOptions {
  expiresIn?: number; // seconds
  responseContentType?: string;
  responseContentDisposition?: string;
}

export interface S3FileInfo {
  key: string;
  size: number;
  lastModified: Date;
  etag: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface S3UploadResult {
  key: string;
  location: string;
  etag: string;
  bucket: string;
  signedUrl?: string;
}

export class S3Service {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.AWS_S3_BUCKET || 'mediaplanpro-files';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(
    key: string,
    body: Buffer | Uint8Array | string,
    options: S3UploadOptions = {}
  ): Promise<S3UploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: options.contentType || 'application/octet-stream',
        ContentDisposition: options.contentDisposition,
        Metadata: options.metadata,
        CacheControl: options.cacheControl || 'max-age=31536000', // 1 year default
        Expires: options.expires,
        ServerSideEncryption: options.serverSideEncryption,
        SSEKMSKeyId: options.kmsKeyId,
        ACL: options.acl || 'private',
      });

      const result = await this.s3Client.send(command);
      
      const location = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
      
      logger.info(`File uploaded successfully to S3: ${location}`);

      return {
        key,
        location,
        etag: result.ETag || '',
        bucket: this.bucket,
      };
    } catch (error) {
      logger.error(`Failed to upload file to S3: ${key}`, error);
      throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a signed URL for downloading a file
   */
  async getSignedDownloadUrl(
    key: string,
    options: S3DownloadOptions = {}
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ResponseContentType: options.responseContentType,
        ResponseContentDisposition: options.responseContentDisposition,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: options.expiresIn || 3600, // 1 hour default
      });

      logger.info(`Generated signed download URL for: ${key}`);
      return signedUrl;
    } catch (error) {
      logger.error(`Failed to generate signed URL for: ${key}`, error);
      throw new Error(`Failed to generate signed URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a signed URL for uploading a file
   */
  async getSignedUploadUrl(
    key: string,
    contentType: string,
    options: S3DownloadOptions = {}
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: options.expiresIn || 3600, // 1 hour default
      });

      logger.info(`Generated signed upload URL for: ${key}`);
      return signedUrl;
    } catch (error) {
      logger.error(`Failed to generate signed upload URL for: ${key}`, error);
      throw new Error(`Failed to generate signed upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      logger.info(`File deleted successfully from S3: ${key}`);
    } catch (error) {
      logger.error(`Failed to delete file from S3: ${key}`, error);
      throw new Error(`S3 delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      logger.error(`Failed to check file existence in S3: ${key}`, error);
      throw new Error(`S3 head object failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get file information from S3
   */
  async getFileInfo(key: string): Promise<S3FileInfo> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const result = await this.s3Client.send(command);

      return {
        key,
        size: result.ContentLength || 0,
        lastModified: result.LastModified || new Date(),
        etag: result.ETag || '',
        contentType: result.ContentType,
        metadata: result.Metadata,
      };
    } catch (error) {
      logger.error(`Failed to get file info from S3: ${key}`, error);
      throw new Error(`S3 head object failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List files in a directory (prefix)
   */
  async listFiles(prefix: string, maxKeys: number = 1000): Promise<S3FileInfo[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const result = await this.s3Client.send(command);
      
      return (result.Contents || []).map(object => ({
        key: object.Key || '',
        size: object.Size || 0,
        lastModified: object.LastModified || new Date(),
        etag: object.ETag || '',
      }));
    } catch (error) {
      logger.error(`Failed to list files in S3 with prefix: ${prefix}`, error);
      throw new Error(`S3 list objects failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Copy a file within S3
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      const command = new CopyObjectCommand({
        Bucket: this.bucket,
        Key: destinationKey,
        CopySource: `${this.bucket}/${sourceKey}`,
      });

      await this.s3Client.send(command);
      logger.info(`File copied successfully in S3: ${sourceKey} -> ${destinationKey}`);
    } catch (error) {
      logger.error(`Failed to copy file in S3: ${sourceKey} -> ${destinationKey}`, error);
      throw new Error(`S3 copy failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a key for user files with proper organization
   */
  static generateUserFileKey(userId: string, category: string, filename: string): string {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `users/${userId}/${category}/${timestamp}_${sanitizedFilename}`;
  }

  /**
   * Generate a key for export files
   */
  static generateExportKey(userId: string, strategyId: string, format: string, filename: string): string {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `exports/${userId}/${strategyId}/${timestamp}_${sanitizedFilename}`;
  }

  /**
   * Generate a key for temporary files
   */
  static generateTempKey(category: string, filename: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `temp/${category}/${timestamp}_${randomId}_${sanitizedFilename}`;
  }

  /**
   * Clean up expired temporary files
   */
  async cleanupTempFiles(olderThanHours: number = 24): Promise<number> {
    try {
      const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
      const tempFiles = await this.listFiles('temp/');
      
      let deletedCount = 0;
      
      for (const file of tempFiles) {
        if (file.lastModified < cutoffTime) {
          await this.deleteFile(file.key);
          deletedCount++;
        }
      }

      logger.info(`Cleaned up ${deletedCount} temporary files older than ${olderThanHours} hours`);
      return deletedCount;
    } catch (error) {
      logger.error('Failed to cleanup temporary files', error);
      throw new Error(`Temp file cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get storage usage for a user
   */
  async getUserStorageUsage(userId: string): Promise<{ totalSize: number; fileCount: number }> {
    try {
      const userFiles = await this.listFiles(`users/${userId}/`);
      
      const totalSize = userFiles.reduce((sum, file) => sum + file.size, 0);
      const fileCount = userFiles.length;

      return { totalSize, fileCount };
    } catch (error) {
      logger.error(`Failed to get storage usage for user: ${userId}`, error);
      throw new Error(`Storage usage calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
