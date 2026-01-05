import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/services/logger-service';
import { requireCsrfToken } from '@/lib/csrf';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  authorId: z.string(),
  tagIds: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

// POST /api/admin/blog/posts - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate CSRF token
    const csrfToken = request.headers.get('x-csrf-token') || body._csrf;
    const csrfValidation = await requireCsrfToken(csrfToken);

    if (!csrfValidation.valid) {
      logger.warn('CSRF validation failed for blog post creation', { userId: user.id });
      return NextResponse.json(
        { success: false, message: csrfValidation.error || 'CSRF validation failed' },
        { status: 403 }
      );
    }

    const validatedData = blogPostSchema.parse(body);

    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt || '',
        content: validatedData.content,
        featuredImage: validatedData.featuredImage,
        categoryId: validatedData.categoryId,
        status: validatedData.status,
        authorId: validatedData.authorId,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
        seoTitle: validatedData.metaTitle || validatedData.title,
        seoDescription: validatedData.metaDescription || validatedData.excerpt || '',
        tags: validatedData.tagIds && validatedData.tagIds.length > 0
          ? {
            connect: validatedData.tagIds.map(id => ({ id })),
          }
          : undefined,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'CREATE_BLOG_POST',
        entityType: 'BLOG_POST',
        entityId: post.id,
        details: JSON.stringify({ title: post.title, status: post.status }),
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Blog post created successfully',
    });
  } catch (error) {
    logger.error('Create blog post error', error as Error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog/posts - Update blog post
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...data } = body;
    const validatedData = blogPostSchema.parse(data);

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if slug is taken by another post
    if (validatedData.slug !== existingPost.slug) {
      const slugTaken = await prisma.blogPost.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: id },
        },
      });

      if (slugTaken) {
        return NextResponse.json(
          { success: false, message: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt || '',
        content: validatedData.content,
        featuredImage: validatedData.featuredImage,
        categoryId: validatedData.categoryId,
        status: validatedData.status,
        publishedAt: validatedData.status === 'PUBLISHED' && !existingPost.publishedAt
          ? new Date()
          : existingPost.publishedAt,
        seoTitle: validatedData.metaTitle || validatedData.title,
        seoDescription: validatedData.metaDescription || validatedData.excerpt || '',
        tags: validatedData.tagIds
          ? {
            set: validatedData.tagIds.map(id => ({ id })),
          }
          : undefined,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'UPDATE_BLOG_POST',
        entityType: 'BLOG_POST',
        entityId: post.id,
        details: JSON.stringify({ title: post.title, status: post.status }),
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Blog post updated successfully',
    });
  } catch (error) {
    logger.error('Update blog post error', error as Error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/posts - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Delete blog post
    await prisma.blogPost.delete({
      where: { id },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'DELETE_BLOG_POST',
        entityType: 'BLOG_POST',
        entityId: id,
        details: JSON.stringify({}),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    logger.error('Delete blog post error', error as Error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

