/**
 * Automation Rules API
 * CRUD operations for Agency OS automation rules
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const CreateRuleSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    trigger: z.string(),
    triggerConfig: z.record(z.unknown()).optional(),
    conditions: z.array(z.object({
        field: z.string(),
        operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
        value: z.union([z.string(), z.number(), z.boolean()]),
    })).optional(),
    actions: z.array(z.object({
        type: z.string(),
        config: z.record(z.unknown()),
    })),
    projectId: z.string().optional(),
    enabled: z.boolean().optional(),
});

/**
 * GET /api/agency/automations
 * List all automation rules for the current user
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
        const projectId = searchParams.get('projectId');

        const rules = await prisma.automationRule.findMany({
            where: {
                userId: user.id,
                ...(projectId ? { projectId } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ success: true, data: rules });
    } catch (error) {
        console.error('[Automations API] GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
    }
}

/**
 * POST /api/agency/automations
 * Create a new automation rule
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
        const validated = CreateRuleSchema.parse(body);

        const rule = await prisma.automationRule.create({
            data: {
                userId: user.id,
                name: validated.name,
                description: validated.description,
                trigger: validated.trigger,
                triggerConfig: validated.triggerConfig || null,
                conditions: validated.conditions || null,
                actions: validated.actions,
                projectId: validated.projectId,
                enabled: validated.enabled ?? true,
            },
        });

        return NextResponse.json({ success: true, data: rule }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Automations API] POST error:', error);
        return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
    }
}
