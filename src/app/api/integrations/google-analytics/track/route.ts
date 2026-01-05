/**
 * Google Analytics Event Tracking Endpoint
 * 
 * Tracks events to Google Analytics 4 using the Measurement Protocol
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { z } from 'zod';

// Validation schema
const trackEventSchema = z.object({
  eventName: z.string().min(1).max(40),
  params: z.record(z.any()).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
});

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
    const validatedData = trackEventSchema.parse(body);

    // Find Google Analytics integration
    const integration = await prisma.integration.findFirst({
      where: {
        type: 'GOOGLE_ANALYTICS',
        status: 'ACTIVE',
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'Google Analytics integration not found or not active' },
        { status: 404 }
      );
    }

    // Get measurement ID from settings
    const settings = integration.settings as any;
    const measurementId = settings?.measurementId as string | undefined;
    const apiSecret = settings?.apiSecret as string | undefined;

    if (!measurementId || !apiSecret) {
      return NextResponse.json(
        {
          error: 'Google Analytics Measurement ID or API Secret not configured',
          details: 'Please configure Measurement ID and API Secret in the integration settings',
        },
        { status: 400 }
      );
    }

    // Prepare event data for GA4 Measurement Protocol
    const eventData = {
      client_id: validatedData.userId || userId,
      user_id: validatedData.userId || userId,
      events: [
        {
          name: validatedData.eventName,
          params: {
            ...validatedData.params,
            session_id: validatedData.sessionId,
            engagement_time_msec: '100',
          },
        },
      ],
    };

    // Send event to GA4 Measurement Protocol
    const measurementUrl = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

    console.log('Sending event to GA4:', {
      eventName: validatedData.eventName,
      measurementId,
      userId: validatedData.userId || userId,
    });

    const response = await fetch(measurementUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GA4 Measurement Protocol error:', errorText);

      throw new Error(`GA4 API returned ${response.status}: ${errorText}`);
    }

    // Log the event
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'SYNC',
        action: 'track_event',
        status: 'SUCCESS',
        requestData: {
          eventName: validatedData.eventName,
          params: validatedData.params,
          userId: validatedData.userId || userId,
        },
        recordsProcessed: 1,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
      eventName: validatedData.eventName,
    });
  } catch (error: any) {
    console.error('Error tracking event to Google Analytics:', error);
    console.error('Error stack:', error.stack);

    // Try to log the error
    try {
      const integration = await prisma.integration.findFirst({
        where: { type: 'GOOGLE_ANALYTICS' },
      });

      if (integration) {
        await prisma.integrationLog.create({
          data: {
            integrationId: integration.id,
            type: 'ERROR',
            action: 'track_event',
            status: 'FAILED',
            errorMessage: `Failed to track event: ${error.message}`,
            errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          },
        });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to track event',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

