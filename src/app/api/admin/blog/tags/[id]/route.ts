/**
 * Admin Blog Tag Management API
 * 
 * PUT /api/admin/blog/tags/:id - Update tag
 * DELETE /api/admin/blog/tags/:id - Delete tag
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logContentAction } from '@/lib/services/audit-logger';

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
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
    const { name, slug } = tagSchema.parse(body);

    // Check if slug already exists (excluding current tag)
    const existing = await prisma.tag.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Tag slug already exists' },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    // Log activity
    await logContentAction(
      userId,
      'TAG_UPDATED',
      'TAG',
      tag.id,
      { name, slug }
    );

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag updated successfully',
    });
  } catch (error) {
    console.error('Update tag error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update tag' },
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

    const tag = await prisma.tag.findUnique({
      where: { id: id },
    });

    if (!tag) {
      return NextResponse.json(
        { success: false, message: 'Tag not found' },
        { status: 404 }
      );
    }

    // Delete tag (posts will be automatically unlinked due to many-to-many relationship)
    await prisma.tag.delete({
      where: { id: id },
    });

    // Log activity
    await logContentAction(
      userId,
      'TAG_DELETED',
      'TAG',
      id,
      { name: tag.name }
    );

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}

