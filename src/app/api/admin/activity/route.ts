/**
 * Admin Activity API
 * 
 * GET /api/admin/activity - Get recent activity logs
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get recent activities
    const [recentStrategies, recentUsers] = await Promise.all([
      prisma.marketingStrategy.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          createdAt: true,
          generatedBy: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          role: true,
        },
      }),
    ]);

    // Combine and format activities
    const activities = [
      ...recentStrategies.map(s => ({
        id: s.id,
        type: 'strategy_created',
        timestamp: s.createdAt,
        user: s.user,
        details: { generatedBy: s.generatedBy },
      })),
      ...recentUsers.map(u => ({
        id: u.id,
        type: 'user_registered',
        timestamp: u.createdAt,
        user: { id: u.id, name: u.name, email: u.email },
        details: { role: u.role },
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('Admin activity error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
