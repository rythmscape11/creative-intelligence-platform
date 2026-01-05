'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DocumentTextIcon,
  PlusIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalStrategies: number;
  strategiesThisMonth: number;
  totalBudgetManaged: number;
  avgStrategyValue: number;
  recentStrategies: Array<{
    id: string;
    businessName: string;
    industry: string;
    budget: number;
    createdAt: string;
  }>;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-bg-tertiary rounded-lg border border-border-primary p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-bg-elevated rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-bg-elevated rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-bg-tertiary rounded-lg border border-border-primary p-6 hover:border-border-hover transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-accent-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Total Strategies</p>
              <p className="text-2xl font-bold text-white">
                {stats?.totalStrategies || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-tertiary rounded-lg border border-border-primary p-6 hover:border-border-hover transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-accent-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">This Month</p>
              <p className="text-2xl font-bold text-white">
                {stats?.strategiesThisMonth || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-tertiary rounded-lg border border-border-primary p-6 hover:border-border-hover transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-accent-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Total Budget</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(stats?.totalBudgetManaged || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-tertiary rounded-lg border border-border-primary p-6 hover:border-border-hover transition-all">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-accent-highlight" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-secondary">Avg. Strategy</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(stats?.avgStrategyValue || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-bg-tertiary rounded-lg border border-border-primary p-6 hover:border-border-hover transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild className="h-auto p-4 flex-col items-start">
            <Link href="/dashboard/strategies/create">
              <PlusIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">Create New Strategy</span>
              <span className="text-sm opacity-80">Generate AI-powered marketing plan</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="h-auto p-4 flex-col items-start">
            <Link href="/dashboard/strategies">
              <DocumentTextIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">View All Strategies</span>
              <span className="text-sm opacity-80">Manage existing strategies</span>
            </Link>
          </Button>

          <Button variant="outline" asChild className="h-auto p-4 flex-col items-start">
            <Link href="/dashboard/analytics">
              <ChartBarIcon className="h-6 w-6 mb-2" />
              <span className="font-medium">View Analytics</span>
              <span className="text-sm opacity-80">Track performance metrics</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Strategies */}
      {stats?.recentStrategies && stats.recentStrategies.length > 0 && (
        <div className="bg-bg-tertiary rounded-lg border border-border-primary p-6 hover:border-border-hover transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Strategies</h2>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/strategies">View All</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {stats.recentStrategies.slice(0, 5).map((strategy) => (
              <div
                key={strategy.id}
                className="flex items-center justify-between p-3 border border-border-primary rounded-lg hover:bg-bg-hover transition-colors"
              >
                <div className="flex-1">
                  <Link
                    href={`/dashboard/strategies/${strategy.id}`}
                    className="font-medium text-white hover:text-accent-warning"
                  >
                    {strategy.businessName}
                  </Link>
                  <p className="text-sm text-text-secondary capitalize">
                    {strategy.industry} • {formatCurrency(strategy.budget)}
                  </p>
                </div>
                <div className="flex items-center text-sm text-text-secondary">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {formatDate(strategy.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!stats?.recentStrategies || stats.recentStrategies.length === 0) && (
        <div className="bg-bg-tertiary rounded-lg border border-border-primary p-12 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-text-secondary" />
          <h3 className="mt-2 text-sm font-medium text-white">No strategies yet</h3>
          <p className="mt-1 text-sm text-text-secondary">
            Get started by creating your first marketing strategy.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard/strategies/create">
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Your First Strategy
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
