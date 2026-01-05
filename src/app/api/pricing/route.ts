
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const plans = await prisma.pricingPlan.findMany({
            where: { isActive: true },
            orderBy: { priceMonthly: 'asc' }
        });

        // Transform DB data to match PricingTable expected format
        // DB stores prices in paise (1 INR = 100 paise)
        // PricingTable expects:
        //   - price.monthly/yearly in USD
        //   - priceInr.monthly/yearly in INR (not paise)
        const transformedPlans = plans.map(p => {
            const features = JSON.parse(p.features || '[]');
            const limits = JSON.parse(p.limits || '{}');

            // Convert from paise to rupees
            const monthlyInr = Math.round(p.priceMonthly / 100);
            const yearlyInr = Math.round(p.priceYearly / 100);

            // Approximate USD conversion (84 INR = 1 USD)
            const monthlyUsd = Math.round(monthlyInr / 84);
            const yearlyUsd = Math.round(yearlyInr / 84);

            return {
                id: p.id,
                name: p.name,
                description: p.description || '',
                tagline: p.tagline || '',
                targetAudience: p.targetAudience || '',
                price: {
                    monthly: monthlyUsd,
                    yearly: yearlyUsd,
                },
                priceInr: {
                    monthly: monthlyInr,
                    yearly: yearlyInr,
                },
                features,
                limits,
                popular: p.popular || false,
                cta: p.cta || 'Get Started',
                ctaSecondary: p.ctaSecondary || null,
                badge: p.badge || null,
                // Also include raw data for checkout
                razorpayIdMonthly: p.razorpayIdMonthly,
                razorpayIdYearly: p.razorpayIdYearly,
            };
        });

        return NextResponse.json(transformedPlans);
    } catch (error) {
        console.error('Failed to fetch plans:', error);
        return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }
}
