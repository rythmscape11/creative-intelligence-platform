import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// Only initialize Stripe if API key is available
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
  })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

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

    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
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

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan || 'PRO';

  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Update or create subscription
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      plan: plan as any,
      status: 'TRIALING',
      paymentGateway: 'stripe',
    },
    create: {
      userId,
      stripeCustomerId: session.customer as string,
      stripeSubscriptionId: session.subscription as string,
      plan: plan as any,
      status: 'TRIALING',
      paymentGateway: 'stripe',
    },
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  const plan = subscription.metadata?.plan || 'PRO';

  // Handle both old and new Stripe API property names
  const currentPeriodStart = (subscription as any).current_period_start || (subscription as any).currentPeriodStart;
  const currentPeriodEnd = (subscription as any).current_period_end || (subscription as any).currentPeriodEnd;
  const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end ?? (subscription as any).cancelAtPeriodEnd ?? false;
  const trialStart = (subscription as any).trial_start || (subscription as any).trialStart;
  const trialEnd = (subscription as any).trial_end || (subscription as any).trialEnd;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      status: subscription.status.toUpperCase() as any,
      currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      cancelAtPeriodEnd,
      trialStart: trialStart ? new Date(trialStart * 1000) : null,
      trialEnd: trialEnd ? new Date(trialEnd * 1000) : null,
    },
    create: {
      userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      plan: plan as any,
      status: subscription.status.toUpperCase() as any,
      currentPeriodStart: currentPeriodStart ? new Date(currentPeriodStart * 1000) : null,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
      cancelAtPeriodEnd,
      trialStart: trialStart ? new Date(trialStart * 1000) : null,
      trialEnd: trialEnd ? new Date(trialEnd * 1000) : null,
      paymentGateway: 'stripe',
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
      plan: 'FREE',
    },
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Get subscription to find userId
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) {
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId as string },
  });

  if (!subscription) {
    return;
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      userId: subscription.userId,
      stripePaymentId: (invoice as any).payment_intent as string,
      stripeInvoiceId: invoice.id,
      amount: (invoice as any).amount_paid || 0,
      currency: (invoice as any).currency || 'usd',
      status: 'SUCCEEDED',
      description: (invoice as any).description || 'Subscription payment',
      paymentGateway: 'stripe',
    },
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  // Get subscription to find userId
  const subscriptionId = (invoice as any).subscription;
  if (!subscriptionId) {
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId as string },
  });

  if (!subscription) {
    return;
  }

  // Update subscription status
  await prisma.subscription.update({
    where: { userId: subscription.userId },
    data: {
      status: 'PAST_DUE',
    },
  });

  // Create failed payment record
  await prisma.payment.create({
    data: {
      userId: subscription.userId,
      stripePaymentId: (invoice as any).payment_intent as string,
      stripeInvoiceId: invoice.id,
      amount: (invoice as any).amount_due || 0,
      currency: (invoice as any).currency || 'usd',
      status: 'FAILED',
      description: (invoice as any).description || 'Subscription payment failed',
      paymentGateway: 'stripe',
    },
  });
}

