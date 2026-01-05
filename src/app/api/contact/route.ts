import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { z } from 'zod';
import { resend, EMAIL_CONFIG } from '@/lib/email';
import { getAdminNotificationEmail, getAutoResponseEmail } from '@/lib/email-templates';
import { syncLeadToGoogleSheets } from '@/lib/google-sheets';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
  serviceInterest: z.string().optional(),
  budgetRange: z.string().optional(),
  hearAboutUs: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

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
    await prisma.leadCapture.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        company: validatedData.company,
        source: 'contact_form',
        page: '/contact',
        budgetRange: validatedData.budgetRange,
        hearAboutUs: validatedData.hearAboutUs,
        // UTM parameters for campaign tracking
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        metadata: {
          subject: validatedData.subject,
          message: validatedData.message,
          serviceInterest: validatedData.serviceInterest,
        },
        ipAddress,
        userAgent,
      },
    });

    // Sync to Google Sheets (async, don't wait)
    syncLeadToGoogleSheets({
      timestamp: new Date(),
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      company: validatedData.company,
      message: validatedData.message,
      source: 'contact_form',
      status: 'New',
      leadScore: 0,
      notes: '',
      serviceInterest: validatedData.serviceInterest,
      budgetRange: validatedData.budgetRange,
      hearAboutUs: validatedData.hearAboutUs,
    }).catch(err => console.error('Google Sheets sync failed:', err));

    // Sync to Mailchimp (async, don't wait)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrations/mailchimp/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validatedData.email,
        firstName: validatedData.name.split(' ')[0],
        lastName: validatedData.name.split(' ').slice(1).join(' '),
        phone: validatedData.phone,
        tags: ['contact_form', validatedData.serviceInterest].filter(Boolean),
        mergeFields: {
          COMPANY: validatedData.company || '',
          INTEREST: validatedData.serviceInterest || '',
        },
        source: 'contact_form',
      }),
    }).catch(err => console.error('Mailchimp sync failed:', err));

    // Send email notifications
    try {
      console.log('[Contact API] ========================================');
      console.log('[Contact API] Starting email notification process...');
      console.log('[Contact API] Resend API Key configured:', !!process.env.RESEND_API_KEY);
      console.log('[Contact API] Email config:', {
        from: EMAIL_CONFIG.from,
        fromName: EMAIL_CONFIG.fromName,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      // 1. Send admin notification to hello@mediaplanpro.com
      console.log('[Contact API] Preparing admin notification email...');
      const adminEmail = getAdminNotificationEmail({
        leadType: 'contact',
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        serviceInterest: validatedData.serviceInterest,
        budget: validatedData.budgetRange,
        message: validatedData.message,
        hearAboutUs: validatedData.hearAboutUs,
        submittedAt: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }),
        dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in'}/dashboard/leads`,
      });

      console.log('[Contact API] Admin email subject:', adminEmail.subject);

      // Use verified email for admin notifications
      // TODO: Verify mediaplanpro.com domain in Resend to use hello@aureonone.in
      const adminEmailAddress = process.env.ADMIN_EMAIL || 'mukherjeeanustup@gmail.com';
      console.log('[Contact API] Sending admin notification to:', adminEmailAddress);

      const adminEmailResult = await resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
        to: adminEmailAddress,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        replyTo: validatedData.email,
      });

      console.log('[Contact API] ✅ Admin notification sent successfully!');
      console.log('[Contact API] Admin email result:', JSON.stringify(adminEmailResult, null, 2));

      // 2. Send auto-response to user
      console.log('[Contact API] Preparing auto-response email...');
      const autoResponseEmail = getAutoResponseEmail({
        name: validatedData.name,
        serviceInterest: validatedData.serviceInterest,
      });

      console.log('[Contact API] Auto-response subject:', autoResponseEmail.subject);
      console.log('[Contact API] Sending auto-response to:', validatedData.email);

      const autoResponseResult = await resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
        to: validatedData.email,
        subject: autoResponseEmail.subject,
        html: autoResponseEmail.html,
        text: autoResponseEmail.text,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log('[Contact API] ✅ Auto-response sent successfully!');
      console.log('[Contact API] Auto-response result:', JSON.stringify(autoResponseResult, null, 2));
      console.log('[Contact API] ========================================');
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('[Contact API] ❌ Email sending failed!');
      console.error('[Contact API] Error details:', emailError);
      if (emailError instanceof Error) {
        console.error('[Contact API] Error message:', emailError.message);
        console.error('[Contact API] Error stack:', emailError.stack);
      }
      console.error('[Contact API] ========================================');
      // Continue execution - lead is still captured even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}

