import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Pagination } from '@/components/ui/pagination';
import { SearchBar } from '@/components/blog/search-bar';
import { NewsletterSignup } from '@/components/blog/newsletter-signup';
import { ConsultationCTA } from '@/components/blog/consultation-cta';
import { ServiceHighlight } from '@/components/blog/service-highlight';
import { LeadMagnet } from '@/components/blog/lead-magnet';
import { BlogPostImage } from '@/components/blog/blog-post-image';
import { Calendar, Tag, User } from 'lucide-react';

// Enable dynamic rendering for fresh content
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always fetch fresh data

export const metadata: Metadata = {
  title: 'Marketing Insights & AI Strategy Blog | Aureon One',
  description: 'Discover the latest trends in AI-powered marketing, digital strategy, and marketing automation. Expert insights and actionable tips for marketing professionals.',
  keywords: 'marketing blog, AI marketing, digital marketing, marketing strategy, marketing automation, content marketing',
  alternates: {
    canonical: '/blog',
  },
};

const POSTS_PER_PAGE = 12;

async function getBlogPosts(page: number = 1) {
  try {
    const skip = (page - 1) * POSTS_PER_PAGE;

    const [posts, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where: {
          status: 'PUBLISHED',
        },
        include: {
          author: {
            select: {
              name: true,
              email: true,
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
        skip,
        take: POSTS_PER_PAGE,
      }),
      prisma.blogPost.count({
        where: {
          status: 'PUBLISHED',
        },
      }),
    ]);

    return {
      posts,
      totalCount,
      totalPages: Math.ceil(totalCount / POSTS_PER_PAGE),
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      posts: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { posts, totalCount, totalPages } = await getBlogPosts(currentPage);
  const categories = await getCategories();

  return (
    <div className="blog-page bg-white dark:bg-[#0A0A0A] min-h-screen">

      <main id="main-content">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#1A1A1A] dark:via-[#0F0F0F] dark:to-[#0A0A0A] border-b border-gray-200 dark:border-[#2A2A2A]">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
                style={{ fontFamily: 'var(--font-family-display)' }}
              >
                Marketing Insights & Trends
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Expert insights on AI-powered marketing, digital strategy, and the future of marketing automation
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0A0A0A]">
          <div className="container">
            <SearchBar />
            <div className="text-center mt-4">
              <Link
                href="/blog/search-enhanced"
                className="inline-flex items-center gap-2 text-sm text-[#F59E0B] hover:text-[#D97706] font-semibold transition-colors"
              >
                <span>✨ Try our new AI-powered fuzzy search</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        {categories.length > 0 && (
          <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A]">
            <div className="container">
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/blog"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg bg-[#F59E0B] hover:bg-[#D97706] text-black dark:text-gray-900"
                >
                  All Posts
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#3A3A3A] text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-[#3A3A3A]"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Consultation CTA - Above the fold */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0A0A0A]">
          <div className="container">
            <ConsultationCTA variant="compact" />
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0A0A0A]">
          <div className="container">
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl shadow-lg p-12 border border-gray-200 dark:border-[#2A2A2A]">
                <h2
                  className="text-3xl font-bold mb-4 text-gray-900 dark:text-white"
                  style={{
                    fontFamily: 'var(--font-family-display)',
                  }}
                >
                  No blog posts yet
                </h2>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
                  Check back soon for expert insights on marketing strategy and AI-powered marketing.
                </p>
                <Link href="/" className="inline-flex items-center px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] font-semibold transition-colors text-black">
                  Back to Home
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.slice(0, 6).map((post, index) => (
                    <article
                      key={post.id}
                      className="bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-[#2A2A2A] hover:border-[#F59E0B]"
                    >
                      {/* Featured Image */}
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="relative aspect-video overflow-hidden group">
                          <BlogPostImage
                            src={post.featuredImage}
                            alt={`Featured image for ${post.title}`}
                            index={index}
                            categoryName={post.category?.name || 'Marketing'}
                          />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        {/* Category */}
                        {post.category && (
                          <Link
                            href={`/blog/category/${post.category.slug}`}
                            className="inline-block px-3 py-1.5 text-xs font-bold rounded-lg mb-4 transition-all duration-300 hover:scale-105 bg-[#F59E0B] hover:bg-[#D97706] text-black dark:text-gray-900"
                          >
                            {post.category.name}
                          </Link>
                        )}

                        {/* Title */}
                        <h2
                          className="text-xl font-bold mb-3 line-clamp-2 transition-colors text-gray-900 dark:text-white hover:text-[#F59E0B]"
                          style={{
                            fontFamily: 'var(--font-family-display)',
                          }}
                        >
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm mb-4 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-[#2A2A2A] pt-4">
                          {post.author && (
                            <div className="flex items-center gap-1.5">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{post.author.name}</span>
                            </div>
                          )}
                          {post.publishedAt && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <time dateTime={post.publishedAt.toISOString()}>
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </time>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Link
                                key={tag.id}
                                href={`/blog/tag/${tag.slug}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-300 hover:scale-105 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#3A3A3A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#3A3A3A]"
                              >
                                <Tag className="h-3 w-3" />
                                <span>{tag.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Read More */}
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors group"
                        >
                          Read More
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Lead Magnet - After first 6 posts */}
                {posts.length > 6 && (
                  <div className="my-12">
                    <LeadMagnet variant="compact" />
                  </div>
                )}

                {/* Remaining posts */}
                {posts.length > 6 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {posts.slice(6, 9).map((post, index) => (
                      <article
                        key={post.id}
                        className="bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-[#2A2A2A] hover:border-[#F59E0B]"
                      >
                        {/* Featured Image */}
                        <Link href={`/blog/${post.slug}`} className="block">
                          <div className="relative aspect-video overflow-hidden group">
                            <BlogPostImage
                              src={post.featuredImage}
                              alt={`Featured image for ${post.title}`}
                              index={6 + index}
                              categoryName={post.category?.name || 'Marketing'}
                            />
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-6">
                          {/* Category */}
                          {post.category && (
                            <Link
                              href={`/blog/category/${post.category.slug}`}
                              className="inline-block px-3 py-1.5 text-xs font-bold rounded-lg mb-4 transition-all duration-300 hover:scale-105 bg-[#F59E0B] hover:bg-[#D97706] text-black dark:text-gray-900"
                            >
                              {post.category.name}
                            </Link>
                          )}

                          {/* Title */}
                          <h2
                            className="text-xl font-bold mb-3 line-clamp-2 transition-colors text-gray-900 dark:text-white hover:text-[#F59E0B]"
                            style={{
                              fontFamily: 'var(--font-family-display)',
                            }}
                          >
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-sm mb-4 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-[#2A2A2A] pt-4">
                            {post.author && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{post.author.name}</span>
                              </div>
                            )}
                            {post.publishedAt && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={post.publishedAt.toISOString()}>
                                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </time>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Link
                                  key={tag.id}
                                  href={`/blog/tag/${tag.slug}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-300 hover:scale-105 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#3A3A3A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#3A3A3A]"
                                >
                                  <Tag className="h-3 w-3" />
                                  <span>{tag.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Read More */}
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors group"
                          >
                            Read More
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* Service Highlight - After 9 posts */}
                {posts.length > 9 && (
                  <div className="my-12">
                    <ServiceHighlight />
                  </div>
                )}

                {/* Final posts */}
                {posts.length > 9 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {posts.slice(9).map((post, index) => (
                      <article
                        key={post.id}
                        className="bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-[#2A2A2A] hover:border-[#F59E0B]"
                      >
                        {/* Featured Image */}
                        <Link href={`/blog/${post.slug}`} className="block">
                          <div className="relative aspect-video overflow-hidden group">
                            <BlogPostImage
                              src={post.featuredImage}
                              alt={`Featured image for ${post.title}`}
                              index={9 + index}
                              categoryName={post.category?.name || 'Marketing'}
                            />
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-6">
                          {/* Category */}
                          {post.category && (
                            <Link
                              href={`/blog/category/${post.category.slug}`}
                              className="inline-block px-3 py-1.5 text-xs font-bold rounded-lg mb-4 transition-all duration-300 hover:scale-105 bg-[#F59E0B] hover:bg-[#D97706] text-black dark:text-gray-900"
                            >
                              {post.category.name}
                            </Link>
                          )}

                          {/* Title */}
                          <h2
                            className="text-xl font-bold mb-3 line-clamp-2 transition-colors text-gray-900 dark:text-white hover:text-[#F59E0B]"
                            style={{
                              fontFamily: 'var(--font-family-display)',
                            }}
                          >
                            <Link href={`/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h2>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-sm mb-4 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-[#2A2A2A] pt-4">
                            {post.author && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                <span className="font-medium">{post.author.name}</span>
                              </div>
                            )}
                            {post.publishedAt && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={post.publishedAt.toISOString()}>
                                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </time>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Link
                                  key={tag.id}
                                  href={`/blog/tag/${tag.slug}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-300 hover:scale-105 bg-gray-100 dark:bg-[#2A2A2A] hover:bg-gray-200 dark:hover:bg-[#3A3A3A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#3A3A3A]"
                                >
                                  <Tag className="h-3 w-3" />
                                  <span>{tag.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Read More */}
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center gap-2 font-semibold text-[#F59E0B] hover:text-[#D97706] transition-colors group"
                          >
                            Read More
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/blog"
            />

            {/* Results Info */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1} - {Math.min(currentPage * POSTS_PER_PAGE, totalCount)} of {totalCount} posts
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-[#2A2A2A]">
          <div className="container">
            <NewsletterSignup />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-[#2A2A2A]">
          <div className="container">
            <ConsultationCTA />
          </div>
        </section>
      </main>

    </div>
  );
}
