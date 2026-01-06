import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { strategyInputSchema } from '@/dtos/strategy.dto';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/strategies/[id] - Get specific strategy
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

    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: userId, // Ensure user can only access their own strategies
      },
      select: {
        id: true,
        userId: true,
        name: true,
        input: true,
        output: true,
        generatedBy: true,
        status: true,
        tags: true,
        notes: true,
        version: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            versions: true,
          },
        },
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy not found' },
        { status: 404 }
      );
    }

    // Parse JSON strings back to objects
    const responseStrategy = {
      ...strategy,
      input: JSON.parse(strategy.input),
      output: strategy.output ? JSON.parse(strategy.output) : null,
      tags: strategy.tags ? strategy.tags.split(',').map(t => t.trim()) : [],
      commentCount: strategy._count.comments,
      versionCount: strategy._count.versions,
    };

    return NextResponse.json({
      success: true,
      data: responseStrategy,
    });
  } catch (error) {
    console.error('Get strategy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/strategies/[id] - Update strategy
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

    // Check if strategy exists and belongs to user
    const existingStrategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!existingStrategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, status, tags, notes, input: strategyInput } = body;

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.join(', ') : tags;
    if (notes !== undefined) updateData.notes = notes;

    // If input is provided, validate and update
    if (strategyInput) {
      const validationResult = strategyInputSchema.safeParse(strategyInput);
      if (!validationResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: validationResult.error.errors,
          },
          { status: 400 }
        );
      }

      updateData.input = JSON.stringify(validationResult.data);
      updateData.output = null; // Clear output to trigger regeneration
      updateData.generatedBy = 'AI'; // Reset to AI for regeneration
    }

    updateData.updatedAt = new Date();

    // Update strategy
    const updatedStrategy = await prisma.marketingStrategy.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        userId: true,
        name: true,
        input: true,
        output: true,
        generatedBy: true,
        status: true,
        tags: true,
        notes: true,
        version: true,
        isArchived: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Parse response
    const responseStrategy = {
      ...updatedStrategy,
      input: JSON.parse(updatedStrategy.input),
      output: updatedStrategy.output ? JSON.parse(updatedStrategy.output) : null,
      tags: updatedStrategy.tags ? updatedStrategy.tags.split(',').map(t => t.trim()) : [],
    };

    return NextResponse.json({
      success: true,
      data: responseStrategy,
      message: strategyInput ? 'Strategy updated successfully. Regeneration in progress.' : 'Strategy updated successfully.',
    });

  } catch (error) {
    console.error('Update strategy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/strategies/[id] - Delete strategy
export async function DELETE(
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

    // Check if strategy exists and belongs to user
    const existingStrategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!existingStrategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy not found' },
        { status: 404 }
      );
    }

    // Delete the strategy
    await prisma.marketingStrategy.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Strategy deleted successfully',
    });

  } catch (error) {
    console.error('Delete strategy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
