import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const { toolId, toolName, category, metadata } = await req.json();

    if (!toolId || !toolName || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Only track usage for authenticated users
    if (userId) {
      // Track usage
      await prisma.toolUsage.create({
        data: {
          userId: userId,
          toolId,
          toolName,
          category,
          metadata: metadata || {}
        }
      });

      // Update daily limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.dailyToolLimit.upsert({
        where: {
          userId_toolId_date: {
            userId: userId,
            toolId,
            date: today
          }
        },
        update: {
          count: { increment: 1 }
        },
        create: {
          userId: userId,
          toolId,
          date: today,
          count: 1
        }
      });

      return NextResponse.json({ success: true, tracked: true });
    }

    // For unauthenticated users, don't track but return success
    // (client-side will handle session-based limiting)
    return NextResponse.json({
      success: true,
      tracked: false,
      message: 'Sign up to track your usage and get 10 uses per tool per day'
    });
  } catch (error) {
    console.error('Track usage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

