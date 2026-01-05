/**
 * Public Run Status API
 * GET /api/public/v1/runs/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '@/lib/services/forge/api-key-middleware';
import { ForgeExecutionService } from '@/lib/services/forge';

export async function GET(
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
    const { id: runId } = await params;

    try {
        const result = await ForgeExecutionService.getRunWithNodes(runId);

        if (!result) {
            return NextResponse.json(
                { error: 'Run not found', code: 'not_found' },
                { status: 404 }
            );
        }

        // Verify org ownership
        if (result.run.orgId !== apiKey.orgId) {
            return NextResponse.json(
                { error: 'Run not found', code: 'not_found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: result.run.id,
                flow_id: result.run.flowId,
                status: result.run.status,
                trigger_type: result.run.triggerType,
                triggered_by: result.run.triggeredBy,
                input_payload: result.run.inputPayload,
                total_sparks_used: result.run.totalSparksUsed,
                started_at: result.run.startedAt,
                finished_at: result.run.finishedAt,
                created_at: result.run.createdAt,
                nodes: result.nodes.map(node => ({
                    node_id: node.nodeId,
                    node_type: node.nodeType,
                    status: node.status,
                    sparks_used: node.sparksUsed,
                    output: node.output,
                    error_message: node.errorMessage,
                    started_at: node.startedAt,
                    finished_at: node.finishedAt,
                })),
            },
        });
    } catch (error) {
        console.error('Run status error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch run status', code: 'internal_error' },
            { status: 500 }
        );
    }
}
