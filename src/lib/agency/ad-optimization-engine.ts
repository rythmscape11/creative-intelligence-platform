/**
 * Ad Optimization Engine
 * Handles both rule-based and AI-driven ad optimization
 */

import { prisma } from '@/lib/prisma';
import { OptimizationMode } from '@prisma/client';

export interface OptimizationRule {
    id?: string;
    name: string;
    triggerType: TriggerType;
    triggerOperator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS';
    triggerValue: number;
    actionType: ActionType;
    actionValue?: string;
}

export type TriggerType =
    | 'CPC_THRESHOLD'
    | 'CTR_THRESHOLD'
    | 'ROAS_THRESHOLD'
    | 'BUDGET_SPENT_PERCENT'
    | 'IMPRESSIONS_THRESHOLD'
    | 'CONVERSIONS_THRESHOLD';

export type ActionType =
    | 'PAUSE_AD'
    | 'RESUME_AD'
    | 'INCREASE_BUDGET'
    | 'DECREASE_BUDGET'
    | 'NOTIFY'
    | 'CHANGE_BID';

export interface AdMetrics {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    budget: number;
    spentAmount: number;
}

export interface AIRecommendation {
    type: 'BUDGET' | 'TARGETING' | 'CREATIVE' | 'SCHEDULE';
    confidence: number;
    suggestion: string;
    expectedImpact: string;
    action?: Record<string, unknown>;
}

// Default optimization rule templates
export const RULE_TEMPLATES: OptimizationRule[] = [
    {
        name: 'Pause Low CTR Ads',
        triggerType: 'CTR_THRESHOLD',
        triggerOperator: 'LESS_THAN',
        triggerValue: 0.5,
        actionType: 'PAUSE_AD',
    },
    {
        name: 'Pause High CPC Ads',
        triggerType: 'CPC_THRESHOLD',
        triggerOperator: 'GREATER_THAN',
        triggerValue: 5.0,
        actionType: 'PAUSE_AD',
    },
    {
        name: 'Boost High ROAS Ads',
        triggerType: 'ROAS_THRESHOLD',
        triggerOperator: 'GREATER_THAN',
        triggerValue: 3.0,
        actionType: 'INCREASE_BUDGET',
        actionValue: '20', // 20% increase
    },
    {
        name: 'Reduce Low ROAS Budget',
        triggerType: 'ROAS_THRESHOLD',
        triggerOperator: 'LESS_THAN',
        triggerValue: 1.0,
        actionType: 'DECREASE_BUDGET',
        actionValue: '30', // 30% decrease
    },
    {
        name: 'Budget Alert at 80%',
        triggerType: 'BUDGET_SPENT_PERCENT',
        triggerOperator: 'GREATER_THAN',
        triggerValue: 80,
        actionType: 'NOTIFY',
    },
];

export class AdOptimizationEngine {
    // ============================================
    // RULE-BASED OPTIMIZATION
    // ============================================

    /**
     * Evaluate a single rule against ad metrics
     */
    static evaluateRule(rule: OptimizationRule, metrics: AdMetrics): boolean {
        let metricValue: number;

        switch (rule.triggerType) {
            case 'CPC_THRESHOLD':
                metricValue = metrics.cpc;
                break;
            case 'CTR_THRESHOLD':
                metricValue = metrics.ctr;
                break;
            case 'ROAS_THRESHOLD':
                metricValue = metrics.roas;
                break;
            case 'BUDGET_SPENT_PERCENT':
                metricValue = metrics.budget > 0 ? (metrics.spentAmount / metrics.budget) * 100 : 0;
                break;
            case 'IMPRESSIONS_THRESHOLD':
                metricValue = metrics.impressions;
                break;
            case 'CONVERSIONS_THRESHOLD':
                metricValue = metrics.conversions;
                break;
            default:
                return false;
        }

        switch (rule.triggerOperator) {
            case 'GREATER_THAN':
                return metricValue > rule.triggerValue;
            case 'LESS_THAN':
                return metricValue < rule.triggerValue;
            case 'EQUALS':
                return Math.abs(metricValue - rule.triggerValue) < 0.001;
            default:
                return false;
        }
    }

    /**
     * Execute action for a triggered rule
     */
    static async executeAction(adId: string, rule: OptimizationRule): Promise<{ success: boolean; action: string }> {
        const ad = await prisma.platformAd.findUnique({ where: { id: adId } });
        if (!ad) return { success: false, action: 'Ad not found' };

        switch (rule.actionType) {
            case 'PAUSE_AD':
                await prisma.platformAd.update({
                    where: { id: adId },
                    data: { status: 'PAUSED' },
                });
                return { success: true, action: `Ad paused due to ${rule.name}` };

            case 'RESUME_AD':
                await prisma.platformAd.update({
                    where: { id: adId },
                    data: { status: 'ACTIVE' },
                });
                return { success: true, action: `Ad resumed due to ${rule.name}` };

            case 'INCREASE_BUDGET':
                const increasePercent = parseFloat(rule.actionValue || '10') / 100;
                await prisma.platformAd.update({
                    where: { id: adId },
                    data: { budget: ad.budget * (1 + increasePercent) },
                });
                return { success: true, action: `Budget increased by ${rule.actionValue}% due to ${rule.name}` };

            case 'DECREASE_BUDGET':
                const decreasePercent = parseFloat(rule.actionValue || '10') / 100;
                await prisma.platformAd.update({
                    where: { id: adId },
                    data: { budget: ad.budget * (1 - decreasePercent) },
                });
                return { success: true, action: `Budget decreased by ${rule.actionValue}% due to ${rule.name}` };

            case 'NOTIFY':
                // TODO: Send notification via notification service
                console.log(`[Optimization] Notification: ${rule.name} triggered for ad ${adId}`);
                return { success: true, action: `Notification sent: ${rule.name}` };

            default:
                return { success: false, action: 'Unknown action type' };
        }
    }

    /**
     * Run rule-based optimization for an ad
     */
    static async runRuleOptimization(adId: string): Promise<string[]> {
        const ad = await prisma.platformAd.findUnique({ where: { id: adId } });
        if (!ad || ad.optimizationMode !== 'RULE_BASED') {
            return [];
        }

        const rules: OptimizationRule[] = JSON.parse(ad.optimizationRules || '[]');
        const metrics: AdMetrics = {
            impressions: ad.impressions,
            clicks: ad.clicks,
            conversions: ad.conversions,
            ctr: ad.ctr,
            cpc: ad.cpc,
            cpm: ad.cpm,
            roas: ad.roas,
            budget: ad.budget,
            spentAmount: ad.spentAmount,
        };

        const actions: string[] = [];

        for (const rule of rules) {
            if (this.evaluateRule(rule, metrics)) {
                const result = await this.executeAction(adId, rule);
                if (result.success) {
                    actions.push(result.action);
                }
            }
        }

        await prisma.platformAd.update({
            where: { id: adId },
            data: { lastOptimizedAt: new Date() },
        });

        return actions;
    }

    // ============================================
    // AI-DRIVEN OPTIMIZATION
    // ============================================

    /**
     * Generate AI recommendations for an ad
     */
    static async generateAIRecommendations(adId: string): Promise<AIRecommendation[]> {
        const ad = await prisma.platformAd.findUnique({ where: { id: adId } });
        if (!ad) return [];

        const recommendations: AIRecommendation[] = [];

        // Budget optimization based on performance
        if (ad.roas > 2.5 && ad.spentAmount < ad.budget * 0.5) {
            recommendations.push({
                type: 'BUDGET',
                confidence: 0.85,
                suggestion: 'Increase daily budget by 25% to capture more high-ROAS conversions',
                expectedImpact: '+15-20% conversions',
                action: { type: 'INCREASE_BUDGET', value: 25 },
            });
        }

        if (ad.roas < 1.0 && ad.spentAmount > ad.budget * 0.3) {
            recommendations.push({
                type: 'BUDGET',
                confidence: 0.9,
                suggestion: 'Reduce budget by 30% and optimize targeting before spending more',
                expectedImpact: 'Save 30% budget, improve efficiency',
                action: { type: 'DECREASE_BUDGET', value: 30 },
            });
        }

        // CTR optimization
        if (ad.ctr < 0.5 && ad.impressions > 1000) {
            recommendations.push({
                type: 'CREATIVE',
                confidence: 0.75,
                suggestion: 'Low CTR detected. Consider testing new ad creatives or headlines',
                expectedImpact: '+50-100% CTR improvement',
            });
        }

        // CPC optimization
        if (ad.cpc > 3.0) {
            recommendations.push({
                type: 'TARGETING',
                confidence: 0.8,
                suggestion: 'High CPC detected. Refine audience targeting to reduce competition',
                expectedImpact: '-20-40% CPC reduction',
            });
        }

        // Schedule optimization
        if (ad.impressions > 5000 && ad.conversions < 10) {
            recommendations.push({
                type: 'SCHEDULE',
                confidence: 0.7,
                suggestion: 'Consider dayparting - run ads only during peak conversion hours',
                expectedImpact: '+30% conversion rate',
            });
        }

        // Store recommendations
        await prisma.platformAd.update({
            where: { id: adId },
            data: {
                aiRecommendations: JSON.stringify(recommendations),
                lastOptimizedAt: new Date(),
            },
        });

        return recommendations;
    }

    /**
     * Apply an AI recommendation
     */
    static async applyRecommendation(adId: string, recommendationIndex: number): Promise<{ success: boolean; message: string }> {
        const ad = await prisma.platformAd.findUnique({ where: { id: adId } });
        if (!ad) return { success: false, message: 'Ad not found' };

        const recommendations: AIRecommendation[] = JSON.parse(ad.aiRecommendations || '[]');
        const recommendation = recommendations[recommendationIndex];

        if (!recommendation || !recommendation.action) {
            return { success: false, message: 'Recommendation not found or not actionable' };
        }

        // Apply the action
        const action = recommendation.action as { type: string; value: number };

        if (action.type === 'INCREASE_BUDGET') {
            await prisma.platformAd.update({
                where: { id: adId },
                data: { budget: ad.budget * (1 + action.value / 100) },
            });
        } else if (action.type === 'DECREASE_BUDGET') {
            await prisma.platformAd.update({
                where: { id: adId },
                data: { budget: ad.budget * (1 - action.value / 100) },
            });
        }

        return { success: true, message: `Applied: ${recommendation.suggestion}` };
    }

    /**
     * Get optimization rule templates
     */
    static getTemplates(): OptimizationRule[] {
        return RULE_TEMPLATES;
    }
}

export default AdOptimizationEngine;
