/**
 * Forge API Key Service
 * Manages API key generation, hashing, and validation
 */

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface ForgeApiKey {
    id: string;
    orgId: string;
    environmentId: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
    ipAllowlist: string[];
    rateLimitPerMin: number;
    status: 'active' | 'revoked';
    createdAt: Date;
    lastUsedAt: Date | null;
}

export interface CreateApiKeyInput {
    orgId: string;
    environmentId: string;
    name: string;
    scopes?: string[];
    ipAllowlist?: string[];
    rateLimitPerMin?: number;
}

export interface CreateApiKeyResult {
    key: ForgeApiKey;
    plainTextKey: string; // Only returned once at creation
}

const KEY_PREFIX_SANDBOX = 'frg_test_';
const KEY_PREFIX_PRODUCTION = 'frg_live_';
const SALT_ROUNDS = 10;

export class ForgeApiKeyService {
    /**
     * Generate a new API key
     * Returns the plain text key only once - it's never stored
     */
    static async create(input: CreateApiKeyInput): Promise<CreateApiKeyResult> {
        // Get environment to determine prefix
        const environment = await prisma.forgeEnvironment.findUnique({
            where: { id: input.environmentId },
        });

        if (!environment) {
            throw new Error('Environment not found');
        }

        // Generate secure random key
        const randomPart = crypto.randomBytes(24).toString('base64url');
        const prefix = environment.name === 'production' ? KEY_PREFIX_PRODUCTION : KEY_PREFIX_SANDBOX;
        const plainTextKey = `${prefix}${randomPart}`;

        // Hash the key for storage
        const keyHash = await bcrypt.hash(plainTextKey, SALT_ROUNDS);

        const apiKey = await prisma.forgeApiKey.create({
            data: {
                orgId: input.orgId,
                environmentId: input.environmentId,
                keyPrefix: prefix,
                keyHash,
                name: input.name,
                scopes: input.scopes || ['images', 'videos', 'flows'],
                ipAllowlist: input.ipAllowlist || [],
                rateLimitPerMin: input.rateLimitPerMin || 60,
            },
        });

        return {
            key: this.toPublicKey(apiKey),
            plainTextKey,
        };
    }

    /**
     * List all API keys for an organization (without hashes)
     */
    static async listByOrg(orgId: string): Promise<ForgeApiKey[]> {
        const keys = await prisma.forgeApiKey.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
        });
        return keys.map(this.toPublicKey);
    }

    /**
     * List keys by environment
     */
    static async listByEnvironment(environmentId: string): Promise<ForgeApiKey[]> {
        const keys = await prisma.forgeApiKey.findMany({
            where: { environmentId },
            orderBy: { createdAt: 'desc' },
        });
        return keys.map(this.toPublicKey);
    }

    /**
     * Validate an API key and return the key record if valid
     */
    static async validate(plainTextKey: string): Promise<ForgeApiKey | null> {
        // Extract prefix to narrow search
        const prefix = plainTextKey.substring(0, 9); // "frg_test_" or "frg_live_"

        // Find all active keys with matching prefix
        const candidates = await prisma.forgeApiKey.findMany({
            where: {
                keyPrefix: prefix,
                status: 'active',
            },
        });

        // Check each candidate (typically only a few per prefix)
        for (const candidate of candidates) {
            const isMatch = await bcrypt.compare(plainTextKey, candidate.keyHash);
            if (isMatch) {
                // Update last used timestamp
                await prisma.forgeApiKey.update({
                    where: { id: candidate.id },
                    data: { lastUsedAt: new Date() },
                });
                return this.toPublicKey(candidate);
            }
        }

        return null;
    }

    /**
     * Revoke an API key
     */
    static async revoke(id: string, orgId: string): Promise<ForgeApiKey | null> {
        const key = await prisma.forgeApiKey.findFirst({
            where: { id, orgId },
        });

        if (!key) return null;

        const updated = await prisma.forgeApiKey.update({
            where: { id },
            data: { status: 'revoked' },
        });

        return this.toPublicKey(updated);
    }

    /**
     * Delete an API key permanently
     */
    static async delete(id: string, orgId: string): Promise<boolean> {
        const key = await prisma.forgeApiKey.findFirst({
            where: { id, orgId },
        });

        if (!key) return false;

        await prisma.forgeApiKey.delete({ where: { id } });
        return true;
    }

    /**
     * Update key settings (not the key itself)
     */
    static async update(
        id: string,
        orgId: string,
        updates: {
            name?: string;
            scopes?: string[];
            ipAllowlist?: string[];
            rateLimitPerMin?: number;
        }
    ): Promise<ForgeApiKey | null> {
        const key = await prisma.forgeApiKey.findFirst({
            where: { id, orgId },
        });

        if (!key) return null;

        const updated = await prisma.forgeApiKey.update({
            where: { id },
            data: updates,
        });

        return this.toPublicKey(updated);
    }

    /**
     * Convert DB record to public API key (without hash)
     */
    private static toPublicKey(record: {
        id: string;
        orgId: string;
        environmentId: string;
        keyPrefix: string;
        name: string;
        scopes: unknown;
        ipAllowlist: unknown;
        rateLimitPerMin: number;
        status: string;
        createdAt: Date;
        lastUsedAt: Date | null;
    }): ForgeApiKey {
        return {
            id: record.id,
            orgId: record.orgId,
            environmentId: record.environmentId,
            keyPrefix: record.keyPrefix,
            name: record.name,
            scopes: record.scopes as string[],
            ipAllowlist: record.ipAllowlist as string[],
            rateLimitPerMin: record.rateLimitPerMin,
            status: record.status as 'active' | 'revoked',
            createdAt: record.createdAt,
            lastUsedAt: record.lastUsedAt,
        };
    }
}
