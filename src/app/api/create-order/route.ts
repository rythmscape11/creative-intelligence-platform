
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder, isRazorpayConfigured } from '@/lib/razorpay';
import { z } from 'zod';

const createOrderSchema = z.object({
    productId: z.string(),
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = createOrderSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { productId, email } = result.data;

        // 1. Fetch Product
        // We expect productId to be the slug from the frontend
        const product = await prisma.product.findUnique({
            where: { slug: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        if (!isRazorpayConfigured) {
            // Mock for development if keys missing 
            // (Though createRazorpayOrder checks this too, we can handle it gracefully here)
            return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 503 });
        }

        // 2. Create Razorpay Order
        // Amount in Prisma is in paise, so we use it directly
        const order = await createRazorpayOrder(
            product.price,
            product.currency,
            email, // Receipt
            {
                product_id: product.id,
                product_slug: product.slug,
                customer_email: email
            }
        );

        // 3. Create Pending Purchase Record
        // We generate a temp access key here, or generated on completion. 
        // Let's generate a placeholder and update it on success.
        const purchase = await prisma.productPurchase.create({
            data: {
                email,
                productId: product.id,
                razorpayOrderId: order.id,
                amount: product.price,
                currency: product.currency,
                status: 'PENDING',
                accessKey: `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            productName: product.name,
            description: product.description
        });

    } catch (error: any) {
        console.error('[CreateOrder] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
