/**
 * Competitive Benchmarking Module
 * Analyzes competitors and provides industry benchmarks
 */

import OpenAI from 'openai';
import { AICacheService } from '../ai-cache';
import { TokenLogger } from '../token-logger';
import { selectOptimalModel } from '../model-selector';
import type { PlanTier } from '@/config/tool-access';

export interface CompetitorProfile {
    name: string;
    strengths: string[];
    weaknesses: string[];
    marketShare: string;
    positioning: string;
    pricingStrategy: string;
    keyDifferentiators: string[];
}

export interface IndustryBenchmark {
    metric: string;
    industryAverage: string;
    topPerformer: string;
    yourEstimate: string;
    gap: string;
    opportunity: 'high' | 'medium' | 'low';
}

export interface CompetitiveBenchmark {
    competitors: CompetitorProfile[];
    industryBenchmarks: IndustryBenchmark[];
    competitivePosition: {
        strengths: string[];
        gaps: string[];
        opportunities: string[];
    };
    recommendations: {
        shortTerm: string[];
        longTerm: string[];
    };
    marketLandscape: {
        totalMarketSize: string;
        growthRate: string;
        keyTrends: string[];
        entryBarriers: string[];
    };
    overallCompetitiveScore: number; // 0-100
}

interface BenchmarkInput {
    businessName: string;
    industry: string;
    products: string[];
    competitors: string[];
    budget: number;
    targetMarket: string;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class CompetitiveBenchmarker {
    static async generate(
        input: BenchmarkInput,
        userId: string,
        userPlan: PlanTier
    ): Promise<CompetitiveBenchmark> {
        const modelConfig = selectOptimalModel('strategy', userPlan);

        const prompt = `
You are a competitive intelligence analyst conducting a comprehensive competitive benchmark.

Business: ${input.businessName}
Industry: ${input.industry}
Products/Services: ${input.products.join(', ')}
Main Competitors: ${input.competitors.join(', ')}
Marketing Budget: $${input.budget.toLocaleString()}
Target Market: ${input.targetMarket}

Generate a comprehensive competitive benchmarking report in the following JSON format:
{
  "competitors": [
    {
      "name": "competitor name",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"],
      "marketShare": "estimated %",
      "positioning": "their market positioning",
      "pricingStrategy": "premium/mid-market/budget",
      "keyDifferentiators": ["what makes them unique"]
    }
  ],
  "industryBenchmarks": [
    {
      "metric": "e.g., Customer Acquisition Cost",
      "industryAverage": "$X",
      "topPerformer": "$Y",
      "yourEstimate": "based on budget, estimate for this business",
      "gap": "difference from top performer",
      "opportunity": "high|medium|low"
    }
  ],
  "competitivePosition": {
    "strengths": ["where this business can win"],
    "gaps": ["where they need improvement"],
    "opportunities": ["market opportunities to exploit"]
  },
  "recommendations": {
    "shortTerm": ["immediate actions (0-3 months)"],
    "longTerm": ["strategic moves (6-12 months)"]
  },
  "marketLandscape": {
    "totalMarketSize": "$XXM/B",
    "growthRate": "X% YoY",
    "keyTrends": ["trend 1", "trend 2"],
    "entryBarriers": ["barrier 1", "barrier 2"]
  },
  "overallCompetitiveScore": 0-100
}

Include at least 3 competitors and 5 industry benchmarks. Be specific and data-driven.
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
                        content: 'You are an expert competitive intelligence analyst. Always respond with valid JSON only.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: modelConfig.maxTokens,
                temperature: modelConfig.temperature,
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content || '{}';
            const benchmark = JSON.parse(content) as CompetitiveBenchmark;

            // Log token usage
            await TokenLogger.log({
                userId,
                model: modelConfig.model,
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                feature: 'competitive_benchmark'
            });

            // Cache the response
            await AICacheService.set(prompt, modelConfig.model, content, {
                model: modelConfig.model,
                ttlHours: modelConfig.cacheTTLHours
            });

            return benchmark;

        } catch (error) {
            console.error('Competitive benchmarking error:', error);
            throw new Error('Failed to generate competitive benchmark');
        }
    }
}

export default CompetitiveBenchmarker;
