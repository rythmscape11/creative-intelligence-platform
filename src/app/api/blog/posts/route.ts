import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
  createBlogPostSchema,
  blogPostQuerySchema,
  generateSlug,
  validateSlugUniqueness
} from '@/lib/validations/blog';
import { logger } from '@/lib/services/logger-service';
import { z } from 'zod';

/**
 * GET /api/blog/posts - List all blog posts with filtering and pagination
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const {
      page,
      limit,
      status,
      categoryId,
      authorId,
      search,
      sortBy,
      sortOrder,
      startDate,
      endDate,
    } = blogPostQuerySchema.parse(queryParams);

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get total count
    const total = await prisma.blogPost.count({ where });

    // Get paginated posts
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching blog posts', error as Error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog/posts - Create a new blog post
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
    const validatedData = createBlogPostSchema.parse(body);

    // Validate slug uniqueness
    const isSlugUnique = await validateSlugUniqueness(validatedData.slug, prisma);
    if (!isSlugUnique) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists. Please choose a different slug.' },
        { status: 400 }
      );
    }

    // Extract tagIds for separate handling
    const { tagIds, publishedAt, ...postData } = validatedData;

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        authorId: userId,
        publishedAt: publishedAt || (validatedData.status === 'PUBLISHED' ? new Date() : null),
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    logger.info('Blog post created', { postId: post.id, userId: userId });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Blog post created successfully',
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating blog post', error as Error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

