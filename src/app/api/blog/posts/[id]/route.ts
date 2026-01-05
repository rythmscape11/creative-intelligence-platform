import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { updateBlogPostSchema, validateSlugUniqueness } from '@/lib/validations/blog';
import { logger } from '@/lib/services/logger-service';
import { z } from 'zod';

/**
 * GET /api/blog/posts/[id] - Get a single blog post by ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
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

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    // We can't easily get the ID here if params parsing failed, but we can try
    let postId = 'unknown';
    try { postId = (await params).id; } catch (e) { }

    logger.error('Error fetching blog post', error as Error, { postId });

    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/blog/posts/[id] - Update a blog post
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

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
      select: { id: true, authorId: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Check permissions: Editors can only edit their own posts, Admins can edit any
    if (user.role === 'EDITOR' && existingPost.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - You can only edit your own posts' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateBlogPostSchema.parse(body);

    // Validate slug uniqueness if slug is being updated
    if (validatedData.slug) {
      const isSlugUnique = await validateSlugUniqueness(
        validatedData.slug,
        prisma,
        id
      );
      if (!isSlugUnique) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists. Please choose a different slug.' },
          { status: 400 }
        );
      }
    }

    // Extract tagIds for separate handling
    const { tagIds, publishedAt, ...postData } = validatedData;

    // Build update data
    const updateData: Record<string, unknown> = { ...postData };

    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt;
    }

    if (tagIds) {
      updateData.tags = {
        set: [], // Clear existing tags
        connect: tagIds.map((tagId) => ({ id: tagId })),
      };
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
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

    logger.info('Blog post updated', { postId: post.id, userId: userId });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    let postId = 'unknown';
    try { postId = (await params).id; } catch (e) { }

    logger.error('Error updating blog post', error as Error, { postId });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/posts/[id] - Delete a blog post
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();

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
        { success: false, error: 'Forbidden - Admin or Editor access required' },
        { status: 403 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, title: true, authorId: true },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (user.role === 'EDITOR' && existingPost.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - You can only delete your own posts' },
        { status: 403 }
      );
    }

    // Delete blog post
    await prisma.blogPost.delete({
      where: { id },
    });

    logger.info('Blog post deleted', {
      postId: id,
      postTitle: existingPost.title,
      userId: userId
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    let postId = 'unknown';
    try { postId = (await params).id; } catch (e) { }

    logger.error('Error deleting blog post', error as Error, { postId });

    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
