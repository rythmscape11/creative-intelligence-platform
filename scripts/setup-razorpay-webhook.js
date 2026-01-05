#!/usr/bin/env node

/**
 * Razorpay Webhook Setup Script
 * 
 * This script creates a webhook endpoint in Razorpay for MediaPlanPro.
 * 
 * Prerequisites:
 * 1. Razorpay account with API keys
 * 2. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables
 * 
 * Usage: node scripts/setup-razorpay-webhook.js
 */

const https = require('https');

// Get Razorpay credentials from environment
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const WEBHOOK_URL = 'https://www.mediaplanpro.com/api/webhooks/razorpay';

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error('❌ ERROR: Razorpay credentials not found!');
  console.error('');
  console.error('Please set the following environment variables:');
  console.error('  RAZORPAY_KEY_ID=your_key_id');
  console.error('  RAZORPAY_KEY_SECRET=your_key_secret');
  console.error('');
  console.error('Get your API keys from: https://dashboard.razorpay.com/app/keys');
  process.exit(1);
}

/**
 * Create webhook using Razorpay API
 */
async function createWebhook() {
  console.log('🚀 Setting up Razorpay webhook for MediaPlanPro...\n');

  const webhookData = {
    url: WEBHOOK_URL,
    active: true,
    events: [
      'subscription.activated',
      'subscription.charged',
      'subscription.completed',
      'subscription.cancelled',
      'subscription.paused',
      'subscription.resumed',
      'payment.captured',
      'payment.failed',
      'invoice.paid',
    ],
    alert_email: 'mukherjeeanustup@gmail.com', // Update with your email
  };

  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const postData = JSON.stringify(webhookData);

    const options = {
      hostname: 'api.razorpay.com',
      port: 443,
      path: '/v1/webhooks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Basic ${auth}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const webhook = JSON.parse(data);
          resolve(webhook);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Generate webhook secret
 */
function generateWebhookSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

async function setupWebhook() {
  try {
    console.log('📦 Creating webhook endpoint...');
    console.log(`📍 Webhook URL: ${WEBHOOK_URL}\n`);

    const webhook = await createWebhook();

    console.log('✅ Webhook endpoint created successfully!');
    console.log(`📋 Webhook ID: ${webhook.id}\n`);

    // Generate a webhook secret for signature verification
    const webhookSecret = generateWebhookSecret();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 Webhook setup complete!');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📋 Add this to your .env file:\n');
    console.log(`RAZORPAY_WEBHOOK_SECRET="${webhookSecret}"`);
    console.log('');
    console.log('📋 Also add this to Vercel environment variables!\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('⚠️  IMPORTANT: Configure Webhook Secret in Razorpay Dashboard');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('1. Go to: https://dashboard.razorpay.com/app/webhooks');
    console.log(`2. Find webhook: ${webhook.id}`);
    console.log('3. Click "Edit"');
    console.log('4. Set the webhook secret to:');
    console.log(`   ${webhookSecret}`);
    console.log('5. Save the changes');
    console.log('');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 Webhook Events Configured:');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('✅ subscription.activated   - When subscription is activated');
    console.log('✅ subscription.charged     - When subscription is charged');
    console.log('✅ subscription.completed   - When subscription is completed');
    console.log('✅ subscription.cancelled   - When subscription is cancelled');
    console.log('✅ subscription.paused      - When subscription is paused');
    console.log('✅ subscription.resumed     - When subscription is resumed');
    console.log('✅ payment.captured         - When payment is captured');
    console.log('✅ payment.failed           - When payment fails');
    console.log('✅ invoice.paid             - When invoice is paid');
    console.log('');

    console.log('✅ Webhook setup completed successfully!\n');

    return {
      webhookId: webhook.id,
      webhookSecret,
    };
  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('');
      console.log('ℹ️  Webhook already exists. You can manage it at:');
      console.log('   https://dashboard.razorpay.com/app/webhooks');
      console.log('');
      
      // Still generate and return a secret
      const webhookSecret = generateWebhookSecret();
      console.log('📋 Use this webhook secret:\n');
      console.log(`RAZORPAY_WEBHOOK_SECRET="${webhookSecret}"`);
      console.log('');
      
      return {
        webhookId: 'existing',
        webhookSecret,
      };
    }
    
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupWebhook()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Webhook setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupWebhook };

