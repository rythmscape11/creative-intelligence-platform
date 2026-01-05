import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { listTags, createTag, tagSubscriber, untagSubscriber } from '@/lib/convertkit';
import { z } from 'zod';

/**
 * GET /api/integrations/convertkit/tags
 * List all tags
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find the integration
    const integration = await prisma.integration.findFirst({
      where: {
        userId: userId,
        type: 'CONVERTKIT',
        isActive: true,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'ConvertKit integration not found or not active' },
        { status: 404 }
      );
    }

    if (!integration.apiKey || !integration.apiSecret) {
      return NextResponse.json(
        { error: 'ConvertKit API credentials not found' },
        { status: 400 }
      );
    }

    // Decrypt credentials
    const apiKey = decrypt(integration.apiKey);
    const apiSecret = decrypt(integration.apiSecret);

    // List tags
    const tagsData = await listTags({ apiKey, apiSecret });

    return NextResponse.json({
      success: true,
      tags: tagsData.tags,
    });
  } catch (error: any) {
    console.error('Error listing ConvertKit tags:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to list tags' },
      { status: 500 }
    );
  }
}

const createTagSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
});

/**
 * POST /api/integrations/convertkit/tags
 * Create a new tag
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can create tags
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, id: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createTagSchema.parse(body);

    // Find the integration
    const integration = await prisma.integration.findFirst({
      where: {
        userId: userId,
        type: 'CONVERTKIT',
        isActive: true,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'ConvertKit integration not found or not active' },
        { status: 404 }
      );
    }

    if (!integration.apiKey || !integration.apiSecret) {
      return NextResponse.json(
        { error: 'ConvertKit API credentials not found' },
        { status: 400 }
      );
    }

    // Decrypt credentials
    const apiKey = decrypt(integration.apiKey);
    const apiSecret = decrypt(integration.apiSecret);

    // Create tag
    const tagResult = await createTag({ apiKey, apiSecret }, validatedData.name);

    // Log the action
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'SYNC',
        action: 'create_tag',
        status: 'SUCCESS',
        requestData: {
          tagName: validatedData.name,
        },
        responseData: {
          tagId: tagResult.tag.id,
          tagName: tagResult.tag.name,
        },
      },
    });

    return NextResponse.json({
      success: true,
      tag: tagResult.tag,
    });
  } catch (error: any) {
    console.error('Error creating ConvertKit tag:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create tag' },
      { status: 500 }
    );
  }
}

const tagSubscriberSchema = z.object({
  tagId: z.number(),
  email: z.string().email('Invalid email address'),
  action: z.enum(['tag', 'untag']),
});

/**
 * PUT /api/integrations/convertkit/tags
 * Tag or untag a subscriber
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = tagSubscriberSchema.parse(body);

    // Find the integration
    const integration = await prisma.integration.findFirst({
      where: {
        userId: userId,
        type: 'CONVERTKIT',
        isActive: true,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'ConvertKit integration not found or not active' },
        { status: 404 }
      );
    }

    if (!integration.apiKey || !integration.apiSecret) {
      return NextResponse.json(
        { error: 'ConvertKit API credentials not found' },
        { status: 400 }
      );
    }

    // Decrypt credentials
    const apiKey = decrypt(integration.apiKey);
    const apiSecret = decrypt(integration.apiSecret);

    // Tag or untag subscriber
    const result = validatedData.action === 'tag'
      ? await tagSubscriber({ apiKey, apiSecret }, validatedData.tagId, validatedData.email)
      : await untagSubscriber({ apiKey, apiSecret }, validatedData.tagId, validatedData.email);

    // Log the action
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'SYNC',
        action: validatedData.action === 'tag' ? 'tag_subscriber' : 'untag_subscriber',
        status: 'SUCCESS',
        requestData: {
          tagId: validatedData.tagId,
          email: validatedData.email,
        },
        recordsProcessed: 1,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
    });
  } catch (error: any) {
    console.error('Error tagging/untagging subscriber:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to tag/untag subscriber' },
      { status: 500 }
    );
  }
}

