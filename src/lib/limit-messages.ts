/**
 * Limit Messages
 * 
 * User-friendly error messages for plan limits.
 * Used throughout the app when users hit usage limits.
 */

import { PricingTier } from '@/config/pricing';
import { USAGE_LIMITS, UsageLimits } from '@/config/usage-limits';

export type LimitFeature = keyof UsageLimits;

interface LimitMessageConfig {
    feature: LimitFeature;
    currentUsage: number;
    plan: PricingTier;
}

/**
 * Get user-friendly limit reached message
 */
export function getLimitReachedMessage(config: LimitMessageConfig): string {
    const { feature, currentUsage, plan } = config;
    const limit = USAGE_LIMITS[plan][feature];

    const messages: Record<LimitFeature, string> = {
        strategiesPerMonth: `You've used ${currentUsage}/${limit} strategies this month. Upgrade to Pro for unlimited strategies.`,
        pdfExportsPerMonth: `You've used ${currentUsage}/${limit} PDF exports this month. Upgrade to Pro for unlimited exports.`,
        toolUsesPerSession: `You've reached the free tool limit. Enter your email to continue for free.`,
        savedStrategies: `You've saved ${currentUsage}/${limit} strategies. Upgrade to Pro for unlimited saves.`,
        aiInsightsPerDay: `You've used ${currentUsage}/${limit} AI insights today. Upgrade to Pro for unlimited insights.`,
    };

    return messages[feature] || 'You\'ve reached your plan limit. Upgrade for more.';
}

/**
 * Get warning message when approaching limit
 */
export function getLimitWarningMessage(config: LimitMessageConfig): string | null {
    const { feature, currentUsage, plan } = config;
    const limit = USAGE_LIMITS[plan][feature];

    if (limit === -1) return null; // Unlimited

    const remaining = limit - currentUsage;
    const percentage = currentUsage / limit;

    if (percentage < 0.8) return null; // Not yet at 80%

    const featureNames: Record<LimitFeature, string> = {
        strategiesPerMonth: 'strategies',
        pdfExportsPerMonth: 'PDF exports',
        toolUsesPerSession: 'tool uses',
        savedStrategies: 'saved strategies',
        aiInsightsPerDay: 'AI insights',
    };

    if (remaining === 1) {
        return `Last ${featureNames[feature]} remaining! Upgrade for unlimited access.`;
    }

    return `Only ${remaining} ${featureNames[feature]} remaining this period.`;
}

/**
 * Get CTA text for upgrade prompt
 */
export function getUpgradeCta(feature: LimitFeature): { text: string; targetPlan: 'PRO' | 'AGENCY' } {
    const ctaConfig: Record<LimitFeature, { text: string; targetPlan: 'PRO' | 'AGENCY' }> = {
        strategiesPerMonth: { text: 'Go Unlimited', targetPlan: 'PRO' },
        pdfExportsPerMonth: { text: 'Unlock Exports', targetPlan: 'PRO' },
        toolUsesPerSession: { text: 'Continue Free', targetPlan: 'PRO' },
        savedStrategies: { text: 'Save More', targetPlan: 'PRO' },
        aiInsightsPerDay: { text: 'Get AI Power', targetPlan: 'PRO' },
    };

    return ctaConfig[feature] || { text: 'Upgrade Now', targetPlan: 'PRO' };
}

/**
 * Get feature benefit description for upgrade modal
 */
export function getFeatureBenefit(feature: LimitFeature): string {
    const benefits: Record<LimitFeature, string> = {
        strategiesPerMonth: 'Create unlimited AI-powered marketing strategies every month',
        pdfExportsPerMonth: 'Export unlimited clean, professional PDFs without watermarks',
        toolUsesPerSession: 'Use all free tools without any restrictions',
        savedStrategies: 'Save and organize unlimited strategies in your library',
        aiInsightsPerDay: 'Get unlimited AI-powered insights and recommendations',
    };

    return benefits[feature] || 'Unlock unlimited access to this feature';
}

/**
 * Bundle of limit-related messages for a feature
 */
export interface LimitMessages {
    reachedMessage: string;
    warningMessage: string | null;
    cta: { text: string; targetPlan: 'PRO' | 'AGENCY' };
    benefit: string;
}

export function getLimitMessages(config: LimitMessageConfig): LimitMessages {
    return {
        reachedMessage: getLimitReachedMessage(config),
        warningMessage: getLimitWarningMessage(config),
        cta: getUpgradeCta(config.feature),
        benefit: getFeatureBenefit(config.feature),
    };
}
