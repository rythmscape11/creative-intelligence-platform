/**
 * Admin Settings API
 * 
 * GET /api/admin/settings - Get all settings
 * PUT /api/admin/settings - Update settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { logSystemAction } from '@/lib/services/audit-logger';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const settingsSchema = z.record(z.string(), z.any());

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

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const settings = await prisma.siteSettings.findMany({
      orderBy: { key: 'asc' },
    });

    // Convert to key-value object
    const settingsObject = settings.reduce((acc, setting) => {
      try {
        acc[setting.key] = JSON.parse(setting.value);
      } catch {
        acc[setting.key] = setting.value;
      }
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      data: settingsObject,
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

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
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const settings = settingsSchema.parse(body);

    // Update each setting
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: {
          value: typeof value === 'string' ? value : JSON.stringify(value),
        },
        create: {
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          category: 'general',
        },
      })
    );

    await Promise.all(updates);

    // Log activity
    await logSystemAction(
      userId,
      'SYSTEM_CONFIG_CHANGED',
      { settingsUpdated: Object.keys(settings) }
    );

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Update settings error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
