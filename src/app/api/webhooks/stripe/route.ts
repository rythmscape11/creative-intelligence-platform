/**
 * Stripe Webhook Handler
 * 
 * Processes Stripe webhook events for subscription lifecycle management.
 * Handles: checkout completion, subscription updates, payment success/failure.
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, getPlanFromPriceId } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import {
  sendWelcomeEmail,
  sendPurchaseConfirmationEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCanceledEmail
} from '@/lib/email';

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs';

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  if (!user) {
    console.error(`User ${userId} not found`);
    return;
  }

  // Get subscription details
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Update subscription in database
  await updateSubscriptionInDatabase(userId, subscription);

  // Send welcome and purchase confirmation emails
  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanFromPriceId(priceId) || 'Professional';
  const amount = session.amount_total || 0;

  await sendWelcomeEmail(user.email!, user.name || 'there');
  await sendPurchaseConfirmationEmail(
    user.email!,
    user.name || 'there',
    plan,
    amount,
    session.invoice as string | undefined
  );

  console.log(`Checkout completed for user ${userId}, emails sent`);
}

/**
 * Handle subscription created or updated
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  await updateSubscriptionInDatabase(userId, subscription);

  console.log(`Subscription updated for user ${userId}`);
}

/**
 * Handle subscription deleted/canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  // Update subscription to canceled
  const updatedSub = await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'CANCELED',
      plan: 'FREE',
      canceledAt: new Date(),
    },
  });

  // Send cancellation email
  if (user && updatedSub.currentPeriodEnd) {
    const priceId = subscription.items.data[0]?.price.id;
    const plan = getPlanFromPriceId(priceId) || 'Professional';

    await sendSubscriptionCanceledEmail(
      user.email!,
      user.name || 'there',
      plan,
      updatedSub.currentPeriodEnd
    );
  }

  console.log(`Subscription canceled for user ${userId}, email sent`);
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const subscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!subscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  // Create payment record
  const invoiceAny = invoice as any;
  const paymentIntent = invoiceAny.payment_intent;
  const paymentIntentId = typeof paymentIntent === 'string'
    ? paymentIntent
    : paymentIntent?.id || `inv_${invoice.id}`;

  await prisma.payment.create({
    data: {
      userId: subscription.userId,
      stripePaymentId: paymentIntentId,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'SUCCEEDED',
      description: invoice.description || 'Subscription payment',
    },
  });

  // Create invoice record
  const invoiceNumber = `INV-${Date.now()}-${subscription.userId.slice(0, 8)}`;

  await prisma.invoice.create({
    data: {
      userId: subscription.userId,
      stripeInvoiceId: invoice.id,
      invoiceNumber,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'PAID',
      description: invoice.description || 'Subscription payment',
      billingEmail: invoice.customer_email || undefined,
      invoiceDate: new Date(invoice.created * 1000),
      paidAt: new Date(),
      pdfUrl: invoice.invoice_pdf || undefined,
    },
  });

  console.log(`Payment succeeded for user ${subscription.userId}`);
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const subscription = await prisma.subscription.findUnique({
    where: { stripeCustomerId: customerId },
  });

  if (!subscription) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { userId: subscription.userId },
    data: {
      status: 'PAST_DUE',
    },
  });

  // Get user details
  const user = await prisma.user.findUnique({
    where: { id: subscription.userId },
    select: { email: true, name: true },
  });

  // Create failed payment record
  const invoiceAny = invoice as any;
  const paymentIntent = invoiceAny.payment_intent;
  const paymentIntentId = typeof paymentIntent === 'string'
    ? paymentIntent
    : paymentIntent?.id || `failed_${Date.now()}`;

  await prisma.payment.create({
    data: {
      userId: subscription.userId,
      stripePaymentId: paymentIntentId,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'FAILED',
      description: invoice.description || 'Subscription payment failed',
    },
  });

  // Send payment failed email
  if (user) {
    await sendPaymentFailedEmail(
      user.email!,
      user.name || 'there',
      subscription.plan,
      invoice.amount_due
    );
  }

  console.log(`Payment failed for user ${subscription.userId}, email sent`);
}

/**
 * Helper function to update subscription in database
 */
async function updateSubscriptionInDatabase(userId: string, subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanFromPriceId(priceId) || 'FREE';

  // Map Stripe status to our status enum
  const statusMap: Record<string, any> = {
    'active': 'ACTIVE',
    'canceled': 'CANCELED',
    'past_due': 'PAST_DUE',
    'trialing': 'TRIALING',
    'incomplete': 'INCOMPLETE',
    'incomplete_expired': 'INCOMPLETE_EXPIRED',
    'unpaid': 'UNPAID',
  };

  // Access subscription properties with type assertion
  const subAny = subscription as any;

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: statusMap[subscription.status] || 'ACTIVE',
      currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : new Date(),
      currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : new Date(),
      cancelAtPeriodEnd: subAny.cancel_at_period_end || false,
      trialStart: subAny.trial_start ? new Date(subAny.trial_start * 1000) : null,
      trialEnd: subAny.trial_end ? new Date(subAny.trial_end * 1000) : null,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan,
      status: statusMap[subscription.status] || 'ACTIVE',
      currentPeriodStart: subAny.current_period_start ? new Date(subAny.current_period_start * 1000) : undefined,
      currentPeriodEnd: subAny.current_period_end ? new Date(subAny.current_period_end * 1000) : undefined,
      cancelAtPeriodEnd: subAny.cancel_at_period_end || false,
      canceledAt: subAny.canceled_at ? new Date(subAny.canceled_at * 1000) : null,
    },
  });
}

