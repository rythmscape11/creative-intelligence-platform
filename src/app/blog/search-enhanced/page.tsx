'use client';

/**
 * Enhanced Blog Search Page with Fuzzy Search
 *
 * Features:
 * - Client-side fuzzy search with Fuse.js
 * - Instant search results
 * - Search highlighting
 * - Typo-tolerant search
 * - No server round-trips for instant results
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FuzzySearch } from '@/components/blog/fuzzy-search';
import { UserIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  publishedAt: Date | null;
  author: {
    name: string | null;
  } | null;
  category: {
    name: string;
    slug: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all blog posts for client-side search
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog/search-data');

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        setPosts(data.posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load search data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <>
        <main id="main-content" className="min-h-screen bg-background py-12">
          <div className="container">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Enhanced Search
            </h1>
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading search data...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <main id="main-content" className="min-h-screen bg-background py-12">
          <div className="container">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Enhanced Search
            </h1>
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Browse All Posts
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main id="main-content" className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Enhanced Search
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Fuzzy search with instant results • {posts.length} articles indexed
          </p>

          <FuzzySearch posts={posts} initialQuery={query} />

          {!query && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Recent Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, 6).map((post) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-lg font-semibold text-white">
                              {post.category?.name || 'Marketing'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {post.category && (
                        <Link
                          href={`/blog/category/${post.category.slug}`}
                          className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full mb-3 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                        >
                          {post.category.name}
                        </Link>
                      )}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{post.author?.name || 'Aureon One'}</span>
                        </div>
                        {post.publishedAt && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <time dateTime={new Date(post.publishedAt).toISOString()}>
                              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </time>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Link
                            key={tag.id}
                            href={`/blog/tag/${tag.slug}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            <TagIcon className="h-3 w-3" />
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Browse All Posts
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default function EnhancedSearchPage() {
  return (
    <Suspense fallback={
      <>
        <main id="main-content" className="min-h-screen bg-background py-12">
          <div className="container">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Enhanced Search
            </h1>
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        </main>
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}

