import { BlogPost, Category, Tag } from '@/types';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export class SEOService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://aureonone.in') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Generate SEO metadata for blog posts
   */
  generateBlogPostSEO(post: BlogPost): SEOMetadata {
    const title = post.seoTitle || `${post.title} | Aureon One Blog`;
    const description = post.seoDescription || post.excerpt;
    const canonical = `${this.baseUrl}/blog/${post.slug}`;
    const ogImage = post.featuredImage || `${this.baseUrl}/images/og-default.jpg`;

    return {
      title,
      description,
      canonical,
      keywords: post.tags?.map(tag => tag.name) || [],
      ogTitle: title,
      ogDescription: description,
      ogImage,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: ogImage,
      structuredData: this.generateBlogPostStructuredData(post),
    };
  }

  /**
   * Generate SEO metadata for category pages
   */
  generateCategorySEO(category: Category, postCount: number = 0): SEOMetadata {
    const title = `${category.name} | Aureon One Blog`;
    const description = category.description ||
      `Explore ${postCount} articles about ${category.name.toLowerCase()} on Aureon One. Get insights and tips for your marketing strategy.`;
    const canonical = `${this.baseUrl}/blog/category/${category.slug}`;

    return {
      title,
      description,
      canonical,
      keywords: [category.name, 'marketing', 'strategy', 'blog'],
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.baseUrl}/images/og-category.jpg`,
      ogType: 'website',
      twitterCard: 'summary',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.baseUrl}/images/og-category.jpg`,
      structuredData: this.generateCategoryStructuredData(category),
    };
  }

  /**
   * Generate SEO metadata for tag pages
   */
  generateTagSEO(tag: Tag, postCount: number = 0): SEOMetadata {
    const title = `${tag.name} Articles | Aureon One Blog`;
    const description = `Discover ${postCount} articles tagged with ${tag.name} on Aureon One. Learn about marketing strategies and best practices.`;
    const canonical = `${this.baseUrl}/blog/tag/${tag.slug}`;

    return {
      title,
      description,
      canonical,
      keywords: [tag.name, 'marketing', 'strategy', 'blog'],
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.baseUrl}/images/og-tag.jpg`,
      ogType: 'website',
      twitterCard: 'summary',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.baseUrl}/images/og-tag.jpg`,
    };
  }

  /**
   * Generate SEO metadata for the blog homepage
   */
  generateBlogHomeSEO(): SEOMetadata {
    const title = 'Marketing Strategy Blog | Aureon One';
    const description = 'Get expert insights on marketing strategies, digital marketing trends, and business growth tips from Aureon One\'s blog.';
    const canonical = `${this.baseUrl}/blog`;

    return {
      title,
      description,
      canonical,
      keywords: ['marketing strategy', 'digital marketing', 'business growth', 'marketing tips', 'content marketing'],
      ogTitle: title,
      ogDescription: description,
      ogImage: `${this.baseUrl}/images/og-blog.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: `${this.baseUrl}/images/og-blog.jpg`,
      structuredData: this.generateBlogStructuredData(),
    };
  }

  /**
   * Generate structured data for blog posts (Article schema)
   */
  private generateBlogPostStructuredData(post: BlogPost): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.featuredImage ? [post.featuredImage] : [],
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Person',
        name: post.author.name,
        url: `${this.baseUrl}/author/${post.author.id}`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Aureon One',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${this.baseUrl}/blog/${post.slug}`,
      },
      articleSection: post.category.name,
      keywords: post.tags?.map(tag => tag.name).join(', ') || '',
    };
  }

  /**
   * Generate structured data for category pages
   */
  private generateCategoryStructuredData(category: Category): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: category.description,
      url: `${this.baseUrl}/blog/category/${category.slug}`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Aureon One Blog',
        url: `${this.baseUrl}/blog`,
      },
    };
  }

  /**
   * Generate structured data for blog homepage
   */
  private generateBlogStructuredData(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Aureon One Blog',
      description: 'Expert insights on marketing strategies and business growth',
      url: `${this.baseUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'Aureon One',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/images/logo.png`,
        },
      },
    };
  }

  /**
   * Generate sitemap entries for blog content
   */
  async generateBlogSitemapEntries(): Promise<SitemapEntry[]> {
    const entries: SitemapEntry[] = [];

    // Blog homepage
    entries.push({
      url: `${this.baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    });

    // This would typically fetch from database
    // For now, return static entries as example
    return entries;
  }

  /**
   * Generate XML sitemap content
   */
  generateSitemapXML(entries: SitemapEntry[]): string {
    const xmlEntries = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml
Sitemap: ${this.baseUrl}/blog-sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /dashboard/

# Allow specific public API endpoints
Allow: /api/blog/posts
Allow: /api/blog/categories
Allow: /api/blog/tags`;
  }

  /**
   * Extract keywords from content
   */
  extractKeywords(content: string, maxKeywords: number = 10): string[] {
    // Remove HTML tags and normalize text
    const text = content.replace(/<[^>]*>/g, '').toLowerCase();

    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'over', 'under', 'up', 'down', 'out', 'off', 'into', 'onto', 'from', 'about', 'through',
    ]);

    // Extract words and count frequency
    const words = text.match(/\b\w{3,}\b/g) || [];
    const wordCount = new Map<string, number>();

    words.forEach(word => {
      if (!stopWords.has(word)) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });

    // Sort by frequency and return top keywords
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  }

  /**
   * Calculate reading time for content
   */
  calculateReadingTime(content: string): number {
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    const wordsPerMinute = 200; // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Generate meta description from content
   */
  generateMetaDescription(content: string, maxLength: number = 160): string {
    const text = content.replace(/<[^>]*>/g, '').trim();

    if (text.length <= maxLength) {
      return text;
    }

    // Find the last complete sentence within the limit
    const truncated = text.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');

    if (lastSentence > maxLength * 0.5) {
      return text.substring(0, lastSentence + 1);
    }

    // If no good sentence break, truncate at word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    return text.substring(0, lastSpace) + '...';
  }
}
