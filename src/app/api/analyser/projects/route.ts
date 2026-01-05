import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/analyser/projects - List all projects for user
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projects = await prisma.analyserProject.findMany({
            where: { userId },
            include: {
                competitors: true,
                _count: {
                    select: {
                        keywordSets: true,
                        backlinks: true,
                        pages: true,
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error('[Analyser Projects GET]', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST /api/analyser/projects - Create new project
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { domain, name, country = 'US', language = 'en' } = body;

        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        // Create slug from domain
        const slug = domain.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

        // Check if project already exists
        const existing = await prisma.analyserProject.findUnique({
            where: { slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Project with this domain already exists' },
                { status: 400 }
            );
        }

        const project = await prisma.analyserProject.create({
            data: {
                userId,
                domain,
                slug,
                name: name || domain,
                country,
                language,
                // Initial metrics (will be updated by data sync)
                monthlyVisits: 0,
                authorityScore: 0,
                organicKeywords: 0,
                backlinksCount: 0,
            },
            include: {
                competitors: true,
            },
        });

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        console.error('[Analyser Projects POST]', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
