/**
 * Usage Check API
 * 
 * Returns current usage counts for the authenticated user.
 * Used for client-side limit enforcement.
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { USAGE_LIMITS, getRemainingUsage } from '@/config/usage-limits';
import { PricingTier } from '@/config/pricing';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user and subscription
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const plan = (user.subscription?.plan as PricingTier) || 'FREE';
        const limits = USAGE_LIMITS[plan];

        // Get current month's usage
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Count strategies created this month
        const strategiesThisMonth = await prisma.strategy.count({
            where: {
                userId,
                createdAt: { gte: startOfMonth },
            },
        });

        // Count saved strategies
        const savedStrategies = await prisma.strategy.count({
            where: { userId },
        });

        // Get usage from ledger for exports and AI insights
        const usageLedger = await prisma.usageLedger.groupBy({
            by: ['product'],
            where: {
                userId,
                createdAt: { gte: startOfMonth },
            },
            _count: true,
        });

        const pdfExportsThisMonth = usageLedger.find(u => u.product === 'pdf_export')?._count || 0;
        const aiInsightsToday = await prisma.usageLedger.count({
            where: {
                userId,
                product: 'ai_insight',
                createdAt: { gte: startOfDay },
            },
        });

        // Build response
        const usage = {
            plan,
            limits,
            current: {
                strategiesPerMonth: strategiesThisMonth,
                pdfExportsPerMonth: pdfExportsThisMonth,
                savedStrategies,
                aiInsightsPerDay: aiInsightsToday,
            },
            remaining: {
                strategiesPerMonth: getRemainingUsage(plan, 'strategiesPerMonth', strategiesThisMonth),
                pdfExportsPerMonth: getRemainingUsage(plan, 'pdfExportsPerMonth', pdfExportsThisMonth),
                savedStrategies: getRemainingUsage(plan, 'savedStrategies', savedStrategies),
                aiInsightsPerDay: getRemainingUsage(plan, 'aiInsightsPerDay', aiInsightsToday),
            },
        };

        return NextResponse.json(usage);
    } catch (error) {
        console.error('Usage check error:', error);
        return NextResponse.json(
            { error: 'Failed to check usage' },
            { status: 500 }
        );
    }
}
