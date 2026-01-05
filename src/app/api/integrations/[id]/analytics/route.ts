import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is ADMIN
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const integrationId = id;
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Verify integration exists
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId },
    });

    if (!integration) {
      return NextResponse.json(
        { success: false, error: 'Integration not found' },
        { status: 404 }
      );
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all logs for the date range
    const logs = await prisma.integrationLog.findMany({
      where: {
        integrationId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate metrics
    const totalSyncs = logs.filter(log => log.type === 'SYNC').length;
    const successfulSyncs = logs.filter(log => log.type === 'SYNC' && log.status === 'SUCCESS').length;
    const failedSyncs = logs.filter(log => log.type === 'SYNC' && log.status === 'FAILED').length;
    const totalContactsSynced = logs
      .filter(log => log.type === 'SYNC' && log.status === 'SUCCESS')
      .reduce((sum, log) => sum + (log.recordsProcessed || 0), 0);
    const successRate = totalSyncs > 0 ? (successfulSyncs / totalSyncs) * 100 : 0;

    // Group by date for activity chart
    const activityByDate: { [key: string]: number } = {};

    // Initialize all dates in range with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      activityByDate[dateKey] = 0;
    }

    // Count syncs per date
    logs.forEach(log => {
      if (log.type === 'SYNC') {
        const dateKey = new Date(log.createdAt).toISOString().split('T')[0];
        if (activityByDate[dateKey] !== undefined) {
          activityByDate[dateKey]++;
        }
      }
    });

    // Convert to array and sort by date
    const last7Days = Object.entries(activityByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get recent logs (last 50)
    const recentLogs = logs.slice(0, 50).map(log => ({
      id: log.id,
      type: log.type,
      status: log.status,
      action: log.action,
      recordsProcessed: log.recordsProcessed,
      errorMessage: log.errorMessage,
      createdAt: log.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      analytics: {
        totalSyncs,
        successfulSyncs,
        failedSyncs,
        totalContactsSynced,
        successRate,
        last7Days,
        recentLogs,
      },
    });
  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
