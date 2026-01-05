/**
 * Forge Webhook Service
 * Manages inbound webhooks for triggering flows
 */

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { ForgeExecutionService } from './forge-execution.service';

export interface ForgeWebhook {
    id: string;
    orgId: string;
    flowId: string;
    environmentId: string;
    urlSlug: string;
    status: 'active' | 'paused';
    createdAt: Date;
    lastCalledAt: Date | null;
}

export interface CreateWebhookInput {
    orgId: string;
    flowId: string;
    environmentId: string;
}

export interface WebhookWithSecret extends ForgeWebhook {
    secret: string;
}

export class ForgeWebhookService {
    /**
     * Create a new webhook for a flow
     */
    static async create(input: CreateWebhookInput): Promise<WebhookWithSecret> {
        // Verify flow exists and belongs to org
        const flow = await prisma.forgeFlow.findFirst({
            where: { id: input.flowId, orgId: input.orgId },
        });

        if (!flow) {
            throw new Error('Flow not found');
        }

        // Generate unique slug and secret
        const urlSlug = this.generateSlug();
        const secret = crypto.randomBytes(32).toString('hex');

        const webhook = await prisma.forgeWebhook.create({
            data: {
                orgId: input.orgId,
                flowId: input.flowId,
                environmentId: input.environmentId,
                urlSlug,
                secret,
            },
        });

        return {
            ...this.toWebhook(webhook),
            secret, // Return secret only once at creation
        };
    }

    /**
     * Get webhook by ID
     */
    static async getById(id: string): Promise<ForgeWebhook | null> {
        const webhook = await prisma.forgeWebhook.findUnique({ where: { id } });
        return webhook ? this.toWebhook(webhook) : null;
    }

    /**
     * Get webhook by URL slug (for incoming requests)
     */
    static async getBySlug(
        urlSlug: string
    ): Promise<(ForgeWebhook & { secret: string }) | null> {
        const webhook = await prisma.forgeWebhook.findUnique({
            where: { urlSlug },
        });

        if (!webhook) return null;

        return {
            ...this.toWebhook(webhook),
            secret: webhook.secret,
        };
    }

    /**
     * List webhooks for a flow
     */
    static async listByFlow(flowId: string): Promise<ForgeWebhook[]> {
        const webhooks = await prisma.forgeWebhook.findMany({
            where: { flowId },
            orderBy: { createdAt: 'desc' },
        });
        return webhooks.map(this.toWebhook);
    }

    /**
     * List webhooks for an organization
     */
    static async listByOrg(orgId: string): Promise<ForgeWebhook[]> {
        const webhooks = await prisma.forgeWebhook.findMany({
            where: { orgId },
            orderBy: { createdAt: 'desc' },
            include: { flow: { select: { name: true } } },
        });
        return webhooks.map(this.toWebhook);
    }

    /**
     * Verify HMAC signature
     */
    static verifySignature(
        payload: string,
        signature: string,
        secret: string
    ): boolean {
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        // Constant-time comparison to prevent timing attacks
        try {
            return crypto.timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(`sha256=${expectedSignature}`)
            );
        } catch {
            return false;
        }
    }

    /**
     * Handle incoming webhook request
     */
    static async handleWebhookRequest(
        urlSlug: string,
        payload: Record<string, unknown>,
        signature?: string
    ): Promise<{ runId: string }> {
        const webhook = await this.getBySlug(urlSlug);

        if (!webhook) {
            throw new Error('Webhook not found');
        }

        if (webhook.status !== 'active') {
            throw new Error('Webhook is paused');
        }

        // Verify signature if provided
        if (signature) {
            const isValid = this.verifySignature(
                JSON.stringify(payload),
                signature,
                webhook.secret
            );
            if (!isValid) {
                throw new Error('Invalid signature');
            }
        }

        // Update last called timestamp
        await prisma.forgeWebhook.update({
            where: { id: webhook.id },
            data: { lastCalledAt: new Date() },
        });

        // Queue flow run
        const run = await ForgeExecutionService.queueFlowRun({
            flowId: webhook.flowId,
            orgId: webhook.orgId,
            triggerType: 'webhook',
            triggeredBy: 'webhook',
            inputPayload: payload,
        });

        return { runId: run.id };
    }

    /**
     * Pause a webhook
     */
    static async pause(id: string, orgId: string): Promise<ForgeWebhook | null> {
        const webhook = await prisma.forgeWebhook.findFirst({
            where: { id, orgId },
        });

        if (!webhook) return null;

        const updated = await prisma.forgeWebhook.update({
            where: { id },
            data: { status: 'paused' },
        });

        return this.toWebhook(updated);
    }

    /**
     * Resume a webhook
     */
    static async resume(id: string, orgId: string): Promise<ForgeWebhook | null> {
        const webhook = await prisma.forgeWebhook.findFirst({
            where: { id, orgId },
        });

        if (!webhook) return null;

        const updated = await prisma.forgeWebhook.update({
            where: { id },
            data: { status: 'active' },
        });

        return this.toWebhook(updated);
    }

    /**
     * Delete a webhook
     */
    static async delete(id: string, orgId: string): Promise<boolean> {
        const webhook = await prisma.forgeWebhook.findFirst({
            where: { id, orgId },
        });

        if (!webhook) return false;

        await prisma.forgeWebhook.delete({ where: { id } });
        return true;
    }

    /**
     * Regenerate webhook secret
     */
    static async regenerateSecret(
        id: string,
        orgId: string
    ): Promise<{ webhook: ForgeWebhook; secret: string } | null> {
        const existing = await prisma.forgeWebhook.findFirst({
            where: { id, orgId },
        });

        if (!existing) return null;

        const newSecret = crypto.randomBytes(32).toString('hex');

        const updated = await prisma.forgeWebhook.update({
            where: { id },
            data: { secret: newSecret },
        });

        return {
            webhook: this.toWebhook(updated),
            secret: newSecret,
        };
    }

    /**
     * Generate a unique URL slug
     */
    private static generateSlug(): string {
        const randomPart = crypto.randomBytes(16).toString('base64url');
        return `wh_${randomPart}`;
    }

    /**
     * Convert DB record to typed webhook
     */
    private static toWebhook(record: {
        id: string;
        orgId: string;
        flowId: string;
        environmentId: string;
        urlSlug: string;
        status: string;
        createdAt: Date;
        lastCalledAt: Date | null;
    }): ForgeWebhook {
        return {
            id: record.id,
            orgId: record.orgId,
            flowId: record.flowId,
            environmentId: record.environmentId,
            urlSlug: record.urlSlug,
            status: record.status as 'active' | 'paused',
            createdAt: record.createdAt,
            lastCalledAt: record.lastCalledAt,
        };
    }
}
