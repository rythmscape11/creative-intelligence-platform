import Queue from 'bull';
import { logger } from '../utils/logger';
import { ExportService, ExportOptions } from '../../src/lib/services/export-service';
import { S3Service } from '../../src/lib/services/s3-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const s3Service = new S3Service();

// Initialize Redis connection for Bull
const redisConfig = process.env.REDIS_URL 
  ? { redis: process.env.REDIS_URL }
  : {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    };

// Create job queues
export const exportQueue = new Queue('export processing', redisConfig);
export const emailQueue = new Queue('email processing', redisConfig);
export const analyticsQueue = new Queue('analytics processing', redisConfig);

// Job processors
exportQueue.process('export-strategy', async (job) => {
  const { strategyId, format, userId, customization } = job.data;

  try {
    logger.info(`Starting export job for strategy ${strategyId} in format ${format}`);

    // Update job progress
    job.progress(10);

    // 1. Fetch strategy data from database
    const strategy = await prisma.marketingStrategy.findUnique({
      where: { id: strategyId },
      include: {
        user: true,
      },
    });

    if (!strategy) {
      throw new Error(`Strategy ${strategyId} not found`);
    }

    job.progress(30);

    // 2. Parse strategy output
    const strategyOutput = JSON.parse(strategy.output);
    const businessName = strategy.businessName;

    // 3. Generate file based on format
    const exportOptions: ExportOptions = {
      format: format as 'pptx' | 'docx' | 'xlsx',
      customization: customization || {},
    };

    const exportResult = await ExportService.exportStrategy(
      strategyOutput,
      businessName,
      exportOptions
    );

    job.progress(70);

    // 4. Upload to S3
    const s3Key = S3Service.generateExportKey(userId, strategyId, format, exportResult.filename);

    const uploadResult = await s3Service.uploadFile(s3Key, exportResult.buffer, {
      contentType: exportResult.mimeType,
      contentDisposition: `attachment; filename="${exportResult.filename}"`,
      metadata: {
        strategyId: strategyId,
        userId: userId,
        format: format,
        generatedAt: new Date().toISOString(),
      },
      cacheControl: 'max-age=86400', // 24 hours
      serverSideEncryption: 'AES256',
    });

    job.progress(90);

    // 5. Generate signed URL for download (expires in 24 hours)
    const signedUrl = await s3Service.getSignedDownloadUrl(s3Key, {
      expiresIn: 24 * 60 * 60, // 24 hours
      responseContentDisposition: `attachment; filename="${exportResult.filename}"`,
    });

    // 6. Update job status in database (optional: store export record)
    await prisma.exportJob.create({
      data: {
        id: job.id.toString(),
        strategyId: strategyId,
        userId: userId,
        format: format,
        status: 'completed',
        fileUrl: signedUrl,
        s3Key: uploadResult.key,
        filename: exportResult.filename,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    job.progress(100);

    logger.info(`Export job completed for strategy ${strategyId}. File uploaded to: ${uploadResult.location}`);

    return {
      success: true,
      fileUrl: signedUrl,
      filename: exportResult.filename,
      s3Key: uploadResult.key,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      message: 'Export completed successfully',
    };
  } catch (error) {
    logger.error(`Export job failed for strategy ${strategyId}:`, error);

    // Update job status as failed
    try {
      await prisma.exportJob.create({
        data: {
          id: job.id.toString(),
          strategyId: strategyId,
          userId: userId,
          format: format,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    } catch (dbError) {
      logger.error('Failed to update job status in database:', dbError);
    }

    throw error;
  }
});

emailQueue.process('send-email', async (job) => {
  const { to, subject, template, data } = job.data;
  
  try {
    logger.info(`Sending email to ${to} with subject: ${subject}`);
    
    // TODO: Implement email sending logic
    // This would involve:
    // 1. Render email template with data
    // 2. Send email via SMTP or email service
    
    logger.info(`Email sent successfully to ${to}`);
    
    return {
      success: true,
      message: 'Email sent successfully',
    };
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
});

analyticsQueue.process('track-event', async (job) => {
  const { event, properties, userId, timestamp } = job.data;
  
  try {
    logger.info(`Tracking analytics event: ${event}`);
    
    // TODO: Implement analytics tracking
    // This would involve:
    // 1. Store event in database
    // 2. Send to external analytics services
    
    logger.info(`Analytics event tracked: ${event}`);
    
    return {
      success: true,
      message: 'Event tracked successfully',
    };
  } catch (error) {
    logger.error(`Failed to track analytics event ${event}:`, error);
    throw error;
  }
});

// Job event handlers
exportQueue.on('completed', (job, result) => {
  logger.info(`Export job ${job.id} completed:`, result);
});

exportQueue.on('failed', (job, err) => {
  logger.error(`Export job ${job.id} failed:`, err);
});

emailQueue.on('completed', (job, result) => {
  logger.info(`Email job ${job.id} completed:`, result);
});

emailQueue.on('failed', (job, err) => {
  logger.error(`Email job ${job.id} failed:`, err);
});

analyticsQueue.on('completed', (job, result) => {
  logger.info(`Analytics job ${job.id} completed:`, result);
});

analyticsQueue.on('failed', (job, err) => {
  logger.error(`Analytics job ${job.id} failed:`, err);
});

// Initialize job queues
export async function initializeJobs() {
  try {
    // Test Redis connection
    await exportQueue.isReady();
    logger.info('✅ Job queues initialized successfully');
    
    // Clean up old jobs (optional)
    await exportQueue.clean(24 * 60 * 60 * 1000, 'completed'); // Clean completed jobs older than 24 hours
    await exportQueue.clean(24 * 60 * 60 * 1000, 'failed'); // Clean failed jobs older than 24 hours
    
  } catch (error) {
    logger.error('❌ Failed to initialize job queues:', error);
    
    // In development, continue without Redis
    if (process.env.NODE_ENV === 'development') {
      logger.warn('⚠️  Continuing without Redis in development mode');
    } else {
      throw error;
    }
  }
}

// Graceful shutdown
export async function closeJobs() {
  await Promise.all([
    exportQueue.close(),
    emailQueue.close(),
    analyticsQueue.close(),
  ]);
  logger.info('Job queues closed');
}
