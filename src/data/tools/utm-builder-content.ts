import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const utmBuilderContent = {
  metadata: {
    title: 'UTM Builder - Create Trackable Campaign URLs | Aureon One',
    description: 'Generate UTM parameters for tracking marketing campaigns in Google Analytics. Free UTM builder for accurate campaign attribution.',
    keywords: ['UTM builder', 'UTM generator', 'campaign tracking', 'UTM parameters', 'Google Analytics tracking'],
  },

  hero: {
    title: 'UTM Builder',
    subtitle: 'Create Trackable Campaign URLs',
    description: 'Generate UTM parameters to track marketing campaign performance in Google Analytics. Measure ROI and optimize your marketing efforts.',
    primaryCTA: 'Build UTM URL',
    secondaryCTA: 'Learn UTM Tracking',
  },

  quickAnswer: {
    question: 'What are UTM Parameters?',
    answer: 'UTM parameters are tags added to URLs that track where website traffic comes from. They include utm_source (traffic source like Facebook), utm_medium (marketing medium like social or email), utm_campaign (campaign name), utm_term (paid keywords), and utm_content (content variation). UTM tracking enables accurate campaign attribution in Google Analytics, helping measure marketing ROI and optimize campaigns.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Build UTM URLs', level: 2 },
    { id: 'benefits', title: 'Benefits of UTM Tracking', level: 2 },
    { id: 'parameters', title: 'UTM Parameter Guide', level: 2 },
    { id: 'best-practices', title: 'UTM Best Practices', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Marketing Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Enter Destination URL', text: 'Input the webpage URL where you want to send traffic.' },
    { name: 'Add Campaign Source', text: 'Specify traffic source (facebook, newsletter, google).' },
    { name: 'Set Campaign Medium', text: 'Define marketing medium (social, email, cpc, banner).' },
    { name: 'Name Campaign', text: 'Create descriptive campaign name (summer_sale, product_launch).' },
    { name: 'Add Optional Parameters', text: 'Include utm_term (keywords) and utm_content (ad variation) if needed.' },
    { name: 'Generate and Track', text: 'Get trackable URL and monitor performance in Google Analytics.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What are UTM parameters and why are they important?',
      answer: 'UTM (Urchin Tracking Module) parameters are tags added to URLs that track campaign performance in Google Analytics. They\'re important because they enable accurate attribution (knowing which campaigns drive traffic and conversions), allow ROI measurement for marketing channels, help optimize campaigns based on performance data, and provide insights into customer journey. Without UTM tracking, all traffic appears as direct or referral in Analytics, making it impossible to measure campaign effectiveness. UTM parameters are essential for data-driven marketing, enabling you to invest in channels that work and eliminate those that don\'t.',
    },
    {
      question: 'What are the five UTM parameters?',
      answer: 'The five UTM parameters are: utm_source (required) - identifies traffic source (facebook, newsletter, google), utm_medium (required) - identifies marketing medium (social, email, cpc, banner), utm_campaign (required) - identifies specific campaign (summer_sale, product_launch), utm_term (optional) - identifies paid search keywords, and utm_content (optional) - differentiates similar content or links (blue_button, text_link). Source, medium, and campaign are required for proper tracking. Term is mainly for paid search. Content helps A/B test different ad variations. Use consistent naming conventions across all campaigns for accurate reporting.',
    },
    {
      question: 'How do I create UTM parameters?',
      answer: 'Create UTM parameters using a UTM builder tool (Google\'s Campaign URL Builder or third-party tools), manually by adding parameters to URLs (yoursite.com?utm_source=facebook&utm_medium=social&utm_campaign=spring_sale), or through marketing platforms that auto-generate UTMs (email tools, social schedulers). Best practice: use a UTM builder to avoid errors. Always include source, medium, and campaign. Use lowercase for consistency. Avoid spaces (use underscores or hyphens). Keep names descriptive but concise. Document your UTM naming conventions to ensure team consistency. Test URLs before using in campaigns.',
    },
    {
      question: 'What is the difference between utm_source and utm_medium?',
      answer: 'utm_source identifies WHERE traffic comes from (specific platform or publisher): facebook, google, newsletter, partner_site. utm_medium identifies HOW traffic arrives (marketing channel or method): social, email, cpc, banner, affiliate. Think of source as the specific origin and medium as the general category. For example: utm_source=facebook&utm_medium=social (Facebook social post), utm_source=google&utm_medium=cpc (Google paid ad), utm_source=newsletter&utm_medium=email (email campaign). This distinction enables analysis by both specific sources and broader marketing channels. Consistent use of both provides granular and high-level insights.',
    },
    {
      question: 'How do I track UTM parameters in Google Analytics?',
      answer: 'Track UTM parameters in Google Analytics by going to Acquisition > Campaigns > All Campaigns to see campaign performance, viewing Source/Medium report for traffic source breakdown, and using custom reports for detailed UTM analysis. GA4 (Google Analytics 4) shows UTM data in Acquisition reports and allows custom explorations. Set up goals or conversions to track campaign ROI. Create custom dashboards for quick campaign monitoring. UTM data appears automatically once you use UTM-tagged URLs—no additional setup needed. However, ensure Google Analytics is properly installed on your site. Test UTM URLs to verify tracking works.',
    },
    {
      question: 'What are UTM naming best practices?',
      answer: 'UTM naming best practices: use lowercase consistently (Facebook vs facebook creates separate entries), avoid spaces (use underscores or hyphens: summer_sale not summer sale), be descriptive but concise (spring_promo_2024 not sp24), use consistent naming conventions across team, document your conventions in a shared guide, avoid special characters (stick to letters, numbers, hyphens, underscores), and use meaningful names (facebook_ad not fa). Create a naming convention document: source (platform name), medium (channel type), campaign (descriptive_name_date). Consistency is crucial—inconsistent naming creates messy, unusable data in Analytics.',
    },
    {
      question: 'Should I use UTM parameters for internal links?',
      answer: 'No, don\'t use UTM parameters for internal links (links within your own website). UTMs on internal links override original traffic source, making all traffic appear to come from your internal campaign instead of the actual source. This corrupts Analytics data. Use UTMs only for external links (social media, emails, ads, partner sites). For internal tracking, use Google Analytics events or custom dimensions instead. Exception: if you have separate domains or subdomains and need to track cross-domain traffic, UTMs may be appropriate. But for standard internal navigation, avoid UTMs—they cause more problems than they solve.',
    },
    {
      question: 'How do I organize and manage UTM campaigns?',
      answer: 'Organize UTM campaigns by creating a UTM tracking spreadsheet documenting all campaigns (URL, source, medium, campaign, date, owner), establishing naming conventions and sharing with team, using consistent campaign names across channels, creating templates for common campaign types, and regularly auditing UTM usage for consistency. Tools like Google Sheets or dedicated UTM management platforms help. Include columns for: full URL, short URL, campaign goal, start/end dates, and performance notes. This documentation prevents duplicate campaign names, ensures consistency, and provides historical reference. Good organization makes Analytics data actionable.',
    },
    {
      question: 'Can I use URL shorteners with UTM parameters?',
      answer: 'Yes, use URL shorteners (Bitly, TinyURL) with UTM parameters to make long UTM URLs more shareable and trackable. Build your UTM URL first, then shorten it. The shortened URL redirects to your full UTM URL, preserving tracking. Benefits: cleaner appearance in social posts, additional click tracking from shortener, and easier sharing. However, some users distrust shortened URLs. For email, use full UTM URLs (they\'re clickable anyway). For social media with character limits (Twitter), shortened URLs are valuable. Most URL shorteners provide their own analytics in addition to Google Analytics tracking.',
    },
    {
      question: 'What are common UTM tracking mistakes?',
      answer: 'Common mistakes include inconsistent capitalization (Facebook vs facebook), using UTMs on internal links (corrupts data), not using UTMs at all (can\'t track campaigns), inconsistent naming across team, using spaces in parameters, forgetting required parameters (source, medium, campaign), over-complicating parameter names, not documenting UTM conventions, and not testing URLs before campaigns launch. These mistakes create messy Analytics data that\'s difficult to analyze. Avoid by establishing clear naming conventions, using UTM builders, documenting all campaigns, training team members, and regularly auditing UTM usage. Clean, consistent UTM data enables accurate marketing decisions.',
    },
    {
      question: 'How do UTM parameters affect SEO?',
      answer: 'UTM parameters don\'t directly affect SEO or rankings. However, they can create duplicate content issues if the same page is accessible via multiple UTM variations. Prevent this by using canonical tags pointing to the non-UTM version, ensuring Google indexes the clean URL. UTM parameters are ignored by search engines for ranking purposes. They\'re purely for analytics tracking. Don\'t worry about UTMs hurting SEO—just implement canonical tags properly. The benefits of campaign tracking far outweigh any minimal SEO concerns. Focus on using UTMs for all external marketing to measure ROI accurately.',
    },
    {
      question: 'Can I track offline campaigns with UTM parameters?',
      answer: 'Yes, track offline campaigns using custom UTM URLs on print materials, QR codes, or vanity URLs. Create unique UTM URLs for each offline channel: utm_source=print&utm_medium=magazine&utm_campaign=june_ad for magazine ads, utm_source=billboard&utm_medium=outdoor&utm_campaign=highway_101 for billboards, or utm_source=event&utm_medium=conference&utm_campaign=tech_summit_2024 for events. Use QR codes or short, memorable vanity URLs (yoursite.com/magazine) that redirect to UTM URLs. This connects offline marketing to online conversions, enabling full-funnel attribution. Track which offline channels drive website traffic and conversions, justifying offline marketing spend.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Social Audit Tool',
      description: 'Analyze social media campaign performance',
      url: '/tools/social/social-audit-tool-enhanced',
      category: 'Social',
    },
    {
      name: 'Email Signature Generator',
      description: 'Add trackable links to email signatures',
      url: '/tools/email/signature-generator-enhanced',
      category: 'Email',
    },
    {
      name: 'ROI Calculator',
      description: 'Calculate marketing campaign ROI',
      url: '/tools/advertising/roi-calculator-enhanced',
      category: 'Advertising',
    },
    {
      name: 'Social Caption Generator',
      description: 'Create captions for UTM-tracked social posts',
      url: '/tools/content/social-caption-generator-enhanced',
      category: 'Content',
    },
  ] as RelatedTool[],
};

