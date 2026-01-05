'use client';

/**
 * Usage Limit Banner
 * 
 * Shows usage status and upgrade prompt when nearing/at limits.
 * Non-intrusive, only shows when relevant.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, X } from 'lucide-react';
import { getLimitMessages, LimitFeature } from '@/lib/limit-messages';
import { PricingTier } from '@/config/pricing';
import { logUpgradeClick, logLimitReached } from '@/lib/monetization-events';

interface UsageLimitBannerProps {
    feature: LimitFeature;
    currentUsage: number;
    plan: PricingTier;
    className?: string;
    dismissible?: boolean;
}

export function UsageLimitBanner({
    feature,
    currentUsage,
    plan,
    className = '',
    dismissible = true,
}: UsageLimitBannerProps) {
    const router = useRouter();
    const [dismissed, setDismissed] = useState(false);
    const [visible, setVisible] = useState(false);

    const messages = getLimitMessages({ feature, currentUsage, plan });

    // Only show if there's a warning or limit reached
    useEffect(() => {
        if (messages.warningMessage || currentUsage >= getLimit(feature, plan)) {
            setVisible(true);

            // Log limit reached if at limit
            if (currentUsage >= getLimit(feature, plan)) {
                logLimitReached(feature, plan, currentUsage, getLimit(feature, plan));
            }
        }
    }, [messages.warningMessage, currentUsage, feature, plan]);

    if (!visible || dismissed) return null;

    const isAtLimit = currentUsage >= getLimit(feature, plan);
    const message = isAtLimit ? messages.reachedMessage : messages.warningMessage;

    const handleUpgradeClick = () => {
        logUpgradeClick(plan, messages.cta.targetPlan, feature);
        router.push('/pricing');
    };

    return (
        <div
            className={`
        relative flex items-center justify-between gap-4 p-4 rounded-lg
        ${isAtLimit
                    ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'}
        ${className}
      `}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isAtLimit ? 'bg-amber-500/20' : 'bg-blue-500/20'}`}>
                    {isAtLimit
                        ? <AlertTriangle className="h-5 w-5 text-amber-600" />
                        : <Zap className="h-5 w-5 text-blue-600" />
                    }
                </div>
                <div>
                    <p className={`font-medium ${isAtLimit ? 'text-amber-800 dark:text-amber-200' : 'text-blue-800 dark:text-blue-200'}`}>
                        {message}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {messages.benefit}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={handleUpgradeClick}
                    size="sm"
                    className={isAtLimit
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-blue-600 hover:bg-blue-700'}
                >
                    {messages.cta.text}
                </Button>

                {dismissible && !isAtLimit && (
                    <button
                        onClick={() => setDismissed(true)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Dismiss"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

/**
 * Get limit value for a feature and plan
 */
function getLimit(feature: LimitFeature, plan: PricingTier): number {
    const limits: Record<PricingTier, Record<LimitFeature, number>> = {
        FREE: {
            strategiesPerMonth: 5,
            pdfExportsPerMonth: 5,
            toolUsesPerSession: 3,
            savedStrategies: 3,
            aiInsightsPerDay: 10,
        },
        PRO: {
            strategiesPerMonth: -1,
            pdfExportsPerMonth: -1,
            toolUsesPerSession: -1,
            savedStrategies: -1,
            aiInsightsPerDay: -1,
        },
        AGENCY: {
            strategiesPerMonth: -1,
            pdfExportsPerMonth: -1,
            toolUsesPerSession: -1,
            savedStrategies: -1,
            aiInsightsPerDay: -1,
        },
        ENTERPRISE: {
            strategiesPerMonth: -1,
            pdfExportsPerMonth: -1,
            toolUsesPerSession: -1,
            savedStrategies: -1,
            aiInsightsPerDay: -1,
        },
    };

    const limit = limits[plan][feature];
    return limit === -1 ? Infinity : limit;
}
