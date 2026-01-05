/**
 * DataForSEO Keyword Research API with LLM Fallback
 * POST /api/analyser/keywords/dataforseo - Premium keyword data
 * 
 * Falls back to LLM analysis when DataForSEO API fails or is not configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getKeywordData, getKeywordIdeas, isDataForSEOConfigured } from '@/lib/analyser/dataforseo';
import { getKeywordDataWithLLM } from '@/lib/analyser/llm-fallback';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { keywords, seedKeyword, locationCode = 2840, action = 'lookup', force_llm = false } = body;

        // Keyword ideas
        if (action === 'ideas' && seedKeyword) {
            // Try DataForSEO first unless forced to use LLM
            if (!force_llm && isDataForSEOConfigured) {
                try {
                    const result = await getKeywordIdeas(userId, seedKeyword, locationCode, 50);

                    if (result.success) {
                        return NextResponse.json({
                            success: true,
                            source: 'dataforseo',
                            seedKeyword,
                            keywords: result.data,
                        });
                    }
                    console.warn('[Keywords API] DataForSEO failed, falling back to LLM:', result.error);
                } catch (apiError) {
                    console.warn('[Keywords API] DataForSEO error, falling back to LLM:', apiError);
                }
            }

            // LLM Fallback for keyword ideas
            const llmResult = await getKeywordDataWithLLM([seedKeyword]);
            const relatedKeywords = llmResult[0]?.relatedKeywords || [];

            return NextResponse.json({
                success: true,
                source: 'llm_fallback',
                message: 'Analysis powered by AI (DataForSEO unavailable)',
                seedKeyword,
                keywords: [
                    ...llmResult,
                    ...relatedKeywords.map((kw: string) => ({
                        keyword: kw,
                        estimatedVolume: 'Related keyword',
                        volumeRange: 'N/A',
                        competition: 'medium',
                        difficulty: 50,
                        source: 'llm_fallback',
                    })),
                ],
            });
        }

        // Keyword lookup
        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json({ error: 'Keywords array is required' }, { status: 400 });
        }

        if (keywords.length > 100) {
            return NextResponse.json({ error: 'Maximum 100 keywords per request' }, { status: 400 });
        }

        // Try DataForSEO first unless forced to use LLM
        if (!force_llm && isDataForSEOConfigured) {
            try {
                const result = await getKeywordData(userId, keywords, locationCode);

                if (result.success) {
                    return NextResponse.json({
                        success: true,
                        source: 'dataforseo',
                        keywords: result.data,
                        creditsUsed: result.creditsUsed,
                    });
                }
                console.warn('[Keywords API] DataForSEO failed, falling back to LLM:', result.error);
            } catch (apiError) {
                console.warn('[Keywords API] DataForSEO error, falling back to LLM:', apiError);
            }
        }

        // LLM Fallback
        const llmResult = await getKeywordDataWithLLM(keywords);

        return NextResponse.json({
            success: true,
            source: 'llm_fallback',
            message: 'Analysis powered by AI (DataForSEO unavailable)',
            keywords: llmResult,
            creditsUsed: 0,
        });
    } catch (error: unknown) {
        console.error('[Keywords DataForSEO API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch keywords' },
            { status: 500 }
        );
    }
}
