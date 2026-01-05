
import { prisma } from '@/lib/prisma';
import { PricingPlan, PricingFeature } from '@/config/pricing';

// Cache duration in seconds
const CACHE_TTL = 60 * 5; // 5 minutes

// Exchange rate: INR to USD (update periodically or use API for real-time)
const INR_TO_USD_RATE = 84; // 84 INR = 1 USD (approximate)

export async function getPricingPlansFromDB() {
    try {
        const plans = await prisma.pricingPlan.findMany({
            where: { isActive: true },
            orderBy: { priceMonthly: 'asc' }
        });

        // Transform DB shape to App shape
        return plans.map(plan => {
            // Convert paise to rupees
            const monthlyInr = plan.priceMonthly / 100;
            const yearlyInr = plan.priceYearly / 100;

            // Convert INR to USD
            const monthlyUsd = Math.round(monthlyInr / INR_TO_USD_RATE);
            const yearlyUsd = Math.round(yearlyInr / INR_TO_USD_RATE);

            return {
                ...plan,
                features: JSON.parse(plan.features) as PricingFeature[],
                limits: JSON.parse(plan.limits),
                price: {
                    monthly: monthlyUsd, // USD price
                    yearly: yearlyUsd
                },
                priceInr: {
                    monthly: monthlyInr, // INR price
                    yearly: yearlyInr
                },
                razorpayPlanId: {
                    monthly: plan.razorpayIdMonthly || '',
                    yearly: plan.razorpayIdYearly || ''
                },
                gatingFeature: 'Contact support for details'
            };
        });
    } catch (error) {
        console.error('Failed to fetch pricing plans from DB:', error);
        return [];
    }
}

export async function getPricingPlanById(id: string) {
    try {
        const plan = await prisma.pricingPlan.findUnique({
            where: { id }
        });

        if (!plan) return null;

        // Convert paise to rupees
        const monthlyInr = plan.priceMonthly / 100;
        const yearlyInr = plan.priceYearly / 100;

        // Convert INR to USD
        const monthlyUsd = Math.round(monthlyInr / INR_TO_USD_RATE);
        const yearlyUsd = Math.round(yearlyInr / INR_TO_USD_RATE);

        return {
            ...plan,
            features: JSON.parse(plan.features) as PricingFeature[],
            limits: JSON.parse(plan.limits),
            price: {
                monthly: monthlyUsd, // USD price
                yearly: yearlyUsd
            },
            priceInr: {
                monthly: monthlyInr, // INR price
                yearly: yearlyInr
            },
            razorpayPlanId: {
                monthly: plan.razorpayIdMonthly || '',
                yearly: plan.razorpayIdYearly || ''
            },
            gatingFeature: 'Contact support for details'
        };
    } catch (error) {
        console.error(`Failed to fetch plan ${id}:`, error);
        return null;
    }
}
