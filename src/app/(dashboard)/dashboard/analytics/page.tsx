'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  strategiesGenerated: number;
  strategiesThisMonth: number;
  totalExports: number;
  exportsThisMonth: number;
  toolUsageCount: number;
  avgGenerationTime: number;
  recentStrategies: Array<{
    id: string;
    title: string;
    createdAt: string;
    status: string;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/user/analytics?timeframe=${timeframe}`);
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [timeframe]);

  // Fallback data for when API returns empty
  const data: AnalyticsData = analytics || {
    strategiesGenerated: 0,
    strategiesThisMonth: 0,
    totalExports: 0,
    exportsThisMonth: 0,
    toolUsageCount: 0,
    avgGenerationTime: 0,
    recentStrategies: []
  };

  const stats = [
    {
      name: 'Total Strategies',
      value: data.strategiesGenerated,
      change: `+${data.strategiesThisMonth} this month`,
      icon: DocumentTextIcon,
      color: 'blue'
    },
    {
      name: 'PDF Exports',
      value: data.totalExports,
      change: `+${data.exportsThisMonth} this month`,
      icon: ArrowDownTrayIcon,
      color: 'green'
    },
    {
      name: 'Tool Usage',
      value: data.toolUsageCount,
      change: 'Total tool interactions',
      icon: SparklesIcon,
      color: 'purple'
    },
    {
      name: 'Avg. Generation Time',
      value: `${data.avgGenerationTime}s`,
      change: 'Per strategy',
      icon: ClockIcon,
      color: 'amber'
    }
  ];

  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: 'bg-blue-500/20', icon: 'text-blue-400', border: 'border-blue-500/30' },
    green: { bg: 'bg-green-500/20', icon: 'text-green-400', border: 'border-green-500/30' },
    purple: { bg: 'bg-purple-500/20', icon: 'text-purple-400', border: 'border-purple-500/30' },
    amber: { bg: 'bg-amber-500/20', icon: 'text-amber-400', border: 'border-amber-500/30' }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-bg-secondary transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 text-text-secondary" />
              </Link>
              <h1 className="text-3xl font-bold text-text-primary">Analytics Dashboard</h1>
            </div>
            <p className="text-text-secondary ml-10">
              Track your marketing strategy performance and usage metrics
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="mt-4 md:mt-0 flex gap-2">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeframe === period
                  ? 'bg-accent-highlight text-white'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  }`}
              >
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-bg-secondary border border-border-primary rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-bg-tertiary rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-bg-tertiary rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => {
                const colors = colorClasses[stat.color];
                return (
                  <div
                    key={stat.name}
                    className="bg-bg-secondary border border-border-primary rounded-lg p-6 hover:border-border-secondary transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${colors.bg} border ${colors.border} rounded-lg flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">{stat.name}</p>
                        <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        <p className="text-xs text-text-tertiary">{stat.change}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Usage Over Time */}
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-400" />
                  Strategy Generation Trend
                </h2>
                <div className="h-64 flex items-center justify-center border border-border-primary rounded-lg bg-bg-tertiary">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 text-text-tertiary mx-auto mb-2" />
                    <p className="text-text-secondary">
                      {data.strategiesGenerated > 0
                        ? 'Generate more strategies to see trends'
                        : 'No data yet - create your first strategy!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tool Usage */}
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5 text-purple-400" />
                  Tool Usage Breakdown
                </h2>
                <div className="h-64 flex items-center justify-center border border-border-primary rounded-lg bg-bg-tertiary">
                  <div className="text-center">
                    <ChartBarIcon className="h-12 w-12 text-text-tertiary mx-auto mb-2" />
                    <p className="text-text-secondary">
                      {data.toolUsageCount > 0
                        ? 'Use more tools to see breakdown'
                        : 'No tool usage yet - explore our tools!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Strategies */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5 text-green-400" />
                Recent Strategies
              </h2>

              {data.recentStrategies.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-primary">
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Title</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Created</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentStrategies.map((strategy) => (
                        <tr key={strategy.id} className="border-b border-border-primary hover:bg-bg-tertiary">
                          <td className="py-3 px-4 text-text-primary">{strategy.title}</td>
                          <td className="py-3 px-4 text-text-secondary text-sm">
                            {new Date(strategy.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${strategy.status === 'COMPLETED'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-amber-500/20 text-amber-400'
                              }`}>
                              {strategy.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/dashboard/strategies/${strategy.id}`}
                              className="text-accent-highlight hover:underline text-sm"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-border-primary rounded-lg bg-bg-tertiary">
                  <DocumentTextIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No strategies yet</h3>
                  <p className="text-text-secondary mb-4">Create your first AI-powered marketing strategy</p>
                  <Link
                    href="/dashboard/strategies/create"
                    className="inline-flex items-center px-4 py-2 bg-accent-highlight text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Create Strategy
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
