/**
 * Admin Credits API
 * POST /api/analyser/admin/credits - Add credits to a user (admin only)
 * POST /api/analyser/admin/setup-webhook - Setup Razorpay webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/analyser/usage-service';

// Admin email addresses (can also be configured in env)
const ADMIN_EMAILS = [
    'hello@aureonone.in',
    'hello@aureonone.in',
    'mukherjeeanustup@gmail.com',
    process.env.ADMIN_EMAIL,
].filter(Boolean);

async function isAdmin(): Promise<boolean> {
    const user = await currentUser();
    if (!user) return false;

    const email = user.emailAddresses?.[0]?.emailAddress || '';
    return ADMIN_EMAILS.includes(email);
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Get all users with credits
        const usersWithCredits = await prisma.analyserCredits.findMany({
            orderBy: { updatedAt: 'desc' },
            take: 100,
        });

        // Get recent purchases
        const recentPurchases = await prisma.analyserCreditPurchase.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return NextResponse.json({
            success: true,
            isAdmin: true,
            usersWithCredits,
            recentPurchases,
        });
    } catch (error) {
        console.error('[Admin Credits API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch admin data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = await isAdmin();
        if (!admin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'add_credits': {
                const { targetUserId, credits, reason } = body;

                if (!targetUserId || !credits) {
                    return NextResponse.json(
                        { error: 'targetUserId and credits are required' },
                        { status: 400 }
                    );
                }

                const creditsToAdd = parseInt(credits, 10);
                if (isNaN(creditsToAdd) || creditsToAdd <= 0) {
                    return NextResponse.json(
                        { error: 'Credits must be a positive number' },
                        { status: 400 }
                    );
                }

                // Add credits
                const result = await addCredits(targetUserId, creditsToAdd);

                // Log the manual addition
                console.log(`[Admin] Added ${creditsToAdd} credits to ${targetUserId}. Reason: ${reason || 'Manual admin addition'}`);

                // Create a purchase record for audit
                try {
                    await prisma.analyserCreditPurchase.create({
                        data: {
                            userId: targetUserId,
                            creditsPurchased: creditsToAdd,
                            amountPaid: 0,
                            currency: 'INR',
                            razorpayOrderId: `admin_${Date.now()}`,
                            status: 'completed',
                        },
                    });
                } catch (e) {
                    console.warn('[Admin] Could not create purchase record:', e);
                }

                return NextResponse.json({
                    success: true,
                    message: `Added ${creditsToAdd} credits to user`,
                    newBalance: result.newBalance,
                    targetUserId,
                });
            }

            case 'setup_webhook': {
                // Setup Razorpay webhook via API
                const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
                const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
                const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

                if (!razorpayKeyId || !razorpayKeySecret) {
                    return NextResponse.json(
                        { error: 'Razorpay credentials not configured' },
                        { status: 500 }
                    );
                }

                const webhookUrl = 'https://www.aureonone.in/api/analyser/credits/webhook';

                const response = await fetch('https://api.razorpay.com/v1/webhooks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64'),
                    },
                    body: JSON.stringify({
                        url: webhookUrl,
                        events: [
                            'payment.authorized',
                            'payment.captured',
                            'payment.failed',
                        ],
                        secret: webhookSecret || undefined,
                        alert_email: 'hello@mediaplanpro.com',
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('[Admin] Webhook setup failed:', data);
                    return NextResponse.json(
                        {
                            error: 'Failed to setup webhook',
                            details: data.error?.description || JSON.stringify(data),
                        },
                        { status: 500 }
                    );
                }

                console.log('[Admin] Webhook created:', data);
                return NextResponse.json({
                    success: true,
                    message: 'Razorpay webhook configured successfully',
                    webhookId: data.id,
                    webhookUrl,
                });
            }

            case 'list_webhooks': {
                // List existing webhooks
                const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
                const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

                const response = await fetch('https://api.razorpay.com/v1/webhooks', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64'),
                    },
                });

                const data = await response.json();
                return NextResponse.json({ success: true, webhooks: data });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('[Admin Credits API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Admin action failed' },
            { status: 500 }
        );
    }
}
