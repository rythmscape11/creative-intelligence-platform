import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2] || 'admin@mediaplanpro.com';
    const password = process.argv[3] || 'admin123';

    console.log(`Creating/Updating admin user: ${email}`);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: UserRole.ADMIN,
                password: hashedPassword,
            },
            create: {
                email,
                name: 'Admin User',
                password: hashedPassword,
                role: UserRole.ADMIN,
            },
        });

        console.log(`Successfully configured admin user: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`ID: ${user.id}`);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
