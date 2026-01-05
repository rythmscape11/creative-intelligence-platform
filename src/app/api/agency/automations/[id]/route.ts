/**
 * Automation Rule by ID API
 * GET, PATCH, DELETE operations for individual rules
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for updates
const UpdateRuleSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    trigger: z.string().optional(),
    triggerConfig: z.record(z.unknown()).optional(),
    conditions: z.array(z.object({
        field: z.string(),
        operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
        value: z.union([z.string(), z.number(), z.boolean()]),
    })).optional(),
    actions: z.array(z.object({
        type: z.string(),
        config: z.record(z.unknown()),
    })).optional(),
    enabled: z.boolean().optional(),
});

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/agency/automations/[id]
 */
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const rule = await prisma.automationRule.findFirst({
            where: { id, userId: user.id },
        });

        if (!rule) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: rule });
    } catch (error) {
        console.error('[Automations API] GET by ID error:', error);
        return NextResponse.json({ error: 'Failed to fetch rule' }, { status: 500 });
    }
}

/**
 * PATCH /api/agency/automations/[id]
 * Update rule (including toggle enabled)
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify ownership
        const existing = await prisma.automationRule.findFirst({
            where: { id, userId: user.id },
        });
        if (!existing) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        const body = await req.json();
        const validated = UpdateRuleSchema.parse(body);

        const updated = await prisma.automationRule.update({
            where: { id },
            data: {
                ...validated,
                triggerConfig: validated.triggerConfig || undefined,
                conditions: validated.conditions || undefined,
                actions: validated.actions || undefined,
            },
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
        }
        console.error('[Automations API] PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
    }
}

/**
 * DELETE /api/agency/automations/[id]
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await context.params;
        const user = await prisma.user.findUnique({ where: { clerkId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify ownership
        const existing = await prisma.automationRule.findFirst({
            where: { id, userId: user.id },
        });
        if (!existing) {
            return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
        }

        await prisma.automationRule.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Automations API] DELETE error:', error);
        return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 });
    }
}
