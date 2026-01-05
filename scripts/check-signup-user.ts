import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'auto_test_user_v1@mediaplanpro.com';
        console.log(`Checking for user: ${email}`);

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                subscription: true,
            },
        });

        if (user) {
            console.log('✅ User FOUND in database!');
            console.log('User ID:', user.id);
            console.log('Name:', user.name);
            console.log('Email:', user.email);
            console.log('Subscription:', user.subscription?.plan || 'None');
            console.log('\n🎯 This confirms the live site uses the SAME database as local environment.');
        } else {
            console.log('❌ User NOT found in database.');
            console.log('🎯 This suggests the live site uses a DIFFERENT database.');
        }
    } catch (error) {
        console.error('Error checking user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
