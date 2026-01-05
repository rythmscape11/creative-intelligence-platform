'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Users,
  FileText,
  Eye,
  Lightbulb,
  Calendar,
} from 'lucide-react';
import { GA4MetricsWidget } from './ga4-metrics-widget';

interface AnalyticsDashboardProps {
  strategyStats: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  userStats: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  blogStats: {
    total: number;
    published: number;
    views: number;
  };
  topContent: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
  }>;
  trafficSources: Record<string, number>;
  pageViewsByDate: Record<string, number>;
}

const COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#6366F1', // Indigo
];

export function AnalyticsDashboard({
  strategyStats,
  userStats,
  blogStats,
  topContent,
  trafficSources,
  pageViewsByDate,
}: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('30');

  // Prepare traffic sources data for pie chart
  const trafficData = Object.entries(trafficSources).map(([name, value]) => ({
    name,
    value,
  }));

  // Prepare page views data for line chart
  const pageViewsData = Object.entries(pageViewsByDate)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, views]) => ({
      date,
      views,
    }));

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card className="bg-bg-secondary border border-border-primary">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent-highlight" />
              <span className="font-medium text-text-primary">
                Date Range:
              </span>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:border-accent-highlight focus:ring-2 focus:ring-accent-highlight/20 outline-none transition-all"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Google Analytics Section */}
      <GA4MetricsWidget />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all animate-fade-in-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Lightbulb className="h-10 w-10 text-blue-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-sm font-medium mb-2 text-text-secondary">
              Total Strategies
            </p>
            <p className="text-4xl font-bold text-text-primary mb-1">
              {strategyStats.total}
            </p>
            <p className="text-xs text-green-400 font-medium">
              +{strategyStats.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all animate-fade-in-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="h-10 w-10 text-purple-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-sm font-medium mb-2 text-text-secondary">
              New Users
            </p>
            <p className="text-4xl font-bold text-text-primary mb-1">
              {userStats.total}
            </p>
            <p className="text-xs text-green-400 font-medium">
              +{userStats.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all animate-fade-in-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <FileText className="h-10 w-10 text-green-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-sm font-medium mb-2 text-text-secondary">
              Blog Posts
            </p>
            <p className="text-4xl font-bold text-text-primary mb-1">
              {blogStats.published}
            </p>
            <p className="text-xs text-text-tertiary font-medium">
              {blogStats.total} total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-500/40 transition-all animate-fade-in-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Eye className="h-10 w-10 text-amber-400" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-sm font-medium mb-2 text-text-secondary">
              Page Views
            </p>
            <p className="text-4xl font-bold text-text-primary mb-1">
              {blogStats.views.toLocaleString()}
            </p>
            <p className="text-xs text-text-tertiary font-medium">
              Analytics Views
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <Card className="bg-bg-secondary border border-border-primary">
          <CardHeader>
            <CardTitle className="text-text-primary text-xl font-bold">Page Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pageViewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="date" stroke="#A0A0A0" fontSize={12} />
                <YAxis stroke="#A0A0A0" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Legend wrapperStyle={{ color: '#A0A0A0' }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  name="Page Views"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources Chart */}
        <Card className="bg-bg-secondary border border-border-primary">
          <CardHeader>
            <CardTitle className="text-text-primary text-xl font-bold">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Content */}
      <Card className="bg-bg-secondary border border-border-primary">
        <CardHeader>
          <CardTitle className="text-text-primary text-xl font-bold">Top Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topContent.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary text-lg">No content data available yet</p>
                <p className="text-text-tertiary text-sm mt-2">Content views will appear here once tracked</p>
              </div>
            ) : (
              topContent.slice(0, 10).map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary border border-border-primary hover:border-border-hover transition-all"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${index < 3
                        ? 'bg-gradient-to-br from-accent-highlight to-blue-600 text-white'
                        : 'bg-bg-primary text-text-secondary border border-border-primary'
                        }`}
                    >
                      {index + 1}
                    </div>
                    <p className="font-medium truncate text-text-primary text-base">
                      {post.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 bg-bg-primary px-4 py-2 rounded-lg border border-border-primary">
                    <Eye className="h-5 w-5 text-accent-highlight" />
                    <span className="font-bold text-text-primary text-lg">
                      {post.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

