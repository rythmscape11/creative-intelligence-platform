import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

/**
 * Tracking Events API
 * POST /api/tracking/event - Track page views and general events
 */

interface TrackingEventBody {
    userId?: string;
    event: string;
    pathname: string;
    product: ProductType | null;
    timestamp: string;
    metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
    try {
        const body: TrackingEventBody = await request.json();
        let { userId, event, pathname, product, metadata } = body;

        // If no userId in body, try to get from auth
        if (!userId) {
            const authResult = await auth();
            userId = authResult.userId || undefined;
        }

        if (!userId) {
            // Don't fail for unauthenticated tracking, just skip
            return NextResponse.json({ tracked: false, reason: 'no_user' });
        }

        // Get actual user ID from database
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ id: userId }, { clerkId: userId }],
            },
        });

        if (!user) {
            return NextResponse.json({ tracked: false, reason: 'user_not_found' });
        }

        // Create session event for page views
        await prisma.userSessionEvent.create({
            data: {
                userId: user.id,
                eventType: event === 'page_view' ? 'PAGE_VIEW' : 'FEATURE_USED',
                source: pathname,
                product: product || undefined,
                metadata: metadata ? metadata : undefined,
            },
        });

        // If product-specific, also update usage count
        if (product) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            await prisma.userProductUsage.upsert({
                where: {
                    userId_product_feature_date: {
                        userId: user.id,
                        product,
                        feature: 'page_view',
                        date: today,
                    },
                },
                update: {
                    count: { increment: 1 },
                },
                create: {
                    userId: user.id,
                    product,
                    feature: 'page_view',
                    count: 1,
                    date: today,
                },
            });
        }

        return NextResponse.json({ tracked: true });
    } catch (error: any) {
        console.error('[Tracking Event] Error:', error);
        // Don't return error status to avoid breaking page loads
        return NextResponse.json({ tracked: false, error: error.message });
    }
}
