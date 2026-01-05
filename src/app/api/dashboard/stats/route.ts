import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/services/logger-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
import { getOrSetCached, CacheKeys } from '@/lib/cache';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user to get role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userRole = user.role;
    const isAdmin = userRole === 'ADMIN';
    const isEditor = userRole === 'EDITOR' || isAdmin;

    // Check for cache bypass parameter (for debugging)
    const { searchParams } = new URL(request.url);
    const bypassCache = searchParams.get('nocache') === 'true';

    // Generate cache key based on role and user
    const cacheKey = isEditor
      ? CacheKeys.dashboardStatsGlobal(userRole)
      : CacheKeys.dashboardStats(user.id, userRole);

    // Try to get from cache (unless bypassed)
    if (!bypassCache) {
      const cached = await getOrSetCached(
        cacheKey,
        () => fetchDashboardStats(user.id, userRole, isAdmin, isEditor),
        isEditor ? 120 : 300 // Admin/Editor: 2 min, User: 5 min
      );

      const duration = Date.now() - startTime;
      logger.info(`Dashboard stats served from cache in ${duration}ms`, { userId: user.id, role: userRole });

      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
          'X-Cache': 'HIT',
          'X-Response-Time': `${duration}ms`,
        },
      });
    }

    // Fetch fresh data
    const stats = await fetchDashboardStats(user.id, userRole, isAdmin, isEditor);

    const duration = Date.now() - startTime;
    logger.info(`Dashboard stats fetched in ${duration}ms`, { userId: user.id, role: userRole });

    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
        'X-Cache': 'MISS',
        'X-Response-Time': `${duration}ms`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Dashboard stats error', error as Error, { duration });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Fetch dashboard statistics with optimized queries
 */
async function fetchDashboardStats(
  userId: string,
  userRole: string,
  isAdmin: boolean,
  isEditor: boolean
) {
  try {
    // Get current date for calculations
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Build parallel queries based on role
    const queries: Array<Promise<any> | null> = [];

    // 1. Revenue & Financial Metrics (ADMIN only)
    if (isAdmin) {
      queries.push(
        // Total revenue
        prisma.payment.aggregate({
          where: { status: 'SUCCEEDED' },
          _sum: { amount: true },
        }),
        // Revenue this month
        prisma.payment.aggregate({
          where: {
            status: 'SUCCEEDED',
            createdAt: { gte: startOfMonth },
          },
          _sum: { amount: true },
        }),
        // Revenue last month
        prisma.payment.aggregate({
          where: {
            status: 'SUCCEEDED',
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          },
          _sum: { amount: true },
        }),
        // Payment count for AOV
        prisma.payment.count({
          where: { status: 'SUCCEEDED' },
        })
      );
    } else {
      queries.push(Promise.resolve(null), Promise.resolve(null), Promise.resolve(null), Promise.resolve(null));
    }

    // 2. Lead Management (ADMIN & EDITOR)
    if (isEditor) {
      queries.push(
        // Total leads
        prisma.leadCapture.count(),
        // Leads this month
        prisma.leadCapture.count({
          where: { capturedAt: { gte: startOfMonth } },
        }),
        // Leads last month
        prisma.leadCapture.count({
          where: { capturedAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
        }),
        // Leads today
        prisma.leadCapture.count({
          where: { capturedAt: { gte: startOfToday } },
        }),
        // Leads this week
        prisma.leadCapture.count({
          where: { capturedAt: { gte: startOfWeek } },
        }),
        // Lead sources
        prisma.leadCapture.groupBy({
          by: ['source'],
          _count: { source: true },
        }),
        // Leads by budget range
        prisma.leadCapture.groupBy({
          by: ['budgetRange'],
          _count: { budgetRange: true },
          where: { budgetRange: { not: null } },
        })
      );
    } else {
      queries.push(
        Promise.resolve(null),
        Promise.resolve(null),
        Promise.resolve(null),
        Promise.resolve(null),
        Promise.resolve(null),
        Promise.resolve(null),
        Promise.resolve(null)
      );
    }

    // 3. Subscriptions (ADMIN only)
    if (isAdmin) {
      queries.push(
        // Active subscriptions
        prisma.subscription.count({
          where: { status: 'ACTIVE' },
        }),
        // Subscriptions by plan
        prisma.subscription.groupBy({
          by: ['plan'],
          _count: { plan: true },
        }),
        // New subscriptions this month
        prisma.subscription.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
        // Canceled subscriptions this month
        prisma.subscription.count({
          where: {
            status: 'CANCELED',
            canceledAt: { gte: startOfMonth },
          },
        })
      );
    } else {
      queries.push(Promise.resolve(null), Promise.resolve(null), Promise.resolve(null), Promise.resolve(null));
    }

    // 4. Service Inquiries (ADMIN & EDITOR)
    if (isEditor) {
      queries.push(
        // Total inquiries
        prisma.serviceInquiry.count(),
        // Pending inquiries
        prisma.serviceInquiry.count({
          where: { status: 'NEW' },
        }),
        // Inquiries by category
        prisma.serviceInquiry.groupBy({
          by: ['serviceCategory'],
          _count: { serviceCategory: true },
        }),
        // Inquiries this month
        prisma.serviceInquiry.count({
          where: { createdAt: { gte: startOfMonth } },
        })
      );
    } else {
      queries.push(Promise.resolve(null), Promise.resolve(null), Promise.resolve(null), Promise.resolve(null));
    }

    // 5. User Engagement (ADMIN & EDITOR)
    if (isEditor) {
      queries.push(
        // Total users
        prisma.user.count(),
        // Active users (last 30 days)
        prisma.userActivity.groupBy({
          by: ['userId'],
          where: { timestamp: { gte: last30Days } },
        }).then(result => result.length),
        // New users this month
        prisma.user.count({
          where: { createdAt: { gte: startOfMonth } },
        }),
        // Users by role
        prisma.user.groupBy({
          by: ['role'],
          _count: { role: true },
        })
      );
    } else {
      queries.push(Promise.resolve(null), Promise.resolve(null), Promise.resolve(null), Promise.resolve(null));
    }

    // 6. Marketing Strategies (All users - filtered by userId for non-admin)
    const strategyWhere = isEditor ? {} : { userId };
    queries.push(
      // Total strategies
      prisma.marketingStrategy.count({ where: strategyWhere }),
      // Strategies this month
      prisma.marketingStrategy.count({
        where: { ...strategyWhere, createdAt: { gte: startOfMonth } },
      }),
      // Strategies last month
      prisma.marketingStrategy.count({
        where: { ...strategyWhere, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      })
    );

    // 7. Blog Performance (ADMIN & EDITOR)
    if (isEditor) {
      queries.push(
        // Total published posts
        prisma.blogPost.count({
          where: { status: 'PUBLISHED' },
        }),
        // Total posts (all statuses)
        prisma.blogPost.count(),
        // Posts this month
        prisma.blogPost.count({
          where: {
            status: 'PUBLISHED',
            publishedAt: { gte: startOfMonth },
          },
        }),
        // Recent posts
        prisma.blogPost.findMany({
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            slug: true,
            publishedAt: true,
          },
        })
      );
    } else {
      queries.push(Promise.resolve(null), Promise.resolve(null), Promise.resolve(null), Promise.resolve(null));
    }

    // Execute all queries in parallel
    const results = await Promise.all(queries);

    // Parse results based on role
    let resultIndex = 0;

    // Revenue metrics
    const revenue = isAdmin ? {
      total: results[resultIndex++]?._sum?.amount || 0,
      thisMonth: results[resultIndex++]?._sum?.amount || 0,
      lastMonth: results[resultIndex++]?._sum?.amount || 0,
      paymentCount: results[resultIndex++] || 0,
    } : { total: 0, thisMonth: 0, lastMonth: 0, paymentCount: 0 };
    if (!isAdmin) resultIndex += 4;

    // Lead metrics
    const leads = isEditor ? {
      total: results[resultIndex++] || 0,
      thisMonth: results[resultIndex++] || 0,
      lastMonth: results[resultIndex++] || 0,
      today: results[resultIndex++] || 0,
      thisWeek: results[resultIndex++] || 0,
      sources: results[resultIndex++] || [],
      budgetRanges: results[resultIndex++] || [],
    } : { total: 0, thisMonth: 0, lastMonth: 0, today: 0, thisWeek: 0, sources: [], budgetRanges: [] };
    if (!isEditor) resultIndex += 7;

    // Subscription metrics
    const subscriptions = isAdmin ? {
      active: results[resultIndex++] || 0,
      byPlan: results[resultIndex++] || [],
      newThisMonth: results[resultIndex++] || 0,
      canceledThisMonth: results[resultIndex++] || 0,
    } : { active: 0, byPlan: [], newThisMonth: 0, canceledThisMonth: 0 };
    if (!isAdmin) resultIndex += 4;

    // Service inquiry metrics
    const inquiries = isEditor ? {
      total: results[resultIndex++] || 0,
      pending: results[resultIndex++] || 0,
      byCategory: results[resultIndex++] || [],
      thisMonth: results[resultIndex++] || 0,
    } : { total: 0, pending: 0, byCategory: [], thisMonth: 0 };
    if (!isEditor) resultIndex += 4;

    // User engagement metrics
    const users = isEditor ? {
      total: results[resultIndex++] || 0,
      active: results[resultIndex++] || 0,
      newThisMonth: results[resultIndex++] || 0,
      byRole: results[resultIndex++] || [],
    } : { total: 0, active: 0, newThisMonth: 0, byRole: [] };
    if (!isEditor) resultIndex += 4;

    // Strategy metrics
    const strategies = {
      total: results[resultIndex++] || 0,
      thisMonth: results[resultIndex++] || 0,
      lastMonth: results[resultIndex++] || 0,
    };

    // Blog metrics
    const blog = isEditor ? {
      totalPosts: results[resultIndex++] || 0,
      totalAllPosts: results[resultIndex++] || 0,
      postsThisMonth: results[resultIndex++] || 0,
      recentPosts: results[resultIndex++] || [],
    } : { totalPosts: 0, totalAllPosts: 0, postsThisMonth: 0, recentPosts: [] };

    // Calculate trends and derived metrics
    const stats = {
      revenue: {
        total: revenue.total / 100, // Convert cents to dollars
        thisMonth: revenue.thisMonth / 100,
        trend: revenue.lastMonth > 0
          ? Math.round(((revenue.thisMonth - revenue.lastMonth) / revenue.lastMonth) * 100)
          : 0,
        aov: revenue.paymentCount > 0 ? Math.round((revenue.total / revenue.paymentCount) / 100) : 0,
        mrr: revenue.thisMonth / 100, // Simplified MRR calculation
      },
      leads: {
        total: leads.total,
        thisMonth: leads.thisMonth,
        today: leads.today,
        thisWeek: leads.thisWeek,
        trend: leads.lastMonth > 0
          ? Math.round(((leads.thisMonth - leads.lastMonth) / leads.lastMonth) * 100)
          : 0,
        conversionRate: leads.total > 0 && inquiries.total > 0
          ? Math.round((inquiries.total / leads.total) * 100)
          : 0,
        sources: leads.sources,
        budgetRanges: leads.budgetRanges,
      },
      subscriptions: {
        active: subscriptions.active,
        byPlan: subscriptions.byPlan,
        newThisMonth: subscriptions.newThisMonth,
        churnRate: subscriptions.active > 0
          ? Math.round((subscriptions.canceledThisMonth / subscriptions.active) * 100)
          : 0,
      },
      inquiries: {
        total: inquiries.total,
        pending: inquiries.pending,
        byCategory: inquiries.byCategory,
        thisMonth: inquiries.thisMonth,
      },
      users: {
        total: users.total,
        active: users.active,
        newThisMonth: users.newThisMonth,
        byRole: users.byRole,
      },
      strategies: {
        total: strategies.total,
        thisMonth: strategies.thisMonth,
        trend: strategies.lastMonth > 0
          ? Math.round(((strategies.thisMonth - strategies.lastMonth) / strategies.lastMonth) * 100)
          : 0,
      },
      blog: {
        totalPosts: blog.totalPosts,
        totalAllPosts: blog.totalAllPosts,
        postsThisMonth: blog.postsThisMonth,
        recentPosts: blog.recentPosts,
        draftPosts: blog.totalAllPosts - blog.totalPosts,
      },
      role: userRole,
    };

    return stats;
  } catch (error) {
    logger.error('Error fetching dashboard stats', error as Error);
    throw error;
  }
}
