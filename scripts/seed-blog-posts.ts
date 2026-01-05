import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Blog post topics and variations
const topics = [
  { title: 'Marketing Strategy', category: 0, tags: [0, 1, 2] },
  { title: 'Content Marketing', category: 1, tags: [1, 3, 4] },
  { title: 'Digital Marketing', category: 2, tags: [2, 5, 6] },
  { title: 'AI Marketing', category: 3, tags: [7, 8, 9] },
  { title: 'SEO Optimization', category: 2, tags: [0, 2, 5] },
  { title: 'Social Media Marketing', category: 2, tags: [1, 6, 8] },
  { title: 'Email Marketing', category: 1, tags: [2, 4, 7] },
  { title: 'Marketing Automation', category: 3, tags: [7, 8, 9] },
  { title: 'Brand Strategy', category: 0, tags: [0, 3, 8] },
  { title: 'Customer Experience', category: 0, tags: [1, 4, 9] },
];

const titlePrefixes = [
  'The Ultimate Guide to',
  'How to Master',
  'Best Practices for',
  'Complete Guide to',
  'Advanced Strategies for',
  'Beginner\'s Guide to',
  'Expert Tips for',
  'Proven Techniques for',
  'Essential Guide to',
  'Modern Approach to',
];

const validUnsplashImages = [
  'photo-1460925895917-afdab827c52f', // Marketing analytics
  'photo-1553877522-43269d4ea984', // Business meeting
  'photo-1432888622747-4eb9a8f2c293', // Laptop work
  'photo-1504868584819-f8e8b4b6d7e3', // Office workspace
  'photo-1551288049-bebda4e38f71', // Data charts
];

function generateContent(title: string, keyword: string): string {
  const currentYear = new Date().getFullYear();
  
  return `
<h2>Introduction to ${title}</h2>

<p>In today's rapidly evolving digital landscape, understanding ${keyword.toLowerCase()} has become more critical than ever. This comprehensive guide will walk you through everything you need to know to succeed in ${currentYear} and beyond.</p>

<h2>Why ${title} Matters</h2>

<p>${title} is not just a buzzword—it's a fundamental aspect of modern business success. Companies that master ${keyword.toLowerCase()} see significant improvements in their bottom line, customer engagement, and market position.</p>

<h3>Key Benefits</h3>

<ul>
  <li><strong>Increased ROI:</strong> Proper implementation can lead to 200-300% improvement in marketing ROI</li>
  <li><strong>Better Customer Engagement:</strong> Connect with your audience on a deeper level</li>
  <li><strong>Competitive Advantage:</strong> Stay ahead of competitors who haven't adopted these strategies</li>
  <li><strong>Scalable Growth:</strong> Build systems that grow with your business</li>
</ul>

<h2>Getting Started with ${title}</h2>

<p>The journey to mastering ${keyword.toLowerCase()} begins with understanding the fundamentals. Here's a step-by-step approach:</p>

<h3>Step 1: Research and Planning</h3>

<p>Before diving into implementation, take time to understand your market, audience, and objectives. Conduct thorough research to identify opportunities and challenges specific to your industry.</p>

<h3>Step 2: Strategy Development</h3>

<p>Develop a comprehensive strategy that aligns with your business goals. This should include clear objectives, target metrics, and a realistic timeline for implementation.</p>

<h3>Step 3: Implementation</h3>

<p>Execute your strategy with precision. Start with small, manageable initiatives and scale up as you gain confidence and see results.</p>

<h3>Step 4: Measurement and Optimization</h3>

<p>Continuously monitor your results and optimize based on data. Use analytics tools to track key performance indicators and make data-driven decisions.</p>

<h2>Best Practices for ${currentYear}</h2>

<p>As we navigate ${currentYear}, several best practices have emerged as critical for success:</p>

<ol>
  <li><strong>Data-Driven Decision Making:</strong> Let data guide your strategy, not assumptions</li>
  <li><strong>Customer-Centric Approach:</strong> Always prioritize customer needs and preferences</li>
  <li><strong>Agile Methodology:</strong> Be prepared to pivot quickly based on market changes</li>
  <li><strong>Technology Integration:</strong> Leverage modern tools and platforms for efficiency</li>
  <li><strong>Continuous Learning:</strong> Stay updated with industry trends and innovations</li>
</ol>

<h2>Common Challenges and Solutions</h2>

<p>Every journey has its obstacles. Here are common challenges you might face and how to overcome them:</p>

<h3>Challenge 1: Limited Resources</h3>

<p><strong>Solution:</strong> Focus on high-impact activities first. Use automation tools to maximize efficiency and consider outsourcing non-core activities.</p>

<h3>Challenge 2: Measuring ROI</h3>

<p><strong>Solution:</strong> Implement robust tracking systems from day one. Use attribution modeling to understand which efforts drive the most value.</p>

<h3>Challenge 3: Keeping Up with Changes</h3>

<p><strong>Solution:</strong> Dedicate time for continuous learning. Follow industry leaders, attend webinars, and participate in professional communities.</p>

<h2>Advanced Strategies</h2>

<p>Once you've mastered the basics, consider these advanced strategies to take your ${keyword.toLowerCase()} to the next level:</p>

<ul>
  <li>Implement AI and machine learning for predictive analytics</li>
  <li>Develop personalization strategies at scale</li>
  <li>Create omnichannel experiences that seamlessly integrate all touchpoints</li>
  <li>Build strategic partnerships to expand your reach</li>
  <li>Invest in long-term brand building alongside short-term tactics</li>
</ul>

<h2>Tools and Resources</h2>

<p>Success in ${keyword.toLowerCase()} often depends on having the right tools. Consider investing in:</p>

<ul>
  <li>Analytics and reporting platforms</li>
  <li>Marketing automation software</li>
  <li>Customer relationship management (CRM) systems</li>
  <li>Content management systems (CMS)</li>
  <li>Collaboration and project management tools</li>
</ul>

<h2>Case Studies and Success Stories</h2>

<p>Learning from others' successes can provide valuable insights. Many companies have achieved remarkable results by implementing effective ${keyword.toLowerCase()} strategies.</p>

<p>For example, companies that invested in comprehensive ${keyword.toLowerCase()} programs saw an average increase of 45% in customer engagement and a 30% improvement in conversion rates within the first year.</p>

<h2>Future Trends</h2>

<p>Looking ahead, several trends are shaping the future of ${keyword.toLowerCase()}:</p>

<ul>
  <li>Increased use of artificial intelligence and automation</li>
  <li>Greater emphasis on privacy and data protection</li>
  <li>Rise of voice search and conversational interfaces</li>
  <li>Growing importance of video content</li>
  <li>Shift towards sustainable and ethical marketing practices</li>
</ul>

<h2>Conclusion</h2>

<p>Mastering ${keyword.toLowerCase()} is a journey, not a destination. By following the strategies outlined in this guide, staying committed to continuous improvement, and remaining adaptable to change, you'll be well-positioned for success.</p>

<p>Remember: the key to success is taking action. Start implementing these strategies today, measure your results, and continuously optimize your approach.</p>

<div class="cta-box">
  <h3>Ready to Get Started?</h3>
  <p>Take the first step towards mastering ${keyword.toLowerCase()} today. Start with one strategy from this guide and build from there.</p>
</div>

<p><em>This article was last updated in ${currentYear} to reflect the latest trends and best practices in ${keyword.toLowerCase()}.</em></p>
`;
}

async function main() {
  console.log('🌱 Seeding blog posts...\n');

  // Get existing data
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@mediaplanpro.com' },
  });

  if (!admin) {
    throw new Error('Admin user not found. Please run the production seed first.');
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  if (categories.length === 0 || tags.length === 0) {
    throw new Error('Categories or tags not found. Please run the production seed first.');
  }

  console.log(`📊 Found ${categories.length} categories and ${tags.length} tags`);
  console.log(`✍️  Author: ${admin.name} (${admin.email})\n`);

  // Determine number of posts to create
  const postsToCreate = parseInt(process.env.NUM_POSTS || '100', 10);
  console.log(`📝 Creating ${postsToCreate} blog posts...\n`);

  const batchSize = 50;
  let totalCreated = 0;

  for (let batch = 0; batch < Math.ceil(postsToCreate / batchSize); batch++) {
    const currentBatchSize = Math.min(batchSize, postsToCreate - totalCreated);
    
    for (let i = 0; i < currentBatchSize; i++) {
      const postIndex = batch * batchSize + i;
      const topic = topics[postIndex % topics.length];
      const prefix = titlePrefixes[postIndex % titlePrefixes.length];
      const imageId = validUnsplashImages[postIndex % validUnsplashImages.length];

      const title = `${prefix} ${topic.title} in ${2024 + Math.floor(postIndex / 100)}`;
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 80) + `-${postIndex}-${Date.now()}`;

      // Spread posts over time
      const daysAgo = Math.floor(postIndex / 5); // ~5 posts per day
      const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      const keyword = topic.title.toLowerCase();
      const excerpt = `Learn ${keyword} with our comprehensive ${new Date().getFullYear()} guide. Get expert strategies, actionable tips, and proven techniques for success.`;
      const content = generateContent(title, keyword);

      try {
        await prisma.blogPost.create({
          data: {
            title,
            slug,
            excerpt: excerpt.substring(0, 160),
            content,
            featuredImage: `https://images.unsplash.com/${imageId}?w=1200&h=630&fit=crop`,
            categoryId: categories[topic.category % categories.length].id,
            authorId: admin.id,
            status: 'PUBLISHED',
            publishedAt,
            seoTitle: `${title} | MediaPlanPro`,
            seoDescription: excerpt.substring(0, 160),
            tags: {
              connect: topic.tags.map(idx => ({ id: tags[idx % tags.length].id })),
            },
          },
        });

        totalCreated++;
      } catch (error) {
        console.error(`❌ Error creating post ${postIndex}:`, error);
      }
    }

    const progress = ((totalCreated / postsToCreate) * 100).toFixed(1);
    console.log(`✅ Created batch ${batch + 1} (${totalCreated}/${postsToCreate} posts) - ${progress}% complete`);
  }

  console.log(`\n🎉 Successfully created ${totalCreated} blog posts!`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Total Posts: ${totalCreated}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Tags: ${tags.length}`);
  console.log(`   - Author: ${admin.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

