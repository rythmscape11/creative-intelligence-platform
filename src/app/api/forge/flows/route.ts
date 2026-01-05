/**
 * Forge Flows API
 * GET - List flows for current org
 * POST - Create new flow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeFlowService, FlowStatus } from '@/lib/services/forge';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as FlowStatus | null;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const result = await ForgeFlowService.listByOrg(userId, {
            status: status || undefined,
            limit,
            offset,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching flows:', error);
        return NextResponse.json(
            { error: 'Failed to fetch flows' },
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
        const { name, description, definitionJson } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const flow = await ForgeFlowService.create({
            orgId: userId,
            name,
            description,
            definitionJson,
        });

        return NextResponse.json({ flow }, { status: 201 });
    } catch (error) {
        console.error('Error creating flow:', error);
        return NextResponse.json(
            { error: 'Failed to create flow' },
            { status: 500 }
        );
    }
}
