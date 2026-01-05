import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  serverPrefix: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  settings: z.any().optional(),
  isActive: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ERROR', 'PENDING']).optional(),
});

/**
 * GET /api/integrations/[id]
 * Get a specific integration
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const integration = await prisma.integration.findFirst({
      where: {
        id,
        userId: user.id,
      },
      select: {
        id: true,
        type: true,
        category: true,
        name: true,
        description: true,
        status: true,
        isActive: true,
        lastSyncAt: true,
        lastError: true,
        errorCount: true,
        createdAt: true,
        updatedAt: true,
        serverPrefix: true,
        webhookUrl: true,
        settings: true,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      integration,
    });
  } catch (error: any) {
    console.error('Failed to fetch integration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integration', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/integrations/[id]
 * Update an integration
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    // Build update data
    const updateData: any = {};

    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.serverPrefix !== undefined) updateData.serverPrefix = validatedData.serverPrefix;
    if (validatedData.webhookUrl !== undefined) updateData.webhookUrl = validatedData.webhookUrl;
    if (validatedData.settings !== undefined) updateData.settings = validatedData.settings;
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;

    // Encrypt sensitive fields if provided
    if (validatedData.apiKey) {
      updateData.apiKey = encrypt(validatedData.apiKey);
    }
    if (validatedData.apiSecret) {
      updateData.apiSecret = encrypt(validatedData.apiSecret);
    }
    if (validatedData.accessToken) {
      updateData.accessToken = encrypt(validatedData.accessToken);
    }
    if (validatedData.refreshToken) {
      updateData.refreshToken = encrypt(validatedData.refreshToken);
    }

    const integration = await prisma.integration.update({
      where: {
        id,
        userId: user.id,
      },
      data: updateData,
      select: {
        id: true,
        type: true,
        category: true,
        name: true,
        description: true,
        status: true,
        isActive: true,
        lastSyncAt: true,
        createdAt: true,
        updatedAt: true,
        serverPrefix: true,
        webhookUrl: true,
        settings: true,
      },
    });

    return NextResponse.json({
      success: true,
      integration,
      message: 'Integration updated successfully',
    });
  } catch (error: any) {
    console.error('Failed to update integration:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update integration', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/integrations/[id]
 * Delete an integration
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.integration.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Integration deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete integration:', error);
    return NextResponse.json(
      { error: 'Failed to delete integration', details: error.message },
      { status: 500 }
    );
  }
}

