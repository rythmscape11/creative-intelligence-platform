import { z } from 'zod';

// Strategy Input Validation Schema
export const strategyInputSchema = z.object({
  businessName: z
    .string()
    .refine((val) => val.trim().length > 0, 'Business name is required')
    .refine((val) => val.trim().length >= 2, 'Business name must be at least 2 characters')
    .refine((val) => val.length <= 100, 'Business name must be less than 100 characters'),

  industry: z
    .string()
    .refine((val) => val.trim().length > 0, 'Industry is required')
    .refine((val) => val.trim().length >= 2, 'Industry must be at least 2 characters')
    .refine((val) => val.length <= 50, 'Industry must be less than 50 characters'),

  targetAudience: z
    .string()
    .min(10, 'Target audience description must be at least 10 characters')
    .max(500, 'Target audience description must be less than 500 characters'),

  budget: z
    .number()
    .min(1000, 'Minimum budget is $1,000')
    .max(10000000, 'Budget must be less than $10,000,000'),

  objectives: z
    .array(z.string().min(1, 'Objective cannot be empty'))
    .min(1, 'Please select at least one objective')
    .max(10, 'Maximum 10 objectives allowed'),

  timeframe: z
    .string()
    .min(1, 'Timeframe is required')
    .refine(
      (val) => ['3-months', '6-months', '12-months', '18-months', '24-months'].includes(val),
      'Invalid timeframe selected'
    ),

  currentChallenges: z
    .string()
    .min(10, 'Current challenges description must be at least 10 characters')
    .max(1000, 'Current challenges description must be less than 1000 characters'),

  competitorInfo: z
    .string()
    .max(1000, 'Competitor information must be less than 1000 characters')
    .optional(),

  existingMarketing: z
    .string()
    .max(1000, 'Existing marketing description must be less than 1000 characters')
    .optional(),

  // Director-Level Fields
  brandVoice: z
    .string()
    .min(2, 'Brand voice is required')
    .max(100, 'Brand voice must be less than 100 characters')
    .optional(),

  brandValues: z
    .array(z.string())
    .max(5, 'Maximum 5 brand values allowed')
    .optional(),

  targetChannels: z
    .array(z.string())
    .min(1, 'Select at least one target channel')
    .optional(),

  kpis: z
    .array(z.string())
    .min(1, 'Select at least one KPI')
    .optional(),

  pastPerformance: z
    .string()
    .max(1000, 'Past performance summary must be less than 1000 characters')
    .optional(),
});

// Individual field schemas for step-by-step validation
export const businessInfoSchema = z.object({
  businessName: strategyInputSchema.shape.businessName,
  industry: strategyInputSchema.shape.industry,
});

export const audienceAndBudgetSchema = z.object({
  targetAudience: strategyInputSchema.shape.targetAudience,
  budget: strategyInputSchema.shape.budget,
});

export const objectivesAndTimeframeSchema = z.object({
  objectives: strategyInputSchema.shape.objectives,
  timeframe: strategyInputSchema.shape.timeframe,
});

export const challengesAndContextSchema = z.object({
  currentChallenges: strategyInputSchema.shape.currentChallenges,
  competitorInfo: strategyInputSchema.shape.competitorInfo,
  existingMarketing: strategyInputSchema.shape.existingMarketing,
  pastPerformance: strategyInputSchema.shape.pastPerformance,
});

export const brandAndChannelsSchema = z.object({
  brandVoice: strategyInputSchema.shape.brandVoice,
  brandValues: strategyInputSchema.shape.brandValues,
  targetChannels: strategyInputSchema.shape.targetChannels,
  kpis: strategyInputSchema.shape.kpis,
});

// Type exports
export type StrategyInput = z.infer<typeof strategyInputSchema>;
export type BusinessInfo = z.infer<typeof businessInfoSchema>;
export type AudienceAndBudget = z.infer<typeof audienceAndBudgetSchema>;
export type ObjectivesAndTimeframe = z.infer<typeof objectivesAndTimeframeSchema>;
export type ChallengesAndContext = z.infer<typeof challengesAndContextSchema>;
export type BrandAndChannels = z.infer<typeof brandAndChannelsSchema>;

// Industry options
export const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'travel-hospitality', label: 'Travel & Hospitality' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'non-profit', label: 'Non-Profit' },
  { value: 'other', label: 'Other' },
];

// Timeframe options
export const timeframeOptions = [
  { value: '3-months', label: '3 Months' },
  { value: '6-months', label: '6 Months' },
  { value: '12-months', label: '12 Months' },
  { value: '18-months', label: '18 Months' },
  { value: '24-months', label: '24 Months' },
];

// Common marketing objectives
export const commonObjectives = [
  'Increase brand awareness',
  'Generate more leads',
  'Boost sales revenue',
  'Improve customer retention',
  'Expand market reach',
  'Launch new product/service',
  'Improve online presence',
  'Increase social media engagement',
  'Build thought leadership',
  'Reduce customer acquisition cost',
  'Improve customer satisfaction',
  'Enter new markets',
];

// Form step configuration
export const strategyFormSteps = [
  {
    id: 'business-info',
    title: 'Business Information',
    description: 'Tell us about your business',
    schema: businessInfoSchema,
  },
  {
    id: 'audience-budget',
    title: 'Audience & Budget',
    description: 'Define your target audience and budget',
    schema: audienceAndBudgetSchema,
  },
  {
    id: 'objectives-timeframe',
    title: 'Objectives & Timeline',
    description: 'Set your goals and timeframe',
    schema: objectivesAndTimeframeSchema,
  },
  {
    id: 'brand-channels',
    title: 'Brand & Channels',
    description: 'Define your voice and channels',
    schema: brandAndChannelsSchema,
  },
  {
    id: 'challenges-context',
    title: 'Challenges & Context',
    description: 'Provide additional context',
    schema: challengesAndContextSchema,
  },
];
