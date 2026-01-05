/**
 * Credits API Routes
 * GET /api/analyser/credits - Get user's credit balance
 * POST /api/analyser/credits - Create purchase order
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import Razorpay from 'razorpay';

// Credit pack definitions
const CREDIT_PACKS = [
    {
        id: 'starter',
        name: 'Starter',
        credits: 100,
        priceInr: 499,
        priceUsd: 5.99,
        description: 'Perfect for trying out the platform',
    },
    {
        id: 'pro',
        name: 'Pro',
        credits: 500,
        priceInr: 1999,
        priceUsd: 23.99,
        description: 'Best for regular SEO research',
        popular: true,
    },
    {
        id: 'agency',
        name: 'Agency',
        credits: 2000,
        priceInr: 6999,
        priceUsd: 83.99,
        description: 'For agencies and heavy users',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 10000,
        priceInr: 29999,
        priceUsd: 359.99,
        description: 'Maximum value for enterprises',
    },
];

// Check if Razorpay is configured
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
const isRazorpayConfigured = razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('placeholder');

// Initialize Razorpay only if configured
let razorpay: Razorpay | null = null;
if (isRazorpayConfigured) {
    razorpay = new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
    });
}

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();

        // Return default data for unauthenticated users
        if (!userId) {
            return NextResponse.json({
                success: true,
                credits: {
                    balance: 0,
                    totalPurchased: 0,
                    totalUsed: 0,
                },
                creditPacks: CREDIT_PACKS,
            });
        }

        // Try to get user's credits
        let creditsBalance = 25; // Default free credits
        let totalPurchased = 0;
        let totalUsed = 0;

        try {
            const credits = await prisma.analyserCredits.findUnique({
                where: { userId },
            });
            if (credits) {
                creditsBalance = credits.creditsBalance;
                totalPurchased = credits.totalPurchased;
                totalUsed = credits.totalUsed;
            }
        } catch (dbError) {
            // Table might not exist yet - use defaults
            console.warn('[Credits API] Database error:', dbError);
        }

        return NextResponse.json({
            success: true,
            credits: {
                balance: creditsBalance,
                totalPurchased,
                totalUsed,
            },
            creditPacks: CREDIT_PACKS,
            razorpayConfigured: isRazorpayConfigured,
        });
    } catch (error: unknown) {
        console.error('[Credits API] Error:', error);
        return NextResponse.json({
            success: true,
            credits: { balance: 25, totalPurchased: 0, totalUsed: 0 },
            creditPacks: CREDIT_PACKS,
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, error: 'Please sign in to purchase credits' }, { status: 401 });
        }

        if (!razorpay || !isRazorpayConfigured) {
            return NextResponse.json({
                success: false,
                error: 'Payment system is being configured. Please try again later.'
            }, { status: 503 });
        }

        const body = await request.json();
        const { packId } = body;

        // Find the credit pack
        const pack = CREDIT_PACKS.find(p => p.id === packId);
        if (!pack) {
            return NextResponse.json({ success: false, error: 'Invalid pack selected' }, { status: 400 });
        }

        // Get user email for receipt
        let userEmail = '';
        let userName = '';
        try {
            const user = await prisma.user.findFirst({
                where: { clerkId: userId },
                select: { email: true, name: true },
            });
            userEmail = user?.email || '';
            userName = user?.name || '';
        } catch (e) {
            // Continue without user info
        }

        // Create Razorpay order
        let order;
        try {
            console.log('[Credits API] Creating Razorpay order:', {
                amount: pack.priceInr * 100,
                currency: 'INR',
                packId,
                userId: userId.slice(0, 8) + '...',
            });

            order = await razorpay.orders.create({
                amount: pack.priceInr * 100, // Razorpay uses paise
                currency: 'INR',
                receipt: `credits_${Date.now()}`,
                notes: {
                    userId,
                    packId,
                    credits: pack.credits.toString(),
                    userEmail,
                },
            });

            console.log('[Credits API] Razorpay order created:', order.id);
        } catch (razorpayError: unknown) {
            console.error('[Credits API] Razorpay order creation failed:', razorpayError);
            const errorMessage = razorpayError instanceof Error ? razorpayError.message : 'Unknown Razorpay error';
            return NextResponse.json(
                {
                    success: false,
                    error: 'Payment gateway error. Please try again.',
                    details: errorMessage
                },
                { status: 500 }
            );
        }

        // Try to store pending purchase (might fail if table doesn't exist)
        try {
            await prisma.analyserCreditPurchase.create({
                data: {
                    userId,
                    creditsPurchased: pack.credits,
                    amountPaid: pack.priceInr,
                    currency: 'INR',
                    razorpayOrderId: order.id,
                    status: 'pending',
                },
            });
        } catch (dbError) {
            console.warn('[Credits API] Could not store purchase record:', dbError);
            // Continue anyway - payment will still work
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            pack: {
                id: pack.id,
                name: pack.name,
                credits: pack.credits,
                price: pack.priceInr,
            },
            razorpayKeyId: razorpayKeyId,
            prefill: {
                email: userEmail,
                name: userName,
            },
        });
    } catch (error: unknown) {
        console.error('[Credits Purchase API] Error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to create order. Please try again.' },
            { status: 500 }
        );
    }
}
