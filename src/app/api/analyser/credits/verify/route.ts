/**
 * Payment Verification API
 * POST /api/analyser/credits/verify - Verify payment and add credits
 * 
 * Called by frontend after Razorpay payment success to ensure
 * credits are added immediately (doesn't wait for webhook).
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/analyser/usage-service';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

const razorpay = razorpayKeyId && razorpayKeySecret
    ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
    : null;

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, packId, credits } = body;

        if (!razorpay_order_id || !razorpay_payment_id) {
            return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
        }

        // Verify signature if provided
        if (razorpay_signature && razorpayKeySecret) {
            const expectedSignature = crypto
                .createHmac('sha256', razorpayKeySecret)
                .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                .digest('hex');

            if (razorpay_signature !== expectedSignature) {
                console.error('[Verify API] Invalid signature');
                return NextResponse.json({ error: 'Payment verification failed' }, { status: 401 });
            }
            console.log('[Verify API] Signature verified successfully');
        }

        // Check if already processed
        let existingPurchase = null;
        try {
            existingPurchase = await prisma.analyserCreditPurchase.findFirst({
                where: {
                    razorpayPaymentId: razorpay_payment_id,
                    status: 'completed'
                },
            });
        } catch (e) {
            console.warn('[Verify API] DB lookup failed:', e);
        }

        if (existingPurchase) {
            // Already processed - return current balance
            const userCredits = await prisma.analyserCredits.findUnique({
                where: { userId },
            });

            return NextResponse.json({
                success: true,
                message: 'Payment already processed',
                newBalance: userCredits?.creditsBalance || 0,
                alreadyProcessed: true,
            });
        }

        // Get credit amount from order notes or use provided value
        let creditsToAdd = credits || 0;

        if (!creditsToAdd && razorpay) {
            try {
                // Fetch order details to get credits from notes
                const order = await razorpay.orders.fetch(razorpay_order_id);
                creditsToAdd = parseInt(order.notes?.credits as string || '0', 10);
            } catch (e) {
                console.warn('[Verify API] Could not fetch order:', e);
            }
        }

        // Find pending purchase record
        let purchase = null;
        try {
            purchase = await prisma.analyserCreditPurchase.findFirst({
                where: { razorpayOrderId: razorpay_order_id, status: 'pending' },
            });
            if (purchase) {
                creditsToAdd = purchase.creditsPurchased;
            }
        } catch (e) {
            console.warn('[Verify API] Purchase lookup failed:', e);
        }

        if (!creditsToAdd || creditsToAdd <= 0) {
            return NextResponse.json({
                error: 'Could not determine credits amount',
                suggestion: 'Please contact support'
            }, { status: 400 });
        }

        // Add credits
        const result = await addCredits(userId, creditsToAdd, razorpay_payment_id);
        console.log(`[Verify API] Added ${creditsToAdd} credits to ${userId}. New balance: ${result.newBalance}`);

        // Update purchase record
        if (purchase) {
            try {
                await prisma.analyserCreditPurchase.update({
                    where: { id: purchase.id },
                    data: {
                        razorpayPaymentId: razorpay_payment_id,
                        status: 'completed',
                    },
                });
            } catch (e) {
                console.warn('[Verify API] Could not update purchase record:', e);
            }
        } else {
            // Create new purchase record
            try {
                await prisma.analyserCreditPurchase.create({
                    data: {
                        userId,
                        creditsPurchased: creditsToAdd,
                        amountPaid: 0, // We don't have this info here
                        currency: 'INR',
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        status: 'completed',
                    },
                });
            } catch (e) {
                console.warn('[Verify API] Could not create purchase record:', e);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully added ${creditsToAdd} credits!`,
            creditsAdded: creditsToAdd,
            newBalance: result.newBalance,
        });
    } catch (error: unknown) {
        console.error('[Verify Payment API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Verification failed' },
            { status: 500 }
        );
    }
}
