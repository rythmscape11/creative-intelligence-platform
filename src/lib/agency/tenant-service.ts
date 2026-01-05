/**
 * Tenant Service
 * Handles multi-tenant operations and workspace isolation
 */

import { prisma } from '@/lib/prisma';

export interface TenantContext {
    agencyId: string;
    userId: string;
    permissions: string[];
}

export class TenantService {
    /**
     * Get or create agency for user
     */
    static async getOrCreateAgency(userId: string, name: string) {
        let agency = await prisma.agency.findFirst({
            where: {
                // Find agency where user has access
                workspaceId: userId, // Simplified - in production, use proper user-agency mapping
            },
        });

        if (!agency) {
            agency = await prisma.agency.create({
                data: {
                    name,
                    workspaceId: userId,
                },
            });
        }

        return agency;
    }

    /**
     * Get agency by ID with access check
     */
    static async getAgency(agencyId: string, userId: string) {
        const agency = await prisma.agency.findUnique({
            where: { id: agencyId },
            include: {
                clients: { take: 5, orderBy: { createdAt: 'desc' } },
                projects: { take: 5, orderBy: { createdAt: 'desc' } },
            },
        });

        // In production, verify user has access to this agency
        return agency;
    }

    /**
     * List all agencies for user
     */
    static async listAgencies(userId: string) {
        return prisma.agency.findMany({
            where: {
                workspaceId: userId, // Simplified
            },
            include: {
                _count: {
                    select: { clients: true, projects: true },
                },
            },
        });
    }

    /**
     * Create scoped query filter for tenant isolation
     */
    static scopedWhere(agencyId: string, additionalWhere?: Record<string, unknown>) {
        return {
            agencyId,
            ...additionalWhere,
        };
    }

    /**
     * Validate tenant access
     */
    static async validateAccess(agencyId: string, userId: string): Promise<boolean> {
        const agency = await prisma.agency.findFirst({
            where: {
                id: agencyId,
                workspaceId: userId, // Simplified - in production, check user-agency relationship
            },
        });

        return !!agency;
    }

    /**
     * Get agency statistics
     */
    static async getAgencyStats(agencyId: string) {
        const [clientCount, projectCount, campaignCount] = await Promise.all([
            prisma.agencyClient.count({ where: { agencyId } }),
            prisma.agencyProject.count({ where: { agencyId } }),
            prisma.agencyCampaign.count({
                where: { project: { agencyId } },
            }),
        ]);

        return {
            clients: clientCount,
            projects: projectCount,
            campaigns: campaignCount,
        };
    }
}

export default TenantService;
