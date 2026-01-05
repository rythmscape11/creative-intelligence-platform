# AI Blog Automation - Implementation Guide

**Project:** MediaPlanPro Automated Blog Generation  
**Date:** October 30, 2025  
**Status:** Implementation Guide

---

## 1. System Architecture

### 1.1 File Structure

```
src/
├── app/
│   └── api/
│       └── blog/
│           ├── generate/
│           │   └── route.ts          # Manual blog generation endpoint
│           └── auto-generate/
│               └── route.ts          # Automated cron job endpoint
├── lib/
│   ├── ai/
│   │   ├── openai.ts                 # OpenAI client configuration
│   │   ├── blog-generator.ts        # Blog generation logic
│   │   └── image-generator.ts       # DALL-E 3 integration
│   ├── content/
│   │   ├── topic-discovery.ts       # RSS feed parsing & topic selection
│   │   ├── quality-checker.ts       # Content quality validation
│   │   └── seo-optimizer.ts         # SEO optimization
│   └── utils/
│       └── rss-parser.ts             # RSS feed parser utility
└── components/
    └── admin/
        └── blog-automation-dashboard.tsx  # Admin review interface
```

---

## 2. Environment Variables

Add to `.env`:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-...your-api-key...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=4000

# Blog Automation Settings
AUTO_BLOG_ENABLED=true
AUTO_BLOG_SCHEDULE=0 6 * * *  # Daily at 6 AM UTC
AUTO_BLOG_REQUIRE_APPROVAL=true  # Set to false for auto-publish

# Content Sources
RSS_FEEDS=https://www.searchenginejournal.com/feed/,https://moz.com/blog/feed,https://blog.hubspot.com/marketing/rss.xml

# Quality Thresholds
MIN_WORD_COUNT=2000
MIN_QUALITY_SCORE=7
```

---

## 3. Core Implementation

### 3.1 OpenAI Client Setup

**File:** `src/lib/ai/openai.ts`

```typescript
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_CONFIG = {
  model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '4000'),
  temperature: 0.7,
};
```

### 3.2 Topic Discovery Engine

**File:** `src/lib/content/topic-discovery.ts`

```typescript
import Parser from 'rss-parser';

interface TrendingTopic {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  source: string;
  score: number;
}

const RSS_FEEDS = [
  { url: 'https://www.searchenginejournal.com/feed/', name: 'Search Engine Journal' },
  { url: 'https://moz.com/blog/feed', name: 'Moz Blog' },
  { url: 'https://blog.hubspot.com/marketing/rss.xml', name: 'HubSpot Marketing' },
  { url: 'https://neilpatel.com/feed/', name: 'Neil Patel' },
  { url: 'https://contentmarketinginstitute.com/feed/', name: 'Content Marketing Institute' },
];

const MARKETING_KEYWORDS = [
  'marketing', 'seo', 'content', 'social media', 'email marketing',
  'digital marketing', 'analytics', 'conversion', 'roi', 'strategy',
  'branding', 'advertising', 'ppc', 'sem', 'influencer',
];

export async function discoverTrendingTopics(): Promise<TrendingTopic[]> {
  const parser = new Parser();
  const allTopics: TrendingTopic[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      
      const topics = feedData.items
        .filter(item => {
          // Only include recent posts (last 7 days)
          const pubDate = new Date(item.pubDate || '');
          const daysAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysAgo <= 7;
        })
        .map(item => ({
          title: item.title || '',
          description: item.contentSnippet || item.description || '',
          link: item.link || '',
          pubDate: new Date(item.pubDate || ''),
          source: feed.name,
          score: 0,
        }));

      allTopics.push(...topics);
    } catch (error) {
      console.error(`Error fetching RSS feed ${feed.name}:`, error);
    }
  }

  // Score topics based on relevance
  const scoredTopics = allTopics.map(topic => {
    let score = 0;
    const text = `${topic.title} ${topic.description}`.toLowerCase();

    // Check for marketing keywords
    MARKETING_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
      }
    });

    // Boost recent posts
    const daysAgo = (Date.now() - topic.pubDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysAgo < 1) score += 3;
    else if (daysAgo < 3) score += 2;
    else if (daysAgo < 5) score += 1;

    return { ...topic, score };
  });

  // Sort by score and return top topics
  return scoredTopics
    .filter(topic => topic.score > 0)
    .sort((a, b) => b.score - a.score);
}

export async function selectDailyTopic(): Promise<TrendingTopic | null> {
  const topics = await discoverTrendingTopics();
  
  if (topics.length === 0) {
    return null;
  }

  // Check if we've already written about this topic
  const { prisma } = await import('@/lib/prisma');
  
  for (const topic of topics) {
    const existing = await prisma.blogPost.findFirst({
      where: {
        OR: [
          { title: { contains: topic.title.substring(0, 30) } },
          { seoTitle: { contains: topic.title.substring(0, 30) } },
        ],
      },
    });

    if (!existing) {
      return topic;
    }
  }

  // If all topics have been covered, return the top one anyway
  return topics[0];
}
```

### 3.3 Blog Generator

**File:** `src/lib/ai/blog-generator.ts`

```typescript
import { openai, OPENAI_CONFIG } from './openai';

interface BlogPostData {
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  content: string;
  keywords: string[];
  category: string;
  suggestedImagePrompt: string;
}

const BLOG_POST_PROMPT = `You are an expert marketing content writer for MediaPlanPro, a professional marketing strategy platform.

Your task is to write a comprehensive, SEO-optimized blog post that provides genuine value to marketing professionals.

REQUIREMENTS:
1. Length: 2000-2500 words
2. Tone: Professional, authoritative, but accessible
3. Structure:
   - Engaging headline (60-70 characters)
   - Meta description (150-160 characters)
   - Introduction with hook and problem statement
   - 5-7 main sections with H2 headings
   - Actionable tips and examples
   - Data and statistics (cite sources)
   - Conclusion with clear CTA
4. Format: Use Markdown with bullet points, numbered lists, and short paragraphs
5. SEO: Include target keywords naturally (1-2% density)
6. Value: Provide actionable insights, not generic advice

OUTPUT FORMAT: Return ONLY valid JSON with this structure:
{
  "title": "Engaging headline (60-70 chars)",
  "seoTitle": "SEO-optimized title (60 chars max)",
  "seoDescription": "Compelling meta description (150-160 chars)",
  "excerpt": "Brief summary (150-200 chars)",
  "content": "Full blog post in Markdown format",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "category": "SEO|Content Marketing|Social Media|Email Marketing|Analytics|Strategy",
  "suggestedImagePrompt": "DALL-E prompt for featured image"
}`;

export async function generateBlogPost(
  topic: string,
  targetKeywords: string[] = []
): Promise<BlogPostData> {
  try {
    const userPrompt = `
TOPIC: ${topic}
TARGET KEYWORDS: ${targetKeywords.join(', ')}

Write a comprehensive blog post about this topic. Make it valuable, actionable, and SEO-optimized.
`;

    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        { role: 'system', content: BLOG_POST_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: OPENAI_CONFIG.temperature,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const blogPost: BlogPostData = JSON.parse(content);

    // Validate required fields
    if (!blogPost.title || !blogPost.content || !blogPost.seoTitle) {
      throw new Error('Generated blog post is missing required fields');
    }

    return blogPost;
  } catch (error) {
    console.error('Error generating blog post:', error);
    throw error;
  }
}

export async function generateKeywords(topic: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert. Generate relevant keywords for blog posts.',
        },
        {
          role: 'user',
          content: `Generate 5-7 SEO keywords for a blog post about: "${topic}". Return as JSON array.`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return [];
    }

    const data = JSON.parse(content);
    return data.keywords || [];
  } catch (error) {
    console.error('Error generating keywords:', error);
    return [];
  }
}
```

### 3.4 Quality Checker

**File:** `src/lib/content/quality-checker.ts`

```typescript
interface QualityReport {
  score: number; // 0-10
  passed: boolean;
  issues: string[];
  warnings: string[];
}

export function checkContentQuality(content: string, title: string): QualityReport {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 10;

  // 1. Word count check
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 2000) {
    issues.push(`Word count too low: ${wordCount} (minimum: 2000)`);
    score -= 3;
  } else if (wordCount < 2200) {
    warnings.push(`Word count slightly low: ${wordCount} (recommended: 2200+)`);
    score -= 1;
  }

  // 2. Heading structure check
  const h2Count = (content.match(/^## /gm) || []).length;
  if (h2Count < 5) {
    warnings.push(`Few H2 headings: ${h2Count} (recommended: 5-7)`);
    score -= 0.5;
  }

  // 3. Paragraph length check
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100);
  if (longParagraphs.length > 3) {
    warnings.push('Some paragraphs are too long (>100 words)');
    score -= 0.5;
  }

  // 4. List usage check
  const hasBulletLists = content.includes('- ') || content.includes('* ');
  const hasNumberedLists = /^\d+\. /m.test(content);
  if (!hasBulletLists && !hasNumberedLists) {
    warnings.push('No lists found (bullet or numbered)');
    score -= 1;
  }

  // 5. Title length check
  if (title.length > 70) {
    warnings.push(`Title too long: ${title.length} chars (max: 70)`);
    score -= 0.5;
  }

  // 6. Check for generic phrases (AI detection)
  const genericPhrases = [
    'in conclusion',
    'in summary',
    'it is important to note',
    'as we have seen',
    'in today\'s digital age',
  ];
  const foundGeneric = genericPhrases.filter(phrase => 
    content.toLowerCase().includes(phrase)
  );
  if (foundGeneric.length > 2) {
    warnings.push(`Generic phrases detected: ${foundGeneric.join(', ')}`);
    score -= 1;
  }

  const passed = score >= 7 && issues.length === 0;

  return {
    score: Math.max(0, Math.min(10, score)),
    passed,
    issues,
    warnings,
  };
}
```

---

## 4. API Endpoints

### 4.1 Manual Generation Endpoint

**File:** `src/app/api/blog/generate/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateBlogPost, generateKeywords } from '@/lib/ai/blog-generator';
import { checkContentQuality } from '@/lib/content/quality-checker';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic, keywords } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Generate keywords if not provided
    const targetKeywords = keywords && keywords.length > 0 
      ? keywords 
      : await generateKeywords(topic);

    // Generate blog post
    const blogPost = await generateBlogPost(topic, targetKeywords);

    // Check quality
    const qualityReport = checkContentQuality(blogPost.content, blogPost.title);

    if (!qualityReport.passed) {
      return NextResponse.json({
        error: 'Generated content did not pass quality checks',
        qualityReport,
        blogPost,
      }, { status: 400 });
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: blogPost.category },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: blogPost.category,
          slug: blogPost.category.toLowerCase().replace(/\s+/g, '-'),
        },
      });
    }

    // Create blog post in database
    const savedPost = await prisma.blogPost.create({
      data: {
        title: blogPost.title,
        slug: blogPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        seoTitle: blogPost.seoTitle,
        seoDescription: blogPost.seoDescription,
        status: 'DRAFT', // Require manual approval
        authorId: session.user.id,
        categoryId: category.id,
        featuredImage: null, // TODO: Generate with DALL-E 3
      },
    });

    return NextResponse.json({
      success: true,
      post: savedPost,
      qualityReport,
    });
  } catch (error) {
    console.error('Error generating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
```

### 4.2 Automated Cron Job Endpoint

**File:** `src/app/api/blog/auto-generate/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { selectDailyTopic } from '@/lib/content/topic-discovery';
import { generateBlogPost, generateKeywords } from '@/lib/ai/blog-generator';
import { checkContentQuality } from '@/lib/content/quality-checker';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if auto-blog is enabled
    if (process.env.AUTO_BLOG_ENABLED !== 'true') {
      return NextResponse.json({ message: 'Auto-blog is disabled' });
    }

    // Select daily topic
    const topic = await selectDailyTopic();
    if (!topic) {
      return NextResponse.json({ message: 'No suitable topic found' });
    }

    // Generate keywords
    const keywords = await generateKeywords(topic.title);

    // Generate blog post
    const blogPost = await generateBlogPost(topic.title, keywords);

    // Check quality
    const qualityReport = checkContentQuality(blogPost.content, blogPost.title);

    if (!qualityReport.passed) {
      console.error('Quality check failed:', qualityReport);
      return NextResponse.json({
        error: 'Quality check failed',
        qualityReport,
      }, { status: 400 });
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: { name: blogPost.category },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: blogPost.category,
          slug: blogPost.category.toLowerCase().replace(/\s+/g, '-'),
        },
      });
    }

    // Get admin user for author
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminUser) {
      throw new Error('No admin user found');
    }

    // Determine status based on approval setting
    const requireApproval = process.env.AUTO_BLOG_REQUIRE_APPROVAL === 'true';
    const status = requireApproval ? 'DRAFT' : 'PUBLISHED';

    // Create blog post
    const savedPost = await prisma.blogPost.create({
      data: {
        title: blogPost.title,
        slug: blogPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        seoTitle: blogPost.seoTitle,
        seoDescription: blogPost.seoDescription,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        authorId: adminUser.id,
        categoryId: category.id,
      },
    });

    return NextResponse.json({
      success: true,
      post: savedPost,
      qualityReport,
      topic: topic.title,
    });
  } catch (error) {
    console.error('Auto-generate error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-generate blog post' },
      { status: 500 }
    );
  }
}
```

---

## 5. Vercel Cron Job Configuration

**File:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/blog/auto-generate",
      "schedule": "0 6 * * *"
    }
  ]
}
```

**Note:** Add `CRON_SECRET` to Vercel environment variables for security.

---

## 6. Next Steps

1. **Install Dependencies:**
   ```bash
   npm install openai rss-parser
   ```

2. **Set Environment Variables:**
   - Add OpenAI API key
   - Configure cron secret
   - Set blog automation settings

3. **Test Manual Generation:**
   - Call `/api/blog/generate` with a test topic
   - Review generated content
   - Adjust prompts as needed

4. **Deploy to Vercel:**
   - Push code to GitHub
   - Vercel will auto-deploy
   - Cron job will run daily at 6 AM UTC

5. **Monitor & Optimize:**
   - Review generated posts daily
   - Track quality scores
   - Refine prompts based on results
   - Monitor SEO performance

---

## 7. Cost Tracking

Create a simple cost tracking endpoint:

**File:** `src/app/api/blog/stats/route.ts`

```typescript
export async function GET() {
  const posts = await prisma.blogPost.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(1)), // This month
      },
    },
  });

  const estimatedCost = posts * 0.11; // $0.11 per post

  return NextResponse.json({
    postsThisMonth: posts,
    estimatedCost: `$${estimatedCost.toFixed(2)}`,
  });
}
```

---

**End of Implementation Guide**

