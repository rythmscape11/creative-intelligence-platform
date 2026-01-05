import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * GET /api/search/autocomplete
 * 
 * Provides autocomplete suggestions for global search
 * Searches across blog posts, strategies, and other content
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Search blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 5,
      orderBy: [
        { publishedAt: 'desc' },
      ],
    });

    // Transform blog posts to search results
    const blogResults = blogPosts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      type: 'blog' as const,
      url: `/blog/${post.slug}`,
      category: post.category?.name,
    }));

    // Combine all results
    const results = [...blogResults];

    // Sort by relevance (title matches first)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const queryLower = query.toLowerCase();

      const aStartsWith = aTitle.startsWith(queryLower);
      const bStartsWith = bTitle.startsWith(queryLower);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      const aIncludes = aTitle.includes(queryLower);
      const bIncludes = bTitle.includes(queryLower);

      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;

      return 0;
    });

    return NextResponse.json({
      results: results.slice(0, 8), // Limit to 8 results
      query,
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch autocomplete results' },
      { status: 500 }
    );
  }
}
