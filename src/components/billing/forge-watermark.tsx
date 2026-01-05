/**
 * Forge Watermark Overlay
 * 
 * Adds a watermark to Forge-generated images for FREE users.
 * Paid users see clean output.
 */

'use client';

import React from 'react';
import { useSubscription } from '@/components/billing/subscription-provider';

interface ForgeWatermarkProps {
    children: React.ReactNode;
    imageUrl?: string;
}

export function ForgeWatermark({ children, imageUrl }: ForgeWatermarkProps) {
    const { tier, checkFeature } = useSubscription();

    // Paid users get clean output
    if (checkFeature('export')) {
        return <>{children}</>;
    }

    // FREE users get watermarked output
    return (
        <div className="relative">
            {children}

            {/* Watermark overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Diagonal watermark pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="absolute transform -rotate-45 whitespace-nowrap text-black/10 dark:text-white/10 font-bold text-4xl"
                        style={{
                            fontSize: '2rem',
                            letterSpacing: '0.5em',
                        }}
                    >
                        AUREON ONE • FREE TIER • AUREON ONE • FREE TIER
                    </div>
                </div>

                {/* Badge in corner */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    <span className="opacity-80">Upgrade to remove watermark</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Sparks Balance Display
 * 
 * Shows current Sparks balance for Forge users.
 */
export function SparksBalance({
    balance,
    showLabel = true,
    size = 'default',
}: {
    balance: number;
    showLabel?: boolean;
    size?: 'sm' | 'default' | 'lg';
}) {
    const sizeClasses = {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg font-semibold',
    };

    const formatSparks = (n: number) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
        return n.toString();
    };

    return (
        <div className={`flex items-center gap-1.5 ${sizeClasses[size]}`}>
            <span className="text-yellow-500">⚡</span>
            <span className="font-medium">{formatSparks(balance)}</span>
            {showLabel && <span className="text-gray-500 dark:text-gray-400">Sparks</span>}
        </div>
    );
}

/**
 * Sparks Usage Indicator
 * 
 * Shows how many Sparks an action will consume.
 */
export function SparksUsageIndicator({
    cost,
    balance,
    action,
}: {
    cost: number;
    balance: number;
    action: string;
}) {
    const hasEnough = balance >= cost;

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${hasEnough
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
            <span className="text-yellow-500">⚡</span>
            <span>{cost} Sparks</span>
            {!hasEnough && (
                <span className="text-xs opacity-75">(insufficient)</span>
            )}
        </div>
    );
}

/**
 * Low Sparks Warning Banner
 */
export function LowSparksWarning({
    balance,
    threshold = 500,
}: {
    balance: number;
    threshold?: number;
}) {
    if (balance > threshold) return null;

    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                        Low Sparks Balance
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        You have {balance} Sparks remaining. Consider upgrading your plan for more monthly Sparks.
                    </p>
                    <a
                        href="/pricing"
                        className="inline-block mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:underline"
                    >
                        View Plans →
                    </a>
                </div>
            </div>
        </div>
    );
}
