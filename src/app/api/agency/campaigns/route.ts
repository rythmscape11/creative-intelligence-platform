/**
 * Campaign API Routes
 * GET  /api/agency/campaigns - List all campaigns
 * POST /api/agency/campaigns - Create a new campaign
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CampaignService } from '@/lib/agency/campaign-service';
import { CampaignStatus, CampaignObjective } from '@prisma/client';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as CampaignStatus | null;
        const objective = searchParams.get('objective') as CampaignObjective | null;
        const projectId = searchParams.get('projectId');

        const campaigns = await CampaignService.list({
            status: status || undefined,
            objective: objective || undefined,
            projectId: projectId || undefined,
        });

        return NextResponse.json({ campaigns });
    } catch (error) {
        console.error('[Campaigns API] Error listing campaigns:', error);
        return NextResponse.json(
            { error: 'Failed to list campaigns' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Validate required fields
        if (!body.projectId) {
            return NextResponse.json(
                { error: 'projectId is required' },
                { status: 400 }
            );
        }
        if (!body.name) {
            return NextResponse.json(
                { error: 'name is required' },
                { status: 400 }
            );
        }

        const campaign = await CampaignService.create({
            ...body,
            createdBy: userId,
        });

        return NextResponse.json({ campaign }, { status: 201 });
    } catch (error) {
        console.error('[Campaigns API] Error creating campaign:', error);
        return NextResponse.json(
            { error: 'Failed to create campaign' },
            { status: 500 }
        );
    }
}
