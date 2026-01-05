import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ensureUserInDb } from '@/lib/ensure-user';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const branding = await prisma.agencyBranding.findUnique({
            where: { userId }
        });

        return NextResponse.json(branding || {});
    } catch (error: unknown) {
        console.error('Failed to fetch branding:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user exists in Prisma
        const userResult = await ensureUserInDb(userId);
        if (!userResult.success) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const { logoUrl, logoLightUrl, faviconUrl, primaryColor, secondaryColor, accentColor, customDomain, hideMediaPlanPro, customFooterText } = body;

        const branding = await prisma.agencyBranding.upsert({
            where: { userId },
            update: {
                logoUrl,
                logoLightUrl,
                faviconUrl,
                primaryColor,
                secondaryColor,
                accentColor,
                customDomain,
                hideMediaPlanPro,
                customFooterText
            },
            create: {
                userId,
                logoUrl,
                logoLightUrl,
                faviconUrl,
                primaryColor,
                secondaryColor,
                accentColor,
                customDomain,
                hideMediaPlanPro,
                customFooterText
            }
        });

        return NextResponse.json(branding);
    } catch (error: unknown) {
        console.error('Failed to update branding:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
