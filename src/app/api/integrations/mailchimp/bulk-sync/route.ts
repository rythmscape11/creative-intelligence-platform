import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { batchSyncContactsToMailchimp } from '@/lib/mailchimp';
import { decrypt } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is ADMIN
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { source } = body;

    if (!source || !['lead_capture', 'service_inquiry', 'service_purchase'].includes(source)) {
      return NextResponse.json(
        { success: false, error: 'Invalid source. Must be: lead_capture, service_inquiry, or service_purchase' },
        { status: 400 }
      );
    }

    // Get active Mailchimp integration
    const integration = await prisma.integration.findFirst({
      where: {
        type: 'MAILCHIMP',
        isActive: true,
        status: 'ACTIVE',
      },
    });

    if (!integration || !integration.apiKey || !integration.serverPrefix) {
      return NextResponse.json(
        { success: false, error: 'Mailchimp integration not configured' },
        { status: 400 }
      );
    }

    const settings = integration.settings as any;
    const audienceId = settings?.defaultAudienceId;

    if (!audienceId) {
      return NextResponse.json(
        { success: false, error: 'No default audience configured' },
        { status: 400 }
      );
    }

    // Decrypt API key
    const apiKey = decrypt(integration.apiKey);

    // Fetch contacts based on source
    let contacts: any[] = [];

    if (source === 'lead_capture') {
      const leadCaptures = await prisma.leadCapture.findMany({
        select: {
          email: true,
          name: true,
          source: true,
          page: true,
        },
      });

      contacts = leadCaptures.map(lead => {
        const nameParts = lead.name?.split(' ') || ['', ''];
        return {
          email: lead.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: '',
          mergeFields: {
            SOURCE: lead.source || '',
            PAGE: lead.page || '',
          },
        };
      });
    } else if (source === 'service_inquiry') {
      const inquiries = await prisma.serviceInquiry.findMany({
        select: {
          email: true,
          name: true,
          phone: true,
          company: true,
          serviceCategory: true,
          serviceInterest: true,
          budget: true,
          timeline: true,
        },
      });

      contacts = inquiries.map(inquiry => {
        const nameParts = inquiry.name?.split(' ') || ['', ''];
        return {
          email: inquiry.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: inquiry.phone || '',
          mergeFields: {
            COMPANY: inquiry.company || '',
            SERVICE: inquiry.serviceInterest || '',
            BUDGET: inquiry.budget || '',
            TIMELINE: inquiry.timeline || '',
          },
        };
      });
    } else if (source === 'service_purchase') {
      const purchases = await prisma.servicePurchase.findMany({
        where: {
          status: 'COMPLETED',
        },
        select: {
          userId: true,
          serviceName: true,
          serviceCategory: true,
          serviceTier: true,
          amount: true,
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      contacts = purchases.map(purchase => {
        const nameParts = purchase.user?.name?.split(' ') || ['', ''];
        return {
          email: purchase.user?.email || '',
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          phone: '',
          mergeFields: {
            SERVICE: purchase.serviceName || '',
            TIER: purchase.serviceTier || '',
            AMOUNT: purchase.amount?.toString() || '',
          },
        };
      });
    }

    if (contacts.length === 0) {
      return NextResponse.json({
        success: true,
        total: 0,
        successful: 0,
        failed: 0,
        errors: [],
        message: 'No contacts found to sync',
      });
    }

    // Batch sync contacts to Mailchimp
    try {
      const result = await batchSyncContactsToMailchimp(
        {
          apiKey,
          serverPrefix: integration.serverPrefix,
        },
        audienceId,
        contacts
      );

      // Log the sync operation
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'SYNC',
          status: result.failed > 0 ? 'FAILED' : 'SUCCESS',
          action: `bulk_sync_${source}`,
          requestData: {
            source,
            audienceId,
            contactCount: contacts.length,
          },
          responseData: {
            total: result.total,
            successful: result.successful,
            failed: result.failed,
          },
          errorMessage: result.failed > 0 ? `${result.failed} contacts failed to sync` : null,
          recordsProcessed: result.total,
        },
      });

      // Update integration last sync time
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          lastSyncAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        total: result.total,
        successful: result.successful,
        failed: result.failed,
        errors: result.errors || [],
      });
    } catch (mailchimpError: any) {
      console.error('Mailchimp batch sync error:', mailchimpError);

      // Log the error
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'ERROR',
          status: 'FAILED',
          action: `bulk_sync_${source}`,
          requestData: {
            source,
            audienceId,
            contactCount: contacts.length,
          },
          errorMessage: mailchimpError.message || 'Batch sync failed',
          recordsProcessed: 0,
        },
      });

      // Update integration error count
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          errorCount: { increment: 1 },
          lastError: mailchimpError.message || 'Batch sync failed',
          status: integration.errorCount >= 4 ? 'ERROR' : integration.status,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: mailchimpError.message || 'Failed to sync contacts',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Bulk sync API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

