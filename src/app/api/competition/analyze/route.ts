import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CompetitionAnalysisService } from '@/lib/services/competition-analysis-service';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Optional: Check subscription tier here
        // const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscription: true } });
        // if (user?.subscription?.plan !== 'PRO' && user?.subscription?.plan !== 'ENTERPRISE') { ... }

        const body = await req.json();
        const { competitors, industry, focusArea } = body;

        if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
            return NextResponse.json({ error: 'Competitors list is required' }, { status: 400 });
        }
        if (!industry) {
            return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
        }

        // Ensure competitors are in the correct format
        const formattedCompetitors = competitors.map((c: any) => ({
            name: typeof c === 'string' ? c : c.name,
            url: typeof c === 'string' ? undefined : c.url
        }));

        const result = await CompetitionAnalysisService.analyze({
            competitors: formattedCompetitors,
            industry,
            focusArea,
        });

        // Log usage
        await prisma.userActivity.create({
            data: {
                userId,
                action: 'COMPETITION_ANALYSIS',
                entityType: 'REPORT',
                details: JSON.stringify({ industry, competitorCount: competitors.length }),
            },
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
