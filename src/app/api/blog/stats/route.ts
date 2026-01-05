import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * GET /api/blog/stats - Get blog statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get counts for each status
    const [total, published, draft, scheduled, archived] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.blogPost.count({ where: { status: 'SCHEDULED' } }),
      prisma.blogPost.count({ where: { status: 'ARCHIVED' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        published,
        draft,
        scheduled,
        archived,
      },
    });
  } catch (error) {
    logger.error('Error fetching blog stats', error as Error);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog stats' },
      { status: 500 }
    );
  }
}
