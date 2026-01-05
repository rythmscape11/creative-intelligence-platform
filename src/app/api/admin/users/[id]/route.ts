/**
 * Admin User Management API
 * 
 * GET /api/admin/users/:id - Get user details
 * DELETE /api/admin/users/:id - Delete user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { logUserAction } from '@/lib/services/audit-logger';

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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            strategies: true,
            blogPosts: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

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

    // Prevent deleting own account
    if (targetUser.id === userId) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Prevent deleting other admins
    if (targetUser.role === 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete admin users' },
        { status: 400 }
      );
    }

    // Delete user and all associated data
    await prisma.$transaction([
      // Delete user activities
      prisma.userActivity.deleteMany({
        where: { userId: id },
      }),
      // Delete strategies
      prisma.marketingStrategy.deleteMany({
        where: { userId: id },
      }),
      // Delete blog posts
      prisma.blogPost.deleteMany({
        where: { authorId: id },
      }),
      // Delete analytics
      prisma.analytics.deleteMany({
        where: { userId: id },
      }),
      // Finally delete the user
      prisma.user.delete({
        where: { id: id },
      }),
    ]);

    // Log the action
    await logUserAction(
      userId,
      'USER_DELETED',
      targetUser.id,
      {
        targetUserEmail: targetUser.email,
        targetUserRole: targetUser.role,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

