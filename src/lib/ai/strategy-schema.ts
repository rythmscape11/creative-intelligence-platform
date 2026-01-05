import { z } from 'zod';

const executiveSummarySchema = z.object({
    overview: z.string().describe('2-3 sentences high-level summary'),
    keyRecommendations: z.array(z.string()).describe('5 strategic bullet points'),
    expectedOutcomes: z.array(z.string()).describe('5 measurable outcomes'),
    investmentSummary: z.string().describe('Summary of budget and ROI'),
});

const situationAnalysisSchema = z.object({
    marketAnalysis: z.string().describe('Deep dive into market dynamics'),
    competitiveAnalysis: z.string().describe('Analysis of competitive landscape'),
    swotAnalysis: z.object({
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        opportunities: z.array(z.string()),
        threats: z.array(z.string()),
    }),
    keyInsights: z.array(z.string()).describe('3-5 critical strategic insights'),
});

const targetAudiencePersonasSchema = z.array(
    z.object({
        name: z.string(),
        demographics: z.string(),
        psychographics: z.string(),
        painPoints: z.array(z.string()),
        goals: z.array(z.string()),
        buyingJourney: z.array(z.string()),
        preferredChannels: z.array(z.string()),
        messagingApproach: z.string(),
    })
).describe('Generate 2-3 personas');

const brandPositioningSchema = z.object({
    positioningStatement: z.string(),
    valueProposition: z.string(),
    brandPillars: z.array(z.string()),
    messagingFramework: z.object({
        coreMessage: z.string(),
        supportingMessages: z.array(z.string()),
        proofPoints: z.array(z.string()),
    }),
    competitiveDifferentiation: z.array(z.string()),
});

const marketingObjectivesAndKPIsSchema = z.array(
    z.object({
        objective: z.string(),
        smartGoal: z.string().describe('Specific, Measurable, Achievable, Relevant, Time-bound'),
        primaryMetrics: z.array(z.string()),
        targetValues: z.array(z.string()),
        measurementMethod: z.string(),
        timeline: z.string(),
    })
);

const channelStrategySchema = z.array(
    z.object({
        channel: z.string(),
        rationale: z.string(),
        tactics: z.array(z.string()),
        budgetAllocation: z.number().describe('Dollar amount'),
        budgetPercentage: z.number().describe('Percentage of total budget'),
        expectedROI: z.string(),
        timeline: z.string(),
        keyMetrics: z.array(z.string()),
        successCriteria: z.array(z.string()),
    })
);

const contentStrategySchema = z.object({
    contentThemes: z.array(z.string()),
    contentPillars: z.array(
        z.object({
            pillar: z.string(),
            description: z.string(),
            contentTypes: z.array(z.string()),
        })
    ),
    contentCalendar: z.object({
        frequency: z.string(),
        distribution: z.array(z.string()),
    }),
    seoStrategy: z.string(),
    distributionPlan: z.array(z.string()),
});

const customerJourneyMappingSchema = z.object({
    awareness: z.object({
        stage: z.string(),
        customerMindset: z.string(),
        marketingActivities: z.array(z.string()),
        contentTypes: z.array(z.string()),
        channels: z.array(z.string()),
        metrics: z.array(z.string()),
    }),
    consideration: z.object({
        stage: z.string(),
        customerMindset: z.string(),
        marketingActivities: z.array(z.string()),
        contentTypes: z.array(z.string()),
        channels: z.array(z.string()),
        metrics: z.array(z.string()),
    }),
    decision: z.object({
        stage: z.string(),
        customerMindset: z.string(),
        marketingActivities: z.array(z.string()),
        contentTypes: z.array(z.string()),
        channels: z.array(z.string()),
        metrics: z.array(z.string()),
    }),
    retention: z.object({
        stage: z.string(),
        customerMindset: z.string(),
        marketingActivities: z.array(z.string()),
        contentTypes: z.array(z.string()),
        channels: z.array(z.string()),
        metrics: z.array(z.string()),
    }),
    advocacy: z.object({
        stage: z.string(),
        customerMindset: z.string(),
        marketingActivities: z.array(z.string()),
        contentTypes: z.array(z.string()),
        channels: z.array(z.string()),
        metrics: z.array(z.string()),
    }),
});

const implementationTimelineSchema = z.array(
    z.object({
        phase: z.string(),
        duration: z.string(),
        objectives: z.array(z.string()),
        activities: z.array(z.string()),
        deliverables: z.array(z.string()),
        milestones: z.array(z.string()),
        dependencies: z.array(z.string()),
    })
);

const budgetBreakdownSchema = z.object({
    totalBudget: z.number(),
    channelAllocations: z.array(
        z.object({
            channel: z.string(),
            amount: z.number(),
            percentage: z.number(),
            breakdown: z.array(
                z.object({
                    item: z.string(),
                    cost: z.number(),
                })
            ),
        })
    ),
    contingency: z.number(),
    contingencyPercentage: z.number(),
    roiProjections: z.object({
        conservative: z.string(),
        moderate: z.string(),
        optimistic: z.string(),
    }),
});

const measurementAndAnalyticsSchema = z.object({
    dashboards: z.array(z.string()),
    reportingCadence: z.string(),
    keyReports: z.array(z.string()),
    optimizationPlan: z.string(),
    testingStrategy: z.array(z.string()),
    attributionModel: z.string(),
});

const riskAssessmentSchema = z.array(
    z.object({
        risk: z.string(),
        likelihood: z.string(),
        impact: z.string(),
        mitigationStrategy: z.string(),
    })
);

const competitiveDifferentiationSchema = z.object({
    uniqueSellingPropositions: z.array(z.string()),
    competitiveAdvantages: z.array(z.string()),
    marketGaps: z.array(z.string()),
    innovationOpportunities: z.array(z.string()),
});

const technologyAndToolsSchema = z.object({
    recommended: z.array(
        z.object({
            category: z.string(),
            tool: z.string(),
            purpose: z.string(),
            priority: z.string(),
            estimatedCost: z.string(),
        })
    ),
    integrationPlan: z.string(),
});

const teamStructureSchema = z.object({
    recommendedRoles: z.array(
        z.object({
            role: z.string(),
            responsibilities: z.array(z.string()),
            skillsRequired: z.array(z.string()),
            priority: z.string(),
            internalOrExternal: z.string(),
        })
    ),
    organizationalChart: z.string(),
    trainingNeeds: z.array(z.string()),
});

const quickWinsSchema = z.object({
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
});

const appendixSchema = z.object({
    glossary: z.array(
        z.object({
            term: z.string(),
            definition: z.string(),
        })
    ),
    resources: z.array(z.string()),
    benchmarks: z.array(
        z.object({
            metric: z.string(),
            industryAverage: z.string(),
            topPerformers: z.string(),
            yourTarget: z.string(),
        })
    ),
});

export const strategySchema = z.object({
    _strategyId: z.string().optional().describe('Do not generate this, it will be injected'),
    executiveSummary: executiveSummarySchema,
    situationAnalysis: situationAnalysisSchema,
    targetAudiencePersonas: targetAudiencePersonasSchema,
    brandPositioning: brandPositioningSchema,
    marketingObjectivesAndKPIs: marketingObjectivesAndKPIsSchema,
    channelStrategy: channelStrategySchema,
    contentStrategy: contentStrategySchema,
    customerJourneyMapping: customerJourneyMappingSchema,
    implementationTimeline: implementationTimelineSchema,
    budgetBreakdown: budgetBreakdownSchema,
    measurementAndAnalytics: measurementAndAnalyticsSchema,
    riskAssessment: riskAssessmentSchema,
    competitiveDifferentiation: competitiveDifferentiationSchema,
    technologyAndTools: technologyAndToolsSchema,
    teamStructure: teamStructureSchema,
    quickWins: quickWinsSchema,
    appendix: appendixSchema,
});

export type StrategySchema = z.infer<typeof strategySchema>;
