import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Pagination } from '@/components/ui/pagination';
import { CalendarIcon, TagIcon, UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const POSTS_PER_PAGE = 12;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

async function getCategory(slug: string, page: number = 1) {
  try {
    const skip = (page - 1) * POSTS_PER_PAGE;

    const [category, posts, totalCount] = await Promise.all([
      prisma.category.findUnique({
        where: { slug },
      }),
      prisma.blogPost.findMany({
        where: {
          status: 'PUBLISHED',
          category: {
            slug,
          },
        },
        include: {
          author: {
            select: {
              name: true,
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
          category: {
            slug,
          },
        },
      }),
    ]);

    return {
      category,
      posts,
      totalCount,
      totalPages: Math.ceil(totalCount / POSTS_PER_PAGE),
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      category: null,
      posts: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found | Aureon One Blog',
    };
  }

  return {
    title: `${category.name} | Aureon One Blog`,
    description: category.description || `Browse all articles in ${category.name} category`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { category, posts, totalCount, totalPages } = await getCategory(slug, currentPage);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      <main id="main-content">
        {/* Back Button */}
        <section className="bg-[#1A1A1A] py-6 border-b border-[#2A2A2A]">
          <div className="container">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#F59E0B] hover:text-[#D97706] font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to All Posts
            </Link>
          </div>
        </section>

        {/* Category Header */}
        <section className="bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#0A0A0A] py-16 border-b border-[#2A2A2A]">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-xl text-gray-300">
                  {category.description}
                </p>
              )}
              <p className="mt-4 text-gray-400">
                {totalCount} {totalCount === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="container">
            {posts.length === 0 ? (
              <div className="text-center py-16 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  No posts in this category yet
                </h2>
                <Link href="/blog" className="inline-flex items-center px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold transition-colors">
                  Browse All Posts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-[#0A0A0A] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#2A2A2A] hover:border-[#F59E0B]"
                  >
                    {/* Featured Image */}
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 overflow-hidden group">
                        {post.featuredImage ? (
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center p-8">
                              <div className="text-6xl mb-4">📊</div>
                              <p className="text-lg font-semibold text-white">
                                {category?.name || 'Marketing'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6">
                      {/* Title */}
                      <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-[#F59E0B] transition-colors">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4 border-t border-[#2A2A2A] pt-4">
                        {post.author && (
                          <div className="flex items-center gap-1.5">
                            <UserIcon className="h-4 w-4" />
                            <span className="font-medium">{post.author.name}</span>
                          </div>
                        )}
                        {post.publishedAt && (
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="h-4 w-4" />
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
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-300 hover:scale-105 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300 border border-[#3A3A3A]"
                            >
                              <TagIcon className="h-3 w-3" />
                              {tag.name}
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl={`/blog/category/${slug}`}
            />

            {/* Results Info */}
            <div className="mt-8 text-center text-sm text-gray-400">
              Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1} - {Math.min(currentPage * POSTS_PER_PAGE, totalCount)} of {totalCount} posts
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
