'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface SearchFiltersProps {
  categories: Category[];
  tags: Tag[];
}

/**
 * Search Filters Component
 * 
 * Provides filtering options for search results:
 * - Category filter
 * - Tag filter
 * - Date range filter
 * - Sort options
 */
export function SearchFilters({ categories, tags }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentCategory = searchParams.get('category') || '';
  const currentTag = searchParams.get('tag') || '';
  const currentSort = searchParams.get('sort') || 'relevance';
  const currentDateRange = searchParams.get('date') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/blog/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.get('q');
    
    router.push(`/blog/search?q=${encodeURIComponent(query || '')}`);
  };

  const hasActiveFilters = currentCategory || currentTag || currentDateRange || currentSort !== 'relevance';

  return (
    <div className="mb-6">
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <FunnelIcon className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 bg-primary-100/30 text-primary-700 text-xs rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Filters Panel */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={currentCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Tag
              </label>
              <select
                value={currentTag}
                onChange={(e) => updateFilter('tag', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.slug}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={currentDateRange}
                onChange={(e) => updateFilter('date', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={currentSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="relevance">Relevance</option>
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {currentCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100/30 text-primary-700 text-xs rounded-full">
                    Category: {categories.find((c) => c.slug === currentCategory)?.name}
                    <button
                      onClick={() => updateFilter('category', '')}
                      className="hover:text-primary-900"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {currentTag && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100/30 text-primary-700 text-xs rounded-full">
                    Tag: {tags.find((t) => t.slug === currentTag)?.name}
                    <button
                      onClick={() => updateFilter('tag', '')}
                      className="hover:text-primary-900"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {currentDateRange && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100/30 text-primary-700 text-xs rounded-full">
                    Date: {currentDateRange}
                    <button
                      onClick={() => updateFilter('date', '')}
                      className="hover:text-primary-900"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {currentSort !== 'relevance' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100/30 text-primary-700 text-xs rounded-full">
                    Sort: {currentSort}
                    <button
                      onClick={() => updateFilter('sort', 'relevance')}
                      className="hover:text-primary-900"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

