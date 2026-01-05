/**
 * Admin Stats API
 * 
 * GET /api/admin/stats - Get admin dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get statistics
    const [
      totalUsers,
      totalStrategies,
      totalBlogPosts,
      activeUsers,
      recentStrategies,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.marketingStrategy.count(),
      prisma.blogPost.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      prisma.marketingStrategy.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
        },
        strategies: {
          total: totalStrategies,
          recent: recentStrategies,
        },
        content: {
          blogPosts: totalBlogPosts,
          templates: 0, // Templates not implemented yet
        },
      },
    });
  } catch (error) {
    logger.error('Admin stats error', error as Error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
