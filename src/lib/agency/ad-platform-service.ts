/**
 * Ad Platform Service
 * Manages ad platform connections and ad operations
 */

import { prisma } from '@/lib/prisma';
import { AdPlatform, AdStatus, OptimizationMode } from '@prisma/client';

export interface ConnectPlatformInput {
    agencyId?: string;
    clientId?: string;
    platform: AdPlatform;
    accountId: string;
    accountName?: string;
    accessToken: string;
    refreshToken?: string;
}

export interface CreateAdInput {
    connectionId: string;
    campaignId?: string;
    name: string;
    headline?: string;
    description?: string;
    callToAction?: string;
    destinationUrl?: string;
    mediaUrls?: string[];
    targeting?: Record<string, unknown>;
    objective?: string;
    budget: number;
    dailyBudget?: number;
    currency?: string;
    startDate?: Date;
    endDate?: Date;
    optimizationMode?: OptimizationMode;
    createdBy?: string;
}

export interface UpdateAdInput {
    name?: string;
    headline?: string;
    description?: string;
    status?: AdStatus;
    budget?: number;
    dailyBudget?: number;
    targeting?: Record<string, unknown>;
    optimizationMode?: OptimizationMode;
    optimizationRules?: Array<{ trigger: string; action: string; value?: number }>;
}

export class AdPlatformService {
    // ============================================
    // CONNECTION MANAGEMENT
    // ============================================

    static async connectPlatform(input: ConnectPlatformInput) {
        const connection = await prisma.adPlatformConnection.create({
            data: {
                agencyId: input.agencyId,
                clientId: input.clientId,
                platform: input.platform,
                accountId: input.accountId,
                accountName: input.accountName,
                accessToken: input.accessToken, // TODO: Encrypt
                refreshToken: input.refreshToken,
                status: 'CONNECTED',
                lastSyncAt: new Date(),
            },
        });
        return connection;
    }

    static async listConnections(agencyId?: string) {
        const where = agencyId ? { agencyId } : {};
        return prisma.adPlatformConnection.findMany({
            where,
            include: {
                _count: { select: { ads: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async disconnectPlatform(id: string) {
        await prisma.adPlatformConnection.update({
            where: { id },
            data: { status: 'DISCONNECTED' },
        });
        return { success: true };
    }

    // ============================================
    // AD MANAGEMENT
    // ============================================

    static async createAd(input: CreateAdInput) {
        const ad = await prisma.platformAd.create({
            data: {
                connectionId: input.connectionId,
                campaignId: input.campaignId,
                name: input.name,
                headline: input.headline,
                description: input.description,
                callToAction: input.callToAction,
                destinationUrl: input.destinationUrl,
                mediaUrls: JSON.stringify(input.mediaUrls || []),
                targeting: JSON.stringify(input.targeting || {}),
                objective: input.objective,
                budget: input.budget,
                dailyBudget: input.dailyBudget,
                currency: input.currency || 'USD',
                startDate: input.startDate,
                endDate: input.endDate,
                optimizationMode: input.optimizationMode || 'MANUAL',
                createdBy: input.createdBy,
                status: 'DRAFT',
            },
            include: {
                connection: { select: { platform: true, accountName: true } },
            },
        });
        return this.formatAd(ad);
    }

    static async listAds(filters?: {
        connectionId?: string;
        campaignId?: string;
        status?: AdStatus;
        optimizationMode?: OptimizationMode;
    }) {
        const where: Record<string, unknown> = {};
        if (filters?.connectionId) where.connectionId = filters.connectionId;
        if (filters?.campaignId) where.campaignId = filters.campaignId;
        if (filters?.status) where.status = filters.status;
        if (filters?.optimizationMode) where.optimizationMode = filters.optimizationMode;

        const ads = await prisma.platformAd.findMany({
            where,
            include: {
                connection: { select: { platform: true, accountName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return ads.map(this.formatAd);
    }

    static async getAdById(id: string) {
        const ad = await prisma.platformAd.findUnique({
            where: { id },
            include: {
                connection: { select: { platform: true, accountName: true } },
            },
        });
        return ad ? this.formatAd(ad) : null;
    }

    static async updateAd(id: string, input: UpdateAdInput) {
        const data: Record<string, unknown> = {};
        if (input.name !== undefined) data.name = input.name;
        if (input.headline !== undefined) data.headline = input.headline;
        if (input.description !== undefined) data.description = input.description;
        if (input.status !== undefined) data.status = input.status;
        if (input.budget !== undefined) data.budget = input.budget;
        if (input.dailyBudget !== undefined) data.dailyBudget = input.dailyBudget;
        if (input.targeting !== undefined) data.targeting = JSON.stringify(input.targeting);
        if (input.optimizationMode !== undefined) data.optimizationMode = input.optimizationMode;
        if (input.optimizationRules !== undefined) data.optimizationRules = JSON.stringify(input.optimizationRules);

        const ad = await prisma.platformAd.update({
            where: { id },
            data,
            include: {
                connection: { select: { platform: true, accountName: true } },
            },
        });
        return this.formatAd(ad);
    }

    static async pauseAd(id: string) {
        return this.updateAd(id, { status: 'PAUSED' });
    }

    static async resumeAd(id: string) {
        return this.updateAd(id, { status: 'ACTIVE' });
    }

    static async deleteAd(id: string) {
        await prisma.platformAd.update({
            where: { id },
            data: { status: 'DELETED' },
        });
        return { success: true };
    }

    // ============================================
    // ANALYTICS
    // ============================================

    static async getAdStats() {
        const [total, active, paused, draft] = await Promise.all([
            prisma.platformAd.count(),
            prisma.platformAd.count({ where: { status: 'ACTIVE' } }),
            prisma.platformAd.count({ where: { status: 'PAUSED' } }),
            prisma.platformAd.count({ where: { status: 'DRAFT' } }),
        ]);

        const metrics = await prisma.platformAd.aggregate({
            _sum: {
                budget: true,
                spentAmount: true,
                impressions: true,
                clicks: true,
                conversions: true,
            },
        });

        return {
            total,
            active,
            paused,
            draft,
            totalBudget: metrics._sum.budget || 0,
            totalSpent: metrics._sum.spentAmount || 0,
            totalImpressions: metrics._sum.impressions || 0,
            totalClicks: metrics._sum.clicks || 0,
            totalConversions: metrics._sum.conversions || 0,
        };
    }

    static async getAdPerformance(id: string) {
        const ad = await prisma.platformAd.findUnique({
            where: { id },
            select: {
                impressions: true,
                clicks: true,
                conversions: true,
                ctr: true,
                cpc: true,
                cpm: true,
                roas: true,
                budget: true,
                spentAmount: true,
            },
        });
        return ad;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static formatAd(ad: any) {
        return {
            ...ad,
            mediaUrls: JSON.parse(ad.mediaUrls || '[]'),
            targeting: JSON.parse(ad.targeting || '{}'),
            optimizationRules: JSON.parse(ad.optimizationRules || '[]'),
            aiRecommendations: JSON.parse(ad.aiRecommendations || '[]'),
        };
    }
}

export default AdPlatformService;
