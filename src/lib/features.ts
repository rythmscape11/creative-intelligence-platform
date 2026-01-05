import { prisma } from '@/lib/prisma';
import { cache } from 'react';

export type FeatureKey =
    | 'strategiser'
    | 'analyser'
    | 'agency_os'
    | 'geo_engine'
    | 'optimiser';

export type FeatureStatus = 'LIVE' | 'COMING_SOON' | 'HIDDEN';

export const DEFAULT_FEATURE_FLAGS: Record<FeatureKey, FeatureStatus> = {
    strategiser: 'LIVE',
    analyser: 'LIVE',
    agency_os: 'LIVE',
    geo_engine: 'COMING_SOON',
    optimiser: 'COMING_SOON',
};

export const getFeatureFlags = cache(async (): Promise<Record<FeatureKey, FeatureStatus>> => {
    try {
        const setting = await prisma.siteSettings.findUnique({
            where: { key: 'feature_flags' },
        });

        if (!setting) return DEFAULT_FEATURE_FLAGS;

        const storedFlags = JSON.parse(setting.value);
        return { ...DEFAULT_FEATURE_FLAGS, ...storedFlags };
    } catch (error) {
        console.error('Failed to fetch feature flags:', error);
        return DEFAULT_FEATURE_FLAGS;
    }
});

export async function getFeatureStatus(key: FeatureKey): Promise<FeatureStatus> {
    const flags = await getFeatureFlags();
    return flags[key] || 'HIDDEN';
}

export async function isFeatureLive(key: FeatureKey): Promise<boolean> {
    const status = await getFeatureStatus(key);
    return status === 'LIVE';
}

export async function isFeatureVisible(key: FeatureKey): Promise<boolean> {
    const status = await getFeatureStatus(key);
    return status !== 'HIDDEN';
}
