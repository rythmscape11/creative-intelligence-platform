/**
 * Product Plans Configuration for MediaPlanPro
 * 
 * This is the SINGLE SOURCE OF TRUTH for all product pricing.
 * Used by: pricing page, billing dashboard, Razorpay integration, feature gating
 * 
 * 4 Products: Agency OS, The Optimiser, The Analyser, The Strategiser
 * Each product has: STARTER, PRO, AGENCY tiers (+ FREE for some)
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export type ProductType = 'AGENCY_OS' | 'OPTIMISER' | 'ANALYSER' | 'STRATEGISER';
export type PlanTier = 'FREE' | 'STARTER' | 'PRO' | 'AGENCY' | 'ENTERPRISE';
export type BillingInterval = 'monthly' | 'yearly';

export interface ProductPlan {
    id: string;
    product: ProductType;
    tier: PlanTier;
    name: string;
    tagline: string;
    description: string;
    targetAudience: string;
    price: {
        usd: { monthly: number; yearly: number };
        inr: { monthly: number; yearly: number };
    };
    razorpayPlanId: {
        monthly: string;
        yearly: string;
    };
    features: ProductFeature[];
    limits: ProductLimits;
    popular?: boolean;
    badge?: string;
}

export interface ProductFeature {
    name: string;
    description?: string;
    included: boolean;
    limit?: string | number;
    highlight?: boolean;
}

export interface ProductLimits {
    // Agency OS limits
    clients?: number;
    projects?: number;
    teamMembers?: number;
    // Optimiser limits
    adAccounts?: number;
    campaigns?: number;
    // Analyser limits
    domains?: number;
    keywords?: number;
    // Strategiser limits
    strategies?: number;
    exports?: number;
    // Common limits
    apiCalls?: number;
    storage?: string;
    whiteLabel?: boolean;
}

export interface ProductDefinition {
    id: ProductType;
    name: string;
    headline: string;
    subheadline: string;
    description: string;
    targetAudience: string[];
    outcomes: string[];
    icon: string;
    color: string;
    route: string;
    plans: Record<PlanTier, ProductPlan | null>;
}

// ============================================
// PRODUCT DEFINITIONS
// ============================================

export const PRODUCTS: Record<ProductType, ProductDefinition> = {
    AGENCY_OS: {
        id: 'AGENCY_OS',
        name: 'Agency OS',
        headline: 'The Operating System for Modern Agencies',
        subheadline: 'Manage clients, projects, and team workflows in one powerful platform',
        description: 'Agency OS is a complete project and client management system designed for marketing agencies, creative studios, and consultancies.',
        targetAudience: ['Marketing Agencies', 'Creative Studios', 'Consultancies', 'Freelancers'],
        outcomes: [
            '40% faster project delivery',
            'Unified client view',
            'Zero tool-switching overhead',
            'White-label client portals',
        ],
        icon: 'Building2',
        color: '#6366f1', // Indigo
        route: '/agency',
        plans: {
            FREE: null, // No free tier for Agency OS
            STARTER: {
                id: 'agency_os_starter',
                product: 'AGENCY_OS',
                tier: 'STARTER',
                name: 'Agency OS Starter',
                tagline: 'For Small Teams',
                description: 'Perfect for freelancers and small teams getting started',
                targetAudience: 'Freelancers, Solo Consultants',
                price: {
                    usd: { monthly: 29, yearly: 290 },
                    inr: { monthly: 2399, yearly: 23990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_AGENCY_OS_STARTER_MONTHLY || 'plan_agency_os_starter_m',
                    yearly: process.env.RAZORPAY_AGENCY_OS_STARTER_YEARLY || 'plan_agency_os_starter_y',
                },
                features: [
                    { name: '3 Active Clients', included: true, limit: 3 },
                    { name: '5 Active Projects', included: true, limit: 5 },
                    { name: 'Task Management', included: true },
                    { name: 'Basic Gantt Charts', included: true },
                    { name: 'Content Calendar', included: true },
                    { name: 'Email Support', included: true },
                    { name: 'Client Portal', included: false },
                    { name: 'White-Label', included: false },
                ],
                limits: {
                    clients: 3,
                    projects: 5,
                    teamMembers: 2,
                    whiteLabel: false,
                },
            },
            PRO: {
                id: 'agency_os_pro',
                product: 'AGENCY_OS',
                tier: 'PRO',
                name: 'Agency OS Pro',
                tagline: 'For Growing Agencies',
                description: 'Unlock unlimited capacity and advanced features',
                targetAudience: 'Growing Agencies, Studios',
                price: {
                    usd: { monthly: 99, yearly: 990 },
                    inr: { monthly: 8199, yearly: 81990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_AGENCY_OS_PRO_MONTHLY || 'plan_agency_os_pro_m',
                    yearly: process.env.RAZORPAY_AGENCY_OS_PRO_YEARLY || 'plan_agency_os_pro_y',
                },
                features: [
                    { name: 'Unlimited Clients', included: true, highlight: true },
                    { name: 'Unlimited Projects', included: true, highlight: true },
                    { name: 'Advanced Gantt & Timelines', included: true },
                    { name: 'Resource Workload View', included: true },
                    { name: 'Asset Library', included: true },
                    { name: '5 Team Members', included: true, limit: 5 },
                    { name: 'Client Portal (Branded)', included: true },
                    { name: 'Priority Support', included: true },
                    { name: 'White-Label', included: false },
                    { name: 'API Access', included: false },
                ],
                limits: {
                    clients: -1,
                    projects: -1,
                    teamMembers: 5,
                    whiteLabel: false,
                },
                popular: true,
                badge: 'Most Popular',
            },
            AGENCY: {
                id: 'agency_os_agency',
                product: 'AGENCY_OS',
                tier: 'AGENCY',
                name: 'Agency OS Agency',
                tagline: 'Full White-Label Suite',
                description: 'Enterprise-grade with complete white-labeling',
                targetAudience: 'Large Agencies, Enterprise',
                price: {
                    usd: { monthly: 299, yearly: 2990 },
                    inr: { monthly: 24799, yearly: 247990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_AGENCY_OS_AGENCY_MONTHLY || 'plan_agency_os_agency_m',
                    yearly: process.env.RAZORPAY_AGENCY_OS_AGENCY_YEARLY || 'plan_agency_os_agency_y',
                },
                features: [
                    { name: 'Everything in Pro', included: true },
                    { name: 'Full White-Label', included: true, highlight: true },
                    { name: 'Custom Domain', included: true, highlight: true },
                    { name: 'Unlimited Team Members', included: true },
                    { name: 'Advanced Permissions', included: true },
                    { name: 'API Access (10K calls/mo)', included: true },
                    { name: 'Dedicated Support', included: true },
                    { name: 'Custom Integrations', included: true },
                ],
                limits: {
                    clients: -1,
                    projects: -1,
                    teamMembers: -1,
                    apiCalls: 10000,
                    whiteLabel: true,
                },
                badge: 'For Agencies',
            },
            ENTERPRISE: null, // Contact sales
        },
    },

    OPTIMISER: {
        id: 'OPTIMISER',
        name: 'The Optimiser',
        headline: 'AI-Powered Campaign Optimization',
        subheadline: 'Get recommendations, not just reports. Scale what works, pause what doesn\'t.',
        description: 'The Optimiser connects to your ad platforms and uses AI to find optimization opportunities, detect creative fatigue, and suggest budget reallocation.',
        targetAudience: ['Performance Marketers', 'Paid Media Teams', 'Growth Managers', 'Media Buyers'],
        outcomes: [
            '25% average ROAS improvement',
            '50% time saved on analysis',
            'Proactive budget alerts',
            'Creative fatigue detection',
        ],
        icon: 'TrendingUp',
        color: '#10b981', // Emerald
        route: '/optimizer',
        plans: {
            FREE: null,
            STARTER: {
                id: 'optimiser_starter',
                product: 'OPTIMISER',
                tier: 'STARTER',
                name: 'Optimiser Lite',
                tagline: 'Essential Insights',
                description: 'Connect up to 2 ad accounts and get basic AI recommendations',
                targetAudience: 'Solo Marketers, Small Accounts',
                price: {
                    usd: { monthly: 39, yearly: 390 },
                    inr: { monthly: 3199, yearly: 31990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_OPTIMISER_STARTER_MONTHLY || 'plan_optimiser_starter_m',
                    yearly: process.env.RAZORPAY_OPTIMISER_STARTER_YEARLY || 'plan_optimiser_starter_y',
                },
                features: [
                    { name: '2 Ad Accounts', included: true, limit: 2 },
                    { name: 'Performance Dashboard', included: true },
                    { name: 'Basic AI Recommendations', included: true },
                    { name: 'Weekly Reports', included: true },
                    { name: 'Email Alerts', included: true },
                    { name: 'Creative Analysis', included: false },
                    { name: 'Automation Rules', included: false },
                ],
                limits: {
                    adAccounts: 2,
                    campaigns: 20,
                },
            },
            PRO: {
                id: 'optimiser_pro',
                product: 'OPTIMISER',
                tier: 'PRO',
                name: 'Optimiser Pro',
                tagline: 'Full AI Power',
                description: 'Advanced AI insights with automation capabilities',
                targetAudience: 'Growing Brands, Agencies',
                price: {
                    usd: { monthly: 129, yearly: 1290 },
                    inr: { monthly: 10699, yearly: 106990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_OPTIMISER_PRO_MONTHLY || 'plan_optimiser_pro_m',
                    yearly: process.env.RAZORPAY_OPTIMISER_PRO_YEARLY || 'plan_optimiser_pro_y',
                },
                features: [
                    { name: '10 Ad Accounts', included: true, limit: 10, highlight: true },
                    { name: 'Advanced AI Recommendations', included: true, highlight: true },
                    { name: 'Creative Fatigue Detection', included: true },
                    { name: 'Budget Optimization', included: true },
                    { name: 'Automation Rules (Basic)', included: true },
                    { name: 'AI Copilot Chat', included: true },
                    { name: 'Daily Reports', included: true },
                    { name: 'Slack Integration', included: true },
                ],
                limits: {
                    adAccounts: 10,
                    campaigns: -1,
                },
                popular: true,
                badge: 'Most Popular',
            },
            AGENCY: {
                id: 'optimiser_agency',
                product: 'OPTIMISER',
                tier: 'AGENCY',
                name: 'Optimiser Agency',
                tagline: 'Multi-Client Power',
                description: 'Manage multiple clients with advanced automation',
                targetAudience: 'Large Agencies, Enterprises',
                price: {
                    usd: { monthly: 349, yearly: 3490 },
                    inr: { monthly: 28999, yearly: 289990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_OPTIMISER_AGENCY_MONTHLY || 'plan_optimiser_agency_m',
                    yearly: process.env.RAZORPAY_OPTIMISER_AGENCY_YEARLY || 'plan_optimiser_agency_y',
                },
                features: [
                    { name: 'Unlimited Ad Accounts', included: true, highlight: true },
                    { name: 'Advanced Automation Rules', included: true, highlight: true },
                    { name: 'Cross-Account Insights', included: true },
                    { name: 'Custom Dashboards', included: true },
                    { name: 'White-Label Reports', included: true },
                    { name: 'API Access', included: true },
                    { name: 'Dedicated Support', included: true },
                ],
                limits: {
                    adAccounts: -1,
                    campaigns: -1,
                    apiCalls: 10000,
                    whiteLabel: true,
                },
            },
            ENTERPRISE: null,
        },
    },

    ANALYSER: {
        id: 'ANALYSER',
        name: 'The Analyser',
        headline: 'Competitive Intelligence, Demystified',
        subheadline: 'SEO health, traffic trends, and competitor insights—all in one dashboard',
        description: 'The Analyser combines SEMrush-style keyword research with Similarweb-style traffic analytics, giving you complete visibility into your competitive landscape.',
        targetAudience: ['SEO Specialists', 'Content Strategists', 'Market Researchers', 'Digital Marketers'],
        outcomes: [
            '10x more keyword opportunities',
            'Track competitor moves in real-time',
            'Identify untapped traffic sources',
            'Audit site health automatically',
        ],
        icon: 'Search',
        color: '#f59e0b', // Amber
        route: '/analyser',
        plans: {
            FREE: null,
            STARTER: {
                id: 'analyser_starter',
                product: 'ANALYSER',
                tier: 'STARTER',
                name: 'Analyser Lite',
                tagline: 'Essential Intelligence',
                description: 'Track 1 domain with basic SEO and traffic insights',
                targetAudience: 'Bloggers, Small Sites',
                price: {
                    usd: { monthly: 29, yearly: 290 },
                    inr: { monthly: 2399, yearly: 23990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_ANALYSER_STARTER_MONTHLY || 'plan_analyser_starter_m',
                    yearly: process.env.RAZORPAY_ANALYSER_STARTER_YEARLY || 'plan_analyser_starter_y',
                },
                features: [
                    { name: '1 Domain', included: true, limit: 1 },
                    { name: '100 Keywords Tracked', included: true, limit: 100 },
                    { name: 'Domain Overview', included: true },
                    { name: 'Basic Traffic Estimates', included: true },
                    { name: 'Weekly Reports', included: true },
                    { name: 'Competitor Tracking', included: false },
                    { name: 'Backlink Analysis', included: false },
                ],
                limits: {
                    domains: 1,
                    keywords: 100,
                },
            },
            PRO: {
                id: 'analyser_pro',
                product: 'ANALYSER',
                tier: 'PRO',
                name: 'Analyser Pro',
                tagline: 'Full Intelligence Suite',
                description: 'Complete competitive intelligence with AI insights',
                targetAudience: 'SEO Agencies, In-House Teams',
                price: {
                    usd: { monthly: 99, yearly: 990 },
                    inr: { monthly: 8199, yearly: 81990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_ANALYSER_PRO_MONTHLY || 'plan_analyser_pro_m',
                    yearly: process.env.RAZORPAY_ANALYSER_PRO_YEARLY || 'plan_analyser_pro_y',
                },
                features: [
                    { name: '5 Domains', included: true, limit: 5, highlight: true },
                    { name: '1,000 Keywords Tracked', included: true, limit: 1000 },
                    { name: '3 Competitors per Domain', included: true },
                    { name: 'Backlink Analysis', included: true },
                    { name: 'Traffic Source Breakdown', included: true },
                    { name: 'Site Audit', included: true },
                    { name: 'AI Copilot', included: true, highlight: true },
                    { name: 'Daily Reports', included: true },
                ],
                limits: {
                    domains: 5,
                    keywords: 1000,
                },
                popular: true,
                badge: 'Most Popular',
            },
            AGENCY: {
                id: 'analyser_agency',
                product: 'ANALYSER',
                tier: 'AGENCY',
                name: 'Analyser Agency',
                tagline: 'Enterprise Intelligence',
                description: 'Unlimited tracking for agencies and large teams',
                targetAudience: 'Large Agencies, Enterprise',
                price: {
                    usd: { monthly: 249, yearly: 2490 },
                    inr: { monthly: 20699, yearly: 206990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_ANALYSER_AGENCY_MONTHLY || 'plan_analyser_agency_m',
                    yearly: process.env.RAZORPAY_ANALYSER_AGENCY_YEARLY || 'plan_analyser_agency_y',
                },
                features: [
                    { name: 'Unlimited Domains', included: true, highlight: true },
                    { name: 'Unlimited Keywords', included: true, highlight: true },
                    { name: 'Unlimited Competitors', included: true },
                    { name: 'Advanced Backlink Analysis', included: true },
                    { name: 'White-Label Reports', included: true },
                    { name: 'API Access', included: true },
                    { name: 'Historical Data', included: true },
                    { name: 'Dedicated Support', included: true },
                ],
                limits: {
                    domains: -1,
                    keywords: -1,
                    apiCalls: 10000,
                    whiteLabel: true,
                },
            },
            ENTERPRISE: null,
        },
    },

    STRATEGISER: {
        id: 'STRATEGISER',
        name: 'The Strategiser',
        headline: 'From Brief to Strategy in 60 Seconds',
        subheadline: 'AI-generated marketing strategies tailored to your goals, audience, and budget',
        description: 'The Strategiser uses advanced AI to generate comprehensive marketing strategies including channel mix, budget allocation, timelines, and tactical recommendations.',
        targetAudience: ['Marketing Managers', 'Startup Founders', 'Agency Strategists', 'Brand Managers'],
        outcomes: [
            'Create strategies 10x faster',
            'Consistent strategic framework',
            'Data-backed recommendations',
            'Client-ready exports',
        ],
        icon: 'Lightbulb',
        color: '#8b5cf6', // Violet
        route: '/strategiser',
        plans: {
            FREE: {
                id: 'strategiser_free',
                product: 'STRATEGISER',
                tier: 'FREE',
                name: 'Strategiser Free',
                tagline: 'Get Started',
                description: 'Try AI strategy generation with limited usage',
                targetAudience: 'Students, Hobbyists',
                price: {
                    usd: { monthly: 0, yearly: 0 },
                    inr: { monthly: 0, yearly: 0 },
                },
                razorpayPlanId: {
                    monthly: '',
                    yearly: '',
                },
                features: [
                    { name: '3 Strategies/month', included: true, limit: 3 },
                    { name: 'Basic Templates', included: true },
                    { name: 'Watermarked Exports', included: true },
                    { name: 'Community Support', included: true },
                    { name: 'Advanced AI', included: false },
                    { name: 'Custom Branding', included: false },
                ],
                limits: {
                    strategies: 3,
                    exports: 3,
                },
            },
            STARTER: {
                id: 'strategiser_solo',
                product: 'STRATEGISER',
                tier: 'STARTER',
                name: 'Strategiser Solo',
                tagline: 'For Individuals',
                description: 'Unlimited strategies for solo practitioners',
                targetAudience: 'Freelancers, Consultants',
                price: {
                    usd: { monthly: 19, yearly: 190 },
                    inr: { monthly: 1599, yearly: 15990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_STRATEGISER_SOLO_MONTHLY || 'plan_strategiser_solo_m',
                    yearly: process.env.RAZORPAY_STRATEGISER_SOLO_YEARLY || 'plan_strategiser_solo_y',
                },
                features: [
                    { name: 'Unlimited Strategies', included: true, highlight: true },
                    { name: 'All Templates', included: true },
                    { name: 'Clean Exports (PDF/PPTX)', included: true },
                    { name: 'AI Recommendations', included: true },
                    { name: 'Email Support', included: true },
                    { name: 'Custom Branding', included: false },
                ],
                limits: {
                    strategies: -1,
                    exports: -1,
                },
            },
            PRO: {
                id: 'strategiser_pro',
                product: 'STRATEGISER',
                tier: 'PRO',
                name: 'Strategiser Pro',
                tagline: 'Advanced AI Power',
                description: 'Advanced features with team collaboration',
                targetAudience: 'Teams, Small Agencies',
                price: {
                    usd: { monthly: 49, yearly: 490 },
                    inr: { monthly: 4099, yearly: 40990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_STRATEGISER_PRO_MONTHLY || 'plan_strategiser_pro_m',
                    yearly: process.env.RAZORPAY_STRATEGISER_PRO_YEARLY || 'plan_strategiser_pro_y',
                },
                features: [
                    { name: 'Everything in Solo', included: true },
                    { name: 'Advanced AI Insights', included: true, highlight: true },
                    { name: 'Competitive Analysis', included: true },
                    { name: 'Custom Branding', included: true },
                    { name: '3 Team Members', included: true, limit: 3 },
                    { name: 'Strategy History', included: true },
                    { name: 'Priority Support', included: true },
                ],
                limits: {
                    strategies: -1,
                    exports: -1,
                    teamMembers: 3,
                },
                popular: true,
                badge: 'Most Popular',
            },
            AGENCY: {
                id: 'strategiser_agency',
                product: 'STRATEGISER',
                tier: 'AGENCY',
                name: 'Strategiser Agency',
                tagline: 'White-Label Engine',
                description: 'Full white-label for agencies',
                targetAudience: 'Agencies, Enterprise',
                price: {
                    usd: { monthly: 149, yearly: 1490 },
                    inr: { monthly: 12399, yearly: 123990 },
                },
                razorpayPlanId: {
                    monthly: process.env.RAZORPAY_STRATEGISER_AGENCY_MONTHLY || 'plan_strategiser_agency_m',
                    yearly: process.env.RAZORPAY_STRATEGISER_AGENCY_YEARLY || 'plan_strategiser_agency_y',
                },
                features: [
                    { name: 'Everything in Pro', included: true },
                    { name: 'Full White-Label', included: true, highlight: true },
                    { name: 'Custom Domain', included: true },
                    { name: 'Unlimited Team Members', included: true },
                    { name: 'API Access', included: true },
                    { name: 'Client Workspaces', included: true },
                    { name: 'Dedicated Support', included: true },
                ],
                limits: {
                    strategies: -1,
                    exports: -1,
                    teamMembers: -1,
                    apiCalls: 10000,
                    whiteLabel: true,
                },
            },
            ENTERPRISE: null,
        },
    },
};

// ============================================
// BUNDLE CONFIGURATION
// ============================================

export const FULL_STACK_BUNDLE = {
    id: 'full_stack_bundle',
    name: 'Full Stack Bundle',
    tagline: 'All 4 Products, One Price',
    description: 'Get Agency OS, The Optimiser, The Analyser, and The Strategiser at 30% off',
    discount: 0.30, // 30% off
    price: {
        // Regular would be: $29 + $39 + $29 + $19 = $116/mo for Starter tier
        // Regular would be: $299 + $349 + $249 + $149 = $1,046/mo for Agency tier
        starter: {
            usd: { monthly: 99, yearly: 990 },
            inr: { monthly: 8199, yearly: 81990 },
        },
        pro: {
            usd: { monthly: 299, yearly: 2990 },
            inr: { monthly: 24799, yearly: 247990 },
        },
        agency: {
            usd: { monthly: 799, yearly: 7990 },
            inr: { monthly: 66299, yearly: 662990 },
        },
    },
    razorpayPlanId: {
        starter: {
            monthly: process.env.RAZORPAY_BUNDLE_STARTER_MONTHLY || 'plan_bundle_starter_m',
            yearly: process.env.RAZORPAY_BUNDLE_STARTER_YEARLY || 'plan_bundle_starter_y',
        },
        pro: {
            monthly: process.env.RAZORPAY_BUNDLE_PRO_MONTHLY || 'plan_bundle_pro_m',
            yearly: process.env.RAZORPAY_BUNDLE_PRO_YEARLY || 'plan_bundle_pro_y',
        },
        agency: {
            monthly: process.env.RAZORPAY_BUNDLE_AGENCY_MONTHLY || 'plan_bundle_agency_m',
            yearly: process.env.RAZORPAY_BUNDLE_AGENCY_YEARLY || 'plan_bundle_agency_y',
        },
    },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a specific product definition
 */
export function getProduct(productType: ProductType): ProductDefinition {
    return PRODUCTS[productType];
}

/**
 * Get a specific plan for a product
 */
export function getProductPlan(productType: ProductType, tier: PlanTier): ProductPlan | null {
    return PRODUCTS[productType]?.plans[tier] || null;
}

/**
 * Get all available plans for a product
 */
export function getProductPlans(productType: ProductType): ProductPlan[] {
    const product = PRODUCTS[productType];
    if (!product) return [];

    return Object.values(product.plans).filter((plan): plan is ProductPlan => plan !== null);
}

/**
 * Get price for a plan in the specified currency
 */
export function getPlanPrice(
    productType: ProductType,
    tier: PlanTier,
    currency: 'usd' | 'inr',
    interval: BillingInterval
): number {
    const plan = getProductPlan(productType, tier);
    if (!plan) return 0;

    return plan.price[currency][interval];
}

/**
 * Get Razorpay plan ID for a product/tier combination
 */
export function getRazorpayPlanId(
    productType: ProductType,
    tier: PlanTier,
    interval: BillingInterval
): string {
    const plan = getProductPlan(productType, tier);
    if (!plan) return '';

    return plan.razorpayPlanId[interval];
}

/**
 * Map Razorpay plan ID to product and tier
 */
export function getProductFromRazorpayPlanId(razorpayPlanId: string): { product: ProductType; tier: PlanTier } | null {
    for (const [productType, productDef] of Object.entries(PRODUCTS)) {
        for (const [tier, plan] of Object.entries(productDef.plans)) {
            if (!plan) continue;
            if (plan.razorpayPlanId.monthly === razorpayPlanId || plan.razorpayPlanId.yearly === razorpayPlanId) {
                return { product: productType as ProductType, tier: tier as PlanTier };
            }
        }
    }
    return null;
}

/**
 * Check if user has access to a feature based on their product subscription
 */
export function hasFeatureAccess(
    userSubscriptions: { product: ProductType; tier: PlanTier }[],
    requiredProduct: ProductType,
    requiredTier: PlanTier = 'STARTER'
): boolean {
    const tierHierarchy: PlanTier[] = ['FREE', 'STARTER', 'PRO', 'AGENCY', 'ENTERPRISE'];
    const requiredLevel = tierHierarchy.indexOf(requiredTier);

    const subscription = userSubscriptions.find(sub => sub.product === requiredProduct);
    if (!subscription) return false;

    const userLevel = tierHierarchy.indexOf(subscription.tier);
    return userLevel >= requiredLevel;
}

/**
 * Get feature limit for a user's subscription
 */
export function getFeatureLimit(
    productType: ProductType,
    tier: PlanTier,
    limitKey: keyof ProductLimits
): number | boolean | string | undefined {
    const plan = getProductPlan(productType, tier);
    if (!plan) return undefined;

    return plan.limits[limitKey];
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: 'usd' | 'inr'): string {
    if (amount === 0) return 'Free';

    const formatter = new Intl.NumberFormat(currency === 'inr' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    return formatter.format(amount);
}

/**
 * Calculate yearly savings
 */
export function calculateYearlySavings(
    productType: ProductType,
    tier: PlanTier,
    currency: 'usd' | 'inr'
): { monthly: number; yearly: number; savings: number; savingsPercent: number } {
    const plan = getProductPlan(productType, tier);
    if (!plan) return { monthly: 0, yearly: 0, savings: 0, savingsPercent: 0 };

    const monthly = plan.price[currency].monthly;
    const yearly = plan.price[currency].yearly;
    const monthlyAnnualized = monthly * 12;
    const savings = monthlyAnnualized - yearly;
    const savingsPercent = Math.round((savings / monthlyAnnualized) * 100);

    return { monthly, yearly, savings, savingsPercent };
}
