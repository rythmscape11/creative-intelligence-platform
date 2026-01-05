/**
 * STRIPE INTEGRATION DISABLED
 *
 * This file is kept for reference but Stripe integration is disabled.
 * All payment processing now uses Razorpay exclusively.
 *
 * To re-enable Stripe, uncomment the code below and configure environment variables.
 * See STRIPE_REMOVAL_GUIDE.md for more information.
 */

import Stripe from 'stripe';

/**
 * Stripe client instance - DISABLED
 * Configured with the latest API version and TypeScript support
 */
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️  STRIPE INTEGRATION DISABLED. All payments now use Razorpay. See STRIPE_REMOVAL_GUIDE.md');
}

// Stripe client disabled - keeping for reference
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'MediaPlanPro',
    version: '1.0.0',
    url: 'https://www.aureonone.in',
  },
});

/**
 * Stripe Price IDs from environment variables
 */
export const STRIPE_PRICES = {
  PROFESSIONAL_MONTHLY: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
  PROFESSIONAL_ANNUAL: process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID || '',
} as const;

/**
 * Subscription plan mapping
 */
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    interval: 'forever' as const,
    features: [
      '1 strategy per month',
      'Basic AI assistance',
      'PDF export',
      'Community support',
    ],
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 49,
    interval: 'month' as const,
    priceId: STRIPE_PRICES.PROFESSIONAL_MONTHLY,
    features: [
      'Unlimited strategies',
      'Advanced AI assistance',
      'All export formats',
      'Priority support',
      'Team collaboration',
      'Analytics dashboard',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: null, // Custom pricing
    interval: 'custom' as const,
    features: [
      'Everything in Professional',
      'Custom AI training',
      'API access',
      'SLA guarantee',
      'Dedicated support',
      'Custom integrations',
    ],
  },
} as const;

/**
 * Helper function to format currency
 */
export function formatPrice(amount: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

/**
 * Helper function to get plan name from Stripe price ID
 */
export function getPlanFromPriceId(priceId: string): 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE' | null {
  if (priceId === STRIPE_PRICES.PROFESSIONAL_MONTHLY || priceId === STRIPE_PRICES.PROFESSIONAL_ANNUAL) {
    return 'PRO';
  }
  return null;
}

