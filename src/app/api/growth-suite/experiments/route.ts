/**
 * Experiments API
 * CRUD for Growth Suite A/B experiments
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema matching existing Experiment model
const CreateExperimentSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  variants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    weight: z.number().optional(),
  })),
  trafficSplit: z.record(z.number()).optional(),
  targetingRules: z.record(z.unknown()).optional(),
});

/**
 * GET /api/growth-suite/experiments
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

    const experiments = await prisma.experiment.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { events: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to include parsed JSON and event count
    const data = experiments.map(exp => ({
      id: exp.id,
      name: exp.name,
      description: exp.description,
      variants: JSON.parse(exp.variants || '[]'),
      trafficSplit: JSON.parse(exp.trafficSplit || '{}'),
      targetingRules: exp.targetingRules ? JSON.parse(exp.targetingRules) : null,
      status: exp.status,
      startDate: exp.startDate,
      endDate: exp.endDate,
      eventCount: exp._count.events,
      createdAt: exp.createdAt,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[Experiments API] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch experiments' }, { status: 500 });
  }
}

/**
 * POST /api/growth-suite/experiments
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
    const validated = CreateExperimentSchema.parse(body);

    const experiment = await prisma.experiment.create({
      data: {
        userId: user.id,
        name: validated.name,
        description: validated.description,
        variants: JSON.stringify(validated.variants),
        trafficSplit: JSON.stringify(validated.trafficSplit || {}),
        targetingRules: validated.targetingRules
          ? JSON.stringify(validated.targetingRules)
          : null,
        status: 'draft',
      },
    });

    return NextResponse.json({ success: true, data: experiment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('[Experiments API] POST error:', error);
    return NextResponse.json({ error: 'Failed to create experiment' }, { status: 500 });
  }
}
