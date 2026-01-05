import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { StrategyMetricsLogger } from '@/lib/services/strategy-metrics-logger';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * GET /api/admin/strategy-metrics
 * Get comprehensive strategy generation metrics
 * Admin only
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const strategyType = searchParams.get('strategyType') as 'FREE' | 'ENHANCED' | 'BASIC' | null;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
    const period = searchParams.get('period') as 'hour' | 'day' | 'week' | 'month' || 'day';

    // Get all metrics in parallel
    const [
      successRate,
      avgGenerationTime,
      errorBreakdown,
      metricsByTimePeriod,
      userJourneyDropOff,
      aiVsFallback,
    ] = await Promise.all([
      StrategyMetricsLogger.getSuccessRate(strategyType || undefined, startDate, endDate),
      StrategyMetricsLogger.getAverageGenerationTime(strategyType || undefined, startDate, endDate),
      StrategyMetricsLogger.getErrorBreakdown(strategyType || undefined, startDate, endDate),
      StrategyMetricsLogger.getMetricsByTimePeriod(period, strategyType || undefined),
      StrategyMetricsLogger.getUserJourneyDropOff(startDate, endDate),
      StrategyMetricsLogger.getAIvsFallbackUsage(startDate, endDate),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        successRate,
        avgGenerationTime,
        errorBreakdown,
        metricsByTimePeriod,
        userJourneyDropOff,
        aiVsFallback,
        filters: {
          strategyType: strategyType || 'ALL',
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          period,
        },
      },
    });
  } catch (error) {
    console.error('Strategy metrics API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch strategy metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
