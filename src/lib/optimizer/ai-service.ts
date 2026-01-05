import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
// This prevents build errors when the key isn't present
const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

// Types for optimization
export interface CampaignData {
    id: string;
    name: string;
    platform: string;
    dailyBudget: number;
    spend: number;
    revenue: number;
    conversions: number;
    clicks: number;
    impressions: number;
    roas: number;
    cpa: number;
    ctr: number;
}

export interface BudgetOptimization {
    campaignId: string;
    campaignName: string;
    currentBudget: number;
    suggestedBudget: number;
    changePercent: number;
    reason: string;
    projectedImpact: {
        metric: string;
        change: number;
    };
    confidence: number;
}

export interface CreativeAnalysis {
    adId: string;
    performanceScore: number;
    fatigueScore: number;
    suggestions: string[];
    hooks: {
        type: string;
        effectiveness: number;
    }[];
    sentiment: number;
}

export interface OptimizationSuggestion {
    type: string;
    category: string;
    title: string;
    description: string;
    priority: number;
    impactValue: number;
    confidence: number;
    action: {
        type: string;
        targetId: string;
        params: Record<string, any>;
    };
}

/**
 * OptimizerAIService - AI-powered campaign optimization using OpenAI
 * Runs within Next.js without requiring a separate Python service
 */
export class OptimizerAIService {
    /**
     * Generate budget reallocation suggestions based on campaign performance
     */
    static async optimizeBudgets(
        campaigns: CampaignData[],
        totalBudget: number,
        objective: 'ROAS' | 'CPA' | 'CONVERSIONS' = 'ROAS'
    ): Promise<BudgetOptimization[]> {
        try {
            const openai = getOpenAI();
            if (!openai) {
                console.log('[OptimizerAI] No API key, using fallback');
                return this.fallbackBudgetOptimization(campaigns, totalBudget);
            }

            const campaignSummary = campaigns.map(c => ({
                id: c.id,
                name: c.name,
                budget: c.dailyBudget,
                spend: c.spend,
                roas: c.roas,
                cpa: c.cpa,
                conversions: c.conversions,
            }));

            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert digital advertising optimizer. Analyze campaign performance data and suggest optimal budget allocations.

Your task:
1. Identify top performing campaigns (high ROAS, low CPA)
2. Identify underperforming campaigns
3. Suggest budget reallocation to maximize ${objective}
4. Provide confidence scores and projected impact

Respond in valid JSON only, no markdown.`
                    },
                    {
                        role: 'user',
                        content: `Analyze these campaigns and suggest budget optimizations. Total daily budget: $${totalBudget}. Optimization objective: ${objective}

Campaign Data:
${JSON.stringify(campaignSummary, null, 2)}

Respond with JSON array of optimizations:
[{
  "campaignId": "string",
  "campaignName": "string",
  "currentBudget": number,
  "suggestedBudget": number,
  "changePercent": number,
  "reason": "string explaining the change",
  "projectedImpact": { "metric": "${objective.toLowerCase()}", "change": number_percentage },
  "confidence": number_0_to_1
}]`
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000,
            });

            const content = response.choices[0]?.message?.content || '[]';
            const optimizations = JSON.parse(content);
            return optimizations;
        } catch (error) {
            console.error('[OptimizerAI] Budget optimization error:', error);
            // Return rule-based fallback
            return this.fallbackBudgetOptimization(campaigns, totalBudget);
        }
    }

    /**
     * Fallback rule-based budget optimization when AI is unavailable
     */
    private static fallbackBudgetOptimization(
        campaigns: CampaignData[],
        totalBudget: number
    ): BudgetOptimization[] {
        const sorted = [...campaigns].sort((a, b) => b.roas - a.roas);
        const results: BudgetOptimization[] = [];

        for (const campaign of sorted) {
            let suggestedBudget = campaign.dailyBudget;
            let reason = '';
            let change = 0;

            if (campaign.roas >= 3) {
                // Scale winners
                suggestedBudget = Math.min(campaign.dailyBudget * 1.3, totalBudget * 0.4);
                reason = 'High ROAS performer - scaling budget by 30%';
                change = 0.3;
            } else if (campaign.roas >= 2) {
                // Maintain good performers
                suggestedBudget = campaign.dailyBudget * 1.1;
                reason = 'Good performance - modest 10% increase';
                change = 0.1;
            } else if (campaign.roas < 1) {
                // Cut losers
                suggestedBudget = campaign.dailyBudget * 0.5;
                reason = 'Below breakeven ROAS - reducing budget by 50%';
                change = -0.5;
            }

            results.push({
                campaignId: campaign.id,
                campaignName: campaign.name,
                currentBudget: campaign.dailyBudget,
                suggestedBudget: Math.round(suggestedBudget),
                changePercent: change * 100,
                reason,
                projectedImpact: {
                    metric: 'roas',
                    change: change * campaign.roas * 0.1,
                },
                confidence: 0.7,
            });
        }

        return results;
    }

    /**
     * Analyze creative performance and detect fatigue
     */
    static async analyzeCreative(creative: {
        id: string;
        headline?: string;
        description?: string;
        format: string;
        impressions: number;
        clicks: number;
        conversions: number;
        frequency: number;
        ctrTrend: number[]; // Last 7 days CTR
    }): Promise<CreativeAnalysis> {
        try {
            const openai = getOpenAI();
            if (!openai) {
                throw new Error('No OpenAI API key');
            }

            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are a creative performance analyst. Analyze ad creative effectiveness and provide actionable insights.

Evaluate:
1. Performance score (0-100) based on CTR, conversion rate
2. Fatigue score (0-100) based on frequency and CTR decline
3. Hook effectiveness
4. Improvement suggestions

Respond in valid JSON only.`
                    },
                    {
                        role: 'user',
                        content: `Analyze this creative:
${JSON.stringify(creative, null, 2)}

Respond with JSON:
{
  "adId": "${creative.id}",
  "performanceScore": number_0_to_100,
  "fatigueScore": number_0_to_100,
  "suggestions": ["string array of improvements"],
  "hooks": [{ "type": "PROBLEM|BENEFIT|CURIOSITY|SOCIAL_PROOF", "effectiveness": number_0_to_1 }],
  "sentiment": number_-1_to_1
}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });

            const content = response.choices[0]?.message?.content || '{}';
            return JSON.parse(content);
        } catch (error) {
            console.error('[OptimizerAI] Creative analysis error:', error);
            // Return rule-based analysis
            const ctrDecline = creative.ctrTrend.length > 1
                ? (creative.ctrTrend[0] - creative.ctrTrend[creative.ctrTrend.length - 1]) / creative.ctrTrend[0]
                : 0;

            return {
                adId: creative.id,
                performanceScore: Math.min(100, (creative.clicks / creative.impressions) * 1000),
                fatigueScore: Math.min(100, creative.frequency * 15 + ctrDecline * 100),
                suggestions: creative.frequency > 3
                    ? ['Creative showing fatigue - consider refreshing visuals', 'Test new headline variations']
                    : ['Performance stable - monitor for next 7 days'],
                hooks: [{ type: 'UNKNOWN', effectiveness: 0.5 }],
                sentiment: 0,
            };
        }
    }

    /**
     * Generate optimization suggestions from campaign data
     */
    static async generateSuggestions(
        campaigns: CampaignData[],
        userId: string
    ): Promise<OptimizationSuggestion[]> {
        try {
            const openai = getOpenAI();
            if (!openai) {
                console.log('[OptimizerAI] No API key, using fallback');
                return this.fallbackSuggestions(campaigns);
            }

            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI campaign optimization assistant. Generate actionable optimization suggestions.

Types of suggestions:
- BUDGET_INCREASE: Scale high performers
- BUDGET_DECREASE: Cut low performers
- PAUSE_LOSER: Pause campaigns with consistent losses
- SCALE_WINNER: Aggressively scale top campaigns
- CREATIVE_FATIGUE: Refresh tired creatives
- BID_ADJUST: Optimize bidding strategy

Prioritize by potential impact. Respond in valid JSON only.`
                    },
                    {
                        role: 'user',
                        content: `Generate optimization suggestions for these campaigns:
${JSON.stringify(campaigns.map(c => ({
                            id: c.id,
                            name: c.name,
                            platform: c.platform,
                            spend: c.spend,
                            roas: c.roas,
                            cpa: c.cpa,
                            conversions: c.conversions,
                        })), null, 2)}

Respond with JSON array (max 5 suggestions, highest priority first):
[{
  "type": "BUDGET_INCREASE|BUDGET_DECREASE|PAUSE_LOSER|SCALE_WINNER|CREATIVE_FATIGUE|BID_ADJUST",
  "category": "BUDGET|PERFORMANCE|CREATIVE|AUDIENCE",
  "title": "Short action title",
  "description": "Detailed explanation",
  "priority": number_0_to_100,
  "impactValue": number_projected_improvement_percentage,
  "confidence": number_0_to_1,
  "action": {
    "type": "ADJUST_BUDGET|PAUSE_CAMPAIGN|ACTIVATE_CAMPAIGN",
    "targetId": "campaign_id",
    "params": { "budgetChange": percent_or_absolute }
  }
}]`
                    }
                ],
                temperature: 0.4,
                max_tokens: 2000,
            });

            const content = response.choices[0]?.message?.content || '[]';
            return JSON.parse(content);
        } catch (error) {
            console.error('[OptimizerAI] Suggestion generation error:', error);
            return this.fallbackSuggestions(campaigns);
        }
    }

    /**
     * Fallback rule-based suggestions
     */
    private static fallbackSuggestions(campaigns: CampaignData[]): OptimizationSuggestion[] {
        const suggestions: OptimizationSuggestion[] = [];

        for (const campaign of campaigns) {
            if (campaign.roas >= 3 && campaign.spend > 100) {
                suggestions.push({
                    type: 'SCALE_WINNER',
                    category: 'BUDGET',
                    title: `Scale high-performer: ${campaign.name}`,
                    description: `Campaign has ${campaign.roas.toFixed(1)}x ROAS. Consider increasing budget by 25%.`,
                    priority: 90,
                    impactValue: 0.15,
                    confidence: 0.85,
                    action: {
                        type: 'ADJUST_BUDGET',
                        targetId: campaign.id,
                        params: { budgetChange: 0.25 },
                    },
                });
            }

            if (campaign.roas < 1 && campaign.spend > 50) {
                suggestions.push({
                    type: 'PAUSE_LOSER',
                    category: 'PERFORMANCE',
                    title: `Pause underperformer: ${campaign.name}`,
                    description: `Campaign has only ${campaign.roas.toFixed(1)}x ROAS with $${campaign.spend} spend.`,
                    priority: 85,
                    impactValue: 0.10,
                    confidence: 0.9,
                    action: {
                        type: 'PAUSE_CAMPAIGN',
                        targetId: campaign.id,
                        params: {},
                    },
                });
            }
        }

        return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 5);
    }

    /**
     * AI Copilot - Process natural language queries about campaigns
     */
    static async processCopilotQuery(
        query: string,
        context: {
            campaigns: CampaignData[];
            recentActions: string[];
        }
    ): Promise<{
        response: string;
        suggestedActions?: Array<{
            type: string;
            description: string;
            targetId?: string;
        }>;
    }> {
        try {
            const openai = getOpenAI();
            if (!openai) {
                return {
                    response: "AI Copilot is not available. Please configure your OpenAI API key.",
                };
            }

            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI campaign optimization assistant called "The Optimiser Copilot". You help media buyers analyze performance, identify opportunities, and execute optimizations.

You have access to the user's campaign data. Be concise, actionable, and data-driven.

When suggesting actions, format them clearly. If the user asks to perform an action, provide the action in the suggestedActions array.

Respond in JSON format:
{
  "response": "Your conversational response with markdown formatting",
  "suggestedActions": [{ "type": "ACTION_TYPE", "description": "What this does", "targetId": "campaign_id_if_applicable" }]
}`
                    },
                    {
                        role: 'user',
                        content: `Campaign Data:
${JSON.stringify(context.campaigns.map(c => ({
                            name: c.name,
                            platform: c.platform,
                            spend: c.spend,
                            roas: c.roas,
                            cpa: c.cpa,
                            conversions: c.conversions,
                        })), null, 2)}

Recent Actions:
${context.recentActions.join('\n')}

User Query: ${query}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500,
            });

            const content = response.choices[0]?.message?.content || '{}';
            return JSON.parse(content);
        } catch (error) {
            console.error('[OptimizerAI] Copilot error:', error);
            return {
                response: "I'm having trouble processing that request. Could you try rephrasing your question?",
            };
        }
    }
}

export default OptimizerAIService;
