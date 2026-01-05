'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface StrategyMetrics {
  successRate: {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
  };
  avgGenerationTime: {
    avgMs: number;
    minMs: number;
    maxMs: number;
  };
  errorBreakdown: Array<{
    errorType: string;
    count: number;
  }>;
  metricsByTimePeriod: Array<{
    period: string;
    total: number;
    successful: number;
    failed: number;
  }>;
  userJourneyDropOff: {
    validationErrors: number;
    generationErrors: number;
    dbErrors: number;
    timeoutErrors: number;
    unknownErrors: number;
  };
  aiVsFallback: {
    ai: number;
    fallback: number;
    aiPercentage: number;
  };
  filters: {
    strategyType: string;
    startDate?: string;
    endDate?: string;
    period: string;
  };
}

export default function StrategyMetricsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [metrics, setMetrics] = useState<StrategyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strategyType, setStrategyType] = useState<string>('ALL');
  const [period, setPeriod] = useState<string>('day');

  // RBAC check - redirect if not ADMIN
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/auth/signin');
      return;
    }

    if ((user?.publicMetadata?.role as string) !== 'ADMIN') {
      router.push('/unauthorized');
      return;
    }
  }, [user, isLoaded, isSignedIn, router]);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (strategyType !== 'ALL') params.append('strategyType', strategyType);
      params.append('period', period);

      const response = await fetch(`/api/admin/strategy-metrics?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }, [period, strategyType]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin (will redirect)
  if (!isLoaded || !isSignedIn || (user?.publicMetadata?.role as string) !== 'ADMIN') {
    return null;
  }

  if (loading && !metrics) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Strategy Generation Metrics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor performance and reliability of the main feature
          </p>
        </div>
        <Button onClick={fetchMetrics} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Strategy Type</label>
              <Select value={strategyType} onValueChange={setStrategyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="ENHANCED">Enhanced (Premium)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Hourly</SelectItem>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Success Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(metrics.successRate.successRate)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {metrics.successRate.successful} / {metrics.successRate.total} successful
            </p>
          </CardContent>
        </Card>

        {/* Failed Attempts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {metrics.successRate.failed}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {formatPercentage(100 - metrics.successRate.successRate)} failure rate
            </p>
          </CardContent>
        </Card>

        {/* Avg Generation Time */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatDuration(metrics.avgGenerationTime.avgMs)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Min: {formatDuration(metrics.avgGenerationTime.minMs)} | Max: {formatDuration(metrics.avgGenerationTime.maxMs)}
            </p>
          </CardContent>
        </Card>

        {/* AI Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatPercentage(metrics.aiVsFallback.aiPercentage)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {metrics.aiVsFallback.ai} AI / {metrics.aiVsFallback.fallback} Fallback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Error Breakdown</CardTitle>
          <CardDescription>Types of errors encountered during strategy generation</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.errorBreakdown.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No errors recorded in this period 🎉
            </p>
          ) : (
            <div className="space-y-4">
              {metrics.errorBreakdown.map((error) => (
                <div key={error.errorType} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium">{error.errorType.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{error.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Journey Drop-off */}
      <Card>
        <CardHeader>
          <CardTitle>User Journey Drop-off Analysis</CardTitle>
          <CardDescription>Where users encounter issues in the generation process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Validation</p>
              <p className="text-2xl font-bold text-red-600">{metrics.userJourneyDropOff.validationErrors}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Generation</p>
              <p className="text-2xl font-bold text-red-600">{metrics.userJourneyDropOff.generationErrors}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Database</p>
              <p className="text-2xl font-bold text-red-600">{metrics.userJourneyDropOff.dbErrors}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Timeout</p>
              <p className="text-2xl font-bold text-red-600">{metrics.userJourneyDropOff.timeoutErrors}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Unknown</p>
              <p className="text-2xl font-bold text-red-600">{metrics.userJourneyDropOff.unknownErrors}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics by Time Period */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Trends</CardTitle>
          <CardDescription>Strategy generation over time</CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.metricsByTimePeriod.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No data available for this period
            </p>
          ) : (
            <div className="space-y-4">
              {metrics.metricsByTimePeriod.map((period) => (
                <div key={period.period} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div>
                    <p className="font-medium">{period.period}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {period.successful} successful / {period.failed} failed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{period.total}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPercentage((period.successful / period.total) * 100)} success
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
