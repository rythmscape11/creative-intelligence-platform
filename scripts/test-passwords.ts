import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testPasswords() {
  console.log('🔐 Testing password authentication...\n');

  const testCredentials = [
    { email: 'admin@mediaplanpro.com', password: 'admin123' },
    { email: 'editor@mediaplanpro.com', password: 'editor123' },
    { email: 'user@mediaplanpro.com', password: 'user123' },
  ];

  for (const cred of testCredentials) {
    console.log(`Testing: ${cred.email}`);
    
    const user = await prisma.user.findUnique({
      where: { email: cred.email },
    });

    if (!user) {
      console.log(`  ❌ User not found\n`);
      continue;
    }

    console.log(`  ✓ User found: ${user.name}`);
    console.log(`  Password hash: ${user.password.substring(0, 20)}...`);
    
    const isValid = await bcrypt.compare(cred.password, user.password);
    
    if (isValid) {
      console.log(`  ✅ Password "${cred.password}" is VALID\n`);
    } else {
      console.log(`  ❌ Password "${cred.password}" is INVALID`);
      
      // Test if the hash is correct format
      const testHash = await bcrypt.hash(cred.password, 12);
      console.log(`  New hash would be: ${testHash.substring(0, 20)}...`);
      console.log(`  Stored hash is:    ${user.password.substring(0, 20)}...\n`);
    }
  }

  await prisma.$disconnect();
}

testPasswords().catch(console.error);

