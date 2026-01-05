/**
 * IndexNow Service - Instant Search Engine Indexing
 * 
 * IndexNow is a protocol that allows websites to instantly notify search engines
 * about content changes. Supported by Bing, Yandex, Seznam, and Naver.
 * 
 * @see https://www.indexnow.org/
 */

import { logger } from './logger-service';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '1234567890abcdef1234567890abcdef';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.aureonone.in';

// IndexNow endpoints (submitting to one notifies all participating search engines)
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

interface IndexNowResponse {
  success: boolean;
  endpoint?: string;
  statusCode?: number;
  error?: string;
}

/**
 * Submit a single URL to IndexNow for instant indexing
 */
export async function submitUrlToIndexNow(url: string): Promise<IndexNowResponse> {
  try {
    const payload = {
      host: new URL(BASE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/indexnow-key.txt`,
      urlList: [url],
    };

    // Try Bing endpoint first (most reliable)
    const response = await fetch(INDEXNOW_ENDPOINTS[1], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      logger.info(`IndexNow: Successfully submitted ${url}`, {
        statusCode: response.status,
      });
      return {
        success: true,
        endpoint: INDEXNOW_ENDPOINTS[1],
        statusCode: response.status,
      };
    }

    logger.warn(`IndexNow: Failed to submit ${url}`, {
      statusCode: response.status,
      statusText: response.statusText,
    });

    return {
      success: false,
      statusCode: response.status,
      error: response.statusText,
    };
  } catch (error) {
    logger.error('IndexNow: Error submitting URL', error instanceof Error ? error : undefined, { url });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Submit multiple URLs to IndexNow (batch submission)
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<IndexNowResponse[]> {
  // IndexNow supports up to 10,000 URLs per request, but we'll batch in groups of 100
  const batchSize = 100;
  const results: IndexNowResponse[] = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);

    try {
      const payload = {
        host: new URL(BASE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/indexnow-key.txt`,
        urlList: batch,
      };

      const response = await fetch(INDEXNOW_ENDPOINTS[1], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok || response.status === 202) {
        logger.info(`IndexNow: Successfully submitted batch of ${batch.length} URLs`, {
          statusCode: response.status,
        });
        results.push({
          success: true,
          endpoint: INDEXNOW_ENDPOINTS[1],
          statusCode: response.status,
        });
      } else {
        logger.warn(`IndexNow: Failed to submit batch`, {
          statusCode: response.status,
          batchSize: batch.length,
        });
        results.push({
          success: false,
          statusCode: response.status,
          error: response.statusText,
        });
      }

      // Rate limiting: wait 1 second between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      logger.error('IndexNow: Error submitting batch', error instanceof Error ? error : undefined, { batchSize: batch.length });
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Submit all important pages to IndexNow
 */
export async function submitAllPagesToIndexNow(): Promise<{
  total: number;
  successful: number;
  failed: number;
}> {
  const urls: string[] = [
    // Core pages
    BASE_URL,
    `${BASE_URL}/tools`,
    `${BASE_URL}/strategy`,
    `${BASE_URL}/pricing`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,

    // All tool pages (regular versions - higher SEO priority)
    `${BASE_URL}/tools/advertising/roi-calculator`,
    `${BASE_URL}/tools/advertising/budget-allocator`,
    `${BASE_URL}/tools/advertising/cpc-cpm-calculator`,
    `${BASE_URL}/tools/advertising/ad-copy-generator`,
    `${BASE_URL}/tools/advertising/landing-page-analyzer`,
    `${BASE_URL}/tools/content/headline-analyzer`,
    `${BASE_URL}/tools/content/email-subject-tester`,
    `${BASE_URL}/tools/content/meta-description-generator`,
    `${BASE_URL}/tools/content/blog-outline-generator`,
    `${BASE_URL}/tools/content/readability-scorer`,
    `${BASE_URL}/tools/content/keyword-density-checker`,
    `${BASE_URL}/tools/content/social-caption-generator`,
    `${BASE_URL}/tools/content/content-calendar-generator`,
    `${BASE_URL}/tools/seo/keyword-research`,
    `${BASE_URL}/tools/seo/serp-preview`,
    `${BASE_URL}/tools/seo/page-speed-analyzer`,
    `${BASE_URL}/tools/seo/backlink-checker`,
    `${BASE_URL}/tools/seo/schema-generator`,
    `${BASE_URL}/tools/seo/robots-txt-generator`,
    `${BASE_URL}/tools/seo/xml-sitemap-generator`,
    `${BASE_URL}/tools/social/engagement-calculator`,
    `${BASE_URL}/tools/social/hashtag-generator`,
    `${BASE_URL}/tools/social/best-time-to-post`,
    `${BASE_URL}/tools/social/utm-builder`,
    `${BASE_URL}/tools/social/image-resizer`,
    `${BASE_URL}/tools/social/social-audit-tool`,
    `${BASE_URL}/tools/email/email-preview`,
    `${BASE_URL}/tools/email/spam-score-checker`,
    `${BASE_URL}/tools/email/list-segmentation-calculator`,
    `${BASE_URL}/tools/email/signature-generator`,

    // Growth Suite
    `${BASE_URL}/growth-suite`,
    `${BASE_URL}/growth-suite/attribution`,
    `${BASE_URL}/growth-suite/competitors`,
    `${BASE_URL}/growth-suite/experiments`,
    `${BASE_URL}/growth-suite/heatmaps`,
    `${BASE_URL}/growth-suite/repurposer`,
    `${BASE_URL}/growth-suite/seo`,
    `${BASE_URL}/growth-suite/widgets`,
  ];

  const results = await submitUrlsToIndexNow(urls);
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  logger.info('IndexNow: Bulk submission complete', {
    total: urls.length,
    successful,
    failed,
  });

  return {
    total: urls.length,
    successful,
    failed,
  };
}

/**
 * Generate IndexNow key file content
 */
export function generateIndexNowKeyFile(): string {
  return INDEXNOW_KEY;
}

