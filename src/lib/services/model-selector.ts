import { PlanTier } from '@/config/tool-access';

type AITaskType = 'strategy' | 'blog' | 'tool' | 'email' | 'image';

interface ModelConfig {
    model: string;
    maxTokens: number;
    temperature: number;
    cacheTTLHours: number;
}

/**
 * Model Selection Strategy
 * Selects optimal AI model based on task type and user plan
 * Balances cost and quality
 */
export function selectOptimalModel(
    taskType: AITaskType,
    userPlan: PlanTier
): ModelConfig {
    const modelConfigs: Record<AITaskType, Record<PlanTier, ModelConfig>> = {
        // Strategy generation - highest quality for paid users
        strategy: {
            FREE: {
                model: 'gpt-3.5-turbo',
                maxTokens: 2000,
                temperature: 0.7,
                cacheTTLHours: 48 // Cache longer for free users
            },
            PRO: {
                model: 'gpt-4o',
                maxTokens: 4000,
                temperature: 0.7,
                cacheTTLHours: 24
            },
            AGENCY: {
                model: 'gpt-4-turbo-preview',
                maxTokens: 8000,
                temperature: 0.7,
                cacheTTLHours: 12
            },
            ENTERPRISE: {
                model: 'gpt-4-turbo-preview',
                maxTokens: 16000,
                temperature: 0.7,
                cacheTTLHours: 6 // Fresher content for enterprise
            }
        },

        // Blog content generation
        blog: {
            FREE: {
                model: 'gpt-3.5-turbo',
                maxTokens: 1500,
                temperature: 0.8,
                cacheTTLHours: 72
            },
            PRO: {
                model: 'gpt-4o',
                maxTokens: 3000,
                temperature: 0.8,
                cacheTTLHours: 48
            },
            AGENCY: {
                model: 'gpt-4-turbo-preview',
                maxTokens: 4000,
                temperature: 0.8,
                cacheTTLHours: 24
            },
            ENTERPRISE: {
                model: 'gpt-4-turbo-preview',
                maxTokens: 6000,
                temperature: 0.8,
                cacheTTLHours: 12
            }
        },

        // Tool outputs (simpler, faster)
        tool: {
            FREE: {
                model: 'gpt-3.5-turbo',
                maxTokens: 500,
                temperature: 0.5,
                cacheTTLHours: 168 // 1 week - tool outputs rarely change
            },
            PRO: {
                model: 'gpt-3.5-turbo',
                maxTokens: 1000,
                temperature: 0.5,
                cacheTTLHours: 168
            },
            AGENCY: {
                model: 'gpt-4o-mini',
                maxTokens: 1500,
                temperature: 0.5,
                cacheTTLHours: 72
            },
            ENTERPRISE: {
                model: 'gpt-4o',
                maxTokens: 2000,
                temperature: 0.5,
                cacheTTLHours: 24
            }
        },

        // Email content
        email: {
            FREE: {
                model: 'gpt-3.5-turbo',
                maxTokens: 500,
                temperature: 0.7,
                cacheTTLHours: 24
            },
            PRO: {
                model: 'gpt-3.5-turbo',
                maxTokens: 750,
                temperature: 0.7,
                cacheTTLHours: 24
            },
            AGENCY: {
                model: 'gpt-4o',
                maxTokens: 1000,
                temperature: 0.7,
                cacheTTLHours: 12
            },
            ENTERPRISE: {
                model: 'gpt-4o',
                maxTokens: 1500,
                temperature: 0.7,
                cacheTTLHours: 6
            }
        },

        // Image generation (DALL-E)
        image: {
            FREE: {
                model: 'dall-e-3-standard',
                maxTokens: 0,
                temperature: 0,
                cacheTTLHours: 720 // 30 days for images
            },
            PRO: {
                model: 'dall-e-3-hd',
                maxTokens: 0,
                temperature: 0,
                cacheTTLHours: 720
            },
            AGENCY: {
                model: 'dall-e-3-hd',
                maxTokens: 0,
                temperature: 0,
                cacheTTLHours: 720
            },
            ENTERPRISE: {
                model: 'dall-e-3-hd',
                maxTokens: 0,
                temperature: 0,
                cacheTTLHours: 720
            }
        }
    };

    return modelConfigs[taskType]?.[userPlan] || modelConfigs.tool.FREE;
}

/**
 * Estimate token count for a prompt
 * Rough estimate: ~4 characters per token for English
 */
export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

/**
 * Check if a request is likely to be expensive
 * Returns true if the request should be rate limited or require confirmation
 */
export function isExpensiveRequest(
    taskType: AITaskType,
    estimatedInputTokens: number,
    userPlan: PlanTier
): boolean {
    const thresholds: Record<PlanTier, number> = {
        FREE: 1000,
        PRO: 5000,
        AGENCY: 10000,
        ENTERPRISE: 50000
    };

    // Strategy and blog are expected to be longer
    const multiplier = ['strategy', 'blog'].includes(taskType) ? 2 : 1;

    return estimatedInputTokens > (thresholds[userPlan] * multiplier);
}

export default { selectOptimalModel, estimateTokens, isExpensiveRequest };
