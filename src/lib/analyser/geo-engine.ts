/**
 * The Analyser - GEO (Generative Engine Optimization) Engine
 * 
 * Analyzes web pages for AI search discoverability:
 * - ChatGPT, Gemini, Perplexity, AI Overviews
 * 
 * Scoring factors:
 * - Content Clarity (20%)
 * - Q&A Coverage (25%)
 * - Entity Richness (15%)
 * - Schema Presence (15%)
 * - Freshness Signals (10%)
 * - Authority Signals (15%)
 */

import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { checkCredits, logUsageAndDeductCredits } from './usage-service';

// Lazy initialization to prevent build errors when env not set
let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
    if (!openaiInstance) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is required for GEO analysis');
        }
        openaiInstance = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiInstance;
}

export interface GeoAnalysisInput {
    userId: string;
    url: string;
    targetTopic?: string;
    targetEngines?: string[];
}

export interface GeoAnalysisResult {
    success: boolean;
    analysisId?: string;
    geoScore: number;
    scores: {
        contentClarity: number;
        qaCoverage: number;
        entityRichness: number;
        schemaPresence: number;
        freshness: number;
        authority: number;
    };
    contentSummary: string;
    entities: {
        brands: string[];
        topics: string[];
        locations: string[];
        people: string[];
    };
    qaClustersCovered: string[];
    qaClustersGaps: string[];
    structuralIssues: string[];
    schemaSuggestions: string[];
    recommendations: string[];
    improvedOutline?: string;
    error?: string;
}

/**
 * Fetch and extract main content from a URL
 */
async function fetchPageContent(url: string): Promise<{
    html: string;
    title: string;
    text: string;
    hasSchema: boolean;
    schemaTypes: string[];
    wordCount: number;
}> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MediaPlanPro-GEO-Analyzer/1.0',
                'Accept': 'text/html',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.status}`);
        }

        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract text content (simplified - remove tags)
        const text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
            .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
            .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Check for schema
        const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
        const schemaTypes: string[] = [];

        for (const match of schemaMatches) {
            try {
                const jsonContent = match.replace(/<script[^>]*>|<\/script>/gi, '');
                const schema = JSON.parse(jsonContent);
                if (schema['@type']) {
                    schemaTypes.push(Array.isArray(schema['@type']) ? schema['@type'][0] : schema['@type']);
                }
            } catch {
                // Skip invalid JSON
            }
        }

        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

        return {
            html,
            title,
            text: text.substring(0, 15000), // Limit for LLM
            hasSchema: schemaTypes.length > 0,
            schemaTypes,
            wordCount,
        };
    } catch (error) {
        throw new Error(`Failed to fetch page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Run GEO analysis using LLM
 */
async function runLLMAnalysis(
    pageContent: string,
    pageTitle: string,
    targetTopic?: string,
    existingSchema?: string[]
): Promise<{
    contentClarity: number;
    qaCoverage: number;
    entityRichness: number;
    schemaPresence: number;
    freshness: number;
    authority: number;
    contentSummary: string;
    entities: { brands: string[]; topics: string[]; locations: string[]; people: string[] };
    qaClustersCovered: string[];
    qaClustersGaps: string[];
    structuralIssues: string[];
    schemaSuggestions: string[];
    recommendations: string[];
    improvedOutline: string;
}> {
    const prompt = `You are a GEO (Generative Engine Optimization) expert analyzing web content for AI search visibility.

Analyze this page for how well it would appear in AI-generated answers (ChatGPT, Gemini, Perplexity, Google AI Overviews).

PAGE TITLE: ${pageTitle}
${targetTopic ? `TARGET TOPIC: ${targetTopic}` : ''}
EXISTING SCHEMA: ${existingSchema?.join(', ') || 'None detected'}

PAGE CONTENT:
${pageContent.substring(0, 10000)}

Provide a JSON response with these exact fields:

{
  "scores": {
    "contentClarity": <0-100, how clearly the content answers questions>,
    "qaCoverage": <0-100, how many relevant questions are directly answered>,
    "entityRichness": <0-100, named entities, specific data points>,
    "schemaPresence": <0-100, structured data quality>,
    "freshness": <0-100, temporal relevance signals>,
    "authority": <0-100, expertise and trust signals>
  },
  "contentSummary": "<2-3 sentence summary of what this page is about>",
  "entities": {
    "brands": ["<brand names mentioned>"],
    "topics": ["<main topics covered>"],
    "locations": ["<locations if any>"],
    "people": ["<people/experts mentioned>"]
  },
  "qaClustersCovered": ["<Questions this page clearly answers>"],
  "qaClustersGaps": ["<Questions this page SHOULD answer but doesn't>"],
  "structuralIssues": ["<Missing elements that help AI: direct answers, lists, definitions, FAQs>"],
  "schemaSuggestions": ["<Schema types to add: FAQPage, HowTo, Article, etc>"],
  "recommendations": ["<Specific actionable improvements>"],
  "improvedOutline": "<Suggested improved page structure with H1, H2, H3 and key sections>"
}

Respond ONLY with valid JSON, no markdown or explanation.`;

    const completion = await getOpenAI().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '{}';

    try {
        // Parse JSON response
        const cleanedResponse = responseText.replace(/```json\n?|```\n?/g, '').trim();
        return JSON.parse(cleanedResponse);
    } catch {
        // Return defaults if parsing fails
        return {
            contentClarity: 50,
            qaCoverage: 50,
            entityRichness: 50,
            schemaPresence: existingSchema?.length ? 60 : 20,
            freshness: 50,
            authority: 50,
            contentSummary: 'Unable to analyze content.',
            entities: { brands: [], topics: [], locations: [], people: [] },
            qaClustersCovered: [],
            qaClustersGaps: ['Could not determine gaps'],
            structuralIssues: ['Analysis incomplete'],
            schemaSuggestions: ['FAQPage', 'Article'],
            recommendations: ['Re-run analysis with cleaner content'],
            improvedOutline: '',
        };
    }
}

/**
 * Calculate overall GEO score from component scores
 */
function calculateGeoScore(scores: {
    contentClarity: number;
    qaCoverage: number;
    entityRichness: number;
    schemaPresence: number;
    freshness: number;
    authority: number;
}): number {
    // Weighted average based on importance for AI visibility
    const weights = {
        contentClarity: 0.20,
        qaCoverage: 0.25,
        entityRichness: 0.15,
        schemaPresence: 0.15,
        freshness: 0.10,
        authority: 0.15,
    };

    const weightedSum =
        scores.contentClarity * weights.contentClarity +
        scores.qaCoverage * weights.qaCoverage +
        scores.entityRichness * weights.entityRichness +
        scores.schemaPresence * weights.schemaPresence +
        scores.freshness * weights.freshness +
        scores.authority * weights.authority;

    return Math.round(weightedSum);
}

/**
 * Get GEO score interpretation
 */
export function getScoreInterpretation(score: number): {
    label: string;
    color: string;
    description: string;
} {
    if (score >= 80) {
        return {
            label: 'Excellent',
            color: 'green',
            description: 'Highly optimized for AI search. Likely to appear in AI-generated answers.',
        };
    } else if (score >= 60) {
        return {
            label: 'Good',
            color: 'blue',
            description: 'Well-structured for AI. Some improvements recommended.',
        };
    } else if (score >= 40) {
        return {
            label: 'Moderate',
            color: 'yellow',
            description: 'Significant gaps in AI discoverability. Follow recommendations.',
        };
    } else {
        return {
            label: 'Poor',
            color: 'red',
            description: 'Major improvements needed for AI search visibility.',
        };
    }
}

/**
 * Run full GEO analysis on a URL
 */
export async function analyzePageGEO(
    input: GeoAnalysisInput
): Promise<GeoAnalysisResult> {
    const startTime = Date.now();

    // Check credits
    const creditCheck = await checkCredits(input.userId, 'GEO_ANALYSIS');
    if (!creditCheck.allowed) {
        return {
            success: false,
            geoScore: 0,
            scores: {
                contentClarity: 0,
                qaCoverage: 0,
                entityRichness: 0,
                schemaPresence: 0,
                freshness: 0,
                authority: 0,
            },
            contentSummary: '',
            entities: { brands: [], topics: [], locations: [], people: [] },
            qaClustersCovered: [],
            qaClustersGaps: [],
            structuralIssues: [],
            schemaSuggestions: [],
            recommendations: [],
            error: creditCheck.message,
        };
    }

    try {
        // Fetch page content
        const pageData = await fetchPageContent(input.url);

        // Run LLM analysis
        const analysis = await runLLMAnalysis(
            pageData.text,
            pageData.title,
            input.targetTopic,
            pageData.schemaTypes
        );

        // Calculate overall score
        const geoScore = calculateGeoScore(analysis.scores || {
            contentClarity: analysis.contentClarity,
            qaCoverage: analysis.qaCoverage,
            entityRichness: analysis.entityRichness,
            schemaPresence: analysis.schemaPresence,
            freshness: analysis.freshness,
            authority: analysis.authority,
        });

        const processingTimeMs = Date.now() - startTime;

        // Extract domain from URL
        const domain = new URL(input.url).hostname;

        // Save to database
        const savedAnalysis = await prisma.geoAnalysis.create({
            data: {
                userId: input.userId,
                url: input.url,
                domain,
                targetTopic: input.targetTopic,
                targetEngines: input.targetEngines || ['ChatGPT', 'Gemini', 'AI Overviews', 'Perplexity'],
                geoScore,
                contentClarityScore: analysis.scores?.contentClarity || analysis.contentClarity || 0,
                qaCoverageScore: analysis.scores?.qaCoverage || analysis.qaCoverage || 0,
                entityRichnessScore: analysis.scores?.entityRichness || analysis.entityRichness || 0,
                schemaScore: analysis.scores?.schemaPresence || analysis.schemaPresence || 0,
                freshnessScore: analysis.scores?.freshness || analysis.freshness || 0,
                authorityScore: analysis.scores?.authority || analysis.authority || 0,
                contentSummary: analysis.contentSummary,
                entities: analysis.entities,
                qaClustersCovered: analysis.qaClustersCovered,
                qaClustersGaps: analysis.qaClustersGaps,
                structuralIssues: analysis.structuralIssues,
                schemaSuggestions: analysis.schemaSuggestions,
                recommendations: analysis.recommendations,
                improvedOutline: analysis.improvedOutline,
                pageTitle: pageData.title,
                wordCount: pageData.wordCount,
                hasSchema: pageData.hasSchema,
                schemaTypes: pageData.schemaTypes,
                processingTimeMs,
            },
        });

        // Log usage and deduct credits
        await logUsageAndDeductCredits(
            input.userId,
            'GEO_ANALYSIS',
            1,
            { url: input.url, targetTopic: input.targetTopic },
            true
        );

        return {
            success: true,
            analysisId: savedAnalysis.id,
            geoScore,
            scores: {
                contentClarity: analysis.scores?.contentClarity || analysis.contentClarity || 0,
                qaCoverage: analysis.scores?.qaCoverage || analysis.qaCoverage || 0,
                entityRichness: analysis.scores?.entityRichness || analysis.entityRichness || 0,
                schemaPresence: analysis.scores?.schemaPresence || analysis.schemaPresence || 0,
                freshness: analysis.scores?.freshness || analysis.freshness || 0,
                authority: analysis.scores?.authority || analysis.authority || 0,
            },
            contentSummary: analysis.contentSummary,
            entities: analysis.entities,
            qaClustersCovered: analysis.qaClustersCovered,
            qaClustersGaps: analysis.qaClustersGaps,
            structuralIssues: analysis.structuralIssues,
            schemaSuggestions: analysis.schemaSuggestions,
            recommendations: analysis.recommendations,
            improvedOutline: analysis.improvedOutline,
        };
    } catch (error) {
        // Log failed usage (no credit deduction)
        await logUsageAndDeductCredits(
            input.userId,
            'GEO_ANALYSIS',
            1,
            { url: input.url },
            false,
            error instanceof Error ? error.message : 'Unknown error'
        );

        return {
            success: false,
            geoScore: 0,
            scores: {
                contentClarity: 0,
                qaCoverage: 0,
                entityRichness: 0,
                schemaPresence: 0,
                freshness: 0,
                authority: 0,
            },
            contentSummary: '',
            entities: { brands: [], topics: [], locations: [], people: [] },
            qaClustersCovered: [],
            qaClustersGaps: [],
            structuralIssues: [],
            schemaSuggestions: [],
            recommendations: [],
            error: error instanceof Error ? error.message : 'Analysis failed',
        };
    }
}

/**
 * Get user's GEO analysis history
 */
export async function getGeoHistory(
    userId: string,
    limit: number = 20
) {
    return prisma.geoAnalysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            url: true,
            domain: true,
            geoScore: true,
            pageTitle: true,
            targetTopic: true,
            createdAt: true,
        },
    });
}

/**
 * Get single GEO analysis by ID
 */
export async function getGeoAnalysis(analysisId: string, userId: string) {
    return prisma.geoAnalysis.findFirst({
        where: { id: analysisId, userId },
    });
}

export default {
    analyzePageGEO,
    getGeoHistory,
    getGeoAnalysis,
    getScoreInterpretation,
};
