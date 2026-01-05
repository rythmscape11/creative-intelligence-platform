import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production database...');

  // Validate required environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.\n' +
      'Usage: ADMIN_EMAIL="admin@yourdomain.com" ADMIN_PASSWORD="SecurePass123!" npm run deploy:seed'
    );
  }

  // Validate password strength
  if (adminPassword.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters long');
  }

  console.log(`📧 Admin email: ${adminEmail}`);

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created/updated:', admin.email);

  // Create categories
  const categories = [
    {
      name: 'Marketing Strategy',
      slug: 'marketing-strategy',
      description: 'Comprehensive guides on marketing strategy development and execution',
      color: '#3B82F6',
    },
    {
      name: 'Content Marketing',
      slug: 'content-marketing',
      description: 'Content creation, distribution, and optimization strategies',
      color: '#F59E0B',
    },
    {
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      description: 'Latest trends and tactics in digital marketing channels',
      color: '#10B981',
    },
    {
      name: 'AI Marketing',
      slug: 'ai-marketing',
      description: 'How artificial intelligence is transforming marketing practices',
      color: '#8B5CF6',
    },
  ];

  console.log('📁 Creating categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // Create tags
  const tags = [
    { name: 'SEO', slug: 'seo' },
    { name: 'Social Media', slug: 'social-media' },
    { name: 'Email Marketing', slug: 'email-marketing' },
    { name: 'Analytics', slug: 'analytics' },
    { name: 'Content Strategy', slug: 'content-strategy' },
    { name: 'PPC', slug: 'ppc' },
    { name: 'Conversion Optimization', slug: 'conversion-optimization' },
    { name: 'Marketing Automation', slug: 'marketing-automation' },
    { name: 'Brand Strategy', slug: 'brand-strategy' },
    { name: 'Customer Experience', slug: 'customer-experience' },
  ];

  console.log('🏷️  Creating tags...');
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`✅ ${tags.length} tags created`);

  // Optional: Create a welcome blog post
  const welcomeCategory = await prisma.category.findUnique({
    where: { slug: 'marketing-strategy' },
  });

  if (welcomeCategory) {
    const welcomePost = await prisma.blogPost.upsert({
      where: { slug: 'welcome-to-mediaplanpro' },
      update: {},
      create: {
        title: 'Welcome to MediaPlanPro',
        slug: 'welcome-to-mediaplanpro',
        content: `
          <h2>Welcome to MediaPlanPro Blog</h2>
          <p>We're excited to launch our new blog platform! Here you'll find:</p>
          <ul>
            <li>Expert marketing strategy guides</li>
            <li>Latest industry trends and insights</li>
            <li>Practical tips and best practices</li>
            <li>Case studies and success stories</li>
          </ul>
          <p>Stay tuned for regular updates and valuable content to help you succeed in your marketing efforts.</p>
        `,
        excerpt: 'Welcome to the MediaPlanPro blog - your source for marketing strategy insights and best practices.',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        seoTitle: 'Welcome to MediaPlanPro Blog - Marketing Strategy Insights',
        seoDescription: 'Discover expert marketing strategies, industry trends, and practical tips on the MediaPlanPro blog.',
        authorId: admin.id,
        categoryId: welcomeCategory.id,
      },
    });

    console.log('✅ Welcome blog post created:', welcomePost.slug);
  }

  console.log('');
  console.log('🎉 Production database seeded successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`   - Admin user: ${adminEmail}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Tags: ${tags.length}`);
  console.log('');
  console.log('🔐 IMPORTANT: Save your admin credentials securely!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

