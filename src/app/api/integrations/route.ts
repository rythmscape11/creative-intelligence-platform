import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';
import { z } from 'zod';

// Validation schema for creating/updating integration
const integrationSchema = z.object({
  type: z.enum([
    'MAILCHIMP',
    'CONVERTKIT',
    'SENDGRID',
    'BREVO',
    'MEDIUM',
    'DEVTO',
    'HASHNODE',
    'CANVA',
    'FIGMA',
    'UNSPLASH',
    'STRIPE',
    'PAYPAL',
    'WOOCOMMERCE',
    'SHOPIFY',
    'GOOGLE_ANALYTICS',
    'MIXPANEL',
    'HOTJAR',
    'PLAUSIBLE',
    'HUBSPOT',
    'SALESFORCE',
    'PIPEDRIVE',
    'BUFFER',
    'HOOTSUITE',
    'CUSTOM_WEBHOOK',
  ]),
  category: z.enum([
    'EMAIL_MARKETING',
    'BLOG_TOOLS',
    'DESIGN_TOOLS',
    'ECOMMERCE',
    'ANALYTICS',
    'CRM',
    'SOCIAL_MEDIA',
    'CUSTOM',
  ]),
  name: z.string().min(1),
  description: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  serverPrefix: z.string().optional(),
  webhookUrl: z.string().url().optional(),
  settings: z.any().optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/integrations
 * Fetch all integrations for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    // Build where clause
    const where: any = { userId: user.id };
    if (category) where.category = category;
    if (type) where.type = type;
    if (isActive !== null) where.isActive = isActive === 'true';

    const integrations = await prisma.integration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
        // Don't return encrypted credentials
      },
    });

    return NextResponse.json({
      success: true,
      integrations,
      count: integrations.length,
    });
  } catch (error: any) {
    console.error('Failed to fetch integrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch integrations', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/integrations
 * Create a new integration
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

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

    // Only admins can create integrations
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can create integrations' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = integrationSchema.parse(body);

    // Encrypt sensitive fields
    const encryptedData: any = {
      userId: user.id,
      type: validatedData.type,
      category: validatedData.category,
      name: validatedData.name,
      description: validatedData.description,
      serverPrefix: validatedData.serverPrefix,
      webhookUrl: validatedData.webhookUrl,
      settings: validatedData.settings,
      isActive: validatedData.isActive ?? false,
      status: 'PENDING',
    };

    if (validatedData.apiKey) {
      encryptedData.apiKey = encrypt(validatedData.apiKey);
    }
    if (validatedData.apiSecret) {
      encryptedData.apiSecret = encrypt(validatedData.apiSecret);
    }
    if (validatedData.accessToken) {
      encryptedData.accessToken = encrypt(validatedData.accessToken);
    }
    if (validatedData.refreshToken) {
      encryptedData.refreshToken = encrypt(validatedData.refreshToken);
    }

    const integration = await prisma.integration.create({
      data: encryptedData,
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
      message: 'Integration created successfully',
    });
  } catch (error: any) {
    console.error('Failed to create integration:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create integration', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/integrations
 * Delete an integration
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

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

    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get('id');

    if (!integrationId) {
      return NextResponse.json(
        { error: 'Integration ID is required' },
        { status: 400 }
      );
    }

    await prisma.integration.delete({
      where: { id: integrationId, userId: user.id },
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

