/**
 * Admin Blog Categories API
 * 
 * GET /api/admin/blog/categories - Get all categories
 * POST /api/admin/blog/categories - Create category
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

export async function GET(request: NextRequest) {
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
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin or Editor access required' },
        { status: 403 }
      );
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            blogPosts: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      select: { role: true },
    });

    if (user?.role !== 'ADMIN' && user?.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin or Editor access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, slug, description } = categorySchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Category slug already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    // Log activity
    await logContentAction(
      userId,
      'CATEGORY_CREATED',
      'CATEGORY',
      category.id,
      { name, slug }
    );

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully',
    });
  } catch (error) {
    console.error('Create category error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}

