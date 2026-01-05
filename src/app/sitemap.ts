import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering to always fetch fresh data from database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in';

  // Fetch all published blog posts from database
  let blogPosts: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    blogPosts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date(), // Only include posts that are already published
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    // Continue without blog posts if database query fails
  }

  // Define all tool categories and their tools (COMPLETE LIST)
  const tools = [
    // Advertising Tools
    { category: 'advertising', slug: 'roi-calculator' },
    { category: 'advertising', slug: 'budget-allocator' },
    { category: 'advertising', slug: 'cpc-cpm-calculator' },
    { category: 'advertising', slug: 'ad-copy-generator' },
    { category: 'advertising', slug: 'landing-page-analyzer' },

    // Content Tools
    { category: 'content', slug: 'headline-analyzer' },
    { category: 'content', slug: 'email-subject-tester' },
    { category: 'content', slug: 'meta-description-generator' },
    { category: 'content', slug: 'blog-outline-generator' },
    { category: 'content', slug: 'readability-scorer' },
    { category: 'content', slug: 'keyword-density-checker' },
    { category: 'content', slug: 'social-caption-generator' },
    { category: 'content', slug: 'content-calendar-generator' },

    // SEO Tools
    { category: 'seo', slug: 'keyword-research' },
    { category: 'seo', slug: 'serp-preview' },
    { category: 'seo', slug: 'page-speed-analyzer' },
    { category: 'seo', slug: 'backlink-checker' },
    { category: 'seo', slug: 'schema-generator' },
    { category: 'seo', slug: 'robots-txt-generator' },
    { category: 'seo', slug: 'xml-sitemap-generator' },

    // Social Tools
    { category: 'social', slug: 'engagement-calculator' },
    { category: 'social', slug: 'hashtag-generator' },
    { category: 'social', slug: 'best-time-to-post' },
    { category: 'social', slug: 'utm-builder' },
    { category: 'social', slug: 'image-resizer' },
    { category: 'social', slug: 'social-audit-tool' },

    // Email Tools
    { category: 'email', slug: 'email-preview' },
    { category: 'email', slug: 'spam-score-checker' },
    { category: 'email', slug: 'list-segmentation-calculator' },
    { category: 'email', slug: 'signature-generator' },
  ];

  // Define all service pages (from src/config/services.ts)
  const services = [
    'marketing-strategy-development',
    'marketing-consultation-retainer',
    'seo-audit-optimization',
    'monthly-seo-management',
    'blog-content-package',
    'google-ads-management',
    'social-media-ads-management',
    'landing-page-development',
    'full-website-development',
  ];

  const currentDate = new Date();

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },

    // Main Tools Page
    {
      url: `${baseUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // Dashboard
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },

    // Pricing
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },

    // Resources
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources/ai-marketing-plan-generator`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/resources/marketing-kpi-dashboard`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/resources/marketing-strategy-template`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/resources/ai-for-agencies`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/resources/marketing-mix-modeling`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },

    // About
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Contact
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },

    // Services Main Page
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    // Service Thank You Page
    {
      url: `${baseUrl}/services/thank-you`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },

    // Privacy Policy
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // Terms of Service
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // All Regular Tool Pages (High Priority for SEO)
    ...tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.category}/${tool.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),

    // All Enhanced Tool Pages
    ...tools.map((tool) => ({
      url: `${baseUrl}/tools/${tool.category}/${tool.slug}-enhanced`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    // All Service Pages (Lead Generation Landing Pages)
    ...services.map((serviceSlug) => ({
      url: `${baseUrl}/services/${serviceSlug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85, // High priority for conversion-focused pages
    })),

    // Growth Suite Pages
    {
      url: `${baseUrl}/growth-suite`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/growth-suite/attribution`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/growth-suite/competitors`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/growth-suite/experiments`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/growth-suite/heatmaps`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/growth-suite/repurposer`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/growth-suite/seo`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/growth-suite/widgets`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },

    // All Published Blog Posts
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  ];
}

