/**
 * Attribution API
 * Track and query marketing attribution data
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/growth-suite/attribution
 * Get attribution data with UTM breakdown
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '30');
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // Get sessions with UTM data
        const sessions = await prisma.growthSession.findMany({
            where: {
                userId: user.id,
                firstEventAt: { gte: since },
            },
            orderBy: { firstEventAt: 'desc' },
            take: 500,
        });

        // Calculate attribution breakdown
        const bySource = sessions.reduce((acc, s) => {
            const source = s.utmSource || 'direct';
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const byMedium = sessions.reduce((acc, s) => {
            const medium = s.utmMedium || 'none';
            acc[medium] = (acc[medium] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const byCampaign = sessions.reduce((acc, s) => {
            if (s.utmCampaign) {
                acc[s.utmCampaign] = (acc[s.utmCampaign] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const stats = {
            totalSessions: sessions.length,
            bySource,
            byMedium,
            byCampaign,
            topReferrers: sessions
                .filter(s => s.referrer)
                .reduce((acc, s) => {
                    const domain = new URL(s.referrer!).hostname;
                    acc[domain] = (acc[domain] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>),
        };

        return NextResponse.json({ success: true, data: sessions.slice(0, 50), stats });
    } catch (error) {
        console.error('[Attribution API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch attribution' }, { status: 500 });
    }
}

// Validation schema for tracking
const TrackSessionSchema = z.object({
    sessionId: z.string(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmTerm: z.string().optional(),
    utmContent: z.string().optional(),
    referrer: z.string().optional(),
    landingPage: z.string().optional(),
});

/**
 * POST /api/growth-suite/attribution
 * Track a new session with UTM params
 */
export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const validated = TrackSessionSchema.parse(body);

        // Upsert session
        const session = await prisma.growthSession.upsert({
            where: { sessionId: validated.sessionId },
            create: {
                userId: user.id,
                sessionId: validated.sessionId,
                utmSource: validated.utmSource,
                utmMedium: validated.utmMedium,
                utmCampaign: validated.utmCampaign,
                utmTerm: validated.utmTerm,
                utmContent: validated.utmContent,
                referrer: validated.referrer,
                landingPage: validated.landingPage,
            },
            update: {
                lastEventAt: new Date(),
            },
        });

        return NextResponse.json({ success: true, data: session });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Attribution API] POST error:', error);
        return NextResponse.json({ error: 'Failed to track session' }, { status: 500 });
    }
}
