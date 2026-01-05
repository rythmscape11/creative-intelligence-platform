'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

interface Filters {
  status?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

interface BlogFiltersProps {
  filters: Filters;
  categories: Category[];
  onFilterChange: (filters: Partial<Filters>) => void;
}

export function BlogFilters({ filters, categories, onFilterChange }: BlogFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ search: searchInput || undefined });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({
      status: undefined,
      categoryId: undefined,
      authorId: undefined,
      search: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = 
    filters.status || 
    filters.categoryId || 
    filters.search || 
    filters.startDate || 
    filters.endDate;

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg shadow-sm p-6 space-y-4">
      {/* Search and Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-text-secondary mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, content, or excerpt..."
              className="block w-full pl-10 pr-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-accent-highlight focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all placeholder:text-text-tertiary"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value || undefined })}
            className="block w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-accent-highlight focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all"
          >
            <option value="">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.categoryId || ''}
            onChange={(e) => onFilterChange({ categoryId: e.target.value || undefined })}
            className="block w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-accent-highlight focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-border-primary">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-accent-highlight hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
        >
          {showAdvanced ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Hide Advanced Filters
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show Advanced Filters
            </>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-text-secondary hover:text-text-primary font-medium flex items-center gap-1 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border-primary">
          {/* Sort By */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-text-secondary mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="block w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-accent-highlight focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="publishedAt">Published Date</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-text-secondary mb-1">
              Sort Order
            </label>
            <select
              id="sortOrder"
              value={filters.sortOrder || 'desc'}
              onChange={(e) => onFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
              className="block w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-accent-highlight focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          {/* Date Range - Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={filters.startDate ? filters.startDate.split('T')[0] : ''}
              onChange={(e) => {
                const value = e.target.value;
                onFilterChange({
                  startDate: value ? new Date(value).toISOString() : undefined
                });
              }}
              className="block w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-accent-highlight focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all"
            />
          </div>

          {/* Date Range - End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={filters.endDate ? filters.endDate.split('T')[0] : ''}
              onChange={(e) => {
                const value = e.target.value;
                onFilterChange({
                  endDate: value ? new Date(value).toISOString() : undefined
                });
              }}
              className="block w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-accent-highlight focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border-primary">
          <span className="text-sm text-text-secondary">Active filters:</span>

          {filters.status && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Status: {filters.status}
              <button
                onClick={() => onFilterChange({ status: undefined })}
                className="ml-1 hover:text-blue-300 transition-colors"
              >
                ×
              </button>
            </span>
          )}

          {filters.categoryId && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Category: {categories.find(c => c.id === filters.categoryId)?.name}
              <button
                onClick={() => onFilterChange({ categoryId: undefined })}
                className="ml-1 hover:text-blue-300 transition-colors"
              >
                ×
              </button>
            </span>
          )}

          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Search: "{filters.search}"
              <button
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ search: undefined });
                }}
                className="ml-1 hover:text-blue-300 transition-colors"
              >
                ×
              </button>
            </span>
          )}

          {(filters.startDate || filters.endDate) && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Date Range
              <button
                onClick={() => onFilterChange({ startDate: undefined, endDate: undefined })}
                className="ml-1 hover:text-blue-300 transition-colors"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

