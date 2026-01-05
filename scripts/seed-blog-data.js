const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedBlogData() {
  try {
    console.log('🌱 Seeding blog data...');

    // Create admin user if not exists
    let adminUser = await prisma.user.findUnique({
      where: { email: 'admin@mediaplanpro.com' }
    });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@mediaplanpro.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('✅ Created admin user');
    }

    // Create editor user if not exists
    let editorUser = await prisma.user.findUnique({
      where: { email: 'editor@mediaplanpro.com' }
    });

    if (!editorUser) {
      const hashedPassword = await bcrypt.hash('editor123', 10);
      editorUser = await prisma.user.create({
        data: {
          email: 'editor@mediaplanpro.com',
          name: 'Editor User',
          password: hashedPassword,
          role: 'EDITOR',
        },
      });
      console.log('✅ Created editor user');
    }

    // Create categories
    const categories = [
      {
        name: 'Marketing Strategy',
        slug: 'marketing-strategy',
        description: 'Insights and tips for developing effective marketing strategies',
        color: '#3B82F6',
      },
      {
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Latest trends and best practices in digital marketing',
        color: '#10B981',
      },
      {
        name: 'Content Marketing',
        slug: 'content-marketing',
        description: 'Creating and distributing valuable content to attract customers',
        color: '#F59E0B',
      },
      {
        name: 'Social Media',
        slug: 'social-media',
        description: 'Social media marketing strategies and platform updates',
        color: '#EF4444',
      },
      {
        name: 'Analytics & Data',
        slug: 'analytics-data',
        description: 'Data-driven marketing insights and analytics tools',
        color: '#8B5CF6',
      },
    ];

    for (const categoryData of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      });

      if (!existingCategory) {
        await prisma.category.create({ data: categoryData });
        console.log(`✅ Created category: ${categoryData.name}`);
      }
    }

    // Create tags
    const tags = [
      { name: 'SEO', slug: 'seo' },
      { name: 'PPC', slug: 'ppc' },
      { name: 'Email Marketing', slug: 'email-marketing' },
      { name: 'Social Media', slug: 'social-media' },
      { name: 'Content Strategy', slug: 'content-strategy' },
      { name: 'Brand Building', slug: 'brand-building' },
      { name: 'Lead Generation', slug: 'lead-generation' },
      { name: 'Conversion Optimization', slug: 'conversion-optimization' },
      { name: 'Marketing Automation', slug: 'marketing-automation' },
      { name: 'Customer Retention', slug: 'customer-retention' },
      { name: 'Influencer Marketing', slug: 'influencer-marketing' },
      { name: 'Video Marketing', slug: 'video-marketing' },
    ];

    for (const tagData of tags) {
      const existingTag = await prisma.tag.findUnique({
        where: { slug: tagData.slug }
      });

      if (!existingTag) {
        await prisma.tag.create({ data: tagData });
        console.log(`✅ Created tag: ${tagData.name}`);
      }
    }

    // Get created categories and tags for blog posts
    const createdCategories = await prisma.category.findMany();
    const createdTags = await prisma.tag.findMany();

    // Create sample blog posts
    const blogPosts = [
      {
        title: '10 Essential Marketing Strategies for 2024',
        slug: '10-essential-marketing-strategies-2024',
        content: `<h2>Introduction</h2>
<p>As we move into 2024, the marketing landscape continues to evolve at a rapid pace. Digital transformation, changing consumer behaviors, and emerging technologies are reshaping how businesses connect with their audiences.</p>

<h2>1. AI-Powered Personalization</h2>
<p>Artificial intelligence is revolutionizing how we personalize customer experiences. From chatbots to recommendation engines, AI helps deliver the right message to the right person at the right time.</p>

<h2>2. Video-First Content Strategy</h2>
<p>Video content continues to dominate social media platforms and search results. Short-form videos, live streaming, and interactive video content are becoming essential for engagement.</p>

<h2>3. Voice Search Optimization</h2>
<p>With the rise of smart speakers and voice assistants, optimizing for voice search is crucial for maintaining visibility in search results.</p>

<h2>Conclusion</h2>
<p>These strategies will help businesses stay competitive and connect with their audiences more effectively in 2024 and beyond.</p>`,
        excerpt: 'Discover the top 10 marketing strategies that will drive success in 2024, from AI-powered personalization to voice search optimization.',
        categoryId: createdCategories.find(c => c.slug === 'marketing-strategy')?.id,
        authorId: adminUser.id,
        status: 'PUBLISHED',
        seoTitle: '10 Essential Marketing Strategies for 2024 | MediaPlanPro',
        seoDescription: 'Discover the top marketing strategies for 2024 including AI personalization, video content, and voice search optimization.',
        publishedAt: new Date('2024-01-15'),
        tagIds: [
          createdTags.find(t => t.slug === 'content-strategy')?.id,
          createdTags.find(t => t.slug === 'seo')?.id,
          createdTags.find(t => t.slug === 'video-marketing')?.id,
        ].filter(Boolean),
      },
      {
        title: 'The Complete Guide to Content Marketing ROI',
        slug: 'complete-guide-content-marketing-roi',
        content: `<h2>Understanding Content Marketing ROI</h2>
<p>Measuring the return on investment (ROI) of content marketing can be challenging, but it's essential for proving the value of your content efforts and optimizing your strategy.</p>

<h2>Key Metrics to Track</h2>
<ul>
<li>Website traffic and organic search rankings</li>
<li>Lead generation and conversion rates</li>
<li>Social media engagement and shares</li>
<li>Brand awareness and sentiment</li>
<li>Customer lifetime value</li>
</ul>

<h2>Tools for Measuring ROI</h2>
<p>Google Analytics, HubSpot, and other marketing automation platforms provide valuable insights into content performance and attribution.</p>`,
        excerpt: 'Learn how to measure and improve your content marketing ROI with proven metrics, tools, and strategies.',
        categoryId: createdCategories.find(c => c.slug === 'content-marketing')?.id,
        authorId: editorUser.id,
        status: 'PUBLISHED',
        seoTitle: 'Content Marketing ROI Guide | Measure & Improve Results',
        seoDescription: 'Complete guide to measuring content marketing ROI with key metrics, tools, and optimization strategies.',
        publishedAt: new Date('2024-01-10'),
        tagIds: [
          createdTags.find(t => t.slug === 'content-strategy')?.id,
          createdTags.find(t => t.slug === 'analytics-data')?.id,
          createdTags.find(t => t.slug === 'conversion-optimization')?.id,
        ].filter(Boolean),
      },
      {
        title: 'Social Media Trends to Watch in 2024',
        slug: 'social-media-trends-2024',
        content: `<h2>The Evolution of Social Media</h2>
<p>Social media platforms are constantly evolving, introducing new features and changing algorithms. Staying ahead of trends is crucial for maintaining engagement and reach.</p>

<h2>Top Trends for 2024</h2>
<h3>1. Short-Form Video Dominance</h3>
<p>Platforms like TikTok, Instagram Reels, and YouTube Shorts continue to drive engagement with bite-sized content.</p>

<h3>2. Social Commerce Growth</h3>
<p>Shopping directly through social media platforms is becoming more seamless and popular among consumers.</p>

<h3>3. Authentic Storytelling</h3>
<p>Brands that share genuine, behind-the-scenes content are building stronger connections with their audiences.</p>`,
        excerpt: 'Stay ahead of the curve with the latest social media trends that will shape marketing strategies in 2024.',
        categoryId: createdCategories.find(c => c.slug === 'social-media')?.id,
        authorId: adminUser.id,
        status: 'PUBLISHED',
        seoTitle: 'Social Media Trends 2024 | Latest Platform Updates & Strategies',
        seoDescription: 'Discover the top social media trends for 2024 including short-form video, social commerce, and authentic storytelling.',
        publishedAt: new Date('2024-01-05'),
        tagIds: [
          createdTags.find(t => t.slug === 'social-media')?.id,
          createdTags.find(t => t.slug === 'video-marketing')?.id,
          createdTags.find(t => t.slug === 'influencer-marketing')?.id,
        ].filter(Boolean),
      },
      {
        title: 'Email Marketing Best Practices for Higher Engagement',
        slug: 'email-marketing-best-practices-engagement',
        content: `<h2>The Power of Email Marketing</h2>
<p>Despite the rise of social media and other digital channels, email marketing remains one of the most effective ways to reach and engage customers.</p>

<h2>Best Practices for Success</h2>
<h3>Segmentation and Personalization</h3>
<p>Divide your email list into segments based on demographics, behavior, and preferences to deliver more relevant content.</p>

<h3>Mobile Optimization</h3>
<p>With over 60% of emails opened on mobile devices, ensuring your emails look great on all screen sizes is essential.</p>

<h3>A/B Testing</h3>
<p>Test different subject lines, content, and send times to optimize your email performance.</p>`,
        excerpt: 'Boost your email marketing results with proven best practices for segmentation, personalization, and optimization.',
        categoryId: createdCategories.find(c => c.slug === 'digital-marketing')?.id,
        authorId: editorUser.id,
        status: 'DRAFT',
        seoTitle: 'Email Marketing Best Practices | Increase Engagement & ROI',
        seoDescription: 'Learn email marketing best practices for higher engagement including segmentation, personalization, and mobile optimization.',
        tagIds: [
          createdTags.find(t => t.slug === 'email-marketing')?.id,
          createdTags.find(t => t.slug === 'marketing-automation')?.id,
          createdTags.find(t => t.slug === 'conversion-optimization')?.id,
        ].filter(Boolean),
      },
    ];

    for (const postData of blogPosts) {
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: postData.slug }
      });

      if (!existingPost) {
        const { tagIds, ...postDataWithoutTags } = postData;
        
        const post = await prisma.blogPost.create({
          data: {
            ...postDataWithoutTags,
            tags: {
              connect: tagIds.map(id => ({ id }))
            }
          },
        });
        
        console.log(`✅ Created blog post: ${postData.title}`);
      }
    }

    console.log('🎉 Blog data seeding completed successfully!');
    console.log('\n📝 Sample blog posts created:');
    console.log('- 10 Essential Marketing Strategies for 2024 (Published)');
    console.log('- The Complete Guide to Content Marketing ROI (Published)');
    console.log('- Social Media Trends to Watch in 2024 (Published)');
    console.log('- Email Marketing Best Practices for Higher Engagement (Draft)');
    console.log('\n👥 Users created:');
    console.log('- admin@mediaplanpro.com (password: admin123)');
    console.log('- editor@mediaplanpro.com (password: editor123)');

  } catch (error) {
    console.error('❌ Error seeding blog data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedBlogData()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedBlogData };
