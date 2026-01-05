import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ADMIN_EMAILS } from '@/config/tool-access';

// Admin check helper
async function checkAdmin() {
    const { userId } = await auth();
    if (!userId) return { isAdmin: false, adminEmail: null };

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();

    if (email && ADMIN_EMAILS.includes(email)) {
        return { isAdmin: true, adminEmail: email };
    }

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (dbUser?.role === 'ADMIN') {
        return { isAdmin: true, adminEmail: dbUser.email || email || 'admin' };
    }

    return { isAdmin: false, adminEmail: null };
}

// GET: List all whitelisted users
export async function GET() {
    const { isAdmin } = await checkAdmin();
    if (!isAdmin) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // Get all subscriptions that are whitelisted (have whitelistedAt set)
        const whitelistedSubs = await prisma.subscription.findMany({
            where: {
                whitelistedAt: { not: null }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    }
                }
            },
            orderBy: { whitelistedAt: 'desc' }
        });

        const result = whitelistedSubs.map(sub => ({
            id: sub.userId,
            email: sub.user.email || '',
            name: sub.user.name,
            plan: sub.plan,
            whitelistedAt: sub.whitelistedAt?.toISOString() || '',
            whitelistedBy: sub.whitelistedBy || 'System',
            expiresAt: sub.currentPeriodEnd?.toISOString() || null,
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to fetch whitelisted users:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

// POST: Add user to whitelist (grant tier access)
export async function POST(req: Request) {
    const { isAdmin, adminEmail } = await checkAdmin();
    if (!isAdmin) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { userId, email, plan } = await req.json();

        if (!userId || !plan) {
            return NextResponse.json({ error: 'Missing userId or plan' }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Upsert subscription with whitelisted flag
        const subscription = await prisma.subscription.upsert({
            where: { userId },
            update: {
                plan: plan as any,
                status: 'ACTIVE',
                whitelistedAt: new Date(),
                whitelistedBy: adminEmail,
                // Set a far future date for whitelisted users
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10), // 10 years
            },
            create: {
                userId,
                plan: plan as any,
                status: 'ACTIVE',
                whitelistedAt: new Date(),
                whitelistedBy: adminEmail,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 10),
            },
        });

        return NextResponse.json({
            success: true,
            subscription,
            message: `${email || userId} granted ${plan} access`,
        });
    } catch (error) {
        console.error('Failed to whitelist user:', error);
        return NextResponse.json({ error: 'Failed to whitelist user' }, { status: 500 });
    }
}

// DELETE: Remove user from whitelist
export async function DELETE(req: Request) {
    const { isAdmin } = await checkAdmin();
    if (!isAdmin) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }

        // Reset subscription to FREE
        await prisma.subscription.update({
            where: { userId },
            data: {
                plan: 'FREE',
                status: 'ACTIVE',
                whitelistedAt: null,
                whitelistedBy: null,
                razorpaySubscriptionId: null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to remove from whitelist:', error);
        return NextResponse.json({ error: 'Failed to remove' }, { status: 500 });
    }
}
