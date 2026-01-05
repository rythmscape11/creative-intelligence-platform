/**
 * Assets API
 * GET /api/agency/assets - List assets
 * POST /api/agency/assets - Create asset
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AssetService } from '@/lib/agency/asset-service';
import { TenantService } from '@/lib/agency/tenant-service';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const type = searchParams.get('type') || undefined;

        let assets;

        if (projectId) {
            assets = await AssetService.listByProject(projectId, { type });
        } else {
            // Find user's agency
            const agencies = await TenantService.listAgencies(userId);
            if (agencies.length === 0) {
                return NextResponse.json({ assets: [] });
            }
            // Use primary agency
            const agencyId = agencies[0].id;
            assets = await AssetService.listByAgency(agencyId, { type });
        }

        return NextResponse.json({ assets });
    } catch (error) {
        console.error('[Assets API] Error:', error);
        return NextResponse.json({ error: 'Failed to list assets' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        if (!body.projectId || !body.name || !body.type || !body.storagePath) {
            return NextResponse.json({ error: 'projectId, name, type, and storagePath are required' }, { status: 400 });
        }

        const asset = await AssetService.create({ ...body, uploadedBy: userId });
        return NextResponse.json({ asset }, { status: 201 });
    } catch (error) {
        console.error('[Assets API] Error:', error);
        return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
    }
}
