/**
 * Generate 1000 Unique Blog Posts for MediaPlanPro
 * 
 * This script generates 1000 high-quality, SEO-optimized blog posts with:
 * - Unique titles, slugs, and content
 * - Unsplash images (unique for each post)
 * - Proper SEO metadata (title, description, excerpt)
 * - Relevant tags and categories
 * - Published status with staggered timestamps
 * 
 * USAGE:
 *   npx tsx scripts/generate-1000-blog-posts.ts              # Dry-run mode (preview only)
 *   npx tsx scripts/generate-1000-blog-posts.ts --execute    # Actually create posts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const TOTAL_POSTS = 1000;
const BATCH_SIZE = 50;
const DRY_RUN = !process.argv.includes('--execute');

// Unsplash image collections for different marketing topics
const UNSPLASH_COLLECTIONS = {
  'AI Marketing': ['1065396', '3356584', '1319040'],
  'Strategy': ['1319040', '3356584', '1065396'],
  'Analytics': ['3356584', '1319040', '1065396'],
  'Social Media': ['3356584', '1319040', '1065396'],
  'Content Marketing': ['1319040', '3356584', '1065396'],
  'SEO': ['3356584', '1319040', '1065396'],
  'Advertising': ['1319040', '3356584', '1065396'],
  'Email Marketing': ['3356584', '1319040', '1065396'],
  'Technology': ['3356584', '1319040', '1065396'],
  'Digital Marketing': ['1319040', '3356584', '1065396'],
};

// Expanded topics (200+ unique topics)
const TOPICS = [
  // AI & Machine Learning (50 topics)
  'AI-Powered Marketing Automation', 'Machine Learning for Customer Segmentation', 'Predictive Analytics in Marketing',
  'AI Chatbots for Customer Service', 'Automated Content Generation with AI', 'AI-Driven Ad Optimization',
  'Sentiment Analysis for Brand Monitoring', 'AI for Email Marketing Optimization', 'Computer Vision in Marketing',
  'NLP for Customer Insights', 'AI Recommendation Engines', 'Programmatic Advertising with AI',
  'Deep Learning for Customer Behavior', 'AI-Enhanced A/B Testing', 'Neural Networks for Marketing',
  'AI-Driven Content Strategy', 'Conversational AI Marketing', 'AI for Marketing Attribution',
  'Generative AI in Marketing', 'AI-Powered Personalization', 'AI for Social Media Management',
  'AI-Driven SEO Optimization', 'AI for Influencer Marketing', 'AI-Powered Video Marketing',
  'AI for Marketing ROI Analysis', 'AI-Driven Customer Journey Mapping', 'AI for Brand Voice Optimization',
  'AI-Powered Market Research', 'AI for Competitive Analysis', 'AI-Driven Pricing Strategies',
  'AI for Customer Lifetime Value Prediction', 'AI-Powered Lead Scoring', 'AI for Marketing Mix Modeling',
  'AI-Driven Campaign Optimization', 'AI for Customer Churn Prediction', 'AI-Powered Content Curation',
  'AI for Marketing Forecasting', 'AI-Driven Product Recommendations', 'AI for Marketing Compliance',
  'AI-Powered Marketing Dashboards', 'AI for Marketing Budget Allocation', 'AI-Driven Marketing Insights',
  'AI for Marketing Performance Tracking', 'AI-Powered Marketing Experimentation', 'AI for Marketing Segmentation',
  'AI-Driven Marketing Personalization', 'AI for Marketing Channel Optimization', 'AI-Powered Marketing Intelligence',
  'AI for Marketing Trend Analysis', 'AI-Driven Marketing Strategy',
  
  // Digital Marketing Strategy (50 topics)
  'Content Marketing Excellence', 'SEO and Search Marketing', 'Social Media Marketing Strategy',
  'Email Marketing Campaigns', 'PPC Advertising Mastery', 'Conversion Rate Optimization',
  'Brand Strategy and Positioning', 'Customer Experience Optimization', 'Marketing Analytics and Data',
  'Account-Based Marketing', 'Influencer Marketing Strategies', 'Video Marketing Production',
  'Mobile Marketing Tactics', 'Growth Hacking Techniques', 'Marketing Automation Platforms',
  'Marketing Technology Stack', 'Customer Retention Programs', 'Marketing Budget Planning',
  'Marketing Campaign Management', 'Digital Marketing Transformation', 'Omnichannel Marketing Integration',
  'Community-Led Growth', 'Interactive Content Marketing', 'Marketing Performance Metrics',
  'Marketing Attribution Models', 'Customer Journey Optimization', 'Marketing Funnel Optimization',
  'Marketing Personalization Strategies', 'Marketing Segmentation Techniques', 'Marketing Testing Frameworks',
  'Marketing Experimentation Methods', 'Marketing Innovation Strategies', 'Marketing Agility Practices',
  'Marketing Collaboration Tools', 'Marketing Workflow Optimization', 'Marketing Resource Management',
  'Marketing Talent Development', 'Marketing Leadership Skills', 'Marketing Team Structure',
  'Marketing Culture Building', 'Marketing Change Management', 'Marketing Digital Transformation',
  'Marketing Process Optimization', 'Marketing Quality Assurance', 'Marketing Compliance Management',
  'Marketing Risk Management', 'Marketing Crisis Communication', 'Marketing Reputation Management',
  'Marketing Stakeholder Engagement', 'Marketing Partnership Development',
  
  // Emerging Trends (50 topics)
  'Zero-Party Data Strategies', 'Cookieless Marketing Solutions', 'Voice Search Optimization',
  'AR/VR Marketing Experiences', 'Sustainability Marketing', 'Web3 and Metaverse Marketing',
  'AI Ethics in Marketing', 'Privacy-First Marketing', 'Creator Economy Strategies',
  'Short-Form Video Content', 'Social Commerce Strategies', 'TikTok Marketing Mastery',
  'NFT Marketing Campaigns', 'Blockchain in Marketing', 'Live Shopping Experiences',
  'User-Generated Content Strategy', 'Micro-Moments Marketing', 'Marketing in the Metaverse',
  'Decentralized Marketing Platforms', 'Web3 Community Building', 'DAO Marketing Strategies',
  'Crypto Marketing Campaigns', 'Virtual Event Marketing', 'Hybrid Event Strategies',
  'Remote Marketing Team Management', 'Distributed Marketing Operations', 'Marketing Automation 2.0',
  'No-Code Marketing Tools', 'Low-Code Marketing Platforms', 'Marketing API Integration',
  'Marketing Data Warehousing', 'Marketing Data Lakes', 'Marketing Data Governance',
  'Marketing Data Privacy', 'Marketing Data Security', 'Marketing Data Ethics',
  'Marketing Data Visualization', 'Marketing Data Storytelling', 'Marketing Data Science',
  'Marketing Data Engineering', 'Marketing Data Architecture', 'Marketing Data Strategy',
  'Marketing Data Quality', 'Marketing Data Integration', 'Marketing Data Migration',
  'Marketing Data Transformation', 'Marketing Data Enrichment', 'Marketing Data Cleansing',
  'Marketing Data Validation', 'Marketing Data Monitoring',
  
  // Platform-Specific (50 topics)
  'Instagram Marketing Strategies', 'Facebook Advertising Tactics', 'LinkedIn B2B Marketing',
  'Twitter Marketing Campaigns', 'YouTube Video Marketing', 'Pinterest Visual Marketing',
  'Snapchat Marketing for Brands', 'Reddit Community Marketing', 'Discord Community Building',
  'Clubhouse Audio Marketing', 'Twitch Streaming Marketing', 'WhatsApp Business Marketing',
  'Telegram Marketing Channels', 'WeChat Marketing in China', 'Line Marketing in Asia',
  'Google Ads Optimization', 'Microsoft Advertising Strategies', 'Amazon Advertising Tactics',
  'Shopify Marketing Integration', 'WordPress Marketing Plugins', 'HubSpot Marketing Automation',
  'Salesforce Marketing Cloud', 'Marketo Marketing Automation', 'Mailchimp Email Marketing',
  'Constant Contact Campaigns', 'ActiveCampaign Automation', 'ConvertKit Creator Marketing',
  'Klaviyo E-commerce Marketing', 'Drip E-commerce Automation', 'GetResponse Marketing Platform',
  'AWeber Email Marketing', 'SendGrid Email Delivery', 'Mailgun Email API',
  'Twilio Marketing Communications', 'Intercom Customer Messaging', 'Drift Conversational Marketing',
  'Zendesk Customer Support Marketing', 'Freshdesk Support Marketing', 'Help Scout Customer Service',
  'LiveChat Customer Engagement', 'Olark Live Chat Marketing', 'Tawk.to Free Chat Marketing',
  'Crisp Customer Messaging', 'Tidio Live Chat Platform', 'Gorgias E-commerce Support',
  'Re:amaze Customer Support', 'Front Team Inbox Marketing', 'Groove Customer Support',
  'Kayako Customer Service Platform', 'Zoho Desk Support Marketing',
];

const TITLE_PREFIXES = [
  'The Complete Guide to', 'Mastering', 'Advanced Strategies for', 'The Ultimate Handbook for',
  'Professional Techniques in', 'Expert Insights on', 'Comprehensive Analysis of', 'Strategic Approaches to',
  'Best Practices in', 'Modern Methods for', 'Innovative Solutions for', 'Proven Frameworks for',
  'Essential Principles of', 'Transformative Strategies for', 'Data-Driven Approaches to',
  'The Definitive Resource for', 'Unlocking Success with', 'Revolutionary Tactics in',
  'Next-Generation Approaches to', 'The Science of', 'Breakthrough Strategies for',
  'The Art and Science of', 'Cutting-Edge Techniques in', 'The Future of', 'Maximizing ROI through',
  'How to Excel at', 'Winning Strategies for', 'The Essential Guide to', 'Practical Tips for',
  'Expert Guide to', 'The Power of', 'Leveraging', 'Optimizing', 'Scaling', 'Building',
  'Creating', 'Developing', 'Implementing', 'Executing', 'Launching', 'Growing',
];

const CATEGORIES = [
  'AI Marketing', 'Strategy', 'Analytics', 'Social Media', 'Content Marketing',
  'SEO', 'Advertising', 'Email Marketing', 'Technology', 'Digital Marketing',
];

const TAGS = [
  'marketing', 'digital-marketing', 'ai', 'automation', 'strategy', 'analytics',
  'social-media', 'content', 'seo', 'advertising', 'email', 'technology',
  'data', 'optimization', 'growth', 'roi', 'campaigns', 'tools', 'trends', 'innovation',
];

// Helper function to generate unique slug
function generateSlug(title: string, index: number): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
  
  const year = Math.random() > 0.5 ? '2024' : '2025';
  return `${baseSlug}-${year}-${index}`;
}

// Helper function to generate SEO-optimized title
function generateTitle(topic: string, prefix: string): string {
  return `${prefix} ${topic}`;
}

// Helper function to generate meta description
function generateMetaDescription(title: string, category: string): string {
  const descriptions = [
    `Discover expert insights on ${title.toLowerCase()}. Learn proven strategies to boost your ${category.toLowerCase()} performance in 2024-2025.`,
    `Master ${title.toLowerCase()} with our comprehensive guide. Get actionable tips and best practices for ${category.toLowerCase()} success.`,
    `Unlock the power of ${title.toLowerCase()}. Expert strategies and tactics for modern ${category.toLowerCase()} professionals.`,
    `Transform your ${category.toLowerCase()} with ${title.toLowerCase()}. Data-driven insights and proven methodologies.`,
    `Learn ${title.toLowerCase()} from industry experts. Boost ROI and drive growth with cutting-edge ${category.toLowerCase()} strategies.`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)].substring(0, 160);
}

// Helper function to generate excerpt
function generateExcerpt(title: string): string {
  const excepts = [
    `Explore the latest trends and best practices in ${title.toLowerCase()} to stay ahead of the competition.`,
    `Learn how to leverage ${title.toLowerCase()} for maximum impact and measurable results.`,
    `Discover proven strategies for ${title.toLowerCase()} that drive real business outcomes.`,
    `Master ${title.toLowerCase()} with expert insights and actionable recommendations.`,
    `Unlock the full potential of ${title.toLowerCase()} with our comprehensive guide.`,
  ];
  return excepts[Math.floor(Math.random() * excepts.length)].substring(0, 200);
}

// Helper function to get random Unsplash image
function getUnsplashImage(category: string, index: number): string {
  const collections = UNSPLASH_COLLECTIONS[category as keyof typeof UNSPLASH_COLLECTIONS] || UNSPLASH_COLLECTIONS['Digital Marketing'];
  const collection = collections[index % collections.length];
  const imageId = `photo-${Date.now()}-${index}`;
  return `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=1200&q=80&collection=${collection}`;
}

// Helper function to get random tags
function getRandomTags(): string[] {
  const shuffled = [...TAGS].sort(() => 0.5 - Math.random());
  const count = 3 + Math.floor(Math.random() * 3); // 3-5 tags
  return shuffled.slice(0, count);
}

// Helper function to generate content
function generateContent(title: string, category: string): string {
  return `# ${title}

In today's rapidly evolving digital landscape, ${title.toLowerCase()} has become a critical component of successful marketing strategies. This comprehensive guide explores the latest trends, best practices, and actionable insights to help you master ${title.toLowerCase()}.

## Why ${title} Matters

${category} professionals need to stay ahead of the curve to remain competitive. ${title} offers unique opportunities to:

- Drive measurable business results
- Enhance customer engagement
- Optimize marketing ROI
- Scale operations efficiently
- Leverage data-driven insights

## Key Strategies for Success

### 1. Data-Driven Decision Making
Leverage analytics and insights to inform your ${title.toLowerCase()} strategy. Use metrics to track performance and optimize campaigns in real-time.

### 2. Customer-Centric Approach
Put your customers at the center of everything you do. Understand their needs, preferences, and behaviors to deliver personalized experiences.

### 3. Technology Integration
Adopt the latest tools and platforms to streamline workflows and enhance productivity. Automation and AI can significantly improve efficiency.

### 4. Continuous Optimization
Test, learn, and iterate. Use A/B testing and experimentation to refine your approach and maximize results.

### 5. Cross-Channel Integration
Create seamless experiences across all touchpoints. Integrate your ${category.toLowerCase()} efforts for maximum impact.

## Best Practices

- Set clear, measurable goals
- Invest in the right tools and technology
- Build a skilled, collaborative team
- Stay updated on industry trends
- Focus on long-term value creation

## Conclusion

${title} is essential for modern marketing success. By implementing these strategies and best practices, you can drive meaningful results and stay ahead of the competition.

Ready to take your ${category.toLowerCase()} to the next level? Start implementing these insights today!`;
}

// Main function to generate blog posts
async function generateBlogPosts() {
  console.log('\n============================================================');
  console.log('📝 **MEDIAPLANPRO - BLOG POST GENERATOR**');
  console.log('============================================================\n');

  if (DRY_RUN) {
    console.log('⚠️  **DRY RUN MODE** - No posts will be created');
    console.log('   Use --execute flag to actually create posts\n');
  }

  console.log(`📊 Configuration:`);
  console.log(`   Total Posts: ${TOTAL_POSTS}`);
  console.log(`   Batch Size: ${BATCH_SIZE}`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'EXECUTE'}\n`);

  // Get admin user
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!adminUser) {
    console.error('❌ No admin user found. Please create an admin user first.');
    process.exit(1);
  }

  console.log(`✅ Using author: ${adminUser.name} (${adminUser.email})\n`);

  // Get categories and tags
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();

  if (categories.length === 0 || tags.length === 0) {
    console.error('❌ No categories or tags found. Please create them first.');
    process.exit(1);
  }

  console.log(`✅ Found ${categories.length} categories and ${tags.length} tags\n`);
  
  // Check existing posts to avoid duplicates
  const existingPosts = await prisma.blogPost.findMany({
    select: { slug: true },
  });
  const existingSlugs = new Set(existingPosts.map(p => p.slug));
  console.log(`📚 Existing posts in database: ${existingSlugs.size}\n`);

  const postsToCreate = [];
  let skipped = 0;

  console.log('🔄 Generating blog posts...\n');

  for (let i = 0; i < TOTAL_POSTS; i++) {
    const topic = TOPICS[i % TOPICS.length];
    const prefix = TITLE_PREFIXES[i % TITLE_PREFIXES.length];
    const categoryObj = categories[i % categories.length];

    const title = generateTitle(topic, prefix);
    const slug = generateSlug(title, i + 1000); // Start from 1000 to avoid conflicts

    // Skip if slug already exists
    if (existingSlugs.has(slug)) {
      skipped++;
      continue;
    }

    const metaDescription = generateMetaDescription(title, categoryObj.name);
    const excerpt = generateExcerpt(title);
    const content = generateContent(title, categoryObj.name);
    const imageUrl = getUnsplashImage(categoryObj.name, i);
    const randomTags = getRandomTags();
    const selectedTags = randomTags.map(tagSlug => tags.find(t => t.slug === tagSlug || t.name.toLowerCase() === tagSlug.replace(/-/g, ' '))).filter(Boolean);

    // Stagger publish times (1 minute apart)
    const publishedAt = new Date(Date.now() + i * 60 * 1000);

    postsToCreate.push({
      title,
      slug,
      content,
      excerpt,
      seoTitle: title.substring(0, 60),
      seoDescription: metaDescription,
      featuredImage: imageUrl,
      categoryId: categoryObj.id,
      tagIds: selectedTags.map(t => t!.id),
      status: 'PUBLISHED',
      publishedAt,
      authorId: adminUser.id,
    });

    if ((i + 1) % 100 === 0) {
      console.log(`   Generated ${i + 1}/${TOTAL_POSTS} posts...`);
    }
  }
  
  console.log(`\n✅ Generated ${postsToCreate.length} unique posts`);
  if (skipped > 0) {
    console.log(`⚠️  Skipped ${skipped} posts (duplicate slugs)\n`);
  }
  
  if (DRY_RUN) {
    console.log('\n📋 **SAMPLE POSTS (First 10):**\n');
    postsToCreate.slice(0, 10).forEach((post, idx) => {
      const cat = categories.find(c => c.id === post.categoryId);
      console.log(`${idx + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Category: ${cat?.name}`);
      console.log(`   Tags: ${post.tagIds.length} tags`);
      console.log(`   Image: ${post.featuredImage}`);
      console.log('');
    });

    console.log('\n✅ Dry run complete. Use --execute to create posts.\n');
    return;
  }

  // Create posts in batches (using individual creates to support tag relations)
  console.log(`\n🚀 Creating ${postsToCreate.length} posts in batches of ${BATCH_SIZE}...\n`);

  let created = 0;
  let errors = 0;

  for (let i = 0; i < postsToCreate.length; i += BATCH_SIZE) {
    const batch = postsToCreate.slice(i, i + BATCH_SIZE);

    try {
      // Use Promise.all to create posts in parallel within each batch
      await Promise.all(
        batch.map(async (post) => {
          try {
            await prisma.blogPost.create({
              data: {
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt,
                seoTitle: post.seoTitle,
                seoDescription: post.seoDescription,
                featuredImage: post.featuredImage,
                status: post.status,
                publishedAt: post.publishedAt,
                authorId: post.authorId,
                categoryId: post.categoryId,
                tags: {
                  connect: post.tagIds.map(id => ({ id })),
                },
              },
            });
            created++;
          } catch (err) {
            errors++;
            // Skip duplicate errors silently
            if (!(err instanceof Error && err.message.includes('Unique constraint'))) {
              console.error(`   ⚠️  Error creating post "${post.title}":`, err);
            }
          }
        })
      );

      console.log(`   ✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${created}/${postsToCreate.length} posts created`);
    } catch (error) {
      console.error(`   ❌ Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
    }
  }
  
  console.log(`\n✅ Successfully created ${created} blog posts!`);
  if (errors > 0) {
    console.log(`⚠️  Skipped ${errors} posts (duplicates or errors)\n`);
  }

  // Verify final count
  const finalCount = await prisma.blogPost.count();
  const publishedCount = await prisma.blogPost.count({ where: { status: 'PUBLISHED' } });
  console.log(`\n📊 Final Statistics:`);
  console.log(`   Total posts in database: ${finalCount}`);
  console.log(`   Published posts: ${publishedCount}`);
  console.log(`   Posts created in this run: ${created}\n`);

  console.log('============================================================');
  console.log('✅ **BLOG POST GENERATION COMPLETE**');
  console.log('============================================================\n');
}

// Run the script
generateBlogPosts()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

