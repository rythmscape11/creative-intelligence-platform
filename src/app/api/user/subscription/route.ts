/**
 * User Subscription API
 * 
 * Returns the current user's subscription details for client-side feature gating.
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getUserTier, getSubscriptionDetails } from '@/lib/middleware/subscription-guard';

export async function GET() {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({
                tier: 'FREE',
                features: {
                    canExport: false,
                    canUseApi: false,
                    canWhiteLabel: false,
                    hasUnlimitedStrategies: false,
                },
            });
        }

        // Find internal user
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return NextResponse.json({
                tier: 'FREE',
                features: {
                    canExport: false,
                    canUseApi: false,
                    canWhiteLabel: false,
                    hasUnlimitedStrategies: false,
                },
            });
        }

        const details = await getSubscriptionDetails(user.id);

        return NextResponse.json({
            tier: details?.tier || 'FREE',
            status: details?.status || 'INACTIVE',
            periodEnd: details?.periodEnd,
            limits: details?.limits,
            features: details?.features || {
                canExport: false,
                canUseApi: false,
                canWhiteLabel: false,
                hasUnlimitedStrategies: false,
            },
        });
    } catch (error) {
        console.error('[API] Error fetching subscription:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription' },
            { status: 500 }
        );
    }
}
