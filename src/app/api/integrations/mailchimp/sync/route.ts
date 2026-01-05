import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/encryption';
import { syncContactToMailchimp } from '@/lib/mailchimp';
import { z } from 'zod';

const syncSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  mergeFields: z.record(z.any()).optional(),
  source: z.string().optional(), // e.g., 'contact_form', 'service_inquiry', 'newsletter'
});

/**
 * POST /api/integrations/mailchimp/sync
 * Sync a contact to Mailchimp
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { userId } = await auth();
    
    // Allow both authenticated and unauthenticated requests
    // (for public forms like newsletter signup)
    
    const body = await request.json();
    const validatedData = syncSchema.parse(body);
    
    // Find active Mailchimp integration
    const integration = await prisma.integration.findFirst({
      where: {
        type: 'MAILCHIMP',
        isActive: true,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });
    
    if (!integration) {
      // Log but don't fail - integration might not be set up yet
      console.warn('No active Mailchimp integration found');
      return NextResponse.json({
        success: true,
        synced: false,
        message: 'No active Mailchimp integration',
      });
    }
    
    if (!integration.apiKey || !integration.serverPrefix) {
      console.error('Mailchimp integration missing credentials');
      return NextResponse.json({
        success: true,
        synced: false,
        message: 'Mailchimp integration not configured',
      });
    }
    
    // Get audience ID from settings
    const settings = integration.settings as any;
    const audienceId = settings?.defaultAudienceId || settings?.audienceId;
    
    if (!audienceId) {
      console.error('No Mailchimp audience ID configured');
      return NextResponse.json({
        success: true,
        synced: false,
        message: 'No Mailchimp audience configured',
      });
    }
    
    // Decrypt credentials
    const config = {
      apiKey: decrypt(integration.apiKey),
      serverPrefix: integration.serverPrefix,
    };
    
    // Prepare tags
    const tags = validatedData.tags || [];
    if (validatedData.source) {
      tags.push(`source:${validatedData.source}`);
    }
    
    // Sync to Mailchimp
    const response = await syncContactToMailchimp(
      config,
      audienceId,
      {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        mergeFields: validatedData.mergeFields,
      },
      tags
    );
    
    const duration = Date.now() - startTime;
    
    // Log successful sync
    await prisma.integrationLog.create({
      data: {
        integrationId: integration.id,
        type: 'CONTACT_ADDED',
        status: 'SUCCESS',
        action: 'sync_contact',
        requestData: {
          email: validatedData.email,
          source: validatedData.source,
          tags,
        },
        responseData: {
          id: response.id,
          status: response.status,
        },
        recordsProcessed: 1,
        recordsFailed: 0,
        duration,
      },
    });
    
    // Update integration last sync time
    await prisma.integration.update({
      where: { id: integration.id },
      data: {
        lastSyncAt: new Date(),
        lastError: null,
        errorCount: 0,
      },
    });
    
    return NextResponse.json({
      success: true,
      synced: true,
      message: 'Contact synced to Mailchimp successfully',
      mailchimpId: response.id,
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error('Failed to sync contact to Mailchimp:', error);
    
    // Try to log error
    try {
      const integration = await prisma.integration.findFirst({
        where: {
          type: 'MAILCHIMP',
          isActive: true,
        },
      });
      
      if (integration) {
        await prisma.integrationLog.create({
          data: {
            integrationId: integration.id,
            type: 'ERROR',
            status: 'FAILED',
            action: 'sync_contact',
            errorMessage: error.message,
            errorStack: error.stack,
            duration,
          },
        });
        
        await prisma.integration.update({
          where: { id: integration.id },
          data: {
            lastError: error.message,
            errorCount: { increment: 1 },
            status: integration.errorCount >= 5 ? 'ERROR' : integration.status,
          },
        });
      }
    } catch (logError) {
      console.error('Failed to log Mailchimp error:', logError);
    }
    
    // Don't fail the main request - just log the error
    return NextResponse.json({
      success: true,
      synced: false,
      message: 'Failed to sync to Mailchimp',
      error: error.message,
    });
  }
}

