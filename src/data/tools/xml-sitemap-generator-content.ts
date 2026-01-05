import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const xmlSitemapGeneratorContent = {
  metadata: {
    title: 'XML Sitemap Generator - Create SEO Sitemaps | Aureon One',
    description: 'Generate XML sitemaps for better search engine crawling and indexing. Free tool for SEO specialists and webmasters.',
    keywords: ['XML sitemap generator', 'sitemap creator', 'SEO sitemap tool', 'sitemap.xml generator', 'search engine sitemap'],
  },

  hero: {
    title: 'XML Sitemap Generator',
    subtitle: 'Create XML Sitemaps for Search Engines',
    description: 'Generate comprehensive XML sitemaps to help search engines discover and index your content efficiently. Improve crawl coverage and SEO.',
    primaryCTA: 'Generate Sitemap',
    secondaryCTA: 'Learn More',
  },

  quickAnswer: {
    question: 'What is an XML Sitemap?',
    answer: 'An XML sitemap is a file listing all important pages on your website, helping search engines discover and crawl content efficiently. It includes URLs, last modification dates, change frequency, and priority levels. XML sitemaps are essential for SEO, especially for large sites, new sites, or sites with poor internal linking. They ensure search engines find and index all your valuable content.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Create an XML Sitemap', level: 2 },
    { id: 'benefits', title: 'Benefits of XML Sitemaps', level: 2 },
    { id: 'sitemap-elements', title: 'XML Sitemap Elements', level: 2 },
    { id: 'best-practices', title: 'Sitemap Best Practices', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related SEO Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Enter Website URL', text: 'Input your website URL to crawl and discover pages.' },
    { name: 'Configure Settings', text: 'Set crawl depth, change frequency, and priority levels.' },
    { name: 'Generate Sitemap', text: 'Create XML sitemap with all discovered URLs and metadata.' },
    { name: 'Review URLs', text: 'Verify all important pages are included and remove unwanted URLs.' },
    { name: 'Upload Sitemap', text: 'Upload sitemap.xml to your website root directory.' },
    { name: 'Submit to Search Engines', text: 'Submit sitemap in Google Search Console and Bing Webmaster Tools.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is an XML sitemap and why do I need one?',
      answer: 'An XML sitemap is a file (sitemap.xml) listing all important pages on your website with metadata like last modification date, change frequency, and priority. You need one to help search engines discover all your pages efficiently, ensure new content gets indexed quickly, provide metadata about page importance and update frequency, and improve crawl efficiency for large or complex sites. XML sitemaps are especially important for new sites (limited external links), large sites (thousands of pages), sites with poor internal linking, and sites with frequently updated content. While not mandatory, sitemaps significantly improve indexing coverage.',
    },
    {
      question: 'What should I include in my XML sitemap?',
      answer: 'Include all important, indexable pages: main content pages, blog posts, product pages, category pages, and landing pages. Exclude admin pages, duplicate content, pages blocked by robots.txt, pages with noindex tags, thank-you pages, and low-value pages (tags, archives). Focus on pages you want indexed and ranked. For large sites, create multiple sitemaps (one for blog, one for products, etc.) and use a sitemap index file. Prioritize quality over quantity—a focused sitemap of 100 important pages is better than 10,000 pages including low-value content.',
    },
    {
      question: 'What is the difference between XML sitemaps and HTML sitemaps?',
      answer: 'XML sitemaps are for search engines—machine-readable files helping crawlers discover and index content. HTML sitemaps are for users—human-readable pages helping visitors navigate your site. XML sitemaps include metadata (last modified, priority) and aren\'t typically linked from your site. HTML sitemaps are regular webpages linked from your footer or navigation. Both serve different purposes: XML for SEO and crawling, HTML for user experience and navigation. Most sites need XML sitemaps; HTML sitemaps are optional but helpful for large sites with complex navigation.',
    },
    {
      question: 'How do I submit my sitemap to Google?',
      answer: 'Submit sitemaps to Google via Google Search Console: verify your site ownership, go to Sitemaps section in the left menu, enter your sitemap URL (usually yoursite.com/sitemap.xml), and click Submit. Google will crawl and process your sitemap. Monitor the Sitemaps report for errors or warnings. You can also reference your sitemap in robots.txt (Sitemap: https://yoursite.com/sitemap.xml) for automatic discovery. Resubmit sitemap after significant site changes. Google automatically recrawls sitemaps periodically, but manual submission speeds up discovery of new content.',
    },
    {
      question: 'How often should I update my XML sitemap?',
      answer: 'Update your sitemap automatically whenever content changes—most CMSs and plugins do this automatically. For static sites, update manually when adding new pages, removing pages, or significantly updating content. Submit updated sitemaps to Google Search Console after major changes. Google recrawls sitemaps based on your site\'s crawl frequency (daily for popular sites, weekly for smaller sites). Dynamic sitemaps that update automatically are ideal. For sites with frequent updates (news, e-commerce), real-time sitemap updates ensure new content gets indexed quickly. Static sitemaps should be updated at least monthly.',
    },
    {
      question: 'What is sitemap priority and how should I use it?',
      answer: 'Priority is a value (0.0 to 1.0) indicating a page\'s relative importance on your site. However, Google largely ignores priority—it\'s a hint, not a directive. Use priority to indicate your most important pages (1.0 for homepage, 0.8 for main category pages, 0.6 for subcategories, 0.4 for individual posts). Don\'t set everything to 1.0—it defeats the purpose. Modern SEO focuses less on priority and more on ensuring all important pages are in the sitemap. Last modification date and change frequency are more useful signals. Don\'t spend excessive time optimizing priority—focus on content quality and internal linking.',
    },
    {
      question: 'What is change frequency in XML sitemaps?',
      answer: 'Change frequency (changefreq) tells search engines how often a page typically updates: always, hourly, daily, weekly, monthly, yearly, or never. Like priority, Google treats this as a hint, not a command. Use realistic frequencies: homepage (daily), blog (weekly), product pages (weekly), static pages (monthly). Don\'t set everything to "always" hoping for more frequent crawls—it can backfire. Modern Google largely ignores changefreq, focusing instead on actual content changes detected during crawls. Include it for completeness but don\'t expect it to significantly impact crawl frequency. Actual content updates matter more than declared frequency.',
    },
    {
      question: 'Can I have multiple sitemaps?',
      answer: 'Yes, use multiple sitemaps for large sites (over 50,000 URLs), different content types (blog, products, videos, images), or better organization. Create a sitemap index file (sitemap_index.xml) listing all your sitemaps. Google supports up to 50,000 URLs per sitemap and 50MB file size (uncompressed). Multiple sitemaps help organize large sites, allow different update frequencies for different content types, and make sitemap management easier. For example: sitemap_posts.xml, sitemap_products.xml, sitemap_pages.xml, all referenced in sitemap_index.xml. Submit the index file to Google Search Console.',
    },
    {
      question: 'Do I need a sitemap if my site is small?',
      answer: 'Small sites (under 100 pages) with good internal linking may not strictly need sitemaps—Google can discover pages through crawling. However, sitemaps are still beneficial for ensuring all pages get indexed, speeding up discovery of new content, providing metadata about page importance, and serving as a backup discovery method. Creating a sitemap is easy (especially with CMS plugins) and has no downside. Even small sites benefit from sitemaps. As your site grows, having a sitemap infrastructure in place is valuable. Best practice: create a sitemap regardless of site size.',
    },
    {
      question: 'What are common XML sitemap errors?',
      answer: 'Common errors include exceeding 50,000 URL limit per sitemap, exceeding 50MB file size, including URLs blocked by robots.txt, including noindex pages, using relative URLs instead of absolute URLs, incorrect XML formatting, including redirect URLs, listing non-canonical URLs, and forgetting to update after site changes. These errors prevent proper indexing. Check Google Search Console\'s Sitemaps report for errors. Use sitemap validators to verify XML formatting. Ensure all URLs are accessible, indexable, and canonical. Fix errors promptly to maintain optimal crawl coverage.',
    },
    {
      question: 'Should I include images and videos in my sitemap?',
      answer: 'Yes, create separate image and video sitemaps or include image/video tags in your main sitemap. Image sitemaps help images appear in Google Image Search. Video sitemaps enable video rich results in search. Include image URL, caption, title, and license info. For videos, include thumbnail URL, title, description, duration, and upload date. Image and video sitemaps are especially important if content is not easily discoverable through crawling. They provide metadata search engines cannot always extract from pages. Use specialized sitemap formats for images and videos for best results.',
    },
    {
      question: 'How do I create a sitemap for WordPress?',
      answer: 'WordPress 5.5+ includes basic XML sitemap functionality at yoursite.com/wp-sitemap.xml. For advanced features, use SEO plugins: Yoast SEO (comprehensive sitemap with customization), Rank Math (advanced sitemap options), All in One SEO (sitemap with priority and frequency settings), or Google XML Sitemaps (dedicated sitemap plugin). Plugins automatically update sitemaps when content changes, allow excluding specific content types or pages, and provide submission to search engines. Most SEO plugins include sitemap functionality—no need for separate sitemap plugins. Configure plugin settings to exclude unwanted content (tags, archives) for cleaner sitemaps.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Robots.txt Generator',
      description: 'Create robots.txt files for crawl control',
      url: '/tools/seo/robots-txt-generator-enhanced',
      category: 'SEO',
    },
    {
      name: 'Schema Generator',
      description: 'Generate schema markup for rich results',
      url: '/tools/seo/schema-generator-enhanced',
      category: 'SEO',
    },
    {
      name: 'Backlink Checker',
      description: 'Analyze your backlink profile',
      url: '/tools/seo/backlink-checker-enhanced',
      category: 'SEO',
    },
    {
      name: 'Page Speed Analyzer',
      description: 'Test and optimize page loading speed',
      url: '/tools/seo/page-speed-analyzer-enhanced',
      category: 'SEO',
    },
  ] as RelatedTool[],
};

