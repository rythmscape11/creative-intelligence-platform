/**
 * Budget Allocation Heatmap Module
 * Visualizes optimal budget distribution across channels
 */

import OpenAI from 'openai';
import { AICacheService } from '../ai-cache';
import { TokenLogger } from '../token-logger';
import { selectOptimalModel } from '../model-selector';
import type { PlanTier } from '@/config/tool-access';

export interface ChannelAllocation {
    channel: string;
    category: 'paid' | 'owned' | 'earned';
    currentAllocation: number; // percentage
    recommendedAllocation: number; // percentage
    roiScore: number; // 1-10
    difficulty: 'easy' | 'medium' | 'hard';
    timeToResults: string;
    monthlyBudget: number;
    expectedReturns: {
        impressions: string;
        clicks: string;
        conversions: string;
        revenue: string;
    };
    optimizationTips: string[];
}

export interface BudgetPhase {
    name: string;
    duration: string;
    focus: string;
    channels: string[];
    budgetSplit: Record<string, number>;
    kpis: string[];
}

export interface BudgetHeatmap {
    totalBudget: number;
    channels: ChannelAllocation[];
    phases: BudgetPhase[];
    heatmapData: Array<{
        channel: string;
        q1: number;
        q2: number;
        q3: number;
        q4: number;
    }>;
    recommendations: {
        increase: string[];
        decrease: string[];
        test: string[];
        discontinue: string[];
    };
    riskAssessment: {
        overallocated: string[];
        underallocated: string[];
        diversificationScore: number; // 0-100
    };
    projectedROI: {
        conservative: string;
        expected: string;
        optimistic: string;
    };
}

interface BudgetInput {
    businessName: string;
    industry: string;
    totalBudget: number;
    currentChannels: string[];
    goals: string[];
    targetAudience: string;
    competitorChannels: string[];
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class BudgetHeatmapGenerator {
    static async generate(
        input: BudgetInput,
        userId: string,
        userPlan: PlanTier
    ): Promise<BudgetHeatmap> {
        const modelConfig = selectOptimalModel('strategy', userPlan);

        const prompt = `
You are a media buying expert creating an optimal budget allocation strategy.

Business: ${input.businessName}
Industry: ${input.industry}
Total Monthly Budget: $${input.totalBudget.toLocaleString()}
Current Channels: ${input.currentChannels.join(', ')}
Marketing Goals: ${input.goals.join(', ')}
Target Audience: ${input.targetAudience}
Competitor Channels: ${input.competitorChannels.join(', ')}

Generate a comprehensive budget allocation heatmap in the following JSON format:
{
  "totalBudget": ${input.totalBudget},
  "channels": [
    {
      "channel": "Google Ads",
      "category": "paid",
      "currentAllocation": 30,
      "recommendedAllocation": 25,
      "roiScore": 8,
      "difficulty": "medium",
      "timeToResults": "1-2 weeks",
      "monthlyBudget": ${Math.round(input.totalBudget * 0.25)},
      "expectedReturns": {
        "impressions": "50,000",
        "clicks": "2,500",
        "conversions": "50",
        "revenue": "$10,000"
      },
      "optimizationTips": ["Focus on high-intent keywords", "Use RLSA"]
    }
  ],
  "phases": [
    {
      "name": "Foundation",
      "duration": "Month 1-2",
      "focus": "Build awareness and test channels",
      "channels": ["Google Ads", "Facebook Ads"],
      "budgetSplit": {"Google Ads": 40, "Facebook Ads": 30, "Content": 30},
      "kpis": ["Impressions", "CTR", "CPC"]
    }
  ],
  "heatmapData": [
    {
      "channel": "Google Ads",
      "q1": 25,
      "q2": 28,
      "q3": 30,
      "q4": 25
    }
  ],
  "recommendations": {
    "increase": ["Channels showing high ROI"],
    "decrease": ["Underperforming channels"],
    "test": ["New opportunities to explore"],
    "discontinue": ["Channels to stop"]
  },
  "riskAssessment": {
    "overallocated": ["Channels with too much spend"],
    "underallocated": ["Channels needing more investment"],
    "diversificationScore": 75
  },
  "projectedROI": {
    "conservative": "2.5x",
    "expected": "3.5x",
    "optimistic": "5x"
  }
}

Include 6-10 channels covering paid, owned, and earned media. Be specific with budget numbers.
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
                        content: 'You are an expert media buyer and budget strategist. Always respond with valid JSON only.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: modelConfig.maxTokens,
                temperature: modelConfig.temperature,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content || '{}';
            const heatmap = JSON.parse(content) as BudgetHeatmap;

            // Log token usage
            await TokenLogger.log({
                userId,
                model: modelConfig.model,
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                feature: 'budget_heatmap'
            });

            // Cache the response
            await AICacheService.set(prompt, modelConfig.model, content, {
                model: modelConfig.model,
                ttlHours: modelConfig.cacheTTLHours
            });

            return heatmap;

        } catch (error) {
            console.error('Budget heatmap generation error:', error);
            throw new Error('Failed to generate budget heatmap');
        }
    }
}

export default BudgetHeatmapGenerator;
