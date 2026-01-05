import { prisma } from '@/lib/prisma';

// Cost per 1k tokens (approximate)
// Cost per 1k tokens (approximate)
const COSTS = {
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-turbo-preview': { input: 0.01, output: 0.03 },
    'gpt-4o': { input: 0.005, output: 0.015 }, // Estimated
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'gpt-3.5-turbo-0125': { input: 0.0005, output: 0.0015 },
    'dall-e-3': { input: 0.040, output: 0 }, // Per image (approx $0.04 standard)
};

const HARD_LIMIT_USD = 50.0; // Monthly hard limit

export class GovernorService {
    /**
     * Check if user has exceeded their budget
     */
    static async checkBudget(userId: string): Promise<{ allowed: boolean; currentSpend: number; limit: number }> {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const usage = await prisma.aiUsage.aggregate({
            where: {
                userId,
                timestamp: {
                    gte: startOfMonth,
                },
            },
            _sum: {
                cost: true,
            },
        });

        const currentSpend = usage._sum.cost || 0;

        return {
            allowed: currentSpend < HARD_LIMIT_USD,
            currentSpend,
            limit: HARD_LIMIT_USD,
        };
    }

    /**
     * Track AI usage and cost
     */
    static async trackUsage(
        userId: string,
        model: string,
        tokensInput: number,
        tokensOutput: number,
        feature: string
    ): Promise<void> {
        try {
            const modelCost = COSTS[model as keyof typeof COSTS] || COSTS['gpt-3.5-turbo'];

            // Handle image generation cost (per unit)
            let cost = 0;
            if (model === 'dall-e-3') {
                // For DALL-E, tokensInput is treated as image count
                cost = tokensInput * modelCost.input;
            } else {
                cost = (tokensInput / 1000) * modelCost.input + (tokensOutput / 1000) * modelCost.output;
            }

            await prisma.aiUsage.create({
                data: {
                    userId,
                    model,
                    tokensInput,
                    tokensOutput,
                    cost,
                    feature,
                },
            });
        } catch (error) {
            console.error('Failed to track AI usage:', error);
            // Don't block the main flow if tracking fails
        }
    }

    /**
     * Get comprehensive budget stats for the dashboard
     */
    static async getBudgetStats(userId: string) {
        const { currentSpend, limit } = await this.checkBudget(userId);

        // Simple projection: (currentSpend / daysPassed) * daysInMonth
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const daysPassed = Math.max(1, now.getDate());

        const projectedSpend = (currentSpend / daysPassed) * daysInMonth;

        return {
            totalBudget: limit,
            currentSpend,
            projectedSpend,
            currency: 'USD',
            status: currentSpend > limit * 0.9 ? 'CRITICAL' : currentSpend > limit * 0.7 ? 'WARNING' : 'HEALTHY',
        };
    }
}
