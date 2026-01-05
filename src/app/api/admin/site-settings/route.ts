import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for site settings
const siteSettingsSchema = z.object({
  logo: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  darkModePrimaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  darkModeSecondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  darkModeAccentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

// GET /api/admin/site-settings - Get all site settings
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all site settings
    const settings = await prisma.siteSettings.findMany({
      where: {
        category: 'BRANDING',
      },
    });

    // Convert to key-value object
    const settingsObject: Record<string, any> = {};
    settings.forEach((setting) => {
      try {
        // Try to parse as JSON first
        settingsObject[setting.key] = JSON.parse(setting.value);
      } catch {
        // If not JSON, use as string
        settingsObject[setting.key] = setting.value;
      }
    });

    return NextResponse.json({
      success: true,
      data: settingsObject,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

// POST /api/admin/site-settings - Update site settings
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = siteSettingsSchema.parse(body);

    // Update each setting
    const updatePromises = Object.entries(validatedData).map(([key, value]) => {
      if (value === undefined) return Promise.resolve();

      return prisma.siteSettings.upsert({
        where: { key },
        update: {
          value: typeof value === 'string' ? value : JSON.stringify(value),
          category: 'BRANDING',
        },
        create: {
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          category: 'BRANDING',
          description: `Site ${key} setting`,
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Site settings updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}

