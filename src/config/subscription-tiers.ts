/**
 * Aureon Forge Subscription Tiers
 * Based on original brief specification
 */

export interface SparksTier {
    id: string;
    name: string;
    price: {
        usd: { monthly: number; yearly: number };
        inr: { monthly: number; yearly: number };
    };
    sparksIncluded: number;
    rolloverMonths: number;
    features: string[];
    popular?: boolean;
}

export const FORGE_TIERS: SparksTier[] = [
    {
        id: 'freelancer',
        name: 'The Freelancer',
        price: {
            usd: { monthly: 49, yearly: 490 },
            inr: { monthly: 4099, yearly: 40990 },
        },
        sparksIncluded: 5000,
        rolloverMonths: 3,
        features: [
            'Standard Flux image generation',
            'Kling video generation (Social)',
            'Public workspace',
            '5,000 Sparks/month',
            '3-month Sparks rollover',
            'Basic templates',
            'Email support',
        ],
    },
    {
        id: 'studio',
        name: 'The Studio',
        price: {
            usd: { monthly: 199, yearly: 1990 },
            inr: { monthly: 16599, yearly: 165990 },
        },
        sparksIncluded: 25000,
        rolloverMonths: 6,
        popular: true,
        features: [
            'Everything in Freelancer',
            'Flux LoRA (Brand Kits)',
            'Runway Gen-3 Alpha (Cinema)',
            'Priority generation queue',
            '25,000 Sparks/month',
            '6-month Sparks rollover',
            '5 Brand Kits',
            'Priority support',
        ],
    },
    {
        id: 'agency',
        name: 'The Agency',
        price: {
            usd: { monthly: 999, yearly: 9990 },
            inr: { monthly: 83299, yearly: 832990 },
        },
        sparksIncluded: 150000,
        rolloverMonths: 12,
        features: [
            'Everything in Studio',
            'Unlimited Brand Kits',
            'BrandGuard compliance engine',
            'Multi-seat collaboration (5 users)',
            '150,000 Sparks/month',
            '12-month Sparks rollover',
            'API access',
            'Dedicated success manager',
        ],
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: {
            usd: { monthly: 0, yearly: 0 }, // Custom pricing
            inr: { monthly: 0, yearly: 0 },
        },
        sparksIncluded: 0, // Volume pricing
        rolloverMonths: 12,
        features: [
            'Everything in Agency',
            'Unlimited Sparks (volume pricing)',
            'Private VPC deployment',
            'Custom model training',
            'SSO integration',
            'Custom SLA',
            'On-premise option',
            'Quarterly billing',
        ],
    },
];

/**
 * Sparks Consumption Table
 * From original brief specification
 */
export const SPARKS_CONSUMPTION = {
    // Image Generation
    image_standard: {
        action: 'Generate Image (Standard)',
        provider: 'Fal.ai (Flux)',
        costUsd: 0.03,
        sparks: 5,
        marginPercent: 40,
    },
    image_lora: {
        action: 'Generate Image (LoRA)',
        provider: 'Fal.ai (Flux + LoRA)',
        costUsd: 0.05,
        sparks: 10,
        marginPercent: 50,
    },

    // Video Generation
    video_cinema: {
        action: 'Generate Video (Cinema)',
        provider: 'Runway Gen-3',
        costUsd: 0.50,
        sparks: 75,
        marginPercent: 33,
    },
    video_social: {
        action: 'Generate Video (Social)',
        provider: 'Kling AI',
        costUsd: 0.28,
        sparks: 40,
        marginPercent: 30,
    },

    // Other Actions
    upscale_4k: {
        action: 'Upscale Image (4K)',
        provider: 'Real-ESRGAN (Self-hosted)',
        costUsd: 0.005,
        sparks: 5,
        marginPercent: 90,
    },
    llm_prompt: {
        action: 'Brief-to-Prompt (LLM)',
        provider: 'Vertex AI (Gemini)',
        costUsd: 0.001,
        sparks: 1,
        marginPercent: 900,
    },

    // BrandGuard
    brandguard_check: {
        action: 'BrandGuard Compliance Check',
        provider: 'Internal',
        costUsd: 0.01,
        sparks: 3,
        marginPercent: 66,
    },
};

/**
 * Get Sparks cost for a specific action
 */
export function getSparksCost(action: keyof typeof SPARKS_CONSUMPTION): number {
    return SPARKS_CONSUMPTION[action]?.sparks || 0;
}

/**
 * Calculate total Sparks for a flow
 */
export function calculateFlowSparksCost(nodeTypes: string[]): number {
    const nodeTypeToCost: Record<string, number> = {
        trigger: 0,
        llm: SPARKS_CONSUMPTION.llm_prompt.sparks,
        image: SPARKS_CONSUMPTION.image_standard.sparks,
        video: SPARKS_CONSUMPTION.video_social.sparks, // Default to social
        brandguard: SPARKS_CONSUMPTION.brandguard_check.sparks,
        condition: 0,
        http: 1,
        notification: 1,
    };

    return nodeTypes.reduce((total, type) => total + (nodeTypeToCost[type] || 0), 0);
}

/**
 * Format Sparks display
 */
export function formatSparks(sparks: number): string {
    if (sparks >= 1000000) {
        return `${(sparks / 1000000).toFixed(1)}M`;
    }
    if (sparks >= 1000) {
        return `${(sparks / 1000).toFixed(0)}K`;
    }
    return sparks.toString();
}
