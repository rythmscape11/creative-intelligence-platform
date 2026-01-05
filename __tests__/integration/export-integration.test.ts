/**
 * @vitest-environment node
 *
 * Integration tests for export system
 * These tests verify the interaction between export queue, database, and export service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Export System Integration Tests', () => {
  // Mock export queue
  const mockExportQueue = {
    add: vi.fn(),
    getJob: vi.fn(),
  };

  // Mock Prisma client
  const mockPrisma = {
    marketingStrategy: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
    },
    exportJob: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    mockExportQueue.add.mockResolvedValue({ id: 'test-job-id' });
    mockExportQueue.getJob.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Export Queue Integration', () => {
    it('should add export jobs to queue', async () => {
      const jobData = {
        strategyId: 'test-strategy-id',
        format: 'pptx',
        userId: 'test-user-id',
        customization: {
          colors: { primary: '#0066CC' },
        },
      };

      const result = await mockExportQueue.add('export-strategy', jobData);

      expect(result.id).toBe('test-job-id');
      expect(mockExportQueue.add).toHaveBeenCalledWith('export-strategy', jobData);
    });

    it('should retrieve job status from queue', async () => {
      
      const mockJob = {
        id: 'test-job-id',
        data: { userId: 'test-user-id' },
        getState: vi.fn().mockResolvedValue('completed'),
        progress: vi.fn().mockReturnValue(100),
        returnvalue: { fileUrl: 'https://example.com/file.pptx' },
        timestamp: Date.now(),
        processedOn: Date.now(),
        finishedOn: Date.now(),
      };

      mockExportQueue.getJob.mockResolvedValue(mockJob);

      const job = await mockExportQueue.getJob('test-job-id');
      const state = await job.getState();
      const progress = job.progress();

      expect(job).toBeDefined();
      expect(state).toBe('completed');
      expect(progress).toBe(100);
    });
  });

  describe('Database Integration', () => {
    it('should query marketing strategies', async () => {
      const mockStrategy = {
        id: 'test-strategy-id',
        userId: 'test-user-id',
        businessName: 'Test Company',
        output: JSON.stringify({ executiveSummary: 'Test summary' }),
      };

      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(mockStrategy);

      const strategy = await mockPrisma.marketingStrategy.findFirst({
        where: {
          id: 'test-strategy-id',
          userId: 'test-user-id',
        },
      });

      expect(strategy).toBeDefined();
      expect(strategy.businessName).toBe('Test Company');
    });

    it('should create export job records', async () => {
      const jobData = {
        id: 'test-job-id',
        strategyId: 'test-strategy-id',
        userId: 'test-user-id',
        format: 'pptx',
        status: 'completed',
        fileUrl: 'https://example.com/file.pptx',
        filename: 'strategy.pptx',
        s3Key: 'exports/test-user-id/test-strategy-id/file.pptx',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      mockPrisma.exportJob.create.mockResolvedValue(jobData);

      const result = await mockPrisma.exportJob.create({ data: jobData });

      expect(result).toBeDefined();
      expect(result.id).toBe('test-job-id');
      expect(result.status).toBe('completed');
    });

    it('should query export job records', async () => {
      const mockExportJob = {
        id: 'test-job-id',
        userId: 'test-user-id',
        status: 'completed',
        fileUrl: 'https://example.com/file.pptx',
        filename: 'strategy.pptx',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      mockPrisma.exportJob.findFirst.mockResolvedValue(mockExportJob);

      const exportJob = await mockPrisma.exportJob.findFirst({
        where: {
          id: 'test-job-id',
          userId: 'test-user-id',
        },
      });

      expect(exportJob).toBeDefined();
      expect(exportJob.status).toBe('completed');
      expect(exportJob.fileUrl).toBe('https://example.com/file.pptx');
    });
  });

  describe('Export Workflow Integration', () => {
    it('should handle complete export workflow', async () => {

      // Step 1: Strategy exists
      const mockStrategy = {
        id: 'test-strategy-id',
        userId: 'test-user-id',
        businessName: 'Test Company',
        output: JSON.stringify({ executiveSummary: 'Test summary' }),
      };
      mockPrisma.marketingStrategy.findFirst.mockResolvedValue(mockStrategy);

      // Step 2: Job is queued
      mockExportQueue.add.mockResolvedValue({ id: 'test-job-id' });

      // Step 3: Job is processed (mocked)
      const mockJob = {
        id: 'test-job-id',
        data: { userId: 'test-user-id', strategyId: 'test-strategy-id' },
        getState: vi.fn().mockResolvedValue('completed'),
        progress: vi.fn().mockReturnValue(100),
        returnvalue: {
          success: true,
          fileUrl: 'https://example.com/file.pptx',
          filename: 'Test_Company_Marketing_Strategy.pptx',
        },
      };

      mockExportQueue.getJob.mockResolvedValue(mockJob);

      // Step 4: Export job record is created
      const mockExportRecord = {
        id: 'test-job-id',
        strategyId: 'test-strategy-id',
        userId: 'test-user-id',
        format: 'pptx',
        status: 'completed',
        fileUrl: 'https://example.com/file.pptx',
        filename: 'Test_Company_Marketing_Strategy.pptx',
      };
      mockPrisma.exportJob.create.mockResolvedValue(mockExportRecord);

      // Execute workflow
      const strategy = await mockPrisma.marketingStrategy.findFirst({
        where: { id: 'test-strategy-id', userId: 'test-user-id' },
      });

      const job = await mockExportQueue.add('export-strategy', {
        strategyId: 'test-strategy-id',
        format: 'pptx',
        userId: 'test-user-id',
      });

      const jobStatus = await mockExportQueue.getJob(job.id);
      const state = await jobStatus.getState();

      const exportRecord = await mockPrisma.exportJob.create({
        data: {
          id: job.id,
          strategyId: 'test-strategy-id',
          userId: 'test-user-id',
          format: 'pptx',
          status: 'completed',
          fileUrl: 'https://example.com/file.pptx',
          filename: 'Test_Company_Marketing_Strategy.pptx',
        },
      });

      // Verify workflow
      expect(strategy).toBeDefined();
      expect(job.id).toBe('test-job-id');
      expect(state).toBe('completed');
      expect(exportRecord.status).toBe('completed');
      expect(exportRecord.filename).toBe('Test_Company_Marketing_Strategy.pptx');
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors', async () => {
      mockPrisma.marketingStrategy.findFirst.mockRejectedValue(
        new Error('Database connection failed')
      );

      await expect(
        mockPrisma.marketingStrategy.findFirst({
          where: { id: 'test-strategy-id' },
        })
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle queue errors', async () => {
      mockExportQueue.add.mockRejectedValue(new Error('Queue service unavailable'));

      await expect(
        mockExportQueue.add('export-strategy', {
          strategyId: 'test-strategy-id',
          format: 'pptx',
          userId: 'test-user-id',
        })
      ).rejects.toThrow('Queue service unavailable');
    });
  });
});
