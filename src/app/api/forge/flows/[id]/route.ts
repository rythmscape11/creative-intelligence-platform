/**
 * Forge Flow Operations
 * GET - Get flow details
 * PUT - Update flow
 * DELETE - Delete flow (drafts only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeFlowService } from '@/lib/services/forge';

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
        const flow = await ForgeFlowService.getByIdAndOrg(id, userId);

        if (!flow) {
            return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
        }

        return NextResponse.json({ flow });
    } catch (error) {
        console.error('Error fetching flow:', error);
        return NextResponse.json(
            { error: 'Failed to fetch flow' },
            { status: 500 }
        );
    }
}

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
        const { name, description, definitionJson, status } = body;

        const flow = await ForgeFlowService.update(id, userId, {
            name,
            description,
            definitionJson,
            status,
        });

        if (!flow) {
            return NextResponse.json({ error: 'Flow not found' }, { status: 404 });
        }

        return NextResponse.json({ flow });
    } catch (error) {
        console.error('Error updating flow:', error);
        const message = error instanceof Error ? error.message : 'Failed to update flow';
        return NextResponse.json({ error: message }, { status: 400 });
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
        const deleted = await ForgeFlowService.delete(id, userId);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Flow not found or cannot be deleted (only drafts can be deleted)' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting flow:', error);
        return NextResponse.json(
            { error: 'Failed to delete flow' },
            { status: 500 }
        );
    }
}
