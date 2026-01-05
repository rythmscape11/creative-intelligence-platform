/**
 * Strategy Templates API
 * CRUD for strategy templates (admin + user)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const CreateTemplateSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    category: z.string().optional(),
    industry: z.string().optional(),
    templateData: z.record(z.unknown()),
    isPublic: z.boolean().optional(),
});

/**
 * GET /api/strategiser/templates
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

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        // Get user's templates + public templates
        const templates = await prisma.strategyTemplate.findMany({
            where: {
                OR: [
                    { userId: user.id },
                    { isPublic: true },
                ],
                ...(category ? { category } : {}),
            },
            orderBy: [
                { isPublic: 'desc' }, // Public first (admin templates)
                { createdAt: 'desc' },
            ],
        });

        return NextResponse.json({ success: true, data: templates });
    } catch (error) {
        console.error('[Templates API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }
}

/**
 * POST /api/strategiser/templates
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
        const validated = CreateTemplateSchema.parse(body);

        const template = await prisma.strategyTemplate.create({
            data: {
                userId: user.id,
                name: validated.name,
                description: validated.description,
                category: validated.category,
                industry: validated.industry,
                templateData: JSON.stringify(validated.templateData),
                isPublic: validated.isPublic || false,
            },
        });

        return NextResponse.json({ success: true, data: template }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Templates API] POST error:', error);
        return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
    }
}
