import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { S3Service } from '../../src/lib/services/s3-service';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import multer from 'multer';

const router = Router();
const prisma = new PrismaClient();
const s3Service = new S3Service();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

// Validation schemas
const uploadRequestSchema = z.object({
  category: z.enum(['avatar', 'logo', 'document', 'image', 'temp']),
  description: z.string().optional(),
});

const signedUrlRequestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  category: z.enum(['avatar', 'logo', 'document', 'image', 'temp']),
});

// Upload file directly
router.post('/upload', upload.single('file'), asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file provided',
    });
  }

  const validationResult = uploadRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const { category, description } = validationResult.data;
  const file = req.file;

  try {
    // Generate S3 key
    const s3Key = S3Service.generateUserFileKey(userId, category, file.originalname);

    // Upload to S3
    const uploadResult = await s3Service.uploadFile(s3Key, file.buffer, {
      contentType: file.mimetype,
      metadata: {
        userId: userId,
        category: category,
        originalName: file.originalname,
        description: description || '',
        uploadedAt: new Date().toISOString(),
      },
      serverSideEncryption: 'AES256',
    });

    // Store file record in database
    const fileRecord = await prisma.file.create({
      data: {
        id: uploadResult.key,
        userId: userId,
        filename: file.originalname,
        s3Key: uploadResult.key,
        contentType: file.mimetype,
        size: file.size,
        category: category,
        description: description,
      },
    });

    res.json({
      success: true,
      data: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        contentType: fileRecord.contentType,
        size: fileRecord.size,
        category: fileRecord.category,
        uploadedAt: fileRecord.createdAt,
        s3Key: uploadResult.key,
      },
      message: 'File uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get signed URL for direct upload
router.post('/signed-url', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const validationResult = signedUrlRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const { filename, contentType, category } = validationResult.data;

  try {
    // Generate S3 key
    const s3Key = S3Service.generateUserFileKey(userId, category, filename);

    // Generate signed upload URL
    const signedUrl = await s3Service.getSignedUploadUrl(s3Key, contentType, {
      expiresIn: 3600, // 1 hour
    });

    res.json({
      success: true,
      data: {
        uploadUrl: signedUrl,
        s3Key: s3Key,
        expiresIn: 3600,
      },
      message: 'Signed upload URL generated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate signed URL',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get file download URL
router.get('/download/:fileId', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  const { fileId } = req.params;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    // Get file record from database
    const fileRecord = await prisma.file.findFirst({
      where: {
        id: fileId,
        userId: userId,
      },
    });

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found or access denied',
      });
    }

    // Generate signed download URL
    const signedUrl = await s3Service.getSignedDownloadUrl(fileRecord.s3Key, {
      expiresIn: 3600, // 1 hour
      responseContentDisposition: `attachment; filename="${fileRecord.filename}"`,
    });

    res.json({
      success: true,
      data: {
        downloadUrl: signedUrl,
        filename: fileRecord.filename,
        contentType: fileRecord.contentType,
        size: fileRecord.size,
        expiresIn: 3600,
      },
      message: 'Download URL generated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate download URL',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// List user files
router.get('/list', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  const { category, page = 1, limit = 20 } = req.query;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const where: any = { userId };
    if (category) {
      where.category = category;
    }

    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.file.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        files: files.map(file => ({
          id: file.id,
          filename: file.filename,
          contentType: file.contentType,
          size: file.size,
          category: file.category,
          description: file.description,
          createdAt: file.createdAt,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      message: 'Files retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve files',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Delete file
router.delete('/:fileId', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  const { fileId } = req.params;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    // Get file record from database
    const fileRecord = await prisma.file.findFirst({
      where: {
        id: fileId,
        userId: userId,
      },
    });

    if (!fileRecord) {
      return res.status(404).json({
        success: false,
        message: 'File not found or access denied',
      });
    }

    // Delete from S3
    await s3Service.deleteFile(fileRecord.s3Key);

    // Delete from database
    await prisma.file.delete({
      where: { id: fileId },
    });

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get storage usage
router.get('/storage/usage', asyncHandler(async (req: any, res: any) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    const [dbUsage, s3Usage] = await Promise.all([
      prisma.file.aggregate({
        where: { userId },
        _sum: { size: true },
        _count: true,
      }),
      s3Service.getUserStorageUsage(userId),
    ]);

    res.json({
      success: true,
      data: {
        totalSize: dbUsage._sum.size || 0,
        fileCount: dbUsage._count,
        s3TotalSize: s3Usage.totalSize,
        s3FileCount: s3Usage.fileCount,
      },
      message: 'Storage usage retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get storage usage',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

export { router as fileRoutes };
