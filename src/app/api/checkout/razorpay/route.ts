/**
 * Razorpay Checkout API Route
 * 
 * Handles Razorpay subscription creation and order generation.
 * Uses dynamic pricing from database PricingPlan table.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
  razorpay,
  isRazorpayConfigured,
  createRazorpaySubscription,
  createRazorpayOrder,
  createRazorpayCustomer,
  getRazorpayCheckoutOptions,
} from '@/lib/razorpay';

/**
 * POST /api/checkout/razorpay
 * 
 * Create Razorpay subscription or order using dynamic pricing from DB
 */
export async function POST(req: NextRequest) {
  try {
    // Check Razorpay configuration
    if (!isRazorpayConfigured) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Please sign in to subscribe' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { billingCycle = 'monthly', planTier = 'PRO', planType = 'subscription' } = body;

    // Fetch pricing plan from database
    const pricingPlan = await prisma.pricingPlan.findUnique({
      where: { id: planTier.toUpperCase() }
    });

    if (!pricingPlan) {
      console.error('Pricing plan not found:', planTier);
      return NextResponse.json(
        { error: `Plan "${planTier}" not found. Please contact support.` },
        { status: 404 }
      );
    }

    // Determine Razorpay plan ID and amount from DB
    const razorpayPlanId = billingCycle === 'yearly'
      ? pricingPlan.razorpayIdYearly
      : pricingPlan.razorpayIdMonthly;
    const amount = billingCycle === 'yearly'
      ? pricingPlan.priceYearly
      : pricingPlan.priceMonthly;

    // Check if Razorpay plan is synced
    if (!razorpayPlanId) {
      console.error('Razorpay plan not synced:', { planTier, billingCycle });
      return NextResponse.json(
        {
          error: 'This plan is not yet available for purchase. Admin needs to sync pricing in the dashboard.',
          code: 'PLAN_NOT_SYNCED'
        },
        { status: 400 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please try signing out and back in.' },
        { status: 404 }
      );
    }

    // Check if user already has an active paid subscription
    if (user.subscription && user.subscription.status === 'ACTIVE' && user.subscription.plan !== 'FREE') {
      return NextResponse.json(
        { error: 'You already have an active subscription. Manage it in your dashboard.' },
        { status: 400 }
      );
    }

    // Get or create Razorpay customer
    let razorpayCustomerId = user.subscription?.razorpayCustomerId;

    if (!razorpayCustomerId) {
      try {
        const customer = await createRazorpayCustomer(
          user.name || 'Customer',
          user.email!,
          undefined // Phone number (optional)
        );
        razorpayCustomerId = customer.id;

        // Update/create subscription record with Razorpay customer ID
        if (user.subscription) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: { razorpayCustomerId: customer.id },
          });
        } else {
          await prisma.subscription.create({
            data: {
              userId: user.id,
              plan: 'FREE',
              status: 'ACTIVE',
              razorpayCustomerId: customer.id,
            },
          });
        }
      } catch (error) {
        console.error('Error creating Razorpay customer:', error);
        return NextResponse.json(
          { error: 'Failed to initialize payment. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Create subscription or order based on plan type
    if (planType === 'subscription') {
      try {
        const subscription = await createRazorpaySubscription(
          razorpayPlanId,
          razorpayCustomerId,
          user.email!,
          user.name || 'Customer'
        );

        console.log('[Razorpay Checkout] Subscription created:', {
          subscriptionId: subscription.id,
          planId: razorpayPlanId,
          planName: pricingPlan.name,
          amount,
        });

        return NextResponse.json({
          type: 'subscription',
          subscriptionId: subscription.id,
          planId: razorpayPlanId,
          planName: pricingPlan.name,
          amount,
          currency: pricingPlan.currency || 'INR',
          checkoutOptions: getRazorpayCheckoutOptions(
            subscription.id,
            amount,
            pricingPlan.currency || 'INR',
            user.name || 'Customer',
            user.email!,
            undefined,
            true
          ),
        });
      } catch (error: any) {
        console.error('Error creating Razorpay subscription:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create subscription. Please try again.' },
          { status: 500 }
        );
      }
    } else {
      // One-time order
      try {
        const order = await createRazorpayOrder(
          amount,
          pricingPlan.currency || 'INR',
          `order_${user.id}_${Date.now()}`,
          {
            userId: user.id,
            userEmail: user.email!,
            plan: planTier,
            billingCycle,
          }
        );

        return NextResponse.json({
          type: 'order',
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          checkoutOptions: getRazorpayCheckoutOptions(
            order.id,
            Number(order.amount),
            order.currency,
            user.name || 'Customer',
            user.email!,
            undefined,
            false
          ),
        });
      } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create order. Please try again.' },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Razorpay checkout error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Something went wrong.',
        details: error.stack
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/checkout/razorpay
 * 
 * Verify payment and update subscription
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

    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID required' },
        { status: 400 }
      );
    }

    try {
      const payment = await razorpay.payments.fetch(paymentId);

      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          createdAt: payment.created_at,
        },
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      return NextResponse.json(
        { error: 'Failed to verify payment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
