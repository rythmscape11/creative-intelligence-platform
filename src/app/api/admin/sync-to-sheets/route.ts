/**
 * Admin API: Sync to Google Sheets
 * 
 * Manual batch sync of all leads and subscriptions to Google Sheets
 * Requires ADMIN role
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
  batchSyncLeadsToGoogleSheets,
  batchSyncSubscriptionsToGoogleSheets,
  type LeadData,
  type SubscriptionData,
} from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/sync-to-sheets
 * 
 * Manually trigger a full sync of all leads and subscriptions to Google Sheets
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { syncType } = body; // 'leads', 'subscriptions', or 'all'

    console.log('[Sync to Sheets] Starting sync:', syncType);

    const results = {
      leads: { success: 0, failed: 0, total: 0 },
      subscriptions: { success: 0, failed: 0, total: 0 },
    };

    // Sync leads
    if (syncType === 'leads' || syncType === 'all') {
      console.log('[Sync to Sheets] Fetching leads from database...');

      const leadCaptures = await prisma.leadCapture.findMany({
        orderBy: { capturedAt: 'desc' },
      });

      results.leads.total = leadCaptures.length;

      const leadsData: LeadData[] = leadCaptures.map(lead => ({
        timestamp: lead.capturedAt,
        name: lead.name || 'Unknown',
        email: lead.email,
        phone: lead.phone || undefined,
        company: lead.company || undefined,
        message: typeof lead.metadata === 'object' && lead.metadata !== null && 'message' in lead.metadata
          ? String(lead.metadata.message)
          : undefined,
        source: lead.source || 'unknown',
        status: 'New',
        leadScore: 0,
        notes: '',
        serviceInterest: typeof lead.metadata === 'object' && lead.metadata !== null && 'serviceInterest' in lead.metadata
          ? String(lead.metadata.serviceInterest)
          : undefined,
        budgetRange: lead.budgetRange || undefined,
        hearAboutUs: lead.hearAboutUs || undefined,
      }));

      console.log('[Sync to Sheets] Syncing', leadsData.length, 'leads...');
      const leadResults = await batchSyncLeadsToGoogleSheets(leadsData);
      results.leads.success = leadResults.success;
      results.leads.failed = leadResults.failed;
    }

    // Sync subscriptions
    if (syncType === 'subscriptions' || syncType === 'all') {
      console.log('[Sync to Sheets] Fetching subscriptions from database...');

      const subscriptions = await prisma.subscription.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      results.subscriptions.total = subscriptions.length;

      const subscriptionsData: SubscriptionData[] = subscriptions.map(sub => {
        // Calculate amount based on plan (in cents/paise)
        const planAmounts: Record<string, number> = {
          FREE: 0,
          PRO: 9900, // $99/month
          TEAM: 29900, // $299/month
          ENTERPRISE: 99900, // $999/month
        };

        return {
          timestamp: sub.createdAt,
          userId: sub.userId,
          name: sub.user.name,
          email: sub.user.email,
          planType: sub.plan,
          subscriptionStatus: sub.status,
          startDate: sub.currentPeriodStart || sub.createdAt,
          endDate: sub.currentPeriodEnd || undefined,
          amount: planAmounts[sub.plan] || 0,
          paymentMethod: sub.paymentGateway === 'razorpay' ? 'Razorpay' : 'Stripe',
          paymentId: sub.razorpaySubscriptionId || sub.stripeSubscriptionId || 'N/A',
        };
      });

      console.log('[Sync to Sheets] Syncing', subscriptionsData.length, 'subscriptions...');
      const subscriptionResults = await batchSyncSubscriptionsToGoogleSheets(subscriptionsData);
      results.subscriptions.success = subscriptionResults.success;
      results.subscriptions.failed = subscriptionResults.failed;
    }

    console.log('[Sync to Sheets] ✅ Sync completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Sync completed successfully',
      results,
    });
  } catch (error) {
    console.error('[Sync to Sheets] ❌ Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to sync to Google Sheets',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/sync-to-sheets
 * 
 * Get sync status and configuration
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    // Check configuration status
    const configured = !!(
      process.env.GOOGLE_SHEETS_CREDENTIALS &&
      (process.env.GOOGLE_SHEETS_LEADS_ID || process.env.GOOGLE_SHEETS_SUBSCRIPTIONS_ID)
    );

    // Get counts from database
    const [leadsCount, subscriptionsCount] = await Promise.all([
      prisma.leadCapture.count(),
      prisma.subscription.count(),
    ]);

    return NextResponse.json({
      configured,
      leadsSheetId: process.env.GOOGLE_SHEETS_LEADS_ID || null,
      subscriptionsSheetId: process.env.GOOGLE_SHEETS_SUBSCRIPTIONS_ID || null,
      counts: {
        leads: leadsCount,
        subscriptions: subscriptionsCount,
      },
    });
  } catch (error) {
    console.error('[Sync to Sheets] Error getting status:', error);

    return NextResponse.json(
      {
        error: 'Failed to get sync status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

