/**
 * Blog Search Data API Route
 * 
 * Returns all published blog posts for client-side fuzzy search.
 * This enables instant search without server round-trips.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        publishedAt: true,
        author: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
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
        publishedAt: 'desc',
      },
      take: 500, // Limit to 500 most recent posts for performance
    });

    return NextResponse.json({
      posts,
      count: posts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching blog search data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

