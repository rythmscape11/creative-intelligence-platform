import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Admin',
  description: 'View analytics and insights',
};

export default async function AdminAnalyticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Get date ranges
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const thisWeek = new Date(now.setDate(now.getDate() - 7));
  const thisMonth = new Date(now.setDate(1));

  // Get analytics data
  const analytics = await prisma.analytics.findMany({
    where: {
      timestamp: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  // Get blog posts (views would need to be calculated from analytics)
  const blogPostsRaw = await prisma.blogPost.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
    },
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Calculate views per blog post from analytics (match by page path containing slug)
  const blogViews = analytics.reduce((acc, item) => {
    if (item.page) {
      blogPostsRaw.forEach(post => {
        if (item.page?.includes(post.slug)) {
          acc[post.id] = (acc[post.id] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // Add calculated views to blog posts
  const blogPosts = blogPostsRaw.map(post => ({
    ...post,
    views: blogViews[post.id] || 0,
  }));

  // Get strategy stats
  const strategyStats = {
    total: await prisma.marketingStrategy.count(),
    today: await prisma.marketingStrategy.count({
      where: { createdAt: { gte: today } },
    }),
    thisWeek: await prisma.marketingStrategy.count({
      where: { createdAt: { gte: thisWeek } },
    }),
    thisMonth: await prisma.marketingStrategy.count({
      where: { createdAt: { gte: thisMonth } },
    }),
  };

  // Get user stats
  const userStats = {
    total: await prisma.user.count(),
    today: await prisma.user.count({
      where: { createdAt: { gte: today } },
    }),
    thisWeek: await prisma.user.count({
      where: { createdAt: { gte: thisWeek } },
    }),
    thisMonth: await prisma.user.count({
      where: { createdAt: { gte: thisMonth } },
    }),
  };

  // Calculate total page views from analytics
  const totalPageViews = analytics.length;

  // Get blog stats with real view count
  const blogStats = {
    total: await prisma.blogPost.count(),
    published: await prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    views: totalPageViews, // Use actual analytics count
  };

  // Calculate traffic sources from analytics (referrer field)
  const trafficSources = analytics.reduce((acc, item) => {
    const source = item.referrer || 'Direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate page views by date
  const pageViewsByDate = analytics.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-text-primary">
          Analytics Dashboard
        </h1>
        <p className="text-text-secondary">
          Monitor traffic, engagement, and performance
        </p>
      </div>

      {/* GA4 Integration Notice */}
      <div className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary mb-1">
              Internal Analytics Data
            </h3>
            <p className="text-sm text-text-secondary mb-2">
              This dashboard shows data from internal application tracking. For Google Analytics data (page views, traffic sources, user behavior), use the integrated GA4 reports.
            </p>
            <a
              href="/dashboard/admin/integrations/google-analytics/reports"
              className="inline-flex items-center text-sm font-medium text-primary-yellow hover:text-primary-yellow-light transition-colors"
            >
              View Google Analytics Reports →
            </a>
          </div>
        </div>
      </div>

      <AnalyticsDashboard
        strategyStats={strategyStats}
        userStats={userStats}
        blogStats={blogStats}
        topContent={blogPosts}
        trafficSources={trafficSources}
        pageViewsByDate={pageViewsByDate}
      />
    </div>
  );
}

