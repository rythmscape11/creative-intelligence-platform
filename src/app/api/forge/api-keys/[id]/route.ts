/**
 * Forge API Key Operations
 * DELETE - Revoke an API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeApiKeyService } from '@/lib/services/forge';

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
        const key = await ForgeApiKeyService.revoke(id, userId);

        if (!key) {
            return NextResponse.json({ error: 'API key not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, key });
    } catch (error) {
        console.error('Error revoking API key:', error);
        return NextResponse.json(
            { error: 'Failed to revoke API key' },
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
        const { name, scopes, ipAllowlist, rateLimitPerMin } = body;

        const key = await ForgeApiKeyService.update(id, userId, {
            name,
            scopes,
            ipAllowlist,
            rateLimitPerMin,
        });

        if (!key) {
            return NextResponse.json({ error: 'API key not found' }, { status: 404 });
        }

        return NextResponse.json({ key });
    } catch (error) {
        console.error('Error updating API key:', error);
        return NextResponse.json(
            { error: 'Failed to update API key' },
            { status: 500 }
        );
    }
}
