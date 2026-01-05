/**
 * Campaign Detail API Routes
 * GET    /api/agency/campaigns/[id] - Get campaign by ID
 * PATCH  /api/agency/campaigns/[id] - Update campaign
 * DELETE /api/agency/campaigns/[id] - Delete campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CampaignService } from '@/lib/agency/campaign-service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const campaign = await CampaignService.getById(id);

        if (!campaign) {
            return NextResponse.json(
                { error: 'Campaign not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ campaign });
    } catch (error) {
        console.error('[Campaign API] Error fetching campaign:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaign' },
            { status: 500 }
        );
    }
}

export async function PATCH(
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

        const campaign = await CampaignService.update(id, body);

        return NextResponse.json({ campaign });
    } catch (error) {
        console.error('[Campaign API] Error updating campaign:', error);
        return NextResponse.json(
            { error: 'Failed to update campaign' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await CampaignService.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Campaign API] Error deleting campaign:', error);
        return NextResponse.json(
            { error: 'Failed to delete campaign' },
            { status: 500 }
        );
    }
}
