/**
 * Forge API Keys API
 * GET - List API keys for current org
 * POST - Create new API key
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeApiKeyService, ForgeEnvironmentService } from '@/lib/services/forge';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const keys = await ForgeApiKeyService.listByOrg(userId);
        return NextResponse.json({ keys });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        return NextResponse.json(
            { error: 'Failed to fetch API keys' },
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
        const { name, environmentName, scopes, ipAllowlist, rateLimitPerMin } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Get or create environment
        const envName = environmentName || 'sandbox';
        let environment = await ForgeEnvironmentService.getByOrgAndName(userId, envName);

        if (!environment) {
            const envs = await ForgeEnvironmentService.ensureEnvironments(userId);
            environment = envs.find(e => e.name === envName) || envs[0];
        }

        const result = await ForgeApiKeyService.create({
            orgId: userId,
            environmentId: environment.id,
            name,
            scopes,
            ipAllowlist,
            rateLimitPerMin,
        });

        return NextResponse.json({
            key: result.key,
            plainTextKey: result.plainTextKey, // Only shown once!
            message: 'Store this key securely - it will not be shown again.',
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating API key:', error);
        return NextResponse.json(
            { error: 'Failed to create API key' },
            { status: 500 }
        );
    }
}
