/**
 * Ensure User Exists in Database
 * 
 * Helper to sync a Clerk user to the local database if they don't exist.
 * This handles cases where the webhook didn't fire or user registered before webhook was set up.
 */

import { clerkClient, auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function ensureUserInDb(userId: string): Promise<{
    success: boolean;
    user?: { id: string; email: string; name: string };
    error?: string;
}> {
    try {
        // Check if user exists by ID first
        let existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true }
        });

        if (existingUser) {
            return { success: true, user: existingUser };
        }

        // Also check by clerkId (user might exist with different ID but linked to this Clerk ID)
        existingUser = await prisma.user.findFirst({
            where: { clerkId: userId },
            select: { id: true, email: true, name: true }
        });

        if (existingUser) {
            console.log(`[ensureUserInDb] Found user by clerkId: ${existingUser.email}`);
            return { success: true, user: existingUser };
        }

        // User doesn't exist - fetch from Clerk and create
        console.log(`[ensureUserInDb] User ${userId} not found in DB, fetching from Clerk...`);

        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        if (!clerkUser) {
            return { success: false, error: 'User not found in Clerk' };
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
            return { success: false, error: 'User has no email in Clerk' };
        }

        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email;

        // Check if a user with this email already exists (could be under different ID)
        const userByEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (userByEmail) {
            // User exists with this email but has a different ID
            // We can't change the primary key, so just link via clerkId and return existing user
            const updatedUser = await prisma.user.update({
                where: { email },
                data: {
                    clerkId: userId,  // Link the Clerk ID for future lookups
                    name
                },
                select: { id: true, email: true, name: true }
            });
            console.log(`[ensureUserInDb] Linked existing user ${email} to Clerk ID ${userId}`);
            return { success: true, user: updatedUser };
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                id: userId,
                clerkId: userId,
                email,
                name,
                password: '',
                role: 'USER',
            },
            select: { id: true, email: true, name: true }
        });

        // Also create a free subscription for them
        try {
            await prisma.subscription.create({
                data: {
                    userId: userId,
                    plan: 'FREE',
                    status: 'ACTIVE',
                }
            });
        } catch (subError) {
            // Ignore if subscription already exists
            console.log('[ensureUserInDb] Subscription may already exist');
        }

        console.log(`[ensureUserInDb] Created user ${email} with ID ${userId}`);
        return { success: true, user: newUser };

    } catch (error) {
        console.error('[ensureUserInDb] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
