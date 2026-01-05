import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const metaDescriptionGeneratorContent = {
  metadata: {
    title: 'Meta Description Generator - Create SEO-Optimized Descriptions | Aureon One',
    description: 'Generate compelling meta descriptions that improve click-through rates. Free tool for SEO specialists, content managers, and web developers.',
    keywords: ['meta description generator', 'meta tag generator', 'SEO description tool', 'SERP snippet creator', 'meta description optimizer'],
  },

  hero: {
    title: 'Meta Description Generator',
    subtitle: 'Create Compelling Meta Descriptions for Better CTR',
    description: 'Generate SEO-optimized meta descriptions that attract clicks from search results. Perfect length, keyword-rich, and conversion-focused.',
    primaryCTA: 'Generate Meta Description',
    secondaryCTA: 'View Examples',
  },

  quickAnswer: {
    question: 'What is a Meta Description?',
    answer: 'A meta description is an HTML tag that summarizes a webpage\'s content in 150-160 characters. It appears below the page title in search results and influences click-through rates. While not a direct ranking factor, compelling meta descriptions improve CTR, which indirectly affects SEO performance. Effective descriptions include target keywords, clear value propositions, and calls-to-action.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Meta Description Generator', level: 2 },
    { id: 'benefits', title: 'Benefits & Use Cases', level: 2 },
    { id: 'best-practices', title: 'Meta Description Best Practices', level: 2 },
    { id: 'examples', title: 'High-Performing Examples', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related SEO Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Enter Page Topic', text: 'Input your page topic or main keyword to generate relevant descriptions.' },
    { name: 'Add Key Points', text: 'Specify key benefits, features, or value propositions to include.' },
    { name: 'Generate Options', text: 'Get multiple meta description variations optimized for length and keywords.' },
    { name: 'Review and Edit', text: 'Customize generated descriptions to match your brand voice and specific needs.' },
    { name: 'Check Character Count', text: 'Ensure description is 150-160 characters for optimal search display.' },
    { name: 'Implement and Test', text: 'Add meta description to your page HTML and monitor CTR performance.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is a meta description and why is it important?',
      answer: 'A meta description is an HTML meta tag that provides a brief summary of a webpage\'s content, typically 150-160 characters. It appears in search engine results below the page title and URL. While not a direct ranking factor, meta descriptions are crucial for SEO because they influence click-through rates from search results. Compelling descriptions can increase CTR by 20-30%, which signals content relevance to search engines and indirectly improves rankings. They also appear in social media shares, making them important for overall digital marketing effectiveness.',
    },
    {
      question: 'How long should a meta description be?',
      answer: 'Optimal meta description length is 150-160 characters (including spaces). Google typically displays up to 155-160 characters on desktop and slightly less on mobile. Descriptions longer than 160 characters get truncated with "..." in search results, potentially cutting off important information. Shorter descriptions (under 120 characters) may not fully utilize available space to convince users to click. Front-load important keywords and value propositions in the first 120 characters to ensure they display even if truncated. Character count matters more than word count for search display optimization.',
    },
    {
      question: 'Do meta descriptions affect SEO rankings?',
      answer: 'Meta descriptions are not a direct ranking factor in Google\'s algorithm. However, they significantly affect SEO indirectly through click-through rate (CTR) impact. Higher CTR from search results signals content relevance and quality to search engines, which can improve rankings over time. Well-written meta descriptions also reduce bounce rates by setting accurate expectations, another positive ranking signal. They appear in social media shares, extending SEO impact beyond search. While you won\'t rank higher solely from meta descriptions, they\'re essential for maximizing traffic from existing rankings and improving overall SEO performance.',
    },
    {
      question: 'Should I include keywords in meta descriptions?',
      answer: 'Yes, include target keywords in meta descriptions because Google bolds matching keywords in search results, making your listing more visible and relevant to searchers. However, avoid keyword stuffing—use keywords naturally within compelling copy. Include primary keyword once and potentially one secondary keyword. Focus on creating persuasive, benefit-driven descriptions that happen to include keywords rather than keyword-focused descriptions that lack appeal. Keywords should support the value proposition, not replace it. Modern SEO emphasizes user intent and engagement over keyword density, so prioritize click-worthiness while incorporating relevant keywords naturally.',
    },
    {
      question: 'What happens if I don\'t write a meta description?',
      answer: 'If you don\'t provide a meta description, search engines automatically generate one by extracting text from your page content, often from the first paragraph or sections containing search keywords. Auto-generated descriptions are usually less compelling, may not include key value propositions, can be poorly formatted or cut off mid-sentence, and don\'t include strategic calls-to-action. This results in lower click-through rates and missed traffic opportunities. While Google sometimes overrides custom descriptions with auto-generated ones if they better match search queries, providing well-written meta descriptions gives you control over your search presence and significantly improves CTR.',
    },
    {
      question: 'Can I use the same meta description for multiple pages?',
      answer: 'No, avoid using duplicate meta descriptions across multiple pages. Each page should have a unique meta description that accurately reflects its specific content. Duplicate descriptions confuse search engines about which page to rank for queries, reduce the effectiveness of each page in search results, and miss opportunities to target different keywords and user intents. Google Search Console flags duplicate meta descriptions as issues. Create unique descriptions for all important pages (homepage, product pages, key blog posts). For large sites with thousands of pages, prioritize unique descriptions for high-traffic and high-value pages, using templates for less critical pages.',
    },
    {
      question: 'How do I write compelling meta descriptions?',
      answer: 'Write compelling meta descriptions by starting with a clear value proposition (what users gain), including target keywords naturally, using active voice and action verbs, adding a call-to-action when appropriate, highlighting unique benefits or differentiators, creating urgency or curiosity when relevant, and matching search intent for target queries. Keep descriptions concise (150-160 characters), avoid generic phrases, and ensure accuracy to content. Test different approaches: question-based, benefit-focused, or problem-solution formats. Analyze competitor descriptions for inspiration. The best descriptions balance SEO optimization with persuasive copywriting that convinces users to click.',
    },
    {
      question: 'Should meta descriptions include calls-to-action?',
      answer: 'Yes, including calls-to-action (CTAs) in meta descriptions can increase click-through rates by 15-20%. Effective CTAs include "Learn more," "Get started," "Discover how," "Find out," "Try free," or "Download now." CTAs create urgency and direct user action. However, ensure CTAs fit naturally within the 160-character limit and don\'t sacrifice value proposition for CTA space. Not every meta description needs a CTA—informational content may benefit more from comprehensive summaries. Test CTA versus non-CTA descriptions for your specific content types and audiences to determine what drives better performance.',
    },
    {
      question: 'How often should I update meta descriptions?',
      answer: 'Update meta descriptions when page content significantly changes, when targeting new keywords or search intent, when CTR is below average for page position, during regular SEO audits (quarterly or bi-annually), when launching new products or services, and when seasonal or time-sensitive information becomes outdated. Monitor performance in Google Search Console—pages with low CTR relative to position are candidates for meta description optimization. Don\'t change descriptions too frequently as it takes time to measure impact. Test new descriptions against old ones when possible. Regular updates keep descriptions relevant and optimized for current search behavior.',
    },
    {
      question: 'What are common meta description mistakes?',
      answer: 'Common mistakes include exceeding 160 characters (causing truncation), using duplicate descriptions across pages, keyword stuffing without value proposition, being too vague or generic, not including target keywords, writing for search engines instead of users, using special characters that don\'t display properly, not matching description to page content (causing high bounce rates), forgetting to include CTAs, and not testing or updating descriptions based on performance. Avoid these by focusing on user value, maintaining appropriate length, ensuring uniqueness, and regularly reviewing CTR data to identify underperforming descriptions needing optimization.',
    },
    {
      question: 'Do meta descriptions appear on social media?',
      answer: 'Meta descriptions often appear when pages are shared on social media, though platforms may use Open Graph (og:description) or Twitter Card (twitter:description) tags if available. If these specific social meta tags aren\'t present, platforms typically fall back to standard meta descriptions. This makes meta descriptions important for social sharing as well as search. For optimal social media appearance, implement platform-specific meta tags alongside standard meta descriptions. Ensure descriptions are compelling for both search and social contexts. Well-written meta descriptions serve double duty, improving both search CTR and social engagement when content is shared.',
    },
    {
      question: 'Can I use emojis in meta descriptions?',
      answer: 'While technically possible to include emojis in meta descriptions, it\'s generally not recommended. Google often strips emojis from search results display, making them unreliable. When they do appear, emojis can look unprofessional for many business types and may not display consistently across devices and browsers. Some industries (e-commerce, entertainment, food) might benefit from emoji use, but most B2B and professional services should avoid them. If testing emojis, use sparingly (1-2 maximum), ensure they add value rather than gimmick, and verify they display correctly in search results. Focus on compelling copy over visual tricks.',
    },
    {
      question: 'How do I measure meta description effectiveness?',
      answer: 'Measure effectiveness using Google Search Console to track CTR by page and query, comparing CTR to average for your position. Monitor impressions and clicks over time after description changes. Use A/B testing tools to test description variations when possible. Track bounce rate—misleading descriptions increase bounces. Analyze which description styles (question-based, benefit-focused, CTA-driven) perform best for different content types. Compare your CTR to industry benchmarks for your typical search positions. Regular measurement identifies high-performing patterns to replicate and underperforming descriptions needing optimization. Effective descriptions show above-average CTR for their search position.',
    },
    {
      question: 'Should meta descriptions be different for mobile and desktop?',
      answer: 'While you can\'t serve different meta descriptions to mobile versus desktop users (same HTML serves both), you should optimize descriptions for mobile display since 60%+ of searches occur on mobile. Mobile displays slightly fewer characters (120-140 vs. 150-160 on desktop), so front-load important information in the first 120 characters. Ensure descriptions are scannable and concise for mobile users who make quick decisions. Test how descriptions appear on mobile devices. Some advanced implementations use dynamic meta tags based on device, but this adds complexity. Generally, write descriptions optimized for mobile that also work well on desktop.',
    },
    {
      question: 'What is the difference between meta descriptions and page summaries?',
      answer: 'Meta descriptions are specific HTML tags (150-160 characters) designed for search engine results and social sharing, optimized for click-through rates with keywords and CTAs. Page summaries are longer content descriptions (200-500 words) that appear on the page itself, providing comprehensive overviews for users already on your site. Meta descriptions are marketing copy designed to attract clicks, while page summaries are informational content helping users understand page value. Both should accurately represent content, but meta descriptions prioritize persuasion and brevity while summaries prioritize comprehensiveness and detail. Use both strategically for optimal user experience and SEO.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'SERP Preview',
      description: 'Preview how your page appears in search results',
      url: '/tools/seo/serp-preview-enhanced',
      category: 'SEO',
    },
    {
      name: 'Headline Analyzer',
      description: 'Score and optimize headlines for engagement',
      url: '/tools/content/headline-analyzer-enhanced',
      category: 'Content',
    },
    {
      name: 'Keyword Research',
      description: 'Discover high-value keywords for your content',
      url: '/tools/seo/keyword-research-enhanced',
      category: 'SEO',
    },
    {
      name: 'Schema Generator',
      description: 'Generate schema markup for rich search results',
      url: '/tools/seo/schema-generator-enhanced',
      category: 'SEO',
    },
  ] as RelatedTool[],
};

