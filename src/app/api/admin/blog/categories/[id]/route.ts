/**
 * Admin Blog Category Management API
 * 
 * PUT /api/admin/blog/categories/:id - Update category
 * DELETE /api/admin/blog/categories/:id - Delete category
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logContentAction } from '@/lib/services/audit-logger';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
});

export async function PUT(
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

    if (user?.role !== 'ADMIN' && user?.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin or Editor access required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, slug, description } = categorySchema.parse(body);

    // Check if slug already exists (excluding current category)
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        NOT: { id: id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Category slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.update({
      where: { id: id },
      data: {
        name,
        slug,
        description,
      },
    });

    // Log activity
    await logContentAction(
      userId,
      'CATEGORY_UPDATED',
      'CATEGORY',
      category.id,
      { name, slug }
    );

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    });
  } catch (error) {
    console.error('Update category error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update category' },
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

    // Check if category has posts
    const category = await prisma.category.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            blogPosts: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    if (category._count.blogPosts > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category with posts. Please reassign posts first.' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: id },
    });

    // Log activity
    await logContentAction(
      userId,
      'CATEGORY_DELETED',
      'CATEGORY',
      id,
      { name: category.name }
    );

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}

