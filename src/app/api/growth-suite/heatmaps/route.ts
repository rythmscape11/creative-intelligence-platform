/**
 * Heatmaps API
 * Aggregate and query click/scroll heatmap data
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/growth-suite/heatmaps
 * Get aggregated heatmap data for a page
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
        const page = searchParams.get('page');
        const days = parseInt(searchParams.get('days') || '7');
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        // Get events for heatmap calculation
        const events = await prisma.growthEvent.findMany({
            where: {
                userId: user.id,
                eventType: { in: ['click', 'scroll', 'pageview'] },
                timestamp: { gte: since },
                ...(page ? { properties: { contains: page } } : {}),
            },
            orderBy: { timestamp: 'desc' },
            take: 1000,
        });

        // Aggregate heatmap data
        const clicks = events
            .filter(e => e.eventType === 'click')
            .map(e => {
                try {
                    const props = e.properties ? JSON.parse(e.properties) : {};
                    return { x: props.x, y: props.y, page: props.page };
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        const scrollDepths = events
            .filter(e => e.eventType === 'scroll')
            .map(e => {
                try {
                    const props = e.properties ? JSON.parse(e.properties) : {};
                    return { depth: props.depth, page: props.page };
                } catch {
                    return null;
                }
            })
            .filter(Boolean);

        const pageviews = events.filter(e => e.eventType === 'pageview').length;

        return NextResponse.json({
            success: true,
            data: {
                clicks,
                scrollDepths,
                pageviews,
                period: { days, since },
            },
        });
    } catch (error) {
        console.error('[Heatmaps API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch heatmap data' }, { status: 500 });
    }
}

// Validation schema for tracking events
const TrackEventSchema = z.object({
    sessionId: z.string(),
    eventType: z.enum(['click', 'scroll', 'pageview', 'custom']),
    eventName: z.string().optional(),
    properties: z.record(z.unknown()).optional(),
});

/**
 * POST /api/growth-suite/heatmaps
 * Track a heatmap event (click, scroll, pageview)
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
        const validated = TrackEventSchema.parse(body);

        const event = await prisma.growthEvent.create({
            data: {
                userId: user.id,
                sessionId: validated.sessionId,
                eventType: validated.eventType,
                eventName: validated.eventName || validated.eventType,
                properties: validated.properties ? JSON.stringify(validated.properties) : null,
            },
        });

        return NextResponse.json({ success: true, data: event });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Heatmaps API] POST error:', error);
        return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
    }
}
