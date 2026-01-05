import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { FreeSEODataService } from '@/lib/analyser/data-service';

const dataService = new FreeSEODataService();

// GET /api/analyser/competitors - Get competitor analysis data
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
        }

        // Verify project belongs to user
        const project = await prisma.analyserProject.findFirst({
            where: { id: projectId, userId },
            include: {
                competitors: true,
                domainMetrics: {
                    orderBy: { date: 'desc' },
                    take: 1,
                },
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // If no competitors, return demo data
        if (project.competitors.length === 0) {
            const demoCompetitors = generateDemoCompetitors(project.domain);
            const mainDomainMetrics = dataService.estimateDomainMetrics(project.domain);

            return NextResponse.json({
                domain: project.domain,
                mainDomain: {
                    domain: project.domain,
                    name: project.name,
                    ...mainDomainMetrics,
                },
                competitors: demoCompetitors,
                comparison: {
                    traffic: generateComparisonChart('traffic', project.domain, demoCompetitors),
                    authority: generateComparisonChart('authority', project.domain, demoCompetitors),
                    keywords: generateComparisonChart('keywords', project.domain, demoCompetitors),
                },
                isEstimated: true,
            });
        }

        // Get real competitor data
        const competitorData = await Promise.all(
            project.competitors.map(async (comp) => {
                const metrics = dataService.estimateDomainMetrics(comp.domain);
                return {
                    id: comp.id,
                    domain: comp.domain,
                    name: comp.name || comp.domain,
                    ...metrics,
                };
            })
        );

        const mainDomainMetrics = dataService.estimateDomainMetrics(project.domain);

        return NextResponse.json({
            domain: project.domain,
            mainDomain: {
                domain: project.domain,
                name: project.name,
                ...mainDomainMetrics,
            },
            competitors: competitorData,
            comparison: {
                traffic: generateComparisonChart('traffic', project.domain, competitorData),
                authority: generateComparisonChart('authority', project.domain, competitorData),
                keywords: generateComparisonChart('keywords', project.domain, competitorData),
            },
            isEstimated: true,
        });
    } catch (error) {
        console.error('Error fetching competitors:', error);
        return NextResponse.json({ error: 'Failed to fetch competitors' }, { status: 500 });
    }
}

// POST /api/analyser/competitors - Add a competitor
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { projectId, domain, name } = body;

        if (!projectId || !domain) {
            return NextResponse.json({ error: 'projectId and domain are required' }, { status: 400 });
        }

        // Verify project belongs to user
        const project = await prisma.analyserProject.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Clean domain
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();

        // Check if competitor already exists
        const existing = await prisma.analyserCompetitor.findFirst({
            where: { projectId, domain: cleanDomain },
        });

        if (existing) {
            return NextResponse.json({ error: 'Competitor already added' }, { status: 409 });
        }

        // Create competitor
        const competitor = await prisma.analyserCompetitor.create({
            data: {
                projectId,
                domain: cleanDomain,
                name: name || cleanDomain,
            },
        });

        return NextResponse.json({
            success: true,
            competitor: {
                id: competitor.id,
                domain: competitor.domain,
                name: competitor.name,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding competitor:', error);
        return NextResponse.json({ error: 'Failed to add competitor' }, { status: 500 });
    }
}

function generateDemoCompetitors(mainDomain: string) {
    const competitorDomains = [
        { domain: 'competitor1.com', name: 'Competitor One' },
        { domain: 'competitor2.com', name: 'Competitor Two' },
        { domain: 'competitor3.com', name: 'Competitor Three' },
    ];

    const dataService = new FreeSEODataService();

    return competitorDomains.map((comp, i) => ({
        id: `demo-${i}`,
        domain: comp.domain,
        name: comp.name,
        ...dataService.estimateDomainMetrics(comp.domain),
    }));
}

interface CompetitorData {
    domain: string;
    name?: string;
    estimatedTraffic?: number;
    domainAuthority?: number;
    organicKeywords?: number;
}

function generateComparisonChart(metric: string, mainDomain: string, competitors: CompetitorData[]) {
    const dataService = new FreeSEODataService();
    const mainMetrics = dataService.estimateDomainMetrics(mainDomain);

    const data = [
        { domain: mainDomain, value: getMetricValue(mainMetrics, metric), isMain: true },
        ...competitors.map(c => ({
            domain: c.domain,
            value: getMetricValue(c, metric),
            isMain: false,
        })),
    ];

    return data.sort((a, b) => b.value - a.value);
}

function getMetricValue(metrics: Record<string, unknown>, metric: string): number {
    switch (metric) {
        case 'traffic':
            return (metrics.estimatedTraffic as number) || 0;
        case 'authority':
            return (metrics.domainAuthority as number) || 0;
        case 'keywords':
            return (metrics.organicKeywords as number) || 0;
        default:
            return 0;
    }
}
