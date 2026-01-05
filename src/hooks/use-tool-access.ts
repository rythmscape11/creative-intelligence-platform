'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { hasToolAccess, getAccessibleTools, isAdmin, TOOL_CONFIGS, type PlanTier, type ToolAccessConfig } from '@/config/tool-access';

interface UseToolAccessResult {
    isLoading: boolean;
    userPlan: PlanTier;
    isAdmin: boolean;
    hasAccess: (toolId: string) => boolean;
    accessibleTools: ToolAccessConfig[];
    allTools: ToolAccessConfig[];
}

/**
 * Hook to check tool access based on user email and subscription
 */
export function useToolAccess(): UseToolAccessResult {
    const { user, isLoaded } = useUser();
    const [userPlan, setUserPlan] = useState<PlanTier>('FREE');
    const [isLoadingPlan, setIsLoadingPlan] = useState(true);

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const userIsAdmin = isAdmin(userEmail);

    useEffect(() => {
        async function fetchSubscription() {
            if (!isLoaded || !user) {
                setIsLoadingPlan(false);
                return;
            }

            try {
                const response = await fetch('/api/subscription');
                if (response.ok) {
                    const data = await response.json();
                    setUserPlan(data.plan || 'FREE');
                }
            } catch (error) {
                console.error('Failed to fetch subscription:', error);
                setUserPlan('FREE');
            } finally {
                setIsLoadingPlan(false);
            }
        }

        fetchSubscription();
    }, [isLoaded, user]);

    const hasAccess = (toolId: string): boolean => {
        // Admin always has access
        if (userIsAdmin) return true;
        return hasToolAccess(userEmail, userPlan, toolId);
    };

    const accessibleTools = getAccessibleTools(userEmail, userPlan);

    return {
        isLoading: !isLoaded || isLoadingPlan,
        userPlan,
        isAdmin: userIsAdmin,
        hasAccess,
        accessibleTools,
        allTools: TOOL_CONFIGS,
    };
}
