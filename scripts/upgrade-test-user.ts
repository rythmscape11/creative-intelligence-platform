import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'auto_test_user_v1@mediaplanpro.com';
        console.log(`Upgrading user to PRO: ${email}`);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('❌ User not found');
            return;
        }

        await prisma.subscription.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                plan: SubscriptionPlan.PRO,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            },
            update: {
                plan: SubscriptionPlan.PRO,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
        });

        console.log('✅ User upgraded to PRO subscription');
    } catch (error) {
        console.error('Error upgrading user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
