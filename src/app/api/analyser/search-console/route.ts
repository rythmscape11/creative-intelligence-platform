/**
 * Search Console API Routes
 * 
 * GET /api/analyser/search-console/sites - List verified sites
 * GET /api/analyser/search-console/keywords - Get top keywords
 * GET /api/analyser/search-console/pages - Get top pages
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
    getVerifiedSites,
    getTopKeywords,
    getTopPages,
    getPerformanceTrend,
    isSearchConsoleConfigured
} from '@/lib/search-console';
import { prisma } from '@/lib/prisma';

// Helper to get user's Search Console access token
async function getSearchConsoleToken(userId: string): Promise<string | null> {
    try {
        const integration = await prisma.userIntegration.findFirst({
            where: {
                userId,
                provider: 'google_search_console',
            },
        });

        return integration?.accessToken || null;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!isSearchConsoleConfigured) {
            return NextResponse.json({
                error: 'Search Console not configured',
                message: 'Google OAuth credentials not set'
            }, { status: 503 });
        }

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action') || 'sites';
        const siteUrl = searchParams.get('siteUrl');
        const days = parseInt(searchParams.get('days') || '28');

        const accessToken = await getSearchConsoleToken(userId);

        if (!accessToken) {
            return NextResponse.json({
                error: 'Not connected',
                message: 'Please connect your Google Search Console account',
                connectUrl: '/api/integrations/search-console/auth'
            }, { status: 401 });
        }

        switch (action) {
            case 'sites':
                const sites = await getVerifiedSites(accessToken);
                return NextResponse.json({ sites });

            case 'keywords':
                if (!siteUrl) {
                    return NextResponse.json({ error: 'siteUrl required' }, { status: 400 });
                }
                const keywords = await getTopKeywords(accessToken, siteUrl, days);
                return NextResponse.json({
                    keywords: keywords.map(k => ({
                        query: k.keys[0],
                        clicks: k.clicks,
                        impressions: k.impressions,
                        ctr: (k.ctr * 100).toFixed(2) + '%',
                        position: k.position.toFixed(1),
                    }))
                });

            case 'pages':
                if (!siteUrl) {
                    return NextResponse.json({ error: 'siteUrl required' }, { status: 400 });
                }
                const pages = await getTopPages(accessToken, siteUrl, days);
                return NextResponse.json({
                    pages: pages.map(p => ({
                        page: p.keys[0],
                        clicks: p.clicks,
                        impressions: p.impressions,
                        ctr: (p.ctr * 100).toFixed(2) + '%',
                        position: p.position.toFixed(1),
                    }))
                });

            case 'trend':
                if (!siteUrl) {
                    return NextResponse.json({ error: 'siteUrl required' }, { status: 400 });
                }
                const trend = await getPerformanceTrend(accessToken, siteUrl, days);
                return NextResponse.json({
                    trend: trend.map(t => ({
                        date: t.keys[0],
                        clicks: t.clicks,
                        impressions: t.impressions,
                        ctr: (t.ctr * 100).toFixed(2),
                        position: t.position.toFixed(1),
                    }))
                });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error('[SearchConsole API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch data' },
            { status: 500 }
        );
    }
}
