#!/usr/bin/env node
/**
 * Script to set admin role for a user via Clerk Backend API
 * Usage: npx tsx scripts/set-admin-role.ts
 */

import { config } from 'dotenv';
config({ path: '.env.prod' });

import { createClerkClient } from '@clerk/backend';

const ADMIN_EMAIL = 'mukherjeeanustup@gmail.com';

const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});

async function setAdminRole() {
    try {
        // List all users first
        console.log('Fetching all users from production Clerk...');
        const allUsers = await clerk.users.getUserList({ limit: 100 });

        console.log(`\nFound ${allUsers.data.length} users:`);
        allUsers.data.forEach((u, i) => {
            const email = u.emailAddresses[0]?.emailAddress || 'no email';
            console.log(`${i + 1}. ${email} (ID: ${u.id}) - role: ${(u.publicMetadata as any)?.role || 'none'}`);
        });

        // Find user by email (case-insensitive)
        const user = allUsers.data.find(u =>
            u.emailAddresses.some(e => e.emailAddress.toLowerCase() === ADMIN_EMAIL.toLowerCase())
        );

        if (!user) {
            console.error(`\n❌ User not found: ${ADMIN_EMAIL}`);
            console.log('Please update ADMIN_EMAIL in this script to match one of the emails above.');
            process.exit(1);
        }

        console.log(`\nFound user: ${user.id}`);

        // Update publicMetadata to set role as ADMIN
        await clerk.users.updateUserMetadata(user.id, {
            publicMetadata: {
                ...user.publicMetadata,
                role: 'ADMIN',
            },
        });

        console.log(`✅ Successfully set role to ADMIN for ${ADMIN_EMAIL}`);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

setAdminRole();
