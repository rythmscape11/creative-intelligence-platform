/**
 * Razorpay Webhook Handler
 * 
 * Processes Razorpay webhook events for subscriptions and payments.
 * Handles subscription lifecycle, payment confirmations, and failures.
 * 
 * UPDATED: Now supports per-product subscriptions via ProductSubscription model
 * UPDATED: Now initializes Forge credits and logs PaymentEvents for audit trail
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import {
  verifyRazorpayWebhookSignature,
  mapRazorpayStatus,
  mapRazorpayPaymentStatus,
  getRazorpayPlanFromId,
  RAZORPAY_WEBHOOK_EVENTS,
  formatRazorpayAmount,
} from '@/lib/razorpay';
import {
  sendWelcomeEmail,
  sendPurchaseConfirmationEmail,
  sendPaymentFailedEmail,
  sendSubscriptionCanceledEmail,
} from '@/lib/email';
import { ProductType, ProductPlanTier } from '@prisma/client';
import { initializeCredits, renewCredits } from '@/lib/services/billing/credit-service';

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs';

/**
 * Log payment event for audit trail
 */
async function logPaymentEvent(eventType: string, eventId: string, rawPayload: any) {
  try {
    await prisma.paymentEvent.upsert({
      where: { eventId },
      update: {
        status: 'processed',
        processedAt: new Date(),
      },
      create: {
        eventType,
        eventId,
        source: 'razorpay',
        rawPayload,
        status: 'processed',
        processedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('[Webhook] Error logging payment event:', error);
  }
}

/**
 * Map platform plan to Forge tier
 */
function mapPlanToForgeTier(plan: string): string {
  const mapping: Record<string, string> = {
    'FREE': 'freelancer',
    'PRO': 'studio',
    'AGENCY': 'agency',
    'ENTERPRISE': 'enterprise',
  };
  return mapping[plan] || 'freelancer';
}

/**
 * POST /api/webhooks/razorpay
 * 
 * Handle Razorpay webhook events
 */
export async function POST(req: NextRequest) {
  try {
    // Get webhook signature from headers
    const headersList = await headers();
    const signature = headersList.get('x-razorpay-signature');

    if (!signature) {
      console.error('No Razorpay signature found');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await req.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify webhook signature
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      console.error('Invalid Razorpay webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Parse webhook payload
    const event = JSON.parse(rawBody);
    const eventType = event.event;

    console.log(`Received Razorpay webhook: ${eventType}`);

    // Check if this is a per-product subscription (has product in notes)
    const subscription = event.payload?.subscription?.entity;
    const isProductSubscription = subscription?.notes?.product;

    // Handle different event types
    switch (eventType) {
      case RAZORPAY_WEBHOOK_EVENTS.SUBSCRIPTION_ACTIVATED:
        if (isProductSubscription) {
          await handleProductSubscriptionActivated(event);
        } else {
          await handleSubscriptionActivated(event);
        }
        break;

      case RAZORPAY_WEBHOOK_EVENTS.SUBSCRIPTION_CHARGED:
        if (isProductSubscription) {
          await handleProductSubscriptionCharged(event);
        } else {
          await handleSubscriptionCharged(event);
        }
        break;

      case RAZORPAY_WEBHOOK_EVENTS.SUBSCRIPTION_CANCELLED:
        if (isProductSubscription) {
          await handleProductSubscriptionCancelled(event);
        } else {
          await handleSubscriptionCancelled(event);
        }
        break;

      case RAZORPAY_WEBHOOK_EVENTS.SUBSCRIPTION_COMPLETED:
        await handleSubscriptionCompleted(event);
        break;

      case RAZORPAY_WEBHOOK_EVENTS.PAYMENT_CAPTURED:
        await handlePaymentCaptured(event);
        break;

      case RAZORPAY_WEBHOOK_EVENTS.PAYMENT_FAILED:
        await handlePaymentFailed(event);
        break;

      default:
        console.log(`Unhandled Razorpay event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}


/**
 * Handle subscription.activated event
 */
async function handleSubscriptionActivated(event: any) {
  try {
    const subscription = event.payload.subscription.entity;
    const payment = event.payload.payment?.entity;

    console.log('Processing subscription.activated:', subscription.id);

    // Find user by Razorpay customer ID
    const userSubscription = await prisma.subscription.findFirst({
      where: { razorpayCustomerId: subscription.customer_id },
      include: { user: true },
    });

    if (!userSubscription) {
      console.error('User not found for Razorpay customer:', subscription.customer_id);
      return;
    }

    // Determine plan from subscription - includes AGENCY tier
    const plan = getRazorpayPlanFromId(subscription.plan_id);

    // Calculate period end (Razorpay uses Unix timestamps in seconds)
    const currentPeriodEnd = subscription.current_end
      ? new Date(subscription.current_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days

    // Update subscription in database
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        plan,
        status: mapRazorpayStatus(subscription.status) as any,
        razorpaySubscriptionId: subscription.id,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
        paymentGateway: 'razorpay',
      },
    });

    // Initialize Forge credits based on plan tier
    const forgeTier = mapPlanToForgeTier(plan);
    await initializeCredits(userSubscription.userId, forgeTier);
    console.log(`Initialized Forge credits for user ${userSubscription.userId} (tier: ${forgeTier})`);

    // Send welcome and purchase confirmation emails
    if (userSubscription.user.email) {
      await sendWelcomeEmail(
        userSubscription.user.email,
        userSubscription.user.name || 'there'
      );

      if (payment) {
        await sendPurchaseConfirmationEmail(
          userSubscription.user.email,
          userSubscription.user.name || 'there',
          plan,
          payment.amount,
          undefined // Razorpay doesn't provide invoice URL in webhook
        );
      }
    }

    console.log(`Subscription activated for user ${userSubscription.userId}`);

    // Log payment event for audit trail
    await logPaymentEvent('subscription.activated', event.payload.subscription.entity.id, event.payload);
  } catch (error) {
    console.error('Error handling subscription.activated:', error);
    throw error;
  }
}

/**
 * Handle subscription.charged event
 */
async function handleSubscriptionCharged(event: any) {
  try {
    const subscription = event.payload.subscription.entity;
    const payment = event.payload.payment.entity;

    console.log('Processing subscription.charged:', subscription.id);

    // Find subscription
    const userSubscription = await prisma.subscription.findFirst({
      where: { razorpaySubscriptionId: subscription.id },
      include: { user: true },
    });

    if (!userSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: userSubscription.userId,
        razorpayPaymentId: payment.id,
        razorpayOrderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: mapRazorpayPaymentStatus(payment.status) as any,
        description: `Subscription payment - ${subscription.plan_id}`,
        paymentGateway: 'razorpay',
      },
    });

    // Update subscription period end
    if (subscription.current_end) {
      await prisma.subscription.update({
        where: { id: userSubscription.id },
        data: {
          currentPeriodEnd: new Date(subscription.current_end * 1000),
          status: mapRazorpayStatus(subscription.status) as any,
        },
      });
    }

    console.log(`Payment recorded for subscription ${subscription.id}`);
  } catch (error) {
    console.error('Error handling subscription.charged:', error);
    throw error;
  }
}

/**
 * Handle subscription.cancelled event
 */
async function handleSubscriptionCancelled(event: any) {
  try {
    const subscription = event.payload.subscription.entity;

    console.log('Processing subscription.cancelled:', subscription.id);

    // Find subscription
    const userSubscription = await prisma.subscription.findFirst({
      where: { razorpaySubscriptionId: subscription.id },
      include: { user: true },
    });

    if (!userSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        status: 'CANCELED' as any,
        plan: 'FREE',
        canceledAt: new Date(),
        cancelAtPeriodEnd: false,
      },
    });

    // Send cancellation email
    if (userSubscription.user.email && userSubscription.currentPeriodEnd) {
      await sendSubscriptionCanceledEmail(
        userSubscription.user.email,
        userSubscription.user.name || 'there',
        userSubscription.plan,
        userSubscription.currentPeriodEnd
      );
    }

    console.log(`Subscription cancelled for user ${userSubscription.userId}`);
  } catch (error) {
    console.error('Error handling subscription.cancelled:', error);
    throw error;
  }
}

/**
 * Handle subscription.completed event
 */
async function handleSubscriptionCompleted(event: any) {
  try {
    const subscription = event.payload.subscription.entity;

    console.log('Processing subscription.completed:', subscription.id);

    // Find subscription
    const userSubscription = await prisma.subscription.findFirst({
      where: { razorpaySubscriptionId: subscription.id },
    });

    if (!userSubscription) {
      console.error('Subscription not found:', subscription.id);
      return;
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        status: 'CANCELED' as any,
        plan: 'FREE',
      },
    });

    console.log(`Subscription completed for user ${userSubscription.userId}`);
  } catch (error) {
    console.error('Error handling subscription.completed:', error);
    throw error;
  }
}

/**
 * Handle payment.captured event
 */
async function handlePaymentCaptured(event: any) {
  try {
    const payment = event.payload.payment.entity;

    console.log('Processing payment.captured:', payment.id);

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayPaymentId: payment.id },
    });

    if (existingPayment) {
      console.log('Payment already recorded:', payment.id);
      return;
    }

    // Check payment notes for user info (credit purchases include notes)
    const notes = payment.notes || {};
    const userId = notes.userId;
    const credits = parseInt(notes.credits || '0', 10);
    const userEmail = notes.userEmail;

    if (userId && credits) {
      // This is a credit purchase
      console.log(`Processing credit purchase: ${credits} credits for user ${userId}`);

      // Find user by external ID (Clerk ID) or email
      let dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { id: userId },
            { email: userEmail },
          ]
        },
      });

      if (!dbUser && userEmail) {
        dbUser = await prisma.user.findFirst({
          where: { email: userEmail },
        });
      }

      if (dbUser) {
        // Create payment record
        await prisma.payment.create({
          data: {
            userId: dbUser.id,
            razorpayPaymentId: payment.id,
            razorpayOrderId: payment.order_id,
            amount: payment.amount,
            currency: payment.currency || 'INR',
            status: 'SUCCEEDED',
            description: `Credit purchase - ${credits} credits`,
            paymentGateway: 'razorpay',
          },
        });

        // Log payment event
        await logPaymentEvent('payment.captured', payment.id, event.payload);

        // Add credits to user (using AnalyserUsage model)
        try {
          await prisma.analyserUsage.upsert({
            where: { userId: dbUser.id },
            update: {
              creditsRemaining: { increment: credits },
            },
            create: {
              userId: dbUser.id,
              creditsRemaining: credits,
              creditsUsed: 0,
            },
          });
          console.log(`Added ${credits} credits to user ${dbUser.id}`);
        } catch (creditError) {
          console.error('Error adding credits:', creditError);
        }

        console.log(`Credit payment recorded for user ${dbUser.id}:`, payment.id);
      } else {
        console.error('User not found for credit purchase:', { userId, userEmail });
      }
    } else {
      // This might be a standalone payment without notes
      console.log('Standalone payment captured (no credit notes):', payment.id);
    }
  } catch (error) {
    console.error('Error handling payment.captured:', error);
    throw error;
  }
}


/**
 * Handle payment.failed event
 */
async function handlePaymentFailed(event: any) {
  try {
    const payment = event.payload.payment.entity;

    console.log('Processing payment.failed:', payment.id);

    // Find subscription by order ID or payment ID
    const userSubscription = await prisma.subscription.findFirst({
      where: {
        OR: [
          { razorpaySubscriptionId: payment.subscription_id },
        ],
      },
      include: { user: true },
    });

    if (!userSubscription) {
      console.error('Subscription not found for failed payment');
      return;
    }

    // Create failed payment record
    await prisma.payment.create({
      data: {
        userId: userSubscription.userId,
        razorpayPaymentId: payment.id,
        razorpayOrderId: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        status: 'FAILED' as any,
        description: `Failed payment - ${payment.description || 'Subscription'}`,
        paymentGateway: 'razorpay',
      },
    });

    // Update subscription status
    await prisma.subscription.update({
      where: { id: userSubscription.id },
      data: {
        status: 'PAST_DUE' as any,
      },
    });

    // Send payment failed email
    if (userSubscription.user.email) {
      await sendPaymentFailedEmail(
        userSubscription.user.email,
        userSubscription.user.name || 'there',
        userSubscription.plan,
        payment.amount
      );
    }

    console.log(`Payment failed for user ${userSubscription.userId}`);
  } catch (error) {
    console.error('Error handling payment.failed:', error);
    throw error;
  }
}

// ============================================================================
// PER-PRODUCT SUBSCRIPTION HANDLERS
// ============================================================================

/**
 * Handle subscription.activated for per-product subscriptions
 */
async function handleProductSubscriptionActivated(event: any) {
  try {
    const subscription = event.payload.subscription.entity;
    const notes = subscription.notes || {};

    const userId = notes.userId;
    const product = notes.product as ProductType;
    const tier = notes.tier as ProductPlanTier;

    if (!userId || !product) {
      console.error('Missing userId or product in subscription notes');
      return;
    }

    console.log(`Processing product subscription activated: ${product} for user ${userId}`);

    // Calculate period dates
    const currentPeriodStart = new Date();
    const currentPeriodEnd = subscription.current_end
      ? new Date(subscription.current_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Upsert ProductSubscription
    await prisma.productSubscription.upsert({
      where: {
        userId_product: { userId, product },
      },
      update: {
        planTier: tier || 'PRO',
        status: 'ACTIVE',
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: subscription.plan_id,
        currentPeriodStart,
        currentPeriodEnd,
      },
      create: {
        userId,
        product,
        planTier: tier || 'PRO',
        status: 'ACTIVE',
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: subscription.plan_id,
        currentPeriodStart,
        currentPeriodEnd,
      },
    });

    // Track metric
    await prisma.adminMetric.create({
      data: {
        product,
        metric: 'new_subscription',
        value: 1,
        metadata: { tier, subscriptionId: subscription.id },
      },
    });

    console.log(`Product subscription activated: ${product} ${tier} for user ${userId}`);
  } catch (error) {
    console.error('Error handling product subscription.activated:', error);
    throw error;
  }
}

/**
 * Handle subscription.charged for per-product subscriptions
 */
async function handleProductSubscriptionCharged(event: any) {
  try {
    const subscription = event.payload.subscription.entity;
    const payment = event.payload.payment?.entity;
    const notes = subscription.notes || {};

    const product = notes.product as ProductType;

    if (!product) {
      console.error('Missing product in subscription notes');
      return;
    }

    console.log(`Processing product subscription charged: ${product}`);

    // Find and update ProductSubscription
    const productSub = await prisma.productSubscription.findFirst({
      where: { razorpaySubscriptionId: subscription.id },
    });

    if (productSub && subscription.current_end) {
      await prisma.productSubscription.update({
        where: { id: productSub.id },
        data: {
          currentPeriodEnd: new Date(subscription.current_end * 1000),
          status: 'ACTIVE',
        },
      });
    }

    // Track revenue metric
    if (payment) {
      await prisma.adminMetric.create({
        data: {
          product,
          metric: 'revenue',
          value: payment.amount / 100, // Convert from paise
          metadata: { paymentId: payment.id },
        },
      });
    }

    console.log(`Product subscription charged: ${product}`);
  } catch (error) {
    console.error('Error handling product subscription.charged:', error);
    throw error;
  }
}

/**
 * Handle subscription.cancelled for per-product subscriptions
 */
async function handleProductSubscriptionCancelled(event: any) {
  try {
    const subscription = event.payload.subscription.entity;
    const notes = subscription.notes || {};

    const product = notes.product as ProductType;

    console.log(`Processing product subscription cancelled: ${subscription.id}`);

    // Find and update ProductSubscription
    const productSub = await prisma.productSubscription.findFirst({
      where: { razorpaySubscriptionId: subscription.id },
    });

    if (productSub) {
      await prisma.productSubscription.update({
        where: { id: productSub.id },
        data: {
          status: 'CANCELED',
          canceledAt: new Date(),
        },
      });

      // Track churn metric
      await prisma.adminMetric.create({
        data: {
          product: productSub.product,
          metric: 'churn',
          value: 1,
          metadata: { tier: productSub.planTier },
        },
      });
    }

    console.log(`Product subscription cancelled: ${subscription.id}`);
  } catch (error) {
    console.error('Error handling product subscription.cancelled:', error);
    throw error;
  }
}
