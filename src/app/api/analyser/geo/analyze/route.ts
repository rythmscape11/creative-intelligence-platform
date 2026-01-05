/**
 * GEO Analysis API Route
 * POST /api/analyser/geo/analyze
 * 
 * Analyzes a URL for AI search visibility (GEO scoring)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { analyzePageGEO, getScoreInterpretation } from '@/lib/analyser/geo-engine';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { url, targetTopic, targetEngines } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        // Run GEO analysis
        const result = await analyzePageGEO({
            userId,
            url,
            targetTopic,
            targetEngines,
        });

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: result.error,
            }, { status: result.error?.includes('credits') ? 402 : 500 });
        }

        // Add interpretation
        const interpretation = getScoreInterpretation(result.geoScore);

        return NextResponse.json({
            success: true,
            analysisId: result.analysisId,
            geoScore: result.geoScore,
            interpretation,
            scores: result.scores,
            contentSummary: result.contentSummary,
            entities: result.entities,
            qaClustersCovered: result.qaClustersCovered,
            qaClustersGaps: result.qaClustersGaps,
            structuralIssues: result.structuralIssues,
            schemaSuggestions: result.schemaSuggestions,
            recommendations: result.recommendations,
            improvedOutline: result.improvedOutline,
        });
    } catch (error: unknown) {
        console.error('[GEO Analysis API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Analysis failed' },
            { status: 500 }
        );
    }
}
