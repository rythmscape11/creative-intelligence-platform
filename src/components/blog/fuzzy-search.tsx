'use client';

/**
 * Fuzzy Search Component with Instant Results
 * 
 * Features:
 * - Fuzzy/typo-tolerant search using Fuse.js
 * - Instant search results as user types
 * - Search result highlighting
 * - Debounced search for performance
 * - Search by title, excerpt, content, tags, category
 * - Relevance-based ranking
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Fuse from 'fuse.js';
import { MagnifyingGlassIcon, XMarkIcon, UserIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';

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

interface FuzzySearchProps {
  posts: BlogPost[];
  initialQuery?: string;
}

export function FuzzySearch({ posts, initialQuery = '' }: FuzzySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 300);

    if (query !== debouncedQuery) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [query, debouncedQuery]);

  // Update query from URL params
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
      setDebouncedQuery(urlQuery);
    }
  }, [searchParams]);

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: [
        { name: 'title', weight: 3 }, // Title is most important
        { name: 'excerpt', weight: 2 },
        { name: 'content', weight: 1 },
        { name: 'category.name', weight: 1.5 },
        { name: 'tags.name', weight: 1.2 },
      ],
      threshold: 0.4, // 0 = exact match, 1 = match anything
      distance: 100, // Maximum distance for fuzzy matching
      minMatchCharLength: 2, // Minimum characters to start matching
      includeScore: true, // Include relevance score
      includeMatches: true, // Include match positions for highlighting
      ignoreLocation: true, // Search entire string, not just beginning
      useExtendedSearch: false,
    });
  }, [posts]);

  // Perform fuzzy search
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }

    const results = fuse.search(debouncedQuery);
    
    // Return top 10 results
    return results.slice(0, 10).map(result => ({
      post: result.item,
      score: result.score || 0,
      matches: result.matches || [],
    }));
  }, [debouncedQuery, fuse]);

  // Highlight matched text
  const highlightText = (text: string, matches: any[]) => {
    if (!matches || matches.length === 0) {
      return text;
    }

    // Find matches for this specific field
    const fieldMatches = matches.filter(m => 
      m.key === 'title' || m.key === 'excerpt'
    );

    if (fieldMatches.length === 0) {
      return text;
    }

    // Get all match indices
    const indices: number[][] = [];
    fieldMatches.forEach(match => {
      if (match.indices) {
        indices.push(...match.indices);
      }
    });

    if (indices.length === 0) {
      return text;
    }

    // Sort indices by start position
    indices.sort((a, b) => a[0] - b[0]);

    // Build highlighted text
    let result = '';
    let lastIndex = 0;

    indices.forEach(([start, end]) => {
      // Add text before match
      result += text.substring(lastIndex, start);
      // Add highlighted match
      result += `<mark class="bg-yellow-200 dark:bg-yellow-900 text-gray-900 dark:text-white px-1 rounded">${text.substring(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });

    // Add remaining text
    result += text.substring(lastIndex);

    return result;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setShowResults(false);
    router.push('/blog');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.trim().length > 0);
  };

  const handleResultClick = () => {
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowResults(query.trim().length > 0)}
            placeholder="Search articles... (try fuzzy search!)"
            className="block w-full pl-12 pr-12 py-3 border border-[#2A2A2A] rounded-lg leading-5 bg-[#1A1A1A] text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] sm:text-sm"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="mt-2 text-sm text-gray-400">Searching...</p>
        )}
      </form>

      {/* Instant Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-2xl max-h-[600px] overflow-y-auto">
          <div className="p-4 border-b border-[#2A2A2A]">
            <p className="text-sm text-gray-400">
              Found {searchResults.length} instant {searchResults.length === 1 ? 'result' : 'results'}
            </p>
          </div>
          <div className="divide-y divide-[#2A2A2A]">
            {searchResults.map(({ post, matches }) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                onClick={handleResultClick}
                className="block p-4 hover:bg-[#2A2A2A] transition-colors"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📊
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {post.category && (
                      <span className="inline-block px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded mb-1">
                        {post.category.name}
                      </span>
                    )}
                    <h3
                      className="text-base font-semibold text-white mb-1 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(post.title, matches.filter(m => m.key === 'title')),
                      }}
                    />
                    <p
                      className="text-sm text-gray-400 line-clamp-2 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(post.excerpt, matches.filter(m => m.key === 'excerpt')),
                      }}
                    />
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {post.author?.name || 'MediaPlanPro'}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="p-3 border-t border-[#2A2A2A] bg-[#0F0F0F]">
            <button
              onClick={handleSearch}
              className="w-full text-center text-sm text-primary-400 hover:text-primary-300 font-medium"
            >
              View all results for &quot;{query}&quot; →
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && debouncedQuery && searchResults.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-2xl p-6 text-center">
          <p className="text-gray-400 mb-2">No results found for &quot;{debouncedQuery}&quot;</p>
          <p className="text-sm text-gray-500">Try different keywords or check spelling</p>
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}

