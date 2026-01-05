import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { canUsePremiumFeature } from '@/config/pricing';

export const dynamic = 'force-dynamic';

// Save a tool result
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { toolId, toolName, category, input, output, title, notes } = body;

    // Validate required fields
    if (!toolId || !toolName || !category || !input || !output) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has permission to save results
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userPlan = user.subscription?.plan || 'FREE';

    if (!canUsePremiumFeature(userPlan, 'savedResults')) {
      return NextResponse.json(
        { error: 'Upgrade to Pro to save results', upgrade: true },
        { status: 403 }
      );
    }

    // Create saved result
    const savedResult = await prisma.savedToolResult.create({
      data: {
        userId: userId,
        toolId,
        toolName,
        category,
        input,
        output,
        title: title || `${toolName} - ${new Date().toLocaleDateString()}`,
        notes: notes || null,
      },
    });

    // Track premium feature usage
    await prisma.premiumFeatureUsage.create({
      data: {
        userId: userId,
        feature: 'save-result',
        toolId,
        metadata: { resultId: savedResult.id },
      },
    });

    return NextResponse.json({
      success: true,
      result: savedResult,
    });
  } catch (error) {
    console.error('Save result error:', error);
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    );
  }
}

// Get all saved results for a user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {
      userId: userId,
    };

    if (toolId) {
      where.toolId = toolId;
    }

    if (category) {
      where.category = category;
    }

    const [results, total] = await Promise.all([
      prisma.savedToolResult.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.savedToolResult.count({ where }),
    ]);

    return NextResponse.json({
      results,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get saved results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

// Delete a saved result
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get('id');

    if (!resultId) {
      return NextResponse.json(
        { error: 'Result ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const result = await prisma.savedToolResult.findUnique({
      where: { id: resultId },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      );
    }

    if (result.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete result
    await prisma.savedToolResult.delete({
      where: { id: resultId },
    });

    return NextResponse.json({
      success: true,
      message: 'Result deleted',
    });
  } catch (error) {
    console.error('Delete result error:', error);
    return NextResponse.json(
      { error: 'Failed to delete result' },
      { status: 500 }
    );
  }
}

