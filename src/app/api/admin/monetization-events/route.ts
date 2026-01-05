/**
 * Monetization Events API
 * 
 * Receives and stores monetization events for admin dashboard.
 * POST: Log new event
 * GET: Retrieve events for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface MonetizationEvent {
    type: string;
    userId?: string;
    feature?: string;
    currentPlan?: string;
    targetPlan?: string;
    metadata?: Record<string, unknown>;
    timestamp: string;
    page?: string;
    referrer?: string;
}

/**
 * POST - Log a monetization event
 */
export async function POST(request: NextRequest) {
    try {
        const event: MonetizationEvent = await request.json();

        // Get user ID if authenticated
        const { userId } = await auth();

        // Store in database
        await prisma.userActivity.create({
            data: {
                userId: userId || event.userId || 'anonymous',
                action: `monetization:${event.type}`,
                entityType: 'monetization_event',
                entityId: event.type,
                details: JSON.stringify({
                    feature: event.feature,
                    currentPlan: event.currentPlan,
                    targetPlan: event.targetPlan,
                    metadata: event.metadata,
                    page: event.page,
                    referrer: event.referrer,
                }),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to log monetization event:', error);
        return NextResponse.json(
            { error: 'Failed to log event' },
            { status: 500 }
        );
    }
}

/**
 * GET - Retrieve monetization events for admin dashboard
 */
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '7', 10);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Get monetization events
        const events = await prisma.userActivity.findMany({
            where: {
                action: { startsWith: 'monetization:' },
                timestamp: { gte: startDate },
            },
            orderBy: { timestamp: 'desc' },
            take: 500,
        });

        // Aggregate by type
        const eventsByType: Record<string, number> = {};
        events.forEach((event) => {
            const type = event.action.replace('monetization:', '');
            eventsByType[type] = (eventsByType[type] || 0) + 1;
        });

        // Get trial users approaching expiry
        const trialExpiringSoon = await prisma.subscription.count({
            where: {
                status: 'TRIALING',
                currentPeriodEnd: {
                    gte: new Date(),
                    lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
                },
            },
        });

        // Get free users at limit
        const freeUsersAtLimit = await prisma.user.count({
            where: {
                subscription: null,
                strategies: {
                    some: {
                        createdAt: { gte: startDate },
                    },
                },
            },
        });

        return NextResponse.json({
            summary: {
                upgradeClicks: eventsByType['upgrade_click'] || 0,
                paywallHits: eventsByType['paywall_hit'] || 0,
                limitsReached: eventsByType['limit_reached'] || 0,
                nudgesShown: eventsByType['nudge_shown'] || 0,
                emailsCaptured: eventsByType['email_captured'] || 0,
                trialExpiringSoon,
                freeUsersAtLimit,
            },
            recentEvents: events.slice(0, 50).map((e) => ({
                type: e.action.replace('monetization:', ''),
                timestamp: e.timestamp,
                userId: e.userId,
                details: e.details,
            })),
            period: `${days} days`,
        });
    } catch (error) {
        console.error('Failed to get monetization events:', error);
        return NextResponse.json(
            { error: 'Failed to get events' },
            { status: 500 }
        );
    }
}
