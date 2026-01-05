/**
 * Subscription Guard Middleware
 * 
 * Read-only inspection of subscription state.
 * Wraps existing API handlers to enforce plan-based access.
 * 
 * IMPORTANT: This middleware does NOT modify existing auth logic.
 * It only adds an additional layer of plan-based access control.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PLAN_LIMITS, PricingTier, canAccessFeature } from '@/config/pricing';
import { auth } from '@clerk/nextjs/server';

/**
 * Feature types that can be gated
 */
export type GatedFeature =
    | 'strategy_export'      // PDF/PPTX export
    | 'forge_execution'      // Forge flow execution
    | 'api_access'           // Public API access
    | 'white_label'          // White-label reports
    | 'team_seats'           // Multi-user access
    | 'unlimited_strategies' // Strategy creation limit
    | 'advanced_analytics';  // Advanced analytics

/**
 * Access check result
 */
export interface AccessCheckResult {
    allowed: boolean;
    reason?: string;
    currentTier: PricingTier;
    requiredTier?: PricingTier;
    upgradeUrl?: string;
}

/**
 * Get user's current subscription tier
 */
export async function getUserTier(userId: string): Promise<PricingTier> {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        if (!subscription) {
            return 'FREE';
        }

        // Check if subscription is active
        if (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING') {
            return 'FREE';
        }

        // Check if subscription period is still valid
        if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) {
            return 'FREE';
        }

        return subscription.plan as PricingTier;
    } catch (error) {
        console.error('[SubscriptionGuard] Error getting user tier:', error);
        return 'FREE';
    }
}

/**
 * Check if user can access a specific feature
 */
export async function checkFeatureAccess(
    userId: string,
    feature: GatedFeature
): Promise<AccessCheckResult> {
    const currentTier = await getUserTier(userId);

    // Map features to required tiers
    const featureRequirements: Record<GatedFeature, PricingTier> = {
        strategy_export: 'PRO',        // PRO+ can export
        forge_execution: 'FREE',       // All can execute, but credits checked separately
        api_access: 'AGENCY',          // AGENCY+ for API
        white_label: 'AGENCY',         // AGENCY+ for white-label
        team_seats: 'AGENCY',          // AGENCY+ for teams
        unlimited_strategies: 'PRO',   // PRO+ for unlimited
        advanced_analytics: 'AGENCY',  // AGENCY+ for analytics
    };

    const requiredTier = featureRequirements[feature];
    const tierHierarchy: PricingTier[] = ['FREE', 'PRO', 'AGENCY', 'ENTERPRISE'];
    const currentLevel = tierHierarchy.indexOf(currentTier);
    const requiredLevel = tierHierarchy.indexOf(requiredTier);

    const allowed = currentLevel >= requiredLevel;

    return {
        allowed,
        reason: allowed ? undefined : `This feature requires ${requiredTier} plan or higher`,
        currentTier,
        requiredTier: allowed ? undefined : requiredTier,
        upgradeUrl: allowed ? undefined : '/pricing',
    };
}

/**
 * Check strategy creation limit
 */
export async function checkStrategyLimit(userId: string): Promise<{
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
}> {
    try {
        const tier = await getUserTier(userId);
        const limit = PLAN_LIMITS[tier]?.strategiesPerMonth || 5;

        // Unlimited for paid tiers
        if (limit === -1) {
            return { allowed: true, used: 0, limit: -1, remaining: -1 };
        }

        // Count strategies created this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const used = await prisma.marketingStrategy.count({
            where: {
                userId,
                createdAt: { gte: startOfMonth },
            },
        });

        const remaining = Math.max(0, limit - used);

        return {
            allowed: remaining > 0,
            used,
            limit,
            remaining,
        };
    } catch (error) {
        console.error('[SubscriptionGuard] Error checking strategy limit:', error);
        return { allowed: false, used: 0, limit: 5, remaining: 0 };
    }
}

/**
 * Higher-order function to wrap API handlers with subscription checks
 * 
 * Usage:
 * export const POST = withSubscriptionGuard('strategy_export', async (req, ctx) => {
 *   // Handler code
 * });
 */
export function withSubscriptionGuard(
    feature: GatedFeature,
    handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
    return async (req: NextRequest, context?: any): Promise<NextResponse> => {
        try {
            // Get the current user
            const { userId } = await auth();

            if (!userId) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Please sign in to access this feature' },
                    { status: 401 }
                );
            }

            // Find internal user ID from Clerk ID
            const user = await prisma.user.findUnique({
                where: { clerkId: userId },
            });

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found', message: 'User account not found' },
                    { status: 404 }
                );
            }

            // Check feature access
            const access = await checkFeatureAccess(user.id, feature);

            if (!access.allowed) {
                return NextResponse.json(
                    {
                        error: 'Upgrade required',
                        message: access.reason,
                        currentTier: access.currentTier,
                        requiredTier: access.requiredTier,
                        upgradeUrl: access.upgradeUrl,
                    },
                    { status: 403 }
                );
            }

            // Call the original handler
            return handler(req, context);
        } catch (error) {
            console.error('[SubscriptionGuard] Error in guard:', error);
            return NextResponse.json(
                { error: 'Internal server error', message: 'Failed to verify subscription' },
                { status: 500 }
            );
        }
    };
}

/**
 * Utility to get user's subscription details for UI display
 */
export async function getSubscriptionDetails(userId: string) {
    try {
        const subscription = await prisma.subscription.findUnique({
            where: { userId },
        });

        const tier = await getUserTier(userId);
        const limits = PLAN_LIMITS[tier];

        return {
            tier,
            status: subscription?.status || 'INACTIVE',
            periodEnd: subscription?.currentPeriodEnd,
            cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd || false,
            limits,
            features: {
                canExport: tier !== 'FREE',
                canUseApi: canAccessFeature(tier, 'apiAccess'),
                canWhiteLabel: canAccessFeature(tier, 'whiteLabel'),
                hasUnlimitedStrategies: canAccessFeature(tier, 'unlimitedStrategies'),
            },
        };
    } catch (error) {
        console.error('[SubscriptionGuard] Error getting subscription details:', error);
        return null;
    }
}

/**
 * Create a response for blocked features with upgrade info
 */
export function createUpgradeRequiredResponse(
    feature: string,
    currentTier: PricingTier,
    requiredTier: PricingTier
): NextResponse {
    return NextResponse.json(
        {
            error: 'upgrade_required',
            message: `The ${feature} feature requires a ${requiredTier} plan or higher.`,
            currentTier,
            requiredTier,
            upgradeUrl: '/pricing',
            ctaText: `Upgrade to ${requiredTier}`,
        },
        { status: 403 }
    );
}
