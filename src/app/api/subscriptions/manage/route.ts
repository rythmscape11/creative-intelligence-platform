import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay';
import { ProductType, PlanTier, getRazorpayPlanId } from '@/config/product-plans';

/**
 * Subscription Management API
 * 
 * PUT /api/subscriptions/manage - Upgrade/Downgrade subscription
 * DELETE /api/subscriptions/manage - Cancel subscription
 */

interface ManageRequest {
    product: ProductType;
    action: 'upgrade' | 'downgrade' | 'cancel';
    newTier?: PlanTier;
}

/**
 * PUT - Upgrade or Downgrade subscription
 */
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body: ManageRequest = await request.json();
        const { product, action, newTier } = body;

        if (!product || !action) {
            return NextResponse.json(
                { error: 'Missing required fields: product, action' },
                { status: 400 }
            );
        }

        // Get user
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ id: userId }, { clerkId: userId }],
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get current subscription
        const subscription = await prisma.productSubscription.findUnique({
            where: {
                userId_product: { userId: user.id, product },
            },
        });

        if (!subscription) {
            return NextResponse.json(
                { error: 'No subscription found for this product' },
                { status: 404 }
            );
        }

        if (action === 'upgrade' || action === 'downgrade') {
            if (!newTier) {
                return NextResponse.json(
                    { error: 'newTier required for upgrade/downgrade' },
                    { status: 400 }
                );
            }

            // Get new Razorpay plan ID
            const newPlanId = getRazorpayPlanId(product, newTier, subscription.billingInterval || 'monthly');

            if (!newPlanId || newPlanId.includes('placeholder')) {
                // For demo, just update the database directly
                await prisma.productSubscription.update({
                    where: { id: subscription.id },
                    data: { planTier: newTier },
                });

                // Track metric
                await prisma.adminMetric.create({
                    data: {
                        product,
                        metric: action,
                        value: 1,
                        metadata: { from: subscription.planTier, to: newTier },
                    },
                });

                return NextResponse.json({
                    success: true,
                    message: `Subscription ${action}d to ${newTier}`,
                    subscription: { ...subscription, planTier: newTier },
                });
            }

            // If Razorpay is configured, update the plan there too
            if (isRazorpayConfigured && subscription.razorpaySubscriptionId) {
                try {
                    await razorpay.subscriptions.update(subscription.razorpaySubscriptionId, {
                        plan_id: newPlanId,
                        schedule_change_at: 'cycle_end', // Change at end of current billing cycle
                    });
                } catch (rpError) {
                    console.error('Razorpay update failed:', rpError);
                    // Continue with DB update even if Razorpay fails
                }
            }

            // Update database
            await prisma.productSubscription.update({
                where: { id: subscription.id },
                data: {
                    planTier: newTier,
                    razorpayPlanId: newPlanId,
                },
            });

            // Track metric
            await prisma.adminMetric.create({
                data: {
                    product,
                    metric: action,
                    value: 1,
                    metadata: { from: subscription.planTier, to: newTier },
                },
            });

            return NextResponse.json({
                success: true,
                message: `Subscription ${action}d to ${newTier}`,
            });
        }

        return NextResponse.json(
            { error: 'Invalid action. Use upgrade or downgrade.' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('[Subscription Manage] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to manage subscription' },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Cancel subscription
 */
export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const product = searchParams.get('product') as ProductType;

        if (!product) {
            return NextResponse.json(
                { error: 'Missing product parameter' },
                { status: 400 }
            );
        }

        // Get user
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ id: userId }, { clerkId: userId }],
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get subscription
        const subscription = await prisma.productSubscription.findUnique({
            where: {
                userId_product: { userId: user.id, product },
            },
        });

        if (!subscription) {
            return NextResponse.json(
                { error: 'No subscription found for this product' },
                { status: 404 }
            );
        }

        // Cancel in Razorpay if configured
        if (isRazorpayConfigured && subscription.razorpaySubscriptionId) {
            try {
                await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);
            } catch (rpError) {
                console.error('Razorpay cancel failed:', rpError);
                // Continue with DB update
            }
        }

        // Update database
        await prisma.productSubscription.update({
            where: { id: subscription.id },
            data: {
                status: 'CANCELED',
                canceledAt: new Date(),
            },
        });

        // Track metric
        await prisma.adminMetric.create({
            data: {
                product,
                metric: 'churn',
                value: 1,
                metadata: { tier: subscription.planTier, canceledBy: 'user' },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled successfully',
        });
    } catch (error: any) {
        console.error('[Subscription Cancel] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
