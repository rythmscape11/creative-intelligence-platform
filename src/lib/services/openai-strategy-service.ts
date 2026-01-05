
import OpenAI from 'openai';
import { EnhancedStrategyInput } from '../validations/enhanced-strategy';
import { EnhancedStrategyOutput } from './enhanced-strategy-generator';

// Initialize OpenAI client
// Note: This requires OPENAI_API_KEY environment variable
const openai = new OpenAI({
  apiKey: (process.env.OPENAI_API_KEY || '').trim(),
});

export class OpenAIStrategyService {
  /**
   * Generate a comprehensive marketing strategy using OpenAI GPT-4
   */
  static async generateStrategy(input: EnhancedStrategyInput, userId: string, isPaid: boolean = false): Promise<EnhancedStrategyOutput> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Import GovernorService dynamically
    const { GovernorService } = await import('@/lib/governor');

    const systemPrompt = `You are a World-Class Marketing Director with 20+ years of experience at top global agencies (Ogilvy, McKinsey, WPP). 
Your task is to generate a comprehensive, "Director-Level" marketing strategy for a client based on their business inputs.

CRITICAL INSTRUCTIONS:
1. **Be Specific:** Do NOT use generic advice. Tailor every recommendation to the client's specific industry (${input.industry}), business type (${input.businessType}), and stage (${input.companyStage}).
2. **Be Strategic:** Focus on high-impact, actionable insights. Avoid fluff.
3. **Be Realistic:** Consider their budget ($${input.budget}) and team size (${input.teamSize}). Don't recommend TV ads for a startup with $5k budget.
4. **JSON Output:** You must return ONLY a valid JSON object matching the specified schema. No markdown, no explanations outside the JSON.

CLIENT PROFILE:
- Business Name: ${input.businessName}
- Industry: ${input.industry}
- Type: ${input.businessType}
- Stage: ${input.companyStage}
- Market Maturity: ${input.targetMarketMaturity}
- Competitive Landscape: ${input.competitiveLandscape}
- Objectives: ${input.marketingObjectives.join(', ')}
- Primary KPI: ${input.primaryKPI}
- Budget: $${input.budget}
- Timeframe: ${input.timeframe}
- Team Size: ${input.teamSize}
- Brand Positioning: ${input.brandPositioning}
- Target Audience: ${input.targetAudience}
- Challenges: ${input.currentChallenges?.join(', ') || 'None specified'}
${input.competitorInfo ? `- Competitor Info: ${input.competitorInfo}` : ''}
${input.existingMarketing ? `- Existing Marketing: ${input.existingMarketing}` : ''}

OUTPUT SCHEMA (TypeScript Interface):
interface EnhancedStrategyOutput {
  executiveSummary: {
    overview: string; // 2-3 sentences high-level summary
    keyRecommendations: string[]; // 5 strategic bullet points
    expectedOutcomes: string[]; // 5 measurable outcomes
    investmentSummary: string; // Summary of budget and ROI
  };
  situationAnalysis: {
    marketAnalysis: string; // Deep dive into market dynamics
    competitiveAnalysis: string; // Analysis of competitive landscape
    swotAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    keyInsights: string[]; // 3-5 critical strategic insights
  };
  targetAudiencePersonas: Array<{
    name: string; // e.g., "Corporate Clara"
    demographics: string;
    psychographics: string;
    painPoints: string[];
    goals: string[];
    buyingJourney: string[];
    preferredChannels: string[];
    messagingApproach: string;
  }>; // Generate 2-3 personas
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
    smartGoal: string; // Specific, Measurable, Achievable, Relevant, Time-bound
    primaryMetrics: string[];
    targetValues: string[];
    measurementMethod: string;
    timeline: string;
  }>;
  channelStrategy: Array<{
    channel: string;
    rationale: string;
    tactics: string[]; // Specific actionable tactics
    budgetAllocation: number; // Dollar amount
    budgetPercentage: number; // Percentage of total budget
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
    awareness: StageStrategy;
    consideration: StageStrategy;
    decision: StageStrategy;
    retention: StageStrategy;
    advocacy: StageStrategy;
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
    likelihood: string; // Low, Medium, High
    impact: string; // Low, Medium, High
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
      priority: string; // Essential, Recommended, Optional
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
    organizationalChart: string; // Text description
    trainingNeeds: string[];
  };
  quickWins: {
    thirtyDays: QuickWinAction[];
    sixtyDays: QuickWinAction[];
    ninetyDays: QuickWinAction[];
  };
  appendix: {
    glossary: Array<{ term: string; definition: string }>;
    resources: string[];
    benchmarks: Array<{ metric: string; industryAverage: string; topPerformers: string; yourTarget: string }>;
  };
}

interface StageStrategy {
  stage: string;
  customerMindset: string;
  marketingActivities: string[];
  contentTypes: string[];
  channels: string[];
  metrics: string[];
}

interface QuickWinAction {
  action: string;
  expectedImpact: string;
  effort: string; // Low, Medium, High
  resources: string[];
}
`;

    try {
      const model = "gpt-4o";
      const completion = await openai.chat.completions.create({
        model: model, // Use GPT-4o for best balance of intelligence and speed
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the marketing strategy JSON." }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7, // Creative but structured
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('OpenAI returned empty content');
      }

      // Track usage
      if (completion.usage) {
        await GovernorService.trackUsage(
          userId,
          model,
          completion.usage.prompt_tokens,
          completion.usage.completion_tokens,
          'enhanced-strategy-generator'
        );
      }

      const parsedOutput = JSON.parse(content) as EnhancedStrategyOutput;
      return parsedOutput;

    } catch (error) {
      console.error('OpenAI Strategy Generation Failed:', error);
      throw error;
    }
  }
}
