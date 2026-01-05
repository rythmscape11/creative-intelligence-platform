import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import {
    createRazorpaySubscription,
    createRazorpayCustomer,
    RAZORPAY_PLANS,
    razorpay,
    isRazorpayConfigured
} from '@/lib/razorpay';
import {
    ProductType,
    PlanTier,
    getRazorpayPlanId,
    getProductPlan,
    FULL_STACK_BUNDLE
} from '@/config/product-plans';

/**
 * Checkout API for Per-Product Subscriptions
 * POST /api/checkout/product
 * 
 * Creates a Razorpay subscription for a specific product/tier
 */

interface CheckoutRequest {
    product: ProductType;
    tier: PlanTier;
    interval: 'monthly' | 'yearly';
    currency: 'usd' | 'inr';
    isBundle?: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check Razorpay configuration
        if (!isRazorpayConfigured) {
            return NextResponse.json(
                { error: 'Payment system not configured. Please contact support.' },
                { status: 500 }
            );
        }

        const body: CheckoutRequest = await request.json();
        const { product, tier, interval, currency, isBundle } = body;

        // Validate inputs
        if (!product || !tier || !interval) {
            return NextResponse.json(
                { error: 'Missing required fields: product, tier, interval' },
                { status: 400 }
            );
        }

        // Get user from database
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { clerkId: userId },
                ],
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check for existing subscription to this product
        const existingSubscription = await prisma.productSubscription.findUnique({
            where: {
                userId_product: {
                    userId: user.id,
                    product,
                },
            },
        });

        if (existingSubscription && existingSubscription.status === 'ACTIVE') {
            return NextResponse.json(
                { error: 'You already have an active subscription to this product' },
                { status: 400 }
            );
        }

        // Get plan details
        const plan = getProductPlan(product, tier);
        if (!plan) {
            return NextResponse.json(
                { error: 'Invalid product/tier combination' },
                { status: 400 }
            );
        }

        // Get Razorpay plan ID
        const razorpayPlanId = getRazorpayPlanId(product, tier, interval);
        if (!razorpayPlanId || razorpayPlanId.includes('placeholder')) {
            // Fall back to creating an order instead of subscription for demo
            return createOneTimeOrder(user, plan, currency, interval, product, tier);
        }

        // Create or get Razorpay customer
        let razorpayCustomerId: string;
        try {
            const customer = await createRazorpayCustomer(
                user.name,
                user.email,
                undefined
            );
            razorpayCustomerId = customer.id;
        } catch (error) {
            console.error('Failed to create Razorpay customer:', error);
            razorpayCustomerId = '';
        }

        // Create Razorpay subscription
        const subscription = await createRazorpaySubscription(
            razorpayPlanId,
            user.id,
            user.email,
            user.name,
            interval === 'yearly' ? 1 : 12
        );

        // Store pending subscription in database
        const now = new Date();
        const periodEnd = new Date();
        if (interval === 'monthly') {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
        } else {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        }

        await prisma.productSubscription.upsert({
            where: {
                userId_product: {
                    userId: user.id,
                    product,
                },
            },
            update: {
                planTier: tier,
                status: 'INCOMPLETE',
                razorpaySubscriptionId: subscription.id,
                razorpayPlanId,
                razorpayCustomerId,
                billingInterval: interval,
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
            },
            create: {
                userId: user.id,
                product,
                planTier: tier,
                status: 'INCOMPLETE',
                razorpaySubscriptionId: subscription.id,
                razorpayPlanId,
                razorpayCustomerId,
                billingInterval: interval,
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
            },
        });

        return NextResponse.json({
            success: true,
            subscriptionId: subscription.id,
            shortUrl: subscription.short_url,
            checkoutOptions: {
                key: process.env.RAZORPAY_KEY_ID,
                subscription_id: subscription.id,
                name: 'MediaPlanPro',
                description: `${plan.name} - ${interval === 'monthly' ? 'Monthly' : 'Yearly'}`,
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#6366f1',
                },
            },
        });
    } catch (error: any) {
        console.error('[Checkout] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Checkout failed' },
            { status: 500 }
        );
    }
}

/**
 * Create one-time order for demo/fallback when subscription plans aren't configured
 */
async function createOneTimeOrder(
    user: { id: string; name: string; email: string },
    plan: any,
    currency: 'usd' | 'inr',
    interval: 'monthly' | 'yearly',
    product: ProductType,
    tier: PlanTier
) {
    const price = plan.price[currency][interval];
    const amountInSmallest = currency === 'inr' ? price * 100 : price * 100; // paise or cents

    try {
        const order = await razorpay.orders.create({
            amount: amountInSmallest,
            currency: currency.toUpperCase(),
            receipt: `${product}_${tier}_${Date.now()}`,
            notes: {
                userId: user.id,
                product,
                tier,
                interval,
            },
        });

        return NextResponse.json({
            success: true,
            orderId: order.id,
            isOrder: true,
            checkoutOptions: {
                key: process.env.RAZORPAY_KEY_ID,
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                name: 'MediaPlanPro',
                description: `${plan.name} - ${interval === 'monthly' ? 'Monthly' : 'Yearly'}`,
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#6366f1',
                },
            },
        });
    } catch (error: any) {
        console.error('[Checkout] Order creation failed:', error);
        throw error;
    }
}

/**
 * GET - Check subscription status
 */
export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { clerkId: userId },
                ],
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get all subscriptions for user
        const subscriptions = await prisma.productSubscription.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json({
            subscriptions: subscriptions.map(sub => ({
                product: sub.product,
                tier: sub.planTier,
                status: sub.status,
                interval: sub.billingInterval,
                currentPeriodEnd: sub.currentPeriodEnd,
            })),
        });
    } catch (error: any) {
        console.error('[Checkout] GET Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to get subscriptions' },
            { status: 500 }
        );
    }
}
