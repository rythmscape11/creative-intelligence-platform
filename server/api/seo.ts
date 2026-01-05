import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { PrismaClient } from '@prisma/client';
import { SEOService, SitemapEntry } from '../../src/lib/services/seo-service';

const router = Router();
const prisma = new PrismaClient();
const seoService = new SEOService();

// Generate XML sitemap
router.get('/sitemap.xml', asyncHandler(async (req: any, res: any) => {
  try {
    const entries: SitemapEntry[] = [];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mediaplanpro.com';

    // Add static pages
    const staticPages = [
      { url: '/', priority: 1.0, changeFreq: 'weekly' as const },
      { url: '/about', priority: 0.8, changeFreq: 'monthly' as const },
      { url: '/pricing', priority: 0.9, changeFreq: 'weekly' as const },
      { url: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
      { url: '/blog', priority: 0.8, changeFreq: 'daily' as const },
    ];

    staticPages.forEach(page => {
      entries.push({
        url: `${baseUrl}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
      });
    });

    // Add published blog posts
    const publishedPosts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    });

    publishedPosts.forEach(post => {
      entries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });

    // Add category pages
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    categories.forEach(category => {
      entries.push({
        url: `${baseUrl}/blog/category/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });

    // Add tag pages
    const tags = await prisma.tag.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    tags.forEach(tag => {
      entries.push({
        url: `${baseUrl}/blog/tag/${tag.slug}`,
        lastModified: tag.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    });

    const sitemapXML = seoService.generateSitemapXML(entries);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(sitemapXML);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate sitemap',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Generate robots.txt
router.get('/robots.txt', asyncHandler(async (req: any, res: any) => {
  try {
    const robotsTxt = seoService.generateRobotsTxt();

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(robotsTxt);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate robots.txt',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get SEO metadata for a blog post
router.get('/metadata/blog/:slug', asyncHandler(async (req: any, res: any) => {
  const { slug } = req.params;

  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        category: true,
        tags: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    const seoMetadata = seoService.generateBlogPostSEO(post as any);

    res.json({
      success: true,
      data: seoMetadata,
      message: 'SEO metadata retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get SEO metadata',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get SEO metadata for a category
router.get('/metadata/category/:slug', asyncHandler(async (req: any, res: any) => {
  const { slug } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            blogPosts: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { lte: new Date() },
              },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const seoMetadata = seoService.generateCategorySEO(category as any, category._count.blogPosts);

    res.json({
      success: true,
      data: seoMetadata,
      message: 'SEO metadata retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get SEO metadata',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get SEO metadata for a tag
router.get('/metadata/tag/:slug', asyncHandler(async (req: any, res: any) => {
  const { slug } = req.params;

  try {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            blogPosts: {
              where: {
                status: 'PUBLISHED',
                publishedAt: { lte: new Date() },
              },
            },
          },
        },
      },
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    const seoMetadata = seoService.generateTagSEO(tag as any, tag._count.blogPosts);

    res.json({
      success: true,
      data: seoMetadata,
      message: 'SEO metadata retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get SEO metadata',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Analyze content for SEO
router.post('/analyze', asyncHandler(async (req: any, res: any) => {
  const { content, title } = req.body;

  if (!content || !title) {
    return res.status(400).json({
      success: false,
      message: 'Content and title are required',
    });
  }

  try {
    const keywords = seoService.extractKeywords(content);
    const readingTime = seoService.calculateReadingTime(content);
    const metaDescription = seoService.generateMetaDescription(content);

    // Basic SEO analysis
    const analysis = {
      keywords,
      readingTime,
      suggestedMetaDescription: metaDescription,
      wordCount: content.replace(/<[^>]*>/g, '').split(/\s+/).length,
      titleLength: title.length,
      titleSEOScore: title.length >= 30 && title.length <= 60 ? 'good' : 
                   title.length < 30 ? 'too_short' : 'too_long',
      hasHeadings: /<h[1-6]>/i.test(content),
      hasImages: /<img/i.test(content),
      hasLinks: /<a\s+href/i.test(content),
    };

    res.json({
      success: true,
      data: analysis,
      message: 'Content analyzed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to analyze content',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

// Get internal linking suggestions
router.get('/internal-links/:slug', asyncHandler(async (req: any, res: any) => {
  const { slug } = req.params;
  const { limit = 5 } = req.query;

  try {
    const currentPost = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!currentPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Find related posts based on category and tags
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { id: { not: currentPost.id } },
          { status: 'PUBLISHED' },
          { publishedAt: { lte: new Date() } },
          {
            OR: [
              { categoryId: currentPost.categoryId },
              {
                tags: {
                  some: {
                    id: {
                      in: currentPost.tags.map(tag => tag.id),
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: { select: { name: true } },
        tags: { select: { name: true } },
      },
      take: parseInt(limit as string),
      orderBy: { publishedAt: 'desc' },
    });

    const suggestions = relatedPosts.map(post => ({
      title: post.title,
      url: `/blog/${post.slug}`,
      excerpt: post.excerpt,
      category: post.category.name,
      tags: post.tags.map(tag => tag.name),
    }));

    res.json({
      success: true,
      data: suggestions,
      message: 'Internal linking suggestions retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get internal linking suggestions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}));

export { router as seoRoutes };
