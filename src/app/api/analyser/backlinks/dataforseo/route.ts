/**
 * DataForSEO Backlinks API Route
 * POST /api/analyser/backlinks/dataforseo - Get backlink profile (premium)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getBacklinkProfile, isDataForSEOConfigured } from '@/lib/analyser/dataforseo';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!isDataForSEOConfigured) {
            return NextResponse.json({
                error: 'SEO API not configured',
                message: 'DataForSEO credentials not set'
            }, { status: 503 });
        }

        const body = await request.json();
        const { domain, limit = 50 } = body;

        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        // Clean domain
        const cleanDomain = domain
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '');

        const result = await getBacklinkProfile(userId, cleanDomain, limit);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: result.error,
            }, { status: result.error?.includes('credits') ? 402 : 500 });
        }

        return NextResponse.json({
            success: true,
            backlinks: result.data,
        });
    } catch (error: unknown) {
        console.error('[Backlinks DataForSEO API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch backlinks' },
            { status: 500 }
        );
    }
}
