/**
 * The Analyser - Usage Tracking Service
 * 
 * Handles:
 * - Credit balance checks
 * - Usage logging
 * - Credit deduction
 * - Balance updates
 */

import { prisma } from '@/lib/prisma';
import {
    ANALYSER_PRICING,
    BILLING_CONFIG,
    calculateOperationCost,
    type AnalyserOperation
} from './pricing';

export interface UsageCheckResult {
    allowed: boolean;
    creditsBalance: number;
    creditsRequired: number;
    message?: string;
}

export interface UsageLogResult {
    success: boolean;
    usageLogId: string;
    creditsDeducted: number;
    newBalance: number;
}

/**
 * Get or create user's credit balance
 */
export async function getOrCreateCredits(userId: string) {
    let credits = await prisma.analyserCredits.findUnique({
        where: { userId },
    });

    if (!credits) {
        // Create new credit record with free signup credits
        credits = await prisma.analyserCredits.create({
            data: {
                userId,
                creditsBalance: BILLING_CONFIG.freeCreditsOnSignup,
                totalPurchased: BILLING_CONFIG.freeCreditsOnSignup,
            },
        });
    }

    return credits;
}

/**
 * Check if user has enough credits for an operation
 */
export async function checkCredits(
    userId: string,
    operation: AnalyserOperation,
    units: number = 1
): Promise<UsageCheckResult> {
    const credits = await getOrCreateCredits(userId);
    const { creditsCost } = calculateOperationCost(operation, units);

    if (credits.creditsBalance >= creditsCost) {
        return {
            allowed: true,
            creditsBalance: credits.creditsBalance,
            creditsRequired: creditsCost,
        };
    }

    return {
        allowed: false,
        creditsBalance: credits.creditsBalance,
        creditsRequired: creditsCost,
        message: `Insufficient credits. You have ${credits.creditsBalance} credits but need ${creditsCost} for this operation.`,
    };
}

/**
 * Log usage and deduct credits atomically
 */
export async function logUsageAndDeductCredits(
    userId: string,
    operation: AnalyserOperation,
    units: number = 1,
    inputPayload?: Record<string, unknown>,
    success: boolean = true,
    errorMessage?: string
): Promise<UsageLogResult> {
    const cost = calculateOperationCost(operation, units);

    // Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
        // Create usage log
        const usageLog = await tx.analyserUsageLog.create({
            data: {
                userId,
                operationType: operation,
                unitsUsed: units,
                apiCostUsd: cost.apiCostUsd,
                markupApplied: cost.markupUsd,
                creditsCost: cost.creditsCost,
                totalBilledUsd: cost.totalUsd,
                inputPayload: inputPayload || {},
                success,
                errorMessage,
            },
        });

        // Deduct credits (only if successful)
        let newBalance = 0;
        if (success) {
            const updated = await tx.analyserCredits.update({
                where: { userId },
                data: {
                    creditsBalance: { decrement: cost.creditsCost },
                    totalUsed: { increment: cost.creditsCost },
                },
            });
            newBalance = updated.creditsBalance;
        } else {
            const current = await tx.analyserCredits.findUnique({ where: { userId } });
            newBalance = current?.creditsBalance || 0;
        }

        return { usageLog, newBalance };
    });

    return {
        success: true,
        usageLogId: result.usageLog.id,
        creditsDeducted: success ? cost.creditsCost : 0,
        newBalance: result.newBalance,
    };
}

/**
 * Add credits to user's balance (after purchase)
 */
export async function addCredits(
    userId: string,
    credits: number,
    razorpayPaymentId?: string
): Promise<{ newBalance: number }> {
    const updated = await prisma.analyserCredits.upsert({
        where: { userId },
        create: {
            userId,
            creditsBalance: credits,
            totalPurchased: credits,
        },
        update: {
            creditsBalance: { increment: credits },
            totalPurchased: { increment: credits },
        },
    });

    // Log the purchase if razorpay payment id provided
    if (razorpayPaymentId) {
        await prisma.analyserCreditPurchase.updateMany({
            where: { razorpayPaymentId },
            data: { status: 'completed' },
        });
    }

    return { newBalance: updated.creditsBalance };
}

/**
 * Get user's usage history
 */
export async function getUsageHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
) {
    const [logs, total] = await Promise.all([
        prisma.analyserUsageLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        }),
        prisma.analyserUsageLog.count({ where: { userId } }),
    ]);

    return { logs, total, limit, offset };
}

/**
 * Get usage summary for a period
 */
export async function getUsageSummary(
    userId: string,
    startDate?: Date,
    endDate?: Date
) {
    const where: Record<string, unknown> = { userId, success: true };

    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) (where.createdAt as Record<string, Date>).gte = startDate;
        if (endDate) (where.createdAt as Record<string, Date>).lte = endDate;
    }

    const logs = await prisma.analyserUsageLog.findMany({ where });

    const summary = {
        totalOperations: logs.length,
        totalCreditsUsed: logs.reduce((sum, log) => sum + log.creditsCost, 0),
        totalApiCostUsd: logs.reduce((sum, log) => sum + log.apiCostUsd, 0),
        totalBilledUsd: logs.reduce((sum, log) => sum + log.totalBilledUsd, 0),
        byOperation: {} as Record<string, { count: number; credits: number }>,
    };

    for (const log of logs) {
        if (!summary.byOperation[log.operationType]) {
            summary.byOperation[log.operationType] = { count: 0, credits: 0 };
        }
        summary.byOperation[log.operationType].count++;
        summary.byOperation[log.operationType].credits += log.creditsCost;
    }

    return summary;
}

/**
 * Check if user should see low credits warning
 */
export async function shouldWarnLowCredits(userId: string): Promise<boolean> {
    const credits = await getOrCreateCredits(userId);
    return credits.creditsBalance < BILLING_CONFIG.minCreditsWarning;
}

export default {
    getOrCreateCredits,
    checkCredits,
    logUsageAndDeductCredits,
    addCredits,
    getUsageHistory,
    getUsageSummary,
    shouldWarnLowCredits,
};
