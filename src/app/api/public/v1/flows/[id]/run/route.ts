/**
 * Public Flow Trigger API
 * POST /api/public/v1/flows/[id]/run
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/services/forge/api-key-middleware';
import { ForgeFlowService, ForgeExecutionService } from '@/lib/services/forge';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Validate API key
    const validation = await validateApiKey(request, ['flows']);

    if (!validation.valid) {
        return NextResponse.json(
            { error: validation.error, code: 'unauthorized' },
            { status: 401 }
        );
    }

    const apiKey = validation.key!;
    const { id: flowId } = await params;

    try {
        // Verify flow exists and belongs to the org
        const flow = await ForgeFlowService.getByIdAndOrg(flowId, apiKey.orgId);

        if (!flow) {
            return NextResponse.json(
                { error: 'Flow not found', code: 'not_found' },
                { status: 404 }
            );
        }

        if (flow.status !== 'published') {
            return NextResponse.json(
                { error: 'Flow is not published. Only published flows can be triggered via API.', code: 'bad_request' },
                { status: 400 }
            );
        }

        // Parse input payload
        const body = await request.json().catch(() => ({}));
        const { input } = body;

        // Queue flow run
        const run = await ForgeExecutionService.queueFlowRun({
            flowId,
            orgId: apiKey.orgId,
            triggeredBy: 'api',
            triggerType: 'manual',
            inputPayload: input || {},
        });

        return NextResponse.json({
            success: true,
            data: {
                run_id: run.id,
                flow_id: flowId,
                flow_name: flow.name,
                status: run.status,
                created_at: run.createdAt,
            },
            message: 'Flow run queued successfully',
        }, { status: 202 });
    } catch (error) {
        console.error('Flow trigger error:', error);
        const message = error instanceof Error ? error.message : 'Failed to trigger flow';
        return NextResponse.json(
            { error: message, code: 'internal_error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: flowId } = await params;

    return NextResponse.json({
        endpoint: `/api/public/v1/flows/${flowId}/run`,
        method: 'POST',
        description: 'Trigger a published flow with custom input',
        authentication: 'Bearer token (API key)',
        required_scopes: ['flows'],
        body: {
            input: { type: 'object', required: false, description: 'Input payload for the flow' },
        },
        response: {
            run_id: 'Unique identifier for the flow run',
            flow_id: 'Flow that was triggered',
            flow_name: 'Name of the flow',
            status: 'Run status (queued)',
            created_at: 'Timestamp of run creation',
        },
    });
}
