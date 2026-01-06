import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { CancelSubscriptionResponseDTO } from '@/dtos/subscription.dto';

// Only initialize Stripe if API key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
  })
  : null;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      );
    }

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel subscription at period end in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update in database
    await prisma.subscription.update({
      where: { userId: userId },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    const response: CancelSubscriptionResponseDTO = {
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}


