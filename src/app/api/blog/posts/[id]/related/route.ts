import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/blog/posts/[id]/related - Get related blog posts
 * Returns posts from the same category or with similar tags
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Get the current post
    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    });

    if (!currentPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Get tags from current post
    const tagIds = currentPost.tags.map((tag: any) => tag.id);
    // 3. Published status
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { id: { not: id } }, // Exclude current post
          { status: 'PUBLISHED' }, // Only published posts
          {
            OR: [
              { categoryId: currentPost.categoryId }, // Same category
              {
                tags: {
                  some: {
                    id: {
                      in: currentPost.tags.map((tag) => tag.id),
                    },
                  },
                },
              }, // Shared tags
            ],
          },
        ],
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
        category: true,
        tags: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 6, // Return up to 6 related posts
    });

    return NextResponse.json({
      success: true,
      data: relatedPosts,
    });
  } catch (error) {
    console.error('Error fetching related posts:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch related posts' },
      { status: 500 }
    );
  }
}

