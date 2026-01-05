
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

async function syncPlans() {
    console.log('🔄 Syncing Pricing Plans with Razorpay...');

    // 1. Fetch plans from DB
    const plans = await prisma.pricingPlan.findMany();

    // If no plans in DB, seed them from config (simulated here for simplicity)
    if (plans.length === 0) {
        console.log('🌱 Seeding initial plans...');
        const initialPlans = [
            {
                id: 'PRO',
                name: 'Pro Plan',
                priceMonthly: 409900, // ₹4,099
                priceYearly: 4099000, // ₹40,990
                currency: 'INR',
            },
            {
                id: 'AGENCY',
                name: 'Agency Plan',
                priceMonthly: 2499900, // ₹24,999
                priceYearly: 24999000, // ₹249,990
                currency: 'INR',
            }
        ];

        for (const p of initialPlans) {
            await prisma.pricingPlan.create({
                data: p
            });
        }
        console.log('✅ Seeded initial plans');
        // Re-fetch
        plans.push(...await prisma.pricingPlan.findMany());
    }

    // 2. Sync with Razorpay
    for (const plan of plans) {
        console.log(`\nProcessing ${plan.name} (${plan.id})...`);

        // Monthly
        if (!plan.razorpayIdMonthly) {
            console.log(`   Creating Monthly Plan in Razorpay...`);
            try {
                const rpPlan = await razorpay.plans.create({
                    period: 'monthly',
                    interval: 1,
                    item: {
                        name: `${plan.name} Monthly`,
                        amount: plan.priceMonthly,
                        currency: plan.currency,
                        description: `${plan.name} Monthly Subscription`
                    }
                });

                await prisma.pricingPlan.update({
                    where: { id: plan.id },
                    data: { razorpayIdMonthly: rpPlan.id }
                });
                console.log(`   ✅ Created Monthly: ${rpPlan.id}`);
            } catch (e) {
                console.error(`   ❌ Failed to create monthly plan:`, e);
            }
        } else {
            console.log(`   ℹ️ Monthly Plan ID exists: ${plan.razorpayIdMonthly}`);
        }

        // Yearly
        if (!plan.razorpayIdYearly) {
            console.log(`   Creating Yearly Plan in Razorpay...`);
            try {
                const rpPlan = await razorpay.plans.create({
                    period: 'yearly',
                    interval: 1,
                    item: {
                        name: `${plan.name} Yearly`,
                        amount: plan.priceYearly,
                        currency: plan.currency,
                        description: `${plan.name} Yearly Subscription`
                    }
                });

                await prisma.pricingPlan.update({
                    where: { id: plan.id },
                    data: { razorpayIdYearly: rpPlan.id }
                });
                console.log(`   ✅ Created Yearly: ${rpPlan.id}`);
            } catch (e) {
                console.error(`   ❌ Failed to create yearly plan:`, e);
            }
        } else {
            console.log(`   ℹ️ Yearly Plan ID exists: ${plan.razorpayIdYearly}`);
        }
    }

    console.log('\n✨ Sync Complete!');
}

syncPlans()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
