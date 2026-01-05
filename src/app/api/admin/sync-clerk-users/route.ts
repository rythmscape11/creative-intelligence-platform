import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/sync-clerk-users
 * Syncs all Clerk users to Prisma database
 * This is useful when webhooks didn't fire or users existed before webhook setup
 */
export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify admin
        const adminUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!adminUser || adminUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        console.log('[Sync Clerk Users] Starting sync...');

        // Get all users from Clerk
        const client = await clerkClient();
        const clerkUsers = await client.users.getUserList({ limit: 500 });

        console.log(`[Sync Clerk Users] Found ${clerkUsers.data.length} users in Clerk`);

        const results = {
            total: clerkUsers.data.length,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: [] as string[],
        };

        for (const clerkUser of clerkUsers.data) {
            try {
                const email = clerkUser.emailAddresses[0]?.emailAddress;
                if (!email) {
                    results.errors.push(`User ${clerkUser.id} has no email`);
                    continue;
                }

                const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email;

                // Check if user exists by ID
                const existingById = await prisma.user.findUnique({
                    where: { id: clerkUser.id }
                });

                if (existingById) {
                    results.skipped++;
                    continue;
                }

                // Check if user exists by email (different ID)
                const existingByEmail = await prisma.user.findUnique({
                    where: { email }
                });

                if (existingByEmail) {
                    // Migrate to Clerk ID
                    await prisma.user.update({
                        where: { email },
                        data: {
                            id: clerkUser.id,
                            clerkId: clerkUser.id,
                            name,
                        }
                    });
                    results.updated++;
                    console.log(`[Sync Clerk Users] Migrated user ${email} to Clerk ID`);
                } else {
                    // Create new user
                    await prisma.user.create({
                        data: {
                            id: clerkUser.id,
                            clerkId: clerkUser.id,
                            email,
                            name,
                            password: '',
                            role: 'USER',
                        }
                    });

                    // Create trial subscription
                    try {
                        const trialEnd = new Date();
                        trialEnd.setDate(trialEnd.getDate() + 60);

                        await prisma.subscription.create({
                            data: {
                                userId: clerkUser.id,
                                plan: 'PRO',
                                status: 'TRIALING',
                                trialStart: new Date(),
                                trialEnd,
                                paymentGateway: 'razorpay',
                            }
                        });
                    } catch (subError) {
                        // Subscription might already exist
                    }

                    results.created++;
                    console.log(`[Sync Clerk Users] Created user ${email}`);
                }

            } catch (userError) {
                const errorMsg = userError instanceof Error ? userError.message : 'Unknown error';
                results.errors.push(`User ${clerkUser.id}: ${errorMsg}`);
            }
        }

        console.log('[Sync Clerk Users] Sync complete:', results);

        return NextResponse.json({
            success: true,
            message: `Synced ${results.created} new, updated ${results.updated}, skipped ${results.skipped} existing`,
            ...results,
        });

    } catch (error) {
        console.error('[Sync Clerk Users] Error:', error);
        return NextResponse.json({
            error: 'Sync failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * GET /api/admin/sync-clerk-users
 * Returns status of Clerk vs Prisma users
 */
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify admin
        const adminUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!adminUser || adminUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Get counts
        const client = await clerkClient();
        const clerkUsers = await client.users.getUserList({ limit: 500 });
        const prismaUserCount = await prisma.user.count();

        const clerkIds = clerkUsers.data.map(u => u.id);
        const existingUsers = await prisma.user.findMany({
            where: { id: { in: clerkIds } },
            select: { id: true }
        });

        const missingInPrisma = clerkUsers.data.filter(
            cu => !existingUsers.some(pu => pu.id === cu.id)
        );

        return NextResponse.json({
            clerkUserCount: clerkUsers.data.length,
            prismaUserCount,
            missingInPrisma: missingInPrisma.length,
            missingUsers: missingInPrisma.map(u => ({
                id: u.id,
                email: u.emailAddresses[0]?.emailAddress,
                name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
            })),
        });

    } catch (error) {
        console.error('[Sync Clerk Users] Error:', error);
        return NextResponse.json({
            error: 'Failed to get sync status',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
