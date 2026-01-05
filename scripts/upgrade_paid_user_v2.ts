import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'paid_user_v2@example.com';
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error(`User ${email} not found!`);
            return;
        }

        console.log(`Upgrading user ${email} to PRO...`);

        await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                plan: SubscriptionPlan.PRO,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
            update: {
                plan: SubscriptionPlan.PRO,
                status: SubscriptionStatus.ACTIVE,
            },
        });

        console.log('Upgrade successful.');
    } catch (error) {
        console.error('Error upgrading user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
