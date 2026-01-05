/**
 * Google Search Console Integration
 * 
 * FREE SEO data from Google Search Console API:
 * - Keyword rankings
 * - Click-through rates
 * - Impressions
 * - Search queries
 * - Page performance
 */

import { google } from 'googleapis';

// OAuth 2.0 Configuration - reuse existing Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ANALYTICS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_ANALYTICS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_SEARCH_CONSOLE_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrations/search-console/callback`;

// Scopes required for Search Console
const SCOPES = [
    'https://www.googleapis.com/auth/webmasters.readonly',
];

// Check if configured
export const isSearchConsoleConfigured =
    GOOGLE_CLIENT_ID !== '' && GOOGLE_CLIENT_SECRET !== '';

/**
 * Create OAuth2 client for Search Console
 */
export function createSearchConsoleOAuth2Client() {
    return new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    );
}

/**
 * Get authorization URL for Search Console
 */
export function getSearchConsoleAuthUrl(): string {
    if (!isSearchConsoleConfigured) {
        throw new Error('Google OAuth is not configured');
    }

    const oauth2Client = createSearchConsoleOAuth2Client();
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });
}

/**
 * Exchange authorization code for tokens
 */
export async function getSearchConsoleTokens(code: string) {
    const oauth2Client = createSearchConsoleOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
    };
}

// =====================================
// SEARCH CONSOLE DATA FUNCTIONS
// =====================================

export interface SearchConsoleQuery {
    siteUrl: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    dimensions?: ('query' | 'page' | 'country' | 'device' | 'date')[];
    rowLimit?: number;
}

export interface SearchAnalyticsRow {
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface SearchConsoleResult {
    rows: SearchAnalyticsRow[];
    responseAggregationType: string;
}

/**
 * Get Search Analytics data (keyword rankings, clicks, impressions)
 */
export async function getSearchAnalytics(
    accessToken: string,
    query: SearchConsoleQuery
): Promise<SearchConsoleResult> {
    const oauth2Client = createSearchConsoleOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

    try {
        const response = await searchconsole.searchanalytics.query({
            siteUrl: query.siteUrl,
            requestBody: {
                startDate: query.startDate,
                endDate: query.endDate,
                dimensions: query.dimensions || ['query'],
                rowLimit: query.rowLimit || 100,
            },
        });

        return {
            rows: (response.data.rows || []).map(row => ({
                keys: row.keys || [],
                clicks: row.clicks || 0,
                impressions: row.impressions || 0,
                ctr: row.ctr || 0,
                position: row.position || 0,
            })),
            responseAggregationType: response.data.responseAggregationType || 'auto',
        };
    } catch (error: unknown) {
        console.error('[SearchConsole] Error fetching analytics:', error);
        throw error;
    }
}

/**
 * Get list of verified sites
 */
export async function getVerifiedSites(accessToken: string): Promise<string[]> {
    const oauth2Client = createSearchConsoleOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });

    try {
        const response = await searchconsole.sites.list();
        return (response.data.siteEntry || [])
            .filter(site => site.permissionLevel !== 'siteUnverifiedUser')
            .map(site => site.siteUrl || '')
            .filter(Boolean);
    } catch (error: unknown) {
        console.error('[SearchConsole] Error fetching sites:', error);
        throw error;
    }
}

/**
 * Get top keywords for a site
 */
export async function getTopKeywords(
    accessToken: string,
    siteUrl: string,
    days: number = 28
): Promise<SearchAnalyticsRow[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await getSearchAnalytics(accessToken, {
        siteUrl,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['query'],
        rowLimit: 50,
    });

    return result.rows.sort((a, b) => b.impressions - a.impressions);
}

/**
 * Get top pages for a site
 */
export async function getTopPages(
    accessToken: string,
    siteUrl: string,
    days: number = 28
): Promise<SearchAnalyticsRow[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await getSearchAnalytics(accessToken, {
        siteUrl,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['page'],
        rowLimit: 50,
    });

    return result.rows.sort((a, b) => b.clicks - a.clicks);
}

/**
 * Get performance trend over time
 */
export async function getPerformanceTrend(
    accessToken: string,
    siteUrl: string,
    days: number = 28
): Promise<SearchAnalyticsRow[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await getSearchAnalytics(accessToken, {
        siteUrl,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['date'],
        rowLimit: days,
    });

    return result.rows.sort((a, b) => a.keys[0].localeCompare(b.keys[0]));
}

export default {
    isSearchConsoleConfigured,
    getSearchConsoleAuthUrl,
    getSearchConsoleTokens,
    getSearchAnalytics,
    getVerifiedSites,
    getTopKeywords,
    getTopPages,
    getPerformanceTrend,
};
