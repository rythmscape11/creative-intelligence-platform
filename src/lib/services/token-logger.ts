import { prisma } from '@/lib/prisma';

interface TokenUsage {
    userId: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    feature: string;
    metadata?: Record<string, any>;
}

interface UsageStats {
    totalTokens: number;
    totalCost: number;
    byModel: Record<string, { tokens: number; cost: number }>;
    byFeature: Record<string, { tokens: number; cost: number }>;
}

/**
 * AI Token Usage Logger and Cost Calculator
 * Tracks all AI API usage for cost management and optimization
 */
export class TokenLogger {
    // Pricing per 1000 tokens (as of Dec 2024)
    private static readonly PRICING: Record<string, { input: number; output: number }> = {
        'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
        'gpt-4-turbo': { input: 0.01, output: 0.03 },
        'gpt-4o': { input: 0.005, output: 0.015 },
        'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
        'gpt-4': { input: 0.03, output: 0.06 },
        'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
        'gpt-3.5-turbo-16k': { input: 0.003, output: 0.004 },
        'dall-e-3-standard': { input: 0.04, output: 0 }, // Per image
        'dall-e-3-hd': { input: 0.08, output: 0 }, // Per image
    };

    /**
     * Calculate cost for token usage
     */
    static calculateCost(model: string, promptTokens: number, completionTokens: number): number {
        const rates = this.PRICING[model] || this.PRICING['gpt-4-turbo-preview'];
        const inputCost = (promptTokens / 1000) * rates.input;
        const outputCost = (completionTokens / 1000) * rates.output;
        return Number((inputCost + outputCost).toFixed(6));
    }

    /**
     * Log token usage to database
     */
    static async log(usage: TokenUsage): Promise<void> {
        const cost = this.calculateCost(
            usage.model,
            usage.promptTokens,
            usage.completionTokens
        );

        try {
            await prisma.aiUsageLog.create({
                data: {
                    userId: usage.userId,
                    model: usage.model,
                    promptTokens: usage.promptTokens,
                    completionTokens: usage.completionTokens,
                    totalTokens: usage.promptTokens + usage.completionTokens,
                    cost,
                    feature: usage.feature,
                    metadata: usage.metadata || {},
                    timestamp: new Date()
                }
            });
        } catch (error) {
            console.error('Token logging error:', error);
            // Non-fatal, continue without logging
        }
    }

    /**
     * Get usage statistics for a user
     */
    static async getUserStats(userId: string, days: number = 30): Promise<UsageStats> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        try {
            const logs = await prisma.aiUsageLog.findMany({
                where: {
                    userId,
                    timestamp: { gte: startDate }
                }
            });

            const stats: UsageStats = {
                totalTokens: 0,
                totalCost: 0,
                byModel: {},
                byFeature: {}
            };

            for (const log of logs) {
                const tokens = log.promptTokens + log.completionTokens;
                const cost = Number(log.cost);

                stats.totalTokens += tokens;
                stats.totalCost += cost;

                // By model
                if (!stats.byModel[log.model]) {
                    stats.byModel[log.model] = { tokens: 0, cost: 0 };
                }
                stats.byModel[log.model].tokens += tokens;
                stats.byModel[log.model].cost += cost;

                // By feature
                if (!stats.byFeature[log.feature]) {
                    stats.byFeature[log.feature] = { tokens: 0, cost: 0 };
                }
                stats.byFeature[log.feature].tokens += tokens;
                stats.byFeature[log.feature].cost += cost;
            }

            // Round costs
            stats.totalCost = Number(stats.totalCost.toFixed(4));
            for (const model of Object.keys(stats.byModel)) {
                stats.byModel[model].cost = Number(stats.byModel[model].cost.toFixed(4));
            }
            for (const feature of Object.keys(stats.byFeature)) {
                stats.byFeature[feature].cost = Number(stats.byFeature[feature].cost.toFixed(4));
            }

            return stats;

        } catch (error) {
            console.error('Get user stats error:', error);
            return {
                totalTokens: 0,
                totalCost: 0,
                byModel: {},
                byFeature: {}
            };
        }
    }

    /**
     * Get platform-wide usage statistics (admin only)
     */
    static async getPlatformStats(days: number = 30): Promise<{
        totalCost: number;
        totalTokens: number;
        totalRequests: number;
        topUsers: Array<{ userId: string; cost: number; requests: number }>;
        costByDay: Array<{ date: string; cost: number }>;
    }> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        try {
            const [aggregate, byUser, daily] = await Promise.all([
                prisma.aiUsageLog.aggregate({
                    where: { timestamp: { gte: startDate } },
                    _sum: { cost: true, totalTokens: true },
                    _count: true
                }),
                prisma.aiUsageLog.groupBy({
                    by: ['userId'],
                    where: { timestamp: { gte: startDate } },
                    _sum: { cost: true },
                    _count: true,
                    orderBy: { _sum: { cost: 'desc' } },
                    take: 10
                }),
                prisma.$queryRaw`
          SELECT 
            DATE(timestamp) as date,
            SUM(cost) as cost
          FROM "AiUsageLog"
          WHERE timestamp >= ${startDate}
          GROUP BY DATE(timestamp)
          ORDER BY date DESC
          LIMIT 30
        ` as Promise<Array<{ date: Date; cost: number }>>
            ]);

            return {
                totalCost: Number(aggregate._sum.cost || 0),
                totalTokens: aggregate._sum.totalTokens || 0,
                totalRequests: aggregate._count,
                topUsers: byUser.map(u => ({
                    userId: u.userId,
                    cost: Number(u._sum.cost || 0),
                    requests: u._count
                })),
                costByDay: daily.map(d => ({
                    date: new Date(d.date).toISOString().split('T')[0],
                    cost: Number(d.cost)
                }))
            };

        } catch (error) {
            console.error('Get platform stats error:', error);
            return {
                totalCost: 0,
                totalTokens: 0,
                totalRequests: 0,
                topUsers: [],
                costByDay: []
            };
        }
    }
}

export default TokenLogger;
