/**
 * The Analyser - Pricing Configuration
 * 
 * Defines costs, margins, and credit values for all Analyser operations.
 * Supports both credits-based and metered billing modes.
 */

export type AnalyserOperation =
    | 'KEYWORD_LOOKUP'
    | 'SERP_SCAN'
    | 'COMPETITOR_LOOKUP'
    | 'BACKLINK_LOOKUP'
    | 'GEO_ANALYSIS'
    | 'DOMAIN_OVERVIEW';

export interface OperationPricing {
    apiCostUsd: number;      // Our cost per unit
    markupMultiplier: number; // e.g., 4x = 400% markup
    creditsCost: number;      // Credits consumed per operation
    description: string;
    category: 'seo' | 'geo' | 'analytics';
}

/**
 * Pricing for all Analyser operations
 * 
 * Formula: userPriceUsd = apiCostUsd * markupMultiplier
 */
export const ANALYSER_PRICING: Record<AnalyserOperation, OperationPricing> = {
    KEYWORD_LOOKUP: {
        apiCostUsd: 0.003,
        markupMultiplier: 4,
        creditsCost: 1,
        description: 'Keyword search volume, CPC, and competition data',
        category: 'seo',
    },
    SERP_SCAN: {
        apiCostUsd: 0.01,
        markupMultiplier: 4,
        creditsCost: 5,
        description: 'Full SERP analysis with organic and paid results',
        category: 'seo',
    },
    COMPETITOR_LOOKUP: {
        apiCostUsd: 0.02,
        markupMultiplier: 3,
        creditsCost: 10,
        description: 'Domain traffic, keywords, and competitive metrics',
        category: 'seo',
    },
    BACKLINK_LOOKUP: {
        apiCostUsd: 0.015,
        markupMultiplier: 3,
        creditsCost: 15,
        description: 'Backlink profile analysis and referring domains',
        category: 'seo',
    },
    GEO_ANALYSIS: {
        apiCostUsd: 0.05,
        markupMultiplier: 2,
        creditsCost: 25,
        description: 'AI answerability scoring and GEO recommendations',
        category: 'geo',
    },
    DOMAIN_OVERVIEW: {
        apiCostUsd: 0.025,
        markupMultiplier: 3,
        creditsCost: 12,
        description: 'Complete domain health and SEO overview',
        category: 'analytics',
    },
};

/**
 * Credit pack pricing for Razorpay purchases
 */
export const CREDIT_PACKS = [
    {
        id: 'starter',
        name: 'Starter',
        credits: 100,
        priceInr: 499,
        priceUsd: 5.99,
        popular: false,
        description: 'Perfect for trying out The Analyser',
    },
    {
        id: 'pro',
        name: 'Pro',
        credits: 500,
        priceInr: 1999,
        priceUsd: 23.99,
        popular: true,
        description: 'Best value for regular users',
    },
    {
        id: 'agency',
        name: 'Agency',
        credits: 2000,
        priceInr: 6999,
        priceUsd: 83.99,
        popular: false,
        description: 'For teams and agencies',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 10000,
        priceInr: 29999,
        priceUsd: 359.99,
        popular: false,
        description: 'High-volume usage',
    },
];

/**
 * Billing configuration
 */
export const BILLING_CONFIG = {
    mode: 'credits' as 'credits' | 'metered',
    currency: 'INR',
    usdToInrRate: 83.5, // Update periodically
    minCreditsWarning: 10, // Warn when credits fall below this
    freeCreditsOnSignup: 25, // Free credits for new users
};

/**
 * Calculate user price for an operation
 */
export function calculateOperationCost(
    operation: AnalyserOperation,
    units: number = 1
): {
    apiCostUsd: number;
    markupUsd: number;
    totalUsd: number;
    totalInr: number;
    creditsCost: number;
} {
    const pricing = ANALYSER_PRICING[operation];
    const apiCostUsd = pricing.apiCostUsd * units;
    const totalUsd = apiCostUsd * pricing.markupMultiplier;
    const markupUsd = totalUsd - apiCostUsd;

    return {
        apiCostUsd,
        markupUsd,
        totalUsd,
        totalInr: totalUsd * BILLING_CONFIG.usdToInrRate,
        creditsCost: pricing.creditsCost * units,
    };
}

/**
 * Get pricing table for display
 */
export function getPricingTable() {
    return Object.entries(ANALYSER_PRICING).map(([operation, pricing]) => ({
        operation,
        credits: pricing.creditsCost,
        description: pricing.description,
        category: pricing.category,
        estimatedCostInr: Math.round(pricing.apiCostUsd * pricing.markupMultiplier * BILLING_CONFIG.usdToInrRate * 100) / 100,
    }));
}

export default ANALYSER_PRICING;
