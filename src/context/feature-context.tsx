'use client';

import React, { createContext, useContext } from 'react';
import { FeatureKey, FeatureStatus, DEFAULT_FEATURE_FLAGS } from '@/lib/features';

interface FeatureContextType {
    flags: Record<FeatureKey, FeatureStatus>;
    isLive: (key: FeatureKey) => boolean;
    isVisible: (key: FeatureKey) => boolean;
}

const FeatureContext = createContext<FeatureContextType>({
    flags: DEFAULT_FEATURE_FLAGS,
    isLive: () => false,
    isVisible: () => false,
});

export function FeatureProvider({
    children,
    flags
}: {
    children: React.ReactNode;
    flags: Record<FeatureKey, FeatureStatus>
}) {
    const isLive = (key: FeatureKey) => flags[key] === 'LIVE';
    const isVisible = (key: FeatureKey) => flags[key] !== 'HIDDEN';

    return (
        <FeatureContext.Provider value={{ flags, isLive, isVisible }}>
            {children}
        </FeatureContext.Provider>
    );
}

export function useFeatures() {
    return useContext(FeatureContext);
}
