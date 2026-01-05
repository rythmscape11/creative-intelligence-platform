/**
 * Razorpay Test API Route
 * 
 * Tests Razorpay configuration and connectivity
 * ADMIN-only endpoint for debugging
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { razorpay, isRazorpayConfigured } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow ADMIN users
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      );
    }

    console.log('[Razorpay Test] Starting configuration test...');

    // Test 1: Check environment variables
    const envCheck = {
      RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
      RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET,
      RAZORPAY_WEBHOOK_SECRET: !!process.env.RAZORPAY_WEBHOOK_SECRET,
      RAZORPAY_PRO_MONTHLY_PLAN_ID: !!process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID,
      RAZORPAY_PRO_YEARLY_PLAN_ID: !!process.env.RAZORPAY_PRO_YEARLY_PLAN_ID,
      RAZORPAY_TEAM_MONTHLY_PLAN_ID: !!process.env.RAZORPAY_TEAM_MONTHLY_PLAN_ID,
      RAZORPAY_TEAM_YEARLY_PLAN_ID: !!process.env.RAZORPAY_TEAM_YEARLY_PLAN_ID,
    };

    console.log('[Razorpay Test] Environment variables:', envCheck);

    // Test 2: Check if Razorpay is configured
    const configured = isRazorpayConfigured;
    console.log('[Razorpay Test] Is configured:', configured);

    // Test 3: Check if Razorpay instance exists
    const hasInstance = !!razorpay;
    console.log('[Razorpay Test] Has instance:', hasInstance);

    // Test 4: Try to create a test order (₹1.00 = 100 paise)
    let testOrderResult: any = {
      success: false,
      error: null,
      orderId: null,
    };

    if (configured && hasInstance) {
      try {
        console.log('[Razorpay Test] Creating test order...');
        const testOrder = await razorpay.orders.create({
          amount: 100, // ₹1.00 in paise
          currency: 'INR',
          receipt: `test_${Date.now()}`,
          notes: {
            test: 'true',
            purpose: 'configuration_test',
          },
        });

        testOrderResult = {
          success: true,
          error: null,
          orderId: testOrder.id,
          amount: testOrder.amount,
          currency: testOrder.currency,
          status: testOrder.status,
        };

        console.log('[Razorpay Test] Test order created successfully:', testOrder.id);
      } catch (error: any) {
        console.error('[Razorpay Test] Test order creation failed:', error);
        testOrderResult = {
          success: false,
          error: {
            message: error.message,
            statusCode: error.statusCode,
            code: error.error?.code,
            description: error.error?.description,
          },
          orderId: null,
        };
      }
    } else {
      testOrderResult = {
        success: false,
        error: 'Razorpay not configured or instance not initialized',
        orderId: null,
      };
    }

    // Return comprehensive test results
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        environmentVariables: {
          passed: Object.values(envCheck).every(v => v),
          details: envCheck,
        },
        configuration: {
          passed: configured,
          isConfigured: configured,
        },
        instance: {
          passed: hasInstance,
          hasInstance,
        },
        apiConnectivity: testOrderResult,
      },
      summary: {
        allTestsPassed: configured && hasInstance && testOrderResult.success,
        readyForProduction: configured && hasInstance && testOrderResult.success,
      },
      recommendations: [
        !envCheck.RAZORPAY_KEY_ID && 'Set RAZORPAY_KEY_ID environment variable',
        !envCheck.RAZORPAY_KEY_SECRET && 'Set RAZORPAY_KEY_SECRET environment variable',
        !envCheck.RAZORPAY_WEBHOOK_SECRET && 'Set RAZORPAY_WEBHOOK_SECRET environment variable',
        !configured && 'Verify Razorpay API credentials are correct',
        !hasInstance && 'Check Razorpay instance initialization in src/lib/razorpay.ts',
        !testOrderResult.success && 'Fix API connectivity issues - check credentials and account status',
      ].filter(Boolean),
    });
  } catch (error: any) {
    console.error('[Razorpay Test] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed with unexpected error',
        details: {
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
      },
      { status: 500 }
    );
  }
}
