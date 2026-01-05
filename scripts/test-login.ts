import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
  console.log('Testing login credentials...\n');

  const testCredentials = [
    { email: 'admin@mediaplanpro.com', password: 'Adm!n2024$SecureP@ssw0rd#MPP', role: 'ADMIN' },
    { email: 'editor@mediaplanpro.com', password: 'Ed!t0r2024$SecureP@ssw0rd#MPP', role: 'EDITOR' },
    { email: 'user@mediaplanpro.com', password: 'Us3r2024$SecureP@ssw0rd#MPP', role: 'USER' },
  ];

  for (const cred of testCredentials) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: cred.email },
      });

      if (!user) {
        console.log(`❌ User not found: ${cred.email}`);
        continue;
      }

      const isPasswordValid = await bcrypt.compare(cred.password, user.password);

      if (isPasswordValid) {
        console.log(`✅ ${cred.role} login successful: ${cred.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Role: ${user.role}`);
      } else {
        console.log(`❌ ${cred.role} login failed: ${cred.email} - Invalid password`);
        
        // Test with old password
        const oldPasswords = ['admin123', 'editor123', 'user123'];
        for (const oldPass of oldPasswords) {
          const isOldValid = await bcrypt.compare(oldPass, user.password);
          if (isOldValid) {
            console.log(`   ⚠️  Still using old password: ${oldPass}`);
          }
        }
      }
    } catch (error) {
      console.log(`❌ Error testing ${cred.email}:`, error);
    }
    console.log('');
  }

  await prisma.$disconnect();
}

testLogin().catch(console.error);

