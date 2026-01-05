import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
  console.log('🔐 Testing Authentication Setup...\n');

  // Test 1: Check if admin user exists
  console.log('Test 1: Checking admin user...');
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@mediaplanpro.com' },
  });

  if (admin) {
    console.log('✅ Admin user exists');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
    
    // Test password
    const testPassword = 'MediaPlanPro2025!Admin';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    console.log(`   Password test: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
  } else {
    console.log('❌ Admin user not found');
  }

  // Test 2: Create a test user
  console.log('\nTest 2: Creating test user...');
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  try {
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test User',
        password: hashedPassword,
        role: 'USER',
      },
    });
    
    console.log('✅ Test user created');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   ID: ${testUser.id}`);
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(testPassword, testUser.password);
    console.log(`   Password verification: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`);
    
    // Clean up
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test user deleted');
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }

  // Test 3: Count total users
  console.log('\nTest 3: User statistics...');
  const totalUsers = await prisma.user.count();
  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  const editorCount = await prisma.user.count({ where: { role: 'EDITOR' } });
  const userCount = await prisma.user.count({ where: { role: 'USER' } });
  
  console.log(`   Total users: ${totalUsers}`);
  console.log(`   Admins: ${adminCount}`);
  console.log(`   Editors: ${editorCount}`);
  console.log(`   Users: ${userCount}`);

  console.log('\n✅ Authentication tests complete!');
}

testAuth()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

