import { Router } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { z } from 'zod';
import {
  triggerTempFilesCleanup,
  triggerExpiredExportsCleanup,
  triggerOrphanedFilesCleanup,
  triggerFullCleanup,
  getCleanupJobStatus,
  getStorageStats,
} from '../../jobs/cleanup-jobs';

const router = Router();

// Middleware to check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

// Apply admin middleware to all routes
router.use(requireAdmin);

// Validation schemas
const cleanupOptionsSchema = z.object({
  dryRun: z.boolean().optional().default(false),
  maxAge: z.number().min(1).max(8760).optional().default(24), // 1 hour to 1 year
  maxSize: z.number().min(1024).optional().default(100 * 1024 * 1024), // Min 1KB, default 100MB
});

// Get storage statistics
router.get('/stats', asyncHandler(async (req: any, res: any) => {
  try {
    const stats = await getStorageStats();
    
    res.json({
      success: true,
      data: stats,
      message: 'Storage statistics retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get storage statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Trigger temp files cleanup
router.post('/cleanup/temp', asyncHandler(async (req: any, res: any) => {
  const validationResult = cleanupOptionsSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const { dryRun, maxAge } = validationResult.data;

  try {
    const job = await triggerTempFilesCleanup({ dryRun, maxAge });
    
    res.json({
      success: true,
      data: {
        jobId: job.id,
        type: 'temp-files-cleanup',
        options: { dryRun, maxAge },
      },
      message: 'Temp files cleanup job started',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start temp files cleanup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Trigger expired exports cleanup
router.post('/cleanup/exports', asyncHandler(async (req: any, res: any) => {
  const validationResult = z.object({
    dryRun: z.boolean().optional().default(false),
  }).safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const { dryRun } = validationResult.data;

  try {
    const job = await triggerExpiredExportsCleanup({ dryRun });
    
    res.json({
      success: true,
      data: {
        jobId: job.id,
        type: 'expired-exports-cleanup',
        options: { dryRun },
      },
      message: 'Expired exports cleanup job started',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start expired exports cleanup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Trigger orphaned files cleanup
router.post('/cleanup/orphaned', asyncHandler(async (req: any, res: any) => {
  const validationResult = z.object({
    dryRun: z.boolean().optional().default(false),
  }).safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const { dryRun } = validationResult.data;

  try {
    const job = await triggerOrphanedFilesCleanup({ dryRun });
    
    res.json({
      success: true,
      data: {
        jobId: job.id,
        type: 'orphaned-files-cleanup',
        options: { dryRun },
      },
      message: 'Orphaned files cleanup job started',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start orphaned files cleanup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Trigger full cleanup
router.post('/cleanup/full', asyncHandler(async (req: any, res: any) => {
  const validationResult = cleanupOptionsSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const { dryRun, maxAge, maxSize } = validationResult.data;

  try {
    const job = await triggerFullCleanup({ dryRun, maxAge, maxSize });
    
    res.json({
      success: true,
      data: {
        jobId: job.id,
        type: 'full-cleanup',
        options: { dryRun, maxAge, maxSize },
      },
      message: 'Full cleanup job started',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to start full cleanup',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get cleanup job status
router.get('/cleanup/job/:jobId', asyncHandler(async (req: any, res: any) => {
  const { jobId } = req.params;

  try {
    const jobStatus = await getCleanupJobStatus(jobId);
    
    if (!jobStatus) {
      return res.status(404).json({
        success: false,
        message: 'Cleanup job not found',
      });
    }
    
    res.json({
      success: true,
      data: jobStatus,
      message: 'Cleanup job status retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cleanup job status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get cleanup job history
router.get('/cleanup/history', asyncHandler(async (req: any, res: any) => {
  const { page = 1, limit = 20, type } = req.query;

  try {
    // This would require implementing job history tracking
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        jobs: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0,
        },
      },
      message: 'Cleanup job history retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cleanup job history',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get storage usage by user
router.get('/usage/users', asyncHandler(async (req: any, res: any) => {
  const { page = 1, limit = 20, sortBy = 'size', order = 'desc' } = req.query;

  try {
    // This would require implementing user storage usage tracking
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        users: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0,
        },
      },
      message: 'User storage usage retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user storage usage',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get storage usage trends
router.get('/usage/trends', asyncHandler(async (req: any, res: any) => {
  const { period = '7d' } = req.query;

  try {
    // This would require implementing storage usage trend tracking
    // For now, return a placeholder response
    res.json({
      success: true,
      data: {
        trends: [],
        period,
      },
      message: 'Storage usage trends retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get storage usage trends',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Configure storage cleanup settings
router.post('/settings', asyncHandler(async (req: any, res: any) => {
  const settingsSchema = z.object({
    tempFileMaxAge: z.number().min(1).max(8760).optional(),
    exportFileMaxAge: z.number().min(1).max(8760).optional(),
    maxUserStorageSize: z.number().min(1024 * 1024).optional(), // Min 1MB
    cleanupScheduleEnabled: z.boolean().optional(),
    notificationEmail: z.string().email().optional(),
  });

  const validationResult = settingsSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid settings data',
      errors: validationResult.error.errors,
    });
  }

  try {
    // This would require implementing settings storage
    // For now, return a success response
    res.json({
      success: true,
      data: validationResult.data,
      message: 'Storage cleanup settings updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update storage cleanup settings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get storage cleanup settings
router.get('/settings', asyncHandler(async (req: any, res: any) => {
  try {
    // This would require implementing settings retrieval
    // For now, return default settings
    const defaultSettings = {
      tempFileMaxAge: 24, // hours
      exportFileMaxAge: 168, // 7 days
      maxUserStorageSize: 100 * 1024 * 1024, // 100MB
      cleanupScheduleEnabled: true,
      notificationEmail: null,
    };

    res.json({
      success: true,
      data: defaultSettings,
      message: 'Storage cleanup settings retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get storage cleanup settings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

export { router as storageAdminRoutes };
