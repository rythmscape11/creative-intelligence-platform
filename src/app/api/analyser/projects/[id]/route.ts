import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { freeSEODataService } from '@/lib/analyser/data-service';

// GET /api/analyser/projects/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const project = await prisma.analyserProject.findFirst({
            where: { id, userId },
            include: {
                competitors: true,
                keywordSets: {
                    include: {
                        keywords: {
                            take: 20,
                            orderBy: { searchVolume: 'desc' },
                        },
                    },
                },
                domainMetrics: {
                    take: 30,
                    orderBy: { date: 'desc' },
                },
                trafficMetrics: {
                    take: 7,
                    orderBy: { date: 'desc' },
                },
                pages: {
                    take: 10,
                    orderBy: { visits: 'desc' },
                },
                auditIssues: {
                    where: { status: 'OPEN' },
                    take: 20,
                    orderBy: { severity: 'asc' },
                },
                _count: {
                    select: {
                        backlinks: true,
                        reports: true,
                    },
                },
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('[Analyser Project GET]', error);
        return NextResponse.json(
            { error: 'Failed to fetch project' },
            { status: 500 }
        );
    }
}

// PATCH /api/analyser/projects/[id] - Update project
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Verify ownership
        const existing = await prisma.analyserProject.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const { name, country, language } = body;

        const project = await prisma.analyserProject.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(country && { country }),
                ...(language && { language }),
            },
        });

        return NextResponse.json({ project });
    } catch (error) {
        console.error('[Analyser Project PATCH]', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

// DELETE /api/analyser/projects/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const existing = await prisma.analyserProject.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        await prisma.analyserProject.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Analyser Project DELETE]', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}

// POST /api/analyser/projects/[id]/refresh - Refresh project metrics
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const project = await prisma.analyserProject.findFirst({
            where: { id, userId },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Get estimated metrics from free data service
        const metrics = await freeSEODataService.estimateDomainMetrics(project.domain);

        // Update project with new metrics
        const updated = await prisma.analyserProject.update({
            where: { id },
            data: {
                monthlyVisits: metrics.traffic,
                authorityScore: metrics.authority,
                organicKeywords: metrics.organicKeywords,
                backlinksCount: metrics.backlinks,
            },
        });

        // Add daily metric record
        await prisma.analyserDomainMetric.upsert({
            where: {
                projectId_date: {
                    projectId: id,
                    date: new Date(new Date().toISOString().split('T')[0]),
                },
            },
            update: {
                visits: metrics.traffic,
                authorityScore: metrics.authority,
            },
            create: {
                projectId: id,
                date: new Date(new Date().toISOString().split('T')[0]),
                visits: metrics.traffic,
                uniqueVisitors: Math.round(metrics.traffic * 0.7),
                pageViews: Math.round(metrics.traffic * 2.5),
                bounceRate: 40 + Math.random() * 20,
                avgDuration: 120 + Math.random() * 180,
                pagesPerVisit: 2 + Math.random() * 2,
                authorityScore: metrics.authority,
            },
        });

        return NextResponse.json({ project: updated, metrics });
    } catch (error) {
        console.error('[Analyser Project Refresh]', error);
        return NextResponse.json(
            { error: 'Failed to refresh project metrics' },
            { status: 500 }
        );
    }
}
