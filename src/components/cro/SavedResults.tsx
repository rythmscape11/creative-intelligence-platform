'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Search, Download, Trash2, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SavedResult {
  id: string;
  toolName: string;
  category: string;
  title?: string;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
  input: any;
  output: any;
}

export function SavedResults() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [results, setResults] = useState<SavedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchResults();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/tools/save-result');
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    try {
      const response = await fetch(`/api/tools/save-result?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResults(results.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const result = results.find(r => r.id === id);
    if (!result) return;

    try {
      const response = await fetch('/api/tools/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...result,
          isFavorite: !result.isFavorite,
        }),
      });

      if (response.ok) {
        setResults(results.map(r =>
          r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
        ));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || result.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(results.map(r => r.category)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-secondary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input
            type="text"
            placeholder="Search saved results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-bg-tertiary border border-border-primary rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-secondary"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-12 bg-bg-secondary border border-border-primary rounded-lg">
          <p className="text-text-secondary">
            {searchQuery || filterCategory !== 'all'
              ? 'No results found matching your filters.'
              : 'No saved results yet. Use any tool and save your results to see them here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className="bg-bg-secondary border border-border-primary rounded-lg p-6 hover:border-accent-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-text-primary truncate">
                      {result.title || result.toolName}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent-secondary/10 text-accent-secondary">
                      {result.category}
                    </span>
                  </div>

                  {result.notes && (
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {result.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.createdAt).toLocaleDateString()}
                    </span>
                    <span>{result.toolName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFavorite(result.id)}
                    className="p-2 hover:bg-bg-hover rounded-md transition-colors"
                  >
                    <Star
                      className={`h-4 w-4 ${result.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-text-tertiary'
                        }`}
                    />
                  </button>

                  <button
                    onClick={() => {/* TODO: Implement export */ }}
                    className="p-2 hover:bg-bg-hover rounded-md transition-colors"
                  >
                    <Download className="h-4 w-4 text-text-tertiary" />
                  </button>

                  <button
                    onClick={() => handleDelete(result.id)}
                    className="p-2 hover:bg-bg-hover rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

