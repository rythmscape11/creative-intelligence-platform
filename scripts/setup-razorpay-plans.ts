#!/usr/bin/env npx ts-node
/**
 * Razorpay Plan Setup Script
 * 
 * Creates Razorpay subscription plans and syncs IDs to the database.
 * Run with: npx ts-node scripts/setup-razorpay-plans.ts
 * 
 * Prerequisites:
 * - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local
 * - DATABASE_URL configured
 */

import Razorpay from 'razorpay';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

// Validate Razorpay credentials
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    console.error('❌ Missing Razorpay credentials!');
    console.error('   Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local');
    process.exit(1);
}

if (RAZORPAY_KEY_ID.includes('placeholder') || RAZORPAY_KEY_SECRET.includes('placeholder')) {
    console.error('❌ Razorpay credentials are placeholders!');
    console.error('   Get real API keys from https://dashboard.razorpay.com/app/keys');
    process.exit(1);
}

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

console.log('✅ Razorpay initialized with key:', RAZORPAY_KEY_ID.substring(0, 12) + '...');

interface PlanConfig {
    planId: string;
    name: string;
    period: 'monthly' | 'yearly';
    interval: number;
    amount: number; // in paise
    currency: string;
}

async function createRazorpayPlan(config: PlanConfig): Promise<string> {
    try {
        console.log(`\n📦 Creating Razorpay plan: ${config.name}...`);

        const plan = await razorpay.plans.create({
            period: config.period,
            interval: config.interval,
            item: {
                name: config.name,
                amount: config.amount,
                currency: config.currency,
                description: `${config.name} Subscription`,
            },
        });

        console.log(`   ✅ Created plan: ${plan.id}`);
        console.log(`   💰 Amount: ₹${config.amount / 100}`);

        return plan.id;
    } catch (error: any) {
        console.error(`   ❌ Failed to create plan: ${config.name}`);
        console.error(`   Error: ${error.message || error}`);
        throw error;
    }
}

async function syncPricingPlanToDb(
    planId: string,
    razorpayIdMonthly: string | null,
    razorpayIdYearly: string | null
) {
    try {
        await prisma.pricingPlan.update({
            where: { id: planId },
            data: {
                razorpayIdMonthly,
                razorpayIdYearly,
            },
        });
        console.log(`   📝 Synced to DB: ${planId}`);
    } catch (error: any) {
        console.error(`   ❌ Failed to sync ${planId} to DB: ${error.message}`);
    }
}

async function main() {
    console.log('\n🚀 Razorpay Plan Setup Script');
    console.log('================================\n');

    // Fetch existing plans from database
    const existingPlans = await prisma.pricingPlan.findMany({
        where: { isActive: true }
    });

    console.log(`Found ${existingPlans.length} active pricing plans in DB:\n`);

    for (const plan of existingPlans) {
        console.log(`  • ${plan.id}: ${plan.name}`);
        console.log(`    Monthly: ₹${plan.priceMonthly / 100} | Yearly: ₹${plan.priceYearly / 100}`);
        console.log(`    Razorpay Monthly: ${plan.razorpayIdMonthly || '❌ Not synced'}`);
        console.log(`    Razorpay Yearly: ${plan.razorpayIdYearly || '❌ Not synced'}`);
    }

    // Ask for confirmation
    console.log('\n⚠️  This will create new Razorpay plans for plans without IDs.');
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Process each plan
    for (const plan of existingPlans) {
        // Skip FREE plan
        if (plan.id === 'FREE' || plan.priceMonthly === 0) {
            console.log(`\n⏭️  Skipping FREE plan`);
            continue;
        }

        console.log(`\n📋 Processing: ${plan.name} (${plan.id})`);

        let monthlyId = plan.razorpayIdMonthly;
        let yearlyId = plan.razorpayIdYearly;

        // Create monthly plan if not exists
        if (!monthlyId) {
            try {
                monthlyId = await createRazorpayPlan({
                    planId: plan.id,
                    name: `${plan.name} Monthly`,
                    period: 'monthly',
                    interval: 1,
                    amount: plan.priceMonthly,
                    currency: plan.currency || 'INR',
                });
            } catch (error) {
                console.log('   ⚠️  Continuing without monthly plan...');
            }
        } else {
            console.log(`   ✅ Monthly plan already exists: ${monthlyId}`);
        }

        // Create yearly plan if not exists
        if (!yearlyId) {
            try {
                yearlyId = await createRazorpayPlan({
                    planId: plan.id,
                    name: `${plan.name} Yearly`,
                    period: 'yearly',
                    interval: 1,
                    amount: plan.priceYearly,
                    currency: plan.currency || 'INR',
                });
            } catch (error) {
                console.log('   ⚠️  Continuing without yearly plan...');
            }
        } else {
            console.log(`   ✅ Yearly plan already exists: ${yearlyId}`);
        }

        // Sync to database
        if (monthlyId || yearlyId) {
            await syncPricingPlanToDb(plan.id, monthlyId, yearlyId);
        }
    }

    console.log('\n================================');
    console.log('🎉 Razorpay setup complete!\n');

    // Final summary
    const updatedPlans = await prisma.pricingPlan.findMany({
        where: { isActive: true }
    });

    console.log('📊 Final Status:\n');
    for (const plan of updatedPlans) {
        const monthlyStatus = plan.razorpayIdMonthly ? '✅' : '❌';
        const yearlyStatus = plan.razorpayIdYearly ? '✅' : '❌';
        console.log(`  ${plan.id}: Monthly ${monthlyStatus} | Yearly ${yearlyStatus}`);
    }

    await prisma.$disconnect();
}

main().catch((error) => {
    console.error('\n❌ Script failed:', error);
    prisma.$disconnect();
    process.exit(1);
});
