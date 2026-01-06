import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { GetSubscriptionResponseDTO } from '@/dtos/subscription.dto';

export const dynamic = 'force-dynamic';

// Get user's subscription
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId },
    });

    const response: GetSubscriptionResponseDTO = {
      subscription: subscription || {
        plan: 'FREE',
        status: 'ACTIVE',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        trialEnd: null,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}


