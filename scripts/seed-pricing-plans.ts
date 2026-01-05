#!/usr/bin/env npx tsx
/**
 * Seed Pricing Plans
 * 
 * Creates the default pricing plans in the database.
 * Run with: npx tsx scripts/seed-pricing-plans.ts
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

const PRICING_PLANS = [
    {
        id: 'FREE',
        name: 'Free',
        description: 'Perfect for students and hobbyists exploring marketing tools.',
        tagline: 'Get Started',
        targetAudience: 'Students / Hobbyists',
        priceMonthly: 0,
        priceYearly: 0,
        currency: 'INR',
        features: JSON.stringify([
            { name: '5 AI Strategies per month (5)', included: true },
            { name: 'Access to all niche calculators', included: true },
            { name: '1 Free Strategy Audit', included: true },
            { name: 'Watermarked PDF reports', included: true },
            { name: 'Community support', included: true },
            { name: 'Unlimited strategies', included: false },
            { name: 'Custom branding', included: false },
            { name: 'API access', included: false },
        ]),
        limits: JSON.stringify({ strategies: 5, exports: 5 }),
        popular: false,
        cta: 'Start Free',
        isActive: true,
    },
    {
        id: 'PRO',
        name: 'Pro',
        description: 'For freelancers and SMBs who need unlimited AI-powered strategies.',
        tagline: 'The Daily Driver',
        targetAudience: 'Freelancers / SMBs',
        priceMonthly: 409900, // ₹4,099 in paise
        priceYearly: 4099000, // ₹40,990 in paise (17% discount)
        currency: 'INR',
        features: JSON.stringify([
            { name: 'Unlimited AI Strategies', included: true, highlight: true },
            { name: 'Clean PDF/PPTX/DOCX exports', included: true },
            { name: 'Advanced AI insights & recommendations', included: true },
            { name: 'Core strategy templates', included: true },
            { name: 'Email support (24h response)', included: true },
            { name: 'Analytics dashboard', included: true },
            { name: 'White-label reports', included: false },
            { name: 'Team seats', included: false },
            { name: 'API access', included: false },
        ]),
        limits: JSON.stringify({ strategies: -1, exports: -1 }),
        popular: true,
        cta: 'Upgrade Now',
        badge: 'Most Popular',
        isActive: true,
    },
    {
        id: 'AGENCY',
        name: 'Agency',
        description: 'Full white-label solution for marketing agencies and consultants.',
        tagline: 'The White-Label Engine',
        targetAudience: 'Marketing Agencies / Consultants',
        priceMonthly: 2499900, // ₹24,999 in paise
        priceYearly: 24999000, // ₹249,990 in paise
        currency: 'INR',
        features: JSON.stringify([
            { name: 'Everything in Pro', included: true },
            { name: 'Full White-Label Reports', included: true, highlight: true },
            { name: 'Client branding customization', included: true, highlight: true },
            { name: '10 Team Seats (Sub-Accounts)', included: true },
            { name: 'Basic API Access (10,000 calls/mo)', included: true },
            { name: 'Priority support (4h response)', included: true },
            { name: 'Client workspace separation', included: true },
            { name: 'Custom report templates', included: true },
        ]),
        limits: JSON.stringify({ strategies: -1, exports: -1, teamSeats: 10 }),
        popular: false,
        cta: 'Book a Demo',
        badge: 'For Agencies',
        isActive: true,
    },
    {
        id: 'ENTERPRISE',
        name: 'Enterprise',
        description: 'For large organizations with custom needs and compliance requirements.',
        tagline: 'Bespoke Integration',
        targetAudience: 'Large Corps / SaaS Platforms',
        priceMonthly: 0, // Contact for pricing
        priceYearly: 0,
        currency: 'INR',
        features: JSON.stringify([
            { name: 'Everything in Agency', included: true },
            { name: 'Unlimited API calls', included: true, highlight: true },
            { name: 'Dedicated Account Manager', included: true },
            { name: 'Custom AI model training', included: true },
            { name: 'On-premise deployment option', included: true },
            { name: 'Custom rate limits', included: true },
            { name: 'SLA guarantee (99.9% uptime)', included: true },
            { name: 'Custom integrations (CRM/CMS)', included: true },
            { name: 'Security audit & compliance', included: true },
        ]),
        limits: JSON.stringify({ strategies: -1, exports: -1, teamSeats: -1 }),
        popular: false,
        cta: 'Contact Sales',
        isActive: true,
    },
];

async function main() {
    console.log('\n🌱 Seeding Pricing Plans\n');

    for (const plan of PRICING_PLANS) {
        const existing = await prisma.pricingPlan.findUnique({
            where: { id: plan.id }
        });

        if (existing) {
            console.log(`  ✅ ${plan.id} already exists, skipping...`);
            continue;
        }

        await prisma.pricingPlan.create({
            data: plan,
        });

        console.log(`  📦 Created: ${plan.id} (${plan.name})`);
    }

    console.log('\n✅ Pricing plans seeded!\n');

    await prisma.$disconnect();
}

main().catch((error) => {
    console.error('❌ Seed failed:', error);
    prisma.$disconnect();
    process.exit(1);
});
