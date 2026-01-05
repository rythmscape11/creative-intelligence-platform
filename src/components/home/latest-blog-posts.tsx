'use client';

import Link from 'next/link';
import { ArrowRightIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { BlogPostImage } from '@/components/blog/blog-post-image';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  publishedAt: Date | null;
  readingTime: number | null;
  author: {
    name: string | null;
  } | null;
  category: {
    name: string;
    slug: string;
  } | null;
}

interface LatestBlogPostsProps {
  posts: BlogPost[];
}

export function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Show only the 3 most recent posts
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="relative py-16 sm:py-20 bg-transparent overflow-hidden">
      {/* Background decoration - Minimalist */}
      <div className="absolute inset-0 bg-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-100 dark:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
              📚 Latest Insights
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-text-primary mb-4">
            Marketing Insights &{' '}
            <span className="text-gray-900 dark:text-text-primary">
              Expert Strategies
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-text-secondary max-w-3xl mx-auto">
            Stay ahead with actionable marketing strategies, industry trends, and proven tactics from our experts
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post, index) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-zinc-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Featured Image */}
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <BlogPostImage
                    src={post.featuredImage}
                    alt={`Featured image for ${post.title}`}
                    index={index}
                    categoryName={post.category?.name || 'Marketing'}
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 dark:from-bg-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                {post.category && (
                  <Link
                    href={`/blog/category/${post.category.slug}`}
                    className="inline-block mb-3"
                  >
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 hover:bg-[#F59E0B]/20 transition-colors">
                      {post.category.name}
                    </span>
                  </Link>
                )}

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary mb-3 line-clamp-2 group-hover:text-[#F59E0B] transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-text-secondary text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-text-tertiary">
                  <div className="flex items-center gap-4">
                    {post.author?.name && (
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{post.author.name}</span>
                      </div>
                    )}
                    {post.readingTime && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-[#F59E0B] hover:text-[#FF8C00] transition-colors group/link"
                >
                  Read Article
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA to Blog */}
        <div className="text-center">
          <Link href="/blog">
            <Button
              size="lg"
              variant="outline"
              className="text-base sm:text-lg px-8 py-6 h-auto border-gray-200 dark:border-border-primary hover:border-[#F59E0B]/50 hover:bg-gray-100 dark:bg-bg-tertiary transition-all duration-300 group"
            >
              <span className="flex items-center">
                Explore All Marketing Insights
                <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-text-tertiary">
            Join 10,000+ marketers getting weekly insights
          </p>
        </div>
      </div>
    </section>
  );
}

