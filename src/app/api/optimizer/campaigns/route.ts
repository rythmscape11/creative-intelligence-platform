import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/optimizer/campaigns - List all campaigns across all connections
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const platform = searchParams.get('platform');
        const connectionId = searchParams.get('connectionId');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Get all user's connections first
        const connections = await prisma.optimizerConnection.findMany({
            where: { userId },
            select: { id: true }
        });

        const connectionIds = connections.map(c => c.id);

        // Build where clause
        const where: any = {
            connectionId: { in: connectionIds }
        };

        if (status) {
            where.status = status;
        }

        if (connectionId && connectionIds.includes(connectionId)) {
            where.connectionId = connectionId;
        }

        // Fetch campaigns with latest metrics
        const campaigns = await prisma.optimizerCampaign.findMany({
            where,
            include: {
                connection: {
                    select: {
                        platform: true,
                        accountName: true
                    }
                },
                metrics: {
                    take: 7,
                    orderBy: { date: 'desc' }
                },
                _count: {
                    select: { adSets: true, suggestions: true }
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: limit,
            skip: offset
        });

        // Calculate aggregated metrics for each campaign
        const campaignsWithStats = campaigns.map(campaign => {
            const last7Days = campaign.metrics;
            const totalSpend = last7Days.reduce((sum, m) => sum + m.spend, 0);
            const totalRevenue = last7Days.reduce((sum, m) => sum + m.revenue, 0);
            const totalConversions = last7Days.reduce((sum, m) => sum + m.conversions, 0);
            const totalClicks = last7Days.reduce((sum, m) => sum + m.clicks, 0);
            const totalImpressions = last7Days.reduce((sum, m) => sum + m.impressions, 0);

            return {
                ...campaign,
                stats7d: {
                    spend: totalSpend,
                    revenue: totalRevenue,
                    conversions: totalConversions,
                    clicks: totalClicks,
                    impressions: totalImpressions,
                    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
                    cpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
                    ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
                }
            };
        });

        const total = await prisma.optimizerCampaign.count({ where });

        return NextResponse.json({
            campaigns: campaignsWithStats,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + campaigns.length < total
            }
        });
    } catch (error) {
        console.error('[Optimizer Campaigns] GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaigns' },
            { status: 500 }
        );
    }
}
