
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';
import { ADMIN_EMAILS } from '@/config/tool-access';
import { currentUser } from '@clerk/nextjs/server';

// Initialize Razorpay lazily
const getRazorpay = () => {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        throw new Error('Razorpay keys missing');
    }

    return new Razorpay({
        key_id,
        key_secret,
    });
};

// Helper to check admin access
async function checkAdmin() {
    const { userId } = await auth();
    if (!userId) return false;

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();

    if (email && ADMIN_EMAILS.includes(email)) return true;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    return dbUser?.role === 'ADMIN';
}

export async function GET() {
    if (!await checkAdmin()) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const plans = await prisma.pricingPlan.findMany({
            orderBy: { priceMonthly: 'asc' }
        });

        // Parse JSON fields
        const parsedPlans = plans.map(p => ({
            ...p,
            features: JSON.parse(p.features || '[]'),
            limits: JSON.parse(p.limits || '{}')
        }));

        return NextResponse.json(parsedPlans);
    } catch (error) {
        console.error('Failed to fetch plans:', error);
        return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await checkAdmin()) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            id, name, description, tagline, targetAudience,
            priceMonthly, priceYearly, currency,
            features, limits,
            popular, cta, ctaSecondary, badge,
            isActive
        } = body;

        if (!id || !name || priceMonthly === undefined || priceYearly === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if plan exists
        const existingPlan = await prisma.pricingPlan.findUnique({ where: { id } });

        let razorpayIdMonthly = existingPlan?.razorpayIdMonthly;
        let razorpayIdYearly = existingPlan?.razorpayIdYearly;

        // Sync with Razorpay if prices changed or new plan
        try {
            const razorpay = getRazorpay();

            // Monthly
            if (!existingPlan || existingPlan.priceMonthly !== priceMonthly) {
                console.log(`Creating/Updating monthly plan for ${name} in Razorpay...`);
                const rpPlan = await razorpay.plans.create({
                    period: 'monthly',
                    interval: 1,
                    item: {
                        name: `${name} Monthly`,
                        amount: priceMonthly,
                        currency: currency || 'INR',
                        description: `${name} Monthly Subscription`
                    }
                });
                razorpayIdMonthly = rpPlan.id;
            }

            // Yearly
            if (!existingPlan || existingPlan.priceYearly !== priceYearly) {
                console.log(`Creating/Updating yearly plan for ${name} in Razorpay...`);
                const rpPlan = await razorpay.plans.create({
                    period: 'yearly',
                    interval: 1,
                    item: {
                        name: `${name} Yearly`,
                        amount: priceYearly,
                        currency: currency || 'INR',
                        description: `${name} Yearly Subscription`
                    }
                });
                razorpayIdYearly = rpPlan.id;
            }
        } catch (rpError) {
            console.error('Razorpay sync failed:', rpError);
            // Continue to save to DB even if Razorpay fails (can retry later)
        }

        // Upsert to DB
        const plan = await prisma.pricingPlan.upsert({
            where: { id },
            update: {
                name, description, tagline, targetAudience,
                priceMonthly, priceYearly, currency,
                razorpayIdMonthly, razorpayIdYearly,
                features: JSON.stringify(features),
                limits: JSON.stringify(limits),
                popular, cta, ctaSecondary, badge,
                isActive
            },
            create: {
                id, name, description, tagline, targetAudience,
                priceMonthly, priceYearly, currency,
                razorpayIdMonthly, razorpayIdYearly,
                features: JSON.stringify(features),
                limits: JSON.stringify(limits),
                popular, cta, ctaSecondary, badge,
                isActive: true
            }
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error('Error saving plan:', error);
        return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    if (!await checkAdmin()) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing plan ID' }, { status: 400 });
        }

        // Soft delete or hard delete?
        // Let's do hard delete for now, but check if used (Prisma handles FK constraints usually)
        // If subscriptions exist, this might fail. Better to soft delete.

        // Check for subscriptions
        // const subs = await prisma.subscription.count({ where: { plan: id } }); // Plan enum vs string ID mismatch
        // Since Subscription.plan is an Enum, we can't easily link it to dynamic plans yet without schema migration on Subscription table.
        // For now, we'll just delete the PricingPlan record.

        await prisma.pricingPlan.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }
}
