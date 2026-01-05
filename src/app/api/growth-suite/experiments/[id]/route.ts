/**
 * Growth Suite Single Experiment API
 * 
 * GET /api/growth-suite/experiments/[id] - Get experiment details
 * PUT /api/growth-suite/experiments/[id] - Update experiment
 * DELETE /api/growth-suite/experiments/[id] - Delete experiment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const experiment = await prisma.experiment.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!experiment) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      experiment: {
        ...experiment,
        variants: JSON.parse(experiment.variants),
        trafficSplit: JSON.parse(experiment.trafficSplit),
        targetingRules: experiment.targetingRules ? JSON.parse(experiment.targetingRules) : null,
      },
    });

  } catch (error) {
    console.error('Experiment GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      variants,
      trafficSplit,
      targetingRules,
      status,
    } = body;

    // Verify ownership
    const existing = await prisma.experiment.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    // Update experiment
    const experiment = await prisma.experiment.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(variants && { variants: JSON.stringify(variants) }),
        ...(trafficSplit && { trafficSplit: JSON.stringify(trafficSplit) }),
        ...(targetingRules !== undefined && {
          targetingRules: targetingRules ? JSON.stringify(targetingRules) : null
        }),
        ...(status && { status }),
        ...(status === 'running' && !existing.startDate && { startDate: new Date() }),
        ...(status === 'completed' && !existing.endDate && { endDate: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      experiment: {
        ...experiment,
        variants: JSON.parse(experiment.variants),
        trafficSplit: JSON.parse(experiment.trafficSplit),
        targetingRules: experiment.targetingRules ? JSON.parse(experiment.targetingRules) : null,
      },
    });

  } catch (error) {
    console.error('Experiment PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify ownership
    const existing = await prisma.experiment.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Experiment not found' },
        { status: 404 }
      );
    }

    // Delete experiment (cascade will delete events)
    await prisma.experiment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Experiment deleted',
    });

  } catch (error) {
    console.error('Experiment DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
