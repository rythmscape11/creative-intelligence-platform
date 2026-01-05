/**
 * Product Access Control for MediaPlanPro
 * 
 * Handles feature gating based on user's product subscriptions.
 * Used to check if a user can access specific products, features, or tiers.
 */

import { prisma } from '@/lib/prisma';
import {
    ProductType,
    PlanTier,
    getProductPlan,
    getFeatureLimit,
    ProductLimits
} from '@/config/product-plans';

// Re-export types for convenience
export { ProductType, PlanTier } from '@/config/product-plans';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface UserProductAccess {
    product: ProductType;
    tier: PlanTier;
    status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'PAUSED';
    expiresAt: Date;
    isActive: boolean;
}

export interface UserSubscriptionState {
    userId: string;
    subscriptions: UserProductAccess[];
    hasAnyActiveSubscription: boolean;
    hasBundle: boolean;
}

// ============================================
// SUBSCRIPTION FETCHING
// ============================================

/**
 * Get all active subscriptions for a user
 */
export async function getUserSubscriptions(userId: string): Promise<UserProductAccess[]> {
    const subscriptions = await prisma.productSubscription.findMany({
        where: {
            userId,
            status: {
                in: ['ACTIVE', 'TRIALING', 'PAST_DUE'],
            },
        },
    });

    return subscriptions.map(sub => ({
        product: sub.product as ProductType,
        tier: sub.planTier as PlanTier,
        status: sub.status as UserProductAccess['status'],
        expiresAt: sub.currentPeriodEnd,
        isActive: sub.status === 'ACTIVE' || sub.status === 'TRIALING',
    }));
}

/**
 * Get the full subscription state for a user
 */
export async function getUserSubscriptionState(userId: string): Promise<UserSubscriptionState> {
    const subscriptions = await getUserSubscriptions(userId);

    return {
        userId,
        subscriptions,
        hasAnyActiveSubscription: subscriptions.some(s => s.isActive),
        hasBundle: subscriptions.length === 4 && subscriptions.every(s => s.isActive),
    };
}

/**
 * Get subscription for a specific product
 */
export async function getProductSubscription(
    userId: string,
    product: ProductType
): Promise<UserProductAccess | null> {
    const subscription = await prisma.productSubscription.findUnique({
        where: {
            userId_product: {
                userId,
                product,
            },
        },
    });

    if (!subscription) return null;

    return {
        product: subscription.product as ProductType,
        tier: subscription.planTier as PlanTier,
        status: subscription.status as UserProductAccess['status'],
        expiresAt: subscription.currentPeriodEnd,
        isActive: subscription.status === 'ACTIVE' || subscription.status === 'TRIALING',
    };
}

// ============================================
// ACCESS CHECKS
// ============================================

/**
 * Check if user has access to a product (any tier)
 */
export async function hasProductAccess(
    userId: string,
    product: ProductType
): Promise<boolean> {
    const subscription = await getProductSubscription(userId, product);

    // Special case: Strategiser has a free tier
    if (!subscription && product === 'STRATEGISER') {
        return true; // Free tier access
    }

    return subscription?.isActive ?? false;
}

/**
 * Check if user has access to a specific tier or higher
 */
export async function hasTierAccess(
    userId: string,
    product: ProductType,
    requiredTier: PlanTier
): Promise<boolean> {
    const subscription = await getProductSubscription(userId, product);

    if (!subscription) {
        // Only Strategiser has free tier
        if (product === 'STRATEGISER' && requiredTier === 'FREE') {
            return true;
        }
        return false;
    }

    if (!subscription.isActive) return false;

    const tierHierarchy: PlanTier[] = ['FREE', 'STARTER', 'PRO', 'AGENCY', 'ENTERPRISE'];
    const userLevel = tierHierarchy.indexOf(subscription.tier);
    const requiredLevel = tierHierarchy.indexOf(requiredTier);

    return userLevel >= requiredLevel;
}

/**
 * Check if user can access a specific feature
 */
export async function hasFeatureAccess(
    userId: string,
    product: ProductType,
    feature: keyof ProductLimits
): Promise<boolean> {
    const subscription = await getProductSubscription(userId, product);
    const tier = subscription?.tier ?? (product === 'STRATEGISER' ? 'FREE' : null);

    if (!tier) return false;

    const limit = getFeatureLimit(product, tier, feature);

    if (typeof limit === 'boolean') return limit;
    if (typeof limit === 'number') return limit !== 0;
    if (typeof limit === 'string') return true;

    return false;
}

/**
 * Get the user's tier for a product (or FREE for Strategiser)
 */
export async function getUserTier(
    userId: string,
    product: ProductType
): Promise<PlanTier> {
    const subscription = await getProductSubscription(userId, product);

    if (!subscription) {
        return product === 'STRATEGISER' ? 'FREE' : 'FREE';
    }

    return subscription.tier;
}

// ============================================
// LIMIT CHECKS
// ============================================

/**
 * Get the limit for a specific feature
 */
export async function getLimit(
    userId: string,
    product: ProductType,
    limitKey: keyof ProductLimits
): Promise<number | boolean | string | undefined> {
    const tier = await getUserTier(userId, product);
    return getFeatureLimit(product, tier, limitKey);
}

/**
 * Check if user is within usage limits for a feature
 */
export async function isWithinUsageLimit(
    userId: string,
    product: ProductType,
    feature: string,
    additionalUsage: number = 1
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const tier = await getUserTier(userId, product);
    const plan = getProductPlan(product, tier);

    if (!plan) {
        return { allowed: false, remaining: 0, limit: 0 };
    }

    // Map feature to limit key
    const limitMap: Record<string, keyof ProductLimits> = {
        strategies: 'strategies',
        exports: 'exports',
        clients: 'clients',
        projects: 'projects',
        domains: 'domains',
        keywords: 'keywords',
        adAccounts: 'adAccounts',
        campaigns: 'campaigns',
        apiCalls: 'apiCalls',
    };

    const limitKey = limitMap[feature];
    if (!limitKey) {
        return { allowed: true, remaining: -1, limit: -1 }; // No limit defined
    }

    const limit = plan.limits[limitKey];

    if (typeof limit !== 'number') {
        return { allowed: true, remaining: -1, limit: -1 };
    }

    if (limit === -1) {
        return { allowed: true, remaining: -1, limit: -1 }; // Unlimited
    }

    // Get current usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.userProductUsage.findFirst({
        where: {
            userId,
            product,
            feature,
            date: today,
        },
    });

    const currentUsage = usage?.count ?? 0;
    const remaining = Math.max(0, limit - currentUsage);
    const allowed = currentUsage + additionalUsage <= limit;

    return { allowed, remaining, limit };
}

/**
 * Track usage of a feature
 */
export async function trackUsage(
    userId: string,
    product: ProductType,
    feature: string,
    count: number = 1,
    metadata?: Record<string, unknown>
): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.userProductUsage.upsert({
        where: {
            userId_product_feature_date: {
                userId,
                product,
                feature,
                date: today,
            },
        },
        update: {
            count: { increment: count },
            metadata: metadata ? metadata as object : undefined,
        },
        create: {
            userId,
            product,
            feature,
            count,
            date: today,
            metadata: metadata as object,
        },
    });
}

// ============================================
// UPGRADE PROMPTS
// ============================================

export interface UpgradePrompt {
    shouldPrompt: boolean;
    currentTier: PlanTier;
    suggestedTier: PlanTier;
    reason: string;
    featureBlocked?: string;
}

/**
 * Determine if user should see an upgrade prompt
 */
export async function getUpgradePrompt(
    userId: string,
    product: ProductType,
    attemptedFeature?: string
): Promise<UpgradePrompt> {
    const subscription = await getProductSubscription(userId, product);
    const currentTier = subscription?.tier ?? 'FREE';

    // Suggest next tier
    const tierHierarchy: PlanTier[] = ['FREE', 'STARTER', 'PRO', 'AGENCY', 'ENTERPRISE'];
    const currentIndex = tierHierarchy.indexOf(currentTier);
    const suggestedTier = tierHierarchy[Math.min(currentIndex + 1, tierHierarchy.length - 2)] as PlanTier;

    // Check if trying to access blocked feature
    if (attemptedFeature) {
        const hasAccess = await hasFeatureAccess(userId, product, attemptedFeature as keyof ProductLimits);
        if (!hasAccess) {
            return {
                shouldPrompt: true,
                currentTier,
                suggestedTier,
                reason: `Upgrade to ${suggestedTier} to unlock ${attemptedFeature}`,
                featureBlocked: attemptedFeature,
            };
        }
    }

    return {
        shouldPrompt: false,
        currentTier,
        suggestedTier,
        reason: '',
    };
}

// ============================================
// MIDDLEWARE HELPERS
// ============================================

/**
 * Guard function for API routes - throws if no access
 */
export async function requireProductAccess(
    userId: string,
    product: ProductType,
    tier?: PlanTier
): Promise<void> {
    if (tier) {
        const hasAccess = await hasTierAccess(userId, product, tier);
        if (!hasAccess) {
            throw new Error(`Upgrade to ${tier} to access this feature`);
        }
    } else {
        const hasAccess = await hasProductAccess(userId, product);
        if (!hasAccess) {
            throw new Error(`Subscribe to ${product} to access this feature`);
        }
    }
}

/**
 * Check multiple products/features at once
 */
export async function checkMultipleAccess(
    userId: string,
    requirements: { product: ProductType; tier?: PlanTier; feature?: string }[]
): Promise<{ product: ProductType; hasAccess: boolean; reason?: string }[]> {
    const results = await Promise.all(
        requirements.map(async (req) => {
            if (req.tier) {
                const hasAccess = await hasTierAccess(userId, req.product, req.tier);
                return {
                    product: req.product,
                    hasAccess,
                    reason: hasAccess ? undefined : `Requires ${req.tier} tier`,
                };
            }

            if (req.feature) {
                const hasAccess = await hasFeatureAccess(userId, req.product, req.feature as keyof ProductLimits);
                return {
                    product: req.product,
                    hasAccess,
                    reason: hasAccess ? undefined : `Feature ${req.feature} not available`,
                };
            }

            const hasAccess = await hasProductAccess(userId, req.product);
            return {
                product: req.product,
                hasAccess,
                reason: hasAccess ? undefined : `Subscription required`,
            };
        })
    );

    return results;
}
