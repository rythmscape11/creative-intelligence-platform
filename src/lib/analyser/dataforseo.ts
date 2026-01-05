/**
 * DataForSEO Integration
 * 
 * Full SEO API integration for:
 * - Keyword research (volume, CPC, competition)
 * - SERP analysis (organic + paid results)
 * - Competitor domain analysis
 * - Backlink profiles
 * 
 * Docs: https://docs.dataforseo.com/
 */

import { checkCredits, logUsageAndDeductCredits } from './usage-service';
import { ANALYSER_PRICING, type AnalyserOperation } from './pricing';

// DataForSEO credentials from environment
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN || '';
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD || '';
const DATAFORSEO_BASE64 = process.env.DATAFORSEO_BASE64 ||
    Buffer.from(`${DATAFORSEO_LOGIN}:${DATAFORSEO_PASSWORD}`).toString('base64');

const BASE_URL = 'https://api.dataforseo.com/v3';

// Check if configured
export const isDataForSEOConfigured = DATAFORSEO_LOGIN !== '' && DATAFORSEO_PASSWORD !== '';

/**
 * Make authenticated request to DataForSEO
 */
async function apiRequest<T>(
    endpoint: string,
    body: unknown[]
): Promise<{ success: boolean; data?: T; error?: string; cost?: number }> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${DATAFORSEO_BASE64}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`DataForSEO API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        // Check for API-level errors
        if (result.status_code !== 20000) {
            throw new Error(result.status_message || 'API request failed');
        }

        // Extract cost from response
        const cost = result.cost || 0;

        return { success: true, data: result.tasks?.[0]?.result || [], cost };
    } catch (error) {
        console.error('[DataForSEO] API error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'API request failed'
        };
    }
}

// =====================================
// KEYWORD RESEARCH
// =====================================

export interface KeywordData {
    keyword: string;
    searchVolume: number;
    cpc: number;
    competition: number;
    competitionLevel: string;
    monthlySearches: { year: number; month: number; volume: number }[];
}

/**
 * Get keyword metrics (volume, CPC, competition)
 */
export async function getKeywordData(
    userId: string,
    keywords: string[],
    locationCode: number = 2840, // US by default
    languageCode: string = 'en'
): Promise<{ success: boolean; data?: KeywordData[]; error?: string; creditsUsed?: number }> {
    // Check credits
    const creditCheck = await checkCredits(userId, 'KEYWORD_LOOKUP', keywords.length);
    if (!creditCheck.allowed) {
        return { success: false, error: creditCheck.message };
    }

    const result = await apiRequest<any[]>('/keywords_data/google_ads/search_volume/live', [{
        keywords,
        location_code: locationCode,
        language_code: languageCode,
    }]);

    if (!result.success) {
        await logUsageAndDeductCredits(userId, 'KEYWORD_LOOKUP', keywords.length, { keywords }, false, result.error);
        return { success: false, error: result.error };
    }

    // Parse results
    const keywordData: KeywordData[] = (result.data || []).map((item: any) => ({
        keyword: item.keyword || '',
        searchVolume: item.search_volume || 0,
        cpc: item.cpc || 0,
        competition: item.competition || 0,
        competitionLevel: item.competition_level || 'unknown',
        monthlySearches: (item.monthly_searches || []).map((m: any) => ({
            year: m.year,
            month: m.month,
            volume: m.search_volume,
        })),
    }));

    // Log usage
    await logUsageAndDeductCredits(userId, 'KEYWORD_LOOKUP', keywords.length, { keywords }, true);

    return {
        success: true,
        data: keywordData,
        creditsUsed: ANALYSER_PRICING.KEYWORD_LOOKUP.creditsCost * keywords.length
    };
}

/**
 * Get keyword suggestions/ideas
 */
export async function getKeywordIdeas(
    userId: string,
    seedKeyword: string,
    locationCode: number = 2840,
    limit: number = 50
): Promise<{ success: boolean; data?: KeywordData[]; error?: string }> {
    const creditCheck = await checkCredits(userId, 'KEYWORD_LOOKUP', 5); // Ideas cost 5 credits
    if (!creditCheck.allowed) {
        return { success: false, error: creditCheck.message };
    }

    const result = await apiRequest<any[]>('/keywords_data/google_ads/keywords_for_keywords/live', [{
        keywords: [seedKeyword],
        location_code: locationCode,
        limit,
    }]);

    if (!result.success) {
        return { success: false, error: result.error };
    }

    const ideas: KeywordData[] = (result.data || []).map((item: any) => ({
        keyword: item.keyword || '',
        searchVolume: item.search_volume || 0,
        cpc: item.cpc || 0,
        competition: item.competition || 0,
        competitionLevel: item.competition_level || 'unknown',
        monthlySearches: [],
    }));

    await logUsageAndDeductCredits(userId, 'KEYWORD_LOOKUP', 5, { seedKeyword }, true);

    return { success: true, data: ideas };
}

// =====================================
// SERP ANALYSIS
// =====================================

export interface SerpResult {
    type: 'organic' | 'paid' | 'featured_snippet' | 'people_also_ask' | 'local_pack' | 'other';
    position: number;
    title: string;
    url: string;
    domain: string;
    description?: string;
    breadcrumb?: string;
}

export interface SerpAnalysis {
    keyword: string;
    locationCode: number;
    totalResults: number;
    organicResults: SerpResult[];
    paidResults: SerpResult[];
    featuredSnippet?: SerpResult;
    peopleAlsoAsk: string[];
    relatedSearches: string[];
}

/**
 * Get SERP results for a keyword
 */
export async function getSerpResults(
    userId: string,
    keyword: string,
    locationCode: number = 2840,
    device: 'desktop' | 'mobile' = 'desktop'
): Promise<{ success: boolean; data?: SerpAnalysis; error?: string }> {
    const creditCheck = await checkCredits(userId, 'SERP_SCAN');
    if (!creditCheck.allowed) {
        return { success: false, error: creditCheck.message };
    }

    const result = await apiRequest<any[]>('/serp/google/organic/live/regular', [{
        keyword,
        location_code: locationCode,
        device,
        depth: 100,
    }]);

    if (!result.success) {
        await logUsageAndDeductCredits(userId, 'SERP_SCAN', 1, { keyword }, false, result.error);
        return { success: false, error: result.error };
    }

    const serpData = result.data?.[0] || {};
    const items = serpData.items || [];

    // Parse organic results
    const organicResults: SerpResult[] = items
        .filter((item: any) => item.type === 'organic')
        .map((item: any) => ({
            type: 'organic' as const,
            position: item.rank_absolute || 0,
            title: item.title || '',
            url: item.url || '',
            domain: item.domain || '',
            description: item.description || '',
            breadcrumb: item.breadcrumb || '',
        }));

    // Parse paid results
    const paidResults: SerpResult[] = items
        .filter((item: any) => item.type === 'paid')
        .map((item: any) => ({
            type: 'paid' as const,
            position: item.rank_absolute || 0,
            title: item.title || '',
            url: item.url || '',
            domain: item.domain || '',
            description: item.description || '',
        }));

    // Featured snippet
    const featuredItem = items.find((item: any) => item.type === 'featured_snippet');
    const featuredSnippet = featuredItem ? {
        type: 'featured_snippet' as const,
        position: 0,
        title: featuredItem.title || '',
        url: featuredItem.url || '',
        domain: featuredItem.domain || '',
        description: featuredItem.description || '',
    } : undefined;

    // People also ask
    const paaItems = items.filter((item: any) => item.type === 'people_also_ask');
    const peopleAlsoAsk = paaItems.flatMap((paa: any) =>
        (paa.items || []).map((q: any) => q.title || '')
    );

    // Related searches
    const relatedItems = items.filter((item: any) => item.type === 'related_searches');
    const relatedSearches = relatedItems.flatMap((rs: any) =>
        (rs.items || []).map((r: any) => r.title || '')
    );

    const analysis: SerpAnalysis = {
        keyword,
        locationCode,
        totalResults: serpData.se_results_count || 0,
        organicResults,
        paidResults,
        featuredSnippet,
        peopleAlsoAsk,
        relatedSearches,
    };

    await logUsageAndDeductCredits(userId, 'SERP_SCAN', 1, { keyword }, true);

    return { success: true, data: analysis };
}

// =====================================
// COMPETITOR / DOMAIN ANALYSIS
// =====================================

export interface DomainOverview {
    domain: string;
    organicTraffic: number;
    organicKeywords: number;
    paidTraffic: number;
    paidKeywords: number;
    backlinks: number;
    referringDomains: number;
    domainRank: number;
}

export interface DomainKeyword {
    keyword: string;
    position: number;
    searchVolume: number;
    url: string;
    traffic: number;
    trafficCost: number;
}

/**
 * Get domain overview metrics
 */
export async function getDomainOverview(
    userId: string,
    domain: string,
    locationCode: number = 2840
): Promise<{ success: boolean; data?: DomainOverview; error?: string }> {
    const creditCheck = await checkCredits(userId, 'COMPETITOR_LOOKUP');
    if (!creditCheck.allowed) {
        return { success: false, error: creditCheck.message };
    }

    const result = await apiRequest<any[]>('/dataforseo_labs/google/domain_metrics_by_categories/live', [{
        target: domain,
        location_code: locationCode,
    }]);

    // Also get backlink summary
    const backlinkResult = await apiRequest<any[]>('/backlinks/summary/live', [{
        target: domain,
    }]);

    if (!result.success) {
        await logUsageAndDeductCredits(userId, 'COMPETITOR_LOOKUP', 1, { domain }, false, result.error);
        return { success: false, error: result.error };
    }

    const metrics = result.data?.[0]?.metrics || {};
    const blMetrics = backlinkResult.data?.[0] || {};

    const overview: DomainOverview = {
        domain,
        organicTraffic: metrics.organic?.etv || 0,
        organicKeywords: metrics.organic?.count || 0,
        paidTraffic: metrics.paid?.etv || 0,
        paidKeywords: metrics.paid?.count || 0,
        backlinks: blMetrics.backlinks || 0,
        referringDomains: blMetrics.referring_domains || 0,
        domainRank: blMetrics.rank || 0,
    };

    await logUsageAndDeductCredits(userId, 'COMPETITOR_LOOKUP', 1, { domain }, true);

    return { success: true, data: overview };
}

/**
 * Get domain's ranking keywords
 */
export async function getDomainKeywords(
    userId: string,
    domain: string,
    locationCode: number = 2840,
    limit: number = 100
): Promise<{ success: boolean; data?: DomainKeyword[]; error?: string }> {
    const creditCheck = await checkCredits(userId, 'COMPETITOR_LOOKUP');
    if (!creditCheck.allowed) {
        return { success: false, error: creditCheck.message };
    }

    const result = await apiRequest<any[]>('/dataforseo_labs/google/ranked_keywords/live', [{
        target: domain,
        location_code: locationCode,
        limit,
        order_by: ['keyword_data.keyword_info.search_volume,desc'],
    }]);

    if (!result.success) {
        return { success: false, error: result.error };
    }

    const keywords: DomainKeyword[] = (result.data || []).map((item: any) => ({
        keyword: item.keyword_data?.keyword || '',
        position: item.ranked_serp_element?.serp_item?.rank_absolute || 0,
        searchVolume: item.keyword_data?.keyword_info?.search_volume || 0,
        url: item.ranked_serp_element?.serp_item?.url || '',
        traffic: item.keyword_data?.keyword_info?.etv || 0,
        trafficCost: item.keyword_data?.keyword_info?.traffic_cost || 0,
    }));

    await logUsageAndDeductCredits(userId, 'COMPETITOR_LOOKUP', 1, { domain }, true);

    return { success: true, data: keywords };
}

// =====================================
// BACKLINK ANALYSIS
// =====================================

export interface Backlink {
    sourceUrl: string;
    sourceDomain: string;
    targetUrl: string;
    anchorText: string;
    domainRank: number;
    pageRank: number;
    isDofollow: boolean;
    firstSeen: string;
    lastSeen: string;
}

export interface BacklinkSummary {
    domain: string;
    totalBacklinks: number;
    referringDomains: number;
    referringIps: number;
    dofollowBacklinks: number;
    nofollowBacklinks: number;
    domainRank: number;
    topBacklinks: Backlink[];
}

/**
 * Get backlink profile for a domain
 */
export async function getBacklinkProfile(
    userId: string,
    domain: string,
    limit: number = 50
): Promise<{ success: boolean; data?: BacklinkSummary; error?: string }> {
    const creditCheck = await checkCredits(userId, 'BACKLINK_LOOKUP');
    if (!creditCheck.allowed) {
        return { success: false, error: creditCheck.message };
    }

    // Get summary
    const summaryResult = await apiRequest<any[]>('/backlinks/summary/live', [{
        target: domain,
    }]);

    // Get top backlinks
    const backlinksResult = await apiRequest<any[]>('/backlinks/backlinks/live', [{
        target: domain,
        limit,
        order_by: ['rank,desc'],
    }]);

    if (!summaryResult.success) {
        await logUsageAndDeductCredits(userId, 'BACKLINK_LOOKUP', 1, { domain }, false, summaryResult.error);
        return { success: false, error: summaryResult.error };
    }

    const summary = summaryResult.data?.[0] || {};
    const backlinks: Backlink[] = (backlinksResult.data || []).map((bl: any) => ({
        sourceUrl: bl.url_from || '',
        sourceDomain: bl.domain_from || '',
        targetUrl: bl.url_to || '',
        anchorText: bl.anchor || '',
        domainRank: bl.domain_from_rank || 0,
        pageRank: bl.page_from_rank || 0,
        isDofollow: bl.dofollow || false,
        firstSeen: bl.first_seen || '',
        lastSeen: bl.last_seen || '',
    }));

    const profile: BacklinkSummary = {
        domain,
        totalBacklinks: summary.backlinks || 0,
        referringDomains: summary.referring_domains || 0,
        referringIps: summary.referring_ips || 0,
        dofollowBacklinks: summary.backlinks_nofollow ? summary.backlinks - summary.backlinks_nofollow : summary.backlinks,
        nofollowBacklinks: summary.backlinks_nofollow || 0,
        domainRank: summary.rank || 0,
        topBacklinks: backlinks,
    };

    await logUsageAndDeductCredits(userId, 'BACKLINK_LOOKUP', 1, { domain }, true);

    return { success: true, data: profile };
}

export default {
    isDataForSEOConfigured,
    getKeywordData,
    getKeywordIdeas,
    getSerpResults,
    getDomainOverview,
    getDomainKeywords,
    getBacklinkProfile,
};
