/**
 * Subscriptions API Route
 * 
 * Manages user subscriptions: get current subscription, cancel, resume.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/subscriptions
 * Get current user's subscription
 */
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    if (!subscription) {
      // Return default free subscription
      return NextResponse.json({
        plan: 'FREE',
        status: 'ACTIVE',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      canceledAt: subscription.canceledAt,
      trialEnd: subscription.trialEnd,
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/subscriptions
 * Create customer portal session for subscription management
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body;

    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    if (action === 'portal') {
      // Create Stripe Customer Portal session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
      });

      return NextResponse.json({
        url: portalSession.url,
      });
    }

    if (action === 'cancel') {
      // Cancel subscription at period end
      if (!subscription.stripeSubscriptionId) {
        return NextResponse.json(
          { error: 'No active subscription' },
          { status: 400 }
        );
      }

      await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
        }
      );

      // Update database
      const updatedSub = await prisma.subscription.update({
        where: { userId: userId },
        data: {
          cancelAtPeriodEnd: true,
        },
      });

      return NextResponse.json({
        success: true,
        cancelAtPeriodEnd: true,
        currentPeriodEnd: updatedSub.currentPeriodEnd,
      });
    }

    if (action === 'resume') {
      // Resume canceled subscription
      if (!subscription.stripeSubscriptionId) {
        return NextResponse.json(
          { error: 'No active subscription' },
          { status: 400 }
        );
      }

      await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          cancel_at_period_end: false,
        }
      );

      // Update database
      await prisma.subscription.update({
        where: { userId: userId },
        data: {
          cancelAtPeriodEnd: false,
        },
      });

      return NextResponse.json({
        success: true,
        cancelAtPeriodEnd: false,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Subscription action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}

