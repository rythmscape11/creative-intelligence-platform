import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { RoleGuard } from '@/components/auth/role-guard';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import { ErrorBoundary } from '@/components/error-boundary';
import { UserRole } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FeatureBadge } from '@/components/ui/feature-badge';
import { Shield, BookOpen, Users, Zap, BarChart3, FileText, CreditCard, Target, Newspaper, Rocket, ArrowRight } from 'lucide-react';
import { DashboardCharts } from '@/components/admin/dashboard-charts';
import { MailchimpWidget } from '@/components/marketing/mailchimp-widget';
import { TrialTimer } from '@/components/dashboard/trial-timer';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/signin');
  }

  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      role: true,
      subscription: {
        select: {
          status: true,
          trialEnd: true,
        }
      }
    },
  });

  // Auto-create user if authenticated via Clerk but not in database
  // This handles the case where the Clerk webhook fails or wasn't set up
  if (!user) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);

      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || '';
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email;

        // Create the user in the database
        const newUser = await prisma.user.create({
          data: {
            id: userId,
            clerkId: userId,
            email,
            name,
            password: '', // Not used with Clerk
            role: 'USER',
          },
        });

        // Create a 60-day trial subscription
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 60);

        await prisma.subscription.create({
          data: {
            userId: userId,
            plan: 'PRO',
            status: 'TRIALING',
            trialStart: new Date(),
            trialEnd: trialEndDate,
            paymentGateway: 'razorpay',
          },
        });

        console.log(`[Dashboard] Auto-created user ${email} with 60-day trial`);

        // Fetch the complete user data with subscription
        user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            name: true,
            role: true,
            subscription: {
              select: {
                status: true,
                trialEnd: true,
              }
            }
          },
        });
      }
    } catch (error) {
      console.error('[Dashboard] Failed to auto-create user:', error);
      redirect('/auth/signin');
    }
  }

  if (!user) {
    redirect('/auth/signin');
  }

  const userRole = user.role;
  const isTrialing = user.subscription?.status === 'TRIALING' && user.subscription?.trialEnd && new Date(user.subscription.trialEnd) > new Date();

  // --- Admin Data Fetching (Simplified for brevity, keeping existing logic) ---
  let adminData = null;
  if (userRole === 'ADMIN') {
    // ... (Keep existing admin data fetching logic if needed, or simplify) ...
    // For this redesign, I'll assume we want to keep the admin stats but style them better.
    // Re-using the exact same fetching logic from before to ensure no data loss.
    const [userStats, contentStats, activityStats, strategyStats] = await Promise.all([
      prisma.user.groupBy({ by: ['role'], _count: true }),
      Promise.all([
        prisma.blogPost.count(),
        prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
        prisma.blogPost.count({ where: { status: 'DRAFT' } }),
        prisma.category.count(),
        prisma.tag.count(),
      ]),
      Promise.all([
        prisma.userActivity.count(),
        prisma.userActivity.count({ where: { timestamp: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
        prisma.userActivity.count({ where: { timestamp: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } } }),
      ]),
      Promise.all([
        prisma.marketingStrategy.count(),
        prisma.marketingStrategy.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      ]),
    ]);

    const totalUsers = userStats.reduce((sum, stat) => sum + stat._count, 0);
    const adminCount = userStats.find(s => s.role === 'ADMIN')?._count || 0;
    const editorCount = userStats.find(s => s.role === 'EDITOR')?._count || 0;
    const userCount = userStats.find(s => s.role === 'USER')?._count || 0;

    const [totalPosts, publishedPosts, draftPosts, totalCategories, totalTags] = contentStats;
    const [totalActivities, todayActivities, weekActivities] = activityStats;
    const [totalStrategies, todayStrategies] = strategyStats;

    // Charts Data (Simplified for this view)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [usersHistory, activityHistory, totalRevenueResult] = await Promise.all([
      prisma.user.findMany({ where: { createdAt: { gte: thirtyDaysAgo } }, select: { createdAt: true } }),
      prisma.userActivity.findMany({ where: { timestamp: { gte: sevenDaysAgo } }, select: { timestamp: true } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'SUCCEEDED' } })
    ]);

    const totalRevenue = (totalRevenueResult._sum.amount || 0) / 100;

    // Process User Growth
    const userGrowthMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      userGrowthMap.set(d.toISOString().split('T')[0], 0);
    }
    usersHistory.forEach(u => {
      const date = u.createdAt.toISOString().split('T')[0];
      if (userGrowthMap.has(date)) userGrowthMap.set(date, (userGrowthMap.get(date) || 0) + 1);
    });
    let cumulativeUsers = totalUsers - usersHistory.length;
    const userGrowthData = Array.from(userGrowthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => {
        cumulativeUsers += count;
        return { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count: cumulativeUsers };
      });

    // Process Activity
    const activityMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activityMap.set(d.toISOString().split('T')[0], 0);
    }
    activityHistory.forEach(a => {
      const date = a.timestamp.toISOString().split('T')[0];
      if (activityMap.has(date)) activityMap.set(date, (activityMap.get(date) || 0) + 1);
    });
    const activityData = Array.from(activityMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), count }));

    adminData = {
      stats: { totalUsers, adminCount, editorCount, userCount, totalPosts, publishedPosts, draftPosts, totalCategories, totalTags, totalActivities, todayActivities, weekActivities, totalStrategies, todayStrategies, totalRevenue },
      charts: { userGrowthData, activityData },
    };
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {greeting()}, <span className="text-primary">{user.name || 'User'}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isTrialing && user.subscription?.trialEnd && (
            <TrialTimer trialEnd={user.subscription.trialEnd} />
          )}
          <Link href="/dashboard/strategies/create">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <Zap className="w-4 h-4" /> New Strategy
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
        <Link href="/dashboard/strategies/create" className="group">
          <div className="glass-card p-6 h-full hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Rocket className="w-24 h-24 text-primary" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Strategy Generator</h3>
            <p className="text-muted-foreground text-sm mb-4">Create comprehensive, director-level marketing strategies in minutes.</p>
            <div className="flex items-center text-primary text-sm font-medium">
              Start Building <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/competition" className="group">
          <div className="glass-card p-6 h-full hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-24 h-24 text-blue-500" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Market Intelligence</h3>
            <p className="text-muted-foreground text-sm mb-4">Analyze competitors, track trends, and identify market gaps.</p>
            <div className="flex items-center text-blue-500 text-sm font-medium">
              Analyze Market <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/blog-automation" className="group">
          <div className="glass-card p-6 h-full hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Newspaper className="w-24 h-24 text-purple-500" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
              <Newspaper className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Auto Blog Engine</h3>
            <p className="text-muted-foreground text-sm mb-4">Automate your content marketing with AI-written, SEO-optimized posts.</p>
            <div className="flex items-center text-purple-500 text-sm font-medium">
              Manage Content <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Admin Overview (Conditional) */}
      {userRole === 'ADMIN' && adminData && (
        <div className="space-y-6 animate-fade-in-up animation-delay-400">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Platform Overview</h2>
            <FeatureBadge type="admin-only" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${adminData.stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{adminData.stats.totalUsers}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Strategies</p>
                <p className="text-2xl font-bold">{adminData.stats.totalStrategies}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blog Posts</p>
                <p className="text-2xl font-bold">{adminData.stats.totalPosts}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </div>

          <DashboardCharts userGrowthData={adminData.charts.userGrowthData} activityData={adminData.charts.activityData} />
        </div>
      )}

      {/* Analytics Dashboard */}
      <div className="animate-fade-in-up animation-delay-600">
        <ErrorBoundary>
          <AnalyticsDashboard />
        </ErrorBoundary>
      </div>
    </div>
  );
}
