import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'paid_user_v3@example.com';
        const password = 'PaidUser123!';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`Creating user: ${email}`);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log('User already exists. Updating subscription...');
            await prisma.subscription.upsert({
                where: { userId: existingUser.id },
                create: {
                    userId: existingUser.id,
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
        } else {
            // Create new user with subscription
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: 'Paid User V3',
                    role: 'USER',
                    subscription: {
                        create: {
                            plan: SubscriptionPlan.PRO,
                            status: SubscriptionStatus.ACTIVE,
                            currentPeriodStart: new Date(),
                            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                        },
                    },
                },
            });
        }

        console.log('User paid_user_v3 created/updated successfully.');
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
