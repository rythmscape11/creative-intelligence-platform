/**
 * Content Calendar Service
 * Handles scheduled posts across multiple platforms
 */

import { prisma } from '@/lib/prisma';

export interface CreatePostInput {
    campaignId?: string;
    projectId: string;
    platform: string;
    postType?: string;
    caption: string;
    mediaUrls?: string[];
    scheduledFor?: Date;
    createdBy?: string;
}

export interface UpdatePostInput {
    platform?: string;
    postType?: string;
    caption?: string;
    mediaUrls?: string[];
    scheduledFor?: Date;
    status?: string;
    approvedBy?: string;
    approvalNotes?: string;
}

export class ContentService {
    /**
     * Create a new content post
     */
    static async createPost(input: CreatePostInput) {
        const post = await prisma.agencyContentPost.create({
            data: {
                campaignId: input.campaignId,
                projectId: input.projectId,
                platform: input.platform,
                postType: input.postType || 'IMAGE',
                caption: input.caption,
                mediaUrls: JSON.stringify(input.mediaUrls || []),
                scheduledFor: input.scheduledFor,
                createdBy: input.createdBy,
            },
        });

        return this.formatPost(post);
    }

    /**
     * List posts with filters
     */
    static async listPosts(filters?: {
        projectId?: string;
        campaignId?: string;
        platform?: string;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }) {
        const where: Record<string, unknown> = {};
        if (filters?.projectId) where.projectId = filters.projectId;
        if (filters?.campaignId) where.campaignId = filters.campaignId;
        if (filters?.platform) where.platform = filters.platform;
        if (filters?.status) where.status = filters.status;
        if (filters?.startDate || filters?.endDate) {
            where.scheduledFor = {};
            if (filters.startDate) (where.scheduledFor as Record<string, Date>).gte = filters.startDate;
            if (filters.endDate) (where.scheduledFor as Record<string, Date>).lte = filters.endDate;
        }

        const posts = await prisma.agencyContentPost.findMany({
            where,
            include: {
                campaign: { select: { id: true, name: true } },
            },
            orderBy: { scheduledFor: 'asc' },
        });

        return posts.map(this.formatPost);
    }

    /**
     * Get post by ID
     */
    static async getById(id: string) {
        const post = await prisma.agencyContentPost.findUnique({
            where: { id },
            include: {
                campaign: { select: { id: true, name: true, project: { select: { name: true, client: { select: { name: true } } } } } },
            },
        });
        return post ? this.formatPost(post) : null;
    }

    /**
     * Update post
     */
    static async update(id: string, input: UpdatePostInput) {
        const data: Record<string, unknown> = {};
        if (input.platform !== undefined) data.platform = input.platform;
        if (input.postType !== undefined) data.postType = input.postType;
        if (input.caption !== undefined) data.caption = input.caption;
        if (input.mediaUrls !== undefined) data.mediaUrls = JSON.stringify(input.mediaUrls);
        if (input.scheduledFor !== undefined) data.scheduledFor = input.scheduledFor;
        if (input.status !== undefined) data.status = input.status;
        if (input.approvedBy !== undefined) data.approvedBy = input.approvedBy;
        if (input.approvalNotes !== undefined) data.approvalNotes = input.approvalNotes;

        const post = await prisma.agencyContentPost.update({
            where: { id },
            data,
        });
        return this.formatPost(post);
    }

    /**
     * Approve or reject a post
     */
    static async approve(id: string, approved: boolean, userId: string, notes?: string) {
        const status = approved ? 'APPROVED' : 'CHANGES_REQUESTED';
        return this.update(id, { status, approvedBy: userId, approvalNotes: notes });
    }

    /**
     * Schedule a post for publishing
     */
    static async schedule(id: string, scheduledFor: Date) {
        return this.update(id, { scheduledFor, status: 'SCHEDULED' });
    }

    /**
     * Delete post
     */
    static async delete(id: string) {
        await prisma.agencyContentPost.delete({ where: { id } });
        return { success: true };
    }

    /**
     * Get calendar view data (grouped by date)
     */
    static async getCalendarView(projectId: string, month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const posts = await this.listPosts({ projectId, startDate, endDate });

        // Group by date
        const groupedByDate: Record<string, typeof posts> = {};
        posts.forEach(post => {
            if (post.scheduledFor) {
                const dateKey = new Date(post.scheduledFor).toISOString().split('T')[0];
                if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
                groupedByDate[dateKey].push(post);
            }
        });

        return groupedByDate;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static formatPost(post: any) {
        return {
            ...post,
            mediaUrls: JSON.parse(post.mediaUrls || '[]'),
        };
    }
}

export default ContentService;
