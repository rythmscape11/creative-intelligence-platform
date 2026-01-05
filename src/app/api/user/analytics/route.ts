import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/user/analytics
 * Returns user analytics data for the dashboard
 */
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') || '30d';

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (timeframe) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                break;
            case '90d':
                startDate.setDate(now.getDate() - 90);
                break;
            default: // 30d
                startDate.setDate(now.getDate() - 30);
        }

        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch strategies count
        const [totalStrategies, strategiesThisMonth] = await Promise.all([
            prisma.strategy.count({
                where: { userId }
            }),
            prisma.strategy.count({
                where: {
                    userId,
                    createdAt: { gte: monthStart }
                }
            })
        ]);

        // Fetch exports count
        const [totalExports, exportsThisMonth] = await Promise.all([
            prisma.strategyExport.count({
                where: {
                    strategy: { userId }
                }
            }).catch(() => 0),
            prisma.strategyExport.count({
                where: {
                    strategy: { userId },
                    createdAt: { gte: monthStart }
                }
            }).catch(() => 0)
        ]);

        // Fetch user activity (tool usage)
        const toolUsageCount = await prisma.userActivity.count({
            where: {
                userId,
                action: { in: ['TOOL_USE', 'STRATEGY_GENERATE', 'EXPORT_PDF', 'EXPORT_DOCX', 'EXPORT_PPTX'] },
                createdAt: { gte: startDate }
            }
        }).catch(() => 0);

        // Fetch recent strategies
        const recentStrategies = await prisma.strategy.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                title: true,
                createdAt: true,
                status: true
            }
        });

        // Calculate average generation time (mock for now - would need logging)
        const avgGenerationTime = 15; // seconds

        return NextResponse.json({
            strategiesGenerated: totalStrategies,
            strategiesThisMonth,
            totalExports,
            exportsThisMonth,
            toolUsageCount,
            avgGenerationTime,
            recentStrategies: recentStrategies.map(s => ({
                id: s.id,
                title: s.title || 'Untitled Strategy',
                createdAt: s.createdAt.toISOString(),
                status: s.status || 'COMPLETED'
            }))
        });

    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
