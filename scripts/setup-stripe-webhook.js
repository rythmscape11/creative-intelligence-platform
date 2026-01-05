#!/usr/bin/env node

/**
 * Stripe Webhook Setup Script
 * 
 * This script creates a webhook endpoint in Stripe for MediaPlanPro.
 * 
 * Usage: node scripts/setup-stripe-webhook.js
 */

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51RVmzSSCgbpeaEOSJTqR0p31cEJFOfZGY6u4syqwRWFl5vB09yc0M153vp3gSzGJQsgubEySLREd4H6XOzWnWNmp00aurMRNXO';
const WEBHOOK_URL = 'https://www.mediaplanpro.com/api/stripe/webhook';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function setupWebhook() {
  console.log('🚀 Setting up Stripe webhook for MediaPlanPro...\n');

  try {
    // Check if webhook already exists
    const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const existingWebhook = existingWebhooks.data.find(w => w.url === WEBHOOK_URL);

    if (existingWebhook) {
      console.log('✅ Webhook endpoint already exists:', existingWebhook.id);
      console.log('📋 Webhook Secret:', existingWebhook.secret);
      console.log('\n📋 Add this to your .env file:');
      console.log(`STRIPE_WEBHOOK_SECRET="${existingWebhook.secret}"`);
      console.log('\n📋 Also add this to Vercel environment variables!\n');
      return existingWebhook.secret;
    }

    // Create webhook endpoint
    console.log('📦 Creating webhook endpoint...');
    
    const webhook = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.paid',
        'invoice.payment_failed',
      ],
      description: 'MediaPlanPro subscription events',
    });

    console.log('✅ Webhook endpoint created:', webhook.id);
    console.log('📋 Webhook Secret:', webhook.secret);
    console.log('\n📋 Add this to your .env file:');
    console.log(`STRIPE_WEBHOOK_SECRET="${webhook.secret}"`);
    console.log('\n📋 Also add this to Vercel environment variables!\n');

    return webhook.secret;

  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupWebhook()
    .then(() => {
      console.log('✅ Webhook setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Webhook setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupWebhook };

