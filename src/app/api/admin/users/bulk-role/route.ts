import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bulkUpdateRoleSchema = z.object({
  userIds: z.array(z.string()),
  role: z.enum(['ADMIN', 'EDITOR', 'USER']),
});

// PUT /api/admin/users/bulk-role - Bulk update user roles
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
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = bulkUpdateRoleSchema.parse(body);

    // Prevent changing own role
    if (validatedData.userIds.includes(user.id)) {
      return NextResponse.json(
        { success: false, message: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user roles
    await prisma.user.updateMany({
      where: {
        id: {
          in: validatedData.userIds,
        },
      },
      data: {
        role: validatedData.role,
      },
    });

    // Log activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'BULK_UPDATE_USER_ROLES',
        entityType: 'USER',
        entityId: 'bulk',
        details: JSON.stringify({
          userIds: validatedData.userIds,
          newRole: validatedData.role,
          count: validatedData.userIds.length,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `${validatedData.userIds.length} user roles updated successfully`,
    });
  } catch (error) {
    console.error('Bulk update user roles error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update user roles' },
      { status: 500 }
    );
  }
}

