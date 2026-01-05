'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Lock, Zap } from 'lucide-react';

interface UpgradeBannerProps {
    product: 'AGENCY_OS' | 'OPTIMISER' | 'ANALYSER' | 'STRATEGISER';
    feature?: string;
    currentTier?: string;
    requiredTier?: string;
    variant?: 'inline' | 'modal' | 'toast';
}

const productNames = {
    AGENCY_OS: 'Agency OS',
    OPTIMISER: 'The Optimiser',
    ANALYSER: 'The Analyser',
    STRATEGISER: 'The Strategiser',
};

const productColors = {
    AGENCY_OS: 'from-indigo-600 to-indigo-700',
    OPTIMISER: 'from-emerald-600 to-emerald-700',
    ANALYSER: 'from-amber-600 to-amber-700',
    STRATEGISER: 'from-violet-600 to-violet-700',
};

/**
 * Upgrade Banner Component
 * Shows when user tries to access a feature requiring higher tier
 */
export function UpgradeBanner({
    product,
    feature,
    currentTier = 'FREE',
    requiredTier = 'PRO',
    variant = 'inline',
}: UpgradeBannerProps) {
    const productName = productNames[product];
    const gradient = productColors[product];

    if (variant === 'inline') {
        return (
            <div className={`rounded-xl p-6 bg-gradient-to-r ${gradient} text-white`}>
                <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <Lock className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                            {feature ? `Unlock ${feature}` : `Upgrade to ${requiredTier}`}
                        </h3>
                        <p className="text-white/80 text-sm mb-4">
                            {feature
                                ? `This feature requires ${productName} ${requiredTier} plan.`
                                : `Get access to all ${productName} features with ${requiredTier}.`
                            }
                        </p>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                            View Plans <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'toast') {
        return (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-xl flex items-center gap-3">
                <div className={`bg-gradient-to-r ${gradient} p-2 rounded-lg`}>
                    <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                        Upgrade to unlock {feature || 'this feature'}
                    </p>
                </div>
                <Link
                    href="/pricing"
                    className="text-indigo-400 text-sm font-medium hover:text-indigo-300"
                >
                    Upgrade →
                </Link>
            </div>
        );
    }

    // Modal variant
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl max-w-md w-full p-8 text-center">
                <div className={`inline-flex bg-gradient-to-r ${gradient} p-4 rounded-xl mb-6`}>
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Upgrade to {productName} {requiredTier}
                </h2>
                <p className="text-slate-400 mb-6">
                    {feature
                        ? `${feature} is available on ${requiredTier} and above.`
                        : `Unlock all premium features with a ${productName} subscription.`
                    }
                </p>
                <div className="flex gap-3">
                    <button className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                        Maybe Later
                    </button>
                    <Link
                        href="/pricing"
                        className={`flex-1 px-4 py-3 bg-gradient-to-r ${gradient} text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                    >
                        View Plans <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

/**
 * Feature Lock Overlay
 * Wraps a feature with a lock overlay when user doesn't have access
 */
export function FeatureLockOverlay({
    children,
    product,
    feature,
    requiredTier,
    hasAccess = false,
}: {
    children: React.ReactNode;
    product: 'AGENCY_OS' | 'OPTIMISER' | 'ANALYSER' | 'STRATEGISER';
    feature: string;
    requiredTier: string;
    hasAccess?: boolean;
}) {
    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred content */}
            <div className="blur-sm pointer-events-none select-none">
                {children}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                <UpgradeBanner
                    product={product}
                    feature={feature}
                    requiredTier={requiredTier}
                    variant="inline"
                />
            </div>
        </div>
    );
}

/**
 * Soft Upsell Banner
 * Shows at the bottom of features to encourage upgrades
 */
export function SoftUpsellBanner({
    product,
    message,
}: {
    product: 'AGENCY_OS' | 'OPTIMISER' | 'ANALYSER' | 'STRATEGISER';
    message?: string;
}) {
    const productName = productNames[product];

    return (
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <p className="text-slate-300 text-sm">
                    {message || `Want more from ${productName}? Upgrade for advanced features.`}
                </p>
            </div>
            <Link
                href="/pricing"
                className="text-indigo-400 text-sm font-medium hover:text-indigo-300 whitespace-nowrap"
            >
                See Plans →
            </Link>
        </div>
    );
}

/**
 * Usage Limit Indicator
 * Shows remaining usage for metered features
 */
export function UsageLimitIndicator({
    used,
    limit,
    feature,
    product,
}: {
    used: number;
    limit: number;
    feature: string;
    product: 'AGENCY_OS' | 'OPTIMISER' | 'ANALYSER' | 'STRATEGISER';
}) {
    const percentage = (used / limit) * 100;
    const isNearLimit = percentage >= 80;

    return (
        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{feature}</span>
                <span className={`text-sm font-medium ${isNearLimit ? 'text-amber-400' : 'text-slate-300'}`}>
                    {used} / {limit}
                </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all ${isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            {isNearLimit && (
                <p className="mt-2 text-xs text-amber-400">
                    Running low! <Link href="/pricing" className="underline">Upgrade for more</Link>
                </p>
            )}
        </div>
    );
}
