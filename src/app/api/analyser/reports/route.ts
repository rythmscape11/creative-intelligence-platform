import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/analyser/reports - List reports
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        const whereClause: Record<string, unknown> = { userId };
        if (projectId) {
            whereClause.projectId = projectId;
        }

        const reports = await prisma.analyserReport.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                project: {
                    select: { domain: true, name: true },
                },
            },
        });

        // If no reports, return demo data
        if (reports.length === 0) {
            const demoReports = generateDemoReports();
            return NextResponse.json({
                reports: demoReports,
                isEstimated: true,
            });
        }

        return NextResponse.json({
            reports: reports.map(r => ({
                id: r.id,
                title: r.title,
                type: r.type,
                status: r.status,
                domain: r.project?.domain,
                projectName: r.project?.name,
                schedule: r.schedule,
                lastRun: r.lastRun,
                nextRun: r.nextRun,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            })),
            isEstimated: false,
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}

// POST /api/analyser/reports - Create a report
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { projectId, title, type, schedule, sections } = body;

        if (!projectId || !title || !type) {
            return NextResponse.json({ error: 'projectId, title, and type are required' }, { status: 400 });
        }

        // Verify project belongs to user
        const project = await prisma.analyserProject.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Create report
        const report = await prisma.analyserReport.create({
            data: {
                userId,
                projectId,
                title,
                type,
                status: 'DRAFT',
                schedule: schedule || null,
                sections: sections || [],
                nextRun: schedule ? calculateNextRun(schedule) : null,
            },
        });

        return NextResponse.json({
            success: true,
            report: {
                id: report.id,
                title: report.title,
                type: report.type,
                status: report.status,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
    }
}

function calculateNextRun(schedule: string): Date {
    const now = new Date();
    switch (schedule) {
        case 'daily':
            return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        case 'weekly':
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case 'monthly':
            return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        default:
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
}

function generateDemoReports() {
    return [
        {
            id: 'demo-1',
            title: 'Weekly SEO Performance',
            type: 'seo_overview',
            status: 'COMPLETED',
            domain: 'example.com',
            projectName: 'Example Site',
            schedule: 'weekly',
            lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            nextRun: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'demo-2',
            title: 'Monthly Traffic Report',
            type: 'traffic_analysis',
            status: 'COMPLETED',
            domain: 'example.com',
            projectName: 'Example Site',
            schedule: 'monthly',
            lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            nextRun: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'demo-3',
            title: 'Competitor Analysis',
            type: 'competitor_comparison',
            status: 'DRAFT',
            domain: 'example.com',
            projectName: 'Example Site',
            schedule: null,
            lastRun: null,
            nextRun: null,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];
}
