'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserManagement } from './user-management';
import {
  UsersIcon as Users,
  DocumentTextIcon as FileText,
  ChartBarIcon as BarChart3,
  Cog6ToothIcon as Settings,
  ShieldCheckIcon as Shield,
  CircleStackIcon as Database,
  BoltIcon as Activity,
  ArrowTrendingUpIcon as TrendingUp,
  ExclamationTriangleIcon as AlertTriangle,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
  EyeIcon as Eye
} from '@heroicons/react/24/outline';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  content: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    scheduledPosts: number;
  };
  strategies: {
    total: number;
    thisMonth: number;
    exported: number;
  };
  system: {
    uptime: string;
    version: string;
    lastBackup: string;
  };
}

interface RecentActivity {
  id: string;
  type: 'user_registered' | 'post_published' | 'strategy_created' | 'export_generated';
  description: string;
  timestamp: string;
  user?: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard statistics
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/activity')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <Users className="h-4 w-4 text-amber-500" />;
      case 'post_published':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'strategy_created':
        return <BarChart3 className="h-4 w-4 text-purple-500" />;
      case 'export_generated':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-700" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage your MediaPlanPro platform and monitor system performance
        </p>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.total}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.users.newThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.content.publishedPosts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.content.draftPosts} drafts, {stats.content.scheduledPosts} scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Strategies Created</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.strategies.total}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.strategies.thisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                Uptime: {stats.system.uptime}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest actions across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-700">
                            {formatTimestamp(activity.timestamp)}
                            {activity.user && ` • ${activity.user}`}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700 text-sm">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-sm">Content Review</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Database className="h-6 w-6 mb-2" />
                    <span className="text-sm">Backup Data</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col">
                    <Settings className="h-6 w-6 mb-2" />
                    <span className="text-sm">System Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                System Health
              </CardTitle>
              <CardDescription>
                Monitor system performance and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">45ms</div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.1GB</div>
                  <p className="text-sm text-gray-600">Memory Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentManagement />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemManagement />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Placeholder components for different management sections

function ContentManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Manage blog posts, strategies, and media</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">Content management interface will be implemented here</p>
      </CardContent>
    </Card>
  );
}

function SystemManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Management</CardTitle>
        <CardDescription>Configure system settings and maintenance</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">System management interface will be implemented here</p>
      </CardContent>
    </Card>
  );
}

function SecurityManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Management</CardTitle>
        <CardDescription>Monitor security and access controls</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">Security management interface will be implemented here</p>
      </CardContent>
    </Card>
  );
}
