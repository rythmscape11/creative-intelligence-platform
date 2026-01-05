/**
 * SERP Analysis API Route with LLM Fallback
 * POST /api/analyser/serp - Get SERP results for a keyword
 * 
 * Falls back to LLM analysis when DataForSEO fails or is not configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSerpResults, isDataForSEOConfigured } from '@/lib/analyser/dataforseo';
import { getSerpDataWithLLM } from '@/lib/analyser/llm-fallback';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { keyword, locationCode = 2840, device = 'desktop', force_llm = false } = body;

        if (!keyword) {
            return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
        }

        // Try DataForSEO first unless forced to use LLM
        if (!force_llm && isDataForSEOConfigured) {
            try {
                const result = await getSerpResults(userId, keyword, locationCode, device);

                if (result.success) {
                    return NextResponse.json({
                        success: true,
                        source: 'dataforseo',
                        serp: result.data,
                    });
                }
                console.warn('[SERP API] DataForSEO failed, falling back to LLM:', result.error);
            } catch (apiError) {
                console.warn('[SERP API] DataForSEO error, falling back to LLM:', apiError);
            }
        }

        // LLM Fallback
        const llmResult = await getSerpDataWithLLM(keyword);

        return NextResponse.json({
            success: true,
            source: 'llm_fallback',
            message: 'Analysis powered by AI (DataForSEO unavailable)',
            serp: {
                keyword: llmResult.keyword,
                estimatedResults: llmResult.estimatedResults,
                serpFeatures: llmResult.serpFeatures,
                organicResults: llmResult.topResults.filter(r => r.type === 'organic'),
                featuredSnippet: llmResult.topResults.find(r => r.type === 'featured') || null,
                peopleAlsoAsk: llmResult.peopleAlsoAsk,
                relatedSearches: llmResult.relatedSearches,
                analysis: llmResult.analysis,
            },
        });
    } catch (error: unknown) {
        console.error('[SERP API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to analyze SERP' },
            { status: 500 }
        );
    }
}
