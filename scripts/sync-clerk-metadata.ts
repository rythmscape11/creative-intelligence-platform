import { PrismaClient } from '@prisma/client';
import { createClerkClient } from '@clerk/backend';

const prisma = new PrismaClient();

// Initialize Clerk Client
const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
    console.error('Error: CLERK_SECRET_KEY environment variable is missing.');
    process.exit(1);
}

const clerkClient = createClerkClient({
    secretKey: secretKey,
});

async function main() {
    try {
        console.log('Starting Clerk metadata sync...');

        // Fetch all users with their subscriptions
        const users = await prisma.user.findMany({
            include: {
                subscription: true,
            },
        });

        console.log(`Found ${users.length} users to sync.`);

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            const clerkUserId = user.clerkId;

            if (!clerkUserId) {
                console.warn(`Skipping user ${user.email}: No Clerk ID found in database.`);
                skippedCount++;
                continue;
            }

            try {
                const plan = user.subscription?.plan || 'FREE';
                const role = user.role || 'USER';

                await clerkClient.users.updateUserMetadata(clerkUserId, {
                    publicMetadata: {
                        plan,
                        role,
                    },
                });

                console.log(`Synced user ${user.email} (${clerkUserId}): Plan=${plan}, Role=${role}`);
                successCount++;
            } catch (error) {
                console.error(`Failed to sync user ${user.email}:`, error);
                errorCount++;
            }
        }

        console.log(`Sync complete. Success: ${successCount}, Errors: ${errorCount}, Skipped: ${skippedCount}`);

    } catch (error) {
        console.error('Fatal error during sync:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
