/**
 * Agency-First Pricing Configuration for MediaPlanPro
 * Project Nova: Agency Monetization Revamp
 * 
 * New Tiers:
 * - FREE: Lead magnet (5 strategies/mo, watermarked)
 * - PRO ($49/mo): Freelancers (unlimited strategies, basic reports)
 * - AGENCY ($299/mo): White-label, 10 seats, API access
 * - ENTERPRISE: Contact Sales
 */

export type PricingTier = 'FREE' | 'PRO' | 'AGENCY' | 'ENTERPRISE';

export interface PricingFeature {
  name: string;
  description?: string;
  included: boolean;
  limit?: string | number;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  targetAudience?: string | null;
  price: {
    monthly: number;
    yearly: number;
  };
  priceInr: {
    monthly: number;
    yearly: number;
  };
  razorpayPlanId: {
    monthly: string;
    yearly: string;
  };
  features: PricingFeature[];
  cta: string;
  ctaSecondary?: string | null;
  popular?: boolean;
  badge?: string | null;
  gatingFeature: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Free',
    tagline: 'Get Started',
    description: 'Perfect for students and hobbyists exploring marketing tools.',
    targetAudience: 'Students / Hobbyists',
    price: {
      monthly: 0,
      yearly: 0,
    },
    priceInr: {
      monthly: 0,
      yearly: 0,
    },
    razorpayPlanId: {
      monthly: '',
      yearly: '',
    },
    features: [
      { name: '5 AI Strategies per month', included: true, limit: 5 },
      { name: 'Access to all niche calculators', included: true, highlight: true },
      { name: '1 Free Strategy Audit', included: true },
      { name: 'Watermarked PDF reports', included: true },
      { name: 'Community support', included: true },
      { name: 'Unlimited strategies', included: false },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Start Free',
    gatingFeature: 'Limited to 5 strategies/month, watermarked reports, no API',
  },
  {
    id: 'PRO',
    name: 'Pro',
    tagline: 'The Daily Driver',
    description: 'For freelancers and SMBs who need unlimited AI-powered strategies.',
    targetAudience: 'Freelancers / SMBs',
    price: {
      monthly: 49,
      yearly: 490,
    },
    priceInr: {
      monthly: 4099,
      yearly: 40990,
    },
    razorpayPlanId: {
      monthly: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || 'plan_pro_monthly',
      yearly: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || 'plan_pro_yearly',
    },
    features: [
      { name: 'Unlimited AI Strategies', included: true, highlight: true },
      { name: 'Clean PDF/PPTX/DOCX exports', included: true },
      { name: 'Advanced AI insights & recommendations', included: true },
      { name: 'Core strategy templates', included: true },
      { name: 'Email support (24h response)', included: true },
      { name: 'Analytics dashboard', included: true },
      { name: 'White-label reports', included: false },
      { name: 'Team seats', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Start 14-Day Free Trial',
    ctaSecondary: 'No credit card required',
    popular: true,
    badge: 'Most Popular',
    gatingFeature: 'No custom branding, no team seats, no API',
  },
  {
    id: 'AGENCY',
    name: 'Agency',
    tagline: 'The White-Label Engine',
    description: 'Full white-label solution with ad management, AI optimization, and team collaboration.',
    targetAudience: 'Marketing Agencies / Consultants',
    price: {
      monthly: 299,
      yearly: 2990,
    },
    priceInr: {
      monthly: 24999,
      yearly: 249990,
    },
    razorpayPlanId: {
      monthly: process.env.RAZORPAY_AGENCY_MONTHLY_PLAN_ID || 'plan_agency_monthly',
      yearly: process.env.RAZORPAY_AGENCY_YEARLY_PLAN_ID || 'plan_agency_yearly',
    },
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Full White-Label Reports', included: true, highlight: true, description: 'Custom logos, colors, domains' },
      { name: 'Ad Platform Integration', included: true, highlight: true, description: 'Facebook, Google, LinkedIn ads' },
      { name: 'AI Ad Optimization', included: true, highlight: true, description: 'Rule-based + AI-driven' },
      { name: 'Campaign Manager', included: true, description: 'Kanban boards, KPIs, budgets' },
      { name: 'Content Calendar', included: true, description: 'Multi-platform scheduling' },
      { name: 'Asset Library', included: true, description: 'Versioning & tagging' },
      { name: '10 Team Seats (Sub-Accounts)', included: true },
      { name: 'Basic API Access', included: true, limit: '10,000 calls/mo' },
      { name: 'Priority support (4h response)', included: true },
    ],
    cta: 'Book a Demo',
    ctaSecondary: 'Talk to our agency team',
    badge: 'For Agencies',
    gatingFeature: 'Essential for agencies: white-labeling, ad management, team collaboration, API',
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    tagline: 'Bespoke Integration',
    description: 'For large organizations with custom needs and compliance requirements.',
    targetAudience: 'Large Corps / SaaS Platforms',
    price: {
      monthly: 0,
      yearly: 0,
    },
    priceInr: {
      monthly: 0,
      yearly: 0,
    },
    razorpayPlanId: {
      monthly: '',
      yearly: '',
    },
    features: [
      { name: 'Everything in Agency', included: true },
      { name: 'Unlimited API calls', included: true, highlight: true },
      { name: 'Dedicated Account Manager', included: true },
      { name: 'Custom AI model training', included: true },
      { name: 'On-premise deployment option', included: true },
      { name: 'Custom rate limits', included: true },
      { name: 'SLA guarantee (99.9% uptime)', included: true },
      { name: 'Custom integrations (CRM/CMS)', included: true },
      { name: 'Security audit & compliance', included: true },
    ],
    cta: 'Contact Sales',
    gatingFeature: 'CTA: Must be prominently displayed for large deals',
  },
];

// Feature limits by plan
export const PLAN_LIMITS = {
  FREE: {
    strategiesPerMonth: 5,
    savedResults: 3,
    pdfExports: 5,
    aiRecommendations: 10,
    teamMembers: 1,
    apiCalls: 0,
    whiteLabel: false,
  },
  PRO: {
    strategiesPerMonth: -1, // unlimited
    savedResults: -1,
    pdfExports: -1,
    aiRecommendations: -1,
    teamMembers: 1,
    apiCalls: 0,
    whiteLabel: false,
  },
  AGENCY: {
    strategiesPerMonth: -1,
    savedResults: -1,
    pdfExports: -1,
    aiRecommendations: -1,
    teamMembers: 10,
    apiCalls: 10000,
    whiteLabel: true,
  },
  // TEAM is alias for AGENCY (backwards compatibility)
  TEAM: {
    strategiesPerMonth: -1,
    savedResults: -1,
    pdfExports: -1,
    aiRecommendations: -1,
    teamMembers: 10,
    apiCalls: 10000,
    whiteLabel: true,
  },
  ENTERPRISE: {
    strategiesPerMonth: -1,
    savedResults: -1,
    pdfExports: -1,
    aiRecommendations: -1,
    teamMembers: -1,
    apiCalls: -1,
    whiteLabel: true,
  },
};

// User roles for feature gating
export const USER_ROLES = {
  FREE_USER: 'FREE_USER',
  PRO_USER: 'PRO_USER',
  AGENCY_USER: 'AGENCY_USER',
  ENTERPRISE_USER: 'ENTERPRISE_USER',
} as const;

export type UserRole = keyof typeof USER_ROLES;

// Map tier to role
export function getTierRole(tier: PricingTier): UserRole {
  const mapping: Record<PricingTier, UserRole> = {
    FREE: 'FREE_USER',
    PRO: 'PRO_USER',
    AGENCY: 'AGENCY_USER',
    ENTERPRISE: 'ENTERPRISE_USER',
  };
  return mapping[tier];
}

// Helper functions
export function getPlanByTier(tier: PricingTier): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === tier);
}

export function canAccessFeature(
  userTier: PricingTier,
  feature: 'whiteLabel' | 'apiAccess' | 'teamSeats' | 'unlimitedStrategies'
): boolean {
  const tierHierarchy: PricingTier[] = ['FREE', 'PRO', 'AGENCY', 'ENTERPRISE'];
  const userLevel = tierHierarchy.indexOf(userTier);

  const featureRequirements: Record<string, number> = {
    whiteLabel: 2, // AGENCY+
    apiAccess: 2,  // AGENCY+
    teamSeats: 2,  // AGENCY+
    unlimitedStrategies: 1, // PRO+
  };

  return userLevel >= (featureRequirements[feature] ?? 0);
}

export function getPlanLimit(
  userPlan: PricingTier,
  feature: keyof typeof PLAN_LIMITS.FREE
): number | boolean {
  return PLAN_LIMITS[userPlan][feature];
}

// Trial configuration
export const TRIAL_CONFIG = {
  enabled: true,
  durationDays: 14,
  plans: ['PRO'] as PricingTier[],
  creditCardRequired: false,
};

// Discount configuration
export const YEARLY_DISCOUNT_PERCENTAGE = 17;

// Value propositions for each tier
export const VALUE_PROPS = {
  FREE: {
    headline: 'Start your marketing journey',
    stats: ['5 strategies/month', '70+ free tools', 'Community support'],
  },
  PRO: {
    headline: 'Scale your marketing output',
    stats: ['Unlimited strategies', '75% time savings', '40% conversion lift'],
  },
  AGENCY: {
    headline: 'Power your client deliverables',
    stats: ['Ad platform management', 'AI optimization', 'White-label everything'],
  },
  ENTERPRISE: {
    headline: 'Enterprise-grade marketing engine',
    stats: ['Unlimited API', 'Custom integrations', 'Dedicated support'],
  },
};

// Social proof data
export const SOCIAL_PROOF = {
  totalUsers: '50,000+',
  agenciesUsing: '500+',
  strategiesGenerated: '1,000,000+',
  averageRating: 4.9,
  timesSaved: '75%',
  testimonials: [
    {
      name: 'Sarah Johnson',
      role: 'Agency Director',
      company: 'GrowthFirst Agency',
      avatar: '/testimonials/sarah.jpg',
      quote: 'The white-label feature alone pays for the Agency plan 10x over. Our clients think we built this in-house.',
      rating: 5,
      tier: 'AGENCY',
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Consultant',
      company: 'Chen Digital',
      avatar: '/testimonials/michael.jpg',
      quote: "Pro plan is a no-brainer. I went from 3 strategies a week to 3 a day. My revenue tripled.",
      rating: 5,
      tier: 'PRO',
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP Marketing',
      company: 'TechScale Inc',
      avatar: '/testimonials/emily.jpg',
      quote: 'Enterprise integration with our CRM was seamless. The AI adapts to our brand voice perfectly.',
      rating: 5,
      tier: 'ENTERPRISE',
    },
  ],
};

// FAQ data for pricing page
export const PRICING_FAQ = [
  {
    question: 'Can I try Pro features before paying?',
    answer: 'Yes! We offer a 14-day free trial for the Pro plan. No credit card required.',
  },
  {
    question: 'What exactly is white-labeling?',
    answer: 'White-labeling lets you add your own agency logo, brand colors, and even custom domains to all reports and client-facing materials. Your clients will never see the MediaPlanPro brand.',
  },
  {
    question: 'How do sub-accounts work for agencies?',
    answer: 'Agency plans include 10 sub-accounts. Each team member gets their own login with role-based permissions. Client workspaces are completely separate.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, UPI, and net banking through Razorpay. Enterprise customers can pay via invoice.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Absolutely. Cancel anytime from your dashboard. Your access continues until the end of your billing period.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes! Save 17% when you choose annual billing. Agency annual plan is $2,990/year (save $598).',
  },
  {
    question: 'What\'s included in API access?',
    answer: 'Agency plan includes 10,000 API calls/month for integrating strategy generation into your workflows. Enterprise has unlimited API with custom rate limits.',
  },
];

// Helper function to check remaining quota
export function getRemainingQuota(
  plan: PricingTier,
  feature: keyof typeof PLAN_LIMITS.FREE,
  used: number
): number {
  const limit = PLAN_LIMITS[plan][feature];
  if (typeof limit === 'boolean') return limit ? -1 : 0;
  if (limit === -1) return -1; // unlimited
  return Math.max(0, limit - used);
}

// Backwards-compatible helper function (used by existing code)
export function canUsePremiumFeature(
  userPlan: PricingTier | string,
  feature: 'savedResults' | 'pdfExports' | 'aiRecommendations'
): boolean {
  const plan = userPlan as PricingTier;
  const limits = PLAN_LIMITS[plan];
  if (!limits) return false;

  // -1 means unlimited, any positive number means limited but available
  const limit = limits[feature];
  if (typeof limit === 'number') {
    return limit !== 0;
  }
  return false;
}
