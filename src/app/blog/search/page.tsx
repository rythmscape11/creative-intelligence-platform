import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { SearchBar } from '@/components/blog/search-bar';
import { SearchFilters } from '@/components/search/search-filters';
import { Pagination } from '@/components/ui/pagination';
import { UserIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

const POSTS_PER_PAGE = 12;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    category?: string;
    tag?: string;
    date?: string;
    sort?: string;
  }>;
}

async function searchBlogPosts(
  query: string,
  page: number = 1,
  filters: {
    category?: string;
    tag?: string;
    date?: string;
    sort?: string;
  } = {}
) {
  const skip = (page - 1) * POSTS_PER_PAGE;

  // Build where clause
  const where: Prisma.BlogPostWhereInput = {
    status: 'PUBLISHED',
  };

  // Add search query
  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
      { seoTitle: { contains: query, mode: 'insensitive' } },
      { seoDescription: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Add category filter
  if (filters.category) {
    where.category = {
      slug: filters.category,
    };
  }

  // Add tag filter
  if (filters.tag) {
    where.tags = {
      some: {
        slug: filters.tag,
      },
    };
  }

  // Add date filter
  if (filters.date) {
    const now = new Date();
    let startDate: Date;

    switch (filters.date) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    where.publishedAt = {
      gte: startDate,
    };
  }

  // Determine sort order
  let orderBy: Prisma.BlogPostOrderByWithRelationInput = { publishedAt: 'desc' };

  if (filters.sort) {
    switch (filters.sort) {
      case 'date-desc':
        orderBy = { publishedAt: 'desc' };
        break;
      case 'date-asc':
        orderBy = { publishedAt: 'asc' };
        break;
      case 'title-asc':
        orderBy = { title: 'asc' };
        break;
      case 'title-desc':
        orderBy = { title: 'desc' };
        break;
      default:
        orderBy = { publishedAt: 'desc' };
    }
  }

  const [posts, totalCount] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: true,
        tags: true,
      },
      orderBy,
      skip,
      take: POSTS_PER_PAGE,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    totalCount,
    totalPages: Math.ceil(totalCount / POSTS_PER_PAGE),
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';

  return {
    title: `Search Results for "${query}" | Aureon One Blog`,
    description: `Search results for "${query}" in our marketing insights blog.`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const filters = {
    category: resolvedSearchParams.category,
    tag: resolvedSearchParams.tag,
    date: resolvedSearchParams.date,
    sort: resolvedSearchParams.sort,
  };

  // Fetch categories and tags for filters
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
    prisma.tag.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
      take: 50, // Limit to top 50 tags
    }),
  ]);

  if (!query) {
    return (
      <>
        <main id="main-content" className="min-h-screen bg-gray-50 py-12">
          <div className="container">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Search Blog Posts
            </h1>
            <SearchBar />
            <p className="text-center text-gray-600 mt-8">
              Enter a search term to find relevant articles
            </p>
          </div>
        </main>
      </>
    );
  }

  const { posts, totalCount, totalPages } = await searchBlogPosts(query, currentPage, filters);

  return (
    <>
      <main id="main-content" className="min-h-screen bg-[#fafafa] py-12">
        {/* Breadcrumbs */}
        <div className="max-w-[720px] mx-auto px-4 mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#1a1a1a] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#1a1a1a] font-medium">Search Results</span>
          </nav>
        </div>

        <div className="max-w-[720px] mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4 font-sans">
            Search Results
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-serif" style={{ fontSize: '18px', lineHeight: '1.7' }}>
            Found {totalCount} {totalCount === 1 ? 'result' : 'results'} for &quot;{query}&quot;
          </p>

          <SearchBar />

          {/* Search Filters */}
          <SearchFilters categories={categories} tags={tags} />

          {totalCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-[#1a1a1a] mb-4 font-serif" style={{ fontSize: '20px', lineHeight: '1.7' }}>
                No results found for &quot;{query}&quot;
              </p>
              <p className="text-gray-600 mb-8 font-serif" style={{ fontSize: '18px', lineHeight: '1.7' }}>
                Try different keywords or browse our categories
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 bg-[#F59E0B] text-black font-semibold rounded-lg hover:bg-[#D97706] transition-colors"
                style={{ color: '#000000' }}
              >
                Browse All Posts
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-12 mb-12">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {post.featuredImage && (
                      <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 720px) 100vw, 720px"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      {post.category && (
                        <Link
                          href={`/blog/category/${post.category.slug}`}
                          className="inline-block px-3 py-1 bg-gray-100 text-[#1a1a1a] text-xs font-semibold rounded-full mb-4 hover:bg-gray-200 transition-colors font-sans"
                        >
                          {post.category.name}
                        </Link>
                      )}
                      <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-4 hover:text-gray-700 transition-colors font-sans">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-gray-700 mb-6 font-serif" style={{ fontSize: '18px', lineHeight: '1.7' }}>
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4 font-sans">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{post.author?.name || 'Aureon One'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <time dateTime={post.publishedAt?.toISOString()}>
                            {post.publishedAt?.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </time>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog/tag/${tag.slug}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors font-sans"
                          >
                            <TagIcon className="h-3 w-3" />
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-[#F59E0B] font-semibold hover:text-[#D97706] transition-colors font-sans"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/blog/search?q=${encodeURIComponent(query)}`}
                  />
                </div>
              )}

              <div className="mt-8 text-center text-sm text-gray-600 font-serif">
                Showing {(currentPage - 1) * POSTS_PER_PAGE + 1} -{' '}
                {Math.min(currentPage * POSTS_PER_PAGE, totalCount)} of {totalCount} results
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
