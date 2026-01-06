import { z } from 'zod';

// Re-export basic strategy schemas from validation module
export {
    strategyInputSchema,
    businessInfoSchema,
    audienceAndBudgetSchema,
    objectivesAndTimeframeSchema,
    challengesAndContextSchema,
    brandAndChannelsSchema,
    industryOptions,
    timeframeOptions,
    commonObjectives,
    strategyFormSteps,
    type StrategyInput,
    type BusinessInfo,
    type AudienceAndBudget,
    type ObjectivesAndTimeframe,
    type ChallengesAndContext,
    type BrandAndChannels,
} from '@/lib/validations/strategy';

// --- Enums & Constants ---

export const BusinessTypeSchema = z.enum(['B2B', 'B2C', 'B2B2C', 'D2C', 'MARKETPLACE', 'SAAS', 'ECOMMERCE', 'SERVICE']);
export const CompanyStageSchema = z.enum(['STARTUP', 'GROWTH', 'MATURE', 'ENTERPRISE']);
export const MarketMaturitySchema = z.enum(['EMERGING', 'GROWING', 'MATURE', 'DECLINING']);
export const CompetitiveLandscapeSchema = z.enum(['BLUE_OCEAN', 'RED_OCEAN', 'NICHE', 'MONOPOLISTIC']);
export const GeographicScopeSchema = z.enum(['LOCAL', 'REGIONAL', 'NATIONAL', 'INTERNATIONAL', 'GLOBAL']);
export const MarketingObjectiveSchema = z.enum([
    'BRAND_AWARENESS', 'LEAD_GENERATION', 'CUSTOMER_ACQUISITION', 'CUSTOMER_RETENTION',
    'REVENUE_GROWTH', 'MARKET_SHARE', 'PRODUCT_LAUNCH', 'THOUGHT_LEADERSHIP',
    'CUSTOMER_ENGAGEMENT', 'MARKET_EXPANSION'
]);
export const PrimaryKPISchema = z.enum(['REVENUE', 'LEADS', 'CUSTOMERS', 'TRAFFIC', 'ENGAGEMENT', 'BRAND_METRICS', 'CLV']);
export const TimeframeSchema = z.enum(['1-3-months', '3-6-months', '6-12-months', '12-24-months']);
export const TeamSizeSchema = z.enum(['SOLO', 'SMALL_2_5', 'MEDIUM_6_15', 'LARGE_16_50', 'ENTERPRISE_50_PLUS']);
export const MarketingMaturitySchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);
export const BrandPositioningSchema = z.enum(['PREMIUM', 'VALUE', 'INNOVATIVE', 'RELIABLE', 'CUSTOMER_CENTRIC']);
export const MarketingChannelSchema = z.enum([
    'SEO', 'PAID_SEARCH', 'CONTENT_MARKETING', 'EMAIL_MARKETING', 'SOCIAL_MEDIA_ORGANIC',
    'SOCIAL_MEDIA_PAID', 'INFLUENCER_MARKETING', 'AFFILIATE_MARKETING', 'PR', 'EVENTS',
    'PARTNERSHIPS', 'DIRECT_MAIL', 'DISPLAY_ADS', 'VIDEO_ADS', 'PODCAST_ADS', 'COMMUNITY'
]);
export const CurrentChallengeSchema = z.enum([
    'LIMITED_BUDGET', 'LACK_OF_EXPERTISE', 'SMALL_TEAM', 'INTENSE_COMPETITION',
    'LOW_BRAND_AWARENESS', 'POOR_CONVERSION', 'UNCLEAR_TARGET_AUDIENCE',
    'INCONSISTENT_MESSAGING', 'LACK_OF_DATA', 'TECHNOLOGY_GAPS', 'LONG_SALES_CYCLES',
    'CUSTOMER_RETENTION'
]);
export const MarTechSchema = z.enum([
    'CRM', 'MARKETING_AUTOMATION', 'ANALYTICS', 'EMAIL_PLATFORM', 'SOCIAL_MEDIA_MANAGEMENT',
    'SEO_TOOLS', 'ADVERTISING_PLATFORMS', 'CONTENT_MANAGEMENT', 'CUSTOMER_DATA_PLATFORM',
    'ATTRIBUTION_TOOLS'
]);
export const SecondaryKPISchema = z.enum([
    'REVENUE', 'LEADS', 'CUSTOMERS', 'TRAFFIC', 'ENGAGEMENT', 'BRAND_METRICS', 'CLV',
    'CAC', 'ROAS', 'NPS'
]);

// --- Input Schema ---

export const EnhancedStrategyInputSchema = z.object({
    // Basic Business Information
    businessName: z.string().min(1, 'Business name is required'),
    industry: z.string().min(1, 'Industry is required'),

    // Business Model & Stage
    businessType: BusinessTypeSchema,
    companyStage: CompanyStageSchema,

    // Market Context
    targetMarketMaturity: MarketMaturitySchema,
    competitiveLandscape: CompetitiveLandscapeSchema,

    // Marketing Objectives
    marketingObjectives: z.array(MarketingObjectiveSchema).min(1, 'At least one marketing objective is required'),

    // Geographic & Scale
    geographicScope: GeographicScopeSchema,

    // Budget & Resources
    budget: z.number().min(1000, 'Budget must be at least $1,000'),
    timeframe: TimeframeSchema,

    // Team & Resources
    teamSize: TeamSizeSchema,
    marketingMaturity: MarketingMaturitySchema,

    // Channel Preferences
    preferredChannels: z.array(MarketingChannelSchema).optional(),

    // Brand Positioning
    brandPositioning: BrandPositioningSchema,

    // Target Audience
    targetAudience: z.string().min(10, 'Target audience description is required'),

    // Current Challenges
    currentChallenges: z.array(CurrentChallengeSchema).optional(),

    // Technology Stack
    existingMarTech: z.array(MarTechSchema).optional(),

    // Additional Context
    competitorInfo: z.string().optional(),
    existingMarketing: z.string().optional(),
    seasonalityFactors: z.string().optional(),
    regulatoryConstraints: z.string().optional(),

    // Brand Identity
    brandVoice: z.string().min(2, 'Brand voice is required').optional(),
    brandValues: z.array(z.string()).max(5, 'Maximum 5 brand values').optional(),

    // Success Metrics Priority
    primaryKPI: PrimaryKPISchema,
    secondaryKPIs: z.array(SecondaryKPISchema).optional(),

    // Historical Data
    pastPerformance: z.string().max(2000).optional(),

    // Integration
    includeMarketIntelligence: z.boolean().optional(),
});

export type EnhancedStrategyInputDTO = z.infer<typeof EnhancedStrategyInputSchema>;

// --- Output Schemas (Recursive/Nested) ---

const ExecutiveSummarySchema = z.object({
    overview: z.string(),
    keyRecommendations: z.array(z.string()),
    expectedOutcomes: z.array(z.string()),
    investmentSummary: z.string(),
});

const SituationAnalysisSchema = z.object({
    marketAnalysis: z.string(),
    competitiveAnalysis: z.string(),
    swotAnalysis: z.object({
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        opportunities: z.array(z.string()),
        threats: z.array(z.string()),
    }),
    keyInsights: z.array(z.string()),
});

const PersonaSchema = z.object({
    name: z.string(),
    demographics: z.string(),
    psychographics: z.string(),
    painPoints: z.array(z.string()),
    goals: z.array(z.string()),
    buyingJourney: z.array(z.string()),
    preferredChannels: z.array(z.string()),
    messagingApproach: z.string(),
});

const UserJourneyStageSchema = z.object({
    stage: z.string(),
    customerMindset: z.string(),
    marketingActivities: z.array(z.string()),
    contentTypes: z.array(z.string()),
    channels: z.array(z.string()),
    metrics: z.array(z.string()),
});

export const EnhancedStrategyOutputSchema = z.object({
    executiveSummary: ExecutiveSummarySchema,
    situationAnalysis: SituationAnalysisSchema,
    targetAudiencePersonas: z.array(PersonaSchema),
    brandPositioning: z.object({
        positioningStatement: z.string(),
        valueProposition: z.string(),
        brandPillars: z.array(z.string()),
        messagingFramework: z.object({
            coreMessage: z.string(),
            supportingMessages: z.array(z.string()),
            proofPoints: z.array(z.string()),
        }),
        competitiveDifferentiation: z.array(z.string()),
    }),
    marketingObjectivesAndKPIs: z.array(z.object({
        objective: z.string(),
        smartGoal: z.string(),
        primaryMetrics: z.array(z.string()),
        targetValues: z.array(z.string()),
        measurementMethod: z.string(),
        timeline: z.string(),
    })),
    channelStrategy: z.array(z.object({
        channel: z.string(),
        rationale: z.string(),
        tactics: z.array(z.string()),
        budgetAllocation: z.number(),
        budgetPercentage: z.number(),
        expectedROI: z.string(),
        timeline: z.string(),
        keyMetrics: z.array(z.string()),
        successCriteria: z.array(z.string()),
    })),
    contentStrategy: z.object({
        contentThemes: z.array(z.string()),
        contentPillars: z.array(z.object({
            pillar: z.string(),
            description: z.string(),
            contentTypes: z.array(z.string()),
        })),
        contentCalendar: z.object({
            frequency: z.string(),
            distribution: z.array(z.string()),
        }),
        seoStrategy: z.string(),
        distributionPlan: z.array(z.string()),
    }),
    customerJourneyMapping: z.object({
        awareness: UserJourneyStageSchema,
        consideration: UserJourneyStageSchema,
        decision: UserJourneyStageSchema,
        retention: UserJourneyStageSchema,
        advocacy: UserJourneyStageSchema,
    }),
    implementationTimeline: z.array(z.object({
        phase: z.string(),
        duration: z.string(),
        objectives: z.array(z.string()),
        activities: z.array(z.string()),
        deliverables: z.array(z.string()),
        milestones: z.array(z.string()),
        dependencies: z.array(z.string()),
    })),
    budgetBreakdown: z.object({
        totalBudget: z.number(),
        channelAllocations: z.array(z.object({
            channel: z.string(),
            amount: z.number(),
            percentage: z.number(),
            breakdown: z.array(z.object({
                item: z.string(),
                cost: z.number(),
            })),
        })),
        contingency: z.number(),
        contingencyPercentage: z.number(),
        roiProjections: z.object({
            conservative: z.string(),
            moderate: z.string(),
            optimistic: z.string(),
        }),
    }),
    measurementAndAnalytics: z.object({
        dashboards: z.array(z.string()),
        reportingCadence: z.string(),
        keyReports: z.array(z.string()),
        optimizationPlan: z.string(),
        testingStrategy: z.array(z.string()),
        attributionModel: z.string(),
    }),
    riskAssessment: z.array(z.object({
        risk: z.string(),
        likelihood: z.string(),
        impact: z.string(),
        mitigationStrategy: z.string(),
    })),
    competitiveDifferentiation: z.object({
        uniqueSellingPropositions: z.array(z.string()),
        competitiveAdvantages: z.array(z.string()),
        marketGaps: z.array(z.string()),
        innovationOpportunities: z.array(z.string()),
    }),
    technologyAndTools: z.object({
        recommended: z.array(z.object({
            category: z.string(),
            tool: z.string(),
            purpose: z.string(),
            priority: z.string(),
            estimatedCost: z.string(),
        })),
        integrationPlan: z.string(),
    }),
    teamStructure: z.object({
        recommendedRoles: z.array(z.object({
            role: z.string(),
            responsibilities: z.array(z.string()),
            skillsRequired: z.array(z.string()),
            priority: z.string(),
            internalOrExternal: z.string(),
        })),
        organizationalChart: z.string(),
        trainingNeeds: z.array(z.string()),
    }),
    quickWins: z.object({
        thirtyDays: z.array(z.object({
            action: z.string(),
            expectedImpact: z.string(),
            effort: z.string(),
            resources: z.array(z.string()),
        })),
        sixtyDays: z.array(z.object({
            action: z.string(),
            expectedImpact: z.string(),
            effort: z.string(),
            resources: z.array(z.string()),
        })),
        ninetyDays: z.array(z.object({
            action: z.string(),
            expectedImpact: z.string(),
            effort: z.string(),
            resources: z.array(z.string()),
        })),
    }),
    appendix: z.object({
        glossary: z.array(z.object({
            term: z.string(),
            definition: z.string(),
        })),
        resources: z.array(z.string()),
        benchmarks: z.array(z.object({
            metric: z.string(),
            industryAverage: z.string(),
            topPerformers: z.string(),
            yourTarget: z.string(),
        })),
    }),
});

export type EnhancedStrategyOutputDTO = z.infer<typeof EnhancedStrategyOutputSchema>;
