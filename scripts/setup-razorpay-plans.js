#!/usr/bin/env node
/**
 * Razorpay Plans Setup Script
 * 
 * Creates all subscription plans in Razorpay via API.
 * Run with: node scripts/setup-razorpay-plans.js
 * 
 * Required env vars: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 */

const Razorpay = require('razorpay');

// Check environment
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET');
  console.log('\nSet environment variables first:');
  console.log('export RAZORPAY_KEY_ID=your_key_id');
  console.log('export RAZORPAY_KEY_SECRET=your_key_secret');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan definitions matching product-plans.ts
// All amounts in paise (INR) - Razorpay requires paise
const PLANS = [
  // Agency OS
  { name: 'Agency OS Starter Monthly', amount: 239900, period: 'monthly', interval: 1, notes: { product: 'AGENCY_OS', tier: 'STARTER' } },
  { name: 'Agency OS Starter Yearly', amount: 2399000, period: 'yearly', interval: 1, notes: { product: 'AGENCY_OS', tier: 'STARTER' } },
  { name: 'Agency OS Pro Monthly', amount: 819900, period: 'monthly', interval: 1, notes: { product: 'AGENCY_OS', tier: 'PRO' } },
  { name: 'Agency OS Pro Yearly', amount: 8199000, period: 'yearly', interval: 1, notes: { product: 'AGENCY_OS', tier: 'PRO' } },
  { name: 'Agency OS Agency Monthly', amount: 2479900, period: 'monthly', interval: 1, notes: { product: 'AGENCY_OS', tier: 'AGENCY' } },
  { name: 'Agency OS Agency Yearly', amount: 24799000, period: 'yearly', interval: 1, notes: { product: 'AGENCY_OS', tier: 'AGENCY' } },

  // The Optimiser
  { name: 'Optimiser Starter Monthly', amount: 319900, period: 'monthly', interval: 1, notes: { product: 'OPTIMISER', tier: 'STARTER' } },
  { name: 'Optimiser Starter Yearly', amount: 3199000, period: 'yearly', interval: 1, notes: { product: 'OPTIMISER', tier: 'STARTER' } },
  { name: 'Optimiser Pro Monthly', amount: 1069900, period: 'monthly', interval: 1, notes: { product: 'OPTIMISER', tier: 'PRO' } },
  { name: 'Optimiser Pro Yearly', amount: 10699000, period: 'yearly', interval: 1, notes: { product: 'OPTIMISER', tier: 'PRO' } },
  { name: 'Optimiser Agency Monthly', amount: 2899900, period: 'monthly', interval: 1, notes: { product: 'OPTIMISER', tier: 'AGENCY' } },
  { name: 'Optimiser Agency Yearly', amount: 28999000, period: 'yearly', interval: 1, notes: { product: 'OPTIMISER', tier: 'AGENCY' } },

  // The Analyser
  { name: 'Analyser Starter Monthly', amount: 239900, period: 'monthly', interval: 1, notes: { product: 'ANALYSER', tier: 'STARTER' } },
  { name: 'Analyser Starter Yearly', amount: 2399000, period: 'yearly', interval: 1, notes: { product: 'ANALYSER', tier: 'STARTER' } },
  { name: 'Analyser Pro Monthly', amount: 819900, period: 'monthly', interval: 1, notes: { product: 'ANALYSER', tier: 'PRO' } },
  { name: 'Analyser Pro Yearly', amount: 8199000, period: 'yearly', interval: 1, notes: { product: 'ANALYSER', tier: 'PRO' } },
  { name: 'Analyser Agency Monthly', amount: 2069900, period: 'monthly', interval: 1, notes: { product: 'ANALYSER', tier: 'AGENCY' } },
  { name: 'Analyser Agency Yearly', amount: 20699000, period: 'yearly', interval: 1, notes: { product: 'ANALYSER', tier: 'AGENCY' } },

  // The Strategiser
  { name: 'Strategiser Solo Monthly', amount: 159900, period: 'monthly', interval: 1, notes: { product: 'STRATEGISER', tier: 'STARTER' } },
  { name: 'Strategiser Solo Yearly', amount: 1599000, period: 'yearly', interval: 1, notes: { product: 'STRATEGISER', tier: 'STARTER' } },
  { name: 'Strategiser Pro Monthly', amount: 409900, period: 'monthly', interval: 1, notes: { product: 'STRATEGISER', tier: 'PRO' } },
  { name: 'Strategiser Pro Yearly', amount: 4099000, period: 'yearly', interval: 1, notes: { product: 'STRATEGISER', tier: 'PRO' } },
  { name: 'Strategiser Agency Monthly', amount: 1239900, period: 'monthly', interval: 1, notes: { product: 'STRATEGISER', tier: 'AGENCY' } },
  { name: 'Strategiser Agency Yearly', amount: 12399000, period: 'yearly', interval: 1, notes: { product: 'STRATEGISER', tier: 'AGENCY' } },
];

async function createPlans() {
  console.log('🚀 Creating Razorpay Plans...\n');
  console.log('Currency: INR (amounts in paise)\n');

  const createdPlans = [];
  const failedPlans = [];

  for (const plan of PLANS) {
    try {
      const result = await razorpay.plans.create({
        period: plan.period,
        interval: plan.interval,
        item: {
          name: plan.name,
          amount: plan.amount,
          currency: 'INR',
          description: `${plan.notes.product} - ${plan.notes.tier} (${plan.period})`,
        },
        notes: plan.notes,
      });

      console.log(`✅ ${plan.name}: ${result.id}`);
      createdPlans.push({ name: plan.name, id: result.id, ...plan.notes });
    } catch (error) {
      console.log(`❌ ${plan.name}: ${error.message}`);
      failedPlans.push({ name: plan.name, error: error.message });
    }
  }

  console.log('\n📋 Summary:');
  console.log(`Created: ${createdPlans.length}/${PLANS.length}`);
  console.log(`Failed: ${failedPlans.length}/${PLANS.length}`);

  if (createdPlans.length > 0) {
    console.log('\n📝 Add these to your .env file:\n');

    const envVars = {};
    createdPlans.forEach(p => {
      const period = p.name.includes('Monthly') ? 'MONTHLY' : 'YEARLY';
      const envKey = `RAZORPAY_${p.product}_${p.tier}_${period}`;
      envVars[envKey] = p.id;
      console.log(`${envKey}=${p.id}`);
    });
  }

  return { created: createdPlans, failed: failedPlans };
}

// List existing plans
async function listPlans() {
  console.log('📋 Listing existing Razorpay Plans...\n');

  try {
    const plans = await razorpay.plans.all({ count: 100 });

    if (plans.items.length === 0) {
      console.log('No plans found. Run with --create to create plans.');
      return;
    }

    console.log('ID | Name | Amount | Period');
    console.log('-'.repeat(80));

    plans.items.forEach(plan => {
      const amount = (plan.item.amount / 100).toFixed(2);
      console.log(`${plan.id} | ${plan.item.name} | ₹${amount} | ${plan.period}`);
    });

    console.log(`\nTotal: ${plans.items.length} plans\n`);
  } catch (error) {
    console.error('Error listing plans:', error.message);
  }
}

// Main
const args = process.argv.slice(2);

if (args.includes('--create')) {
  createPlans().catch(console.error);
} else if (args.includes('--list')) {
  listPlans().catch(console.error);
} else {
  console.log('Razorpay Plans Manager\n');
  console.log('Usage:');
  console.log('  node scripts/setup-razorpay-plans.js --list    # List existing plans');
  console.log('  node scripts/setup-razorpay-plans.js --create  # Create all plans');
  console.log('\nMake sure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set.');
}
