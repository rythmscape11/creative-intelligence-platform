/**
 * Meta (Facebook) Ads API Route
 * Connects to Meta Ads via official SDK
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getMetaAdsService } from '@/lib/agency/meta-ads-service';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        const metaAds = getMetaAdsService();

        // Check configuration
        if (!metaAds.isConfigured()) {
            return NextResponse.json({
                configured: false,
                message: 'Meta Ads API not configured. Please set environment variables.',
                required: [
                    'META_ADS_ACCESS_TOKEN',
                    'META_ADS_APP_ID',
                    'META_ADS_APP_SECRET',
                    'META_ADS_ACCOUNT_ID',
                ],
                setup: {
                    steps: [
                        '1. Create a Meta Developer App at https://developers.facebook.com',
                        '2. Add "Marketing API" product to your app',
                        '3. Get Access Token from Graph API Explorer',
                        '4. Set environment variables',
                    ],
                },
            });
        }

        switch (action) {
            case 'campaigns':
                const campaigns = await metaAds.listCampaigns();
                return NextResponse.json({ campaigns });

            case 'summary':
                const summary = await metaAds.getAccountSummary();
                return NextResponse.json({ summary });

            case 'insights':
                const campaignId = searchParams.get('campaignId');
                const since = searchParams.get('since') || getDateDaysAgo(30);
                const until = searchParams.get('until') || getToday();

                if (!campaignId) {
                    return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
                }

                const insights = await metaAds.getCampaignInsights(campaignId, {
                    since,
                    until,
                });
                return NextResponse.json({ insights });

            case 'adsets':
                const campId = searchParams.get('campaignId');
                if (!campId) {
                    return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
                }
                const adsets = await metaAds.listAdSets(campId);
                return NextResponse.json({ adsets });

            default:
                return NextResponse.json({
                    configured: true,
                    actions: ['campaigns', 'summary', 'insights', 'adsets'],
                });
        }
    } catch (error) {
        console.error('[Meta Ads API] Error:', error);
        return NextResponse.json({ error: 'Meta Ads API error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { action, campaignId, budget } = body;

        const metaAds = getMetaAdsService();

        if (!metaAds.isConfigured()) {
            return NextResponse.json({ error: 'Meta Ads not configured' }, { status: 400 });
        }

        switch (action) {
            case 'pause':
                if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
                const paused = await metaAds.pauseCampaign(campaignId);
                return NextResponse.json({ success: paused, message: paused ? 'Campaign paused' : 'Failed to pause' });

            case 'activate':
                if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
                const activated = await metaAds.activateCampaign(campaignId);
                return NextResponse.json({ success: activated, message: activated ? 'Campaign activated' : 'Failed to activate' });

            case 'updateBudget':
                if (!campaignId || !budget) {
                    return NextResponse.json({ error: 'campaignId and budget required' }, { status: 400 });
                }
                const updated = await metaAds.updateBudget(campaignId, budget);
                return NextResponse.json({ success: updated, message: updated ? 'Budget updated' : 'Failed to update' });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('[Meta Ads API] Error:', error);
        return NextResponse.json({ error: 'Meta Ads API error' }, { status: 500 });
    }
}

function getToday(): string {
    return new Date().toISOString().split('T')[0];
}

function getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}
