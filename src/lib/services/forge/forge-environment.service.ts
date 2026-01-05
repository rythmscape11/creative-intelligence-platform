/**
 * Forge Environment Service
 * Manages sandbox/production environments per organization
 */

import { prisma } from '@/lib/prisma';

export type EnvironmentName = 'sandbox' | 'production';

export interface ForgeEnvironment {
    id: string;
    orgId: string;
    name: EnvironmentName;
    createdAt: Date;
    updatedAt: Date;
}

export class ForgeEnvironmentService {
    /**
     * Get or create default environments for an organization
     */
    static async ensureEnvironments(orgId: string): Promise<ForgeEnvironment[]> {
        const environments: EnvironmentName[] = ['sandbox', 'production'];
        const results: ForgeEnvironment[] = [];

        for (const name of environments) {
            const env = await prisma.forgeEnvironment.upsert({
                where: { orgId_name: { orgId, name } },
                update: {},
                create: { orgId, name },
            });
            results.push(env as ForgeEnvironment);
        }

        return results;
    }

    /**
     * Get all environments for an organization
     */
    static async getByOrg(orgId: string): Promise<ForgeEnvironment[]> {
        const environments = await prisma.forgeEnvironment.findMany({
            where: { orgId },
            orderBy: { name: 'asc' },
        });
        return environments as ForgeEnvironment[];
    }

    /**
     * Get a specific environment by ID
     */
    static async getById(id: string): Promise<ForgeEnvironment | null> {
        const env = await prisma.forgeEnvironment.findUnique({
            where: { id },
        });
        return env as ForgeEnvironment | null;
    }

    /**
     * Get environment by org and name
     */
    static async getByOrgAndName(
        orgId: string,
        name: EnvironmentName
    ): Promise<ForgeEnvironment | null> {
        const env = await prisma.forgeEnvironment.findUnique({
            where: { orgId_name: { orgId, name } },
        });
        return env as ForgeEnvironment | null;
    }
}
