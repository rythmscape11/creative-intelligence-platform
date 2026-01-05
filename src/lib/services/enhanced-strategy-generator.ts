import { EnhancedStrategyInput } from '../validations/enhanced-strategy';
import { generateSituationAnalysis } from './strategy-generators/situation-analysis';
import { generateTargetAudiencePersonas } from './strategy-generators/target-audience';
import { generateBrandPositioning } from './strategy-generators/brand-positioning';
import { generateMarketingObjectivesAndKPIs } from './strategy-generators/objectives-kpis';
import { generateChannelStrategy } from './strategy-generators/channel-strategy';
import { generateQuickWins } from './strategy-generators/quick-wins';
import {
  generateImplementationTimeline,
  generateBudgetBreakdown,
  generateRiskAssessment,
  generateTeamStructure,
} from './strategy-generators/supporting-generators';
import {
  generateContentStrategy,
  generateCustomerJourneyMapping,
  generateMeasurementAndAnalytics,
  generateCompetitiveDifferentiation,
  generateTechnologyAndTools,
  generateAppendix,
} from './strategy-generators/additional-sections';

/**
 * Enhanced Strategy Generator
 * Generates director-level marketing strategies matching $50k+ agency deliverables
 */

export interface EnhancedStrategyOutput {
  executiveSummary: {
    overview: string;
    keyRecommendations: string[];
    expectedOutcomes: string[];
    investmentSummary: string;
  };
  situationAnalysis: {
    marketAnalysis: string;
    competitiveAnalysis: string;
    swotAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    keyInsights: string[];
  };
  targetAudiencePersonas: Array<{
    name: string;
    demographics: string;
    psychographics: string;
    painPoints: string[];
    goals: string[];
    buyingJourney: string[];
    preferredChannels: string[];
    messagingApproach: string;
  }>;
  brandPositioning: {
    positioningStatement: string;
    valueProposition: string;
    brandPillars: string[];
    messagingFramework: {
      coreMessage: string;
      supportingMessages: string[];
      proofPoints: string[];
    };
    competitiveDifferentiation: string[];
  };
  marketingObjectivesAndKPIs: Array<{
    objective: string;
    smartGoal: string;
    primaryMetrics: string[];
    targetValues: string[];
    measurementMethod: string;
    timeline: string;
  }>;
  channelStrategy: Array<{
    channel: string;
    rationale: string;
    tactics: string[];
    budgetAllocation: number;
    budgetPercentage: number;
    expectedROI: string;
    timeline: string;
    keyMetrics: string[];
    successCriteria: string[];
  }>;
  contentStrategy: {
    contentThemes: string[];
    contentPillars: Array<{
      pillar: string;
      description: string;
      contentTypes: string[];
    }>;
    contentCalendar: {
      frequency: string;
      distribution: string[];
    };
    seoStrategy: string;
    distributionPlan: string[];
  };
  customerJourneyMapping: {
    awareness: {
      stage: string;
      customerMindset: string;
      marketingActivities: string[];
      contentTypes: string[];
      channels: string[];
      metrics: string[];
    };
    consideration: {
      stage: string;
      customerMindset: string;
      marketingActivities: string[];
      contentTypes: string[];
      channels: string[];
      metrics: string[];
    };
    decision: {
      stage: string;
      customerMindset: string;
      marketingActivities: string[];
      contentTypes: string[];
      channels: string[];
      metrics: string[];
    };
    retention: {
      stage: string;
      customerMindset: string;
      marketingActivities: string[];
      contentTypes: string[];
      channels: string[];
      metrics: string[];
    };
    advocacy: {
      stage: string;
      customerMindset: string;
      marketingActivities: string[];
      contentTypes: string[];
      channels: string[];
      metrics: string[];
    };
  };
  implementationTimeline: Array<{
    phase: string;
    duration: string;
    objectives: string[];
    activities: string[];
    deliverables: string[];
    milestones: string[];
    dependencies: string[];
  }>;
  budgetBreakdown: {
    totalBudget: number;
    channelAllocations: Array<{
      channel: string;
      amount: number;
      percentage: number;
      breakdown: Array<{
        item: string;
        cost: number;
      }>;
    }>;
    contingency: number;
    contingencyPercentage: number;
    roiProjections: {
      conservative: string;
      moderate: string;
      optimistic: string;
    };
  };
  measurementAndAnalytics: {
    dashboards: string[];
    reportingCadence: string;
    keyReports: string[];
    optimizationPlan: string;
    testingStrategy: string[];
    attributionModel: string;
  };
  riskAssessment: Array<{
    risk: string;
    likelihood: string;
    impact: string;
    mitigationStrategy: string;
  }>;
  competitiveDifferentiation: {
    uniqueSellingPropositions: string[];
    competitiveAdvantages: string[];
    marketGaps: string[];
    innovationOpportunities: string[];
  };
  technologyAndTools: {
    recommended: Array<{
      category: string;
      tool: string;
      purpose: string;
      priority: string;
      estimatedCost: string;
    }>;
    integrationPlan: string;
  };
  teamStructure: {
    recommendedRoles: Array<{
      role: string;
      responsibilities: string[];
      skillsRequired: string[];
      priority: string;
      internalOrExternal: string;
    }>;
    organizationalChart: string;
    trainingNeeds: string[];
  };
  quickWins: {
    thirtyDays: Array<{
      action: string;
      expectedImpact: string;
      effort: string;
      resources: string[];
    }>;
    sixtyDays: Array<{
      action: string;
      expectedImpact: string;
      effort: string;
      resources: string[];
    }>;
    ninetyDays: Array<{
      action: string;
      expectedImpact: string;
      effort: string;
      resources: string[];
    }>;
  };
  appendix: {
    glossary: Array<{
      term: string;
      definition: string;
    }>;
    resources: string[];
    benchmarks: Array<{
      metric: string;
      industryAverage: string;
      topPerformers: string;
      yourTarget: string;
    }>;
  };
}

export class EnhancedStrategyGenerator {
  /**
   * Generate a comprehensive marketing strategy
   */
  /**
   * Generate a comprehensive marketing strategy
   * Tries to use OpenAI GPT-4 first, falls back to static generation if it fails
   */
  static async generateStrategy(input: EnhancedStrategyInput, userId: string, isPaid: boolean = false): Promise<EnhancedStrategyOutput> {
    try {
      // Try to generate using OpenAI
      console.log('Attempting to generate strategy using OpenAI...');
      const { OpenAIStrategyService } = await import('./openai-strategy-service');
      const aiStrategy = await OpenAIStrategyService.generateStrategy(input, userId, isPaid);
      console.log('Successfully generated strategy using OpenAI');
      return aiStrategy;
    } catch (error) {
      console.warn('OpenAI generation failed, falling back to static generator:', error);
      return this.generateStaticStrategy(input, isPaid);
    }
  }

  /**
   * Fallback: Generate strategy using static rules
   */
  private static generateStaticStrategy(input: EnhancedStrategyInput, isPaid: boolean = false): EnhancedStrategyOutput {
    // Generate channel strategy first as it's needed for budget breakdown
    const channelStrategy = generateChannelStrategy(input, isPaid);

    const strategy: EnhancedStrategyOutput = {
      executiveSummary: this.generateExecutiveSummary(input, isPaid),
      situationAnalysis: generateSituationAnalysis(input, isPaid),
      targetAudiencePersonas: generateTargetAudiencePersonas(input, isPaid),
      brandPositioning: generateBrandPositioning(input, isPaid),
      marketingObjectivesAndKPIs: generateMarketingObjectivesAndKPIs(input, isPaid),
      channelStrategy,
      contentStrategy: generateContentStrategy(input, isPaid),
      customerJourneyMapping: generateCustomerJourneyMapping(input, isPaid),
      implementationTimeline: generateImplementationTimeline(input, isPaid),
      budgetBreakdown: generateBudgetBreakdown(input, channelStrategy, isPaid),
      measurementAndAnalytics: generateMeasurementAndAnalytics(input, isPaid),
      riskAssessment: generateRiskAssessment(input, isPaid),
      competitiveDifferentiation: generateCompetitiveDifferentiation(input, isPaid),
      technologyAndTools: generateTechnologyAndTools(input, isPaid),
      teamStructure: generateTeamStructure(input, isPaid),
      quickWins: generateQuickWins(input, isPaid),
      appendix: generateAppendix(input, isPaid),
    };

    return strategy;
  }

  private static generateExecutiveSummary(input: EnhancedStrategyInput, isPaid: boolean) {
    const timeframeMap: Record<string, string> = {
      '1-3-months': '1-3 months',
      '3-6-months': '3-6 months',
      '6-12-months': '6-12 months',
      '12-24-months': '12-24 months',
    };

    const baseOverview = `This comprehensive marketing strategy for ${input.businessName} outlines a ${timeframeMap[input.timeframe]} roadmap to achieve ${input.marketingObjectives.join(', ').toLowerCase()} objectives in the ${input.industry} industry. As a ${input.companyStage.toLowerCase()} ${input.businessType} company operating in a ${input.competitiveLandscape.toLowerCase().replace('_', ' ')} market, the strategy leverages a ${input.brandPositioning.toLowerCase()} positioning to capture ${input.geographicScope.toLowerCase()} market opportunities.`;

    const paidOverview = isPaid
      ? `${baseOverview} This premium strategy includes deep-dive analysis into market dynamics, granular channel tactics, and a sophisticated measurement framework designed to maximize ROI and accelerate growth velocity.`
      : baseOverview;

    const baseRecommendations = [
      `Focus on ${input.primaryKPI.toLowerCase().replace('_', ' ')} as the primary success metric`,
      `Allocate budget strategically across ${input.preferredChannels?.length || 3} high-impact channels`,
      `Build a ${input.teamSize.toLowerCase().replace('_', ' ')} marketing team with specialized expertise`,
      `Implement a phased approach starting with quick wins in the first 30-60 days`,
      `Establish robust measurement and optimization frameworks from day one`,
    ];

    const paidRecommendations = isPaid ? [
      ...baseRecommendations,
      `Leverage advanced audience segmentation to personalize messaging at scale`,
      `Implement multi-touch attribution to optimize spend efficiency across the funnel`,
      `Develop a content ecosystem that drives organic authority and lead nurturing`,
      `Establish a competitive intelligence program to monitor and counter rival moves`,
      `Integrate marketing technology stack for seamless data flow and automation`,
    ] : baseRecommendations;

    return {
      overview: paidOverview,

      keyRecommendations: paidRecommendations,

      expectedOutcomes: [
        `Achieve measurable improvement in ${input.primaryKPI.toLowerCase().replace('_', ' ')} within ${timeframeMap[input.timeframe]}`,
        `Establish strong brand presence in ${input.geographicScope.toLowerCase()} markets`,
        `Build sustainable competitive advantages in ${input.competitiveLandscape.toLowerCase().replace('_', ' ')} landscape`,
        `Create scalable marketing systems and processes`,
        `Develop deep customer insights and data-driven decision-making capabilities`,
        ...(isPaid ? [
          `Increase customer lifetime value (CLV) through targeted retention strategies`,
          `Reduce customer acquisition costs (CAC) via channel optimization`,
          `Build a proprietary audience data asset for long-term leverage`,
        ] : []),
      ],

      investmentSummary: `Total marketing investment of $${input.budget.toLocaleString()} over ${timeframeMap[input.timeframe]}, with expected ROI of 3-5x based on industry benchmarks for ${input.businessType} companies at the ${input.companyStage.toLowerCase()} stage.${isPaid ? ' Detailed budget allocation and contingency planning included below.' : ''}`,
    };
  }

}
