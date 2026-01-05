import { z } from 'zod';

/**
 * Enhanced Strategy Input Schema
 * Comprehensive validation for director-level marketing strategy generation
 */

// Constants for dropdown options
export const BUSINESS_TYPES = [
  { value: 'B2B', label: 'B2B (Business to Business)', description: 'Selling products/services to other businesses' },
  { value: 'B2C', label: 'B2C (Business to Consumer)', description: 'Selling directly to individual consumers' },
  { value: 'B2B2C', label: 'B2B2C (Business to Business to Consumer)', description: 'Selling to businesses who sell to consumers' },
  { value: 'D2C', label: 'D2C (Direct to Consumer)', description: 'Selling directly to consumers, bypassing retailers' },
  { value: 'MARKETPLACE', label: 'Marketplace', description: 'Platform connecting buyers and sellers' },
  { value: 'SAAS', label: 'SaaS (Software as a Service)', description: 'Cloud-based software subscription model' },
  { value: 'ECOMMERCE', label: 'E-commerce', description: 'Online retail business' },
  { value: 'SERVICE', label: 'Service Business', description: 'Professional or personal services' },
] as const;

export const COMPANY_STAGES = [
  { value: 'STARTUP', label: 'Startup', description: 'Early stage, finding product-market fit' },
  { value: 'GROWTH', label: 'Growth', description: 'Scaling operations and customer base' },
  { value: 'MATURE', label: 'Mature', description: 'Established business, optimizing operations' },
  { value: 'ENTERPRISE', label: 'Enterprise', description: 'Large organization with multiple divisions' },
] as const;

export const MARKET_MATURITY_LEVELS = [
  { value: 'EMERGING', label: 'Emerging Market', description: 'New market with growing demand' },
  { value: 'GROWING', label: 'Growing Market', description: 'Rapidly expanding market' },
  { value: 'MATURE', label: 'Mature Market', description: 'Established market with stable demand' },
  { value: 'DECLINING', label: 'Declining Market', description: 'Shrinking market demand' },
] as const;

export const COMPETITIVE_LANDSCAPES = [
  { value: 'BLUE_OCEAN', label: 'Blue Ocean', description: 'Little to no competition, new market space' },
  { value: 'RED_OCEAN', label: 'Red Ocean', description: 'Highly competitive, crowded market' },
  { value: 'NICHE', label: 'Niche Market', description: 'Specialized segment with limited competition' },
  { value: 'MONOPOLISTIC', label: 'Monopolistic', description: 'Dominated by few large players' },
] as const;

export const GEOGRAPHIC_SCOPES = [
  { value: 'LOCAL', label: 'Local', description: 'City or regional focus' },
  { value: 'REGIONAL', label: 'Regional', description: 'Multi-city or state level' },
  { value: 'NATIONAL', label: 'National', description: 'Country-wide operations' },
  { value: 'INTERNATIONAL', label: 'International', description: 'Multiple countries' },
  { value: 'GLOBAL', label: 'Global', description: 'Worldwide presence' },
] as const;

export const MARKETING_OBJECTIVES = [
  { value: 'BRAND_AWARENESS', label: 'Brand Awareness', description: 'Increase brand recognition and visibility' },
  { value: 'LEAD_GENERATION', label: 'Lead Generation', description: 'Generate qualified leads for sales' },
  { value: 'CUSTOMER_ACQUISITION', label: 'Customer Acquisition', description: 'Acquire new customers' },
  { value: 'CUSTOMER_RETENTION', label: 'Customer Retention', description: 'Retain and engage existing customers' },
  { value: 'REVENUE_GROWTH', label: 'Revenue Growth', description: 'Increase sales and revenue' },
  { value: 'MARKET_SHARE', label: 'Market Share Growth', description: 'Capture larger market share' },
  { value: 'PRODUCT_LAUNCH', label: 'Product Launch', description: 'Launch new product or service' },
  { value: 'THOUGHT_LEADERSHIP', label: 'Thought Leadership', description: 'Establish industry authority' },
  { value: 'CUSTOMER_ENGAGEMENT', label: 'Customer Engagement', description: 'Increase customer interaction and loyalty' },
  { value: 'MARKET_EXPANSION', label: 'Market Expansion', description: 'Enter new markets or segments' },
] as const;

export const PRIMARY_KPIS = [
  { value: 'REVENUE', label: 'Revenue', description: 'Total sales revenue' },
  { value: 'LEADS', label: 'Leads', description: 'Number of qualified leads' },
  { value: 'CUSTOMERS', label: 'New Customers', description: 'Customer acquisition count' },
  { value: 'TRAFFIC', label: 'Website Traffic', description: 'Visitors to website' },
  { value: 'ENGAGEMENT', label: 'Engagement', description: 'User interaction metrics' },
  { value: 'BRAND_METRICS', label: 'Brand Metrics', description: 'Brand awareness and perception' },
  { value: 'CLV', label: 'Customer Lifetime Value', description: 'Long-term customer value' },
] as const;

export const TIMEFRAMES = [
  { value: '1-3-months', label: '1-3 Months', description: 'Quick wins and immediate impact' },
  { value: '3-6-months', label: '3-6 Months', description: 'Short-term strategy' },
  { value: '6-12-months', label: '6-12 Months', description: 'Annual planning cycle' },
  { value: '12-24-months', label: '12-24 Months', description: 'Long-term strategic plan' },
] as const;

export const TEAM_SIZES = [
  { value: 'SOLO', label: 'Solo (Just Me)', description: 'Individual contributor' },
  { value: 'SMALL_2_5', label: 'Small Team (2-5)', description: 'Small marketing team' },
  { value: 'MEDIUM_6_15', label: 'Medium Team (6-15)', description: 'Mid-sized marketing department' },
  { value: 'LARGE_16_50', label: 'Large Team (16-50)', description: 'Large marketing organization' },
  { value: 'ENTERPRISE_50_PLUS', label: 'Enterprise (50+)', description: 'Enterprise marketing team' },
] as const;

export const MARKETING_MATURITY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner', description: 'Limited marketing experience' },
  { value: 'INTERMEDIATE', label: 'Intermediate', description: 'Some marketing knowledge and experience' },
  { value: 'ADVANCED', label: 'Advanced', description: 'Strong marketing capabilities' },
  { value: 'EXPERT', label: 'Expert', description: 'World-class marketing expertise' },
] as const;

export const BRAND_POSITIONING_OPTIONS = [
  { value: 'PREMIUM', label: 'Premium/Luxury', description: 'High-end, exclusive positioning' },
  { value: 'VALUE', label: 'Value/Budget', description: 'Affordable, cost-effective positioning' },
  { value: 'INNOVATIVE', label: 'Innovative/Cutting-edge', description: 'Technology and innovation leader' },
  { value: 'RELIABLE', label: 'Reliable/Trusted', description: 'Dependable and established' },
  { value: 'CUSTOMER_CENTRIC', label: 'Customer-Centric', description: 'Focus on customer experience' },
] as const;

export const MARKETING_CHANNELS = [
  { value: 'SEO', label: 'SEO (Search Engine Optimization)' },
  { value: 'PAID_SEARCH', label: 'Paid Search (Google Ads, Bing Ads)' },
  { value: 'CONTENT_MARKETING', label: 'Content Marketing (Blog, Videos, Podcasts)' },
  { value: 'EMAIL_MARKETING', label: 'Email Marketing' },
  { value: 'SOCIAL_MEDIA_ORGANIC', label: 'Social Media (Organic)' },
  { value: 'SOCIAL_MEDIA_PAID', label: 'Social Media (Paid Ads)' },
  { value: 'INFLUENCER_MARKETING', label: 'Influencer Marketing' },
  { value: 'AFFILIATE_MARKETING', label: 'Affiliate Marketing' },
  { value: 'PR', label: 'Public Relations' },
  { value: 'EVENTS', label: 'Events & Webinars' },
  { value: 'PARTNERSHIPS', label: 'Partnerships & Co-marketing' },
  { value: 'DIRECT_MAIL', label: 'Direct Mail' },
  { value: 'DISPLAY_ADS', label: 'Display Advertising' },
  { value: 'VIDEO_ADS', label: 'Video Advertising (YouTube, etc.)' },
  { value: 'PODCAST_ADS', label: 'Podcast Advertising' },
  { value: 'COMMUNITY', label: 'Community Building' },
] as const;

export const CURRENT_CHALLENGES = [
  { value: 'LIMITED_BUDGET', label: 'Limited Budget' },
  { value: 'LACK_OF_EXPERTISE', label: 'Lack of Marketing Expertise' },
  { value: 'SMALL_TEAM', label: 'Small Team/Limited Resources' },
  { value: 'INTENSE_COMPETITION', label: 'Intense Competition' },
  { value: 'LOW_BRAND_AWARENESS', label: 'Low Brand Awareness' },
  { value: 'POOR_CONVERSION', label: 'Poor Conversion Rates' },
  { value: 'UNCLEAR_TARGET_AUDIENCE', label: 'Unclear Target Audience' },
  { value: 'INCONSISTENT_MESSAGING', label: 'Inconsistent Messaging' },
  { value: 'LACK_OF_DATA', label: 'Lack of Data/Analytics' },
  { value: 'TECHNOLOGY_GAPS', label: 'Technology/Tool Gaps' },
  { value: 'LONG_SALES_CYCLES', label: 'Long Sales Cycles' },
  { value: 'CUSTOMER_RETENTION', label: 'Customer Retention Issues' },
] as const;

export const enhancedStrategyInputSchema = z.object({
  // Basic Business Information
  businessName: z.string().min(1, 'Business name is required'),
  industry: z.string().min(1, 'Industry is required'),

  // Business Model & Stage
  businessType: z.enum(['B2B', 'B2C', 'B2B2C', 'D2C', 'MARKETPLACE', 'SAAS', 'ECOMMERCE', 'SERVICE'], {
    required_error: 'Business type is required',
  }),
  companyStage: z.enum(['STARTUP', 'GROWTH', 'MATURE', 'ENTERPRISE'], {
    required_error: 'Company stage is required',
  }),

  // Market Context
  targetMarketMaturity: z.enum(['EMERGING', 'GROWING', 'MATURE', 'DECLINING'], {
    required_error: 'Target market maturity is required',
  }),
  competitiveLandscape: z.enum(['BLUE_OCEAN', 'RED_OCEAN', 'NICHE', 'MONOPOLISTIC'], {
    required_error: 'Competitive landscape is required',
  }),

  // Marketing Objectives (Multi-select)
  marketingObjectives: z.array(z.enum([
    'BRAND_AWARENESS',
    'LEAD_GENERATION',
    'CUSTOMER_ACQUISITION',
    'CUSTOMER_RETENTION',
    'REVENUE_GROWTH',
    'MARKET_SHARE',
    'PRODUCT_LAUNCH',
    'THOUGHT_LEADERSHIP',
    'CUSTOMER_ENGAGEMENT',
    'MARKET_EXPANSION',
  ])).min(1, 'At least one marketing objective is required'),

  // Geographic & Scale
  geographicScope: z.enum(['LOCAL', 'REGIONAL', 'NATIONAL', 'INTERNATIONAL', 'GLOBAL'], {
    required_error: 'Geographic scope is required',
  }),

  // Budget & Resources
  budget: z.number().min(1000, 'Budget must be at least $1,000'),
  timeframe: z.enum(['1-3-months', '3-6-months', '6-12-months', '12-24-months'], {
    required_error: 'Timeframe is required',
  }),

  // Team & Resources
  teamSize: z.enum(['SOLO', 'SMALL_2_5', 'MEDIUM_6_15', 'LARGE_16_50', 'ENTERPRISE_50_PLUS'], {
    required_error: 'Team size is required',
  }),
  marketingMaturity: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'], {
    required_error: 'Marketing maturity level is required',
  }),

  // Channel Preferences (Multi-select)
  preferredChannels: z.array(z.enum([
    'SEO',
    'PAID_SEARCH',
    'CONTENT_MARKETING',
    'EMAIL_MARKETING',
    'SOCIAL_MEDIA_ORGANIC',
    'SOCIAL_MEDIA_PAID',
    'INFLUENCER_MARKETING',
    'AFFILIATE_MARKETING',
    'PR',
    'EVENTS',
    'PARTNERSHIPS',
    'DIRECT_MAIL',
    'DISPLAY_ADS',
    'VIDEO_ADS',
    'PODCAST_ADS',
    'COMMUNITY',
  ])).optional(),

  // Brand Positioning
  brandPositioning: z.enum(['PREMIUM', 'VALUE', 'INNOVATIVE', 'RELIABLE', 'CUSTOMER_CENTRIC'], {
    required_error: 'Brand positioning is required',
  }),

  // Target Audience
  targetAudience: z.string().min(10, 'Target audience description is required'),

  // Current Challenges (Multi-select)
  currentChallenges: z.array(z.enum([
    'LIMITED_BUDGET',
    'LACK_OF_EXPERTISE',
    'SMALL_TEAM',
    'INTENSE_COMPETITION',
    'LOW_BRAND_AWARENESS',
    'POOR_CONVERSION',
    'UNCLEAR_TARGET_AUDIENCE',
    'INCONSISTENT_MESSAGING',
    'LACK_OF_DATA',
    'TECHNOLOGY_GAPS',
    'LONG_SALES_CYCLES',
    'CUSTOMER_RETENTION',
  ])).optional(),

  // Technology Stack (Multi-select)
  existingMarTech: z.array(z.enum([
    'CRM',
    'MARKETING_AUTOMATION',
    'ANALYTICS',
    'EMAIL_PLATFORM',
    'SOCIAL_MEDIA_MANAGEMENT',
    'SEO_TOOLS',
    'ADVERTISING_PLATFORMS',
    'CONTENT_MANAGEMENT',
    'CUSTOMER_DATA_PLATFORM',
    'ATTRIBUTION_TOOLS',
  ])).optional(),

  // Additional Context
  competitorInfo: z.string().optional(),
  existingMarketing: z.string().optional(),
  seasonalityFactors: z.string().optional(),
  regulatoryConstraints: z.string().optional(),

  // Brand Identity
  brandVoice: z.string().min(2, 'Brand voice is required').optional(),
  brandValues: z.array(z.string()).max(5, 'Maximum 5 brand values').optional(),

  // Success Metrics Priority
  primaryKPI: z.enum([
    'REVENUE',
    'LEADS',
    'CUSTOMERS',
    'TRAFFIC',
    'ENGAGEMENT',
    'BRAND_METRICS',
    'CLV',
  ], {
    required_error: 'Primary KPI is required',
  }),

  secondaryKPIs: z.array(z.enum([
    'REVENUE',
    'LEADS',
    'CUSTOMERS',
    'TRAFFIC',
    'ENGAGEMENT',
    'BRAND_METRICS',
    'CLV',
    'CAC',
    'ROAS',
    'NPS',
  ])).optional(),

  // Historical Data
  pastPerformance: z.string().max(2000, 'Past performance summary must be less than 2000 characters').optional(),

  // Integration
  includeMarketIntelligence: z.boolean().optional(),
});

export type EnhancedStrategyInput = z.infer<typeof enhancedStrategyInputSchema>;

