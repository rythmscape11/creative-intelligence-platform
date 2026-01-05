/**
 * Content Posts API
 * GET /api/agency/content - List posts
 * POST /api/agency/content - Create post
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ContentService } from '@/lib/agency/content-service';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const posts = await ContentService.listPosts({
            projectId: searchParams.get('projectId') || undefined,
            campaignId: searchParams.get('campaignId') || undefined,
            platform: searchParams.get('platform') || undefined,
            status: searchParams.get('status') || undefined,
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('[Content API] Error:', error);
        return NextResponse.json({ error: 'Failed to list posts' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        if (!body.projectId || !body.caption || !body.platform) {
            return NextResponse.json({ error: 'projectId, caption, and platform are required' }, { status: 400 });
        }

        const post = await ContentService.createPost({ ...body, createdBy: userId });
        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error('[Content API] Error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
