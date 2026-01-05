/**
 * Google Analytics Test Connection Endpoint
 * 
 * Tests the Google Analytics connection and refreshes access token if needed
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt, encrypt } from '@/lib/encryption';
import {
  testGoogleAnalyticsConnection,
  refreshAccessToken,
  getGA4Properties,
} from '@/lib/google-analytics';

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

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Find Google Analytics integration
    const integration = await prisma.integration.findFirst({
      where: {
        type: 'GOOGLE_ANALYTICS',
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'Google Analytics integration not found. Please connect first.' },
        { status: 404 }
      );
    }

    // Decrypt credentials
    if (!integration.accessToken) {
      return NextResponse.json(
        { error: 'Access token not found. Please reconnect Google Analytics.' },
        { status: 400 }
      );
    }

    let accessToken = decrypt(integration.accessToken);
    const refreshToken = integration.refreshToken
      ? decrypt(integration.refreshToken)
      : null;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found. Please reconnect Google Analytics.' },
        { status: 400 }
      );
    }

    // Try to test connection with current access token
    console.log('Testing Google Analytics connection...');
    let connectionSuccess = await testGoogleAnalyticsConnection({ accessToken, refreshToken: refreshToken || '' });

    // If connection failed, try refreshing the access token
    if (!connectionSuccess) {
      console.log('Connection failed, refreshing access token...');

      try {
        accessToken = await refreshAccessToken(refreshToken);

        // Update integration with new access token
        await prisma.integration.update({
          where: { id: integration.id },
          data: {
            accessToken: encrypt(accessToken),
            settings: {
              ...(integration.settings as object || {}),
              lastTokenRefresh: new Date().toISOString(),
            },
          },
        });

        console.log('Access token refreshed successfully');

        // Test connection again with new token
        connectionSuccess = await testGoogleAnalyticsConnection({ accessToken, refreshToken });
      } catch (refreshError: any) {
        console.error('Failed to refresh access token:', refreshError);

        // Log the failure
        await prisma.integrationLog.create({
          data: {
            integrationId: integration.id,
            type: 'ERROR',
            action: 'test_connection',
            status: 'FAILED',
            errorMessage: `Failed to refresh access token: ${refreshError.message}`,
          },
        });

        return NextResponse.json(
          {
            error: 'Failed to refresh access token. Please reconnect Google Analytics.',
            details: process.env.NODE_ENV === 'development' ? refreshError.message : undefined,
          },
          { status: 500 }
        );
      }
    }

    if (!connectionSuccess) {
      // Log the failure
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'ERROR',
          action: 'test_connection',
          status: 'FAILED',
          errorMessage: 'Google Analytics connection test failed',
        },
      });

      return NextResponse.json(
        { error: 'Google Analytics connection test failed. Please reconnect.' },
        { status: 500 }
      );
    }

    // Get properties to show in response
    const properties = await getGA4Properties(accessToken);

    // Update integration status
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        status: 'ACTIVE',
        isActive: true,
        lastSyncAt: new Date(),
        settings: {
          ...(integration.settings as object || {}),
          propertiesCount: properties.length,
        },
      },
    });

    // Log the success
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'CONNECTION_TEST',
        action: 'test_connection',
        status: 'SUCCESS',
        responseData: {
          message: `Google Analytics connection test successful. Found ${properties.length} properties.`,
          propertiesCount: properties.length,
        },
        recordsProcessed: properties.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Google Analytics connection is working',
      propertiesCount: properties.length,
      properties: properties.map((prop: any) => ({
        name: prop.name,
        displayName: prop.displayName,
        propertyType: prop.propertyType,
      })),
    });
  } catch (error: any) {
    console.error('Error testing Google Analytics connection:', error);
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
            action: 'test_connection',
            status: 'FAILED',
            errorMessage: `Error testing connection: ${error.message}`,
            errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
          },
        });
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return NextResponse.json(
      {
        error: 'Failed to test Google Analytics connection',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

