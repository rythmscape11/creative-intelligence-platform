import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { addSubscriber, tagSubscriber } from '@/lib/convertkit';
import { z } from 'zod';

const syncSchema = z.object({
  source: z.enum(['LEAD_CAPTURE', 'SERVICE_INQUIRY', 'SERVICE_PURCHASE', 'MANUAL']),
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  fields: z.record(z.any()).optional(),
  tags: z.array(z.number()).optional(),
  tagNames: z.array(z.string()).optional(),
});

/**
 * POST /api/integrations/convertkit/sync
 * Sync a contact to ConvertKit
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = syncSchema.parse(body);

    console.log('Syncing contact to ConvertKit:', validatedData.email);

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

    const startTime = Date.now();

    try {
      // Add subscriber
      const subscriberResult = await addSubscriber(
        { apiKey, apiSecret },
        {
          email: validatedData.email,
          first_name: validatedData.firstName,
          fields: validatedData.fields,
          tags: validatedData.tags,
        }
      );

      console.log('Subscriber added to ConvertKit:', subscriberResult.subscription.id);

      // If tag names are provided, we need to tag the subscriber
      // (This would require looking up tag IDs first, which we'll skip for now)

      const duration = Date.now() - startTime;

      // Update last sync time
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          lastSyncAt: new Date(),
        },
      });

      // Log the sync
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'SYNC',
          action: `sync_${validatedData.source.toLowerCase()}`,
          status: 'SUCCESS',
          requestData: {
            email: validatedData.email,
            source: validatedData.source,
          },
          responseData: {
            subscriberId: subscriberResult.subscription.id,
            state: subscriberResult.subscription.state,
          },
          recordsProcessed: 1,
          duration,
        },
      });

      return NextResponse.json({
        success: true,
        subscriber: {
          id: subscriberResult.subscription.id,
          email: subscriberResult.subscription.email_address,
          state: subscriberResult.subscription.state,
        },
      });
    } catch (syncError: any) {
      const duration = Date.now() - startTime;

      // Log the failed sync
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'SYNC',
          action: `sync_${validatedData.source.toLowerCase()}`,
          status: 'FAILED',
          requestData: {
            email: validatedData.email,
            source: validatedData.source,
          },
          errorMessage: syncError.message,
          recordsFailed: 1,
          duration,
        },
      });

      throw syncError;
    }
  } catch (error: any) {
    console.error('Error syncing to ConvertKit:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to sync to ConvertKit' },
      { status: 500 }
    );
  }
}

