import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mediaplanpro.com' },
    update: {},
    create: {
      email: 'admin@mediaplanpro.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12);
  const editor = await prisma.user.upsert({
    where: { email: 'editor@mediaplanpro.com' },
    update: {},
    create: {
      email: 'editor@mediaplanpro.com',
      name: 'Editor User',
      password: editorPassword,
      role: 'EDITOR',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@mediaplanpro.com' },
    update: {},
    create: {
      email: 'user@mediaplanpro.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create blog categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'marketing-strategy' },
      update: {},
      create: {
        name: 'Marketing Strategy',
        slug: 'marketing-strategy',
        description: 'Comprehensive guides on marketing strategy development',
        color: '#3B82F6',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'digital-marketing' },
      update: {},
      create: {
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Latest trends and tactics in digital marketing',
        color: '#10B981',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'content-marketing' },
      update: {},
      create: {
        name: 'Content Marketing',
        slug: 'content-marketing',
        description: 'Content creation and distribution strategies',
        color: '#F59E0B',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'ai-marketing' },
      update: {},
      create: {
        name: 'AI Marketing',
        slug: 'ai-marketing',
        description: 'How AI is transforming marketing practices',
        color: '#8B5CF6',
      },
    }),
  ]);

  // Create blog tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'strategy' },
      update: {},
      create: { name: 'Strategy', slug: 'strategy' },
    }),
    prisma.tag.upsert({
      where: { slug: 'seo' },
      update: {},
      create: { name: 'SEO', slug: 'seo' },
    }),
    prisma.tag.upsert({
      where: { slug: 'social-media' },
      update: {},
      create: { name: 'Social Media', slug: 'social-media' },
    }),
    prisma.tag.upsert({
      where: { slug: 'analytics' },
      update: {},
      create: { name: 'Analytics', slug: 'analytics' },
    }),
    prisma.tag.upsert({
      where: { slug: 'automation' },
      update: {},
      create: { name: 'Automation', slug: 'automation' },
    }),
  ]);

  // Valid Unsplash image IDs for marketing/business content
  const validUnsplashImages = [
    'photo-1460925895917-afdab827c52f', // Analytics dashboard
    'photo-1551288049-bebda4e38f71', // Data charts
    'photo-1504868584819-f8e8b4b6d7e3', // Group meeting
    'photo-1552664730-d307ca884978', // Team collaboration
    'photo-1557804506-669a67965ba0', // Office workspace
    'photo-1553877522-43269d4ea984', // Business meeting
    'photo-1542744173-8e7e53415bb0', // Business presentation
    'photo-1556761175-b413da4baf72', // Team discussion
    'photo-1556761175-5973dc0f32e7', // Startup office
    'photo-1559136555-9303baea8ebd', // Marketing strategy
    'photo-1552581234-26160f608093', // Social media marketing
    'photo-1533750516457-a7f992034fec', // Content creation
    'photo-1557426272-fc759fdf7a8d', // Laptop workspace
    'photo-1522071820081-009f0129c71c', // Team brainstorming
    'photo-1517245386807-bb43f82c33c4', // Business conference
    'photo-1531482615713-2afd69097998', // Marketing analytics
    'photo-1551434678-e076c223a692', // Business growth
    'photo-1553484771-371a605b060b', // Digital marketing
    'photo-1542744094-3a31f272c490', // Business strategy
    'photo-1563986768609-322da13575f3', // Marketing campaign
  ];

  // Expanded topic categories for 12,000 posts (20+ niches)
  const expandedTopics = [
    // Trending Topics (40% - AI & Emerging Tech)
    { title: 'AI-Powered Marketing Automation for Small Businesses', category: 3, tags: [0, 4], type: 'trending' },
    { title: 'ChatGPT Marketing Strategies for Content Creation', category: 3, tags: [0, 4], type: 'trending' },
    { title: 'TikTok Marketing for B2B Companies', category: 1, tags: [2, 0], type: 'trending' },
    { title: 'Short-Form Video Marketing on Instagram Reels', category: 2, tags: [2, 1], type: 'trending' },
    { title: 'Privacy-First Marketing in the Post-Cookie Era', category: 0, tags: [3, 0], type: 'trending' },
    { title: 'Influencer Marketing ROI Measurement', category: 2, tags: [2, 3], type: 'trending' },
    { title: 'Voice Search Optimization for Local Businesses', category: 1, tags: [1, 0], type: 'trending' },
    { title: 'AR and VR Marketing Experiences', category: 3, tags: [0, 4], type: 'trending' },
    { title: 'Sustainability Marketing and Green Branding', category: 0, tags: [0, 2], type: 'trending' },
    { title: 'Web3 Marketing Strategies for Brands', category: 3, tags: [0, 4], type: 'trending' },
    { title: 'AI Content Generation Tools for Marketers', category: 3, tags: [4, 0], type: 'trending' },
    { title: 'Metaverse Marketing Opportunities', category: 3, tags: [0, 2], type: 'trending' },

    // Foundational Topics (60% - Evergreen Content)
    { title: 'SEO Fundamentals for Beginners', category: 1, tags: [1, 0], type: 'foundational' },
    { title: 'Content Marketing Strategy Development', category: 2, tags: [0, 1], type: 'foundational' },
    { title: 'Email Marketing Best Practices', category: 1, tags: [0, 4], type: 'foundational' },
    { title: 'Social Media Marketing for Small Businesses', category: 1, tags: [2, 0], type: 'foundational' },
    { title: 'PPC Advertising Campaign Management', category: 1, tags: [3, 0], type: 'foundational' },
    { title: 'Google Analytics Data Interpretation', category: 0, tags: [3, 1], type: 'foundational' },
    { title: 'Brand Building Strategies for Startups', category: 0, tags: [0, 2], type: 'foundational' },
    { title: 'Customer Retention Marketing Tactics', category: 0, tags: [0, 4], type: 'foundational' },
    { title: 'Marketing Psychology and Consumer Behavior', category: 0, tags: [0, 3], type: 'foundational' },
    { title: 'Conversion Rate Optimization Techniques', category: 1, tags: [3, 0], type: 'foundational' },
    { title: 'Marketing Funnel Optimization', category: 0, tags: [0, 3], type: 'foundational' },
    { title: 'Customer Journey Mapping', category: 0, tags: [0, 3], type: 'foundational' },
    { title: 'Market Segmentation Strategies', category: 0, tags: [0, 3], type: 'foundational' },
    { title: 'Competitive Analysis for Marketing', category: 0, tags: [3, 0], type: 'foundational' },
  ];

  // 30+ title variations for diverse content types
  const titleVariations = [
    // How-To & Guides (SEO-friendly)
    'How to Create',
    'How to Build',
    'How to Optimize',
    'How to Implement',
    'Step-by-Step Guide to',
    'Complete Guide to',
    'Ultimate Guide to',
    'Beginner\'s Guide to',
    'Advanced Guide to',
    'Comprehensive Guide to',

    // Listicles & Rankings
    '10 Best Strategies for',
    '15 Proven Ways to',
    '7 Essential Tips for',
    '12 Powerful Techniques for',
    '20 Expert Secrets for',
    'Top 10 Tools for',

    // Comparison & Analysis
    'Best Practices for',
    'Proven Methods for',
    'Effective Strategies for',
    'Winning Tactics for',

    // Trend & Future-Focused
    'The Future of',
    '2024 Trends in',
    '2025 Predictions for',
    'Emerging Trends in',

    // ROI & Results-Focused
    'Maximizing ROI with',
    'Boosting Revenue through',
    'Increasing Conversions with',
    'Scaling Your Business with',

    // Expert & Authority
    'Expert Insights on',
    'Mastering',
    'Advanced Techniques for',
  ];

  // Function to generate 2,000+ word SEO-optimized content with professional formatting
  function generateLongFormContent(title: string, topic: string, keyword: string): string {
    const currentYear = new Date().getFullYear();
    const publishDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return `# ${title}

<div class="article-meta">
  <time datetime="${new Date().toISOString()}">${publishDate}</time>
  <span class="reading-time">10 min read</span>
</div>

---

<div class="article-summary">

## At a Glance

In this comprehensive guide, you'll discover everything you need to know about ${keyword.toLowerCase()}. Whether you're a beginner just starting out or an experienced marketer looking to refine your approach, this article provides actionable strategies, expert insights, and proven techniques to help you succeed.

### Key Takeaways

- **Understand the fundamentals** of ${keyword.toLowerCase()} and why it matters in ${currentYear}
- **Learn step-by-step implementation** strategies that deliver measurable results
- **Discover common mistakes** to avoid and how to overcome challenges
- **Access expert tips** and best practices from industry leaders
- **Get actionable tactics** you can implement immediately

</div>

---

## What is ${topic}?

${topic} has become one of the most critical components of modern marketing strategy.

In today's digital landscape, businesses that master ${keyword.toLowerCase()} gain a significant competitive advantage. It's not just about following trends—it's about understanding your customers' needs and delivering value at every touchpoint.

The marketing landscape has evolved dramatically over the past few years. What worked in 2020 may not be effective in ${currentYear}.

That's why staying current with the latest strategies and techniques is essential for success.

### Why ${topic} Matters in ${currentYear}

The importance of ${keyword.toLowerCase()} cannot be overstated.

Here's why it should be a top priority for your business:

#### 1. Increased Competition

The digital marketplace is more crowded than ever.

Standing out requires sophisticated strategies and consistent execution. Businesses that fail to adapt risk becoming invisible to their target audience.

#### 2. Changing Consumer Behavior

Today's consumers are more informed and have higher expectations.

They research extensively before making purchase decisions. The average buyer consults 10+ sources before committing to a purchase.

#### 3. Technology Advancement

New tools and platforms emerge constantly, creating both opportunities and challenges for marketers.

Staying current with technology trends is no longer optional—it's essential for survival.

#### 4. Data-Driven Decision Making

Success now depends on your ability to collect, analyze, and act on data insights.

Companies that leverage data effectively see 5-6% higher productivity and profitability than their competitors.

---

## The Complete Framework for ${topic}

Implementing effective ${keyword.toLowerCase()} requires a structured approach.

Follow this comprehensive framework to achieve optimal results.

### Phase 1: Research and Planning

Before diving into execution, you need a solid foundation.

This phase sets the stage for everything that follows.

#### Step 1: Define Your Objectives

Start by clearly articulating what you want to achieve.

Vague goals lead to vague results. Instead, use the SMART framework:

- **Specific** — Clearly define what success looks like
- **Measurable** — Establish concrete metrics to track progress
- **Achievable** — Set realistic targets based on your resources
- **Relevant** — Align goals with broader business objectives
- **Time-bound** — Create deadlines to maintain momentum

#### Step 2: Understand Your Target Audience

Deep audience understanding is the foundation of effective marketing.

You need to know:

- **Demographics** — Age, location, income, education level
- **Psychographics** — Values, interests, lifestyle choices
- **Pain points** — Challenges and frustrations they face
- **Goals** — What they're trying to achieve
- **Channels** — Where they spend their time online
- **Behavior** — How they make purchasing decisions

<div class="pro-tip">
<strong>💡 Pro Tip:</strong> Create detailed buyer personas that represent your ideal customers. Give them names, backgrounds, and specific characteristics. This makes it easier to create targeted content and campaigns.
</div>

#### Step 3: Conduct Competitive Analysis

Understanding your competition helps you identify opportunities and differentiate your approach.

Analyze:

- What strategies are competitors using?
- What seems to be working well for them?
- Where are the gaps in their approach?
- How can you offer something unique or better?

### Phase 2: Strategy Development

With research complete, it's time to develop your comprehensive strategy.

#### Building Your Strategic Foundation

Your strategy should address these key elements:

1. **Positioning** — How will you differentiate from competitors?
2. **Messaging** — What key messages will resonate with your audience?
3. **Channels** — Where will you reach your target audience?
4. **Content** — What types of content will you create?
5. **Timeline** — When will you execute each component?
6. **Budget** — How will you allocate resources?

#### Creating Your Content Calendar

Consistency is crucial for ${keyword.toLowerCase()}.

A well-planned content calendar ensures you maintain regular engagement with your audience.

Your calendar should include:

- **Content topics and themes** — What you'll publish
- **Publication dates and times** — When you'll publish
- **Responsible team members** — Who will create it
- **Distribution channels** — Where you'll share it
- **Promotional activities** — How you'll amplify it

<div class="expert-insight">
<strong>🎯 Expert Insight:</strong> The most successful marketers plan content at least 3 months in advance. This allows time for quality creation and strategic alignment.
</div>

### Phase 3: Implementation and Execution

Now comes the action phase.

This is where your planning transforms into tangible results.

#### Best Practices for Implementation

**1. Start Small, Scale Gradually**

Don't try to do everything at once.

Begin with a focused approach and expand as you gain traction. This reduces risk and allows you to learn what works before investing heavily.

**2. Maintain Quality Standards**

Never sacrifice quality for quantity.

One excellent piece of content outperforms ten mediocre ones. Focus on creating value that truly helps your audience.

**3. Stay Consistent**

Regular, predictable engagement builds trust and keeps your brand top-of-mind.

Consistency matters more than perfection. It's better to publish good content regularly than perfect content sporadically.

**4. Test and Iterate**

Use A/B testing to optimize every element of your campaigns.

Test headlines, images, calls-to-action, and timing. Let data guide your decisions, not assumptions.

**5. Document Everything**

Keep detailed records of what you try, what works, and what doesn't.

This creates a knowledge base that accelerates future success and prevents repeating mistakes.

---

## Advanced Techniques for ${topic}

Once you've mastered the fundamentals, these advanced techniques will take your results to the next level.

### Leveraging Data and Analytics

Data-driven marketing isn't optional anymore—it's essential.

Here's how to harness the power of analytics:

#### Key Metrics to Track

Focus on metrics that directly impact business outcomes:

- **Conversion Rate** — Percentage of visitors who take desired actions
- **Customer Acquisition Cost (CAC)** — Total cost to acquire a new customer
- **Customer Lifetime Value (CLV)** — Total revenue from a customer relationship
- **Return on Investment (ROI)** — Revenue generated compared to marketing spend
- **Engagement Rate** — How actively your audience interacts with content

#### Tools and Platforms

Invest in robust analytics tools that provide actionable insights:

- **Google Analytics** — Website traffic analysis and user behavior
- **Social media analytics** — Platform-specific performance metrics
- **Email marketing analytics** — Open rates, click rates, conversions
- **CRM systems** — Customer data and relationship management
- **Marketing automation** — Campaign performance and attribution

### Personalization at Scale

Modern consumers expect personalized experiences.

Here's how to deliver them:

#### Segmentation Strategies

Divide your audience into meaningful segments based on:

- **Behavioral data** — Past purchases, browsing history, engagement patterns
- **Demographic information** — Age, location, income, job title
- **Engagement level** — Active users vs. dormant subscribers
- **Customer journey stage** — Awareness, consideration, decision, retention
- **Preferences and interests** — Stated preferences and inferred interests

#### Dynamic Content

Use technology to automatically customize content for different audience segments.

This includes:

- **Personalized emails** — Subject lines and content tailored to each recipient
- **Adaptive websites** — Content that changes based on visitor behavior
- **Product recommendations** — Suggestions based on browsing and purchase history
- **Targeted advertising** — Ads customized to user demographics and interests

---

## Common Mistakes to Avoid

Learn from others' errors to accelerate your success.

Here are the most common pitfalls in ${keyword.toLowerCase()}:

### Mistake #1: Ignoring Mobile Users

With over 60% of internet traffic coming from mobile devices, mobile optimization isn't optional.

**What to do instead:**

- Implement responsive design across all devices
- Optimize for fast loading times on mobile networks
- Create touch-friendly navigation and buttons
- Use mobile-optimized content formats

Mobile users have different needs and behaviors than desktop users. Ignoring them means losing more than half your potential audience.

### Mistake #2: Neglecting SEO

Search engine optimization remains crucial for organic visibility.

**What to do instead:**

- Conduct thorough keyword research and optimization
- Build quality backlinks from reputable sources
- Master technical SEO fundamentals
- Update content regularly to maintain freshness

SEO isn't a one-time task—it's an ongoing process that compounds over time.

### Mistake #3: Inconsistent Branding

Brand consistency builds recognition and trust.

**What to do instead:**

- Maintain consistent visual identity across all touchpoints
- Use unified messaging across channels
- Develop a coherent brand voice and tone
- Align values and positioning in all communications

Inconsistency confuses your audience and dilutes your brand equity.

### Mistake #4: Failing to Test

Assumptions lead to wasted resources.

**What to do instead:**

- A/B test headlines, images, and calls-to-action
- Experiment with different content formats
- Test various distribution channels
- Analyze results and iterate continuously

Testing transforms guesswork into data-driven decisions.

---

## Tools and Resources for Success

The right tools can dramatically improve your efficiency and results.

Here are essential resources for ${keyword.toLowerCase()}:

### Content Creation Tools

- **Canva** — Visual content design and graphics
- **Grammarly** — Writing quality and grammar checking
- **Hemingway Editor** — Readability and clarity improvement
- **BuzzSumo** — Content research and trend analysis

### Analytics and Tracking

- **Google Analytics** — Website metrics and user behavior
- **Hotjar** — Heatmaps and user session recordings
- **SEMrush** — SEO insights and competitive analysis
- **Ahrefs** — Backlink analysis and keyword research

### Automation Platforms

- **HubSpot** — All-in-one marketing automation
- **Mailchimp** — Email marketing and automation
- **Hootsuite** — Social media management and scheduling
- **Zapier** — Workflow automation and integrations

---

## Measuring Success and ROI

Understanding what's working is essential for continuous improvement.

Here's how to measure success effectively:

### Setting Up Your Measurement Framework

Follow these five steps to create a robust measurement system:

**1. Define Success Metrics**

Align metrics with business objectives. Don't track vanity metrics—focus on what drives revenue.

**2. Establish Baselines**

Know your starting point. You can't measure improvement without understanding where you began.

**3. Set Targets**

Create specific, measurable goals. Vague targets lead to vague results.

**4. Track Regularly**

Monitor progress consistently. Weekly reviews catch problems early; monthly reviews show trends.

**5. Report Results**

Share insights with stakeholders. Transparency builds trust and secures continued investment.

### Calculating ROI

Use this formula to calculate marketing ROI:

<div class="formula-box">
<strong>ROI = (Revenue - Marketing Cost) / Marketing Cost × 100</strong>
</div>

**Example calculation:**

If you spent $10,000 on marketing and generated $50,000 in revenue:

ROI = ($50,000 - $10,000) / $10,000 × 100 = **400%**

This means for every dollar spent, you generated $4 in profit.

---

## Future Trends in ${topic}

Stay ahead of the curve by understanding where ${keyword.toLowerCase()} is heading:

### Emerging Technologies

**Artificial Intelligence**

AI-powered personalization and automation are transforming how marketers work.

Expect AI to handle more routine tasks, freeing humans for strategic thinking.

**Voice Search**

Optimizing for voice-activated devices is becoming essential.

Voice searches are more conversational and question-based than text searches.

**Augmented Reality**

Immersive brand experiences through AR are moving from novelty to necessity.

Brands that create engaging AR experiences will stand out.

**Blockchain**

Transparent and secure marketing through blockchain technology is emerging.

This could revolutionize ad verification and customer data management.

### Shifting Consumer Expectations

**Authenticity and Transparency**

Consumers demand greater authenticity and transparency from brands.

Generic marketing messages no longer resonate—people want real stories and honest communication.

**Privacy and Data Protection**

Privacy concerns and data protection are top of mind for consumers.

Brands that respect privacy and use data responsibly will earn trust and loyalty.

**Sustainability and Ethics**

Preference for sustainable and ethical brands continues to grow.

Environmental and social responsibility are becoming purchase decision factors.

**Omnichannel Experiences**

Desire for seamless omnichannel experiences is now the baseline expectation.

Customers expect consistent, connected experiences across all touchpoints.

---

## Frequently Asked Questions

### How long does it take to see results from ${keyword.toLowerCase()}?

Results vary depending on your strategy, industry, and execution.

Generally, you can expect to see initial results within 3-6 months, with significant impact after 6-12 months of consistent effort. Quick wins are possible, but sustainable success requires patience and persistence.

### What budget do I need for effective ${keyword.toLowerCase()}?

Budget requirements depend on your goals, industry, and competition.

Start with what you can afford and scale as you see results. Focus on high-impact, low-cost strategies initially. Many successful campaigns start with modest budgets and grow over time.

### Can small businesses compete with larger companies?

Absolutely.

Small businesses often have advantages in agility, personalization, and niche focus. You can move faster, connect more personally with customers, and dominate specific niches. Use these strengths to compete effectively.

### How often should I update my strategy?

Review your strategy quarterly and make adjustments based on performance data.

Conduct a comprehensive strategy overhaul annually. The market changes constantly, so your strategy should evolve with it.

### What's the most important factor for success?

Consistency.

Regular, sustained effort over time delivers better results than sporadic, intense campaigns. Success comes from showing up every day and continuously improving.

---

## Action Plan: Getting Started Today

Ready to implement what you've learned?

Follow this action plan:

### Week 1: Foundation

Build your strategic foundation:

- **Define objectives** — Set clear, measurable goals
- **Research audience** — Understand who you're targeting
- **Analyze competitors** — Identify opportunities and gaps
- **Audit current efforts** — Know your starting point

### Week 2-3: Strategy

Develop your comprehensive approach:

- **Create strategy** — Build your detailed plan
- **Plan content** — Develop your content calendar
- **Select tools** — Choose the right platforms and software
- **Set up tracking** — Implement analytics and measurement

### Week 4+: Execution

Put your plan into action:

- **Create content** — Start producing high-quality materials
- **Launch campaigns** — Begin executing your strategy
- **Monitor performance** — Track results daily and weekly
- **Iterate continuously** — Improve based on data and feedback

---

## Conclusion

Mastering ${keyword.toLowerCase()} requires dedication, strategic thinking, and consistent execution.

By following the frameworks and strategies outlined in this guide, you'll be well-positioned to achieve your marketing goals.

### Key Principles to Remember

**Start with solid research and planning.**

Understanding your audience and market is the foundation of everything else.

**Focus on your audience's needs.**

Marketing isn't about you—it's about solving problems for your customers.

**Maintain consistency in execution.**

Show up regularly and deliver value consistently.

**Use data to guide decisions.**

Let evidence, not assumptions, drive your strategy.

**Stay adaptable and willing to evolve.**

The market changes constantly—your approach should too.

---

The marketing landscape will continue to change, but these fundamental principles remain constant.

Invest in building strong foundations, stay current with emerging trends, and never stop learning.

<div class="cta-box">
<h3>Ready to Get Started?</h3>
<p>Start implementing these strategies today and track your progress. Success comes from taking action, measuring results, and continuously improving.</p>
</div>

---

<div class="article-footer">
<p><em>This article was last updated in ${currentYear} to reflect the latest trends and best practices in ${keyword.toLowerCase()}.</em></p>
</div>`;
  }

  console.log('📝 Creating 12,000 blog posts with 2,000+ word content...');

  const batchSize = 100;
  const totalPosts = 12000;

  for (let batch = 0; batch < totalPosts / batchSize; batch++) {
    const postsToCreate = [];

    for (let i = 0; i < batchSize; i++) {
      const postIndex = batch * batchSize + i;
      const topic = expandedTopics[postIndex % expandedTopics.length];
      const titleVar = titleVariations[postIndex % titleVariations.length];
      const imageId = validUnsplashImages[postIndex % validUnsplashImages.length];
      const author = [admin, editor, user][postIndex % 3];

      // Create SEO-optimized long-tail keyword title
      const baseTitle = topic.title;
      const variation = postIndex > expandedTopics.length ? ` in ${2024 + Math.floor(postIndex / 1000)}` : '';
      const title = `${titleVar} ${baseTitle}${variation}`;

      // Create SEO-friendly slug with keyword
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .substring(0, 100) + `-${postIndex}`;

      // Spread posts over 2-3 years (730-1095 days)
      const daysAgo = Math.floor(postIndex / 12); // ~12 posts per day spread
      const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

      // Generate SEO-optimized excerpt (150-160 characters)
      const keyword = baseTitle.toLowerCase();
      const excerpt = `Learn ${keyword} with our comprehensive ${new Date().getFullYear()} guide. Get expert strategies, actionable tips, and proven techniques for success.`;

      // Generate 2,000+ word content
      const content = generateLongFormContent(title, baseTitle, keyword);

      postsToCreate.push({
        title,
        slug,
        excerpt: excerpt.substring(0, 160), // Ensure 160 char limit
        content,
        featuredImage: `https://images.unsplash.com/${imageId}`,
        categoryId: categories[topic.category].id,
        authorId: author.id,
        status: 'PUBLISHED',
        publishedAt,
        tagIds: topic.tags.map(idx => tags[idx].id),
      });
    }

    // Batch insert
    for (const postData of postsToCreate) {
      const { tagIds, ...postWithoutTags } = postData;

      await prisma.blogPost.create({
        data: {
          ...postWithoutTags,
          tags: {
            connect: tagIds.map(id => ({ id })),
          },
        },
      });
    }

    const progress = ((batch + 1) / (totalPosts / batchSize) * 100).toFixed(1);
    console.log(`✅ Created batch ${batch + 1}/${totalPosts / batchSize} (${(batch + 1) * batchSize} posts) - ${progress}% complete`);
  }

  console.log('✅ All 12,000 blog posts created successfully!');
  console.log('📊 Content Statistics:');
  console.log(`   - Total Posts: ${totalPosts}`);
  console.log(`   - Average Word Count: ~2,000+ words per post`);
  console.log(`   - Time Span: ~${Math.floor(totalPosts / 12)} days (${(totalPosts / 12 / 365).toFixed(1)} years)`);
  console.log(`   - Trending Topics: ~${Math.floor(totalPosts * 0.4)} posts (40%)`);
  console.log(`   - Foundational Topics: ~${Math.floor(totalPosts * 0.6)} posts (60%)`);

  // Create sample marketing strategy
  const sampleStrategy = {
    businessName: 'TechStart Inc.',
    industry: 'Technology',
    targetAudience: 'Small to medium businesses looking for digital transformation',
    budget: 50000,
    objectives: ['Increase brand awareness', 'Generate qualified leads', 'Improve customer retention'],
    timeframe: '6 months',
    currentChallenges: 'Limited brand recognition in the market',
    competitorInfo: 'Competing with established players like Salesforce and HubSpot',
    existingMarketing: 'Basic website and LinkedIn presence',
  };

  await prisma.marketingStrategy.upsert({
    where: { id: 'sample-strategy-1' },
    update: {},
    create: {
      id: 'sample-strategy-1',
      userId: user.id,
      input: JSON.stringify(sampleStrategy),
      output: JSON.stringify({
        executiveSummary: 'Comprehensive digital marketing strategy focused on lead generation and brand building.',
        targetAudience: [
          {
            name: 'SMB Decision Makers',
            demographics: 'Business owners and managers, 30-55 years old',
            psychographics: 'Tech-savvy, growth-oriented, value efficiency',
            painPoints: ['Limited time', 'Need for digital transformation', 'Budget constraints'],
            preferredChannels: ['LinkedIn', 'Email', 'Industry publications'],
          },
        ],
        marketingChannels: [
          {
            name: 'Content Marketing',
            description: 'Educational blog posts and whitepapers',
            budgetAllocation: 15000,
            expectedROI: '300%',
            tactics: ['SEO-optimized blog posts', 'Downloadable guides', 'Webinars'],
            timeline: '6 months',
          },
        ],
        timeline: [
          {
            phase: 'Foundation (Month 1-2)',
            duration: '2 months',
            activities: ['Website optimization', 'Content strategy development', 'Social media setup'],
            deliverables: ['Updated website', 'Content calendar', 'Social media profiles'],
          },
        ],
        budget: {
          total: 50000,
          channels: [
            { channel: 'Content Marketing', amount: 15000, percentage: 30 },
            { channel: 'Paid Advertising', amount: 20000, percentage: 40 },
            { channel: 'Social Media', amount: 10000, percentage: 20 },
            { channel: 'Tools & Software', amount: 5000, percentage: 10 },
          ],
          contingency: 5000,
        },
        kpis: [
          {
            metric: 'Website Traffic',
            target: '50% increase',
            measurement: 'Google Analytics',
            frequency: 'Monthly',
          },
        ],
        recommendations: [
          'Focus on LinkedIn for B2B lead generation',
          'Invest in marketing automation tools',
          'Create case studies to build credibility',
        ],
      }),
      generatedBy: 'AI',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Test Users Created:');
  console.log('Admin: admin@mediaplanpro.com / admin123');
  console.log('Editor: editor@mediaplanpro.com / editor123');
  console.log('User: user@mediaplanpro.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
