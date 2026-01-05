/**
 * Forge Webhooks API
 * GET - List webhooks for current org
 * POST - Create new webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeWebhookService, ForgeEnvironmentService } from '@/lib/services/forge';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const webhooks = await ForgeWebhookService.listByOrg(userId);
        return NextResponse.json({ webhooks });
    } catch (error) {
        console.error('Error fetching webhooks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch webhooks' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { flowId, environmentName } = body;

        if (!flowId) {
            return NextResponse.json({ error: 'flowId is required' }, { status: 400 });
        }

        // Get or create environment
        const envName = environmentName || 'production';
        let environment = await ForgeEnvironmentService.getByOrgAndName(userId, envName);

        if (!environment) {
            const envs = await ForgeEnvironmentService.ensureEnvironments(userId);
            environment = envs.find(e => e.name === envName) || envs[0];
        }

        const result = await ForgeWebhookService.create({
            orgId: userId,
            flowId,
            environmentId: environment.id,
        });

        const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/forge/webhooks/inbound/${result.urlSlug}`;

        return NextResponse.json({
            webhook: result,
            webhookUrl,
            message: 'Store the secret securely - it will not be shown again.',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating webhook:', error);
        const message = error instanceof Error ? error.message : 'Failed to create webhook';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
