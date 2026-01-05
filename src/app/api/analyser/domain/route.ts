/**
 * Domain Analysis API Route with LLM Fallback
 * POST /api/analyser/domain - Get domain overview and keywords
 * 
 * Falls back to LLM analysis when DataForSEO fails or is not configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDomainOverview, getDomainKeywords, isDataForSEOConfigured } from '@/lib/analyser/dataforseo';
import { getDomainDataWithLLM } from '@/lib/analyser/llm-fallback';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { domain, action = 'overview', locationCode = 2840, limit = 100, force_llm = false } = body;

        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        // Clean domain
        const cleanDomain = domain
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '');

        // Try DataForSEO first unless forced to use LLM
        if (!force_llm && isDataForSEOConfigured) {
            try {
                if (action === 'keywords') {
                    const result = await getDomainKeywords(userId, cleanDomain, locationCode, limit);

                    if (result.success) {
                        return NextResponse.json({
                            success: true,
                            source: 'dataforseo',
                            domain: cleanDomain,
                            keywords: result.data,
                        });
                    }
                } else {
                    const result = await getDomainOverview(userId, cleanDomain, locationCode);

                    if (result.success) {
                        return NextResponse.json({
                            success: true,
                            source: 'dataforseo',
                            overview: result.data,
                        });
                    }
                }
                console.warn('[Domain API] DataForSEO failed, falling back to LLM');
            } catch (apiError) {
                console.warn('[Domain API] DataForSEO error, falling back to LLM:', apiError);
            }
        }

        // LLM Fallback
        const llmResult = await getDomainDataWithLLM(cleanDomain);

        if (action === 'keywords') {
            return NextResponse.json({
                success: true,
                source: 'llm_fallback',
                message: 'Analysis powered by AI (DataForSEO unavailable)',
                domain: cleanDomain,
                keywords: llmResult.topKeywords.map((k, i) => ({
                    position: i + 1,
                    keyword: k.keyword,
                    estimatedPosition: k.estimatedPosition,
                    estimatedVolume: k.estimatedVolume,
                    source: 'llm_fallback',
                })),
            });
        }

        return NextResponse.json({
            success: true,
            source: 'llm_fallback',
            message: 'Analysis powered by AI (DataForSEO unavailable)',
            overview: {
                domain: cleanDomain,
                estimatedTraffic: llmResult.estimatedTraffic,
                estimatedKeywords: llmResult.estimatedKeywords,
                domainAuthority: llmResult.domainAuthority,
                topPages: llmResult.topPages,
                competitors: llmResult.competitors,
                analysis: llmResult.analysis,
            },
        });
    } catch (error: unknown) {
        console.error('[Domain API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to analyze domain' },
            { status: 500 }
        );
    }
}
