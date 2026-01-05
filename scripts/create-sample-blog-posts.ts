/**
 * Script to create sample blog posts for testing dark mode
 * 
 * Run with: npx tsx scripts/create-sample-blog-posts.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creating sample blog posts...\n');

  // Get or create admin user
  let adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    console.log('Creating admin user...');
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@mediaplanpro.com',
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: new Date(),
      }
    });
    console.log('✅ Admin user created\n');
  }

  // Get or create category
  let category = await prisma.category.findFirst({
    where: { slug: 'ai-marketing' }
  });

  if (!category) {
    console.log('Creating category...');
    category = await prisma.category.create({
      data: {
        name: 'AI Marketing',
        slug: 'ai-marketing',
        description: 'Insights on AI-powered marketing strategies'
      }
    });
    console.log('✅ Category created\n');
  }

  // Get or create tags
  const tagData = [
    { name: 'AI', slug: 'ai' },
    { name: 'Marketing Strategy', slug: 'marketing-strategy' },
    { name: 'Digital Marketing', slug: 'digital-marketing' },
    { name: 'Content Marketing', slug: 'content-marketing' },
  ];

  const tags = [];
  for (const tagInfo of tagData) {
    let tag = await prisma.tag.findFirst({
      where: { slug: tagInfo.slug }
    });

    if (!tag) {
      tag = await prisma.tag.create({
        data: tagInfo
      });
    }
    tags.push(tag);
  }
  console.log('✅ Tags ready\n');

  // Blog Post 1: Comprehensive content with all elements
  const post1Content = `
# The Future of AI-Powered Marketing

Artificial Intelligence is revolutionizing the marketing landscape. In this comprehensive guide, we'll explore how AI is transforming marketing strategies and what it means for businesses.

## Understanding AI in Marketing

AI marketing refers to the use of artificial intelligence technologies to make automated decisions based on data collection, data analysis, and additional observations of audience or economic trends that may impact marketing efforts.

### Key Benefits of AI Marketing

- **Personalization at Scale**: AI enables marketers to deliver personalized experiences to millions of customers simultaneously.
- **Predictive Analytics**: Forecast customer behavior and market trends with unprecedented accuracy.
- **Automation**: Automate repetitive tasks and focus on strategic initiatives.
- **Real-time Optimization**: Continuously improve campaigns based on real-time data.

## AI Marketing Technologies

### 1. Machine Learning

Machine learning algorithms analyze vast amounts of data to identify patterns and make predictions. This technology powers:

- Customer segmentation
- Churn prediction
- Product recommendations
- Dynamic pricing

### 2. Natural Language Processing (NLP)

NLP enables machines to understand and generate human language. Applications include:

- Chatbots and virtual assistants
- Sentiment analysis
- Content generation
- Voice search optimization

### 3. Computer Vision

Computer vision allows AI to interpret visual information:

- Image recognition for social media monitoring
- Visual search capabilities
- Automated content moderation
- AR/VR experiences

## Implementation Strategy

> "The key to successful AI implementation is starting small, measuring results, and scaling what works." - Marketing AI Expert

Here's a step-by-step approach:

1. **Assess Your Needs**: Identify areas where AI can have the most impact
2. **Start with Pilot Projects**: Test AI solutions on a small scale
3. **Measure and Optimize**: Track KPIs and refine your approach
4. **Scale Gradually**: Expand successful initiatives across your organization

## Code Example: Simple AI Integration

\`\`\`javascript
// Example: AI-powered content recommendation
async function getRecommendations(userId) {
  const userProfile = await fetchUserProfile(userId);
  const recommendations = await aiModel.predict({
    user: userProfile,
    context: 'content_recommendation'
  });
  return recommendations;
}
\`\`\`

## Challenges and Considerations

While AI offers tremendous opportunities, there are challenges to consider:

- **Data Privacy**: Ensure compliance with GDPR, CCPA, and other regulations
- **Bias in AI**: Be aware of potential biases in training data
- **Integration Complexity**: Integrating AI with existing systems can be complex
- **Skill Gap**: Finding talent with AI expertise can be challenging

## The Road Ahead

The future of marketing is undoubtedly AI-powered. As technology continues to evolve, we can expect:

- More sophisticated personalization
- Better predictive capabilities
- Seamless omnichannel experiences
- Ethical AI practices becoming standard

---

**Ready to embrace AI in your marketing strategy?** Start with MediaPlanPro's AI-powered strategy builder and see the difference intelligent automation can make.
`;

  console.log('Creating blog post 1...');
  const blogPost1 = await prisma.blogPost.create({
    data: {
      title: 'The Future of AI-Powered Marketing: A Comprehensive Guide',
      slug: 'future-of-ai-powered-marketing',
      excerpt: 'Discover how artificial intelligence is revolutionizing marketing strategies and learn how to implement AI in your marketing efforts for better results.',
      content: post1Content,
      featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: category.id,
      seoTitle: 'AI-Powered Marketing Guide 2025 | MediaPlanPro',
      seoDescription: 'Complete guide to AI in marketing. Learn about machine learning, NLP, and computer vision applications in modern marketing strategies.',
      tags: {
        connect: [
          { id: tags[0].id }, // AI
          { id: tags[1].id }, // Marketing Strategy
        ]
      }
    }
  });
  console.log('✅ Blog post 1 created\n');

  // Blog Post 2: Different content types
  const post2Content = `
# 10 Digital Marketing Trends You Can't Ignore in 2025

The digital marketing landscape is constantly evolving. Here are the top trends shaping the industry this year.

## 1. Voice Search Optimization

With the rise of smart speakers and voice assistants, optimizing for voice search is no longer optional.

**Key Statistics:**
- 50% of all searches will be voice searches by 2025
- Voice commerce is expected to reach $40 billion

## 2. Interactive Content

Static content is out. Interactive experiences are in:

- Quizzes and assessments
- Calculators and tools
- Interactive infographics
- Augmented reality experiences

## 3. Video Marketing Dominance

Video continues to dominate:

> "Video is the future of content marketing. That is, if it's not the here and now." - Chris Trimble

### Video Statistics:
- 86% of businesses use video as a marketing tool
- Video marketers get 66% more qualified leads per year
- Social video generates 1200% more shares than text and images combined

## 4. Personalization at Scale

Customers expect personalized experiences:

1. Use AI for dynamic content
2. Implement behavioral targeting
3. Create personalized email campaigns
4. Develop custom landing pages

## 5. Privacy-First Marketing

With increasing privacy regulations:

- **First-party data** is king
- **Consent management** is critical
- **Transparent practices** build trust

## 6. Social Commerce

Shopping directly on social platforms:

| Platform | Features |
|----------|----------|
| Instagram | Shopping tags, Checkout |
| Facebook | Shops, Marketplace |
| TikTok | Shopping ads, Live shopping |
| Pinterest | Product pins, Shopping ads |

## 7. Sustainability Marketing

Consumers care about sustainability:

- 73% of millennials are willing to pay more for sustainable products
- Brands must demonstrate genuine commitment
- Greenwashing will be called out

## 8. Micro-Moments

Capture attention in micro-moments:

- **I-want-to-know** moments
- **I-want-to-go** moments
- **I-want-to-buy** moments
- **I-want-to-do** moments

## 9. Influencer Marketing Evolution

Influencer marketing is maturing:

- Shift from mega to micro-influencers
- Focus on authenticity and engagement
- Long-term partnerships over one-off campaigns

## 10. AI-Powered Analytics

Advanced analytics for better insights:

\`\`\`python
# Example: Predictive analytics
def predict_customer_lifetime_value(customer_data):
    model = load_trained_model('clv_model')
    prediction = model.predict(customer_data)
    return prediction
\`\`\`

---

## Conclusion

Staying ahead of these trends will help you maintain a competitive edge in 2025. The key is to:

- **Stay informed** about emerging technologies
- **Test and iterate** new strategies
- **Focus on customer value** above all else
- **Measure and optimize** continuously

**Ready to implement these trends?** MediaPlanPro can help you create data-driven marketing strategies that incorporate the latest trends and best practices.
`;

  console.log('Creating blog post 2...');
  const blogPost2 = await prisma.blogPost.create({
    data: {
      title: '10 Digital Marketing Trends You Can\'t Ignore in 2025',
      slug: '10-digital-marketing-trends-2025',
      excerpt: 'Stay ahead of the curve with these essential digital marketing trends for 2025. From voice search to AI analytics, discover what\'s shaping the future.',
      content: post2Content,
      featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 86400000), // 1 day ago
      authorId: adminUser.id,
      categoryId: category.id,
      seoTitle: 'Top 10 Digital Marketing Trends 2025 | MediaPlanPro',
      seoDescription: 'Discover the top digital marketing trends for 2025 including voice search, interactive content, video marketing, and AI-powered analytics.',
      tags: {
        connect: [
          { id: tags[2].id }, // Digital Marketing
          { id: tags[3].id }, // Content Marketing
        ]
      }
    }
  });
  console.log('✅ Blog post 2 created\n');

  console.log('🎉 Sample blog posts created successfully!\n');
  console.log('📝 Created posts:');
  console.log(`   1. ${blogPost1.title}`);
  console.log(`   2. ${blogPost2.title}\n`);
  console.log('🌐 View them at:');
  console.log(`   - http://localhost:3000/blog`);
  console.log(`   - http://localhost:3000/blog/${blogPost1.slug}`);
  console.log(`   - http://localhost:3000/blog/${blogPost2.slug}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

