'use client';

import { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { DashboardTile, DashboardTileSkeleton } from './dashboard-tile';
import {
  DollarSign,
  Users,
  TrendingUp,
  Mail,
  UserCheck,
  FileText,
  Eye,
  Target,
  CreditCard,
  MessageSquare,
  Activity,
  BarChart3,
} from 'lucide-react';

interface DashboardStats {
  revenue: {
    total: number;
    thisMonth: number;
    trend: number;
    aov: number;
    mrr: number;
  };
  leads: {
    total: number;
    thisMonth: number;
    today: number;
    thisWeek: number;
    trend: number;
    conversionRate: number;
    sources: Array<{ source: string; _count: { source: number } }>;
    budgetRanges: Array<{ budgetRange: string; _count: { budgetRange: number } }>;
  };
  subscriptions: {
    active: number;
    byPlan: Array<{ plan: string; _count: { plan: number } }>;
    newThisMonth: number;
    churnRate: number;
  };
  inquiries: {
    total: number;
    pending: number;
    byCategory: Array<{ serviceCategory: string; _count: { serviceCategory: number } }>;
    thisMonth: number;
  };
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    byRole: Array<{ role: string; _count: { role: number } }>;
  };
  strategies: {
    total: number;
    thisMonth: number;
    trend: number;
  };
  blog: {
    totalPosts: number;
    totalAllPosts: number;
    postsThisMonth: number;
    recentPosts: Array<{ id: string; title: string; slug: string; publishedAt: string }>;
    draftPosts: number;
  };
  role: string;
}

export function AnalyticsDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/dashboard/stats');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data format received from API');
        }

        setStats(data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard statistics';
        setError(errorMessage);

        // Log additional debugging info
        console.error('Dashboard stats error details:', {
          error: err,
          userId: user?.id,
          timestamp: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded && isSignedIn) {
      fetchStats();
    } else if (isLoaded && !isSignedIn) {
      setError('Please sign in to view dashboard statistics');
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, user?.id]);

  // Use role from API response (more reliable than Clerk publicMetadata)
  const userRole = stats?.role || (user?.publicMetadata?.role as string);
  const isAdmin = userRole === 'ADMIN';
  const isEditor = userRole === 'EDITOR' || isAdmin;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <DashboardTileSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] border-2 border-red-500/20 rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Activity className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Dashboard Statistics
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Failed to load dashboard statistics'}
          </p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left w-full">
            <p className="font-medium">Possible causes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Database connection issue</li>
              <li>Authentication session expired</li>
              <li>API endpoint error</li>
              <li>Network connectivity problem</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Reload Page
          </button>
          <a
            href="/diagnostics"
            className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Run System Diagnostics
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue & Financial Metrics - ADMIN ONLY */}
      {isAdmin && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-4">Revenue & Financial Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardTile
              title="Total Revenue"
              value={formatCurrency(stats.revenue.total)}
              icon={<DollarSign className="h-4 w-4" />}
              subtitle="All-time revenue"
              href="/dashboard/billing"
              category="revenue"
            />
            <DashboardTile
              title="Monthly Revenue"
              value={formatCurrency(stats.revenue.thisMonth)}
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{
                value: stats.revenue.trend,
                label: 'from last month',
                isPositive: stats.revenue.trend >= 0,
              }}
              href="/dashboard/billing"
              category="revenue"
            />
            <DashboardTile
              title="Average Order Value"
              value={formatCurrency(stats.revenue.aov)}
              icon={<BarChart3 className="h-4 w-4" />}
              subtitle="Per transaction"
              href="/dashboard/admin/analytics"
              category="revenue"
            />
            <DashboardTile
              title="Monthly Recurring Revenue"
              value={formatCurrency(stats.revenue.mrr)}
              icon={<CreditCard className="h-4 w-4" />}
              subtitle="Current MRR"
              href="/dashboard/billing"
              category="revenue"
            />
          </div>
        </div>
      )}

      {/* Lead Management - ADMIN & EDITOR */}
      {isEditor && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-4">Lead Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardTile
              title="Total Leads"
              value={formatNumber(stats.leads.total)}
              icon={<Users className="h-4 w-4" />}
              subtitle="All-time captures"
              href="/dashboard/admin/leads"
              category="leads"
            />
            <DashboardTile
              title="New Leads (This Month)"
              value={formatNumber(stats.leads.thisMonth)}
              icon={<UserCheck className="h-4 w-4" />}
              trend={{
                value: stats.leads.trend,
                label: 'from last month',
                isPositive: stats.leads.trend >= 0,
              }}
              href="/dashboard/admin/leads"
              category="leads"
            />
            <DashboardTile
              title="Leads This Week"
              value={formatNumber(stats.leads.thisWeek)}
              icon={<Activity className="h-4 w-4" />}
              subtitle={`${stats.leads.today} today`}
              href="/dashboard/admin/leads"
              category="leads"
            />
            <DashboardTile
              title="Lead Conversion Rate"
              value={`${stats.leads.conversionRate}%`}
              icon={<Target className="h-4 w-4" />}
              subtitle="Leads to inquiries"
              category="leads"
            />
          </div>
        </div>
      )}

      {/* Subscriptions - ADMIN ONLY */}
      {isAdmin && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-4">Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardTile
              title="Active Subscriptions"
              value={formatNumber(stats.subscriptions.active)}
              icon={<CreditCard className="h-4 w-4" />}
              subtitle="Currently active"
              href="/dashboard/billing"
              category="revenue"
            />
            <DashboardTile
              title="New Subscriptions"
              value={formatNumber(stats.subscriptions.newThisMonth)}
              icon={<TrendingUp className="h-4 w-4" />}
              subtitle="This month"
              href="/dashboard/billing"
              category="revenue"
            />
            <DashboardTile
              title="Churn Rate"
              value={`${stats.subscriptions.churnRate}%`}
              icon={<Activity className="h-4 w-4" />}
              trend={{
                value: -stats.subscriptions.churnRate,
                label: 'this month',
                isPositive: stats.subscriptions.churnRate < 5,
              }}
              category="revenue"
            />
            <DashboardTile
              title="Plan Distribution"
              category="revenue"
              value={stats.subscriptions.byPlan.length > 0
                ? stats.subscriptions.byPlan[0].plan
                : 'N/A'}
              icon={<BarChart3 className="h-4 w-4" />}
              subtitle="Most popular plan"
            />
          </div>
        </div>
      )}

      {/* Service Inquiries - ADMIN & EDITOR */}
      {isEditor && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-4">Service Inquiries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardTile
              title="Total Inquiries"
              value={formatNumber(stats.inquiries.total)}
              icon={<MessageSquare className="h-4 w-4" />}
              subtitle="All-time"
              category="leads"
            />
            <DashboardTile
              title="Pending Inquiries"
              value={formatNumber(stats.inquiries.pending)}
              icon={<Mail className="h-4 w-4" />}
              subtitle="Requires follow-up"
              category="leads"
              className={stats.inquiries.pending > 0 ? 'border-[#F59E0B]' : ''}
            />
            <DashboardTile
              title="This Month"
              value={formatNumber(stats.inquiries.thisMonth)}
              icon={<TrendingUp className="h-4 w-4" />}
              subtitle="New inquiries"
              category="leads"
            />
            <DashboardTile
              title="Top Category"
              value={stats.inquiries.byCategory.length > 0
                ? stats.inquiries.byCategory[0].serviceCategory.replace(/_/g, ' ')
                : 'N/A'}
              icon={<Target className="h-4 w-4" />}
              subtitle="Most requested"
              category="leads"
            />
          </div>
        </div>
      )}

      {/* User Engagement - ADMIN & EDITOR */}
      {isEditor && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-4">User Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardTile
              title="Total Users"
              value={formatNumber(stats.users.total)}
              icon={<Users className="h-4 w-4" />}
              subtitle="Registered users"
              href="/dashboard/admin/users"
              category="engagement"
            />
            <DashboardTile
              title="Active Users"
              value={formatNumber(stats.users.active)}
              icon={<Activity className="h-4 w-4" />}
              subtitle="Last 30 days"
              href="/dashboard/admin/users"
              category="engagement"
            />
            <DashboardTile
              title="New Signups"
              value={formatNumber(stats.users.newThisMonth)}
              icon={<UserCheck className="h-4 w-4" />}
              subtitle="This month"
              href="/dashboard/admin/users"
              category="engagement"
            />
            <DashboardTile
              title="User Roles"
              value={stats.users.byRole.length}
              icon={<BarChart3 className="h-4 w-4" />}
              subtitle="Role distribution"
              href="/dashboard/admin/users"
              category="engagement"
            />
          </div>
        </div>
      )}

      {/* Marketing Strategies - ALL USERS */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-4">
          {isEditor ? 'Marketing Strategies (All Users)' : 'Your Marketing Strategies'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardTile
            title="Total Strategies"
            value={formatNumber(stats.strategies.total)}
            icon={<FileText className="h-4 w-4" />}
            subtitle={isEditor ? 'Platform-wide' : 'Your strategies'}
            href="/dashboard/strategies"
            category="strategies"
          />
          <DashboardTile
            title="Created This Month"
            value={formatNumber(stats.strategies.thisMonth)}
            icon={<TrendingUp className="h-4 w-4" />}
            trend={{
              value: stats.strategies.trend,
              label: 'from last month',
              isPositive: stats.strategies.trend >= 0,
            }}
            href="/dashboard/strategies"
            category="strategies"
          />
          <DashboardTile
            title="Create New Strategy"
            value="+"
            icon={<Target className="h-4 w-4" />}
            subtitle="Build AI-powered plan"
            href="/dashboard/strategies/create"
            category="strategies"
            className="border-[#8B5CF6] hover:bg-[#8B5CF6]/10"
          />
        </div>
      </div>

      {/* Blog Performance - ADMIN & EDITOR */}
      {isEditor && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FFFFFF] mb-4">Blog Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardTile
              title="Published Posts"
              value={formatNumber(stats.blog.totalPosts)}
              icon={<FileText className="h-4 w-4" />}
              subtitle="Live articles"
              href="/dashboard/blog"
              category="blog"
            />
            <DashboardTile
              title="Draft Posts"
              value={formatNumber(stats.blog.draftPosts)}
              icon={<Eye className="h-4 w-4" />}
              subtitle="Unpublished"
              href="/dashboard/blog"
              category="blog"
            />
            <DashboardTile
              title="Posts This Month"
              value={formatNumber(stats.blog.postsThisMonth)}
              icon={<TrendingUp className="h-4 w-4" />}
              subtitle="Recently published"
              href="/dashboard/blog"
              category="blog"
            />
            <DashboardTile
              title="Total Posts"
              value={formatNumber(stats.blog.totalAllPosts)}
              icon={<BarChart3 className="h-4 w-4" />}
              subtitle="All statuses"
              href="/dashboard/blog"
              category="blog"
            />
          </div>
        </div>
      )}
    </div>
  );
}

