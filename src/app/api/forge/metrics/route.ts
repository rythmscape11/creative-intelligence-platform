/**
 * Forge Metrics API
 * GET - Get dashboard stats and usage metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeMetricsService } from '@/lib/services/forge';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'dashboard';

        if (type === 'dashboard') {
            const stats = await ForgeMetricsService.getDashboardStats(userId);
            return NextResponse.json({ stats });
        }

        if (type === 'usage') {
            const startStr = searchParams.get('start');
            const endStr = searchParams.get('end');

            const end = endStr ? new Date(endStr) : new Date();
            const start = startStr
                ? new Date(startStr)
                : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days default

            const metrics = await ForgeMetricsService.getUsageMetrics(userId, { start, end });
            return NextResponse.json({ metrics });
        }

        if (type === 'runs') {
            const limit = parseInt(searchParams.get('limit') || '20');
            const offset = parseInt(searchParams.get('offset') || '0');
            const flowId = searchParams.get('flowId') || undefined;
            const status = searchParams.get('status') || undefined;

            const result = await ForgeMetricsService.getRunHistory(userId, {
                limit,
                offset,
                flowId,
                status,
            });
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch metrics' },
            { status: 500 }
        );
    }
}
