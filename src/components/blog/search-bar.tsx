'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AutocompleteResult {
  id: string;
  title: string;
  excerpt: string;
  type: 'blog';
  url: string;
  category?: string;
}

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Autocomplete error:', error);
        setSuggestions([]);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      setShowSuggestions(false);
      router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    router.push('/blog');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = suggestions[selectedIndex];
      router.push(selected.url);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl mx-auto mb-8 relative">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search articles..."
            className="block w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-[#2A2A2A] rounded-lg leading-5 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:placeholder-gray-500 dark:focus:placeholder-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] sm:text-sm"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          )}
        </div>
        {isSearching && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
        )}
      </form>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-lg shadow-xl overflow-hidden">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <Link
                key={suggestion.id}
                href={suggestion.url}
                onClick={() => setShowSuggestions(false)}
                className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-colors ${index === selectedIndex ? 'bg-gray-100 dark:bg-[#2A2A2A]' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {suggestion.title}
                    </p>
                    {suggestion.excerpt && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                        {suggestion.excerpt}
                      </p>
                    )}
                    {suggestion.category && (
                      <span className="inline-block mt-1 text-xs text-[#F59E0B]">
                        {suggestion.category}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-[#2A2A2A] px-4 py-2 bg-gray-50 dark:bg-[#0A0A0A]">
            <p className="text-xs text-gray-500">
              Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-[#2A2A2A] rounded text-gray-600 dark:text-gray-400">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-[#2A2A2A] rounded text-gray-600 dark:text-gray-400">↓</kbd> to navigate,{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-[#2A2A2A] rounded text-gray-600 dark:text-gray-400">Enter</kbd> to select,{' '}
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-[#2A2A2A] rounded text-gray-600 dark:text-gray-400">Esc</kbd> to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

