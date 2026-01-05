import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * Admin Users API
 * GET /api/admin/users
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const currentUser = await prisma.user.findFirst({
      where: {
        OR: [{ id: userId }, { clerkId: userId }],
      },
    });

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where = search
      ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
      : {};

    // Get users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Get subscriptions for these users
    const userIds = users.map(u => u.id);
    const subscriptions = await prisma.productSubscription.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        product: true,
        planTier: true,
        status: true,
      },
    });

    // Map subscriptions to users
    const subscriptionsByUser = subscriptions.reduce((acc, sub) => {
      if (!acc[sub.userId]) acc[sub.userId] = [];
      acc[sub.userId].push({
        product: sub.product,
        tier: sub.planTier,
        status: sub.status,
      });
      return acc;
    }, {} as Record<string, { product: string; tier: string; status: string }[]>);

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        subscriptions: subscriptionsByUser[user.id] || [],
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('[Admin Users] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
