/**
 * Forge Flow Publish API
 * POST - Publish a flow (validates and activates)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeFlowService } from '@/lib/services/forge';

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
        const flow = await ForgeFlowService.publish(id, userId);

        return NextResponse.json({ flow, message: 'Flow published successfully' });
    } catch (error) {
        console.error('Error publishing flow:', error);
        const message = error instanceof Error ? error.message : 'Failed to publish flow';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
