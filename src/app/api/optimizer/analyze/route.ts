import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { OptimizerAIService } from '@/lib/optimizer/ai-service';

// POST /api/optimizer/analyze - Analyze creative performance
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { adId } = body;

        // Get ad with metrics
        const ad = await prisma.optimizerAd.findUnique({
            where: { id: adId },
            include: {
                adSet: {
                    include: {
                        campaign: {
                            include: {
                                connection: true
                            }
                        }
                    }
                },
                metrics: {
                    take: 14,
                    orderBy: { date: 'desc' }
                }
            }
        });

        if (!ad) {
            return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
        }

        // Verify ownership
        const connection = ad.adSet.campaign.connection;
        if (connection.userId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Calculate metrics trends
        const metrics = ad.metrics;
        const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
        const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
        const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);

        // Calculate CTR trend (last 7 days)
        const ctrTrend = metrics.slice(0, 7).map(m =>
            m.impressions > 0 ? (m.clicks / m.impressions) * 100 : 0
        );

        // Estimate frequency from campaign level data
        const frequency = 2.5; // Would come from real platform data

        // Run AI analysis
        const analysis = await OptimizerAIService.analyzeCreative({
            id: ad.id,
            headline: ad.headline || undefined,
            description: ad.description || undefined,
            format: ad.format || 'IMAGE',
            impressions: totalImpressions,
            clicks: totalClicks,
            conversions: totalConversions,
            frequency,
            ctrTrend,
        });

        // Save analysis to database
        await prisma.optimizerCreativeAnalysis.upsert({
            where: { adId },
            create: {
                adId,
                format: ad.format || 'IMAGE',
                textLength: ad.headline?.length || 0,
                hasEmoji: /[\u{1F600}-\u{1F6FF}]/u.test(ad.headline || ''),
                hasQuestion: (ad.headline || '').includes('?'),
                hasCta: /shop|buy|get|learn|discover|try/i.test(ad.headline || ''),
                performanceScore: analysis.performanceScore,
                fatigueScore: analysis.fatigueScore,
                suggestions: analysis.suggestions,
                sentimentScore: analysis.sentiment,
            },
            update: {
                performanceScore: analysis.performanceScore,
                fatigueScore: analysis.fatigueScore,
                suggestions: analysis.suggestions,
                sentimentScore: analysis.sentiment,
                analyzedAt: new Date(),
            }
        });

        return NextResponse.json({
            adId,
            analysis,
        });
    } catch (error) {
        console.error('[Optimizer Analyze] Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze creative' },
            { status: 500 }
        );
    }
}

// GET /api/optimizer/analyze - Get creative analyses
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const sortBy = searchParams.get('sortBy') || 'fatigueScore'; // or performanceScore

        // Get user's connections
        const connections = await prisma.optimizerConnection.findMany({
            where: { userId },
            select: { id: true }
        });

        // Get ads with analyses
        const ads = await prisma.optimizerAd.findMany({
            where: {
                adSet: {
                    campaign: {
                        connectionId: { in: connections.map(c => c.id) }
                    }
                },
                creativeAnalysis: { isNot: null }
            },
            include: {
                creativeAnalysis: true,
                adSet: {
                    include: {
                        campaign: {
                            select: { name: true, connection: { select: { platform: true } } }
                        }
                    }
                },
                metrics: {
                    take: 7,
                    orderBy: { date: 'desc' }
                }
            },
            take: limit
        });

        // Sort based on parameter
        const sorted = ads.sort((a, b) => {
            const aScore = sortBy === 'fatigueScore'
                ? (b.creativeAnalysis?.fatigueScore || 0) - (a.creativeAnalysis?.fatigueScore || 0)
                : (b.creativeAnalysis?.performanceScore || 0) - (a.creativeAnalysis?.performanceScore || 0);
            return aScore;
        });

        // Transform response
        const analyses = sorted.map(ad => ({
            id: ad.id,
            name: ad.name,
            format: ad.format,
            campaignName: ad.adSet.campaign.name,
            platform: ad.adSet.campaign.connection.platform,
            performanceScore: ad.creativeAnalysis?.performanceScore || 0,
            fatigueScore: ad.creativeAnalysis?.fatigueScore || 0,
            suggestions: ad.creativeAnalysis?.suggestions || [],
            analyzedAt: ad.creativeAnalysis?.analyzedAt,
            imageUrl: ad.imageUrl,
        }));

        return NextResponse.json({ analyses });
    } catch (error) {
        console.error('[Optimizer Analyze] GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analyses' },
            { status: 500 }
        );
    }
}
