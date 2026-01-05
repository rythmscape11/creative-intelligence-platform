/**
 * Growth Suite Usage API
 * 
 * GET /api/growth-suite/usage
 * 
 * Returns usage statistics for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserUsageStats, FREE_TIER_LIMITS } from '@/lib/growth-suite/usage-tracker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get usage stats
    const stats = await getUserUsageStats(userId);

    return NextResponse.json({
      success: true,
      userId: userId,
      plan: 'free', // TODO: Get from user settings
      limits: FREE_TIER_LIMITS,
      usage: stats,
    });

  } catch (error) {
    console.error('Usage API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
