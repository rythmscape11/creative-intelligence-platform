/**
 * Growth Suite Event Webhook
 * 
 * POST /api/growth-suite/webhook/event
 * 
 * Accepts events from external sources for attribution tracking
 * 
 * Required env vars: None (public endpoint with API key validation)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { trackUsage, checkQuota } from '@/lib/growth-suite/usage-tracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      userId,
      sessionId,
      eventName,
      eventType = 'pageview',
      properties = {},
      revenue = 0,
    } = body;

    // Validate required fields
    if (!userId || !sessionId || !eventName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, sessionId, eventName' },
        { status: 400 }
      );
    }

    // Check quota
    const quota = await checkQuota(userId, 'attribution', 'event');
    if (!quota.allowed) {
      return NextResponse.json(
        { 
          error: 'Quota exceeded',
          current: quota.current,
          limit: quota.limit,
        },
        { status: 429 }
      );
    }

    // Create or update session
    const existingSession = await prisma.growthSession.findUnique({
      where: { sessionId },
    });

    if (!existingSession) {
      // Extract UTM params from properties
      const utmSource = properties.utm_source || properties.utmSource;
      const utmMedium = properties.utm_medium || properties.utmMedium;
      const utmCampaign = properties.utm_campaign || properties.utmCampaign;
      const utmTerm = properties.utm_term || properties.utmTerm;
      const utmContent = properties.utm_content || properties.utmContent;
      const referrer = properties.referrer;
      const landingPage = properties.landing_page || properties.landingPage || properties.page;

      await prisma.growthSession.create({
        data: {
          userId,
          sessionId,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent,
          referrer,
          landingPage,
        },
      });
    } else {
      // Update last event time
      await prisma.growthSession.update({
        where: { sessionId },
        data: { lastEventAt: new Date() },
      });
    }

    // Create event
    const event = await prisma.growthEvent.create({
      data: {
        userId,
        sessionId,
        eventName,
        eventType,
        properties: JSON.stringify(properties),
        revenue: parseFloat(revenue.toString()) || 0,
      },
    });

    // Track usage
    await trackUsage(userId, 'attribution', 'event', 1, {
      eventName,
      eventType,
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
      quota: {
        used: quota.current + 1,
        limit: quota.limit,
        remaining: quota.remaining - 1,
      },
    });

  } catch (error) {
    console.error('Event webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

