/**
 * Ads API Routes
 * GET /api/agency/ads - List all ads
 * POST /api/agency/ads - Create new ad
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AdPlatformService } from '@/lib/agency/ad-platform-service';
import { AdStatus, OptimizationMode } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const ads = await AdPlatformService.listAds({
            connectionId: searchParams.get('connectionId') || undefined,
            campaignId: searchParams.get('campaignId') || undefined,
            status: searchParams.get('status') as AdStatus || undefined,
            optimizationMode: searchParams.get('optimizationMode') as OptimizationMode || undefined,
        });

        return NextResponse.json({ ads });
    } catch (error) {
        console.error('[Ads API] Error:', error);
        return NextResponse.json({ error: 'Failed to list ads' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        if (!body.connectionId || !body.name || body.budget === undefined) {
            return NextResponse.json(
                { error: 'connectionId, name, and budget are required' },
                { status: 400 }
            );
        }

        const ad = await AdPlatformService.createAd({
            ...body,
            createdBy: userId,
        });

        return NextResponse.json({ ad }, { status: 201 });
    } catch (error) {
        console.error('[Ads API] Error:', error);
        return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
    }
}
