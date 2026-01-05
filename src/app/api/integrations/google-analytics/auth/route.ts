/**
 * Google Analytics OAuth Authorization Endpoint
 * 
 * Initiates the OAuth 2.0 flow by redirecting to Google's consent screen
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAuthorizationUrl, isGoogleAnalyticsConfigured } from '@/lib/google-analytics';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Check if Google Analytics is configured
    if (!isGoogleAnalyticsConfigured) {
      return NextResponse.json(
        {
          error: 'Google Analytics is not configured',
          details: 'Please set GOOGLE_ANALYTICS_CLIENT_ID and GOOGLE_ANALYTICS_CLIENT_SECRET environment variables',
        },
        { status: 500 }
      );
    }

    // Generate authorization URL
    const authUrl = getAuthorizationUrl();

    // Redirect to Google's OAuth consent screen
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('Error initiating Google Analytics OAuth:', error);
    return NextResponse.json(
      {
        error: 'Failed to initiate OAuth flow',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
