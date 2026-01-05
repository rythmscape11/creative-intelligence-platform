/**
 * Usage Limits Configuration
 * 
 * Centralized config for plan-based usage limits.
 * All limits are enforced client-side with server validation.
 * 
 * Set NEXT_PUBLIC_ENFORCE_LIMITS=true to enable enforcement.
 */

import { PricingTier } from './pricing';

export interface UsageLimits {
    strategiesPerMonth: number;  // -1 = unlimited
    pdfExportsPerMonth: number;
    toolUsesPerSession: number;
    savedStrategies: number;
    aiInsightsPerDay: number;
}

export const USAGE_LIMITS: Record<PricingTier, UsageLimits> = {
    FREE: {
        strategiesPerMonth: 5,
        pdfExportsPerMonth: 5,
        toolUsesPerSession: 3,
        savedStrategies: 3,
        aiInsightsPerDay: 10,
    },
    PRO: {
        strategiesPerMonth: -1,
        pdfExportsPerMonth: -1,
        toolUsesPerSession: -1,
        savedStrategies: -1,
        aiInsightsPerDay: -1,
    },
    AGENCY: {
        strategiesPerMonth: -1,
        pdfExportsPerMonth: -1,
        toolUsesPerSession: -1,
        savedStrategies: -1,
        aiInsightsPerDay: -1,
    },
    ENTERPRISE: {
        strategiesPerMonth: -1,
        pdfExportsPerMonth: -1,
        toolUsesPerSession: -1,
        savedStrategies: -1,
        aiInsightsPerDay: -1,
    },
};

/**
 * Enforcement configuration
 */
export const LIMIT_ENFORCEMENT = {
    /** Master switch - set via env var */
    enabled: process.env.NEXT_PUBLIC_ENFORCE_LIMITS === 'true',

    /** Show warning at this percentage of limit (0.8 = 80%) */
    softLimitWarningAt: 0.8,

    /** Grace period after limit reached (in hours) */
    gracePeriodHours: 24,

    /** Allow viewing past work even when at limit */
    allowViewingPastWork: true,
};

/**
 * Check if a limit is unlimited
 */
export function isUnlimited(limit: number): boolean {
    return limit === -1;
}

/**
 * Get remaining usage for a feature
 */
export function getRemainingUsage(
    plan: PricingTier,
    feature: keyof UsageLimits,
    currentUsage: number
): { remaining: number; isUnlimited: boolean; atLimit: boolean; nearLimit: boolean } {
    const limit = USAGE_LIMITS[plan][feature];

    if (limit === -1) {
        return { remaining: -1, isUnlimited: true, atLimit: false, nearLimit: false };
    }

    const remaining = Math.max(0, limit - currentUsage);
    const usagePercent = currentUsage / limit;

    return {
        remaining,
        isUnlimited: false,
        atLimit: remaining === 0,
        nearLimit: usagePercent >= LIMIT_ENFORCEMENT.softLimitWarningAt,
    };
}

/**
 * Get user-friendly limit message
 */
export function getLimitMessage(feature: keyof UsageLimits, plan: PricingTier): string {
    const limit = USAGE_LIMITS[plan][feature];

    if (limit === -1) return 'Unlimited';

    const featureNames: Record<keyof UsageLimits, string> = {
        strategiesPerMonth: 'strategies per month',
        pdfExportsPerMonth: 'PDF exports per month',
        toolUsesPerSession: 'tool uses per session',
        savedStrategies: 'saved strategies',
        aiInsightsPerDay: 'AI insights per day',
    };

    return `${limit} ${featureNames[feature]}`;
}
