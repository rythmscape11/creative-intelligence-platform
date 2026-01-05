/**
 * Ad Detail API Routes
 * GET/PATCH/DELETE /api/agency/ads/[id]
 * POST /api/agency/ads/[id]/pause
 * POST /api/agency/ads/[id]/resume
 * POST /api/agency/ads/[id]/optimize
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { AdPlatformService } from '@/lib/agency/ad-platform-service';
import { AdOptimizationEngine } from '@/lib/agency/ad-optimization-engine';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const ad = await AdPlatformService.getAdById(id);

        if (!ad) return NextResponse.json({ error: 'Ad not found' }, { status: 404 });

        return NextResponse.json({ ad });
    } catch (error) {
        console.error('[Ad API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch ad' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await request.json();

        // Handle special actions
        if (body.action === 'pause') {
            const ad = await AdPlatformService.pauseAd(id);
            return NextResponse.json({ ad, message: 'Ad paused' });
        }

        if (body.action === 'resume') {
            const ad = await AdPlatformService.resumeAd(id);
            return NextResponse.json({ ad, message: 'Ad resumed' });
        }

        if (body.action === 'optimize') {
            const optimizationMode = body.mode || 'RULE_BASED';

            if (optimizationMode === 'RULE_BASED') {
                const actions = await AdOptimizationEngine.runRuleOptimization(id);
                return NextResponse.json({ actions, message: 'Rule optimization complete' });
            } else {
                const recommendations = await AdOptimizationEngine.generateAIRecommendations(id);
                return NextResponse.json({ recommendations, message: 'AI recommendations generated' });
            }
        }

        const ad = await AdPlatformService.updateAd(id, body);
        return NextResponse.json({ ad });
    } catch (error) {
        console.error('[Ad API] Error:', error);
        return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await AdPlatformService.deleteAd(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Ad API] Error:', error);
        return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
    }
}
