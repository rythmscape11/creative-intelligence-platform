/**
 * Credits Webhook Route
 * POST /api/analyser/credits/webhook - Handle Razorpay payment webhooks
 * 
 * Handles:
 * - payment.captured
 * - payment.authorized
 * - payment.failed
 * 
 * Falls back to payment notes if purchase record not found.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addCredits } from '@/lib/analyser/usage-service';
import crypto from 'crypto';

// Verify Razorpay webhook signature
function verifyWebhookSignature(
    body: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
    return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-razorpay-signature') || '';
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

        console.log('[Credits Webhook] Received webhook');

        // Verify signature (skip if no secret configured - for testing)
        if (webhookSecret && signature) {
            if (!verifyWebhookSignature(body, signature, webhookSecret)) {
                console.error('[Credits Webhook] Invalid signature');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
            console.log('[Credits Webhook] Signature verified');
        } else {
            console.warn('[Credits Webhook] Skipping signature verification (no secret/signature)');
        }

        const event = JSON.parse(body);
        const eventType = event.event;

        console.log('[Credits Webhook] Event type:', eventType);
        console.log('[Credits Webhook] Payload:', JSON.stringify(event.payload, null, 2));

        switch (eventType) {
            case 'payment.captured':
            case 'payment.authorized': {
                const payment = event.payload.payment.entity;
                const orderId = payment.order_id;
                const paymentId = payment.id;
                const notes = payment.notes || {};

                console.log('[Credits Webhook] Processing payment:', { orderId, paymentId, notes });

                // Try to find the pending purchase
                let purchase = null;
                try {
                    purchase = await prisma.analyserCreditPurchase.findFirst({
                        where: { razorpayOrderId: orderId, status: 'pending' },
                    });
                } catch (dbError) {
                    console.warn('[Credits Webhook] DB lookup failed:', dbError);
                }

                let userId: string;
                let credits: number;

                if (purchase) {
                    console.log('[Credits Webhook] Found purchase record:', purchase.id);
                    userId = purchase.userId;
                    credits = purchase.creditsPurchased;
                } else {
                    // Fallback: Get user and credits from payment notes
                    console.warn('[Credits Webhook] Purchase not found, using payment notes');
                    userId = notes.userId;
                    credits = parseInt(notes.credits || '0', 10);

                    if (!userId || !credits) {
                        console.error('[Credits Webhook] Missing userId or credits in notes:', notes);
                        return NextResponse.json({
                            error: 'Purchase not found and payment notes incomplete',
                            notes,
                        }, { status: 400 });
                    }
                }

                // Add credits to user
                try {
                    const result = await addCredits(userId, credits, paymentId);
                    console.log(`[Credits Webhook] Added ${credits} credits to user ${userId}. New balance: ${result.newBalance}`);
                } catch (creditError) {
                    console.error('[Credits Webhook] Failed to add credits:', creditError);
                    return NextResponse.json({
                        error: 'Failed to add credits',
                        details: creditError instanceof Error ? creditError.message : 'Unknown error',
                    }, { status: 500 });
                }

                // Update purchase record if exists
                if (purchase) {
                    try {
                        await prisma.analyserCreditPurchase.update({
                            where: { id: purchase.id },
                            data: {
                                razorpayPaymentId: paymentId,
                                status: 'completed',
                            },
                        });
                    } catch (updateError) {
                        console.warn('[Credits Webhook] Could not update purchase record:', updateError);
                    }
                } else {
                    // Create a new purchase record for audit
                    try {
                        await prisma.analyserCreditPurchase.create({
                            data: {
                                userId,
                                creditsPurchased: credits,
                                amountPaid: payment.amount / 100, // Convert from paise
                                currency: payment.currency || 'INR',
                                razorpayOrderId: orderId,
                                razorpayPaymentId: paymentId,
                                status: 'completed',
                            },
                        });
                        console.log('[Credits Webhook] Created new purchase record');
                    } catch (createError) {
                        console.warn('[Credits Webhook] Could not create purchase record:', createError);
                    }
                }

                break;
            }

            case 'payment.failed': {
                const payment = event.payload.payment.entity;
                const orderId = payment.order_id;

                console.log('[Credits Webhook] Payment failed for order:', orderId);

                // Mark purchase as failed
                try {
                    await prisma.analyserCreditPurchase.updateMany({
                        where: { razorpayOrderId: orderId, status: 'pending' },
                        data: { status: 'failed' },
                    });
                } catch (e) {
                    console.warn('[Credits Webhook] Could not update failed status:', e);
                }
                break;
            }

            default:
                console.log('[Credits Webhook] Unhandled event type:', eventType);
        }

        return NextResponse.json({ success: true, received: true });
    } catch (error: unknown) {
        console.error('[Credits Webhook] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
