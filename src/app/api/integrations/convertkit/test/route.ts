import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { testConvertKitConnection, getAccountInfo, listTags, listForms, listSequences } from '@/lib/convertkit';

/**
 * POST /api/integrations/convertkit/test
 * Test ConvertKit connection and fetch account details
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

    console.log('Testing ConvertKit connection for user:', userId);

    // Find the integration
    const integration = await prisma.integration.findFirst({
      where: {
        userId: userId,
        type: 'CONVERTKIT',
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'ConvertKit integration not found. Please connect first.' },
        { status: 404 }
      );
    }

    if (!integration.apiKey || !integration.apiSecret) {
      return NextResponse.json(
        { error: 'ConvertKit API credentials not found. Please reconnect.' },
        { status: 400 }
      );
    }

    // Decrypt credentials
    const apiKey = decrypt(integration.apiKey);
    const apiSecret = decrypt(integration.apiSecret);

    console.log('Testing ConvertKit connection...');

    // Test connection
    const connectionSuccess = await testConvertKitConnection({ apiKey, apiSecret });

    if (!connectionSuccess) {
      // Log the failed test
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'CONNECTION_TEST',
          action: 'test_connection',
          status: 'FAILED',
          errorMessage: 'Connection test failed',
        },
      });

      return NextResponse.json(
        { success: false, error: 'Connection test failed. Please check your API credentials.' },
        { status: 400 }
      );
    }

    // Get account info and resources
    const [accountInfo, tagsData, formsData, sequencesData] = await Promise.all([
      getAccountInfo({ apiKey, apiSecret }),
      listTags({ apiKey, apiSecret }).catch(() => ({ tags: [] })),
      listForms({ apiKey, apiSecret }).catch(() => ({ forms: [] })),
      listSequences({ apiKey, apiSecret }).catch(() => ({ courses: [] })),
    ]);

    console.log('ConvertKit connection successful:', {
      account: accountInfo.name || accountInfo.primary_email_address,
      tags: tagsData.tags.length,
      forms: formsData.forms.length,
      sequences: sequencesData.courses.length,
    });

    // Update integration with latest info
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        status: 'ACTIVE',
        isActive: true,
        settings: {
          ...(integration.settings as object || {}),
          accountName: accountInfo.name || accountInfo.primary_email_address,
          accountId: accountInfo.account_id,
          planType: accountInfo.plan_type,
          lastTestAt: new Date().toISOString(),
        },
        lastSyncAt: new Date(),
      },
    });

    // Log the successful test
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'CONNECTION_TEST',
        action: 'test_connection',
        status: 'SUCCESS',
        responseData: {
          accountName: accountInfo.name || accountInfo.primary_email_address,
          tagsCount: tagsData.tags.length,
          formsCount: formsData.forms.length,
          sequencesCount: sequencesData.courses.length,
        },
      },
    });

    return NextResponse.json({
      success: true,
      account: {
        name: accountInfo.name || accountInfo.primary_email_address,
        email: accountInfo.primary_email_address,
        accountId: accountInfo.account_id,
        planType: accountInfo.plan_type,
      },
      resources: {
        tags: tagsData.tags,
        forms: formsData.forms,
        sequences: sequencesData.courses,
      },
    });
  } catch (error: any) {
    console.error('Error testing ConvertKit connection:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to test ConvertKit connection' },
      { status: 500 }
    );
  }
}

