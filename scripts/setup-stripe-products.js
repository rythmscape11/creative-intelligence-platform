#!/usr/bin/env node

/**
 * Stripe Product Setup Script
 *
 * This script creates the required products and prices in Stripe for MediaPlanPro.
 * Run this once to set up your Stripe account with the correct products.
 *
 * Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.js
 */

const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51RVmzSSCgbpeaEOSJTqR0p31cEJFOfZGY6u4syqwRWFl5vB09yc0M153vp3gSzGJQsgubEySLREd4H6XOzWnWNmp00aurMRNXO';

if (!STRIPE_SECRET_KEY || !STRIPE_SECRET_KEY.startsWith('sk_')) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is not set or invalid');
  console.error('Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.js');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function setupStripeProducts() {
  console.log('🚀 Setting up Stripe products for MediaPlanPro...\n');

  try {
    // Check if products already exist
    const existingProducts = await stripe.products.list({ limit: 100 });
    const proProduct = existingProducts.data.find(p => p.name === 'MediaPlanPro - Pro Plan');
    const teamProduct = existingProducts.data.find(p => p.name === 'MediaPlanPro - Team Plan');

    let proPriceMonthly, proPriceYearly, teamPriceMonthly, teamPriceYearly;

    // Create or get Pro Plan
    if (proProduct) {
      console.log('✅ Pro Plan product already exists:', proProduct.id);
      
      // Get existing prices
      const proPrices = await stripe.prices.list({ product: proProduct.id });
      proPriceMonthly = proPrices.data.find(p => p.recurring?.interval === 'month');
      proPriceYearly = proPrices.data.find(p => p.recurring?.interval === 'year');
    } else {
      console.log('📦 Creating Pro Plan product...');
      
      const product = await stripe.products.create({
        name: 'MediaPlanPro - Pro Plan',
        description: 'Save results, PDF exports, AI recommendations, and priority support',
        metadata: {
          plan: 'PRO',
          features: 'save_results,pdf_exports,ai_recommendations,priority_support',
        },
      });

      console.log('✅ Pro Plan product created:', product.id);

      // Create monthly price
      proPriceMonthly = await stripe.prices.create({
        product: product.id,
        unit_amount: 3900, // $39.00
        currency: 'usd',
        recurring: {
          interval: 'month',
          trial_period_days: 14,
        },
        metadata: {
          plan: 'PRO',
          billing: 'monthly',
        },
      });

      console.log('✅ Pro Plan monthly price created:', proPriceMonthly.id);

      // Create yearly price
      proPriceYearly = await stripe.prices.create({
        product: product.id,
        unit_amount: 39000, // $390.00 (save $78/year)
        currency: 'usd',
        recurring: {
          interval: 'year',
          trial_period_days: 14,
        },
        metadata: {
          plan: 'PRO',
          billing: 'yearly',
        },
      });

      console.log('✅ Pro Plan yearly price created:', proPriceYearly.id);
    }

    // Create or get Team Plan
    if (teamProduct) {
      console.log('✅ Team Plan product already exists:', teamProduct.id);
      
      // Get existing prices
      const teamPrices = await stripe.prices.list({ product: teamProduct.id });
      teamPriceMonthly = teamPrices.data.find(p => p.recurring?.interval === 'month');
      teamPriceYearly = teamPrices.data.find(p => p.recurring?.interval === 'year');
    } else {
      console.log('📦 Creating Team Plan product...');
      
      const product = await stripe.products.create({
        name: 'MediaPlanPro - Team Plan',
        description: 'Team collaboration, up to 10 members, shared workspace, and advanced analytics',
        metadata: {
          plan: 'TEAM',
          features: 'all_pro_features,team_collaboration,10_members,shared_workspace,advanced_analytics',
        },
      });

      console.log('✅ Team Plan product created:', product.id);

      // Create monthly price
      teamPriceMonthly = await stripe.prices.create({
        product: product.id,
        unit_amount: 9900, // $99.00
        currency: 'usd',
        recurring: {
          interval: 'month',
          trial_period_days: 14,
        },
        metadata: {
          plan: 'TEAM',
          billing: 'monthly',
        },
      });

      console.log('✅ Team Plan monthly price created:', teamPriceMonthly.id);

      // Create yearly price
      teamPriceYearly = await stripe.prices.create({
        product: product.id,
        unit_amount: 99000, // $990.00 (save $198/year)
        currency: 'usd',
        recurring: {
          interval: 'year',
          trial_period_days: 14,
        },
        metadata: {
          plan: 'TEAM',
          billing: 'yearly',
        },
      });

      console.log('✅ Team Plan yearly price created:', teamPriceYearly.id);
    }

    // Display results
    console.log('\n🎉 Stripe setup complete!\n');
    console.log('📋 Add these Price IDs to your .env file:\n');
    console.log(`NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID="${proPriceMonthly.id}"`);
    console.log(`NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID="${proPriceYearly.id}"`);
    console.log(`NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID="${teamPriceMonthly.id}"`);
    console.log(`NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID="${teamPriceYearly.id}"`);
    console.log('\n📋 Also add these to Vercel environment variables!\n');

    // Return the price IDs for programmatic use
    return {
      proMonthly: proPriceMonthly.id,
      proYearly: proPriceYearly.id,
      teamMonthly: teamPriceMonthly.id,
      teamYearly: teamPriceYearly.id,
    };

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  setupStripeProducts()
    .then(() => {
      console.log('✅ Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupStripeProducts };

