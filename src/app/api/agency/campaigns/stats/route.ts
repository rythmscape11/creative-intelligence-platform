/**
 * Campaign Stats API
 * GET /api/agency/campaigns/stats - Get campaign statistics
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CampaignService } from '@/lib/agency/campaign-service';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const stats = await CampaignService.getStats();

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('[Campaign Stats API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaign stats' },
            { status: 500 }
        );
    }
}
