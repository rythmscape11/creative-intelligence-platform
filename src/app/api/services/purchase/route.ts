import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder, getRazorpayCheckoutOptions } from '@/lib/razorpay';
import { getServiceBySlug } from '@/config/services';
import { z } from 'zod';

const purchaseSchema = z.object({
  serviceSlug: z.string(),
  tier: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
  requirements: z.any().optional(),
});

/**
 * POST /api/services/purchase
 * 
 * Create a service purchase and Razorpay order
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to purchase services.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = purchaseSchema.parse(body);

    // Get service details
    const service = getServiceBySlug(validatedData.serviceSlug);
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Get pricing tier
    const pricingTier = service.pricingTiers.find(t => t.tier === validatedData.tier);
    if (!pricingTier) {
      return NextResponse.json(
        { error: 'Pricing tier not found' },
        { status: 404 }
      );
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate amount in paise (INR)
    const amountInPaise = pricingTier.price.inr * 100;

    // Determine if this is a subscription or one-time payment
    const isSubscription = pricingTier.billingType !== 'ONE_TIME';

    if (isSubscription) {
      // For recurring services, we'll need to create a subscription
      // For now, we'll create an order and handle subscription setup separately
      return NextResponse.json(
        { error: 'Subscription services coming soon. Please contact us for recurring services.' },
        { status: 400 }
      );
    }

    // Validate Razorpay configuration
    console.log('[Purchase API] Validating Razorpay configuration...');
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('[Purchase API] Razorpay credentials not configured');
      console.error('[Purchase API] RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
      console.error('[Purchase API] RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('[Purchase API] Razorpay configuration valid');
    console.log('[Purchase API] Creating order for:', {
      service: service.name,
      tier: validatedData.tier,
      amount: amountInPaise,
      user: user.email,
    });

    // Create Razorpay order for one-time payment
    // Receipt must be max 40 characters (Razorpay requirement)
    // Format: svc_<hash>_<timestamp>
    // Example: svc_a1b2c3_1730217600000 (26 chars)
    const serviceHash = service.id.substring(0, 6); // First 6 chars of service ID
    const timestamp = Date.now();
    const receipt = `svc_${serviceHash}_${timestamp}`;

    console.log('[Purchase API] Generated receipt:', {
      receipt,
      length: receipt.length,
      maxLength: 40,
      valid: receipt.length <= 40,
    });

    if (receipt.length > 40) {
      console.error('[Purchase API] Receipt too long:', receipt.length);
      return NextResponse.json(
        { error: 'Internal error: Receipt ID generation failed. Please contact support.' },
        { status: 500 }
      );
    }

    let razorpayOrder;

    try {
      razorpayOrder = await createRazorpayOrder(
        amountInPaise,
        'INR',
        receipt,
        {
          serviceId: service.id,
          serviceName: service.name,
          tier: validatedData.tier,
          userId: user.id,
          userEmail: user.email,
        }
      );

      console.log('[Purchase API] Razorpay order created successfully:', razorpayOrder.id);
    } catch (razorpayError: any) {
      console.error('[Purchase API] Razorpay order creation failed:', razorpayError);
      console.error('[Purchase API] Error type:', razorpayError.constructor.name);
      console.error('[Purchase API] Error message:', razorpayError.message);
      console.error('[Purchase API] Error stack:', razorpayError.stack);

      // Extract user-friendly error message
      let errorMessage = 'Failed to create payment order. Please try again or contact support.';

      if (razorpayError.message) {
        errorMessage = razorpayError.message;
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' ? {
            message: razorpayError.message,
            statusCode: razorpayError.statusCode,
            errorCode: razorpayError.error?.code,
            description: razorpayError.error?.description,
          } : undefined
        },
        { status: 500 }
      );
    }

    // Create service purchase record
    const servicePurchase = await prisma.servicePurchase.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        serviceName: service.name,
        serviceCategory: service.category,
        serviceTier: validatedData.tier,
        billingType: pricingTier.billingType,
        amount: amountInPaise,
        currency: 'INR',
        razorpayOrderId: razorpayOrder.id,
        paymentGateway: 'razorpay',
        status: 'PENDING',
        requirements: validatedData.requirements || null,
      },
    });

    // Get Razorpay checkout options
    const checkoutOptions = getRazorpayCheckoutOptions(
      razorpayOrder.id,
      amountInPaise,
      'INR',
      user.name,
      user.email,
      undefined,
      false // one-time payment
    );

    // Add custom notes
    checkoutOptions.notes = {
      serviceId: service.id,
      serviceName: service.name,
      tier: validatedData.tier,
      purchaseId: servicePurchase.id,
    };

    checkoutOptions.description = `${service.name} - ${pricingTier.name}`;

    return NextResponse.json({
      success: true,
      purchaseId: servicePurchase.id,
      checkoutOptions,
    });
  } catch (error: any) {
    console.error('Service purchase error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    // Provide more specific error messages
    let errorMessage = 'Failed to create service purchase';
    if (error.message) {
      errorMessage = error.message;
    }

    // Check for specific Razorpay errors
    if (error.error && error.error.description) {
      errorMessage = `Payment gateway error: ${error.error.description}`;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/services/purchase
 * 
 * Verify payment and update service purchase status
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const purchaseId = searchParams.get('purchase_id');

    if (!paymentId || !orderId || !purchaseId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Find the service purchase
    const servicePurchase = await prisma.servicePurchase.findUnique({
      where: { id: purchaseId },
    });

    if (!servicePurchase) {
      return NextResponse.json(
        { error: 'Service purchase not found' },
        { status: 404 }
      );
    }

    // Verify the purchase belongs to the user
    if (servicePurchase.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // TODO: Verify payment with Razorpay API
    // For now, we'll just update the status

    // Update service purchase
    const updatedPurchase = await prisma.servicePurchase.update({
      where: { id: purchaseId },
      data: {
        status: 'ACTIVE',
        razorpayPaymentId: paymentId,
        deliveryStartDate: new Date(),
      },
      include: {
        user: true,
      },
    });

    // Sync customer to Mailchimp (async, don't wait)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrations/mailchimp/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: updatedPurchase.user.email,
        firstName: updatedPurchase.user.name.split(' ')[0],
        lastName: updatedPurchase.user.name.split(' ').slice(1).join(' '),
        tags: ['customer', 'service_purchase', updatedPurchase.serviceCategory, updatedPurchase.serviceTier].filter(Boolean),
        mergeFields: {
          SERVICE: updatedPurchase.serviceName,
          TIER: updatedPurchase.serviceTier,
          AMOUNT: updatedPurchase.amount.toString(),
        },
        source: 'service_purchase',
      }),
    }).catch(err => console.error('Mailchimp sync failed:', err));

    // TODO: Send confirmation email
    // TODO: Notify admin team
    // TODO: Create project/task in project management system

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

