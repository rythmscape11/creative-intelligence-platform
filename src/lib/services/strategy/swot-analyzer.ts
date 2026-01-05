/**
 * SWOT Analysis Module
 * Generates comprehensive Strengths, Weaknesses, Opportunities, Threats analysis
 */

import OpenAI from 'openai';
import { AICacheService } from './ai-cache';
import { TokenLogger } from './token-logger';
import { selectOptimalModel } from './model-selector';
import type { PlanTier } from '@/config/tool-access';

export interface SWOTAnalysis {
    strengths: Array<{
        point: string;
        impact: 'high' | 'medium' | 'low';
        actionable: string;
    }>;
    weaknesses: Array<{
        point: string;
        severity: 'high' | 'medium' | 'low';
        mitigation: string;
    }>;
    opportunities: Array<{
        point: string;
        potential: 'high' | 'medium' | 'low';
        strategy: string;
    }>;
    threats: Array<{
        point: string;
        likelihood: 'high' | 'medium' | 'low';
        countermeasure: string;
    }>;
    recommendations: string[];
    overallScore: number; // 0-100
}

interface SWOTInput {
    businessName: string;
    industry: string;
    products: string[];
    targetAudience: string;
    competitors: string[];
    budget: number;
    currentChallenges: string[];
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class SWOTAnalyzer {
    static async generate(
        input: SWOTInput,
        userId: string,
        userPlan: PlanTier
    ): Promise<SWOTAnalysis> {
        const modelConfig = selectOptimalModel('strategy', userPlan);

        const prompt = `
You are a senior marketing strategist conducting a SWOT analysis.

Business: ${input.businessName}
Industry: ${input.industry}
Products/Services: ${input.products.join(', ')}
Target Audience: ${input.targetAudience}
Main Competitors: ${input.competitors.join(', ')}
Marketing Budget: $${input.budget.toLocaleString()}
Current Challenges: ${input.currentChallenges.join(', ')}

Generate a comprehensive SWOT analysis in the following JSON format:
{
  "strengths": [
    {"point": "...", "impact": "high|medium|low", "actionable": "how to leverage this"}
  ],
  "weaknesses": [
    {"point": "...", "severity": "high|medium|low", "mitigation": "how to address this"}
  ],
  "opportunities": [
    {"point": "...", "potential": "high|medium|low", "strategy": "how to capitalize"}
  ],
  "threats": [
    {"point": "...", "likelihood": "high|medium|low", "countermeasure": "defensive strategy"}
  ],
  "recommendations": ["top 5 strategic recommendations"],
  "overallScore": 0-100 (business positioning score)
}

Provide 4-6 items for each SWOT category. Be specific to the industry and business context.
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
                        content: 'You are an expert business strategist. Always respond with valid JSON only, no markdown.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: modelConfig.maxTokens,
                temperature: modelConfig.temperature,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content || '{}';
            const analysis = JSON.parse(content) as SWOTAnalysis;

            // Log token usage
            await TokenLogger.log({
                userId,
                model: modelConfig.model,
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                feature: 'swot_analysis'
            });

            // Cache the response
            await AICacheService.set(prompt, modelConfig.model, content, {
                model: modelConfig.model,
                ttlHours: modelConfig.cacheTTLHours
            });

            return analysis;

        } catch (error) {
            console.error('SWOT analysis error:', error);
            throw new Error('Failed to generate SWOT analysis');
        }
    }
}

export default SWOTAnalyzer;
