
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';
import { sendProductDeliveryEmail } from '@/lib/email';
import { z } from 'zod';
import crypto from 'crypto';

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = verifyPaymentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = result.data;

        // 1. Verify Signature
        const isValid = verifyRazorpayPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // 2. Find Purchase Record
        const purchase = await prisma.productPurchase.findUnique({
            where: { razorpayOrderId: razorpay_order_id },
            include: { product: true }
        });

        if (!purchase) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        if (purchase.status === 'COMPLETED') {
            return NextResponse.json({ success: true, message: 'Already processed' });
        }

        // 3. Mark as Completed & Generate Real Access Key
        // We'll use a secure random token as the access key
        const accessKey = crypto.randomBytes(32).toString('hex');

        await prisma.productPurchase.update({
            where: { id: purchase.id },
            data: {
                status: 'COMPLETED',
                razorpayPaymentId: razorpay_payment_id,
                accessKey: accessKey,
            },
        });

        // 4. Send Delivery Email
        // The download link routes to the product page with the access key (or a dedicated download route)
        // For now, let's assume we link them to a thank-you page with the key params
        const downloadLink = `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?key=${accessKey}`;

        await sendProductDeliveryEmail(
            purchase.email,
            purchase.product.name,
            downloadLink
        );

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[VerifyPayment] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
