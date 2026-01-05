/**
 * Credit Service - Forge Sparks Management
 * 
 * Standalone service for Sparks credit management.
 * Handles initialization, deduction, balance checks, and renewals.
 * 
 * IMPORTANT: This is an isolated service that does NOT modify Forge internals.
 * It wraps existing functionality with credit checks.
 */

import { prisma } from '@/lib/prisma';
import { FORGE_TIERS, SPARKS_CONSUMPTION, getSparksCost } from '@/config/subscription-tiers';

// Spark action types matching SPARKS_CONSUMPTION keys
export type SparksAction = keyof typeof SPARKS_CONSUMPTION;

/**
 * Credit operation result
 */
export interface CreditResult {
    success: boolean;
    balance: number;
    sparksUsed?: number;
    error?: string;
}

/**
 * Credit balance summary
 */
export interface CreditBalance {
    sparksBalance: number;
    sparksIncluded: number;
    totalUsed: number;
    forgeTier: string;
    rolloverSparks: number;
}

/**
 * Initialize credits for a user when they subscribe to Forge
 */
export async function initializeCredits(
    userId: string,
    forgeTier: string = 'freelancer'
): Promise<CreditResult> {
    try {
        // Find the tier configuration
        const tier = FORGE_TIERS.find(t => t.id === forgeTier);
        const sparksIncluded = tier?.sparksIncluded || 0;
        const rolloverMonths = tier?.rolloverMonths || 3;

        // Upsert credits record
        const credits = await prisma.forgeCredits.upsert({
            where: { userId },
            update: {
                sparksBalance: sparksIncluded,
                sparksIncluded,
                forgeTier,
                rolloverMonths,
                lastRenewalAt: new Date(),
            },
            create: {
                userId,
                sparksBalance: sparksIncluded,
                sparksIncluded,
                forgeTier,
                rolloverMonths,
                lastRenewalAt: new Date(),
            },
        });

        // Log the initialization in usage ledger
        await prisma.usageLedger.create({
            data: {
                userId,
                product: 'forge',
                action: 'credits_initialized',
                sparksUsed: -sparksIncluded, // Negative = credit added
                description: `Initialized ${forgeTier} tier with ${sparksIncluded} Sparks`,
            },
        });

        return {
            success: true,
            balance: credits.sparksBalance,
        };
    } catch (error) {
        console.error('[CreditService] Error initializing credits:', error);
        return {
            success: false,
            balance: 0,
            error: 'Failed to initialize credits',
        };
    }
}

/**
 * Check if user has sufficient credits for an action
 * Returns true if credits are available, false otherwise
 */
export async function checkCredits(
    userId: string,
    action: SparksAction
): Promise<{ hasCredits: boolean; required: number; balance: number }> {
    try {
        const sparksCost = getSparksCost(action);

        const credits = await prisma.forgeCredits.findUnique({
            where: { userId },
        });

        const balance = credits?.sparksBalance || 0;

        return {
            hasCredits: balance >= sparksCost,
            required: sparksCost,
            balance,
        };
    } catch (error) {
        console.error('[CreditService] Error checking credits:', error);
        return {
            hasCredits: false,
            required: getSparksCost(action),
            balance: 0,
        };
    }
}

/**
 * Deduct credits for a completed action
 * Should be called AFTER successful execution
 */
export async function deductCredits(
    userId: string,
    action: SparksAction,
    referenceId?: string,
    provider?: string,
    metadata?: Record<string, any>
): Promise<CreditResult> {
    try {
        const sparksCost = getSparksCost(action);

        // Get current balance
        const credits = await prisma.forgeCredits.findUnique({
            where: { userId },
        });

        if (!credits) {
            return {
                success: false,
                balance: 0,
                error: 'User has no credit account',
            };
        }

        if (credits.sparksBalance < sparksCost) {
            return {
                success: false,
                balance: credits.sparksBalance,
                error: `Insufficient credits. Required: ${sparksCost}, Available: ${credits.sparksBalance}`,
            };
        }

        // Atomically deduct credits
        const updatedCredits = await prisma.forgeCredits.update({
            where: { userId },
            data: {
                sparksBalance: { decrement: sparksCost },
                totalUsed: { increment: sparksCost },
            },
        });

        // Log the transaction
        await prisma.usageLedger.create({
            data: {
                userId,
                product: 'forge',
                action,
                sparksUsed: sparksCost,
                description: SPARKS_CONSUMPTION[action]?.action || action,
                referenceId,
                provider: provider || SPARKS_CONSUMPTION[action]?.provider,
                metadata: metadata || null,
            },
        });

        return {
            success: true,
            balance: updatedCredits.sparksBalance,
            sparksUsed: sparksCost,
        };
    } catch (error) {
        console.error('[CreditService] Error deducting credits:', error);
        return {
            success: false,
            balance: 0,
            error: 'Failed to deduct credits',
        };
    }
}

/**
 * Get current credit balance for a user
 */
export async function getBalance(userId: string): Promise<CreditBalance | null> {
    try {
        const credits = await prisma.forgeCredits.findUnique({
            where: { userId },
        });

        if (!credits) {
            return null;
        }

        return {
            sparksBalance: credits.sparksBalance,
            sparksIncluded: credits.sparksIncluded,
            totalUsed: credits.totalUsed,
            forgeTier: credits.forgeTier,
            rolloverSparks: credits.rolloverSparks,
        };
    } catch (error) {
        console.error('[CreditService] Error getting balance:', error);
        return null;
    }
}

/**
 * Add credits to a user's balance (for renewals or top-ups)
 */
export async function addCredits(
    userId: string,
    amount: number,
    reason: string = 'manual_credit'
): Promise<CreditResult> {
    try {
        const credits = await prisma.forgeCredits.upsert({
            where: { userId },
            update: {
                sparksBalance: { increment: amount },
                totalPurchased: { increment: amount },
            },
            create: {
                userId,
                sparksBalance: amount,
                totalPurchased: amount,
            },
        });

        // Log the credit addition
        await prisma.usageLedger.create({
            data: {
                userId,
                product: 'forge',
                action: reason,
                sparksUsed: -amount, // Negative = credit added
                description: `Added ${amount} Sparks: ${reason}`,
            },
        });

        return {
            success: true,
            balance: credits.sparksBalance,
        };
    } catch (error) {
        console.error('[CreditService] Error adding credits:', error);
        return {
            success: false,
            balance: 0,
            error: 'Failed to add credits',
        };
    }
}

/**
 * Renew credits for a subscription period
 * Handles rollover logic based on tier settings
 */
export async function renewCredits(userId: string): Promise<CreditResult> {
    try {
        const credits = await prisma.forgeCredits.findUnique({
            where: { userId },
        });

        if (!credits) {
            return {
                success: false,
                balance: 0,
                error: 'User has no credit account',
            };
        }

        // Find tier configuration
        const tier = FORGE_TIERS.find(t => t.id === credits.forgeTier);
        const sparksIncluded = tier?.sparksIncluded || 0;
        const maxRollover = tier?.rolloverMonths || 3;

        // Calculate rollover (up to max months worth)
        const maxRolloverAmount = sparksIncluded * maxRollover;
        const currentRollover = Math.min(credits.sparksBalance, maxRolloverAmount);

        // New balance = fresh allocation + capped rollover
        const newBalance = sparksIncluded + currentRollover;

        const updatedCredits = await prisma.forgeCredits.update({
            where: { userId },
            data: {
                sparksBalance: newBalance,
                rolloverSparks: currentRollover,
                lastRenewalAt: new Date(),
            },
        });

        // Log the renewal
        await prisma.usageLedger.create({
            data: {
                userId,
                product: 'forge',
                action: 'credits_renewed',
                sparksUsed: -sparksIncluded, // Fresh allocation
                description: `Renewed ${sparksIncluded} Sparks + ${currentRollover} rollover`,
            },
        });

        return {
            success: true,
            balance: updatedCredits.sparksBalance,
        };
    } catch (error) {
        console.error('[CreditService] Error renewing credits:', error);
        return {
            success: false,
            balance: 0,
            error: 'Failed to renew credits',
        };
    }
}

/**
 * Pre-execution guard - checks credits before execution
 * Returns a function to call after execution (for deduction)
 */
export async function preExecutionGuard(
    userId: string,
    action: SparksAction
): Promise<{
    allowed: boolean;
    error?: string;
    confirmExecution: (referenceId?: string, provider?: string, metadata?: Record<string, any>) => Promise<CreditResult>;
}> {
    const check = await checkCredits(userId, action);

    if (!check.hasCredits) {
        return {
            allowed: false,
            error: `Insufficient Sparks. Required: ${check.required}, Available: ${check.balance}`,
            confirmExecution: async () => ({
                success: false,
                balance: check.balance,
                error: 'Execution not allowed - insufficient credits',
            }),
        };
    }

    return {
        allowed: true,
        confirmExecution: async (referenceId?: string, provider?: string, metadata?: Record<string, any>) => {
            return deductCredits(userId, action, referenceId, provider, metadata);
        },
    };
}

/**
 * Get usage history for a user
 */
export async function getUsageHistory(
    userId: string,
    limit: number = 50,
    product?: string
): Promise<Array<{
    action: string;
    sparksUsed: number;
    description: string | null;
    createdAt: Date;
}>> {
    try {
        const where: any = { userId };
        if (product) {
            where.product = product;
        }

        const history = await prisma.usageLedger.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                action: true,
                sparksUsed: true,
                description: true,
                createdAt: true,
            },
        });

        return history;
    } catch (error) {
        console.error('[CreditService] Error getting usage history:', error);
        return [];
    }
}
