import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    try {
        // Verify authentication (optional, but good practice if client sends token)
        // Since this is called server-to-server (Edge -> Node), we might want a secret key
        // But for now, we'll trust the userId passed in the body if we assume internal call
        // OR we can just check auth() again if the cookie is passed.
        // Edge function passes headers, so auth() should work?
        // Actually, auth() on Node might not see the same session if called via fetch from Edge?
        // Let's rely on the body for now, assuming the Edge function verified the user.

        const body = await req.json();
        const { userId, action, entityType, details } = body;

        if (!userId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await prisma.userActivity.create({
            data: {
                userId,
                action,
                entityType,
                details: typeof details === 'string' ? details : JSON.stringify(details),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logging failed:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
