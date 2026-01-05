import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logger } from '@/lib/services/logger-service';
import { requireCsrfToken } from '@/lib/csrf';

const updateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['ADMIN', 'EDITOR', 'USER']),
});

// PUT /api/admin/users/role - Update user role
export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate CSRF token
    const csrfToken = request.headers.get('x-csrf-token') || body._csrf;
    const csrfValidation = await requireCsrfToken(csrfToken);

    if (!csrfValidation.valid) {
      logger.warn('CSRF validation failed for role update', { adminId: user.id });
      return NextResponse.json(
        { success: false, message: csrfValidation.error || 'CSRF validation failed' },
        { status: 403 }
      );
    }

    const validatedData = updateRoleSchema.parse(body);

    // Prevent changing own role
    if (validatedData.userId === user.id) {
      return NextResponse.json(
        { success: false, message: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: validatedData.userId },
      data: { role: validatedData.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'UPDATE_USER_ROLE',
        entityType: 'USER',
        entityId: validatedData.userId,
        details: JSON.stringify({ newRole: validatedData.role }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User role updated successfully',
    });
  } catch (error) {
    logger.error('Update user role error', error as Error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

