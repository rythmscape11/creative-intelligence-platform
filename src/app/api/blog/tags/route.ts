import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger-service';
import { z } from 'zod';

const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug must be 50 characters or less')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
});

/**
 * GET /api/blog/tags - List all tags
 */
export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            blogPosts: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    logger.error('Error fetching tags', error as Error);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/tags - Create a new tag
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has editor or admin role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Editor or Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createTagSchema.parse(body);

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag with this slug already exists' },
        { status: 400 }
      );
    }

    // Create tag
    const tag = await prisma.tag.create({
      data: validatedData,
    });

    logger.info('Tag created', { tagId: tag.id, userId: userId });

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag created successfully',
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating tag', error as Error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

