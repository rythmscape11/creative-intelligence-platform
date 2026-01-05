import { SEOService } from '../../src/lib/services/seo-service';

describe('SEOService', () => {
  let seoService: SEOService;

  beforeEach(() => {
    seoService = new SEOService('https://test.com');
  });

  describe('generateBlogPostSEO', () => {
    const mockPost = {
      id: 'post1',
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      content: '<p>This is test content</p>',
      excerpt: 'This is a test excerpt',
      status: 'PUBLISHED' as const,
      publishedAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      author: {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
      },
      category: {
        id: 'cat1',
        name: 'Technology',
        slug: 'technology',
      },
      tags: [
        { id: 'tag1', name: 'JavaScript', slug: 'javascript' },
        { id: 'tag2', name: 'React', slug: 'react' },
      ],
    };

    it('should generate basic SEO metadata', () => {
      const seo = seoService.generateBlogPostSEO(mockPost);

      expect(seo.title).toBe('Test Blog Post | MediaPlanPro Blog');
      expect(seo.description).toBe('This is a test excerpt');
      expect(seo.canonical).toBe('https://test.com/blog/test-blog-post');
      expect(seo.keywords).toEqual(['JavaScript', 'React']);
    });

    it('should use custom SEO title and description when provided', () => {
      const postWithCustomSEO = {
        ...mockPost,
        seoTitle: 'Custom SEO Title',
        seoDescription: 'Custom SEO description',
      };

      const seo = seoService.generateBlogPostSEO(postWithCustomSEO);

      expect(seo.title).toBe('Custom SEO Title');
      expect(seo.description).toBe('Custom SEO description');
    });

    it('should generate Open Graph metadata', () => {
      const seo = seoService.generateBlogPostSEO(mockPost);

      expect(seo.ogTitle).toBe('Test Blog Post | MediaPlanPro Blog');
      expect(seo.ogDescription).toBe('This is a test excerpt');
      expect(seo.ogType).toBe('article');
      expect(seo.ogImage).toBe('https://test.com/images/og-default.jpg');
    });

    it('should generate Twitter Card metadata', () => {
      const seo = seoService.generateBlogPostSEO(mockPost);

      expect(seo.twitterCard).toBe('summary_large_image');
      expect(seo.twitterTitle).toBe('Test Blog Post | MediaPlanPro Blog');
      expect(seo.twitterDescription).toBe('This is a test excerpt');
    });

    it('should generate structured data', () => {
      const seo = seoService.generateBlogPostSEO(mockPost);

      expect(seo.structuredData).toBeDefined();
      expect(seo.structuredData['@type']).toBe('Article');
      expect(seo.structuredData.headline).toBe('Test Blog Post');
      expect(seo.structuredData.author.name).toBe('John Doe');
      expect(seo.structuredData.articleSection).toBe('Technology');
    });
  });

  describe('generateCategorySEO', () => {
    const mockCategory = {
      id: 'cat1',
      name: 'Technology',
      slug: 'technology',
      description: 'Technology related articles',
    };

    it('should generate category SEO metadata', () => {
      const seo = seoService.generateCategorySEO(mockCategory, 5);

      expect(seo.title).toBe('Technology | MediaPlanPro Blog');
      expect(seo.description).toBe('Technology related articles');
      expect(seo.canonical).toBe('https://test.com/blog/category/technology');
      expect(seo.keywords).toContain('Technology');
    });

    it('should generate default description when none provided', () => {
      const categoryWithoutDescription = {
        ...mockCategory,
        description: undefined,
      };

      const seo = seoService.generateCategorySEO(categoryWithoutDescription, 3);

      expect(seo.description).toContain('Explore 3 articles about technology');
    });
  });

  describe('generateTagSEO', () => {
    const mockTag = {
      id: 'tag1',
      name: 'JavaScript',
      slug: 'javascript',
    };

    it('should generate tag SEO metadata', () => {
      const seo = seoService.generateTagSEO(mockTag, 8);

      expect(seo.title).toBe('JavaScript Articles | MediaPlanPro Blog');
      expect(seo.description).toContain('Discover 8 articles tagged with JavaScript');
      expect(seo.canonical).toBe('https://test.com/blog/tag/javascript');
      expect(seo.keywords).toContain('JavaScript');
    });
  });

  describe('generateBlogHomeSEO', () => {
    it('should generate blog homepage SEO metadata', () => {
      const seo = seoService.generateBlogHomeSEO();

      expect(seo.title).toBe('Marketing Strategy Blog | MediaPlanPro');
      expect(seo.description).toContain('expert insights on marketing strategies');
      expect(seo.canonical).toBe('https://test.com/blog');
      expect(seo.keywords).toContain('marketing strategy');
    });
  });

  describe('generateSitemapXML', () => {
    it('should generate valid XML sitemap', () => {
      const entries = [
        {
          url: 'https://test.com/',
          lastModified: new Date('2024-01-01'),
          changeFrequency: 'weekly' as const,
          priority: 1.0,
        },
        {
          url: 'https://test.com/blog',
          lastModified: new Date('2024-01-02'),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        },
      ];

      const xml = seoService.generateSitemapXML(entries);

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://test.com/</loc>');
      expect(xml).toContain('<loc>https://test.com/blog</loc>');
      expect(xml).toContain('<changefreq>weekly</changefreq>');
      expect(xml).toContain('<changefreq>daily</changefreq>');
      expect(xml).toContain('<priority>1</priority>');
      expect(xml).toContain('<priority>0.8</priority>');
    });
  });

  describe('generateRobotsTxt', () => {
    it('should generate robots.txt content', () => {
      const robotsTxt = seoService.generateRobotsTxt();

      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Sitemap: https://test.com/sitemap.xml');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toContain('Disallow: /api/');
      expect(robotsTxt).toContain('Allow: /api/blog/posts');
    });
  });

  describe('extractKeywords', () => {
    it('should extract keywords from content', () => {
      const content = `
        <h1>JavaScript Programming</h1>
        <p>JavaScript is a programming language used for web development.
        React is a JavaScript library for building user interfaces.
        Node.js allows JavaScript to run on the server.</p>
      `;

      const keywords = seoService.extractKeywords(content, 10);

      expect(keywords).toContain('javascript');
      expect(keywords).toContain('programming');
      // React appears only once, so it might not be in top 5 due to frequency sorting
      expect(keywords.length).toBeLessThanOrEqual(10);
      expect(keywords.length).toBeGreaterThan(0);
    });

    it('should filter out stop words', () => {
      const content = 'The quick brown fox jumps over the lazy dog';
      const keywords = seoService.extractKeywords(content);

      expect(keywords).not.toContain('the');
      expect(keywords).not.toContain('over');
      expect(keywords).toContain('quick');
      expect(keywords).toContain('brown');
    });

    it('should handle empty content', () => {
      const keywords = seoService.extractKeywords('');
      expect(keywords).toEqual([]);
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      // 200 words should take 1 minute
      const content = 'word '.repeat(200);
      const readingTime = seoService.calculateReadingTime(content);
      expect(readingTime).toBe(1);
    });

    it('should round up reading time', () => {
      // 250 words should take 2 minutes (rounded up from 1.25)
      const content = 'word '.repeat(250);
      const readingTime = seoService.calculateReadingTime(content);
      expect(readingTime).toBe(2);
    });

    it('should handle HTML content', () => {
      const content = '<p>' + 'word '.repeat(200) + '</p>';
      const readingTime = seoService.calculateReadingTime(content);
      expect(readingTime).toBe(1);
    });
  });

  describe('generateMetaDescription', () => {
    it('should return content as-is if under limit', () => {
      const content = 'This is a short description.';
      const description = seoService.generateMetaDescription(content, 160);
      expect(description).toBe('This is a short description.');
    });

    it('should truncate at sentence boundary', () => {
      const content = 'This is the first sentence. This is a very long second sentence that goes on and on and should be truncated because it exceeds the character limit.';
      const description = seoService.generateMetaDescription(content, 30);
      expect(description).toBe('This is the first sentence.');
    });

    it('should truncate at word boundary if no good sentence break', () => {
      const content = 'This is a very long sentence without any periods that goes on and on and should be truncated at a word boundary';
      const description = seoService.generateMetaDescription(content, 50);
      expect(description).toMatch(/\.\.\.$|word$/);
      expect(description.length).toBeLessThanOrEqual(53); // 50 + '...'
    });

    it('should handle HTML content', () => {
      const content = '<p>This is <strong>HTML</strong> content.</p>';
      const description = seoService.generateMetaDescription(content, 160);
      expect(description).toBe('This is HTML content.');
    });
  });
});

describe('SEOService with default base URL', () => {
  it('should use default base URL when none provided', () => {
    const seoService = new SEOService();
    const mockPost = {
      id: 'post1',
      title: 'Test',
      slug: 'test',
      content: 'content',
      excerpt: 'excerpt',
      status: 'PUBLISHED' as const,
      publishedAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      author: { id: 'user1', name: 'John', email: 'john@example.com' },
      category: { id: 'cat1', name: 'Tech', slug: 'tech' },
      tags: [],
    };

    const seo = seoService.generateBlogPostSEO(mockPost);
    expect(seo.canonical).toContain('mediaplanpro.com');
  });
});
