import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

const shareSchema = z.object({
  sharedWith: z.string().email().optional(),
  accessLevel: z.enum(['VIEW', 'COMMENT', 'EDIT']).default('VIEW'),
  expiresIn: z.number().optional(), // Days until expiration
});

// POST /api/strategies/[id]/share - Create share link
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
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

    // Check if strategy exists and user has access
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, message: 'Strategy not found or access denied' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = shareSchema.parse(body);

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Calculate expiration date
    let expiresAt: Date | null = null;
    if (validatedData.expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validatedData.expiresIn);
    }

    // Create share
    const share = await prisma.strategyShare.create({
      data: {
        strategyId: id,
        sharedBy: user.id,
        sharedWith: validatedData.sharedWith,
        accessLevel: validatedData.accessLevel,
        token,
        expiresAt,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'SHARE_STRATEGY',
        entityType: 'STRATEGY',
        entityId: id,
        details: JSON.stringify({
          sharedWith: validatedData.sharedWith,
          accessLevel: validatedData.accessLevel,
        }),
      },
    });

    const shareUrl = `${process.env.NEXTAUTH_URL}/shared/strategy/${token}`;

    return NextResponse.json({
      success: true,
      data: {
        id: share.id,
        token: share.token,
        shareUrl,
        accessLevel: share.accessLevel,
        expiresAt: share.expiresAt,
      },
      message: 'Strategy shared successfully',
    });
  } catch (error) {
    console.error('Share strategy error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to share strategy' },
      { status: 500 }
    );
  }
}

// GET /api/strategies/[id]/share - Get all shares for a strategy
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
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

    // Check if strategy exists and user has access
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, message: 'Strategy not found or access denied' },
        { status: 404 }
      );
    }

    const shares = await prisma.strategyShare.findMany({
      where: {
        strategyId: id,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const sharesWithUrls = shares.map(share => ({
      ...share,
      shareUrl: `${process.env.NEXTAUTH_URL}/shared/strategy/${share.token}`,
    }));

    return NextResponse.json({
      success: true,
      data: sharesWithUrls,
    });
  } catch (error) {
    console.error('Get shares error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get shares' },
      { status: 500 }
    );
  }
}

// DELETE /api/strategies/[id]/share - Revoke all shares
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
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

    // Check if strategy exists and user has access
    const strategy = await prisma.marketingStrategy.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, message: 'Strategy not found or access denied' },
        { status: 404 }
      );
    }

    // Deactivate all shares
    await prisma.strategyShare.updateMany({
      where: {
        strategyId: id,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'All shares revoked successfully',
    });
  } catch (error) {
    console.error('Revoke shares error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to revoke shares' },
      { status: 500 }
    );
  }
}
