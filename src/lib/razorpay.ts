/**
 * Razorpay Configuration and Utilities
 * 
 * Handles Razorpay payment gateway integration for Indian customers.
 * Supports subscriptions, one-time payments, and webhook verification.
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';

// ⚠️ SECURITY: Never commit these credentials to the repository
// These should be set in Vercel environment variables
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_placeholder';

// Check if Razorpay is properly configured
export const isRazorpayConfigured =
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder' &&
  process.env.RAZORPAY_KEY_SECRET &&
  process.env.RAZORPAY_KEY_SECRET !== 'test_secret_placeholder';

if (!isRazorpayConfigured) {
  console.warn('⚠️  RAZORPAY credentials are not set. Using placeholders for build. Payment features will not work until configured.');
}

// Check if Razorpay plans are configured
if (!process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID ||
  !process.env.RAZORPAY_PRO_YEARLY_PLAN_ID ||
  !process.env.RAZORPAY_TEAM_MONTHLY_PLAN_ID ||
  !process.env.RAZORPAY_TEAM_YEARLY_PLAN_ID ||
  process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID.includes('placeholder') ||
  process.env.RAZORPAY_PRO_YEARLY_PLAN_ID.includes('placeholder')) {
  console.warn('⚠️  RAZORPAY subscription plans are not configured.');
  console.warn('   Please create plans in Razorpay Dashboard and update these environment variables:');
  console.warn('   - RAZORPAY_PRO_MONTHLY_PLAN_ID');
  console.warn('   - RAZORPAY_PRO_YEARLY_PLAN_ID');
  console.warn('   - RAZORPAY_TEAM_MONTHLY_PLAN_ID');
  console.warn('   - RAZORPAY_TEAM_YEARLY_PLAN_ID');
  console.warn('   See RAZORPAY_COMPLETE_SETUP.md for detailed instructions.');
}

// Initialize Razorpay instance
let razorpayInstance: Razorpay | null = null;

try {
  razorpayInstance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
} catch (error) {
  console.error('Failed to initialize Razorpay:', error);
}

export const razorpay = razorpayInstance as Razorpay;

/**
 * Razorpay Plan Configuration
 *
 * Note: Razorpay uses paise (1 INR = 100 paise)
 *
 * Pro Plan: ₹1,699/month or ₹16,990/year (17% discount)
 * Team Plan: ₹4,999/month or ₹49,990/year (17% discount)
 */
export const RAZORPAY_PLANS = {
  PRO_MONTHLY: {
    id: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || 'plan_placeholder',
    name: 'Pro Monthly',
    amount: 409900, // ₹4,099 in paise (Matches pricing.ts)
    currency: 'INR',
    period: 'monthly',
    interval: 1,
  },
  PRO_YEARLY: {
    id: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || 'plan_annual_placeholder',
    name: 'Pro Yearly',
    amount: 4099000, // ₹40,990 in paise (Matches pricing.ts)
    currency: 'INR',
    period: 'yearly',
    interval: 1,
  },
  AGENCY_MONTHLY: {
    id: process.env.RAZORPAY_AGENCY_MONTHLY_PLAN_ID || 'plan_agency_monthly_placeholder',
    name: 'Agency Monthly',
    amount: 2499900, // ₹24,999 in paise (Matches pricing.ts)
    currency: 'INR',
    period: 'monthly',
    interval: 1,
  },
  AGENCY_YEARLY: {
    id: process.env.RAZORPAY_AGENCY_YEARLY_PLAN_ID || 'plan_agency_yearly_placeholder',
    name: 'Agency Yearly',
    amount: 24999000, // ₹249,990 in paise (Matches pricing.ts)
    currency: 'INR',
    period: 'yearly',
    interval: 1,
  },
  // Legacy TEAM plans (mapped to AGENCY for backwards compatibility)
  TEAM_MONTHLY: {
    id: process.env.RAZORPAY_TEAM_MONTHLY_PLAN_ID || 'plan_team_monthly_placeholder',
    name: 'Team Monthly (Legacy)',
    amount: 529900, // ₹5,299 in paise
    currency: 'INR',
    period: 'monthly',
    interval: 1,
  },
  TEAM_YEARLY: {
    id: process.env.RAZORPAY_TEAM_YEARLY_PLAN_ID || 'plan_team_yearly_placeholder',
    name: 'Team Yearly (Legacy)',
    amount: 5299000, // ₹52,990 in paise
    currency: 'INR',
    period: 'yearly',
    interval: 1,
  },
} as const;

/**
 * Format amount from paise to INR
 */
export function formatRazorpayAmount(amountInPaise: number): string {
  const amountInINR = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountInINR);
}

/**
 * Get plan details from plan ID
 * Maps Razorpay plan IDs to our tier names
 */
export function getRazorpayPlanFromId(planId: string): 'FREE' | 'PRO' | 'AGENCY' | 'ENTERPRISE' {
  // Check PRO plans
  if (planId === RAZORPAY_PLANS.PRO_MONTHLY.id || planId === RAZORPAY_PLANS.PRO_YEARLY.id) {
    return 'PRO';
  }
  // Check AGENCY plans
  if (planId === RAZORPAY_PLANS.AGENCY_MONTHLY.id || planId === RAZORPAY_PLANS.AGENCY_YEARLY.id) {
    return 'AGENCY';
  }
  // Legacy: TEAM plans now map to AGENCY
  if (planId === RAZORPAY_PLANS.TEAM_MONTHLY.id || planId === RAZORPAY_PLANS.TEAM_YEARLY.id) {
    return 'AGENCY'; // Backwards compatibility
  }
  return 'FREE';
}

/**
 * Verify Razorpay webhook signature
 * 
 * This is critical for security - ensures webhooks are from Razorpay
 */
export function verifyRazorpayWebhookSignature(
  webhookBody: string,
  webhookSignature: string,
  webhookSecret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    return expectedSignature === webhookSignature;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Verify Razorpay payment signature
 * 
 * Used to verify payment completion on the client side
 */
export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Payment signature verification failed:', error);
    return false;
  }
}

/**
 * Create Razorpay subscription
 */
export async function createRazorpaySubscription(
  planId: string,
  customerId: string,
  customerEmail: string,
  customerName: string,
  totalCount?: number
) {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: totalCount || 12, // Default to 12 billing cycles
      quantity: 1,
      notes: {
        customer_id: customerId,
        customer_email: customerEmail,
        customer_name: customerName,
      },
    });

    return subscription;
  } catch (error) {
    console.error('Error creating Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Create Razorpay order for one-time payment
 */
export async function createRazorpayOrder(
  amount: number,
  currency: string = 'INR',
  receipt: string,
  notes?: Record<string, string>
) {
  try {
    console.log('[Razorpay] Creating order with params:', {
      amount,
      currency,
      receipt,
      notes,
      isConfigured: isRazorpayConfigured,
      hasInstance: !!razorpay,
      keyId: razorpayKeyId?.substring(0, 10) + '...',
    });

    if (!isRazorpayConfigured) {
      const error = new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
      console.error('[Razorpay] Configuration error:', error.message);
      throw error;
    }

    if (!razorpay) {
      const error = new Error('Razorpay instance not initialized. Check your API credentials.');
      console.error('[Razorpay] Instance error:', error.message);
      throw error;
    }

    // Validate amount (must be positive integer in paise)
    if (!amount || amount <= 0 || !Number.isInteger(amount)) {
      const error = new Error(`Invalid amount: ${amount}. Amount must be a positive integer in paise.`);
      console.error('[Razorpay] Validation error:', error.message);
      throw error;
    }

    console.log('[Razorpay] Calling Razorpay API to create order...');
    const order = await razorpay.orders.create({
      amount, // Amount in paise
      currency,
      receipt,
      notes,
    });

    console.log('[Razorpay] Order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });

    return order;
  } catch (error: any) {
    console.error('[Razorpay] Error creating order:', error);
    console.error('[Razorpay] Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
      description: error.error?.description,
      code: error.error?.code,
      field: error.error?.field,
      source: error.error?.source,
      step: error.error?.step,
      reason: error.error?.reason,
    });

    // Provide user-friendly error messages
    if (error.statusCode === 401 || error.statusCode === 403) {
      throw new Error('Invalid Razorpay API credentials. Please contact support.');
    }

    if (error.statusCode === 400) {
      const description = error.error?.description || error.message;
      throw new Error(`Invalid payment request: ${description}`);
    }

    if (error.error?.description) {
      throw new Error(error.error.description);
    }

    throw error;
  }
}

/**
 * Cancel Razorpay subscription
 */
export async function cancelRazorpaySubscription(subscriptionId: string) {
  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Fetch Razorpay subscription details
 */
export async function fetchRazorpaySubscription(subscriptionId: string) {
  try {
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching Razorpay subscription:', error);
    throw error;
  }
}

/**
 * Fetch Razorpay payment details
 */
export async function fetchRazorpayPayment(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching Razorpay payment:', error);
    throw error;
  }
}

/**
 * Create Razorpay customer
 */
export async function createRazorpayCustomer(
  name: string,
  email: string,
  contact?: string
) {
  try {
    const customer = await razorpay.customers.create({
      name,
      email,
      contact,
      fail_existing: 0, // Don't fail if customer already exists
    });

    return customer;
  } catch (error) {
    console.error('Error creating Razorpay customer:', error);
    throw error;
  }
}

/**
 * Map Razorpay subscription status to our internal status
 */
export function mapRazorpayStatus(razorpayStatus: string): string {
  const statusMap: Record<string, string> = {
    created: 'ACTIVE',
    authenticated: 'ACTIVE',
    active: 'ACTIVE',
    pending: 'INCOMPLETE',
    halted: 'PAST_DUE',
    cancelled: 'CANCELED',
    completed: 'CANCELED',
    expired: 'CANCELED',
  };

  return statusMap[razorpayStatus] || 'INCOMPLETE';
}

/**
 * Map Razorpay payment status to our internal status
 */
export function mapRazorpayPaymentStatus(razorpayStatus: string): string {
  const statusMap: Record<string, string> = {
    created: 'PENDING',
    authorized: 'PENDING',
    captured: 'SUCCEEDED',
    refunded: 'REFUNDED',
    failed: 'FAILED',
  };

  return statusMap[razorpayStatus] || 'PENDING';
}

/**
 * Get Razorpay checkout options for client-side
 */
export function getRazorpayCheckoutOptions(
  idOrSubscriptionId: string,
  amount: number,
  currency: string,
  name: string,
  email: string,
  contact?: string,
  isSubscription: boolean = true
) {
  const options: any = {
    key: razorpayKeyId,
    amount,
    currency,
    name: 'Aureon One',
    description: 'Professional Plan Subscription',
    prefill: {
      name,
      email,
      contact,
    },
    theme: {
      color: '#667eea', // Brand color
    },
    modal: {
      ondismiss: () => {
        console.log('Checkout form closed');
      },
    },
  };

  // For subscriptions, use subscription_id; for orders, use order_id
  if (isSubscription) {
    options.subscription_id = idOrSubscriptionId;
  } else {
    options.order_id = idOrSubscriptionId;
  }

  return options;
}

/**
 * Razorpay webhook event types
 */
export const RAZORPAY_WEBHOOK_EVENTS = {
  SUBSCRIPTION_ACTIVATED: 'subscription.activated',
  SUBSCRIPTION_CHARGED: 'subscription.charged',
  SUBSCRIPTION_COMPLETED: 'subscription.completed',
  SUBSCRIPTION_CANCELLED: 'subscription.cancelled',
  SUBSCRIPTION_PAUSED: 'subscription.paused',
  SUBSCRIPTION_RESUMED: 'subscription.resumed',
  PAYMENT_AUTHORIZED: 'payment.authorized',
  PAYMENT_CAPTURED: 'payment.captured',
  PAYMENT_FAILED: 'payment.failed',
  ORDER_PAID: 'order.paid',
} as const;

export type RazorpayWebhookEvent = typeof RAZORPAY_WEBHOOK_EVENTS[keyof typeof RAZORPAY_WEBHOOK_EVENTS];

