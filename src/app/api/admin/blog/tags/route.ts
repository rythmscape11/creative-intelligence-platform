/**
 * Admin Blog Tags API
 * 
 * GET /api/admin/blog/tags - Get all tags
 * POST /api/admin/blog/tags - Create tag
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

    const tags = await prisma.tag.findMany({
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
      data: tags,
    });
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tags' },
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
    const { name, slug } = tagSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Tag slug already exists' },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    // Log activity
    await logContentAction(
      userId,
      'TAG_CREATED',
      'TAG',
      tag.id,
      { name, slug }
    );

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag created successfully',
    });
  } catch (error) {
    console.error('Create tag error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

