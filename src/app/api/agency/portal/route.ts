/**
 * Portal Clients API
 * CRUD operations for Client Portal workspaces
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const CreatePortalClientSchema = z.object({
    clientName: z.string().min(1).max(100),
    clientEmail: z.string().email().optional(),
    clientCompany: z.string().optional(),
    primaryColor: z.string().optional(),
    portalSlug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/).optional(),
    customDomain: z.string().optional(),
    portalFeatures: z.array(z.string()).optional(),
});

/**
 * GET /api/agency/portal
 * List all portal clients for the current user
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

        const clients = await prisma.clientWorkspace.findMany({
            where: {
                ownerId: user.id,
                isActive: true,
            },
            include: {
                _count: { select: { strategies: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });

        // Transform to portal format
        const portalClients = clients.map(client => ({
            id: client.id,
            name: client.clientName,
            email: client.clientEmail,
            company: client.clientCompany,
            portalUrl: client.portalSlug
                ? `${client.portalSlug}.portal.aureonone.in`
                : `${client.id}.portal.aureonone.in`,
            customDomain: client.customDomain,
            branding: {
                primaryColor: client.primaryColor || '#6366F1',
                logo: client.clientLogoUrl,
            },
            features: client.portalFeatures
                ? JSON.parse(client.portalFeatures)
                : ['projects', 'files'],
            lastAccess: client.lastAccessAt,
            strategiesCount: client._count.strategies,
            createdAt: client.createdAt,
        }));

        return NextResponse.json({ success: true, data: portalClients });
    } catch (error) {
        console.error('[Portal API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }
}

/**
 * POST /api/agency/portal
 * Create a new portal client
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
        const validated = CreatePortalClientSchema.parse(body);

        // Generate portal slug if not provided
        const portalSlug = validated.portalSlug ||
            validated.clientName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);

        // Check slug uniqueness
        const existing = await prisma.clientWorkspace.findUnique({
            where: { portalSlug },
        });
        if (existing) {
            return NextResponse.json(
                { error: 'Portal slug already in use' },
                { status: 400 }
            );
        }

        const client = await prisma.clientWorkspace.create({
            data: {
                ownerId: user.id,
                clientName: validated.clientName,
                clientEmail: validated.clientEmail,
                clientCompany: validated.clientCompany,
                primaryColor: validated.primaryColor,
                portalSlug,
                customDomain: validated.customDomain,
                portalFeatures: validated.portalFeatures
                    ? JSON.stringify(validated.portalFeatures)
                    : JSON.stringify(['projects', 'files']),
            },
        });

        return NextResponse.json({ success: true, data: client }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Portal API] POST error:', error);
        return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
    }
}
