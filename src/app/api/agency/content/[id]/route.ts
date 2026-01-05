/**
 * Content Post Detail API
 * GET/PATCH/DELETE /api/agency/content/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ContentService } from '@/lib/agency/content-service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const post = await ContentService.getById(id);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        return NextResponse.json({ post });
    } catch (error) {
        console.error('[Content API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const post = await ContentService.update(id, body);

        return NextResponse.json({ post });
    } catch (error) {
        console.error('[Content API] Error:', error);
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await ContentService.delete(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Content API] Error:', error);
        return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}
