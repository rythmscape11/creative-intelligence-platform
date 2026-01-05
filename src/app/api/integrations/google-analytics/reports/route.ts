/**
 * Google Analytics Reports Endpoint
 * 
 * Fetches analytics reports from GA4
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt, encrypt } from '@/lib/encryption';
import {
  runGA4Report,
  getGA4RealtimeData,
  formatReportData,
  refreshAccessToken,
} from '@/lib/google-analytics';
import { z } from 'zod';

// Validation schema
const reportRequestSchema = z.object({
  reportType: z.enum(['standard', 'realtime']),
  propertyId: z.string().optional(),
  dimensions: z.array(z.string()).optional(),
  metrics: z.array(z.string()),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
  orderBy: z.array(z.object({
    metric: z.object({ metricName: z.string() }).optional(),
    dimension: z.object({ dimensionName: z.string() }).optional(),
    desc: z.boolean().optional(),
  })).optional(),
  limit: z.number().min(1).max(100).optional(),
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

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = reportRequestSchema.parse(body);

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

    // Get property ID from request or settings
    const settings = integration.settings as any;
    const propertyId = validatedData.propertyId || settings?.propertyId;

    if (!propertyId) {
      return NextResponse.json(
        {
          error: 'Property ID is required',
          details: 'Please provide a property ID or configure a default property',
        },
        { status: 400 }
      );
    }

    // Prepare config
    const config = {
      accessToken,
      refreshToken: refreshToken || '',
      propertyId,
    };

    let reportData;
    let retryWithRefresh = false;

    try {
      if (validatedData.reportType === 'realtime') {
        // Get realtime data
        console.log('Fetching realtime data from GA4...');
        reportData = await getGA4RealtimeData(config, validatedData.metrics);
      } else {
        // Run standard report
        console.log('Running GA4 report...');

        if (!validatedData.dateRange) {
          return NextResponse.json(
            { error: 'Date range is required for standard reports' },
            { status: 400 }
          );
        }

        reportData = await runGA4Report(config, {
          dimensions: validatedData.dimensions,
          metrics: validatedData.metrics,
          dateRange: validatedData.dateRange,
          orderBy: validatedData.orderBy,
          limit: validatedData.limit,
        });
      }
    } catch (reportError: any) {
      // If error is related to authentication, try refreshing token
      if (reportError.message.includes('401') || reportError.message.includes('invalid_grant')) {
        retryWithRefresh = true;
      } else {
        throw reportError;
      }
    }

    // Retry with refreshed token if needed
    if (retryWithRefresh && refreshToken) {
      console.log('Refreshing access token and retrying...');

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

        // Update config with new token
        config.accessToken = accessToken;

        // Retry the report
        if (validatedData.reportType === 'realtime') {
          reportData = await getGA4RealtimeData(config, validatedData.metrics);
        } else {
          reportData = await runGA4Report(config, {
            dimensions: validatedData.dimensions,
            metrics: validatedData.metrics,
            dateRange: validatedData.dateRange!,
            orderBy: validatedData.orderBy,
            limit: validatedData.limit,
          });
        }
      } catch (refreshError: any) {
        console.error('Failed to refresh token and retry:', refreshError);
        throw refreshError;
      }
    }

    // Ensure reportData is defined
    if (!reportData) {
      throw new Error('No report data returned from Google Analytics');
    }

    // Format the report data
    const formattedData = formatReportData(reportData);

    // Log the success
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'SYNC',
        action: 'fetch_report',
        status: 'SUCCESS',
        requestData: {
          reportType: validatedData.reportType,
          propertyId,
          metrics: validatedData.metrics,
          dimensions: validatedData.dimensions,
        },
        responseData: {
          rowCount: formattedData.length,
        },
        recordsProcessed: formattedData.length,
      },
    });

    return NextResponse.json({
      success: true,
      reportType: validatedData.reportType,
      propertyId,
      rowCount: formattedData.length,
      data: formattedData,
      dimensionHeaders: reportData?.dimensionHeaders || [],
      metricHeaders: reportData?.metricHeaders || [],
    });
  } catch (error: any) {
    console.error('Error fetching Google Analytics report:', error);
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
            action: 'fetch_report',
            status: 'FAILED',
            errorMessage: `Failed to fetch report: ${error.message}`,
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
        error: 'Failed to fetch report',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

