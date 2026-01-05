import Queue from 'bull';
import { StorageCleanupService } from '../../src/lib/services/storage-cleanup';
import { logger } from '../utils/logger';

// Create cleanup queue
export const cleanupQueue = new Queue('storage cleanup', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
});

const cleanupService = new StorageCleanupService();

// Job processors
cleanupQueue.process('cleanup-temp-files', async (job) => {
  const { maxAge = 24, dryRun = false } = job.data;
  
  logger.info(`Starting temp files cleanup job (maxAge: ${maxAge}h, dryRun: ${dryRun})`);
  
  try {
    job.progress(10);
    
    const result = await cleanupService.cleanupTempFiles({ maxAge, dryRun });
    
    job.progress(100);
    
    logger.info(`Temp files cleanup completed: ${result.summary}`);
    
    return {
      success: true,
      result,
      message: 'Temp files cleanup completed successfully',
    };
  } catch (error) {
    logger.error('Temp files cleanup job failed', error);
    throw error;
  }
});

cleanupQueue.process('cleanup-expired-exports', async (job) => {
  const { dryRun = false } = job.data;
  
  logger.info(`Starting expired exports cleanup job (dryRun: ${dryRun})`);
  
  try {
    job.progress(10);
    
    const result = await cleanupService.cleanupExpiredExports({ dryRun });
    
    job.progress(100);
    
    logger.info(`Expired exports cleanup completed: ${result.summary}`);
    
    return {
      success: true,
      result,
      message: 'Expired exports cleanup completed successfully',
    };
  } catch (error) {
    logger.error('Expired exports cleanup job failed', error);
    throw error;
  }
});

cleanupQueue.process('cleanup-orphaned-files', async (job) => {
  const { dryRun = false } = job.data;
  
  logger.info(`Starting orphaned files cleanup job (dryRun: ${dryRun})`);
  
  try {
    job.progress(10);
    
    const result = await cleanupService.cleanupOrphanedFiles({ dryRun });
    
    job.progress(100);
    
    logger.info(`Orphaned files cleanup completed: ${result.summary}`);
    
    return {
      success: true,
      result,
      message: 'Orphaned files cleanup completed successfully',
    };
  } catch (error) {
    logger.error('Orphaned files cleanup job failed', error);
    throw error;
  }
});

cleanupQueue.process('full-cleanup', async (job) => {
  const { dryRun = false, maxAge = 24, maxSize = 100 * 1024 * 1024 } = job.data;
  
  logger.info(`Starting full storage cleanup job (dryRun: ${dryRun})`);
  
  try {
    job.progress(10);
    
    const result = await cleanupService.runFullCleanup({ 
      dryRun, 
      maxAge, 
      maxSize 
    });
    
    job.progress(100);
    
    logger.info(`Full storage cleanup completed: ${result.summary}`);
    
    return {
      success: true,
      result,
      message: 'Full storage cleanup completed successfully',
    };
  } catch (error) {
    logger.error('Full storage cleanup job failed', error);
    throw error;
  }
});

// Schedule recurring cleanup jobs
export const scheduleCleanupJobs = () => {
  // Clean temp files daily at 2 AM
  cleanupQueue.add(
    'cleanup-temp-files',
    { maxAge: 24, dryRun: false },
    {
      repeat: { cron: '0 2 * * *' }, // Daily at 2 AM
      removeOnComplete: 10,
      removeOnFail: 5,
    }
  );

  // Clean expired exports daily at 3 AM
  cleanupQueue.add(
    'cleanup-expired-exports',
    { dryRun: false },
    {
      repeat: { cron: '0 3 * * *' }, // Daily at 3 AM
      removeOnComplete: 10,
      removeOnFail: 5,
    }
  );

  // Clean orphaned files weekly on Sunday at 4 AM
  cleanupQueue.add(
    'cleanup-orphaned-files',
    { dryRun: false },
    {
      repeat: { cron: '0 4 * * 0' }, // Weekly on Sunday at 4 AM
      removeOnComplete: 5,
      removeOnFail: 3,
    }
  );

  // Full cleanup monthly on the 1st at 5 AM
  cleanupQueue.add(
    'full-cleanup',
    { 
      dryRun: false, 
      maxAge: 24, 
      maxSize: 100 * 1024 * 1024 // 100MB
    },
    {
      repeat: { cron: '0 5 1 * *' }, // Monthly on 1st at 5 AM
      removeOnComplete: 3,
      removeOnFail: 2,
    }
  );

  logger.info('Storage cleanup jobs scheduled');
};

// Manual cleanup functions for API endpoints
export const triggerTempFilesCleanup = async (options: { maxAge?: number; dryRun?: boolean } = {}) => {
  const job = await cleanupQueue.add('cleanup-temp-files', options, {
    removeOnComplete: 10,
    removeOnFail: 5,
  });
  
  return job;
};

export const triggerExpiredExportsCleanup = async (options: { dryRun?: boolean } = {}) => {
  const job = await cleanupQueue.add('cleanup-expired-exports', options, {
    removeOnComplete: 10,
    removeOnFail: 5,
  });
  
  return job;
};

export const triggerOrphanedFilesCleanup = async (options: { dryRun?: boolean } = {}) => {
  const job = await cleanupQueue.add('cleanup-orphaned-files', options, {
    removeOnComplete: 10,
    removeOnFail: 5,
  });
  
  return job;
};

export const triggerFullCleanup = async (options: { 
  dryRun?: boolean; 
  maxAge?: number; 
  maxSize?: number; 
} = {}) => {
  const job = await cleanupQueue.add('full-cleanup', options, {
    removeOnComplete: 5,
    removeOnFail: 3,
  });
  
  return job;
};

// Get cleanup job status
export const getCleanupJobStatus = async (jobId: string) => {
  const job = await cleanupQueue.getJob(jobId);
  
  if (!job) {
    return null;
  }
  
  return {
    id: job.id,
    name: job.name,
    data: job.data,
    progress: job.progress(),
    state: await job.getState(),
    createdAt: new Date(job.timestamp),
    processedOn: job.processedOn ? new Date(job.processedOn) : null,
    finishedOn: job.finishedOn ? new Date(job.finishedOn) : null,
    failedReason: job.failedReason,
    returnvalue: job.returnvalue,
  };
};

// Get storage statistics
export const getStorageStats = async () => {
  return await cleanupService.getStorageStats();
};

// Error handling
cleanupQueue.on('failed', (job, err) => {
  logger.error(`Cleanup job ${job.id} failed:`, err);
});

cleanupQueue.on('completed', (job, result) => {
  logger.info(`Cleanup job ${job.id} completed:`, result);
});

cleanupQueue.on('stalled', (job) => {
  logger.warn(`Cleanup job ${job.id} stalled`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('Shutting down cleanup queue...');
  await cleanupQueue.close();
});

process.on('SIGINT', async () => {
  logger.info('Shutting down cleanup queue...');
  await cleanupQueue.close();
});
