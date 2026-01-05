const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { seedBlogData } = require('./seed-blog-data');

const prisma = new PrismaClient();

async function seedAllData() {
  try {
    console.log('🌱 Starting comprehensive data seeding...\n');

    // 1. Seed blog data (users, categories, tags, posts)
    console.log('📝 Seeding blog data...');
    await seedBlogData();
    console.log('');

    // 2. Create additional test users
    console.log('👥 Creating additional test users...');
    
    const testUsers = [
      {
        email: 'user@mediaplanpro.com',
        name: 'Test User',
        password: 'user123',
        role: 'USER',
      },
      {
        email: 'demo@mediaplanpro.com',
        name: 'Demo User',
        password: 'demo123',
        role: 'USER',
      },
    ];

    for (const userData of testUsers) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          },
        });
        console.log(`✅ Created user: ${userData.email}`);
      }
    }

    // 3. Create sample strategies
    console.log('\n📊 Creating sample strategies...');
    
    const users = await prisma.user.findMany();
    const regularUser = users.find(u => u.role === 'USER');

    if (regularUser) {
      const sampleStrategies = [
        {
          userId: regularUser.id,
          businessName: 'TechStart Inc.',
          industry: 'Technology',
          targetAudience: 'Small to medium-sized businesses',
          budget: 50000,
          objectives: ['Brand Awareness', 'Lead Generation'],
          challenges: 'Limited marketing budget and brand recognition',
          timeframe: '6 months',
          generatedStrategy: {
            executive_summary: 'Comprehensive digital marketing strategy focused on building brand awareness and generating qualified leads through content marketing, SEO, and targeted advertising.',
            target_audience: {
              demographics: 'Business owners and decision-makers aged 30-55',
              psychographics: 'Tech-savvy, growth-oriented, value efficiency',
              pain_points: ['Limited time', 'Need for scalable solutions', 'Budget constraints'],
            },
            marketing_channels: [
              {
                channel: 'Content Marketing',
                tactics: ['Blog posts', 'Whitepapers', 'Case studies'],
                budget_allocation: 15000,
                expected_roi: '250%',
              },
              {
                channel: 'SEO',
                tactics: ['On-page optimization', 'Link building', 'Technical SEO'],
                budget_allocation: 10000,
                expected_roi: '300%',
              },
              {
                channel: 'PPC Advertising',
                tactics: ['Google Ads', 'LinkedIn Ads'],
                budget_allocation: 20000,
                expected_roi: '200%',
              },
            ],
            budget_allocation: {
              total: 50000,
              breakdown: {
                'Content Marketing': 15000,
                'SEO': 10000,
                'PPC Advertising': 20000,
                'Social Media': 5000,
              },
            },
            timeline: {
              'Month 1-2': 'Foundation and setup',
              'Month 3-4': 'Content creation and optimization',
              'Month 5-6': 'Scaling and optimization',
            },
            kpis: [
              { metric: 'Website Traffic', target: '+150%', timeframe: '6 months' },
              { metric: 'Lead Generation', target: '500 qualified leads', timeframe: '6 months' },
              { metric: 'Brand Awareness', target: '+200% social reach', timeframe: '6 months' },
            ],
          },
        },
        {
          userId: regularUser.id,
          businessName: 'EcoProducts Co.',
          industry: 'E-commerce',
          targetAudience: 'Environmentally conscious consumers',
          budget: 75000,
          objectives: ['Sales Growth', 'Customer Retention'],
          challenges: 'High competition in sustainable products market',
          timeframe: '12 months',
          generatedStrategy: {
            executive_summary: 'Multi-channel marketing strategy emphasizing sustainability and customer engagement to drive sales and build long-term customer relationships.',
            target_audience: {
              demographics: 'Millennials and Gen Z, ages 25-40, urban areas',
              psychographics: 'Environmentally conscious, values transparency, willing to pay premium',
              pain_points: ['Finding authentic sustainable products', 'Trust in brand claims', 'Product quality concerns'],
            },
            marketing_channels: [
              {
                channel: 'Social Media Marketing',
                tactics: ['Instagram campaigns', 'TikTok content', 'Influencer partnerships'],
                budget_allocation: 25000,
                expected_roi: '280%',
              },
              {
                channel: 'Email Marketing',
                tactics: ['Welcome series', 'Product launches', 'Loyalty program'],
                budget_allocation: 15000,
                expected_roi: '400%',
              },
              {
                channel: 'Content Marketing',
                tactics: ['Sustainability blog', 'Video content', 'User-generated content'],
                budget_allocation: 20000,
                expected_roi: '250%',
              },
            ],
            budget_allocation: {
              total: 75000,
              breakdown: {
                'Social Media Marketing': 25000,
                'Email Marketing': 15000,
                'Content Marketing': 20000,
                'Influencer Marketing': 15000,
              },
            },
            timeline: {
              'Q1': 'Brand positioning and content foundation',
              'Q2': 'Influencer partnerships and campaign launches',
              'Q3': 'Scaling successful channels',
              'Q4': 'Holiday campaigns and retention focus',
            },
            kpis: [
              { metric: 'Revenue Growth', target: '+75%', timeframe: '12 months' },
              { metric: 'Customer Retention', target: '60% repeat purchase rate', timeframe: '12 months' },
              { metric: 'Social Engagement', target: '+300%', timeframe: '12 months' },
            ],
          },
        },
        {
          userId: regularUser.id,
          businessName: 'HealthFit Gym',
          industry: 'Fitness & Wellness',
          targetAudience: 'Health-conscious individuals in local area',
          budget: 30000,
          objectives: ['Membership Growth', 'Local Brand Awareness'],
          challenges: 'Competition from online fitness platforms',
          timeframe: '6 months',
          generatedStrategy: {
            executive_summary: 'Local marketing strategy combining digital and traditional channels to attract new members and build community engagement.',
            target_audience: {
              demographics: 'Adults 25-50, within 5-mile radius',
              psychographics: 'Health-focused, community-oriented, values in-person experience',
              pain_points: ['Lack of motivation', 'Need for accountability', 'Convenience concerns'],
            },
            marketing_channels: [
              {
                channel: 'Local SEO',
                tactics: ['Google My Business optimization', 'Local citations', 'Review management'],
                budget_allocation: 5000,
                expected_roi: '350%',
              },
              {
                channel: 'Social Media',
                tactics: ['Facebook community', 'Instagram stories', 'Member testimonials'],
                budget_allocation: 8000,
                expected_roi: '200%',
              },
              {
                channel: 'Community Events',
                tactics: ['Free fitness classes', 'Health workshops', 'Local partnerships'],
                budget_allocation: 12000,
                expected_roi: '180%',
              },
            ],
            budget_allocation: {
              total: 30000,
              breakdown: {
                'Local SEO': 5000,
                'Social Media': 8000,
                'Community Events': 12000,
                'Referral Program': 5000,
              },
            },
            timeline: {
              'Month 1-2': 'Digital presence optimization',
              'Month 3-4': 'Community event series launch',
              'Month 5-6': 'Referral program and retention focus',
            },
            kpis: [
              { metric: 'New Memberships', target: '150 new members', timeframe: '6 months' },
              { metric: 'Local Search Visibility', target: 'Top 3 for key terms', timeframe: '6 months' },
              { metric: 'Member Retention', target: '85% retention rate', timeframe: '6 months' },
            ],
          },
        },
      ];

      for (const strategyData of sampleStrategies) {
        const existingStrategy = await prisma.strategy.findFirst({
          where: {
            businessName: strategyData.businessName,
            userId: regularUser.id,
          }
        });

        if (!existingStrategy) {
          await prisma.strategy.create({
            data: strategyData,
          });
          console.log(`✅ Created strategy: ${strategyData.businessName}`);
        }
      }
    }

    // 4. Create sample exports
    console.log('\n📤 Creating sample exports...');
    
    const strategies = await prisma.strategy.findMany();
    
    if (strategies.length > 0) {
      const sampleExports = [
        {
          strategyId: strategies[0].id,
          format: 'PPTX',
          status: 'COMPLETED',
          fileUrl: 'https://example.com/exports/strategy-1.pptx',
          completedAt: new Date(),
        },
        {
          strategyId: strategies[0].id,
          format: 'DOCX',
          status: 'COMPLETED',
          fileUrl: 'https://example.com/exports/strategy-1.docx',
          completedAt: new Date(),
        },
      ];

      for (const exportData of sampleExports) {
        const existingExport = await prisma.export.findFirst({
          where: {
            strategyId: exportData.strategyId,
            format: exportData.format,
          }
        });

        if (!existingExport) {
          await prisma.export.create({
            data: exportData,
          });
          console.log(`✅ Created export: ${exportData.format}`);
        }
      }
    }

    console.log('\n🎉 All data seeding completed successfully!\n');
    console.log('================================================');
    console.log('📊 Summary:');
    console.log('================================================');
    console.log('👥 Users:');
    console.log('   - admin@mediaplanpro.com (password: admin123) - ADMIN');
    console.log('   - editor@mediaplanpro.com (password: editor123) - EDITOR');
    console.log('   - user@mediaplanpro.com (password: user123) - USER');
    console.log('   - demo@mediaplanpro.com (password: demo123) - USER');
    console.log('');
    console.log('📝 Blog Content:');
    console.log('   - 5 Categories');
    console.log('   - 12 Tags');
    console.log('   - 4 Blog Posts (3 published, 1 draft)');
    console.log('');
    console.log('📊 Strategies:');
    console.log('   - 3 Sample strategies with complete data');
    console.log('');
    console.log('📤 Exports:');
    console.log('   - 2 Sample exports (PPTX, DOCX)');
    console.log('================================================');
    console.log('\n✨ You can now login and explore the platform!');
    console.log('   Visit: http://localhost:3000');
    console.log('================================================\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedAllData()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedAllData };
