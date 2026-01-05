/**
 * LLM-based SEO Analysis Fallback
 * 
 * When PageSpeed API quota is exceeded or unavailable,
 * use OpenAI to analyze page content and provide SEO recommendations.
 */

import OpenAI from 'openai';
import { fetchAndParsePage, analyzePageSeo, type PageContent, type PageAnalysis } from './html-fetcher';

// Lazy initialization to prevent build errors when env not set
let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!openaiInstance) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is required for LLM SEO fallback');
        }
        openaiInstance = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiInstance;
}

export interface LLMSeoAnalysis {
    url: string;
    overallScore: number;  // 0-100
    performanceScore: number;
    seoScore: number;
    accessibilityScore: number;
    bestPracticesScore: number;
    coreWebVitals: {
        lcp: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
        fid: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
        cls: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
        fcp: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
        ttfb: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    };
    issues: Array<{
        id: string;
        severity: 'critical' | 'warning' | 'info';
        title: string;
        description: string;
        recommendation: string;
    }>;
    opportunities: Array<{
        id: string;
        title: string;
        description: string;
        potentialSavings: string;
    }>;
    passedAudits: string[];
    source: 'llm_fallback';
    analyzedAt: Date;
}

/**
 * Analyze page SEO using LLM when PageSpeed API is unavailable
 */
export async function analyzeSeoWithLLM(url: string): Promise<LLMSeoAnalysis> {
    // First, fetch and parse the page
    let pageContent: PageContent;
    let pageAnalysis: PageAnalysis;

    try {
        pageContent = await fetchAndParsePage(url);
        pageAnalysis = analyzePageSeo(pageContent);
    } catch (error) {
        throw new Error(`Failed to fetch page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Prepare context for LLM
    const pageContext = {
        url: pageContent.url,
        title: pageContent.title,
        metaDescription: pageContent.metaDescription,
        h1: pageContent.h1,
        h2: pageContent.h2.slice(0, 10), // Limit to first 10
        wordCount: pageContent.wordCount,
        internalLinkCount: pageContent.internalLinks.length,
        externalLinkCount: pageContent.externalLinks.length,
        imageCount: pageContent.images.length,
        imagesWithAlt: pageContent.images.filter(i => i.alt).length,
        hasSchema: pageContent.schemaJson.length > 0,
        hasOpenGraph: Object.keys(pageContent.openGraph).length > 0,
        hasCanonical: !!pageContent.canonicalUrl,
        loadTimeMs: pageContent.loadTimeMs,
        contentPreview: pageContent.content.slice(0, 1000),
        basicIssues: pageAnalysis.issues,
        basicSuggestions: pageAnalysis.suggestions,
    };

    const prompt = `You are an expert SEO analyst. Analyze this web page and provide a comprehensive SEO audit.

PAGE DATA:
URL: ${pageContext.url}
Title: "${pageContext.title}" (${pageContext.title.length} chars)
Meta Description: "${pageContext.metaDescription}" (${pageContext.metaDescription.length} chars)
H1 Tags: ${pageContext.h1.length > 0 ? pageContext.h1.join(', ') : 'MISSING'}
H2 Tags: ${pageContext.h2.length} found
Word Count: ${pageContext.wordCount}
Internal Links: ${pageContext.internalLinkCount}
External Links: ${pageContext.externalLinkCount}
Images: ${pageContext.imageCount} (${pageContext.imagesWithAlt} with alt text)
Has Schema Markup: ${pageContext.hasSchema ? 'Yes' : 'No'}
Has Open Graph: ${pageContext.hasOpenGraph ? 'Yes' : 'No'}
Has Canonical: ${pageContext.hasCanonical ? 'Yes' : 'No'}
Load Time: ${pageContext.loadTimeMs}ms

Content Preview:
${pageContext.contentPreview}

ALREADY IDENTIFIED ISSUES:
${pageContext.basicIssues.join('\n')}

ALREADY IDENTIFIED SUGGESTIONS:
${pageContext.basicSuggestions.join('\n')}

Based on this data, provide:
1. Overall SEO score (0-100)
2. Performance score estimate (0-100)
3. Accessibility score estimate (0-100)
4. Best practices score estimate (0-100)
5. Core Web Vitals estimates (LCP, FID, CLS, FCP, TTFB)
6. Critical issues that need immediate attention
7. Optimization opportunities with potential impact
8. What's passing/good about the page

Respond in this exact JSON format:
{
  "overallScore": 75,
  "performanceScore": 70,
  "seoScore": 80,
  "accessibilityScore": 75,
  "bestPracticesScore": 70,
  "coreWebVitals": {
    "lcp": { "value": 2.5, "score": "good" },
    "fid": { "value": 100, "score": "good" },
    "cls": { "value": 0.1, "score": "good" },
    "fcp": { "value": 1.8, "score": "good" },
    "ttfb": { "value": 600, "score": "needs-improvement" }
  },
  "issues": [
    {
      "id": "missing-meta-description",
      "severity": "critical",
      "title": "Missing Meta Description",
      "description": "The page lacks a meta description",
      "recommendation": "Add a compelling meta description of 150-160 characters"
    }
  ],
  "opportunities": [
    {
      "id": "optimize-images",
      "title": "Optimize Images",
      "description": "Several images could be compressed",
      "potentialSavings": "Reduce load time by ~500ms"
    }
  ],
  "passedAudits": ["Has title tag", "Uses HTTPS", "Has H1 heading"]
}`;

    try {
        const response = await getOpenAI().chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert SEO analyst. Provide accurate, actionable SEO audits. Always respond with valid JSON only.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error('Empty response from LLM');
        }

        const analysis = JSON.parse(content);

        return {
            url,
            overallScore: analysis.overallScore || 50,
            performanceScore: analysis.performanceScore || 50,
            seoScore: analysis.seoScore || 50,
            accessibilityScore: analysis.accessibilityScore || 50,
            bestPracticesScore: analysis.bestPracticesScore || 50,
            coreWebVitals: analysis.coreWebVitals || {
                lcp: { value: 2.5, score: 'needs-improvement' },
                fid: { value: 100, score: 'good' },
                cls: { value: 0.1, score: 'good' },
                fcp: { value: 1.8, score: 'needs-improvement' },
                ttfb: { value: pageContent.loadTimeMs, score: pageContent.loadTimeMs < 600 ? 'good' : 'needs-improvement' },
            },
            issues: analysis.issues || [],
            opportunities: analysis.opportunities || [],
            passedAudits: analysis.passedAudits || [],
            source: 'llm_fallback',
            analyzedAt: new Date(),
        };
    } catch (error) {
        console.error('[LLM SEO Fallback] Error:', error);

        // Return basic analysis from page parsing
        return createBasicAnalysis(url, pageContent, pageAnalysis);
    }
}

/**
 * Create basic analysis without LLM (fallback for LLM failure)
 */
function createBasicAnalysis(url: string, page: PageContent, analysis: PageAnalysis): LLMSeoAnalysis {
    // Calculate basic scores from signals
    let seoScore = 50;

    if (analysis.seoSignals.hasTitle) seoScore += 10;
    if (analysis.seoSignals.titleLength >= 30 && analysis.seoSignals.titleLength <= 60) seoScore += 5;
    if (analysis.seoSignals.hasMetaDescription) seoScore += 10;
    if (analysis.seoSignals.hasH1) seoScore += 10;
    if (analysis.seoSignals.h1Count === 1) seoScore += 5;
    if (analysis.seoSignals.hasSchema) seoScore += 10;
    if (analysis.seoSignals.hasCanonical) seoScore += 5;
    if (analysis.seoSignals.wordCount >= 500) seoScore += 5;
    if (analysis.seoSignals.internalLinkCount >= 3) seoScore += 5;
    if (analysis.seoSignals.imagesWithAlt === analysis.seoSignals.imageCount && analysis.seoSignals.imageCount > 0) seoScore += 5;

    seoScore = Math.min(100, seoScore);

    const issues = analysis.issues.map((issue, i) => ({
        id: `issue-${i}`,
        severity: 'warning' as const,
        title: issue,
        description: issue,
        recommendation: 'Review and fix this issue',
    }));

    const opportunities = analysis.suggestions.map((suggestion, i) => ({
        id: `opportunity-${i}`,
        title: suggestion.split('.')[0],
        description: suggestion,
        potentialSavings: 'Improved SEO',
    }));

    const passedAudits: string[] = [];
    if (analysis.seoSignals.hasTitle) passedAudits.push('Has title tag');
    if (analysis.seoSignals.hasMetaDescription) passedAudits.push('Has meta description');
    if (analysis.seoSignals.hasH1) passedAudits.push('Has H1 heading');
    if (analysis.seoSignals.hasSchema) passedAudits.push('Has structured data');
    if (analysis.seoSignals.hasOpenGraph) passedAudits.push('Has Open Graph tags');

    return {
        url,
        overallScore: seoScore,
        performanceScore: Math.max(50, 100 - Math.floor(page.loadTimeMs / 50)),
        seoScore,
        accessibilityScore: Math.round((analysis.seoSignals.imagesWithAlt / Math.max(1, analysis.seoSignals.imageCount)) * 100),
        bestPracticesScore: 60,
        coreWebVitals: {
            lcp: { value: page.loadTimeMs / 1000, score: page.loadTimeMs < 2500 ? 'good' : 'needs-improvement' },
            fid: { value: 100, score: 'good' },
            cls: { value: 0.1, score: 'good' },
            fcp: { value: page.loadTimeMs / 1500, score: page.loadTimeMs < 1800 ? 'good' : 'needs-improvement' },
            ttfb: { value: page.loadTimeMs * 0.3, score: page.loadTimeMs * 0.3 < 600 ? 'good' : 'needs-improvement' },
        },
        issues,
        opportunities,
        passedAudits,
        source: 'llm_fallback',
        analyzedAt: new Date(),
    };
}

export default {
    analyzeSeoWithLLM,
};
