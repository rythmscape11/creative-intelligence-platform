/**
 * Admin User Role Management API
 * 
 * PATCH /api/admin/users/:id/role - Update user role
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logUserAction } from '@/lib/services/audit-logger';

const roleSchema = z.object({
  role: z.enum(['USER', 'EDITOR', 'ADMIN']),
});

export async function PATCH(
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

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (adminUser?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { role } = roleSchema.parse(body);

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: id },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent changing own role
    if (targetUser.id === userId) {
      return NextResponse.json(
        { success: false, message: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Log the action
    await logUserAction(
      userId,
      'USER_ROLE_CHANGED',
      targetUser.id,
      {
        oldRole: targetUser.role,
        newRole: role,
        targetUserEmail: targetUser.email,
      }
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User role updated successfully',
    });
  } catch (error) {
    console.error('Update user role error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid role', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

