import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Admin Analytics API
 * GET /api/admin/analytics
 * 
 * Returns aggregated metrics for admin dashboard
 * Requires admin role
 */

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { clerkId: userId },
        ],
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '365d':
        startDate.setDate(now.getDate() - 365);
        break;
    }

    // Get subscriptions by product
    const subscriptions = await prisma.productSubscription.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'TRIALING'],
        },
      },
    });

    // Aggregate by product
    const productMetrics = new Map<string, {
      mrr: number;
      arr: number;
      activeSubscriptions: { starter: number; pro: number; agency: number; total: number };
      changes: { newSignups: number; churned: number; upgrades: number; downgrades: number };
    }>();

    // Initialize products
    ['AGENCY_OS', 'OPTIMISER', 'ANALYSER', 'STRATEGISER'].forEach(product => {
      productMetrics.set(product, {
        mrr: 0,
        arr: 0,
        activeSubscriptions: { starter: 0, pro: 0, agency: 0, total: 0 },
        changes: { newSignups: 0, churned: 0, upgrades: 0, downgrades: 0 },
      });
    });

    // Process subscriptions
    for (const sub of subscriptions) {
      const metrics = productMetrics.get(sub.product);
      if (!metrics) continue;

      // Count by tier
      const tier = sub.planTier.toLowerCase();
      if (tier === 'starter') metrics.activeSubscriptions.starter++;
      else if (tier === 'pro') metrics.activeSubscriptions.pro++;
      else if (tier === 'agency') metrics.activeSubscriptions.agency++;

      metrics.activeSubscriptions.total++;

      // Calculate MRR (simplified - would need pricing data)
      const tierPrices: Record<string, Record<string, number>> = {
        AGENCY_OS: { starter: 29, pro: 99, agency: 299 },
        OPTIMISER: { starter: 39, pro: 129, agency: 349 },
        ANALYSER: { starter: 29, pro: 99, agency: 249 },
        STRATEGISER: { starter: 19, pro: 49, agency: 149 },
      };

      const price = tierPrices[sub.product]?.[tier] || 0;
      metrics.mrr += price;
      metrics.arr = metrics.mrr * 12;
    }

    // Get recent signups
    const recentSignups = await prisma.productSubscription.findMany({
      where: {
        createdAt: { gte: startDate },
      },
    });

    for (const signup of recentSignups) {
      const metrics = productMetrics.get(signup.product);
      if (metrics) {
        metrics.changes.newSignups++;
      }
    }

    // Get churned subscriptions
    const churned = await prisma.productSubscription.findMany({
      where: {
        status: 'CANCELED',
        canceledAt: { gte: startDate },
      },
    });

    for (const sub of churned) {
      const metrics = productMetrics.get(sub.product);
      if (metrics) {
        metrics.changes.churned++;
      }
    }

    // Calculate overall metrics
    let totalMrr = 0;
    let totalSubscriptions = 0;

    productMetrics.forEach((metrics) => {
      totalMrr += metrics.mrr;
      totalSubscriptions += metrics.activeSubscriptions.total;
    });

    const totalArr = totalMrr * 12;
    const arpu = totalSubscriptions > 0 ? totalMrr / totalSubscriptions : 0;
    const totalChurned = churned.length;
    const churnRate = totalSubscriptions > 0
      ? (totalChurned / (totalSubscriptions + totalChurned)) * 100
      : 0;

    // Convert Map to array for response
    const products = Array.from(productMetrics.entries()).map(([product, metrics]) => ({
      product,
      ...metrics,
    }));

    return NextResponse.json({
      overall: {
        totalMrr,
        totalArr,
        totalSubscriptions,
        arpu: Math.round(arpu * 100) / 100,
        churnRate: Math.round(churnRate * 10) / 10,
        mrrGrowth: 12.5, // Would calculate from historical data
      },
      products,
      period,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Admin Analytics] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
