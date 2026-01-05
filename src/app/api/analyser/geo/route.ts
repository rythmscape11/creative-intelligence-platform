/**
 * GEO History API Route
 * GET /api/analyser/geo/history - Get user's GEO analysis history
 * GET /api/analyser/geo/[id] - Get specific analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGeoHistory, getGeoAnalysis, getScoreInterpretation } from '@/lib/analyser/geo-engine';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const analysisId = searchParams.get('id');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Get specific analysis
        if (analysisId) {
            const analysis = await getGeoAnalysis(analysisId, userId);

            if (!analysis) {
                return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
            }

            const interpretation = getScoreInterpretation(analysis.geoScore);

            return NextResponse.json({
                success: true,
                analysis: {
                    ...analysis,
                    interpretation,
                },
            });
        }

        // Get history
        const history = await getGeoHistory(userId, Math.min(limit, 50));

        return NextResponse.json({
            success: true,
            analyses: history.map(a => ({
                ...a,
                interpretation: getScoreInterpretation(a.geoScore),
            })),
        });
    } catch (error: unknown) {
        console.error('[GEO History API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch history' },
            { status: 500 }
        );
    }
}
