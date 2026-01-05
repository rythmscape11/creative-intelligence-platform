import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const robotsTxtGeneratorContent = {
  metadata: {
    title: 'Robots.txt Generator - Create SEO-Friendly Robots Files | Aureon One',
    description: 'Generate robots.txt files to control search engine crawling. Free tool for SEO specialists and webmasters.',
    keywords: ['robots.txt generator', 'robots file creator', 'SEO robots.txt', 'crawl control tool', 'search engine directives'],
  },

  hero: {
    title: 'Robots.txt Generator',
    subtitle: 'Control Search Engine Crawling',
    description: 'Generate custom robots.txt files to guide search engine crawlers, protect sensitive pages, and optimize crawl budget.',
    primaryCTA: 'Generate Robots.txt',
    secondaryCTA: 'Learn More',
  },

  quickAnswer: {
    question: 'What is Robots.txt?',
    answer: 'Robots.txt is a text file placed in your website\'s root directory that tells search engine crawlers which pages or sections to crawl or avoid. It controls crawl budget, protects sensitive content from indexing, and manages crawler access. Proper robots.txt configuration is essential for SEO, preventing crawlers from wasting resources on unimportant pages while ensuring important content gets crawled and indexed.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Create a Robots.txt File', level: 2 },
    { id: 'benefits', title: 'Benefits of Robots.txt', level: 2 },
    { id: 'syntax', title: 'Robots.txt Syntax Guide', level: 2 },
    { id: 'best-practices', title: 'Robots.txt Best Practices', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related SEO Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Select User-Agent', text: 'Choose which crawlers to target (all, Googlebot, Bingbot, specific bots).' },
    { name: 'Define Rules', text: 'Specify which directories or pages to allow or disallow crawling.' },
    { name: 'Add Sitemap', text: 'Include your XML sitemap URL to help crawlers discover content.' },
    { name: 'Set Crawl Delay', text: 'Optionally set crawl delay to control crawler speed (if needed).' },
    { name: 'Generate File', text: 'Get properly formatted robots.txt file ready for deployment.' },
    { name: 'Upload and Test', text: 'Upload to your site root and test using Google Search Console.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is a robots.txt file and why do I need one?',
      answer: 'A robots.txt file is a text file in your website\'s root directory (yoursite.com/robots.txt) that instructs search engine crawlers which pages to crawl or ignore. You need one to control crawl budget (prevent crawlers from wasting time on unimportant pages), protect sensitive content (admin pages, private directories), prevent duplicate content issues (staging sites, parameter URLs), and guide crawlers to important content via sitemap reference. While not mandatory, robots.txt is an essential SEO tool for any website with more than a few pages. It\'s the first file crawlers check when visiting your site.',
    },
    {
      question: 'What is the basic robots.txt syntax?',
      answer: 'Basic robots.txt syntax includes: User-agent (specifies which crawler the rules apply to), Disallow (directories/pages to block), Allow (exceptions to disallow rules), and Sitemap (XML sitemap location). Example: "User-agent: * / Disallow: /admin/ / Allow: /admin/public/ / Sitemap: https://yoursite.com/sitemap.xml". User-agent: * applies to all crawlers. Disallow: / blocks entire site. Disallow: (empty) allows everything. Rules are case-sensitive. Use # for comments. Each user-agent section can have multiple disallow/allow directives. Test syntax in Google Search Console\'s robots.txt tester.',
    },
    {
      question: 'What should I block in robots.txt?',
      answer: 'Block admin areas (/wp-admin/, /admin/), private directories (/private/, /internal/), duplicate content (parameter URLs, print versions, session IDs), staging/development sites, search result pages, thank-you pages, shopping cart pages (unless you want them indexed), and resource-heavy pages that waste crawl budget. However, don\'t block CSS, JavaScript, or images—Google needs these to render pages properly. Don\'t use robots.txt for sensitive data—it doesn\'t prevent access, only crawling. Use noindex meta tags or password protection for truly private content. Focus on optimizing crawl budget for important pages.',
    },
    {
      question: 'What is the difference between robots.txt and meta robots tags?',
      answer: 'Robots.txt controls whether crawlers can access pages (crawling), while meta robots tags control whether pages can be indexed (indexing). Robots.txt blocks crawlers before they access pages. Meta robots tags (noindex, nofollow) are in page HTML and tell crawlers not to index the page or follow links, but crawlers must access the page to see these tags. Use robots.txt to save crawl budget on unimportant pages. Use noindex for pages you want crawled (to follow links) but not indexed. Don\'t use both—if robots.txt blocks a page, crawlers can\'t see the noindex tag.',
    },
    {
      question: 'How do I test my robots.txt file?',
      answer: 'Test robots.txt using Google Search Console\'s robots.txt Tester tool (under Legacy tools), which shows your current robots.txt, lets you test URLs to see if they\'re blocked, and highlights syntax errors. Also test by visiting yoursite.com/robots.txt to verify it\'s accessible. Use online robots.txt validators to check syntax. Test with different user-agents to ensure rules work as intended. After changes, monitor Google Search Console for crawl errors or unexpected blocking. Remember: robots.txt changes take effect immediately but may take time for crawlers to re-crawl and respect new rules.',
    },
    {
      question: 'Can robots.txt improve my SEO?',
      answer: 'Yes, indirectly. Robots.txt improves SEO by optimizing crawl budget—ensuring crawlers spend time on important pages rather than wasting it on admin pages, duplicates, or low-value content. This is especially important for large sites where crawl budget is limited. Robots.txt also prevents duplicate content issues by blocking parameter URLs and staging sites. However, robots.txt doesn\'t directly improve rankings. It\'s a technical SEO foundation ensuring crawlers efficiently discover and index your best content. Misconfigured robots.txt can severely hurt SEO by blocking important pages—always test carefully.',
    },
    {
      question: 'What is crawl budget and why does it matter?',
      answer: 'Crawl budget is the number of pages search engines crawl on your site within a given timeframe. It\'s determined by crawl rate limit (how fast crawlers can crawl without overloading your server) and crawl demand (how much Google wants to crawl your site based on popularity and freshness). Crawl budget matters for large sites (10,000+ pages) where Google may not crawl everything frequently. Optimize crawl budget by blocking low-value pages in robots.txt, fixing crawl errors, improving site speed, and updating content regularly. Small sites (under 1,000 pages) rarely have crawl budget issues.',
    },
    {
      question: 'Should I block search engines from my entire site?',
      answer: 'Only block your entire site (Disallow: /) during development, for staging sites, or if you don\'t want any search engine visibility. For production sites, blocking everything prevents all organic search traffic—a critical mistake. If you accidentally block your site, remove the disallow rule immediately and request re-indexing in Google Search Console. Common mistake: leaving "Disallow: /" from development when launching. Always verify robots.txt before launch. For temporary blocking, use password protection or noindex tags instead—they\'re easier to remove and less catastrophic if forgotten.',
    },
    {
      question: 'How do I include my sitemap in robots.txt?',
      answer: 'Include your sitemap by adding "Sitemap: https://yoursite.com/sitemap.xml" at the end of your robots.txt file. Use the full absolute URL including https://. You can include multiple sitemaps if you have them (sitemap_index.xml, image_sitemap.xml, etc.). The sitemap directive helps crawlers discover your content more efficiently. While you should also submit sitemaps directly in Google Search Console and Bing Webmaster Tools, including them in robots.txt provides an additional discovery method. Update the sitemap URL in robots.txt if you change sitemap location.',
    },
    {
      question: 'What are common robots.txt mistakes?',
      answer: 'Common mistakes include blocking entire site accidentally (Disallow: /), blocking CSS/JavaScript (prevents proper rendering), using robots.txt for sensitive data (it\'s publicly accessible), incorrect syntax (missing colons, wrong capitalization), blocking important pages (products, blog posts), not including sitemap reference, using noindex in robots.txt (doesn\'t work—use meta tags), and forgetting to update after site changes. Always test robots.txt before deploying. Review it quarterly to ensure it still matches your site structure. One robots.txt mistake can tank your entire SEO—treat it with care.',
    },
    {
      question: 'Do all search engines respect robots.txt?',
      answer: 'Major search engines (Google, Bing, Yahoo, Yandex) respect robots.txt, but it is not legally enforceable—it is a voluntary protocol. Malicious bots and scrapers often ignore robots.txt. For truly private content, use password protection, authentication, or noindex tags—do not rely on robots.txt. Some crawlers (like archive.org) have their own user-agents you can block specifically. Social media crawlers (Facebook, Twitter) generally respect robots.txt but may have specific rules. Robots.txt is effective for legitimate search engines but not a security measure. Monitor server logs for bots ignoring robots.txt.',
    },
    {
      question: 'How do I create a robots.txt file for WordPress?',
      answer: 'WordPress automatically generates a basic robots.txt file at yoursite.com/robots.txt. To customize it, use an SEO plugin (Yoast SEO, Rank Math, All in One SEO) which provide robots.txt editors, or create a physical robots.txt file and upload it to your site root (overrides WordPress virtual file). Common WordPress robots.txt blocks /wp-admin/ (except admin-ajax.php for functionality), /wp-includes/, and /wp-content/plugins/ (except necessary resources). Do not block /wp-content/themes/ as it contains CSS/JavaScript needed for rendering. Test thoroughly after changes—WordPress robots.txt mistakes are common.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'XML Sitemap Generator',
      description: 'Create XML sitemaps for search engines',
      url: '/tools/seo/xml-sitemap-generator-enhanced',
      category: 'SEO',
    },
    {
      name: 'Schema Generator',
      description: 'Generate schema markup for rich results',
      url: '/tools/seo/schema-generator-enhanced',
      category: 'SEO',
    },
    {
      name: 'SERP Preview',
      description: 'Preview how your page appears in search results',
      url: '/tools/seo/serp-preview-enhanced',
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

