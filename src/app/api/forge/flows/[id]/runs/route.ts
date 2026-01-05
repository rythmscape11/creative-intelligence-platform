/**
 * Forge Flow Runs API
 * GET - List runs for a flow
 * POST - Trigger a manual run
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeExecutionService } from '@/lib/services/forge';

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
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        const result = await ForgeExecutionService.listRunsByFlow(id, { limit, offset });
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching runs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch runs' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json().catch(() => ({}));
        const { inputPayload } = body;

        const run = await ForgeExecutionService.queueFlowRun({
            flowId: id,
            orgId: userId,
            triggeredBy: userId,
            triggerType: 'manual',
            inputPayload: inputPayload || {},
        });

        return NextResponse.json({ run }, { status: 201 });
    } catch (error) {
        console.error('Error triggering run:', error);
        const message = error instanceof Error ? error.message : 'Failed to trigger run';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
