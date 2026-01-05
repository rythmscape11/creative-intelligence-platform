/**
 * Asset Library Service
 * Handles file uploads, versioning, and tagging
 */

import { prisma } from '@/lib/prisma';

export interface CreateAssetInput {
    projectId: string;
    name: string;
    type: string;
    storagePath: string;
    publicUrl?: string;
    mimeType?: string;
    size?: number;
    uploadedBy?: string;
    tags?: string[];
    usageRights?: Record<string, unknown>;
}

export interface UpdateAssetInput {
    name?: string;
    tags?: string[];
    usageRights?: Record<string, unknown>;
}

export class AssetService {
    /**
     * Create a new asset
     */
    static async create(input: CreateAssetInput) {
        const asset = await prisma.agencyAsset.create({
            data: {
                projectId: input.projectId,
                name: input.name,
                type: input.type,
                storagePath: input.storagePath,
                publicUrl: input.publicUrl,
                mimeType: input.mimeType,
                size: input.size,
                uploadedBy: input.uploadedBy,
            },
        });
        return asset;
    }

    /**
     * List assets by project
     */
    static async listByProject(projectId: string, filters?: { type?: string }) {
        const where: Record<string, unknown> = { projectId };
        if (filters?.type) where.type = filters.type;

        return prisma.agencyAsset.findMany({
            where,
            include: {
                project: { select: { name: true, client: { select: { name: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * List assets by agency (across all projects)
     */
    static async listByAgency(agencyId: string, filters?: { type?: string }) {
        const where: Record<string, unknown> = {
            project: { agencyId }
        };
        if (filters?.type) where.type = filters.type;

        return prisma.agencyAsset.findMany({
            where,
            include: {
                project: { select: { name: true, client: { select: { name: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get asset by ID
     */
    static async getById(id: string) {
        return prisma.agencyAsset.findUnique({
            where: { id },
            include: {
                project: { select: { name: true, client: { select: { name: true } } } },
            },
        });
    }

    /**
     * Delete asset
     */
    static async delete(id: string) {
        await prisma.agencyAsset.delete({ where: { id } });
        return { success: true };
    }

    /**
     * Get asset statistics
     */
    static async getStats(projectId?: string) {
        const where = projectId ? { projectId } : {};

        const [total, byType] = await Promise.all([
            prisma.agencyAsset.count({ where }),
            prisma.agencyAsset.groupBy({
                by: ['type'],
                where,
                _count: true,
            }),
        ]);

        return {
            total,
            byType: byType.reduce((acc, item) => {
                acc[item.type] = item._count;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}

export default AssetService;
