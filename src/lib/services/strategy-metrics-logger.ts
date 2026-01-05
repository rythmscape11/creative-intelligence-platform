import { prisma } from '@/lib/prisma';

/**
 * Strategy Generation Metrics Logger
 * Tracks comprehensive metrics for strategy generation including timing, errors, and success rates
 */

export interface StrategyMetricsInput {
  strategyId?: string;
  userId?: string;
  strategyType: 'FREE' | 'ENHANCED' | 'BASIC';
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  generatedBy?: 'AI' | 'FALLBACK';
  
  // Timing metrics (in milliseconds)
  startTime: Date;
  endTime?: Date;
  durationMs?: number;
  validationMs?: number;
  generationMs?: number;
  dbSaveMs?: number;
  
  // Error tracking
  errorType?: 'VALIDATION_ERROR' | 'GENERATION_ERROR' | 'DB_ERROR' | 'TIMEOUT_ERROR' | 'UNKNOWN_ERROR';
  errorMessage?: string;
  errorStack?: string;
  
  // Request metadata
  ipAddress?: string;
  userAgent?: string;
  
  // Input metadata (for analysis)
  industry?: string;
  budget?: number;
  timeframe?: string;
  objectives?: string[];
}

export class StrategyMetricsLogger {
  /**
   * Log a strategy generation attempt
   */
  static async log(metrics: StrategyMetricsInput): Promise<void> {
    try {
      await prisma.strategyGenerationMetric.create({
        data: {
          strategyId: metrics.strategyId,
          userId: metrics.userId,
          strategyType: metrics.strategyType,
          status: metrics.status,
          generatedBy: metrics.generatedBy,
          
          startTime: metrics.startTime,
          endTime: metrics.endTime,
          durationMs: metrics.durationMs,
          validationMs: metrics.validationMs,
          generationMs: metrics.generationMs,
          dbSaveMs: metrics.dbSaveMs,
          
          errorType: metrics.errorType,
          errorMessage: metrics.errorMessage,
          errorStack: metrics.errorStack,
          
          ipAddress: metrics.ipAddress,
          userAgent: metrics.userAgent,
          
          industry: metrics.industry,
          budget: metrics.budget,
          timeframe: metrics.timeframe,
          objectives: metrics.objectives ? JSON.stringify(metrics.objectives) : null,
        },
      });
    } catch (error) {
      // Don't throw errors from logging - just log to console
      console.error('Failed to log strategy metrics:', error);
    }
  }

  /**
   * Get success rate for a specific strategy type
   */
  static async getSuccessRate(
    strategyType?: 'FREE' | 'ENHANCED' | 'BASIC',
    startDate?: Date,
    endDate?: Date
  ): Promise<{ total: number; successful: number; failed: number; successRate: number }> {
    const where: any = {};
    
    if (strategyType) {
      where.strategyType = strategyType;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [total, successful, failed] = await Promise.all([
      prisma.strategyGenerationMetric.count({ where }),
      prisma.strategyGenerationMetric.count({ where: { ...where, status: 'SUCCESS' } }),
      prisma.strategyGenerationMetric.count({ where: { ...where, status: 'FAILED' } }),
    ]);

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
    };
  }

  /**
   * Get average generation time
   */
  static async getAverageGenerationTime(
    strategyType?: 'FREE' | 'ENHANCED' | 'BASIC',
    startDate?: Date,
    endDate?: Date
  ): Promise<{ avgMs: number; minMs: number; maxMs: number }> {
    const where: any = {
      status: 'SUCCESS',
      durationMs: { not: null },
    };
    
    if (strategyType) {
      where.strategyType = strategyType;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const metrics = await prisma.strategyGenerationMetric.findMany({
      where,
      select: { durationMs: true },
    });

    if (metrics.length === 0) {
      return { avgMs: 0, minMs: 0, maxMs: 0 };
    }

    const durations = metrics.map(m => m.durationMs!);
    const avgMs = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minMs = Math.min(...durations);
    const maxMs = Math.max(...durations);

    return { avgMs, minMs, maxMs };
  }

  /**
   * Get error breakdown
   */
  static async getErrorBreakdown(
    strategyType?: 'FREE' | 'ENHANCED' | 'BASIC',
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{ errorType: string; count: number }>> {
    const where: any = {
      status: 'FAILED',
      errorType: { not: null },
    };
    
    if (strategyType) {
      where.strategyType = strategyType;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const errors = await prisma.strategyGenerationMetric.groupBy({
      by: ['errorType'],
      where,
      _count: { errorType: true },
    });

    return errors.map(e => ({
      errorType: e.errorType!,
      count: e._count.errorType,
    }));
  }

  /**
   * Get generation metrics by time period
   */
  static async getMetricsByTimePeriod(
    period: 'hour' | 'day' | 'week' | 'month',
    strategyType?: 'FREE' | 'ENHANCED' | 'BASIC'
  ): Promise<Array<{ period: string; total: number; successful: number; failed: number }>> {
    // This would require raw SQL for proper time bucketing
    // For now, return a simplified version
    const where: any = {};
    if (strategyType) {
      where.strategyType = strategyType;
    }

    const metrics = await prisma.strategyGenerationMetric.findMany({
      where,
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to last 100 records
    });

    // Group by date
    const grouped = new Map<string, { total: number; successful: number; failed: number }>();
    
    metrics.forEach(m => {
      const date = m.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      const existing = grouped.get(date) || { total: 0, successful: 0, failed: 0 };
      
      existing.total++;
      if (m.status === 'SUCCESS') existing.successful++;
      if (m.status === 'FAILED') existing.failed++;
      
      grouped.set(date, existing);
    });

    return Array.from(grouped.entries()).map(([period, stats]) => ({
      period,
      ...stats,
    }));
  }

  /**
   * Get user journey drop-off analysis
   */
  static async getUserJourneyDropOff(
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    validationErrors: number;
    generationErrors: number;
    dbErrors: number;
    timeoutErrors: number;
    unknownErrors: number;
  }> {
    const where: any = { status: 'FAILED' };
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [validationErrors, generationErrors, dbErrors, timeoutErrors, unknownErrors] = await Promise.all([
      prisma.strategyGenerationMetric.count({ where: { ...where, errorType: 'VALIDATION_ERROR' } }),
      prisma.strategyGenerationMetric.count({ where: { ...where, errorType: 'GENERATION_ERROR' } }),
      prisma.strategyGenerationMetric.count({ where: { ...where, errorType: 'DB_ERROR' } }),
      prisma.strategyGenerationMetric.count({ where: { ...where, errorType: 'TIMEOUT_ERROR' } }),
      prisma.strategyGenerationMetric.count({ where: { ...where, errorType: 'UNKNOWN_ERROR' } }),
    ]);

    return {
      validationErrors,
      generationErrors,
      dbErrors,
      timeoutErrors,
      unknownErrors,
    };
  }

  /**
   * Get AI vs Fallback usage
   */
  static async getAIvsFallbackUsage(
    startDate?: Date,
    endDate?: Date
  ): Promise<{ ai: number; fallback: number; aiPercentage: number }> {
    const where: any = { status: 'SUCCESS' };
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [ai, fallback] = await Promise.all([
      prisma.strategyGenerationMetric.count({ where: { ...where, generatedBy: 'AI' } }),
      prisma.strategyGenerationMetric.count({ where: { ...where, generatedBy: 'FALLBACK' } }),
    ]);

    const total = ai + fallback;
    const aiPercentage = total > 0 ? (ai / total) * 100 : 0;

    return { ai, fallback, aiPercentage };
  }
}

