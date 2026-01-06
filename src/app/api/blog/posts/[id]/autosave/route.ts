import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { autoSaveDraftSchema } from '@/dtos/blog.dto';
import { logger } from '@/lib/services/logger-service';
import { z } from 'zod';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * PATCH /api/blog/posts/[id]/autosave - Auto-save draft changes
 */
export async function PUT(
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
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Blog post not found' },
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

    // Validate body (partial validation since it's autosave)
    // We don't use the full schema because autosave might have incomplete data
    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.excerpt) updateData.excerpt = body.excerpt;
    if (body.featuredImage) updateData.featuredImage = body.featuredImage;
    if (body.categoryId) updateData.categoryId = body.categoryId;

    // Always update updated_at
    updateData.updatedAt = new Date();

    // Update blog post (only update provided fields)
    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Draft auto-saved',
    });
  } catch (error) {
    logger.error('Error auto-saving blog post', error as Error, { postId: id });

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
