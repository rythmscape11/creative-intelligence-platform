'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Users,
  Clock,
  ThumbsUp,
  Share2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalViews: number;
    totalPosts: number;
    totalComments: number;
    avgReadTime: number;
    viewsChange: number;
    postsChange: number;
    commentsChange: number;
  };
  topPosts: Array<{
    id: string;
    title: string;
    views: number;
    comments: number;
    publishedAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'view' | 'comment' | 'share';
    postTitle: string;
    timestamp: string;
  }>;
  categoryStats: Array<{
    name: string;
    posts: number;
    views: number;
  }>;
}

export function BlogAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blog/analytics?range=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-700" />
          <p className="text-gray-600">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: any; 
    color: string;
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            <span>{Math.abs(change)}% from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Analytics</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={analytics.overview.totalViews.toLocaleString()}
          change={analytics.overview.viewsChange}
          icon={Eye}
          color="bg-amber-500"
        />
        <StatCard
          title="Total Posts"
          value={analytics.overview.totalPosts}
          change={analytics.overview.postsChange}
          icon={BarChart3}
          color="bg-green-500"
        />
        <StatCard
          title="Total Comments"
          value={analytics.overview.totalComments}
          change={analytics.overview.commentsChange}
          icon={MessageSquare}
          color="bg-purple-500"
        />
        <StatCard
          title="Avg. Read Time"
          value={`${analytics.overview.avgReadTime} min`}
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>Most viewed posts in the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPosts.map((post, index) => (
                <div key={post.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-700">#{index + 1}</span>
                      <h4 className="font-medium text-gray-900 text-sm">{post.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.comments} comments
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {analytics.topPosts.length === 0 && (
                <p className="text-center text-gray-700 py-8">No posts data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Posts and views by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.categoryStats.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span className="text-gray-600">{category.posts} posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((category.views / Math.max(...analytics.categoryStats.map(c => c.views))) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 w-20 text-right">
                      {category.views.toLocaleString()} views
                    </span>
                  </div>
                </div>
              ))}
              {analytics.categoryStats.length === 0 && (
                <p className="text-center text-gray-700 py-8">No category data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest interactions with your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'view' ? 'bg-amber-100' :
                  activity.type === 'comment' ? 'bg-purple-100' :
                  'bg-green-100'
                }`}>
                  {activity.type === 'view' && <Eye className="h-4 w-4 text-amber-600" />}
                  {activity.type === 'comment' && <MessageSquare className="h-4 w-4 text-purple-600" />}
                  {activity.type === 'share' && <Share2 className="h-4 w-4 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium capitalize">{activity.type}</span> on{' '}
                    <span className="font-medium">{activity.postTitle}</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {analytics.recentActivity.length === 0 && (
              <p className="text-center text-gray-700 py-8">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

