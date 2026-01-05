import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/analyser/domains - List tracked domains
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        const projects = await prisma.analyserProject.findMany({
            where: {
                userId,
                OR: search ? [
                    { domain: { contains: search, mode: 'insensitive' } },
                    { name: { contains: search, mode: 'insensitive' } },
                ] : undefined,
            },
            include: {
                _count: {
                    select: {
                        keywordSets: true,
                        backlinks: true,
                        competitors: true,
                    }
                },
                domainMetrics: {
                    orderBy: { date: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        // Transform to frontend-friendly format
        const domains = projects.map(project => ({
            id: project.id,
            domain: project.domain,
            name: project.name || project.domain,
            slug: project.slug,
            favicon: project.favicon || `https://www.google.com/s2/favicons?domain=${project.domain}&sz=64`,
            category: project.category,
            country: project.country,
            language: project.language,
            metrics: project.domainMetrics[0] || {
                visits: 0,
                uniqueVisitors: 0,
                bounceRate: 0,
                avgDuration: 0,
            },
            counts: {
                keywords: project._count.keywordSets,
                backlinks: project._count.backlinks,
                competitors: project._count.competitors,
            },
            updatedAt: project.updatedAt,
        }));

        return NextResponse.json({ domains });
    } catch (error) {
        console.error('Error fetching domains:', error);
        return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 });
    }
}

// POST /api/analyser/domains - Add a new domain to track
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

        // Clean and validate domain
        const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
        const slug = cleanDomain.replace(/\./g, '-');

        // Check if domain already exists for this user
        const existing = await prisma.analyserProject.findFirst({
            where: { userId, domain: cleanDomain },
        });

        if (existing) {
            return NextResponse.json({ error: 'Domain already tracked' }, { status: 409 });
        }

        // Create the project
        const project = await prisma.analyserProject.create({
            data: {
                userId,
                domain: cleanDomain,
                slug: `${slug}-${Date.now().toString(36)}`,
                name: name || cleanDomain,
                country,
                language,
                favicon: `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64`,
            },
        });

        // Create initial domain metrics
        await prisma.analyserDomainMetric.create({
            data: {
                projectId: project.id,
                date: new Date(),
                visits: 0,
                uniqueVisitors: 0,
                pageViews: 0,
                bounceRate: 0,
                avgDuration: 0,
                pagesPerVisit: 0,
            },
        });

        return NextResponse.json({
            success: true,
            domain: {
                id: project.id,
                domain: project.domain,
                name: project.name,
                slug: project.slug,
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating domain:', error);
        return NextResponse.json({ error: 'Failed to create domain' }, { status: 500 });
    }
}
