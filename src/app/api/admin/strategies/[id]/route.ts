/**
 * Admin Strategy Management API
 * 
 * DELETE /api/admin/strategies/:id - Delete strategy
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logStrategyAction } from '@/lib/services/audit-logger';

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
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const strategy = await prisma.marketingStrategy.findUnique({
      where: { id: id },
      select: { id: true, userId: true },
    });

    if (!strategy) {
      return NextResponse.json(
        { success: false, message: 'Strategy not found' },
        { status: 404 }
      );
    }

    await prisma.marketingStrategy.delete({
      where: { id: id },
    });

    // Log activity
    await logStrategyAction(
      userId,
      'STRATEGY_DELETED',
      id,
      { deletedByAdmin: true, originalUserId: strategy.userId }
    );

    return NextResponse.json({
      success: true,
      message: 'Strategy deleted successfully',
    });
  } catch (error) {
    console.error('Delete strategy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete strategy' },
      { status: 500 }
    );
  }
}

