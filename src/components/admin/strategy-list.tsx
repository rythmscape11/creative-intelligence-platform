'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Strategy {
  id: string;
  createdAt: Date;
  generatedBy: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface StrategyListProps {
  strategies: Strategy[];
}

export function StrategyList({ strategies }: StrategyListProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (strategyId: string) => {
    if (!confirm('Are you sure you want to delete this strategy?')) {
      return;
    }

    setDeleting(strategyId);
    try {
      const response = await fetch(`/api/admin/strategies/${strategyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete strategy');
      }
    } catch (error) {
      console.error('Error deleting strategy:', error);
      alert('Failed to delete strategy');
    } finally {
      setDeleting(null);
    }
  };

  if (strategies.length === 0) {
    return (
      <p className="text-center py-8" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.5 }}>
        No strategies found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {strategies.map((strategy) => (
        <div
          key={strategy.id}
          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium" style={{ color: 'var(--color-neutral-charcoal)' }}>
                  Strategy #{strategy.id.slice(0, 8)}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                  {strategy.generatedBy}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}>
                Created by: {strategy.user.name || strategy.user.email}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.5 }}>
                {new Date(strategy.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/api/admin/strategies/${strategy.id}/export`}
                className="btn btn-secondary btn-sm"
                download
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
              <button
                className="btn btn-secondary btn-sm text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(strategy.id)}
                disabled={deleting === strategy.id}
              >
                {deleting === strategy.id ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

