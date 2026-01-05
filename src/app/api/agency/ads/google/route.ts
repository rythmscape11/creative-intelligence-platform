/**
 * Google Ads API Route
 * Connects to Google Ads via GCP OAuth2
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getGoogleAdsService } from '@/lib/gcp/google-ads';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        const googleAds = getGoogleAdsService();

        // Check configuration
        if (!googleAds.isConfigured()) {
            return NextResponse.json({
                configured: false,
                message: 'Google Ads API not configured. Please set environment variables.',
                required: [
                    'GOOGLE_ADS_CLIENT_ID',
                    'GOOGLE_ADS_CLIENT_SECRET',
                    'GOOGLE_ADS_DEVELOPER_TOKEN',
                    'GOOGLE_ADS_REFRESH_TOKEN',
                    'GOOGLE_ADS_CUSTOMER_ID',
                ],
            });
        }

        switch (action) {
            case 'campaigns':
                const campaigns = await googleAds.listCampaigns();
                return NextResponse.json({ campaigns });

            case 'summary':
                const summary = await googleAds.getAccountSummary();
                return NextResponse.json({ summary });

            case 'metrics':
                const campaignId = searchParams.get('campaignId');
                const startDate = searchParams.get('startDate') || getDateDaysAgo(30);
                const endDate = searchParams.get('endDate') || getToday();

                if (!campaignId) {
                    return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
                }

                const metrics = await googleAds.getCampaignMetrics(campaignId, {
                    start: startDate,
                    end: endDate,
                });
                return NextResponse.json({ metrics });

            default:
                return NextResponse.json({
                    configured: true,
                    actions: ['campaigns', 'summary', 'metrics'],
                });
        }
    } catch (error) {
        console.error('[Google Ads API] Error:', error);
        return NextResponse.json({ error: 'Google Ads API error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { action, campaignId, budget } = body;

        const googleAds = getGoogleAdsService();

        if (!googleAds.isConfigured()) {
            return NextResponse.json({ error: 'Google Ads not configured' }, { status: 400 });
        }

        switch (action) {
            case 'pause':
                if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
                await googleAds.pauseCampaign(campaignId);
                return NextResponse.json({ success: true, message: 'Campaign paused' });

            case 'enable':
                if (!campaignId) return NextResponse.json({ error: 'campaignId required' }, { status: 400 });
                await googleAds.enableCampaign(campaignId);
                return NextResponse.json({ success: true, message: 'Campaign enabled' });

            case 'updateBudget':
                if (!campaignId || !budget) {
                    return NextResponse.json({ error: 'campaignId and budget required' }, { status: 400 });
                }
                await googleAds.updateBudget(campaignId, budget);
                return NextResponse.json({ success: true, message: 'Budget updated' });

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('[Google Ads API] Error:', error);
        return NextResponse.json({ error: 'Google Ads API error' }, { status: 500 });
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
