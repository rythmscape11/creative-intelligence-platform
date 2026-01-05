import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/strategies/[id]/versions - Get version history
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }



    // Verify strategy ownership
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy not found' },
        { status: 404 }
      );
    }

    // Get version history
    const versions = await prisma.strategyVersion.findMany({
      where: {
        strategyId: id,
      },
      orderBy: {
        version: 'desc',
      },
    });

    // Parse JSON strings
    const parsedVersions = versions.map(v => ({
      ...v,
      input: JSON.parse(v.input),
      output: v.output ? JSON.parse(v.output) : null,
    }));

    return NextResponse.json({
      success: true,
      data: parsedVersions,
    });
  } catch (error) {
    console.error('Get versions error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/strategies/[id]/versions - Create new version (save current state)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }



    // Get current strategy
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy not found' },
        { status: 404 }
      );
    }

    // Create version snapshot
    const version = await prisma.strategyVersion.create({
      data: {
        strategyId: id,
        version: strategy.version,
        input: strategy.input,
        output: strategy.output || '',
        createdBy: userId,
      },
    });

    // Increment strategy version
    await prisma.marketingStrategy.update({
      where: { id },
      data: {
        version: strategy.version + 1,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...version,
        input: JSON.parse(version.input),
        output: version.output ? JSON.parse(version.output) : null,
      },
    });
  } catch (error) {
    console.error('Create version error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/strategies/[id]/versions - Restore to specific version
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }


    const body = await req.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { success: false, error: 'Version ID is required' },
        { status: 400 }
      );
    }

    // Verify strategy ownership
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy not found' },
        { status: 404 }
      );
    }

    // Get version to restore
    const version = await prisma.strategyVersion.findFirst({
      where: {
        id: versionId,
        strategyId: id,
      },
    });

    if (!version) {
      return NextResponse.json(
        { success: false, error: 'Version not found' },
        { status: 404 }
      );
    }

    // Save current state as a version before restoring
    await prisma.strategyVersion.create({
      data: {
        strategyId: id,
        version: strategy.version,
        input: strategy.input,
        output: strategy.output || '',
        createdBy: userId,
      },
    });

    // Restore strategy to selected version
    const updatedStrategy = await prisma.marketingStrategy.update({
      where: { id },
      data: {
        input: version.input,
        output: version.output,
        version: strategy.version + 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Strategy restored to version ${version.version}`,
      data: {
        ...updatedStrategy,
        input: JSON.parse(updatedStrategy.input),
        output: updatedStrategy.output ? JSON.parse(updatedStrategy.output) : null,
      },
    });
  } catch (error) {
    console.error('Restore version error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

