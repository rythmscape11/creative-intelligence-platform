import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { testMailchimpConnection, getMailchimpAudiences } from '@/lib/mailchimp';

/**
 * POST /api/integrations/mailchimp/test
 * Test Mailchimp connection and fetch audiences
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

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { apiKey, serverPrefix, integrationId } = body;

    let config: { apiKey: string; serverPrefix: string };

    // If integrationId provided, fetch from database
    if (integrationId) {
      const integration = await prisma.integration.findFirst({
        where: {
          id: integrationId,
          userId: userId,
          type: 'MAILCHIMP',
        },
      });

      if (!integration || !integration.apiKey || !integration.serverPrefix) {
        return NextResponse.json(
          { error: 'Integration not found or missing credentials' },
          { status: 404 }
        );
      }

      config = {
        apiKey: decrypt(integration.apiKey),
        serverPrefix: integration.serverPrefix,
      };
    } else {
      // Use provided credentials
      if (!apiKey || !serverPrefix) {
        return NextResponse.json(
          { error: 'API key and server prefix are required' },
          { status: 400 }
        );
      }

      config = { apiKey, serverPrefix };
    }

    // Test connection
    const isConnected = await testMailchimpConnection(config);

    if (!isConnected) {
      return NextResponse.json(
        { error: 'Failed to connect to Mailchimp. Please check your credentials.' },
        { status: 400 }
      );
    }

    // Fetch audiences
    const audiences = await getMailchimpAudiences(config);

    // Update integration status if integrationId provided
    if (integrationId) {
      await prisma.integration.update({
        where: { id: integrationId },
        data: {
          status: 'ACTIVE',
          lastError: null,
          errorCount: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      connected: true,
      audiences,
      message: 'Successfully connected to Mailchimp',
    });
  } catch (error: any) {
    console.error('Mailchimp test failed:', error);
    return NextResponse.json(
      { error: 'Failed to test Mailchimp connection', details: error.message },
      { status: 500 }
    );
  }
}

