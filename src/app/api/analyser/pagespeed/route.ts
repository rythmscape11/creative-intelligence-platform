/**
 * PageSpeed Insights API Route with LLM Fallback
 * 
 * GET /api/analyser/pagespeed?url=<url>&strategy=<mobile|desktop>
 * POST /api/analyser/pagespeed { url, strategy }
 * 
 * Returns Core Web Vitals and performance scores.
 * Falls back to LLM-based analysis when PageSpeed API quota is exceeded.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzePageSpeed, assessCoreWebVitals } from '@/lib/pagespeed';
import { analyzeSeoWithLLM } from '@/lib/analyser/llm-seo-fallback';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');
        const strategy = (searchParams.get('strategy') || 'mobile') as 'mobile' | 'desktop';
        const forceLLM = searchParams.get('force_llm') === 'true';

        if (!url) {
            return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
        }

        // Validate URL format
        let validUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            validUrl = `https://${url}`;
        }

        try {
            new URL(validUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        // Try PageSpeed API first (unless force_llm is set)
        if (!forceLLM) {
            try {
                const result = await analyzePageSpeed(validUrl, strategy);
                const assessment = assessCoreWebVitals(result.coreWebVitals);

                return NextResponse.json({
                    success: true,
                    source: 'pagespeed_api',
                    data: {
                        ...result,
                        assessment,
                    },
                });
            } catch (pageSpeedError: unknown) {
                const errorMessage = pageSpeedError instanceof Error ? pageSpeedError.message : '';

                // Check if it's a quota exceeded error
                const isQuotaError = errorMessage.includes('429') ||
                    errorMessage.includes('quota') ||
                    errorMessage.includes('RESOURCE_EXHAUSTED');

                if (!isQuotaError) {
                    // Not a quota error, might be a real issue
                    console.warn('[PageSpeed API] Non-quota error:', errorMessage);
                }

                // Fall through to LLM fallback
                console.log('[PageSpeed API] Falling back to LLM analysis');
            }
        }

        // LLM Fallback
        try {
            const llmResult = await analyzeSeoWithLLM(validUrl);

            return NextResponse.json({
                success: true,
                source: 'llm_fallback',
                message: 'Analysis powered by AI (PageSpeed API quota exceeded)',
                data: {
                    url: validUrl,
                    strategy,
                    scores: {
                        performance: llmResult.performanceScore,
                        accessibility: llmResult.accessibilityScore,
                        bestPractices: llmResult.bestPracticesScore,
                        seo: llmResult.seoScore,
                    },
                    coreWebVitals: {
                        lcp: llmResult.coreWebVitals.lcp.value * 1000, // Convert to ms
                        fid: llmResult.coreWebVitals.fid.value,
                        cls: llmResult.coreWebVitals.cls.value,
                        fcp: llmResult.coreWebVitals.fcp.value * 1000,
                        ttfb: llmResult.coreWebVitals.ttfb.value,
                    },
                    assessment: {
                        lcp: llmResult.coreWebVitals.lcp.score,
                        fid: llmResult.coreWebVitals.fid.score,
                        cls: llmResult.coreWebVitals.cls.score,
                        overall: llmResult.overallScore >= 90 ? 'good' : llmResult.overallScore >= 50 ? 'needs-improvement' : 'poor',
                    },
                    opportunities: llmResult.opportunities.map(o => ({
                        id: o.id,
                        title: o.title,
                        description: o.description,
                        savings: o.potentialSavings,
                    })),
                    diagnostics: llmResult.issues.map(i => ({
                        id: i.id,
                        title: i.title,
                        description: i.description,
                        displayValue: i.severity,
                    })),
                    passedAudits: llmResult.passedAudits,
                    loadingExperience: llmResult.overallScore >= 90 ? 'FAST' : llmResult.overallScore >= 50 ? 'AVERAGE' : 'SLOW',
                    fetchedAt: llmResult.analyzedAt,
                },
            });
        } catch (llmError) {
            console.error('[LLM Fallback] Error:', llmError);
            return NextResponse.json(
                {
                    error: 'Both PageSpeed API and LLM fallback failed. Please try again later.',
                    details: llmError instanceof Error ? llmError.message : 'Unknown error',
                },
                { status: 503 }
            );
        }
    } catch (error: unknown) {
        console.error('[PageSpeed API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to analyze page' },
            { status: 500 }
        );
    }
}

// Also support POST for consistency with other Analyser APIs
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, strategy = 'mobile', force_llm = false } = body;

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Create a mock request URL with query params
        const mockUrl = new URL(request.url);
        mockUrl.searchParams.set('url', url);
        mockUrl.searchParams.set('strategy', strategy);
        if (force_llm) mockUrl.searchParams.set('force_llm', 'true');

        const mockRequest = new NextRequest(mockUrl);
        return GET(mockRequest);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Invalid request' },
            { status: 400 }
        );
    }
}
