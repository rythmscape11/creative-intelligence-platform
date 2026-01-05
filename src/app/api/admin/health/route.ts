/**
 * Admin System Health API
 * 
 * GET /api/admin/health - Get system health status
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const startTime = Date.now();

    // Check database connection
    let databaseStatus = 'healthy';
    let databaseLatency = 0;
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      databaseLatency = Date.now() - dbStart;
    } catch (error) {
      databaseStatus = 'unhealthy';
    }

    // Get database stats
    const [userCount, strategyCount, blogPostCount, activityCount] = await Promise.all([
      prisma.user.count(),
      prisma.marketingStrategy.count(),
      prisma.blogPost.count(),
      prisma.userActivity.count(),
    ]);

    // Get recent activity (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentActivity = await prisma.userActivity.count({
      where: {
        timestamp: {
          gte: last24Hours,
        },
      },
    });

    // Memory usage
    const memoryUsage = process.memoryUsage();

    // System uptime
    const uptime = process.uptime();

    const totalLatency = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        status: databaseStatus === 'healthy' ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: {
          seconds: uptime,
          formatted: formatUptime(uptime),
        },
        database: {
          status: databaseStatus,
          latency: databaseLatency,
          stats: {
            users: userCount,
            strategies: strategyCount,
            blogPosts: blogPostCount,
            activities: activityCount,
          },
        },
        activity: {
          last24Hours: recentActivity,
        },
        memory: {
          rss: formatBytes(memoryUsage.rss),
          heapTotal: formatBytes(memoryUsage.heapTotal),
          heapUsed: formatBytes(memoryUsage.heapUsed),
          external: formatBytes(memoryUsage.external),
        },
        performance: {
          totalLatency,
        },
        environment: {
          nodeVersion: process.version,
          platform: process.platform,
          env: process.env.NODE_ENV,
        },
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        success: false,
        data: {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
