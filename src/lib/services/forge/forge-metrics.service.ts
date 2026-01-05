/**
 * Forge Metrics Service
 * Aggregates usage metrics and provides dashboard data
 */

import { prisma } from '@/lib/prisma';

export interface UsageMetrics {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    totalSparksUsed: number;
    runsByDay: { date: string; count: number; sparks: number }[];
    runsByProvider: { provider: string; count: number; sparks: number }[];
    runsByNodeType: { nodeType: string; count: number; sparks: number }[];
}

export interface DashboardStats {
    totalFlows: number;
    publishedFlows: number;
    totalRuns: number;
    runsLast24h: number;
    runsLast7d: number;
    sparksUsedLast24h: number;
    sparksUsedLast7d: number;
    successRate: number;
    activeApiKeys: number;
    activeWebhooks: number;
}

export class ForgeMetricsService {
    /**
     * Get dashboard stats for an organization
     */
    static async getDashboardStats(orgId: string): Promise<DashboardStats> {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [
            totalFlows,
            publishedFlows,
            totalRuns,
            runsLast24h,
            runsLast7d,
            successfulRunsLast7d,
            sparksLast24h,
            sparksLast7d,
            activeApiKeys,
            activeWebhooks,
        ] = await Promise.all([
            // Total flows
            prisma.forgeFlow.count({ where: { orgId } }),

            // Published flows
            prisma.forgeFlow.count({ where: { orgId, status: 'published' } }),

            // Total runs
            prisma.forgeFlowRun.count({ where: { orgId } }),

            // Runs last 24h
            prisma.forgeFlowRun.count({
                where: { orgId, createdAt: { gte: last24h } },
            }),

            // Runs last 7d
            prisma.forgeFlowRun.count({
                where: { orgId, createdAt: { gte: last7d } },
            }),

            // Successful runs last 7d
            prisma.forgeFlowRun.count({
                where: { orgId, createdAt: { gte: last7d }, status: 'success' },
            }),

            // Sparks used last 24h
            prisma.forgeFlowRun.aggregate({
                where: { orgId, createdAt: { gte: last24h } },
                _sum: { totalSparksUsed: true },
            }),

            // Sparks used last 7d
            prisma.forgeFlowRun.aggregate({
                where: { orgId, createdAt: { gte: last7d } },
                _sum: { totalSparksUsed: true },
            }),

            // Active API keys
            prisma.forgeApiKey.count({ where: { orgId, status: 'active' } }),

            // Active webhooks
            prisma.forgeWebhook.count({ where: { orgId, status: 'active' } }),
        ]);

        const successRate = runsLast7d > 0
            ? Math.round((successfulRunsLast7d / runsLast7d) * 100)
            : 100;

        return {
            totalFlows,
            publishedFlows,
            totalRuns,
            runsLast24h,
            runsLast7d,
            sparksUsedLast24h: sparksLast24h._sum.totalSparksUsed || 0,
            sparksUsedLast7d: sparksLast7d._sum.totalSparksUsed || 0,
            successRate,
            activeApiKeys,
            activeWebhooks,
        };
    }

    /**
     * Get detailed usage metrics for an organization
     */
    static async getUsageMetrics(
        orgId: string,
        dateRange: { start: Date; end: Date }
    ): Promise<UsageMetrics> {
        const [
            runStats,
            sparksTotal,
            usageLogs,
        ] = await Promise.all([
            // Run statistics
            prisma.forgeFlowRun.groupBy({
                by: ['status'],
                where: {
                    orgId,
                    createdAt: { gte: dateRange.start, lte: dateRange.end },
                },
                _count: true,
            }),

            // Total sparks
            prisma.forgeFlowRun.aggregate({
                where: {
                    orgId,
                    createdAt: { gte: dateRange.start, lte: dateRange.end },
                },
                _sum: { totalSparksUsed: true },
            }),

            // Usage logs by provider and node type
            prisma.forgeUsageLog.findMany({
                where: {
                    orgId,
                    createdAt: { gte: dateRange.start, lte: dateRange.end },
                },
                select: {
                    nodeType: true,
                    provider: true,
                    sparksUsed: true,
                    createdAt: true,
                },
            }),
        ]);

        // Calculate run counts
        let totalRuns = 0;
        let successfulRuns = 0;
        let failedRuns = 0;

        for (const stat of runStats) {
            totalRuns += stat._count;
            if (stat.status === 'success') successfulRuns = stat._count;
            if (stat.status === 'failed') failedRuns = stat._count;
        }

        // Group by day
        const runsByDayMap = new Map<string, { count: number; sparks: number }>();
        for (const log of usageLogs) {
            const dateKey = log.createdAt.toISOString().split('T')[0];
            const existing = runsByDayMap.get(dateKey) || { count: 0, sparks: 0 };
            existing.count += 1;
            existing.sparks += log.sparksUsed;
            runsByDayMap.set(dateKey, existing);
        }

        const runsByDay = Array.from(runsByDayMap.entries())
            .map(([date, data]) => ({ date, ...data }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Group by provider
        const byProviderMap = new Map<string, { count: number; sparks: number }>();
        for (const log of usageLogs) {
            const existing = byProviderMap.get(log.provider) || { count: 0, sparks: 0 };
            existing.count += 1;
            existing.sparks += log.sparksUsed;
            byProviderMap.set(log.provider, existing);
        }

        const runsByProvider = Array.from(byProviderMap.entries())
            .map(([provider, data]) => ({ provider, ...data }))
            .sort((a, b) => b.sparks - a.sparks);

        // Group by node type
        const byNodeTypeMap = new Map<string, { count: number; sparks: number }>();
        for (const log of usageLogs) {
            const existing = byNodeTypeMap.get(log.nodeType) || { count: 0, sparks: 0 };
            existing.count += 1;
            existing.sparks += log.sparksUsed;
            byNodeTypeMap.set(log.nodeType, existing);
        }

        const runsByNodeType = Array.from(byNodeTypeMap.entries())
            .map(([nodeType, data]) => ({ nodeType, ...data }))
            .sort((a, b) => b.sparks - a.sparks);

        return {
            totalRuns,
            successfulRuns,
            failedRuns,
            totalSparksUsed: sparksTotal._sum.totalSparksUsed || 0,
            runsByDay,
            runsByProvider,
            runsByNodeType,
        };
    }

    /**
     * Get run history with pagination
     */
    static async getRunHistory(
        orgId: string,
        options?: {
            limit?: number;
            offset?: number;
            flowId?: string;
            status?: string;
        }
    ): Promise<{
        runs: Array<{
            id: string;
            flowName: string;
            status: string;
            triggerType: string;
            sparksUsed: number;
            startedAt: Date | null;
            finishedAt: Date | null;
            createdAt: Date;
        }>;
        total: number;
    }> {
        const where = {
            orgId,
            ...(options?.flowId && { flowId: options.flowId }),
            ...(options?.status && { status: options.status }),
        };

        const [runs, total] = await Promise.all([
            prisma.forgeFlowRun.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: options?.limit || 20,
                skip: options?.offset || 0,
                include: {
                    flow: { select: { name: true } },
                },
            }),
            prisma.forgeFlowRun.count({ where }),
        ]);

        return {
            runs: runs.map((run) => ({
                id: run.id,
                flowName: run.flow.name,
                status: run.status,
                triggerType: run.triggerType,
                sparksUsed: run.totalSparksUsed,
                startedAt: run.startedAt,
                finishedAt: run.finishedAt,
                createdAt: run.createdAt,
            })),
            total,
        };
    }

    /**
     * Compare Forge vs Workspace Sparks usage
     */
    static async getProductComparison(
        orgId: string,
        dateRange: { start: Date; end: Date }
    ): Promise<{
        forge: number;
        workspace: number;
        total: number;
    }> {
        // Get Forge sparks
        const forgeSparks = await prisma.forgeFlowRun.aggregate({
            where: {
                orgId,
                createdAt: { gte: dateRange.start, lte: dateRange.end },
            },
            _sum: { totalSparksUsed: true },
        });

        // TODO: Get Workspace sparks from sparks_transactions table
        // For now, return placeholder
        const forge = forgeSparks._sum.totalSparksUsed || 0;
        const workspace = 0; // Would query sparks_transactions

        return {
            forge,
            workspace,
            total: forge + workspace,
        };
    }
}
