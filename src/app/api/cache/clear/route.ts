/**
 * Cache Clear API
 * 
 * Clears cache for specific patterns or all cache
 * Admin-only endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clearCache, deleteCachedPattern, getCacheStats } from '@/lib/cache';
import { logger } from '@/lib/services/logger-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Only allow admins to clear cache
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { pattern } = body;

    const startTime = Date.now();

    if (pattern) {
      // Clear specific pattern
      await deleteCachedPattern(pattern);
      logger.info(`Cache cleared for pattern: ${pattern}`, { userId: userId });

      return NextResponse.json({
        success: true,
        message: `Cache cleared for pattern: ${pattern}`,
        duration: `${Date.now() - startTime}ms`,
      });
    } else {
      // Clear all cache
      await clearCache();
      logger.info('All cache cleared', { userId: userId });

      return NextResponse.json({
        success: true,
        message: 'All cache cleared',
        duration: `${Date.now() - startTime}ms`,
      });
    }
  } catch (error) {
    logger.error('Cache clear error', error as Error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Only allow admins to view cache stats
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const stats = await getCacheStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error('Cache stats error', error as Error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

