/**
 * OpenAI Client Configuration and Service
 *
 * This module provides a configured OpenAI client and utility functions
 * for AI-powered marketing strategy generation.
 */

import OpenAI from 'openai';
import { EnterpriseStrategyPlan } from '@/types';
import { ApiConfigService } from '@/lib/services/api-config.service';

// Check if we're in a server environment
const isServerEnvironment = typeof window === 'undefined';

// Cache for OpenAI client instance
let cachedOpenAIClient: OpenAI | null = null;
let cachedApiKey: string | null = null;

/**
 * Get OpenAI client with dynamic API key from database or environment
 */
async function getOpenAIClient(): Promise<OpenAI | null> {
  if (!isServerEnvironment) {
    return null;
  }

  const apiKey = await ApiConfigService.getApiKey('OPENAI_API_KEY');

  // If API key changed, create new client
  if (apiKey && apiKey !== cachedApiKey) {
    cachedApiKey = apiKey;
    cachedOpenAIClient = new OpenAI({
      apiKey: apiKey.trim(),
    });
  }

  // Return cached client or create one with fallback
  if (!cachedOpenAIClient && apiKey) {
    cachedOpenAIClient = new OpenAI({
      apiKey: apiKey.trim(),
    });
  }

  return cachedOpenAIClient;
}


export interface AIStrategyRequest {
  businessName: string;
  industry: string;
  targetAudience: string;
  budget: number;
  objectives: string[];
  timeframe: string;
  currentChallenges?: string;
  competitorInfo?: string;
  existingMarketing?: string;
}

export interface AIStrategyResponse {
  executiveSummary: string;
  targetAudience: Array<{
    name: string;
    demographics: string;
    psychographics: string;
    painPoints: string[];
    preferredChannels: string[];
  }>;
  marketingChannels: Array<{
    name: string;
    description: string;
    budgetAllocation: number;
    expectedROI: string;
    tactics: string[];
    timeline: string;
  }>;
  contentStrategy: {
    themes: string[];
    contentTypes: Array<{
      type: string;
      description: string;
      frequency: string;
      platforms: string[];
    }>;
    frequency: string;
    distribution: string[];
  };
  timeline: Array<{
    phase: string;
    duration: string;
    activities: string[];
    deliverables: string[];
  }>;
  budget: {
    total: number;
    channels: Array<{
      channel: string;
      amount: number;
      percentage: number;
    }>;
    contingency: number;
  };
  kpis: Array<{
    metric: string;
    target: string;
    measurement: string;
    frequency: string;
  }>;
  recommendations: string[];
  enterprisePlan?: EnterpriseStrategyPlan;
}

/**
 * OpenAI Strategy Generation Service
 */
export class OpenAIStrategyService {
  /**
   * Generate marketing strategy using OpenAI GPT-4
   */
  /**
   * Generate marketing strategy using OpenAI GPT-4
   */
  static async generateStrategy(input: AIStrategyRequest, userId: string): Promise<AIStrategyResponse> {
    try {
      const openai = await getOpenAIClient();
      if (!openai) {
        throw new Error('OpenAI client is not available in this environment.');
      }

      // Import GovernorService dynamically to avoid circular dependencies if any
      const { GovernorService } = await import('@/lib/governor');

      const prompt = this.buildStrategyPrompt(input);
      const model = "gpt-4-turbo-preview";

      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt()
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Track usage
      if (completion.usage) {
        await GovernorService.trackUsage(
          userId,
          model,
          completion.usage.prompt_tokens,
          completion.usage.completion_tokens,
          'strategy-generator-legacy'
        );
      }

      const parsedResponse = JSON.parse(response);
      return this.validateAndFormatResponse(parsedResponse, input);

    } catch (error) {
      console.error('OpenAI strategy generation error:', error);
      throw new Error(`AI strategy generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build the strategy generation prompt
   */
  private static buildStrategyPrompt(input: AIStrategyRequest): string {
    const context = [
      input.currentChallenges && `- Current Challenges: ${input.currentChallenges}`,
      input.competitorInfo && `- Competitive Landscape: ${input.competitorInfo}`,
      input.existingMarketing && `- Existing Marketing Motions: ${input.existingMarketing}`,
    ]
      .filter(Boolean)
      .join('\n');

    return `
Company: ${input.businessName}
Industry: ${input.industry}
Primary Audience Insight: ${input.targetAudience}
Annual Budget: $${input.budget.toLocaleString()}
Planning Horizon: ${input.timeframe}
Enterprise Objectives: ${input.objectives.join(', ')}
${context ? `Context:\n${context}` : ''}

Assume this organization operates across multiple regions and business units with centralized governance and regional execution. Provide globally valid recommendations that highlight North America, Europe, APAC, LATAM, Middle East, and Africa where relevant. Always mention privacy/compliance as "GDPR, CCPA, and equivalent local regulations."
    `.trim();
  }

  /**
   * Get the system prompt for strategy generation
   */
  private static getSystemPrompt(): string {
    return `
You are an enterprise marketing strategist who designs globally valid go-to-market plans for Fortune 500 brands. Create guidance that scales across multiple regions, business units, and governance layers. Never assume a single-country approach and always reference privacy requirements as "GDPR, CCPA, and equivalent local regulations."

Return a JSON object that keeps the legacy keys MediaPlanPro expects ("executiveSummary", "targetAudience", "marketingChannels", "contentStrategy", "timeline", "budget", "kpis", "recommendations") and also includes a required key named "enterprisePlan" that follows this schema:

"enterprisePlan": {
  "executiveSummary": {
    "overview": "1-2 paragraph summary for C-level leaders",
    "globalPriorities": ["3-5 priorities"],
    "investmentRationale": ["items"],
    "expectedImpact": ["items tied to revenue/efficiency/market share"],
    "globalRisks": ["items describing risk and mitigation theme"]
  },
  "marketOverview": {
    "globalSnapshot": "string",
    "keyTrends": ["items"],
    "regions": [
      {
        "region": "North America | Europe | APAC | LATAM | Middle East | Africa | other relevant region",
        "marketMaturity": "string",
        "competitiveIntensity": "string",
        "customerBehavior": "string",
        "opportunities": ["items"],
        "risks": ["items"]
      }
    ]
  },
  "segmentationAndUseCases": {
    "globalSegments": [
      {
        "name": "string",
        "description": "string",
        "regionalNotes": ["language/platform/cultural considerations"],
        "preferredChannels": ["items"]
      }
    ],
    "regionalAdaptations": [
      { "region": "string", "adaptations": ["items"] }
    ],
    "useCases": [
      { "segment": "string", "scenarios": ["top buying scenarios"] }
    ]
  },
  "objectivesAndKPIs": [
    {
      "businessGoal": "Revenue Growth | Market Share | CLV | Profitability | etc.",
      "marketingObjective": "string",
      "primaryKPIs": ["items"],
      "secondaryKPIs": ["items"],
      "leadingIndicators": ["items"],
      "laggingIndicators": ["items"]
    }
  ],
  "governanceModel": {
    "executiveSponsors": ["titles"],
    "globalMarketingLeads": ["roles"],
    "regionalLeads": ["roles"],
    "crossFunctionalPartners": ["Sales, Product, CS, Legal, Finance, etc."],
    "decisionFramework": "description of centralized vs regional approvals",
    "reviewCadence": ["monthly business review", "quarterly strategic review", "campaign retrospectives"]
  },
  "resourcingAndBudget": {
    "headcountPlan": [
      { "function": "Demand Gen | Content | Paid Media | Marketing Ops | Analytics | Regional Leads", "notes": "string" }
    ],
    "partnerStrategy": ["guidance on in-house vs agency/partner mix"],
    "budgetModel": {
      "summary": "string",
      "regionalAllocations": [
        { "region": "string", "percentage": number, "notes": "string" }
      ],
      "channelAllocations": [
        { "channel": "string", "percentage": number, "notes": "string" }
      ],
      "innovationReserve": "string describing % held for experimentation"
    }
  },
  "technologyDataCompliance": {
    "martechStack": [
      { "category": "CRM | Marketing Automation | Analytics/Attribution | CDP/Data Warehouse | Consent/Privacy", "recommendation": "string", "purpose": "string" }
    ],
    "dataFlow": ["step-by-step description of how customer/campaign data moves between systems"],
    "complianceChecklist": ["GDPR, CCPA, and equivalent local regulations", "email/SMS laws (CAN-SPAM and local equivalents)", "industry-specific regulations if relevant"]
  },
  "integratedChannelStrategy": {
    "lifecycleNarrative": "string describing Awareness → Consideration → Decision → Retention/Advocacy orchestration",
    "channels": [
      {
        "channel": "string",
        "role": "string",
        "globalTactics": ["items"],
        "regionalAdaptations": ["items referencing local platforms like WeChat, Line, local marketplaces, etc. where relevant"],
        "keyMetrics": ["items with benchmarks or expectations"],
        "timeToImpact": "string",
        "signalReuse": ["items describing how insights are reused across channels"]
      }
    ]
  },
  "regionalPlaybooks": [
    {
      "region": "string",
      "prioritySegments": ["items"],
      "propositions": ["items"],
      "localizedTactics": ["items"],
      "budgetGuidance": "string (percentage or qualitative guidance)",
      "leadingKPIs": ["items"]
    }
  ],
  "measurementAndOptimization": {
    "globalDashboard": ["items covering ARR, pipeline velocity, CAC, etc."],
    "regionalDashboardGuidelines": ["items"],
    "testAndLearnFramework": ["items describing hypothesis design, control/variant, cadence"],
    "reviewCadence": {
      "monthly": ["actions"],
      "quarterly": ["actions"]
    },
    "reallocationGuidelines": ["items explaining when/how to shift budget across regions/channels"]
  },
  "roadmap90To180": {
    "quickWins90Days": ["items"],
    "initiatives90To180": ["items focused on capability building & scaling wins"],
    "dependencies": ["items covering people, budget, technology"]
  }
}

Populate every list with thoughtful, globally inclusive guidance. Always include multiple regions where applicable and cite compliance as “GDPR, CCPA, and equivalent local regulations.” Ensure the legacy keys remain populated for backward compatibility and that channel budgets still sum to 90% of the total budget with 10% contingency.
    `.trim();
  }

  /**
   * Validate and format the AI response
   */
  private static validateAndFormatResponse(response: any, input: AIStrategyRequest): AIStrategyResponse {
    // Ensure budget consistency
    const totalChannelBudget = response.budget?.channels?.reduce((sum: number, channel: any) => sum + (channel.amount || 0), 0) || 0;
    const contingency = Math.round(input.budget * 0.1);
    const availableBudget = input.budget - contingency;

    // Adjust budget if necessary
    if (Math.abs(totalChannelBudget - availableBudget) > 100) {
      const adjustmentRatio = availableBudget / totalChannelBudget;
      response.budget.channels = response.budget.channels.map((channel: any) => ({
        ...channel,
        amount: Math.round(channel.amount * adjustmentRatio),
        percentage: Math.round((channel.amount * adjustmentRatio / input.budget) * 100)
      }));
    }

    // Ensure total budget matches
    response.budget.total = input.budget;
    response.budget.contingency = contingency;

    // Sync marketing channels budget with budget breakdown
    if (response.marketingChannels && response.budget.channels) {
      response.marketingChannels = response.marketingChannels.map((channel: any) => {
        const budgetChannel = response.budget.channels.find((bc: any) =>
          bc.channel.toLowerCase().includes(channel.name.toLowerCase()) ||
          channel.name.toLowerCase().includes(bc.channel.toLowerCase())
        );

        return {
          ...channel,
          budgetAllocation: budgetChannel?.amount || channel.budgetAllocation || 0
        };
      });
    }

    return response as AIStrategyResponse;
  }

  /**
   * Test OpenAI connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const openai = await getOpenAIClient();
      if (!openai) {
        return false;
      }
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5
      });

      return !!completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  /**
   * Upload a training file for fine-tuning
   * @param fileContent The JSONL content string
   */
  static async uploadTrainingFile(fileContent: string): Promise<string> {
    const openai = await getOpenAIClient();
    if (!openai) throw new Error('OpenAI client not initialized');

    // Create a File object from the string content
    const file = new File([fileContent], 'training_data.jsonl', { type: 'application/jsonl' });

    const response = await openai.files.create({
      file: file,
      purpose: 'fine-tune',
    });

    return response.id;
  }

  /**
   * Create a fine-tuning job
   * @param fileId The ID of the uploaded training file
   */
  static async createFineTuningJob(fileId: string): Promise<string> {
    const openai = await getOpenAIClient();
    if (!openai) throw new Error('OpenAI client not initialized');

    const job = await openai.fineTuning.jobs.create({
      training_file: fileId,
      model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo as the base model
      hyperparameters: {
        n_epochs: 1, // Start with 1 epoch for speed/cost
      }
    });

    return job.id;
  }

  /**
   * List recent fine-tuning jobs
   */
  static async listFineTuningJobs(limit = 5) {
    const openai = await getOpenAIClient();
    if (!openai) throw new Error('OpenAI client not initialized');

    const list = await openai.fineTuning.jobs.list({ limit });
    return list.data;
  }
}

export default OpenAIStrategyService;
