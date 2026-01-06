import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { bulkBlogPostActionSchema } from '@/dtos/blog.dto';
import { logger } from '@/lib/services/logger-service';
import { z } from 'zod';

/**
 * POST /api/blog/posts/bulk - Perform bulk actions on blog posts
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

    // Parse and validate request body
    const body = await request.json();
    const { postIds, action, categoryId } = bulkBlogPostActionSchema.parse(body);

    // Validate categoryId for changeCategory action
    if (action === 'changeCategory' && !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required for changeCategory action' },
        { status: 400 }
      );
    }

    // For editors, verify they own all posts (except for admins)
    if (user.role === 'EDITOR') {
      const posts = await prisma.blogPost.findMany({
        where: { id: { in: postIds } },
        select: { id: true, authorId: true },
      });

      const unauthorizedPosts = posts.filter(post => post.authorId !== userId);

      if (unauthorizedPosts.length > 0) {
        return NextResponse.json(
          { success: false, error: 'You can only perform bulk actions on your own posts' },
          { status: 403 }
        );
      }
    }

    let result;
    let message = '';

    switch (action) {
      case 'publish':
        result = await prisma.blogPost.updateMany({
          where: { id: { in: postIds } },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
          },
        });
        message = `${result.count} post(s) published successfully`;
        break;

      case 'archive':
        result = await prisma.blogPost.updateMany({
          where: { id: { in: postIds } },
          data: {
            status: 'ARCHIVED',
          },
        });
        message = `${result.count} post(s) archived successfully`;
        break;

      case 'delete':
        // Only admins can delete
        if (user.role !== 'ADMIN') {
          return NextResponse.json(
            { success: false, error: 'Only admins can delete posts' },
            { status: 403 }
          );
        }

        result = await prisma.blogPost.deleteMany({
          where: { id: { in: postIds } },
        });
        message = `${result.count} post(s) deleted successfully`;
        break;

      case 'changeCategory':
        // Verify category exists
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          return NextResponse.json(
            { success: false, error: 'Category not found' },
            { status: 404 }
          );
        }

        result = await prisma.blogPost.updateMany({
          where: { id: { in: postIds } },
          data: {
            categoryId: categoryId!,
          },
        });
        message = `${result.count} post(s) moved to category "${category.name}"`;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    logger.info('Bulk action performed on blog posts', {
      action,
      postIds,
      count: result.count,
      userId: userId,
    });

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message,
    });
  } catch (error) {
    logger.error('Error performing bulk action on blog posts', error as Error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}

