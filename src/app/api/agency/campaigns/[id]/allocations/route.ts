/**
 * Channel Allocations API
 * PUT /api/agency/campaigns/[id]/allocations - Update channel budget allocations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CampaignService } from '@/lib/agency/campaign-service';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        if (!Array.isArray(body.allocations)) {
            return NextResponse.json(
                { error: 'allocations array is required' },
                { status: 400 }
            );
        }

        const result = await CampaignService.updateChannelAllocations(id, body.allocations);

        return NextResponse.json({ success: true, count: result.count });
    } catch (error) {
        console.error('[Channel Allocations API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to update channel allocations' },
            { status: 500 }
        );
    }
}
