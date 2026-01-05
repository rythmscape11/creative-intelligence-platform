/**
 * Forge Environments API
 * GET - List environments for current org
 * POST - Initialize environments (usually done automatically)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ForgeEnvironmentService } from '@/lib/services/forge';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use userId as orgId for now (single-tenant per user)
        const environments = await ForgeEnvironmentService.getByOrg(userId);

        // Auto-create if none exist
        if (environments.length === 0) {
            const created = await ForgeEnvironmentService.ensureEnvironments(userId);
            return NextResponse.json({ environments: created });
        }

        return NextResponse.json({ environments });
    } catch (error) {
        console.error('Error fetching environments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch environments' },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const environments = await ForgeEnvironmentService.ensureEnvironments(userId);
        return NextResponse.json({ environments }, { status: 201 });
    } catch (error) {
        console.error('Error creating environments:', error);
        return NextResponse.json(
            { error: 'Failed to create environments' },
            { status: 500 }
        );
    }
}
