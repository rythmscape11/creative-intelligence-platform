/**
 * Integrations API
 * Manage Agency OS third-party integrations
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/agency/integrations
 * List all integrations for the user
 */
export async function GET(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const integrations = await prisma.integration.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        // Transform to hide sensitive tokens
        const data = integrations.map(integ => ({
            id: integ.id,
            type: integ.type,
            category: integ.category,
            name: integ.name,
            description: integ.description,
            status: integ.status,
            isActive: integ.isActive,
            lastSyncAt: integ.lastSyncAt,
            lastError: integ.lastError,
            createdAt: integ.createdAt,
            // Don't expose tokens
            hasApiKey: !!integ.apiKey,
            hasAccessToken: !!integ.accessToken,
        }));

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('[Integrations API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
    }
}

// Validation schema
const CreateIntegrationSchema = z.object({
    type: z.enum(['SLACK', 'MAILCHIMP', 'GOOGLE_CALENDAR', 'ZAPIER', 'CUSTOM']),
    category: z.enum(['COMMUNICATION', 'EMAIL_MARKETING', 'PROJECT_MANAGEMENT', 'CALENDAR', 'CRM', 'SOCIAL_MEDIA', 'CUSTOM']),
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    webhookUrl: z.string().url().optional(),
    settings: z.record(z.unknown()).optional(),
});

/**
 * POST /api/agency/integrations
 * Create a new integration
 */
export async function POST(req: NextRequest) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const validated = CreateIntegrationSchema.parse(body);

        const integration = await prisma.integration.create({
            data: {
                userId: user.id,
                type: validated.type,
                category: validated.category,
                name: validated.name,
                description: validated.description,
                webhookUrl: validated.webhookUrl,
                settings: validated.settings,
                status: 'PENDING',
            },
        });

        return NextResponse.json({
            success: true,
            data: integration,
            note: 'Integration created. Configure API keys in the integration settings to activate.',
        }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Integrations API] POST error:', error);
        return NextResponse.json({ error: 'Failed to create integration' }, { status: 500 });
    }
}
