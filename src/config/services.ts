/**
 * Services Configuration for MediaPlanPro
 * 
 * Defines all marketing and web development services offered
 * Pricing based on global industry standards (Upwork, Fiverr Pro, Clutch, GoodFirms)
 */

export type ServiceCategory = 
  | 'MARKETING_STRATEGY'
  | 'SEO'
  | 'CONTENT_MARKETING'
  | 'PAID_ADVERTISING'
  | 'SOCIAL_MEDIA'
  | 'EMAIL_MARKETING'
  | 'ANALYTICS'
  | 'WEB_DEVELOPMENT'
  | 'WEB_DESIGN'
  | 'WEB_MAINTENANCE';

export type ServiceTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
export type BillingType = 'ONE_TIME' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface ServiceFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface ServicePricingTier {
  tier: ServiceTier;
  name: string;
  price: {
    usd: number;
    inr: number;
  };
  billingType: BillingType;
  features: ServiceFeature[];
  deliveryTime?: string;
  revisions?: number | 'unlimited';
}

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  popular?: boolean;
  pricingTiers: ServicePricingTier[];
  faqs?: Array<{ question: string; answer: string }>;
}

// Marketing Strategy Services
export const MARKETING_STRATEGY_SERVICES: Service[] = [
  {
    id: 'marketing-strategy-development',
    category: 'MARKETING_STRATEGY',
    name: 'Marketing Strategy Development',
    slug: 'marketing-strategy-development',
    description: 'Comprehensive marketing strategy tailored to your business goals, target audience, and market positioning.',
    shortDescription: 'Custom marketing strategy and roadmap',
    icon: '🎯',
    popular: true,
    pricingTiers: [
      {
        tier: 'STARTER',
        name: 'Basic Strategy',
        price: { usd: 500, inr: 40000 },
        billingType: 'ONE_TIME',
        deliveryTime: '5-7 business days',
        revisions: 2,
        features: [
          { name: 'Market research & analysis', included: true },
          { name: 'Competitor analysis (up to 3 competitors)', included: true },
          { name: 'Target audience definition', included: true },
          { name: 'Marketing goals & KPIs', included: true },
          { name: '3-month marketing roadmap', included: true },
          { name: 'Channel recommendations', included: true },
          { name: '1 strategy session (60 min)', included: true },
          { name: 'Implementation support', included: false },
          { name: 'Quarterly strategy reviews', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: 'Advanced Strategy',
        price: { usd: 1500, inr: 120000 },
        billingType: 'ONE_TIME',
        deliveryTime: '7-10 business days',
        revisions: 'unlimited',
        features: [
          { name: 'In-depth market research & analysis', included: true },
          { name: 'Competitor analysis (up to 10 competitors)', included: true },
          { name: 'Detailed buyer personas (up to 3)', included: true },
          { name: 'Marketing goals, KPIs & metrics dashboard', included: true },
          { name: '12-month marketing roadmap', included: true },
          { name: 'Multi-channel strategy', included: true },
          { name: '3 strategy sessions (60 min each)', included: true },
          { name: 'Budget allocation recommendations', included: true },
          { name: '30-day implementation support', included: true },
          { name: 'Quarterly strategy reviews', included: false },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Enterprise Strategy',
        price: { usd: 5000, inr: 400000 },
        billingType: 'ONE_TIME',
        deliveryTime: '2-3 weeks',
        revisions: 'unlimited',
        features: [
          { name: 'Comprehensive market research & analysis', included: true },
          { name: 'Unlimited competitor analysis', included: true },
          { name: 'Detailed buyer personas (unlimited)', included: true },
          { name: 'Custom KPI dashboard & reporting', included: true },
          { name: '12-month detailed marketing roadmap', included: true },
          { name: 'Omnichannel strategy', included: true },
          { name: 'Unlimited strategy sessions', included: true },
          { name: 'Budget allocation & ROI projections', included: true },
          { name: '90-day implementation support', included: true },
          { name: 'Quarterly strategy reviews (1 year)', included: true },
          { name: 'Dedicated account manager', included: true },
        ],
      },
    ],
  },
  {
    id: 'marketing-consultation-retainer',
    category: 'MARKETING_STRATEGY',
    name: 'Marketing Consultation Retainer',
    slug: 'marketing-consultation-retainer',
    description: 'Ongoing marketing consultation and strategic guidance for your business.',
    shortDescription: 'Monthly marketing consultation and support',
    icon: '💼',
    pricingTiers: [
      {
        tier: 'STARTER',
        name: '5 Hours/Month',
        price: { usd: 500, inr: 40000 },
        billingType: 'MONTHLY',
        features: [
          { name: '5 hours of consultation per month', included: true },
          { name: 'Email support (48h response)', included: true },
          { name: 'Monthly strategy review call', included: true },
          { name: 'Campaign performance analysis', included: true },
          { name: 'Priority support', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: '10 Hours/Month',
        price: { usd: 900, inr: 72000 },
        billingType: 'MONTHLY',
        features: [
          { name: '10 hours of consultation per month', included: true },
          { name: 'Email & chat support (24h response)', included: true },
          { name: 'Bi-weekly strategy review calls', included: true },
          { name: 'Campaign performance analysis & optimization', included: true },
          { name: 'Priority support', included: true },
          { name: 'Quarterly business reviews', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: '20 Hours/Month',
        price: { usd: 1600, inr: 128000 },
        billingType: 'MONTHLY',
        features: [
          { name: '20 hours of consultation per month', included: true },
          { name: '24/7 priority support', included: true },
          { name: 'Weekly strategy review calls', included: true },
          { name: 'Advanced analytics & reporting', included: true },
          { name: 'Campaign optimization & A/B testing', included: true },
          { name: 'Dedicated account manager', included: true },
          { name: 'Monthly business reviews', included: true },
        ],
      },
    ],
  },
];

// SEO Services
export const SEO_SERVICES: Service[] = [
  {
    id: 'seo-audit-optimization',
    category: 'SEO',
    name: 'SEO Audit & Optimization',
    slug: 'seo-audit-optimization',
    description: 'Comprehensive SEO audit and optimization to improve your website\'s search engine rankings.',
    shortDescription: 'Complete SEO audit and on-page optimization',
    icon: '🔍',
    popular: true,
    pricingTiers: [
      {
        tier: 'STARTER',
        name: 'Basic SEO Audit',
        price: { usd: 300, inr: 24000 },
        billingType: 'ONE_TIME',
        deliveryTime: '3-5 business days',
        features: [
          { name: 'Technical SEO audit (up to 50 pages)', included: true },
          { name: 'On-page SEO analysis', included: true },
          { name: 'Keyword research (up to 20 keywords)', included: true },
          { name: 'Competitor analysis (3 competitors)', included: true },
          { name: 'SEO recommendations report', included: true },
          { name: 'Implementation support', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: 'Advanced SEO Package',
        price: { usd: 800, inr: 64000 },
        billingType: 'ONE_TIME',
        deliveryTime: '5-7 business days',
        features: [
          { name: 'Technical SEO audit (up to 200 pages)', included: true },
          { name: 'On-page & off-page SEO analysis', included: true },
          { name: 'Comprehensive keyword research (up to 100 keywords)', included: true },
          { name: 'Competitor analysis (10 competitors)', included: true },
          { name: 'Backlink analysis & strategy', included: true },
          { name: 'Content gap analysis', included: true },
          { name: 'Detailed action plan with priorities', included: true },
          { name: '30-day implementation support', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Enterprise SEO',
        price: { usd: 2000, inr: 160000 },
        billingType: 'ONE_TIME',
        deliveryTime: '1-2 weeks',
        features: [
          { name: 'Technical SEO audit (unlimited pages)', included: true },
          { name: 'Complete SEO analysis (on-page, off-page, technical)', included: true },
          { name: 'Advanced keyword research (unlimited)', included: true },
          { name: 'Comprehensive competitor analysis', included: true },
          { name: 'Backlink audit & link building strategy', included: true },
          { name: 'Content strategy & gap analysis', included: true },
          { name: 'Local SEO optimization', included: true },
          { name: 'Schema markup implementation', included: true },
          { name: '90-day implementation support', included: true },
          { name: 'Monthly progress reports (3 months)', included: true },
        ],
      },
    ],
  },
  {
    id: 'monthly-seo-management',
    category: 'SEO',
    name: 'Monthly SEO Management',
    slug: 'monthly-seo-management',
    description: 'Ongoing SEO management to continuously improve your search rankings and organic traffic.',
    shortDescription: 'Continuous SEO optimization and management',
    icon: '📈',
    pricingTiers: [
      {
        tier: 'STARTER',
        name: 'Basic SEO',
        price: { usd: 500, inr: 40000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Monthly keyword tracking (up to 25 keywords)', included: true },
          { name: 'On-page optimization (up to 5 pages/month)', included: true },
          { name: 'Content optimization recommendations', included: true },
          { name: 'Monthly performance report', included: true },
          { name: 'Link building (5 backlinks/month)', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: 'Professional SEO',
        price: { usd: 1200, inr: 96000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Monthly keyword tracking (up to 100 keywords)', included: true },
          { name: 'On-page optimization (up to 15 pages/month)', included: true },
          { name: 'Content creation (2 SEO articles/month)', included: true },
          { name: 'Link building (15 quality backlinks/month)', included: true },
          { name: 'Technical SEO monitoring & fixes', included: true },
          { name: 'Competitor monitoring', included: true },
          { name: 'Monthly strategy call & detailed report', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Enterprise SEO',
        price: { usd: 3000, inr: 240000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Unlimited keyword tracking', included: true },
          { name: 'On-page optimization (unlimited pages)', included: true },
          { name: 'Content creation (8 SEO articles/month)', included: true },
          { name: 'Aggressive link building (40+ backlinks/month)', included: true },
          { name: 'Technical SEO monitoring & fixes', included: true },
          { name: 'Advanced competitor analysis', included: true },
          { name: 'Local SEO management', included: true },
          { name: 'Conversion rate optimization', included: true },
          { name: 'Dedicated SEO specialist', included: true },
          { name: 'Weekly reports & bi-weekly strategy calls', included: true },
        ],
      },
    ],
  },
];

// Content Marketing Services
export const CONTENT_MARKETING_SERVICES: Service[] = [
  {
    id: 'blog-content-package',
    category: 'CONTENT_MARKETING',
    name: 'Blog Content Package',
    slug: 'blog-content-package',
    description: 'Professional blog posts optimized for SEO and engagement.',
    shortDescription: 'SEO-optimized blog posts',
    icon: '✍️',
    popular: true,
    pricingTiers: [
      {
        tier: 'STARTER',
        name: '4 Posts/Month',
        price: { usd: 400, inr: 32000 },
        billingType: 'MONTHLY',
        features: [
          { name: '4 blog posts per month (800-1000 words each)', included: true },
          { name: 'SEO keyword research & optimization', included: true },
          { name: 'Meta descriptions & titles', included: true },
          { name: '1 revision per post', included: true },
          { name: 'Stock images included', included: true },
          { name: 'Content calendar', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: '8 Posts/Month',
        price: { usd: 700, inr: 56000 },
        billingType: 'MONTHLY',
        features: [
          { name: '8 blog posts per month (1200-1500 words each)', included: true },
          { name: 'Advanced SEO optimization', included: true },
          { name: 'Meta descriptions, titles & schema markup', included: true },
          { name: '2 revisions per post', included: true },
          { name: 'Custom graphics & stock images', included: true },
          { name: 'Content calendar & strategy', included: true },
          { name: 'Social media snippets', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: '16 Posts/Month',
        price: { usd: 1200, inr: 96000 },
        billingType: 'MONTHLY',
        features: [
          { name: '16 blog posts per month (1500-2000 words each)', included: true },
          { name: 'Premium SEO optimization', included: true },
          { name: 'Complete on-page SEO setup', included: true },
          { name: 'Unlimited revisions', included: true },
          { name: 'Custom graphics, infographics & images', included: true },
          { name: 'Strategic content calendar', included: true },
          { name: 'Social media content package', included: true },
          { name: 'Email newsletter content', included: true },
          { name: 'Dedicated content strategist', included: true },
        ],
      },
    ],
  },
];

// Paid Advertising Services
export const PAID_ADVERTISING_SERVICES: Service[] = [
  {
    id: 'google-ads-management',
    category: 'PAID_ADVERTISING',
    name: 'Google Ads Management',
    slug: 'google-ads-management',
    description: 'Professional Google Ads campaign management to maximize ROI.',
    shortDescription: 'Google Ads setup and management',
    icon: '🎯',
    popular: true,
    pricingTiers: [
      {
        tier: 'STARTER',
        name: 'Basic Google Ads',
        price: { usd: 500, inr: 40000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Ad spend budget: Up to $2,000/month', included: true, limit: '$2,000' },
          { name: 'Campaign setup & optimization', included: true },
          { name: 'Keyword research & selection', included: true },
          { name: 'Ad copywriting (up to 10 ads)', included: true },
          { name: 'Monthly performance report', included: true },
          { name: 'A/B testing', included: false },
          { name: 'Remarketing campaigns', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: 'Professional Google Ads',
        price: { usd: 1000, inr: 80000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Ad spend budget: Up to $10,000/month', included: true, limit: '$10,000' },
          { name: 'Multi-campaign setup & optimization', included: true },
          { name: 'Advanced keyword research & negative keywords', included: true },
          { name: 'Ad copywriting (up to 30 ads)', included: true },
          { name: 'A/B testing & optimization', included: true },
          { name: 'Remarketing campaigns', included: true },
          { name: 'Conversion tracking setup', included: true },
          { name: 'Bi-weekly optimization & reports', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Enterprise Google Ads',
        price: { usd: 2500, inr: 200000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Ad spend budget: $10,000+/month', included: true, limit: 'Unlimited' },
          { name: 'Full-funnel campaign strategy', included: true },
          { name: 'Comprehensive keyword research & management', included: true },
          { name: 'Unlimited ad copywriting & creative', included: true },
          { name: 'Advanced A/B testing & optimization', included: true },
          { name: 'Multi-channel remarketing', included: true },
          { name: 'Advanced conversion tracking & attribution', included: true },
          { name: 'Shopping ads & display campaigns', included: true },
          { name: 'Dedicated PPC specialist', included: true },
          { name: 'Weekly optimization & detailed reports', included: true },
        ],
      },
    ],
  },
  {
    id: 'social-media-ads-management',
    category: 'PAID_ADVERTISING',
    name: 'Social Media Ads Management',
    slug: 'social-media-ads-management',
    description: 'Facebook, Instagram, LinkedIn, and Twitter ads management.',
    shortDescription: 'Social media advertising campaigns',
    icon: '📱',
    pricingTiers: [
      {
        tier: 'STARTER',
        name: 'Basic Social Ads',
        price: { usd: 600, inr: 48000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Ad spend budget: Up to $2,000/month', included: true },
          { name: '2 platforms (Facebook & Instagram)', included: true },
          { name: 'Campaign setup & targeting', included: true },
          { name: 'Ad creative (up to 10 ads)', included: true },
          { name: 'Monthly performance report', included: true },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: 'Professional Social Ads',
        price: { usd: 1200, inr: 96000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Ad spend budget: Up to $10,000/month', included: true },
          { name: '4 platforms (Facebook, Instagram, LinkedIn, Twitter)', included: true },
          { name: 'Advanced targeting & audience creation', included: true },
          { name: 'Ad creative & copywriting (up to 30 ads)', included: true },
          { name: 'A/B testing & optimization', included: true },
          { name: 'Retargeting campaigns', included: true },
          { name: 'Bi-weekly reports & optimization', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Enterprise Social Ads',
        price: { usd: 3000, inr: 240000 },
        billingType: 'MONTHLY',
        features: [
          { name: 'Ad spend budget: $10,000+/month', included: true },
          { name: 'All major platforms + emerging channels', included: true },
          { name: 'Advanced audience research & segmentation', included: true },
          { name: 'Unlimited ad creative & copywriting', included: true },
          { name: 'Advanced A/B testing & optimization', included: true },
          { name: 'Multi-channel retargeting', included: true },
          { name: 'Influencer collaboration campaigns', included: true },
          { name: 'Video ad production', included: true },
          { name: 'Dedicated social ads specialist', included: true },
          { name: 'Weekly reports & strategy calls', included: true },
        ],
      },
    ],
  },
];

// Web Development Services
export const WEB_DEVELOPMENT_SERVICES: Service[] = [
  {
    id: 'landing-page-development',
    category: 'WEB_DEVELOPMENT',
    name: 'Landing Page Development',
    slug: 'landing-page-development',
    description: 'High-converting landing pages designed and developed for your campaigns.',
    shortDescription: 'Custom landing page design & development',
    icon: '🚀',
    popular: true,
    pricingTiers: [
      {
        tier: 'STARTER',
        name: 'Basic Landing Page',
        price: { usd: 500, inr: 40000 },
        billingType: 'ONE_TIME',
        deliveryTime: '5-7 business days',
        revisions: 2,
        features: [
          { name: 'Single landing page', included: true },
          { name: 'Responsive design (mobile-friendly)', included: true },
          { name: 'Contact form integration', included: true },
          { name: 'Basic SEO optimization', included: true },
          { name: 'Stock images', included: true },
          { name: 'Custom graphics', included: false },
          { name: 'A/B testing setup', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: 'Professional Landing Page',
        price: { usd: 1200, inr: 96000 },
        billingType: 'ONE_TIME',
        deliveryTime: '7-10 business days',
        revisions: 'unlimited',
        features: [
          { name: 'Custom landing page design', included: true },
          { name: 'Fully responsive (all devices)', included: true },
          { name: 'Advanced form integration (CRM, email)', included: true },
          { name: 'Complete SEO optimization', included: true },
          { name: 'Custom graphics & images', included: true },
          { name: 'A/B testing setup', included: true },
          { name: 'Analytics integration', included: true },
          { name: 'Speed optimization', included: true },
          { name: '30-day support', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Enterprise Landing Page',
        price: { usd: 2500, inr: 200000 },
        billingType: 'ONE_TIME',
        deliveryTime: '2 weeks',
        revisions: 'unlimited',
        features: [
          { name: 'Premium custom design', included: true },
          { name: 'Advanced animations & interactions', included: true },
          { name: 'Multi-step forms & lead qualification', included: true },
          { name: 'Advanced SEO & conversion optimization', included: true },
          { name: 'Custom illustrations & graphics', included: true },
          { name: 'A/B testing & heatmap setup', included: true },
          { name: 'Advanced analytics & tracking', included: true },
          { name: 'Performance optimization (Core Web Vitals)', included: true },
          { name: 'Chatbot integration', included: true },
          { name: '90-day support & optimization', included: true },
        ],
      },
    ],
  },
  {
    id: 'full-website-development',
    category: 'WEB_DEVELOPMENT',
    name: 'Full Website Development',
    slug: 'full-website-development',
    description: 'Complete website design and development from scratch.',
    shortDescription: 'Custom website design & development',
    icon: '🌐',
    pricingTiers: [
      {
        tier: 'STARTER',
        name: '5-Page Website',
        price: { usd: 2000, inr: 160000 },
        billingType: 'ONE_TIME',
        deliveryTime: '2-3 weeks',
        revisions: 3,
        features: [
          { name: 'Up to 5 pages', included: true },
          { name: 'Responsive design', included: true },
          { name: 'Contact form', included: true },
          { name: 'Basic SEO setup', included: true },
          { name: 'CMS integration (WordPress)', included: true },
          { name: '30-day support', included: true },
          { name: 'E-commerce functionality', included: false },
        ],
      },
      {
        tier: 'PROFESSIONAL',
        name: '10-Page Website',
        price: { usd: 5000, inr: 400000 },
        billingType: 'ONE_TIME',
        deliveryTime: '4-6 weeks',
        revisions: 'unlimited',
        features: [
          { name: 'Up to 10 pages', included: true },
          { name: 'Custom responsive design', included: true },
          { name: 'Advanced forms & integrations', included: true },
          { name: 'Complete SEO optimization', included: true },
          { name: 'CMS integration (WordPress/custom)', included: true },
          { name: 'Blog setup', included: true },
          { name: 'Analytics & tracking', included: true },
          { name: 'Speed optimization', included: true },
          { name: '90-day support', included: true },
        ],
      },
      {
        tier: 'ENTERPRISE',
        name: 'Custom Website',
        price: { usd: 15000, inr: 1200000 },
        billingType: 'ONE_TIME',
        deliveryTime: '8-12 weeks',
        revisions: 'unlimited',
        features: [
          { name: 'Unlimited pages', included: true },
          { name: 'Premium custom design', included: true },
          { name: 'Advanced functionality & integrations', included: true },
          { name: 'Enterprise SEO setup', included: true },
          { name: 'Custom CMS or headless CMS', included: true },
          { name: 'E-commerce functionality', included: true },
          { name: 'Multi-language support', included: true },
          { name: 'Advanced security features', included: true },
          { name: 'Performance optimization', included: true },
          { name: 'Dedicated project manager', included: true },
          { name: '6-month support & maintenance', included: true },
        ],
      },
    ],
  },
];

// All services combined
export const ALL_SERVICES: Service[] = [
  ...MARKETING_STRATEGY_SERVICES,
  ...SEO_SERVICES,
  ...CONTENT_MARKETING_SERVICES,
  ...PAID_ADVERTISING_SERVICES,
  ...WEB_DEVELOPMENT_SERVICES,
];

// Helper functions
export function getServiceBySlug(slug: string): Service | undefined {
  return ALL_SERVICES.find(service => service.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): Service[] {
  return ALL_SERVICES.filter(service => service.category === category);
}

export function getPopularServices(): Service[] {
  return ALL_SERVICES.filter(service => service.popular);
}

// Service categories metadata
export const SERVICE_CATEGORIES = [
  {
    id: 'MARKETING_STRATEGY',
    name: 'Marketing Strategy',
    description: 'Strategic planning and consultation for your marketing success',
    icon: '🎯',
  },
  {
    id: 'SEO',
    name: 'SEO Services',
    description: 'Search engine optimization to boost your organic visibility',
    icon: '🔍',
  },
  {
    id: 'CONTENT_MARKETING',
    name: 'Content Marketing',
    description: 'Engaging content that drives traffic and conversions',
    icon: '✍️',
  },
  {
    id: 'PAID_ADVERTISING',
    name: 'Paid Advertising',
    description: 'ROI-focused paid advertising campaigns across all channels',
    icon: '📱',
  },
  {
    id: 'WEB_DEVELOPMENT',
    name: 'Web Development',
    description: 'Professional websites and landing pages that convert',
    icon: '🌐',
  },
] as const;

