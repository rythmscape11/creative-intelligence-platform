import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
    const email = 'test_0@example.com';
    const newPassword = 'password123';

    console.log(`Resetting password for: ${email}`);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        console.log('✅ Password updated successfully for user:', user.email);

        // Verify immediately
        const isValid = await bcrypt.compare(newPassword, user.password!);
        console.log('✅ Verification check:', isValid ? 'PASSED' : 'FAILED');

    } catch (error) {
        console.error('❌ Failed to update password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
