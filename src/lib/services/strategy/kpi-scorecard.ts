/**
 * KPI Scorecard Generator
 * Creates comprehensive KPI tracking with benchmarks
 */

import OpenAI from 'openai';
import { AICacheService } from '../ai-cache';
import { TokenLogger } from '../token-logger';
import { selectOptimalModel } from '../model-selector';
import type { PlanTier } from '@/config/tool-access';

export interface KPIMetric {
    id: string;
    name: string;
    category: 'awareness' | 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
    description: string;
    formula: string;
    target: string;
    industryBenchmark: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    priority: 'primary' | 'secondary' | 'tertiary';
    trackingMethod: string;
    improvementTips: string[];
}

export interface KPIScorecard {
    metrics: KPIMetric[];
    summary: {
        primaryKPIs: string[];
        northStarMetric: string;
        healthScore: number; // 0-100
    };
    dashboard: {
        topRow: string[]; // 4 primary metrics
        charts: Array<{
            type: 'line' | 'bar' | 'pie' | 'gauge';
            metric: string;
            description: string;
        }>;
    };
    reportingCadence: {
        daily: string[];
        weekly: string[];
        monthly: string[];
        quarterly: string[];
    };
    alertThresholds: Array<{
        metric: string;
        warningThreshold: string;
        criticalThreshold: string;
        action: string;
    }>;
    recommendations: string[];
}

interface KPIInput {
    businessName: string;
    industry: string;
    businessModel: string;
    stage: 'startup' | 'growth' | 'mature';
    primaryGoal: string;
    currentChallenges: string[];
    channels: string[];
    budget: number;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class KPIScorecardGenerator {
    static async generate(
        input: KPIInput,
        userId: string,
        userPlan: PlanTier
    ): Promise<KPIScorecard> {
        const modelConfig = selectOptimalModel('strategy', userPlan);

        const prompt = `
You are a growth marketing expert creating a comprehensive KPI scorecard.

Business: ${input.businessName}
Industry: ${input.industry}
Business Model: ${input.businessModel}
Stage: ${input.stage}
Primary Goal: ${input.primaryGoal}
Current Challenges: ${input.currentChallenges.join(', ')}
Marketing Channels: ${input.channels.join(', ')}
Budget: $${input.budget.toLocaleString()}

Generate a comprehensive KPI scorecard in the following JSON format:
{
  "metrics": [
    {
      "id": "metric-1",
      "name": "Customer Acquisition Cost (CAC)",
      "category": "acquisition",
      "description": "Average cost to acquire one customer",
      "formula": "Total Marketing Spend / New Customers",
      "target": "$50",
      "industryBenchmark": "$75",
      "frequency": "monthly",
      "priority": "primary",
      "trackingMethod": "CRM + Ad platforms",
      "improvementTips": ["Optimize ad targeting", "Improve landing page conversion"]
    }
  ],
  "summary": {
    "primaryKPIs": ["CAC", "LTV", "Conversion Rate", "MRR"],
    "northStarMetric": "The one metric that matters most",
    "healthScore": 75
  },
  "dashboard": {
    "topRow": ["MRR", "CAC", "LTV", "Churn Rate"],
    "charts": [
      {
        "type": "line",
        "metric": "MRR Growth",
        "description": "Monthly recurring revenue over time"
      }
    ]
  },
  "reportingCadence": {
    "daily": ["Website Traffic", "Ad Spend"],
    "weekly": ["Leads", "Conversions"],
    "monthly": ["CAC", "LTV", "Churn"],
    "quarterly": ["Market Share", "NPS"]
  },
  "alertThresholds": [
    {
      "metric": "CAC",
      "warningThreshold": "> $75",
      "criticalThreshold": "> $100",
      "action": "Review ad spend efficiency"
    }
  ],
  "recommendations": ["Start tracking X", "Improve Y by Z%"]
}

Include 12-15 KPIs covering all AARRR funnel stages. Be specific to the industry and business model.
`;

        // Check cache first
        const cached = await AICacheService.get(prompt, modelConfig.model);
        if (cached.hit && cached.response) {
            return JSON.parse(cached.response);
        }

        try {
            const response = await openai.chat.completions.create({
                model: modelConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert growth marketer and analytics specialist. Always respond with valid JSON only.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: modelConfig.maxTokens,
                temperature: modelConfig.temperature,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content || '{}';
            const scorecard = JSON.parse(content) as KPIScorecard;

            // Log token usage
            await TokenLogger.log({
                userId,
                model: modelConfig.model,
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                feature: 'kpi_scorecard'
            });

            // Cache the response
            await AICacheService.set(prompt, modelConfig.model, content, {
                model: modelConfig.model,
                ttlHours: modelConfig.cacheTTLHours
            });

            return scorecard;

        } catch (error) {
            console.error('KPI scorecard generation error:', error);
            throw new Error('Failed to generate KPI scorecard');
        }
    }
}

export default KPIScorecardGenerator;
