/**
 * Cache Warming API
 * 
 * Pre-populates cache with frequently accessed data
 * Can be called after deployments or on a schedule
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { logger } from '@/lib/services/logger-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Only allow admins to warm cache
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

    const startTime = Date.now();
    const warmedEndpoints: string[] = [];
    const errors: string[] = [];

    // Get base URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // List of endpoints to warm
    const endpoints = [
      '/api/dashboard/stats',
      '/api/blog/posts?page=1&limit=12',
      '/api/health',
    ];

    // Warm each endpoint
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          headers: {
            'Cookie': request.headers.get('cookie') || '',
          },
        });

        if (response.ok) {
          warmedEndpoints.push(endpoint);
          logger.info(`Cache warmed for ${endpoint}`);
        } else {
          errors.push(`${endpoint}: HTTP ${response.status}`);
          logger.warn(`Failed to warm cache for ${endpoint}: ${response.status}`);
        }
      } catch (error) {
        errors.push(`${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        logger.error(`Error warming cache for ${endpoint}`, error as Error);
      }
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      warmed: warmedEndpoints.length,
      total: endpoints.length,
      duration: `${duration}ms`,
      endpoints: warmedEndpoints,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    logger.error('Cache warming error', error as Error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST method to warm cache',
    endpoints: [
      '/api/dashboard/stats',
      '/api/blog/posts',
      '/api/health',
    ],
  });
}

