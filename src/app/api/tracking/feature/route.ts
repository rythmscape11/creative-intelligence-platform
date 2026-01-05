import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ProductType } from '@prisma/client';

/**
 * Feature Tracking API
 * POST /api/tracking/feature - Track specific feature usage
 */

interface FeatureTrackingBody {
    feature: string;
    product: ProductType;
    metadata?: Record<string, any>;
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ tracked: false });
        }

        const body: FeatureTrackingBody = await request.json();
        const { feature, product, metadata } = body;

        // Get user
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ id: userId }, { clerkId: userId }],
            },
        });

        if (!user) {
            return NextResponse.json({ tracked: false });
        }

        // Update usage count for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.userProductUsage.upsert({
            where: {
                userId_product_feature_date: {
                    userId: user.id,
                    product,
                    feature,
                    date: today,
                },
            },
            update: {
                count: { increment: 1 },
            },
            create: {
                userId: user.id,
                product,
                feature,
                count: 1,
                date: today,
            },
        });

        // Also log as session event
        await prisma.userSessionEvent.create({
            data: {
                userId: user.id,
                eventType: 'FEATURE_USED',
                source: feature,
                product,
                metadata: metadata || undefined,
            },
        });

        return NextResponse.json({ tracked: true });
    } catch (error: any) {
        console.error('[Feature Tracking] Error:', error);
        return NextResponse.json({ tracked: false });
    }
}
