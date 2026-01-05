/**
 * Forge Inbound Webhook Handler
 * POST - Handle incoming webhook requests and trigger flows
 */

import { NextRequest, NextResponse } from 'next/server';
import { ForgeWebhookService } from '@/lib/services/forge';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Parse body
        const body = await request.json().catch(() => ({}));

        // Get signature from header (optional)
        const signature = request.headers.get('x-forge-signature') || undefined;

        // Handle webhook
        const result = await ForgeWebhookService.handleWebhookRequest(slug, body, signature);

        return NextResponse.json({
            success: true,
            runId: result.runId,
            message: 'Flow run queued successfully',
        });
    } catch (error) {
        console.error('Webhook handler error:', error);
        const message = error instanceof Error ? error.message : 'Webhook processing failed';

        // Return appropriate status based on error
        if (message === 'Webhook not found') {
            return NextResponse.json({ error: message }, { status: 404 });
        }
        if (message === 'Webhook is paused') {
            return NextResponse.json({ error: message }, { status: 503 });
        }
        if (message === 'Invalid signature') {
            return NextResponse.json({ error: message }, { status: 401 });
        }

        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// Also support GET for testing/verification
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    return NextResponse.json({
        status: 'active',
        slug,
        message: 'Webhook endpoint is active. Send POST requests to trigger flows.',
    });
}
