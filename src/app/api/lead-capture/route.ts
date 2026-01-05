import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { resend, EMAIL_CONFIG } from '@/lib/email';
import { getAutoResponseEmail } from '@/lib/email-templates';
import { syncLeadToGoogleSheets } from '@/lib/google-sheets';
import { leadChaserService } from '@/lib/services/lead-chaser';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source, toolId, page, metadata } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Get IP address and user agent
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Extract UTM parameters from request URL
    const { searchParams } = new URL(request.url);
    const utmSource = searchParams.get('utm_source') || undefined;
    const utmMedium = searchParams.get('utm_medium') || undefined;
    const utmCampaign = searchParams.get('utm_campaign') || undefined;
    const utmTerm = searchParams.get('utm_term') || undefined;
    const utmContent = searchParams.get('utm_content') || undefined;

    // Create lead capture record
    const leadCapture = await prisma.leadCapture.create({
      data: {
        email,
        name: name || null,
        source: source || 'unknown',
        page: page || null,
        toolId: toolId || null,
        // UTM parameters for campaign tracking
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        metadata: metadata || null,
        ipAddress,
        userAgent,
      },
    });

    // Start AI Lead Chaser Sequence (Async)
    try {
      const context = {
        source: source || 'unknown',
        toolId: toolId || null,
        page: page || null,
        name: name || null,
        industry: metadata?.industry || 'General',
        interests: metadata?.interests || [],
      };

      // Start sequence (first email in 30 mins)
      await leadChaserService.startSequence(leadCapture.id, context);
      console.log(`[Lead Capture API] Started Lead Chaser sequence for ${email}`);
    } catch (error) {
      console.error('[Lead Capture API] Failed to start Lead Chaser sequence:', error);
      // Don't fail the request, just log the error
    }

    // Check if email already exists in subscribers
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { email },
    });

    if (!existingSubscriber) {
      // Create new subscriber
      await prisma.emailSubscriber.create({
        data: {
          email,
          name: name || null,
          source: source || 'unknown',
          status: 'active',
          tags: toolId ? `tool:${toolId}` : null,
          metadata: metadata || null,
        },
      });
    } else if (existingSubscriber.status === 'unsubscribed') {
      // Resubscribe if previously unsubscribed
      await prisma.emailSubscriber.update({
        where: { email },
        data: {
          status: 'active',
          subscribedAt: new Date(),
          unsubscribedAt: null,
        },
      });
    }

    // Sync to Google Sheets (async, don't wait)
    syncLeadToGoogleSheets({
      timestamp: new Date(),
      name: name || 'Unknown',
      email,
      source: source || 'unknown',
      status: 'New',
      leadScore: 0,
      notes: `Tool: ${toolId || 'N/A'}, Page: ${page || 'N/A'}`,
    }).catch(err => console.error('Google Sheets sync failed:', err));

    // Sync to Mailchimp (async, don't wait)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrations/mailchimp/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        firstName: name?.split(' ')[0] || '',
        lastName: name?.split(' ').slice(1).join(' ') || '',
        tags: ['lead_capture', source, toolId].filter(Boolean),
        mergeFields: {
          SOURCE: source || '',
          PAGE: page || '',
          TOOL: toolId || '',
        },
        source: 'lead_capture',
      }),
    }).catch(err => console.error('Mailchimp sync failed:', err));

    // Send welcome email to subscriber
    try {
      console.log('[Lead Capture API] Sending welcome email...');

      const autoResponseEmail = getAutoResponseEmail({
        name: name || '',
      });

      const emailResult = await resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
        to: email,
        subject: autoResponseEmail.subject,
        html: autoResponseEmail.html,
        text: autoResponseEmail.text,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log('[Lead Capture API] Welcome email sent:', emailResult);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('[Lead Capture API] Email sending failed:', emailError);
      // Continue execution - lead is still captured even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
    });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // TODO: Verify unsubscribe token for security

    // Update subscriber status
    await prisma.emailSubscriber.update({
      where: { email },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

