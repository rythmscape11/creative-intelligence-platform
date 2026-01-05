import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { FreeSEODataService } from '@/lib/analyser/data-service';

const dataService = new FreeSEODataService();

// GET /api/analyser/traffic - Get traffic analytics data
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 12m

        if (!projectId) {
            return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
        }

        // Verify project belongs to user
        const project = await prisma.analyserProject.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Get date range
        const now = new Date();
        let startDate: Date;
        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '12m':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default: // 30d
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get domain metrics
        const domainMetrics = await prisma.analyserDomainMetric.findMany({
            where: {
                projectId,
                date: { gte: startDate },
            },
            orderBy: { date: 'asc' },
        });

        // Get traffic source breakdown
        const trafficMetrics = await prisma.analyserTrafficMetric.findMany({
            where: {
                projectId,
                date: { gte: startDate },
            },
            orderBy: { date: 'desc' },
        });

        // If no data exists, generate estimates
        if (domainMetrics.length === 0) {
            const estimates = dataService.getTrafficSourceEstimates(project.domain);

            return NextResponse.json({
                domain: project.domain,
                period,
                summary: {
                    totalVisits: estimates.totalVisits,
                    uniqueVisitors: Math.round(estimates.totalVisits * 0.7),
                    pageViews: Math.round(estimates.totalVisits * 2.5),
                    bounceRate: 45 + Math.random() * 15,
                    avgDuration: 120 + Math.random() * 60,
                    pagesPerVisit: 2 + Math.random() * 2,
                },
                sources: estimates.sources,
                trend: generateTrendData(period),
                isEstimated: true,
            });
        }

        // Aggregate traffic sources
        const sourceAggregation: Record<string, { visits: number; share: number }> = {};
        trafficMetrics.forEach(metric => {
            if (!sourceAggregation[metric.source]) {
                sourceAggregation[metric.source] = { visits: 0, share: 0 };
            }
            sourceAggregation[metric.source].visits += metric.visits;
        });

        const totalSourceVisits = Object.values(sourceAggregation).reduce((sum, s) => sum + s.visits, 0);
        Object.keys(sourceAggregation).forEach(source => {
            sourceAggregation[source].share = totalSourceVisits > 0
                ? (sourceAggregation[source].visits / totalSourceVisits) * 100
                : 0;
        });

        // Calculate summary
        const latestMetric = domainMetrics[domainMetrics.length - 1];
        const summary = {
            totalVisits: domainMetrics.reduce((sum, m) => sum + m.visits, 0),
            uniqueVisitors: domainMetrics.reduce((sum, m) => sum + m.uniqueVisitors, 0),
            pageViews: domainMetrics.reduce((sum, m) => sum + m.pageViews, 0),
            bounceRate: latestMetric?.bounceRate || 0,
            avgDuration: latestMetric?.avgDuration || 0,
            pagesPerVisit: latestMetric?.pagesPerVisit || 0,
        };

        return NextResponse.json({
            domain: project.domain,
            period,
            summary,
            sources: Object.entries(sourceAggregation).map(([source, data]) => ({
                source,
                ...data,
            })),
            trend: domainMetrics.map(m => ({
                date: m.date.toISOString().split('T')[0],
                visits: m.visits,
                pageViews: m.pageViews,
            })),
            isEstimated: false,
        });
    } catch (error) {
        console.error('Error fetching traffic data:', error);
        return NextResponse.json({ error: 'Failed to fetch traffic data' }, { status: 500 });
    }
}

function generateTrendData(period: string) {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const data = [];
    const baseVisits = 1000 + Math.random() * 5000;

    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.5) * 0.4;
        const dayOfWeek = date.getDay();
        const weekendDip = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;

        data.push({
            date: date.toISOString().split('T')[0],
            visits: Math.round(baseVisits * (1 + variance) * weekendDip),
            pageViews: Math.round(baseVisits * 2.5 * (1 + variance) * weekendDip),
        });
    }

    return data;
}
