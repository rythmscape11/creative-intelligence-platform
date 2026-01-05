import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// POST /api/strategies/[id]/duplicate - Duplicate a strategy
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



    // Get original strategy
    const originalStrategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!originalStrategy) {
      return NextResponse.json(
        { success: false, error: 'Strategy not found' },
        { status: 404 }
      );
    }

    // Parse input to get business name
    const input = JSON.parse(originalStrategy.input);
    const newName = originalStrategy.name
      ? `${originalStrategy.name} (Copy)`
      : `${input.businessName} (Copy)`;

    // Create duplicate
    const duplicateStrategy = await prisma.marketingStrategy.create({
      data: {
        userId: userId,
        name: newName,
        input: originalStrategy.input,
        output: originalStrategy.output,
        generatedBy: originalStrategy.generatedBy,
        status: 'DRAFT', // Always start as draft
        tags: originalStrategy.tags,
        notes: originalStrategy.notes ? `Duplicated from original strategy\n\n${originalStrategy.notes}` : 'Duplicated from original strategy',
        version: 1, // Reset version
        isArchived: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Strategy duplicated successfully',
      data: {
        ...duplicateStrategy,
        input: JSON.parse(duplicateStrategy.input),
        output: duplicateStrategy.output ? JSON.parse(duplicateStrategy.output) : null,
        tags: duplicateStrategy.tags ? duplicateStrategy.tags.split(',').map(t => t.trim()) : [],
      },
    });
  } catch (error) {
    console.error('Duplicate strategy error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

