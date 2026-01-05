/**
 * Usage API Route
 * GET /api/analyser/usage - Get user's usage history and summary
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUsageHistory, getUsageSummary } from '@/lib/analyser/usage-service';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, all

        // Calculate date range
        let startDate: Date | undefined;
        const endDate = new Date();

        switch (period) {
            case '7d':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate = undefined;
        }

        // Get usage data
        const [history, summary] = await Promise.all([
            getUsageHistory(userId, Math.min(limit, 100), offset),
            getUsageSummary(userId, startDate, endDate),
        ]);

        return NextResponse.json({
            success: true,
            period,
            summary: {
                totalOperations: summary.totalOperations,
                totalCreditsUsed: summary.totalCreditsUsed,
                totalApiCostUsd: Math.round(summary.totalApiCostUsd * 1000) / 1000,
                totalBilledUsd: Math.round(summary.totalBilledUsd * 1000) / 1000,
                byOperation: summary.byOperation,
            },
            history: history.logs.map(log => ({
                id: log.id,
                operation: log.operationType,
                units: log.unitsUsed,
                credits: log.creditsCost,
                costUsd: log.totalBilledUsd,
                success: log.success,
                timestamp: log.createdAt,
            })),
            pagination: {
                total: history.total,
                limit: history.limit,
                offset: history.offset,
            },
        });
    } catch (error: unknown) {
        console.error('[Usage API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch usage' },
            { status: 500 }
        );
    }
}
