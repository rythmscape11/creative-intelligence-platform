/**
 * Google Analytics OAuth Callback Endpoint
 * 
 * Handles the OAuth 2.0 callback from Google and stores the tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getTokensFromCode, getGA4Properties } from '@/lib/google-analytics';
import { encrypt } from '@/lib/encryption';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      // Redirect to login with callback
      const loginUrl = new URL('/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(
        new URL('/dashboard/admin/integrations?error=forbidden', request.url)
      );
    }

    // Get authorization code from query params
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/dashboard/admin/integrations/google-analytics?error=${error}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard/admin/integrations/google-analytics?error=no_code', request.url)
      );
    }

    // Exchange code for tokens
    console.log('Exchanging authorization code for tokens...');
    const tokens = await getTokensFromCode(code);

    // Encrypt tokens
    const encryptedAccessToken = encrypt(tokens.accessToken);
    const encryptedRefreshToken = encrypt(tokens.refreshToken);

    // Get GA4 properties to verify connection
    console.log('Fetching GA4 properties...');
    const properties = await getGA4Properties(tokens.accessToken);

    console.log(`Found ${properties.length} GA4 properties`);

    // Check if integration already exists
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        type: 'GOOGLE_ANALYTICS',
      },
    });

    let integration;

    if (existingIntegration) {
      // Update existing integration
      integration = await prisma.integration.update({
        where: { id: existingIntegration.id },
        data: {
          status: 'ACTIVE',
          isActive: true,
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          settings: {
            expiryDate: tokens.expiryDate,
            propertiesCount: properties.length,
          },
          lastSyncAt: new Date(),
        },
      });

      console.log('Updated existing Google Analytics integration:', integration.id);
    } else {
      // Create new integration
      integration = await prisma.integration.create({
        data: {
          userId: userId,
          type: 'GOOGLE_ANALYTICS',
          category: 'ANALYTICS',
          name: 'Google Analytics',
          description: 'Web analytics and event tracking',
          status: 'ACTIVE',
          isActive: true,
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          settings: {
            expiryDate: tokens.expiryDate,
            propertiesCount: properties.length,
          },
          lastSyncAt: new Date(),
        },
      });

      console.log('Created new Google Analytics integration:', integration.id);
    }

    // Log the connection
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'CONNECTION_TEST',
        action: 'oauth_connected',
        status: 'SUCCESS',
        responseData: {
          propertiesCount: properties.length,
          hasRefreshToken: !!tokens.refreshToken,
        },
        recordsProcessed: properties.length,
      },
    });

    // Redirect to integration page with success message
    return NextResponse.redirect(
      new URL('/dashboard/admin/integrations/google-analytics?success=connected', request.url)
    );
  } catch (error: any) {
    console.error('Error in Google Analytics OAuth callback:', error);
    console.error('Error stack:', error.stack);

    // Log the error if we have an integration
    try {
      const existingIntegration = await prisma.integration.findFirst({
        where: { type: 'GOOGLE_ANALYTICS' },
      });

      if (existingIntegration) {
        await prisma.integrationLog.create({
          data: {
            integrationId: existingIntegration.id,
            type: 'ERROR',
            action: 'oauth_connected',
            status: 'FAILED',
            errorMessage: `Failed to connect Google Analytics: ${error.message}`,
            errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          },
        });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    // Redirect to integration page with error
    return NextResponse.redirect(
      new URL(`/dashboard/admin/integrations/google-analytics?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
