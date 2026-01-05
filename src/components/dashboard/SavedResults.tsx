'use client';

import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Trash2, ExternalLink, Calendar, Tag, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpgradePrompt } from '@/components/cro/UpgradePrompt';
import Link from 'next/link';

interface SavedResult {
  id: string;
  toolId: string;
  toolName: string;
  category: string;
  title: string;
  notes: string | null;
  createdAt: string;
  input: any;
  output: any;
}

export function SavedResults() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [results, setResults] = useState<SavedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [hasProAccess, setHasProAccess] = useState(false);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/tools/save-result');
      
      if (response.status === 403) {
        setHasProAccess(false);
        setLoading(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setHasProAccess(true);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (id: string) => {
    if (!confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tools/save-result?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResults(results.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete result:', error);
    }
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.toolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || result.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(results.map(r => r.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasProAccess) {
    return (
      <div className="space-y-6">
        <UpgradePrompt
          variant="card"
          feature="save"
          title="Unlock Saved Results"
          description="Upgrade to Pro to save unlimited results and access them anytime. Never lose your work again!"
        />
        
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            What you'll get with Pro:
          </h3>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Save unlimited tool results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Access your history from any device</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Add notes and organize your work</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Export to premium PDF reports</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Get AI-powered recommendations</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results List */}
      {filteredResults.length === 0 ? (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-12 text-center">
          <p className="text-text-secondary">
            {searchQuery || categoryFilter !== 'all'
              ? 'No results match your filters'
              : 'No saved results yet. Use any tool and click "Save Result" to get started!'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className="bg-bg-secondary border border-border-primary rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary mb-2">
                    {result.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-tertiary mb-3">
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{result.toolName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {result.notes && (
                    <p className="text-text-secondary text-sm mb-3">
                      {result.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href={`/tools/${result.category}/${result.toolId}?resultId=${result.id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteResult(result.id)}
                    className="text-red-400 hover:text-red-300 hover:border-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

