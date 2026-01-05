import { PrismaClient, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'demo@mediaplanpro.com';
        const password = 'demo123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`Creating user: ${email}`);

        // Check if user exists first
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
                    currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                },
                update: {
                    plan: SubscriptionPlan.PRO,
                    status: SubscriptionStatus.ACTIVE,
                },
            });
            console.log('User subscription updated to PRO.');
        } else {
            // Create new user
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: 'Demo User',
                    role: 'USER',
                    subscription: {
                        create: {
                            plan: SubscriptionPlan.PRO,
                            status: SubscriptionStatus.ACTIVE,
                            currentPeriodStart: new Date(),
                            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                        },
                    },
                },
            });
            console.log(`User created with ID: ${user.id}`);
        }
    } catch (error) {
        console.error('Error creating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
