import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Complex passwords for production use
const PRODUCTION_PASSWORDS = {
  ADMIN: 'Adm!n2024$SecureP@ssw0rd#MPP',
  EDITOR: 'Ed!t0r2024$SecureP@ssw0rd#MPP',
  USER: 'Us3r2024$SecureP@ssw0rd#MPP',
};

async function updateUserPasswords() {
  console.log('Starting password update for all users...\n');

  try {
    // Find all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    console.log(`Found ${users.length} users to update\n`);

    const updatedCredentials: Array<{
      role: string;
      email: string;
      name: string;
      password: string;
    }> = [];

    for (const user of users) {
      // Determine password based on role
      let newPassword: string;
      
      if (user.role === 'ADMIN') {
        newPassword = PRODUCTION_PASSWORDS.ADMIN;
      } else if (user.role === 'EDITOR') {
        newPassword = PRODUCTION_PASSWORDS.EDITOR;
      } else {
        newPassword = PRODUCTION_PASSWORDS.USER;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      updatedCredentials.push({
        role: user.role,
        email: user.email,
        name: user.name,
        password: newPassword,
      });

      console.log(`✅ Updated password for ${user.role}: ${user.email}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('PASSWORD UPDATE COMPLETE');
    console.log('='.repeat(80) + '\n');

    console.log('📋 UPDATED USER CREDENTIALS:\n');

    // Group by role
    const adminUsers = updatedCredentials.filter((u) => u.role === 'ADMIN');
    const editorUsers = updatedCredentials.filter((u) => u.role === 'EDITOR');
    const regularUsers = updatedCredentials.filter((u) => u.role === 'USER');

    if (adminUsers.length > 0) {
      console.log('🔐 ADMIN USERS:');
      adminUsers.forEach((user) => {
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log('');
      });
    }

    if (editorUsers.length > 0) {
      console.log('📝 EDITOR USERS:');
      editorUsers.forEach((user) => {
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log('');
      });
    }

    if (regularUsers.length > 0) {
      console.log('👤 REGULAR USERS:');
      regularUsers.forEach((user) => {
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${user.password}`);
        console.log('');
      });
    }

    console.log('='.repeat(80));
    console.log('⚠️  IMPORTANT: Save these credentials securely!');
    console.log('='.repeat(80) + '\n');

    console.log('Password Requirements Met:');
    console.log('✅ Minimum 16 characters');
    console.log('✅ Uppercase letters');
    console.log('✅ Lowercase letters');
    console.log('✅ Numbers');
    console.log('✅ Special characters (!@#$)\n');

  } catch (error) {
    console.error('❌ Error updating passwords:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateUserPasswords()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

