/**
 * Script to submit all pages to IndexNow for instant indexing
 * 
 * Usage:
 *   npx tsx scripts/submit-to-indexnow.ts
 * 
 * Or with custom URL:
 *   npx tsx scripts/submit-to-indexnow.ts https://www.mediaplanpro.com/tools/advertising/roi-calculator
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '1234567890abcdef1234567890abcdef';
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mediaplanpro.com';

interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

async function submitToIndexNow(urls: string[]): Promise<void> {
  const payload: IndexNowPayload = {
    host: new URL(BASE_URL).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/indexnow-key.txt`,
    urlList: urls,
  };

  console.log(`\n📤 Submitting ${urls.length} URL(s) to IndexNow...`);
  console.log(`Host: ${payload.host}`);
  console.log(`Key Location: ${payload.keyLocation}\n`);

  try {
    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 202) {
      console.log(`✅ Success! Status: ${response.status}`);
      console.log(`\n🎉 Your URLs have been submitted to:`);
      console.log(`   - Bing`);
      console.log(`   - Yandex`);
      console.log(`   - Seznam`);
      console.log(`   - Naver`);
      console.log(`\nIndexing typically happens within 1-24 hours.\n`);
    } else {
      console.error(`❌ Failed! Status: ${response.status}`);
      const text = await response.text();
      console.error(`Response: ${text}`);
    }
  } catch (error) {
    console.error(`❌ Error:`, error);
  }
}

async function main() {
  const customUrl = process.argv[2];

  if (customUrl) {
    // Submit single custom URL
    console.log(`\n🎯 Submitting custom URL: ${customUrl}`);
    await submitToIndexNow([customUrl]);
    return;
  }

  // Submit all important pages
  const urls: string[] = [
    // Core pages
    BASE_URL,
    `${BASE_URL}/tools`,
    `${BASE_URL}/strategy`,
    `${BASE_URL}/pricing`,
    `${BASE_URL}/blog`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,

    // Advertising Tools
    `${BASE_URL}/tools/advertising/roi-calculator`,
    `${BASE_URL}/tools/advertising/budget-allocator`,
    `${BASE_URL}/tools/advertising/cpc-cpm-calculator`,
    `${BASE_URL}/tools/advertising/ad-copy-generator`,
    `${BASE_URL}/tools/advertising/landing-page-analyzer`,

    // Content Tools
    `${BASE_URL}/tools/content/headline-analyzer`,
    `${BASE_URL}/tools/content/email-subject-tester`,
    `${BASE_URL}/tools/content/meta-description-generator`,
    `${BASE_URL}/tools/content/blog-outline-generator`,
    `${BASE_URL}/tools/content/readability-scorer`,
    `${BASE_URL}/tools/content/keyword-density-checker`,
    `${BASE_URL}/tools/content/social-caption-generator`,
    `${BASE_URL}/tools/content/content-calendar-generator`,

    // SEO Tools
    `${BASE_URL}/tools/seo/keyword-research`,
    `${BASE_URL}/tools/seo/serp-preview`,
    `${BASE_URL}/tools/seo/page-speed-analyzer`,
    `${BASE_URL}/tools/seo/backlink-checker`,
    `${BASE_URL}/tools/seo/schema-generator`,
    `${BASE_URL}/tools/seo/robots-txt-generator`,
    `${BASE_URL}/tools/seo/xml-sitemap-generator`,

    // Social Tools
    `${BASE_URL}/tools/social/engagement-calculator`,
    `${BASE_URL}/tools/social/hashtag-generator`,
    `${BASE_URL}/tools/social/best-time-to-post`,
    `${BASE_URL}/tools/social/utm-builder`,
    `${BASE_URL}/tools/social/image-resizer`,
    `${BASE_URL}/tools/social/social-audit-tool`,

    // Email Tools
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

  console.log(`\n🚀 MediaPlanPro - IndexNow Bulk Submission`);
  console.log(`==========================================\n`);

  // Submit in batches of 100 (IndexNow limit is 10,000)
  const batchSize = 100;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(urls.length / batchSize)}`);
    await submitToIndexNow(batch);

    // Wait 1 second between batches to avoid rate limiting
    if (i + batchSize < urls.length) {
      console.log(`⏳ Waiting 1 second before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✨ All done! Total URLs submitted: ${urls.length}\n`);
  console.log(`📊 Next steps:`);
  console.log(`   1. Check indexing status in Bing Webmaster Tools`);
  console.log(`   2. Submit sitemap to Google Search Console`);
  console.log(`   3. Monitor "site:mediaplanpro.com" in Google\n`);
}

main().catch(console.error);

