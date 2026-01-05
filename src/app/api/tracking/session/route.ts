import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Session Tracking API
 * POST /api/tracking/session - Track login/logout and session events
 */

interface SessionTrackingBody {
    eventType: 'login' | 'logout' | 'session_start' | 'session_end';
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ tracked: false });
        }

        const body: SessionTrackingBody = await request.json();
        const { eventType } = body;

        // Get user
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ id: userId }, { clerkId: userId }],
            },
        });

        if (!user) {
            return NextResponse.json({ tracked: false });
        }

        // Map to session event type
        const eventTypeMap: Record<string, string> = {
            login: 'LOGIN',
            logout: 'LOGOUT',
            session_start: 'LOGIN',
            session_end: 'LOGOUT',
        };

        await prisma.userSessionEvent.create({
            data: {
                userId: user.id,
                eventType: eventTypeMap[eventType] || 'LOGIN',
                source: 'client',
            },
        });

        return NextResponse.json({ tracked: true });
    } catch (error: any) {
        console.error('[Session Tracking] Error:', error);
        return NextResponse.json({ tracked: false });
    }
}
