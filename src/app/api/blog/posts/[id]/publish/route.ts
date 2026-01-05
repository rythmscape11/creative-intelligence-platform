import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { publishBlogPostSchema } from '@/lib/validations/blog';
import { logger } from '@/lib/services/logger-service';
import { z } from 'zod';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/blog/posts/[id]/publish - Publish a draft blog post
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string | undefined;
  try {
    const { userId } = await auth();
    const paramsData = await params;
    id = paramsData.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
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

    // Get existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, authorId: true, status: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (existingPost.authorId !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { publishedAt } = body;

    // Update post status to PUBLISHED
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: publishedAt || new Date(),
      },
    });

    // Log activity
    logger.info('Blog post published', {
      userId,
      postId: post.id,
      title: post.title
    });

    return NextResponse.json({
      data: post,
      message: 'Blog post published successfully',
    });
  } catch (error) {
    logger.error('Error publishing blog post', error as Error, { postId: id });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
