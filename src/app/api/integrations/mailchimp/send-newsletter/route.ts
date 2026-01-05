import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { sendBlogNewsletter } from '@/lib/mailchimp';

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

    // Check if user is ADMIN or EDITOR
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { postId, title, excerpt, slug, featuredImage } = body;

    if (!title || !excerpt || !slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, excerpt, slug' },
        { status: 400 }
      );
    }

    // Check if Mailchimp integration exists and is active
    const integration = await prisma.integration.findFirst({
      where: {
        type: 'MAILCHIMP',
        isActive: true,
        status: 'ACTIVE',
      },
    });

    if (!integration) {
      return NextResponse.json(
        { success: false, error: 'Mailchimp integration not configured or inactive' },
        { status: 400 }
      );
    }

    // Check if blog newsletters are enabled in settings
    const settings = integration.settings as any;
    if (!settings?.automations?.sendBlogNewsletters) {
      return NextResponse.json(
        { success: false, error: 'Blog newsletters are not enabled in Mailchimp settings' },
        { status: 400 }
      );
    }

    // Get default audience ID
    const audienceId = settings?.defaultAudienceId;
    if (!audienceId) {
      return NextResponse.json(
        { success: false, error: 'No default audience configured in Mailchimp settings' },
        { status: 400 }
      );
    }

    try {
      // Send newsletter using Mailchimp
      const result = await sendBlogNewsletter(
        {
          apiKey: integration.apiKey!,
          serverPrefix: integration.serverPrefix!,
        },
        audienceId,
        {
          title,
          excerpt,
          slug,
          featuredImage: featuredImage || undefined,
          author: 'MediaPlanPro',
        }
      );

      // Log successful send
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'SYNC',
          status: 'SUCCESS',
          action: 'send_blog_newsletter',
          requestData: {
            postId,
            title,
            slug,
            audienceId,
          },
          responseData: {
            campaignId: result.id,
            webId: result.web_id,
          },
          recordsProcessed: 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Newsletter sent successfully',
        campaignId: result.id,
      });
    } catch (mailchimpError: any) {
      console.error('Mailchimp newsletter send error:', mailchimpError);

      // Log failed send
      await prisma.integrationLog.create({
        data: {
          integrationId: integration.id,
          type: 'ERROR',
          status: 'FAILED',
          action: 'send_blog_newsletter',
          requestData: {
            postId,
            title,
            slug,
            audienceId,
          },
          errorMessage: mailchimpError.message || 'Unknown error',
          recordsProcessed: 0,
        },
      });

      // Update integration error count
      await prisma.integration.update({
        where: { id: integration.id },
        data: {
          errorCount: { increment: 1 },
          lastError: mailchimpError.message || 'Newsletter send failed',
          status: integration.errorCount >= 4 ? 'ERROR' : integration.status,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: mailchimpError.message || 'Failed to send newsletter',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

