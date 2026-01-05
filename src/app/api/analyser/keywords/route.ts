import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { freeSEODataService } from '@/lib/analyser/data-service';
import { analyserAIService } from '@/lib/analyser/ai-service';

// GET /api/analyser/keywords - Get keywords for a project
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
        }

        // Verify project ownership
        const project = await prisma.analyserProject.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const keywordSets = await prisma.analyserKeywordSet.findMany({
            where: { projectId },
            include: {
                keywords: {
                    orderBy: { searchVolume: 'desc' },
                },
            },
        });

        // Flatten keywords with set info
        const keywords = keywordSets.flatMap(set =>
            set.keywords.map(kw => ({
                ...kw,
                setName: set.name,
                setId: set.id,
            }))
        );

        return NextResponse.json({ keywords, keywordSets });
    } catch (error) {
        console.error('[Analyser Keywords GET]', error);
        return NextResponse.json(
            { error: 'Failed to fetch keywords' },
            { status: 500 }
        );
    }
}

// POST /api/analyser/keywords - Add keywords to a project
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { projectId, keywords, setName = 'Default' } = body;

        if (!projectId || !keywords?.length) {
            return NextResponse.json(
                { error: 'Project ID and keywords required' },
                { status: 400 }
            );
        }

        // Verify project ownership
        const project = await prisma.analyserProject.findFirst({
            where: { id: projectId, userId },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Find or create keyword set
        let keywordSet = await prisma.analyserKeywordSet.findFirst({
            where: { projectId, name: setName },
        });

        if (!keywordSet) {
            keywordSet = await prisma.analyserKeywordSet.create({
                data: {
                    projectId,
                    name: setName,
                    country: project.country,
                },
            });
        }

        // Get metrics for keywords using free service
        const keywordMetrics = await Promise.all(
            keywords.map((kw: string) => freeSEODataService.estimateKeywordMetrics(kw))
        );

        // Create keywords with metrics
        const createdKeywords = await Promise.all(
            keywordMetrics.map(async (metrics) => {
                return prisma.analyserKeyword.upsert({
                    where: {
                        keywordSetId: keywordSet!.id,
                        keyword: metrics.keyword,
                    },
                    update: {
                        searchVolume: metrics.volume,
                        difficulty: metrics.competition * 100,
                        cpc: metrics.cpc,
                        trend: metrics.trend[metrics.trend.length - 1] - metrics.trend[0],
                    },
                    create: {
                        keywordSetId: keywordSet!.id,
                        keyword: metrics.keyword,
                        searchVolume: metrics.volume,
                        difficulty: metrics.competition * 100,
                        cpc: metrics.cpc,
                        trend: metrics.trend[metrics.trend.length - 1] - metrics.trend[0],
                    },
                });
            })
        );

        // Update project keyword count
        const totalKeywords = await prisma.analyserKeyword.count({
            where: {
                keywordSet: {
                    projectId,
                },
            },
        });

        await prisma.analyserProject.update({
            where: { id: projectId },
            data: { organicKeywords: totalKeywords },
        });

        return NextResponse.json({ keywords: createdKeywords, keywordSet });
    } catch (error) {
        console.error('[Analyser Keywords POST]', error);
        return NextResponse.json(
            { error: 'Failed to add keywords' },
            { status: 500 }
        );
    }
}

// POST /api/analyser/keywords/research - AI-powered keyword research
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { seedKeyword, projectId } = body;

        if (!seedKeyword) {
            return NextResponse.json(
                { error: 'Seed keyword required' },
                { status: 400 }
            );
        }

        let domain = 'your-site.com';
        if (projectId) {
            const project = await prisma.analyserProject.findFirst({
                where: { id: projectId, userId },
            });
            if (project) domain = project.domain;
        }

        // Get related keywords
        const relatedKeywords = await freeSEODataService.getRelatedKeywords(seedKeyword, 15);

        // Get metrics for all keywords
        const allKeywords = [seedKeyword, ...relatedKeywords];
        const keywordAnalysis = await analyserAIService.analyzeKeywords(allKeywords, domain);

        return NextResponse.json({
            seedKeyword,
            related: relatedKeywords,
            analysis: keywordAnalysis,
        });
    } catch (error) {
        console.error('[Analyser Keywords Research]', error);
        return NextResponse.json(
            { error: 'Failed to research keywords' },
            { status: 500 }
        );
    }
}
