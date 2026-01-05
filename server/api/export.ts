import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { exportQueue } from '../jobs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const exportRequestSchema = z.object({
  customization: z.object({
    colors: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
    }).optional(),
    fonts: z.object({
      heading: z.string().optional(),
      body: z.string().optional(),
    }).optional(),
    logo: z.string().optional(),
  }).optional(),
});

const router = Router();

// Export strategy to PPTX
router.post('/pptx/:strategyId', asyncHandler(async (req: any, res: any) => {
  const { strategyId } = req.params;
  const userId = req.user?.id; // Assuming auth middleware sets req.user

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  // Validate request body
  const validationResult = exportRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  // Check if strategy exists and belongs to user
  const strategy = await prisma.marketingStrategy.findFirst({
    where: {
      id: strategyId,
      userId: userId,
    },
  });

  if (!strategy) {
    return res.status(404).json({
      success: false,
      message: 'Strategy not found or access denied',
    });
  }

  // Create export job
  const job = await exportQueue.add('export-strategy', {
    strategyId,
    format: 'pptx',
    userId,
    customization: validationResult.data.customization,
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });

  res.json({
    success: true,
    data: {
      jobId: job.id,
      status: 'pending',
    },
    message: `PPTX export job created for strategy ${strategyId}`,
  });
}));

// Export strategy to DOCX
router.post('/docx/:strategyId', asyncHandler(async (req: any, res: any) => {
  const { strategyId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const validationResult = exportRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const strategy = await prisma.marketingStrategy.findFirst({
    where: {
      id: strategyId,
      userId: userId,
    },
  });

  if (!strategy) {
    return res.status(404).json({
      success: false,
      message: 'Strategy not found or access denied',
    });
  }

  const job = await exportQueue.add('export-strategy', {
    strategyId,
    format: 'docx',
    userId,
    customization: validationResult.data.customization,
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });

  res.json({
    success: true,
    data: {
      jobId: job.id,
      status: 'pending',
    },
    message: `DOCX export job created for strategy ${strategyId}`,
  });
}));

// Export strategy to XLSX
router.post('/xlsx/:strategyId', asyncHandler(async (req: any, res: any) => {
  const { strategyId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  const validationResult = exportRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request data',
      errors: validationResult.error.errors,
    });
  }

  const strategy = await prisma.marketingStrategy.findFirst({
    where: {
      id: strategyId,
      userId: userId,
    },
  });

  if (!strategy) {
    return res.status(404).json({
      success: false,
      message: 'Strategy not found or access denied',
    });
  }

  const job = await exportQueue.add('export-strategy', {
    strategyId,
    format: 'xlsx',
    userId,
    customization: validationResult.data.customization,
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });

  res.json({
    success: true,
    data: {
      jobId: job.id,
      status: 'pending',
    },
    message: `XLSX export job created for strategy ${strategyId}`,
  });
}));

// Get export job status
router.get('/job/:jobId', asyncHandler(async (req: any, res: any) => {
  const { jobId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    // Get job from Bull queue
    const job = await exportQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if job belongs to user
    if (job.data.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Get job status and progress
    const state = await job.getState();
    const progress = job.progress();
    const result = job.returnvalue;

    res.json({
      success: true,
      data: {
        id: jobId,
        status: state,
        progress: progress,
        result: result,
        createdAt: new Date(job.timestamp).toISOString(),
        processedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
        finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      },
      message: `Export job ${jobId} status retrieved`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get job status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Download exported file
router.get('/download/:jobId', asyncHandler(async (req: any, res: any) => {
  const { jobId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  try {
    // Check export job in database
    const exportJob = await prisma.exportJob.findFirst({
      where: {
        id: jobId,
        userId: userId,
      },
    });

    if (!exportJob) {
      return res.status(404).json({
        success: false,
        message: 'Export job not found or access denied',
      });
    }

    if (exportJob.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Export job is ${exportJob.status}. Download not available.`,
      });
    }

    if (exportJob.expiresAt && exportJob.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Download link has expired',
      });
    }

    res.json({
      success: true,
      data: {
        downloadUrl: exportJob.fileUrl,
        filename: exportJob.filename,
        expiresAt: exportJob.expiresAt?.toISOString(),
      },
      message: `Download link for job ${jobId}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get download link',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

export { router as exportRoutes };
