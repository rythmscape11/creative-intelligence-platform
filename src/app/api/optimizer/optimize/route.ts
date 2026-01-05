import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { OptimizerAIService } from '@/lib/optimizer/ai-service';

// POST /api/optimizer/optimize - Run AI optimization
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, objective = 'ROAS' } = body;

        // Get user's connections
        const connections = await prisma.optimizerConnection.findMany({
            where: { userId },
            select: { id: true }
        });

        if (connections.length === 0) {
            return NextResponse.json({
                error: 'No connected platforms found',
            }, { status: 400 });
        }

        // Get campaigns with metrics
        const campaigns = await prisma.optimizerCampaign.findMany({
            where: {
                connectionId: { in: connections.map(c => c.id) },
                status: 'ACTIVE'
            },
            include: {
                connection: { select: { platform: true } },
                metrics: {
                    take: 7,
                    orderBy: { date: 'desc' }
                }
            }
        });

        // Transform data for AI service
        const campaignData = campaigns.map(c => {
            const metrics = c.metrics;
            const totalSpend = metrics.reduce((sum, m) => sum + m.spend, 0);
            const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0);
            const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);
            const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
            const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);

            return {
                id: c.id,
                name: c.name,
                platform: c.connection.platform,
                dailyBudget: c.dailyBudget || 0,
                spend: totalSpend,
                revenue: totalRevenue,
                conversions: totalConversions,
                clicks: totalClicks,
                impressions: totalImpressions,
                roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
                cpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
                ctr: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
            };
        });

        let result;

        switch (type) {
            case 'BUDGET':
                const totalBudget = campaignData.reduce((sum, c) => sum + c.dailyBudget, 0);
                result = await OptimizerAIService.optimizeBudgets(
                    campaignData,
                    totalBudget,
                    objective
                );
                break;

            case 'SUGGESTIONS':
                result = await OptimizerAIService.generateSuggestions(
                    campaignData,
                    userId
                );

                // Save suggestions to database
                for (const suggestion of result) {
                    await prisma.optimizerSuggestion.create({
                        data: {
                            userId,
                            campaignId: suggestion.action.targetId,
                            type: suggestion.type,
                            category: suggestion.category,
                            title: suggestion.title,
                            description: suggestion.description,
                            impactMetric: 'roas',
                            impactValue: suggestion.impactValue,
                            confidence: suggestion.confidence,
                            action: suggestion.action,
                            priority: suggestion.priority,
                            status: 'PENDING',
                        }
                    });
                }
                break;

            default:
                return NextResponse.json({
                    error: 'Invalid optimization type. Use BUDGET or SUGGESTIONS',
                }, { status: 400 });
        }

        return NextResponse.json({
            type,
            objective,
            campaignsAnalyzed: campaigns.length,
            result,
        });
    } catch (error) {
        console.error('[Optimizer Optimize] Error:', error);
        return NextResponse.json(
            { error: 'Failed to run optimization' },
            { status: 500 }
        );
    }
}
