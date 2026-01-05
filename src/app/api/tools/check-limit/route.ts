import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const FREE_TIER_LIMIT = 10;
const GUEST_TIER_LIMIT = 3; // Lower limit for unauthenticated users

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    const toolId = req.nextUrl.searchParams.get('toolId');

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID required' }, { status: 400 });
    }

    // For authenticated users
    if (userId) {
      // Check if user is Pro
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      });

      const isPro = user?.subscription?.status === 'ACTIVE';

      // Pro users have unlimited usage
      if (isPro) {
        return NextResponse.json({
          canUse: true,
          remaining: -1, // Unlimited
          limit: -1,
          isPro: true,
          usedToday: 0,
          isAuthenticated: true
        });
      }

      // Check daily usage for authenticated free users
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailyLimit = await prisma.dailyToolLimit.findUnique({
        where: {
          userId_toolId_date: {
            userId: userId,
            toolId,
            date: today
          }
        }
      });

      const usedToday = dailyLimit?.count || 0;
      const remaining = Math.max(0, FREE_TIER_LIMIT - usedToday);
      const canUse = remaining > 0;

      return NextResponse.json({
        canUse,
        remaining,
        limit: FREE_TIER_LIMIT,
        isPro: false,
        usedToday,
        isAuthenticated: true
      });
    }

    // For unauthenticated users (guests)
    // Allow limited usage without tracking (client-side session storage)
    return NextResponse.json({
      canUse: true,
      remaining: GUEST_TIER_LIMIT,
      limit: GUEST_TIER_LIMIT,
      isPro: false,
      usedToday: 0,
      isAuthenticated: false,
      message: 'Sign up for free to get 10 uses per tool per day'
    });
  } catch (error) {
    console.error('Check limit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
