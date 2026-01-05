'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, SparklesIcon, DocumentTextIcon, WrenchIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'blog' | 'tool' | 'page' | 'strategy';
  url: string;
  category?: string;
}

interface HeroSearchProps {
  autoFocus?: boolean;
}

const CONTENT_TYPE_ICONS = {
  blog: BookOpenIcon,
  tool: WrenchIcon,
  page: DocumentTextIcon,
  strategy: SparklesIcon,
};

const CONTENT_TYPE_COLORS = {
  blog: 'text-blue-600 bg-blue-50',
  tool: 'text-green-600 bg-green-50',
  page: 'text-purple-600 bg-purple-50',
  strategy: 'text-amber-600 bg-amber-50',
};

/**
 * Hero Search Component with Advanced Features
 * 
 * Features:
 * - Real-time autocomplete
 * - Content type filtering
 * - Keyboard navigation
 * - Search suggestions
 * - Prominent hero placement
 */
export function HeroSearch({ autoFocus = false }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Auto-focus on mount if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Fetch autocomplete results
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.json();
        setResults(data.results || []);
        setShowResults(true);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults || results.length === 0) {
        if (e.key === 'Enter') {
          handleSearch();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelectResult(results[selectedIndex]);
          } else {
            handleSearch();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowResults(false);
          break;
      }
    },
    [showResults, results, selectedIndex]
  );

  // Handle search submission
  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/blog/search?q=${encodeURIComponent(query)}`);
    setShowResults(false);
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    router.push(result.url);
    setShowResults(false);
    setQuery('');
  };

  // Filter results by type
  const filteredResults = selectedType
    ? results.filter((r) => r.type === selectedType)
    : results;

  // Group results by type
  const groupedResults = filteredResults.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-700" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Search tools, blog posts, strategies, and more..."
          className="w-full pl-12 pr-12 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 shadow-lg hover:shadow-xl bg-white text-gray-900 placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setShowResults(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
          >
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </button>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-12 flex items-center pr-4">
            <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && filteredResults.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Content Type Filters */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-xs font-semibold text-gray-700 uppercase">Filter:</span>
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedType === null
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All ({results.length})
            </button>
            {Object.keys(groupedResults).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors capitalize ${
                  selectedType === type
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {type}s ({groupedResults[type].length})
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedResults).map(([type, typeResults]) => (
              <div key={type}>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase">{type}s</h3>
                </div>
                {typeResults.map((result, index) => {
                  const Icon = CONTENT_TYPE_ICONS[result.type as keyof typeof CONTENT_TYPE_ICONS];
                  const isSelected = results.indexOf(result) === selectedIndex;
                  
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        isSelected ? 'bg-amber-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${CONTENT_TYPE_COLORS[result.type as keyof typeof CONTENT_TYPE_COLORS]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {result.title}
                          </h4>
                          <p className="text-xs text-gray-700 line-clamp-2 mt-1">
                            {result.excerpt}
                          </p>
                          {result.category && (
                            <span className="inline-block mt-1 text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                              {result.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-700">
            <div className="flex items-center justify-between">
              <span>Press <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">↑</kbd> <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">↓</kbd> to navigate</span>
              <span>Press <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">Enter</kbd> to select</span>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && query.length >= 2 && filteredResults.length === 0 && !loading && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 text-center"
        >
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
          <p className="text-sm text-gray-700">
            Try searching for tools, blog posts, or strategies
          </p>
        </div>
      )}
    </div>
  );
}

