import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEST_USERS = [
    { email: 'test_0@example.com', password: 'password123' },
    { email: 'paid_user_v2@example.com', password: 'PaidUser123!' },
    { email: 'paid_user_v3@example.com', password: 'PaidUser123!' },
];

async function resetPasswords() {
    console.log('Resetting passwords for test users...\n');

    for (const testUser of TEST_USERS) {
        const user = await prisma.user.findUnique({
            where: { email: testUser.email },
        });

        if (!user) {
            console.log(`⚠️  User not found: ${testUser.email}`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(testUser.password, 10);

        await prisma.user.update({
            where: { email: testUser.email },
            data: { password: hashedPassword },
        });

        console.log(`✅ Password reset for: ${testUser.email}`);
        console.log(`   New password: ${testUser.password}\n`);
    }

    console.log('Password reset complete!');
    await prisma.$disconnect();
}

resetPasswords().catch(console.error);
