import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
    const testEmail = 'test_0@example.com';
    const testPassword = 'password123';

    console.log(`Testing authentication for: ${testEmail}`);

    // Fetch user from database
    const user = await prisma.user.findUnique({
        where: { email: testEmail },
    });

    if (!user) {
        console.error('❌ User not found in database');
        return;
    }

    console.log('✅ User found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        passwordLength: user.password?.length,
    });

    if (!user.password) {
        console.error('❌ User has no password set');
        return;
    }

    // Test password comparison
    const isValid = await bcrypt.compare(testPassword, user.password);

    if (isValid) {
        console.log('✅ Password is valid');
    } else {
        console.log('❌ Password is invalid');
        console.log('Expected password:', testPassword);
        console.log('Stored hash:', user.password.substring(0, 20) + '...');
    }

    // Check subscription
    const subscription = await prisma.subscription.findUnique({
        where: { userId: user.id },
    });

    if (subscription) {
        console.log('✅ Subscription found:', {
            plan: subscription.plan,
            status: subscription.status,
        });
    } else {
        console.log('⚠️  No subscription found');
    }

    await prisma.$disconnect();
}

testAuth().catch(console.error);
