/**
 * Campaign Service
 * Handles all business logic for Agency Campaigns
 */

import { prisma } from '@/lib/prisma';
import { CampaignObjective, CampaignStatus, MarketingChannel } from '@prisma/client';

export interface CreateCampaignInput {
    projectId: string;
    name: string;
    description?: string;
    objective?: CampaignObjective;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    currency?: string;
    channels?: MarketingChannel[];
    kpis?: Record<string, number>;
    tags?: string[];
    notes?: string;
    createdBy?: string;
}

export interface UpdateCampaignInput {
    name?: string;
    description?: string;
    objective?: CampaignObjective;
    status?: CampaignStatus;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    currency?: string;
    spentAmount?: number;
    channels?: MarketingChannel[];
    kpis?: Record<string, number>;
    automationRules?: Array<{ trigger: string; action: string; conditions?: string[] }>;
    tags?: string[];
    notes?: string;
}

export interface ChannelAllocationInput {
    channel: MarketingChannel;
    budget: number;
    percentAllocation: number;
    targetMetrics?: Record<string, number>;
}

export class CampaignService {
    /**
     * Create a new campaign
     */
    static async create(input: CreateCampaignInput) {
        const campaign = await prisma.agencyCampaign.create({
            data: {
                projectId: input.projectId,
                name: input.name,
                description: input.description,
                objective: input.objective || 'AWARENESS',
                startDate: input.startDate,
                endDate: input.endDate,
                budget: input.budget || 0,
                currency: input.currency || 'USD',
                channels: JSON.stringify(input.channels || []),
                kpis: JSON.stringify(input.kpis || {}),
                tags: input.tags || [],
                notes: input.notes,
                createdBy: input.createdBy,
            },
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
                channelAllocations: true,
            },
        });

        return this.formatCampaign(campaign);
    }

    /**
     * Get all campaigns for a project
     */
    static async listByProject(projectId: string) {
        const campaigns = await prisma.agencyCampaign.findMany({
            where: { projectId },
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
                channelAllocations: true,
                _count: {
                    select: {
                        contentPosts: true,
                        reports: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return campaigns.map(this.formatCampaign);
    }

    /**
     * Get all campaigns (with optional filters)
     */
    static async list(filters?: {
        status?: CampaignStatus;
        objective?: CampaignObjective;
        projectId?: string;
    }) {
        const where: Record<string, unknown> = {};
        if (filters?.status) where.status = filters.status;
        if (filters?.objective) where.objective = filters.objective;
        if (filters?.projectId) where.projectId = filters.projectId;

        const campaigns = await prisma.agencyCampaign.findMany({
            where,
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
                channelAllocations: true,
                _count: {
                    select: {
                        contentPosts: true,
                        reports: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return campaigns.map(this.formatCampaign);
    }

    /**
     * Get a single campaign by ID
     */
    static async getById(id: string) {
        const campaign = await prisma.agencyCampaign.findUnique({
            where: { id },
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
                channelAllocations: true,
                contentPosts: {
                    take: 10,
                    orderBy: { scheduledFor: 'asc' },
                },
                reports: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!campaign) return null;
        return this.formatCampaign(campaign);
    }

    /**
     * Update a campaign
     */
    static async update(id: string, input: UpdateCampaignInput) {
        const data: Record<string, unknown> = {};

        if (input.name !== undefined) data.name = input.name;
        if (input.description !== undefined) data.description = input.description;
        if (input.objective !== undefined) data.objective = input.objective;
        if (input.status !== undefined) data.status = input.status;
        if (input.startDate !== undefined) data.startDate = input.startDate;
        if (input.endDate !== undefined) data.endDate = input.endDate;
        if (input.budget !== undefined) data.budget = input.budget;
        if (input.currency !== undefined) data.currency = input.currency;
        if (input.spentAmount !== undefined) data.spentAmount = input.spentAmount;
        if (input.channels !== undefined) data.channels = JSON.stringify(input.channels);
        if (input.kpis !== undefined) data.kpis = JSON.stringify(input.kpis);
        if (input.automationRules !== undefined) data.automationRules = JSON.stringify(input.automationRules);
        if (input.tags !== undefined) data.tags = input.tags;
        if (input.notes !== undefined) data.notes = input.notes;

        const campaign = await prisma.agencyCampaign.update({
            where: { id },
            data,
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
                channelAllocations: true,
            },
        });

        return this.formatCampaign(campaign);
    }

    /**
     * Delete a campaign
     */
    static async delete(id: string) {
        await prisma.agencyCampaign.delete({
            where: { id },
        });
        return { success: true };
    }

    /**
     * Update channel allocations for a campaign
     */
    static async updateChannelAllocations(campaignId: string, allocations: ChannelAllocationInput[]) {
        // Delete existing allocations
        await prisma.campaignChannelAllocation.deleteMany({
            where: { campaignId },
        });

        // Create new allocations
        const created = await prisma.campaignChannelAllocation.createMany({
            data: allocations.map((alloc) => ({
                campaignId,
                channel: alloc.channel,
                budget: alloc.budget,
                percentAllocation: alloc.percentAllocation,
                targetMetrics: JSON.stringify(alloc.targetMetrics || {}),
            })),
        });

        return created;
    }

    /**
     * Get campaign statistics
     */
    static async getStats() {
        const [total, active, draft, completed] = await Promise.all([
            prisma.agencyCampaign.count(),
            prisma.agencyCampaign.count({ where: { status: 'ACTIVE' } }),
            prisma.agencyCampaign.count({ where: { status: 'DRAFT' } }),
            prisma.agencyCampaign.count({ where: { status: 'COMPLETED' } }),
        ]);

        const totalBudget = await prisma.agencyCampaign.aggregate({
            _sum: { budget: true, spentAmount: true },
        });

        return {
            total,
            active,
            draft,
            completed,
            totalBudget: totalBudget._sum.budget || 0,
            totalSpent: totalBudget._sum.spentAmount || 0,
        };
    }

    /**
     * Format campaign with parsed JSON fields
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static formatCampaign(campaign: any) {
        return {
            ...campaign,
            channels: JSON.parse(campaign.channels || '[]'),
            kpis: JSON.parse(campaign.kpis || '{}'),
            automationRules: JSON.parse(campaign.automationRules || '[]'),
            channelAllocations: campaign.channelAllocations?.map((alloc: any) => ({
                ...alloc,
                targetMetrics: JSON.parse(alloc.targetMetrics || '{}'),
                actualMetrics: JSON.parse(alloc.actualMetrics || '{}'),
            })),
        };
    }
}

export default CampaignService;
