import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const serpPreviewContent = {
  metadata: {
    title: 'SERP Preview Tool - Preview Google Search Results | Aureon One',
    description: 'Preview how your page appears in Google search results. Test titles, meta descriptions, and URLs before publishing.',
    keywords: ['SERP preview tool', 'Google search preview', 'meta description preview', 'search result simulator', 'title tag preview'],
  },

  hero: {
    title: 'SERP Preview Tool',
    subtitle: 'Preview Your Google Search Appearance',
    description: 'See how your page title, meta description, and URL appear in Google search results. Optimize for maximum click-through rates.',
    primaryCTA: 'Preview SERP',
    secondaryCTA: 'Learn Optimization',
  },

  quickAnswer: {
    question: 'What is a SERP Preview?',
    answer: 'A SERP (Search Engine Results Page) preview shows how your webpage will appear in Google search results, including title tag, meta description, and URL. It helps optimize these elements for maximum click-through rates by showing character limits, truncation, and visual appearance before publishing. SERP preview tools ensure your search listings are compelling and properly formatted.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the SERP Preview Tool', level: 2 },
    { id: 'benefits', title: 'Benefits of SERP Optimization', level: 2 },
    { id: 'optimization', title: 'Optimizing Search Appearance', level: 2 },
    { id: 'best-practices', title: 'SERP Best Practices', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related SEO Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Enter Title Tag', text: 'Input your page title (50-60 characters for optimal display).' },
    { name: 'Add Meta Description', text: 'Enter meta description (150-160 characters recommended).' },
    { name: 'Input URL', text: 'Add your page URL to see how it displays in search results.' },
    { name: 'Preview Result', text: 'See real-time preview of how your listing appears in Google.' },
    { name: 'Check Truncation', text: 'Verify title and description aren\'t cut off with "...".' },
    { name: 'Optimize and Test', text: 'Adjust elements for maximum appeal and retest until optimal.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is a SERP and why does it matter?',
      answer: 'SERP (Search Engine Results Page) is the page search engines display in response to a query. It matters because your SERP appearance—title, description, URL, and rich results—determines whether users click your listing or competitors\'. Even if you rank #1, poor SERP presentation can result in low click-through rates. Optimized SERP listings can increase CTR by 20-30%, driving significantly more traffic from the same rankings. SERP optimization is as important as ranking itself—you need both visibility and compelling presentation to maximize organic traffic.',
    },
    {
      question: 'What is the ideal title tag length?',
      answer: 'Ideal title tag length is 50-60 characters (approximately 600 pixels). Google typically displays up to 60 characters on desktop and slightly less on mobile. Titles longer than 60 characters get truncated with "..." cutting off important information. Shorter titles (under 40 characters) may not fully utilize available space. Front-load important keywords and value propositions in the first 50 characters to ensure they display even if truncated. Character count matters more than word count. Test titles in SERP preview tools to verify they display properly without truncation.',
    },
    {
      question: 'How long should my meta description be?',
      answer: 'Optimal meta description length is 150-160 characters (approximately 920 pixels). Google displays up to 155-160 characters on desktop and slightly less on mobile. Descriptions longer than 160 characters get truncated. Shorter descriptions (under 120 characters) don\'t fully utilize available space to convince users to click. Front-load key information and value propositions in the first 120 characters. While Google sometimes shows longer descriptions (up to 320 characters) for certain queries, 150-160 characters is the safe target for consistent display across all searches.',
    },
    {
      question: 'Can I control how my page appears in search results?',
      answer: 'You can influence but not completely control SERP appearance. Google uses your title tag and meta description most of the time, but may override them with auto-generated content if it better matches the search query, if your meta tags are missing or poor quality, or if they\'re keyword-stuffed or misleading. To maximize control, write compelling, accurate title tags and meta descriptions, ensure they match page content, include target keywords naturally, and avoid keyword stuffing or clickbait. Google respects well-written meta tags that accurately represent content and satisfy user intent.',
    },
    {
      question: 'What are rich results and how do I get them?',
      answer: 'Rich results are enhanced search listings with additional visual elements: star ratings, prices, images, FAQs, breadcrumbs, or event dates. Get them by implementing structured data (schema markup) for your content type, ensuring high content quality (Google only shows rich results for quality content), following Google\'s structured data guidelines, and testing with Google\'s Rich Results Test. Common rich result types include Product (ratings, prices), Recipe (cooking time, calories), Event (dates, locations), FAQ (expandable questions), and HowTo (step-by-step instructions). Rich results significantly improve visibility and CTR but aren\'t guaranteed even with correct schema.',
    },
    {
      question: 'How do I write compelling title tags?',
      answer: 'Write compelling title tags by including primary keyword near the beginning, clearly stating the page\'s value proposition, using power words that attract attention (guide, ultimate, proven, free), including numbers when relevant (7 Ways, Top 10), matching search intent for target keywords, keeping it under 60 characters, and making it unique from competitors. Avoid keyword stuffing, generic titles, or clickbait that doesn\'t match content. Test different approaches: question-based, benefit-focused, or how-to formats. Analyze competitor titles for inspiration. The best titles balance SEO optimization with compelling copywriting that drives clicks.',
    },
    {
      question: 'Should I include my brand name in title tags?',
      answer: 'Include brand name in title tags for homepage, about page, and brand-focused pages. For other pages, include brand name at the end if space allows: "Primary Keyword - Secondary Keyword | Brand Name". Brand inclusion builds recognition, improves click-through for branded searches, and provides context. However, prioritize keywords and value propositions—don\'t sacrifice them for branding. For well-known brands, brand name increases CTR. For unknown brands, focus on value proposition. Test with and without brand name to see what performs better. Many sites use templates: "Page Title | Brand Name" for consistency.',
    },
    {
      question: 'What is the difference between title tags and H1 headings?',
      answer: 'Title tags appear in search results, browser tabs, and social shares—they\'re for search engines and users before they visit. H1 headings appear on the page itself—they\'re for users already on your site. Title tags should be optimized for CTR and keywords (50-60 characters). H1s can be longer and more descriptive. They can be identical but don\'t have to be. Often, title tags are more keyword-focused while H1s are more user-friendly. Both are important for SEO. Title tags affect whether users click; H1s affect whether they stay and engage.',
    },
    {
      question: 'How do URLs appear in search results?',
      answer: 'URLs appear below the title in search results, showing the page\'s web address. Google displays breadcrumb navigation if you have breadcrumb schema markup, otherwise shows the full URL path. Optimize URLs by keeping them short and descriptive, including target keywords, using hyphens to separate words, avoiding unnecessary parameters or numbers, and using lowercase letters. Clean, readable URLs improve CTR and user trust. URLs like "site.com/seo-guide" perform better than "site.com/page?id=12345". Implement breadcrumb schema to show navigation path instead of full URL for better appearance.',
    },
    {
      question: 'Can I test how my page looks on mobile search?',
      answer: 'Yes, test mobile SERP appearance using SERP preview tools with mobile view options, Google\'s Mobile-Friendly Test, or by searching on actual mobile devices. Mobile displays slightly fewer characters for titles (50-55) and descriptions (120-140) than desktop. Mobile SERPs also show different rich results and features. Since 60-70% of searches occur on mobile, mobile SERP optimization is crucial. Ensure titles and descriptions work well when truncated for mobile. Test on actual devices when possible—emulators don\'t always match real mobile search appearance. Prioritize mobile optimization in mobile-first indexing era.',
    },
    {
      question: 'How often should I update my title tags and meta descriptions?',
      answer: 'Update title tags and meta descriptions when page content significantly changes, when targeting new keywords, when CTR is below average for your position, during regular SEO audits (quarterly or bi-annually), when launching new products or services, and when seasonal or time-sensitive information becomes outdated. Monitor performance in Google Search Console—pages with low CTR relative to position are candidates for optimization. Don\'t change too frequently as it takes time to measure impact. Test new versions against old when possible. Regular updates keep SERP listings relevant and optimized for current search behavior.',
    },
    {
      question: 'What are common SERP optimization mistakes?',
      answer: 'Common mistakes include exceeding character limits (causing truncation), using duplicate titles/descriptions across pages, keyword stuffing without value proposition, being too vague or generic, not including target keywords, writing for search engines instead of users, using clickbait that does not match content (increases bounce rate), forgetting to update after content changes, not testing appearance before publishing, and ignoring CTR data to identify underperforming listings. Avoid these by focusing on user value, maintaining appropriate length, ensuring uniqueness, and regularly reviewing CTR data. Well-optimized SERP listings balance SEO with compelling copywriting.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Meta Description Generator',
      description: 'Create compelling meta descriptions',
      url: '/tools/content/meta-description-generator-enhanced',
      category: 'Content',
    },
    {
      name: 'Schema Generator',
      description: 'Generate schema markup for rich results',
      url: '/tools/seo/schema-generator-enhanced',
      category: 'SEO',
    },
    {
      name: 'Headline Analyzer',
      description: 'Score and optimize headlines',
      url: '/tools/content/headline-analyzer-enhanced',
      category: 'Content',
    },
    {
      name: 'Keyword Research',
      description: 'Discover high-value keywords',
      url: '/tools/seo/keyword-research-enhanced',
      category: 'SEO',
    },
  ] as RelatedTool[],
};

