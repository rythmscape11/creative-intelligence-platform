/**
 * Strategy Version Restore API
 * 
 * POST /api/strategies/:id/versions/:versionId/restore - Restore a specific version
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { userId } = await auth();
    const { id, versionId } = await params;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the version to restore
    const version = await prisma.strategyVersion.findUnique({
      where: { id: versionId },
      include: {
        strategy: true,
      },
    });

    if (!version) {
      return NextResponse.json(
        { success: false, message: 'Version not found' },
        { status: 404 }
      );
    }

    if (version.strategyId !== id) {
      return NextResponse.json(
        { success: false, message: 'Version does not belong to this strategy' },
        { status: 400 }
      );
    }

    // Check if user has access to this strategy
    const strategy = version.strategy;
    if (strategy.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'You do not have permission to restore this version' },
        { status: 403 }
      );
    }

    // Update the strategy with the version's content
    const updatedStrategy = await prisma.marketingStrategy.update({
      where: { id },
      data: {
        output: version.output,
        input: version.input,
        updatedAt: new Date(),
      },
    });

    // Create a new version for the restore action
    const latestVersion = await prisma.strategyVersion.findFirst({
      where: { strategyId: id },
      orderBy: { version: 'desc' },
    });

    const newVersionNumber = (latestVersion?.version || 0) + 1;

    await prisma.strategyVersion.create({
      data: {
        strategyId: id,
        version: newVersionNumber,
        input: version.input,
        output: version.output,
        createdBy: user.id,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'RESTORE_STRATEGY_VERSION',
        entityType: 'STRATEGY',
        entityId: id,
        details: JSON.stringify({
          restoredFromVersion: version.version,
          newVersion: newVersionNumber,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Version restored successfully',
      data: {
        strategy: updatedStrategy,
        newVersion: newVersionNumber,
      },
    });
  } catch (error) {
    console.error('Restore version error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to restore version' },
      { status: 500 }
    );
  }
}

