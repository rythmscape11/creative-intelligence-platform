import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mediaplanpro.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/agency/portal/',
          '/_next/',
          '/auth/',
          '/sign-in',
          '/sign-up',
          '/private/',
          '/*.json$',
        ],
      },
      // Google Search Bot - explicit rules
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/blog/',
          '/tools/',
          '/services/',
          '/resources/',
          '/pricing',
          '/about',
          '/contact',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/agency/portal/',
        ],
      },
      // Bing Search Bot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/agency/portal/',
        ],
      },
      // Explicitly allow Semrush SiteAuditBot for SEO auditing
      {
        userAgent: 'SiteAuditBot',
        allow: '/',
      },
      // Block AI crawlers to protect content
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/'],
      },
      {
        userAgent: 'Google-Extended',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}


