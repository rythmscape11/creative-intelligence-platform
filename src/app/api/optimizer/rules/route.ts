import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/optimizer/rules - List all automation rules
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const rules = await prisma.optimizerRule.findMany({
            where: { userId },
            include: {
                _count: {
                    select: { executions: true }
                },
                executions: {
                    take: 5,
                    orderBy: { triggeredAt: 'desc' },
                    select: {
                        id: true,
                        status: true,
                        triggeredAt: true,
                        executedAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ rules });
    } catch (error) {
        console.error('[Optimizer Rules] GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rules' },
            { status: 500 }
        );
    }
}

// POST /api/optimizer/rules - Create new automation rule
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            name,
            description,
            conditions,
            conditionLogic = 'AND',
            actionType,
            actionParams,
            scope,
            runFrequency = 'DAILY',
            maxActionsPerDay = 10,
            requireApproval = false
        } = body;

        if (!name || !conditions || !actionType || !actionParams || !scope) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const rule = await prisma.optimizerRule.create({
            data: {
                userId,
                name,
                description,
                conditions,
                conditionLogic,
                actionType,
                actionParams,
                scope,
                runFrequency,
                maxActionsPerDay,
                requireApproval,
                status: 'DRAFT'
            }
        });

        return NextResponse.json({ rule }, { status: 201 });
    } catch (error) {
        console.error('[Optimizer Rules] POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create rule' },
            { status: 500 }
        );
    }
}

// PATCH /api/optimizer/rules - Update rule status (bulk toggle)
export async function PATCH(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ruleId, status } = body;

        if (!ruleId || !status) {
            return NextResponse.json(
                { error: 'Rule ID and status required' },
                { status: 400 }
            );
        }

        // Verify ownership
        const rule = await prisma.optimizerRule.findFirst({
            where: { id: ruleId, userId }
        });

        if (!rule) {
            return NextResponse.json(
                { error: 'Rule not found' },
                { status: 404 }
            );
        }

        const updated = await prisma.optimizerRule.update({
            where: { id: ruleId },
            data: { status }
        });

        return NextResponse.json({ rule: updated });
    } catch (error) {
        console.error('[Optimizer Rules] PATCH error:', error);
        return NextResponse.json(
            { error: 'Failed to update rule' },
            { status: 500 }
        );
    }
}
