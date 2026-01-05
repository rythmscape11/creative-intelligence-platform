import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { z } from 'zod';
import { resend, EMAIL_CONFIG } from '@/lib/email';
import { getAdminNotificationEmail, getAutoResponseEmail } from '@/lib/email-templates';
import { syncLeadToGoogleSheets } from '@/lib/google-sheets';

const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceCategory: z.enum([
    'MARKETING_STRATEGY',
    'SEO',
    'CONTENT_MARKETING',
    'PAID_ADVERTISING',
    'SOCIAL_MEDIA',
    'EMAIL_MARKETING',
    'ANALYTICS',
    'WEB_DEVELOPMENT',
    'WEB_DESIGN',
    'WEB_MAINTENANCE',
  ]).optional(),
  serviceInterest: z.string().min(1, 'Service interest is required'),
  serviceSlug: z.string().optional(),
  tier: z.string().optional(),
  budgetRange: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().optional(),
  hearAboutUs: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    const validatedData = inquirySchema.parse(body);

    // Get IP address and user agent
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Extract UTM parameters from request URL or referer
    const { searchParams } = new URL(request.url);
    const utmSource = searchParams.get('utm_source') || undefined;
    const utmMedium = searchParams.get('utm_medium') || undefined;
    const utmCampaign = searchParams.get('utm_campaign') || undefined;
    const utmTerm = searchParams.get('utm_term') || undefined;
    const utmContent = searchParams.get('utm_content') || undefined;

    // Determine service category from service interest if not provided
    const serviceCategory = validatedData.serviceCategory || 'MARKETING_STRATEGY';

    // Create service inquiry
    const inquiry = await prisma.serviceInquiry.create({
      data: {
        userId: userId || null,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        serviceCategory: serviceCategory,
        serviceInterest: validatedData.serviceInterest,
        budget: validatedData.budgetRange || validatedData.budget,
        timeline: validatedData.timeline,
        message: validatedData.message || '',
        hearAboutUs: validatedData.hearAboutUs,
        source: validatedData.source || 'website',
        ipAddress,
        userAgent,
      },
    });

    // Also create a lead capture record
    await prisma.leadCapture.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
        company: validatedData.company,
        source: validatedData.source || 'service_inquiry',
        page: validatedData.serviceSlug ? `/services/${validatedData.serviceSlug}` : '/services',
        budgetRange: validatedData.budgetRange || validatedData.budget,
        hearAboutUs: validatedData.hearAboutUs,
        // UTM parameters for campaign tracking
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        metadata: {
          serviceCategory: serviceCategory,
          serviceInterest: validatedData.serviceInterest,
          tier: validatedData.tier,
          timeline: validatedData.timeline,
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
      source: 'service_inquiry',
      status: 'New',
      leadScore: 0,
      notes: `Timeline: ${validatedData.timeline || 'N/A'}${validatedData.tier ? `, Tier: ${validatedData.tier}` : ''}`,
      serviceInterest: validatedData.serviceInterest,
      budgetRange: validatedData.budgetRange || validatedData.budget,
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
        tags: ['service_inquiry', validatedData.serviceCategory, validatedData.serviceInterest].filter(Boolean),
        mergeFields: {
          COMPANY: validatedData.company || '',
          SERVICE: validatedData.serviceInterest || '',
          BUDGET: validatedData.budget || '',
          TIMELINE: validatedData.timeline || '',
        },
        source: 'service_inquiry',
      }),
    }).catch(err => console.error('Mailchimp sync failed:', err));

    // Send email notifications
    try {
      console.log('[Service Inquiry API] Sending email notifications...');

      // 1. Send admin notification to hello@mediaplanpro.com
      const adminEmail = getAdminNotificationEmail({
        leadType: 'service_inquiry',
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        serviceInterest: validatedData.serviceInterest,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        message: validatedData.message,
        hearAboutUs: validatedData.hearAboutUs,
        submittedAt: new Date().toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }),
        dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in'}/dashboard/leads`,
      });

      // Use verified email for admin notifications
      // TODO: Verify mediaplanpro.com domain in Resend to use hello@aureonone.in
      const adminEmailAddress = process.env.ADMIN_EMAIL || 'mukherjeeanustup@gmail.com';

      const adminEmailResult = await resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
        to: adminEmailAddress,
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        replyTo: validatedData.email,
      });

      console.log('[Service Inquiry API] Admin notification sent to:', adminEmailAddress);
      console.log('[Service Inquiry API] Admin notification result:', adminEmailResult);

      // 2. Send auto-response to user
      const autoResponseEmail = getAutoResponseEmail({
        name: validatedData.name,
        serviceInterest: validatedData.serviceInterest,
      });

      const autoResponseResult = await resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
        to: validatedData.email,
        subject: autoResponseEmail.subject,
        html: autoResponseEmail.html,
        text: autoResponseEmail.text,
        replyTo: EMAIL_CONFIG.replyTo,
      });

      console.log('[Service Inquiry API] Auto-response sent:', autoResponseResult);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('[Service Inquiry API] Email sending failed:', emailError);
      // Continue execution - inquiry is still captured even if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! Our team will contact you within 24 hours.',
      inquiryId: inquiry.id,
    });
  } catch (error) {
    console.error('Service inquiry error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

