/**
 * Growth Suite Usage Tracker
 * 
 * Tracks usage of Growth Suite tools and enforces free tier limits
 */

import { prisma } from '@/lib/prisma';

export type GrowthTool = 
  | 'experiments' 
  | 'attribution' 
  | 'seo' 
  | 'repurposer' 
  | 'widgets' 
  | 'heatmaps' 
  | 'competitors';

export interface FreeTierLimits {
  experiments: {
    active: number;
    pageviews: number; // per month
  };
  attribution: {
    events: number; // per month
    retentionDays: number;
  };
  seo: {
    briefs: number; // per month
    keywordsTracked: number;
  };
  repurposer: {
    generations: number; // per month
  };
  widgets: {
    active: number;
    pageviews: number; // per month
  };
  heatmaps: {
    sessions: number; // per month
    pages: number;
  };
  competitors: {
    tracked: number;
    keywords: number;
  };
}

export const FREE_TIER_LIMITS: FreeTierLimits = {
  experiments: {
    active: 1,
    pageviews: 10000,
  },
  attribution: {
    events: 50000,
    retentionDays: 90,
  },
  seo: {
    briefs: 5,
    keywordsTracked: 10,
  },
  repurposer: {
    generations: 50,
  },
  widgets: {
    active: 2,
    pageviews: 10000,
  },
  heatmaps: {
    sessions: 1000,
    pages: 5,
  },
  competitors: {
    tracked: 1,
    keywords: 10,
  },
};

/**
 * Track usage of a Growth Suite tool
 */
export async function trackUsage(
  userId: string,
  tool: GrowthTool,
  action: string,
  quotaUsed: number = 1,
  metadata?: Record<string, any>
): Promise<void> {
  await prisma.growthSuiteUsage.create({
    data: {
      userId,
      tool,
      action,
      quotaUsed,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });
}

/**
 * Get usage for a specific tool in the current month
 */
export async function getMonthlyUsage(
  userId: string,
  tool: GrowthTool,
  action?: string
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usage = await prisma.growthSuiteUsage.aggregate({
    where: {
      userId,
      tool,
      ...(action && { action }),
      timestamp: {
        gte: startOfMonth,
      },
    },
    _sum: {
      quotaUsed: true,
    },
  });

  return usage._sum.quotaUsed || 0;
}

/**
 * Check if user has exceeded their quota for a tool
 */
export async function checkQuota(
  userId: string,
  tool: GrowthTool,
  action: string,
  requestedQuota: number = 1
): Promise<{ allowed: boolean; current: number; limit: number; remaining: number }> {
  const currentUsage = await getMonthlyUsage(userId, tool, action);
  
  // Get limit based on tool and action
  let limit = 0;
  
  switch (tool) {
    case 'experiments':
      limit = action === 'pageview' ? FREE_TIER_LIMITS.experiments.pageviews : FREE_TIER_LIMITS.experiments.active;
      break;
    case 'attribution':
      limit = FREE_TIER_LIMITS.attribution.events;
      break;
    case 'seo':
      limit = action === 'generate_brief' ? FREE_TIER_LIMITS.seo.briefs : FREE_TIER_LIMITS.seo.keywordsTracked;
      break;
    case 'repurposer':
      limit = FREE_TIER_LIMITS.repurposer.generations;
      break;
    case 'widgets':
      limit = action === 'pageview' ? FREE_TIER_LIMITS.widgets.pageviews : FREE_TIER_LIMITS.widgets.active;
      break;
    case 'heatmaps':
      limit = action === 'session' ? FREE_TIER_LIMITS.heatmaps.sessions : FREE_TIER_LIMITS.heatmaps.pages;
      break;
    case 'competitors':
      limit = action === 'track_competitor' ? FREE_TIER_LIMITS.competitors.tracked : FREE_TIER_LIMITS.competitors.keywords;
      break;
  }

  const allowed = (currentUsage + requestedQuota) <= limit;
  const remaining = Math.max(0, limit - currentUsage);

  return {
    allowed,
    current: currentUsage,
    limit,
    remaining,
  };
}

/**
 * Get all usage stats for a user
 */
export async function getUserUsageStats(userId: string): Promise<Record<GrowthTool, any>> {
  const tools: GrowthTool[] = ['experiments', 'attribution', 'seo', 'repurposer', 'widgets', 'heatmaps', 'competitors'];
  
  const stats: Record<string, any> = {};

  for (const tool of tools) {
    const usage = await getMonthlyUsage(userId, tool);
    stats[tool] = {
      usage,
      limit: getToolLimit(tool),
      percentage: (usage / getToolLimit(tool)) * 100,
    };
  }

  return stats;
}

/**
 * Get the primary limit for a tool
 */
function getToolLimit(tool: GrowthTool): number {
  switch (tool) {
    case 'experiments':
      return FREE_TIER_LIMITS.experiments.pageviews;
    case 'attribution':
      return FREE_TIER_LIMITS.attribution.events;
    case 'seo':
      return FREE_TIER_LIMITS.seo.briefs;
    case 'repurposer':
      return FREE_TIER_LIMITS.repurposer.generations;
    case 'widgets':
      return FREE_TIER_LIMITS.widgets.pageviews;
    case 'heatmaps':
      return FREE_TIER_LIMITS.heatmaps.sessions;
    case 'competitors':
      return FREE_TIER_LIMITS.competitors.tracked;
    default:
      return 0;
  }
}

/**
 * Clean up old usage data (older than 90 days)
 */
export async function cleanupOldUsage(): Promise<number> {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const result = await prisma.growthSuiteUsage.deleteMany({
    where: {
      timestamp: {
        lt: ninetyDaysAgo,
      },
    },
  });

  return result.count;
}

/**
 * Get usage breakdown by tool for admin dashboard
 */
export async function getGlobalUsageStats(startDate?: Date, endDate?: Date): Promise<any> {
  const where: any = {};
  
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = startDate;
    if (endDate) where.timestamp.lte = endDate;
  }

  const stats = await prisma.growthSuiteUsage.groupBy({
    by: ['tool'],
    where,
    _sum: {
      quotaUsed: true,
    },
    _count: {
      id: true,
    },
  });

  return stats.map(stat => ({
    tool: stat.tool,
    totalQuotaUsed: stat._sum.quotaUsed || 0,
    totalActions: stat._count.id,
  }));
}

