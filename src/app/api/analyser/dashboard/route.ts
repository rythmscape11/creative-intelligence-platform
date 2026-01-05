/**
 * Analyser Dashboard API
 * Aggregate analysis data for dashboard display
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/analyser/dashboard
 * Get aggregated analysis data
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get analysis counts and recent analyses
        const [
            seoAudits,
            keywordAnalyses,
            geoAnalyses,
            credits,
        ] = await Promise.all([
            prisma.seoAudit.count({ where: { userId: user.id } }),
            prisma.keywordAnalysis.count({ where: { userId: user.id } }),
            prisma.geoAnalysis.count({ where: { userId: user.id } }),
            prisma.analyserCredits.findUnique({ where: { userId: user.id } }),
        ]);

        // Get recent analyses
        const recentAudits = await prisma.seoAudit.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, url: true, overallScore: true, createdAt: true },
        });

        const recentKeywords = await prisma.keywordAnalysis.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, keyword: true, searchVolume: true, difficulty: true, createdAt: true },
        });

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalSeoAudits: seoAudits,
                    totalKeywordAnalyses: keywordAnalyses,
                    totalGeoAnalyses: geoAnalyses,
                    creditsRemaining: credits?.creditsRemaining || 0,
                    creditsMonthly: credits?.monthlyCredits || 0,
                },
                recent: {
                    audits: recentAudits,
                    keywords: recentKeywords,
                },
            },
        });
    } catch (error) {
        console.error('[Analyser Dashboard API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
