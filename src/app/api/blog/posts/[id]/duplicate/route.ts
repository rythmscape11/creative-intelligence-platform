import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/dtos/blog.dto';
import { logger } from '@/lib/services/logger-service';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/blog/posts/[id]/duplicate - Duplicate a blog post
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
        { message: 'Unauthorized' },
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
        { message: 'Forbidden - Editor or Admin access required' },
        { status: 403 }
      );
    }

    // Get existing post with tags
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        tags: {
          select: { id: true },
        },
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Create duplicate
    const duplicatePost = await prisma.blogPost.create({
      data: {
        title: `${existingPost.title} (Copy)`,
        slug: `${existingPost.slug}-copy-${Date.now()}`,
        content: existingPost.content,
        excerpt: existingPost.excerpt,
        featuredImage: existingPost.featuredImage,
        authorId: userId, // New post belongs to current user
        categoryId: existingPost.categoryId,
        status: 'DRAFT',
        tags: {
          connect: existingPost.tags.map(tag => ({ id: tag.id })),
        },
      },
    });

    logger.info('Blog post duplicated', {
      originalPostId: id,
      duplicatePostId: duplicatePost.id,
      userId: userId
    });

    return NextResponse.json({
      success: true,
      data: duplicatePost,
      message: 'Blog post duplicated successfully',
    }, { status: 201 });
  } catch (error) {
    logger.error('Error duplicating blog post', error as Error, { postId: id });

    return NextResponse.json(
      { success: false, error: 'Failed to duplicate blog post' },
      { status: 500 }
    );
  }
}
