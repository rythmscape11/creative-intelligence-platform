/**
 * Brand Kits API
 * CRUD operations for Forge brand kits
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const CreateBrandKitSchema = z.object({
    clientName: z.string().min(1).max(100),
    description: z.string().optional(),
    colors: z.array(z.string()).optional(),
    toneOfVoice: z.array(z.string()).optional(),
    forbiddenImagery: z.array(z.string()).optional(),
    requiredElements: z.array(z.string()).optional(),
});

/**
 * GET /api/forge/brand-kits
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

        const brandKits = await prisma.brandKit.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        // Transform for frontend
        const kits = brandKits.map(kit => ({
            id: kit.id,
            clientName: kit.clientName,
            description: kit.description,
            colors: kit.colors ? (kit.colors as string[]) : [],
            toneOfVoice: kit.toneOfVoice ? (kit.toneOfVoice as string[]) : [],
            forbiddenImagery: kit.forbiddenImagery ? (kit.forbiddenImagery as string[]) : [],
            requiredElements: kit.requiredElements ? (kit.requiredElements as string[]) : [],
            loraStatus: kit.loraStatus,
            imageCount: kit.imageCount,
            usageCount: kit.usageCount,
            createdAt: kit.createdAt.toISOString(),
        }));

        return NextResponse.json({ success: true, data: kits });
    } catch (error) {
        console.error('[Brand Kits API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch brand kits' }, { status: 500 });
    }
}

/**
 * POST /api/forge/brand-kits
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
        const validated = CreateBrandKitSchema.parse(body);

        const brandKit = await prisma.brandKit.create({
            data: {
                userId: user.id,
                clientName: validated.clientName,
                description: validated.description,
                colors: validated.colors || [],
                toneOfVoice: validated.toneOfVoice || [],
                forbiddenImagery: validated.forbiddenImagery || [],
                requiredElements: validated.requiredElements || [],
            },
        });

        return NextResponse.json({ success: true, data: brandKit }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Brand Kits API] POST error:', error);
        return NextResponse.json({ error: 'Failed to create brand kit' }, { status: 500 });
    }
}
