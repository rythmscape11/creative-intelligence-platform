/**
 * Subscription Context and Provider
 * 
 * Client-side context for subscription state.
 * Used by UI components to check feature access.
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PricingTier, PLAN_LIMITS } from '@/config/pricing';

interface SubscriptionState {
    tier: PricingTier;
    isLoading: boolean;
    limits: typeof PLAN_LIMITS.FREE;
    features: {
        canExport: boolean;
        canUseApi: boolean;
        canWhiteLabel: boolean;
        hasUnlimitedStrategies: boolean;
    };
}

interface SubscriptionContextType extends SubscriptionState {
    refresh: () => Promise<void>;
    checkFeature: (feature: string) => boolean;
}

const defaultState: SubscriptionState = {
    tier: 'FREE',
    isLoading: true,
    limits: PLAN_LIMITS.FREE,
    features: {
        canExport: false,
        canUseApi: false,
        canWhiteLabel: false,
        hasUnlimitedStrategies: false,
    },
};

const SubscriptionContext = createContext<SubscriptionContextType>({
    ...defaultState,
    refresh: async () => { },
    checkFeature: () => false,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<SubscriptionState>(defaultState);

    const fetchSubscription = async () => {
        try {
            const response = await fetch('/api/user/subscription');
            if (response.ok) {
                const data = await response.json();
                setState({
                    tier: data.tier || 'FREE',
                    isLoading: false,
                    limits: PLAN_LIMITS[data.tier as PricingTier] || PLAN_LIMITS.FREE,
                    features: data.features || defaultState.features,
                });
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error('[SubscriptionProvider] Error fetching subscription:', error);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const checkFeature = (feature: string): boolean => {
        const tierHierarchy: PricingTier[] = ['FREE', 'PRO', 'AGENCY', 'ENTERPRISE'];
        const currentLevel = tierHierarchy.indexOf(state.tier);

        const featureRequirements: Record<string, number> = {
            export: 1,        // PRO+
            api: 2,           // AGENCY+
            whiteLabel: 2,    // AGENCY+
            teamSeats: 2,     // AGENCY+
            unlimited: 1,     // PRO+
        };

        return currentLevel >= (featureRequirements[feature] ?? 0);
    };

    return (
        <SubscriptionContext.Provider
            value={{
                ...state,
                refresh: fetchSubscription,
                checkFeature,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    return useContext(SubscriptionContext);
}

/**
 * Feature gate wrapper component
 * Shows upgrade modal if user doesn't have access
 */
export function FeatureGate({
    feature,
    requiredTier = 'PRO',
    children,
    fallback,
}: {
    feature: string;
    requiredTier?: PricingTier;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { tier, checkFeature } = useSubscription();

    if (checkFeature(feature)) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    // Default fallback - disabled state
    return (
        <div className="relative opacity-50 cursor-not-allowed">
            <div className="absolute inset-0 z-10" />
            {children}
        </div>
    );
}
