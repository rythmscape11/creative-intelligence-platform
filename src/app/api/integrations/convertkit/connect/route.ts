import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';
import { testConvertKitConnection, getAccountInfo } from '@/lib/convertkit';
import { z } from 'zod';

const connectSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  apiSecret: z.string().min(1, 'API Secret is required'),
});

/**
 * POST /api/integrations/convertkit/connect
 * Connect ConvertKit integration with API credentials
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

    // Only admins can manage integrations
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, id: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = connectSchema.parse(body);

    console.log('Connecting ConvertKit integration for user:', userId);

    // Test the connection first
    const connectionSuccess = await testConvertKitConnection({
      apiKey: validatedData.apiKey,
      apiSecret: validatedData.apiSecret,
    });

    if (!connectionSuccess) {
      return NextResponse.json(
        { error: 'Failed to connect to ConvertKit. Please check your API credentials.' },
        { status: 400 }
      );
    }

    // Get account info
    const accountInfo = await getAccountInfo({
      apiKey: validatedData.apiKey,
      apiSecret: validatedData.apiSecret,
    });

    console.log('ConvertKit account info:', accountInfo);

    // Encrypt credentials
    const encryptedApiKey = encrypt(validatedData.apiKey);
    const encryptedApiSecret = encrypt(validatedData.apiSecret);

    // Check if integration already exists
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        userId: userId,
        type: 'CONVERTKIT',
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
          apiKey: encryptedApiKey,
          apiSecret: encryptedApiSecret,
          settings: {
            accountName: accountInfo.name || accountInfo.primary_email_address,
            accountId: accountInfo.account_id,
            planType: accountInfo.plan_type,
          },
          lastSyncAt: new Date(),
        },
      });

      console.log('Updated existing ConvertKit integration:', integration.id);
    } else {
      // Create new integration
      integration = await prisma.integration.create({
        data: {
          userId: userId,
          type: 'CONVERTKIT',
          category: 'EMAIL_MARKETING',
          name: 'ConvertKit',
          description: 'Email marketing for creators',
          status: 'ACTIVE',
          isActive: true,
          apiKey: encryptedApiKey,
          apiSecret: encryptedApiSecret,
          settings: {
            accountName: accountInfo.name || accountInfo.primary_email_address,
            accountId: accountInfo.account_id,
            planType: accountInfo.plan_type,
          },
          lastSyncAt: new Date(),
        },
      });

      console.log('Created new ConvertKit integration:', integration.id);
    }

    // Log the connection
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'CONNECTION_TEST',
        action: 'api_connected',
        status: 'SUCCESS',
        responseData: {
          accountName: accountInfo.name || accountInfo.primary_email_address,
          accountId: accountInfo.account_id,
          planType: accountInfo.plan_type,
        },
      },
    });

    return NextResponse.json({
      success: true,
      integration: {
        id: integration.id,
        type: integration.type,
        status: integration.status,
        isActive: integration.isActive,
        settings: integration.settings,
        lastSyncAt: integration.lastSyncAt,
      },
    });
  } catch (error: any) {
    console.error('Error connecting ConvertKit:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to connect ConvertKit integration' },
      { status: 500 }
    );
  }
}

