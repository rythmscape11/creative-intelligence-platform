'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'blog' | 'strategy' | 'page';
  url: string;
  category?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Global Search Modal with Cmd+K shortcut
 * 
 * Features:
 * - Keyboard shortcut (Cmd+K / Ctrl+K)
 * - Real-time autocomplete
 * - Search history
 * - Keyboard navigation
 * - Search across blog posts, strategies, and pages
 */
export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Load search history from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('search-history');
      if (history) {
        try {
          setSearchHistory(JSON.parse(history));
        } catch (error) {
          console.error('Failed to parse search history:', error);
        }
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch autocomplete results
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [results, selectedIndex, query, onClose]
  );

  // Handle search submission
  const handleSearch = () => {
    if (!query.trim()) return;

    // Save to history
    const newHistory = [query, ...searchHistory.filter((h) => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    // Navigate to search results
    router.push(`/blog/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    // Save to history
    const newHistory = [result.title, ...searchHistory.filter((h) => h !== result.title)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    // Navigate to result
    router.push(result.url);
    onClose();
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 px-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search blog posts, strategies, and more..."
              className="w-full border-0 bg-transparent py-4 pl-3 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="h-5 w-5 text-gray-700" />
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-gray-100 rounded"
            >
              <span className="text-xs text-gray-700">ESC</span>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto p-2">
            {loading && (
              <div className="px-4 py-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent" />
                <p className="mt-2 text-sm text-gray-700">Searching...</p>
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-700">No results found for &quot;{query}&quot;</p>
                <button
                  onClick={handleSearch}
                  className="mt-4 text-sm text-primary-600 hover:underline"
                >
                  View all search results →
                </button>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-1">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary-50/20'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {result.type === 'blog' && (
                          <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        {result.type === 'strategy' && (
                          <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        <p className="text-xs text-gray-700 line-clamp-2 mt-1">
                          {result.excerpt}
                        </p>
                        {result.category && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary-100/30 text-primary-700 rounded">
                            {result.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Search History */}
            {!query && searchHistory.length > 0 && (
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase">Recent Searches</h3>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-700 hover:text-gray-600"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(item)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-gray-700" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50/50">
            <div className="flex items-center justify-between text-xs text-gray-700">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑</kbd>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↵</kbd>
                  <span>Select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">ESC</kbd>
                  <span>Close</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Global Search Trigger Button
 */
export function GlobalSearchTrigger({ onClick }: { onClick: () => void }) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <button
      onClick={onClick}
      className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <MagnifyingGlassIcon className="h-4 w-4" />
      <span>Search...</span>
      <kbd className="ml-auto px-2 py-0.5 text-xs bg-white border border-gray-300 rounded">
        {isMac ? '⌘K' : 'Ctrl+K'}
      </kbd>
    </button>
  );
}

/**
 * Hook to manage global search state and keyboard shortcut
 */
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}

