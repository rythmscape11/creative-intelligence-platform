export interface RobotsTxtConfig {
  allowAll: boolean;
  disallowPaths: string[];
  sitemapUrl: string;
  crawlDelay?: number;
}

export function generateRobotsTxt(config: RobotsTxtConfig): string {
  let robotsTxt = '';

  if (config.allowAll) {
    robotsTxt += 'User-agent: *\n';
    robotsTxt += 'Allow: /\n\n';
  } else {
    robotsTxt += 'User-agent: *\n';
    if (config.disallowPaths.length > 0) {
      config.disallowPaths.forEach(path => {
        robotsTxt += `Disallow: ${path}\n`;
      });
    } else {
      robotsTxt += 'Disallow:\n';
    }
    robotsTxt += '\n';
  }

  if (config.crawlDelay && config.crawlDelay > 0) {
    robotsTxt += `Crawl-delay: ${config.crawlDelay}\n\n`;
  }

  if (config.sitemapUrl) {
    robotsTxt += `Sitemap: ${config.sitemapUrl}\n`;
  }

  return robotsTxt.trim();
}

export const commonDisallowPaths = [
  '/admin/',
  '/private/',
  '/tmp/',
  '/cgi-bin/',
  '/*.json$',
  '/*.xml$',
  '/api/',
  '/wp-admin/',
  '/wp-includes/'
];

