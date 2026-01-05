import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const socialAuditToolContent = {
  metadata: {
    title: 'Social Media Audit Tool - Analyze Performance | Aureon One',
    description: 'Conduct comprehensive social media audits to analyze performance, identify opportunities, and optimize strategy. Free audit tool.',
    keywords: ['social media audit tool', 'social audit', 'social media analysis', 'performance audit', 'social media analytics'],
  },

  hero: {
    title: 'Social Media Audit Tool',
    subtitle: 'Analyze and Optimize Social Performance',
    description: 'Conduct comprehensive audits of your social media presence. Identify strengths, weaknesses, and opportunities for growth.',
    primaryCTA: 'Start Audit',
    secondaryCTA: 'Learn More',
  },

  quickAnswer: {
    question: 'What is a Social Media Audit?',
    answer: 'A social media audit is a systematic review of your social media performance, analyzing metrics like engagement, reach, follower growth, and content effectiveness across all platforms. It identifies what\'s working, what isn\'t, and opportunities for improvement. Regular audits (quarterly or bi-annually) ensure your social strategy aligns with business goals and adapts to platform changes and audience behavior.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Conduct a Social Audit', level: 2 },
    { id: 'benefits', title: 'Benefits of Social Media Audits', level: 2 },
    { id: 'metrics', title: 'Key Metrics to Analyze', level: 2 },
    { id: 'best-practices', title: 'Audit Best Practices', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Social Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'List All Accounts', text: 'Identify all social media accounts across platforms, including inactive or unofficial ones.' },
    { name: 'Gather Metrics', text: 'Collect data: followers, engagement rate, reach, top posts, audience demographics.' },
    { name: 'Analyze Performance', text: 'Compare metrics to benchmarks and previous periods to identify trends.' },
    { name: 'Review Content', text: 'Analyze which content types, topics, and formats perform best.' },
    { name: 'Identify Opportunities', text: 'Find gaps, underperforming areas, and growth opportunities.' },
    { name: 'Create Action Plan', text: 'Develop strategy improvements based on audit findings.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is a social media audit?',
      answer: 'A social media audit is a comprehensive analysis of your social media presence, performance, and strategy. It involves reviewing all social accounts, analyzing key metrics (engagement, reach, follower growth), evaluating content performance, assessing brand consistency, identifying fake or inactive accounts, comparing performance to competitors and benchmarks, and creating actionable recommendations. Audits reveal what\'s working, what isn\'t, and where to focus efforts. They ensure social media activities align with business goals and provide ROI. Regular audits (quarterly or bi-annually) keep strategy current and effective in evolving social landscapes.',
    },
    {
      question: 'How often should I conduct a social media audit?',
      answer: 'Conduct comprehensive audits quarterly for active brands with significant social presence, bi-annually for most businesses, or annually minimum for smaller businesses. Additionally, audit when launching new campaigns, experiencing performance changes (sudden drops or spikes), after major platform algorithm updates, when changing strategy or goals, or before budget planning periods. Quick monthly reviews of key metrics help catch issues early. Quarterly audits balance thoroughness with practicality. More frequent audits benefit fast-moving industries or brands with large social investments. Regular auditing prevents strategy drift and ensures continuous optimization.',
    },
    {
      question: 'What metrics should I track in a social media audit?',
      answer: 'Track quantitative metrics: follower count and growth rate, engagement rate (likes, comments, shares), reach and impressions, click-through rate, conversion rate, and audience demographics. Track qualitative metrics: content quality and relevance, brand voice consistency, response time to messages/comments, and sentiment analysis. Platform-specific metrics: Instagram (saves, shares), Twitter (retweets, mentions), LinkedIn (connection growth, post views), and Facebook (page likes, video views). Compare metrics to previous periods, competitors, and industry benchmarks. Focus on metrics aligned with business goals—vanity metrics (followers) matter less than engagement and conversions.',
    },
    {
      question: 'How do I identify my best-performing content?',
      answer: 'Identify top content by analyzing engagement rate (not just total engagement—rate accounts for follower count), reach and impressions, saves and shares (indicate high value), click-through rate for link posts, and conversion rate for business goals. Use platform analytics to sort posts by performance. Look for patterns: content types (videos, carousels, images), topics (educational, entertaining, promotional), posting times, caption styles, and hashtag strategies. Analyze your top 10-20 posts from the past quarter. Identify commonalities and create more content matching successful patterns. Top content reveals what your audience values most.',
    },
    {
      question: 'What should I do with underperforming social accounts?',
      answer: 'For underperforming accounts, first determine why they underperform: wrong platform for your audience, insufficient resources/posting frequency, poor content quality, or lack of strategy. Options: revitalize with improved strategy and consistent posting, repurpose for specific use (customer service, recruitment), consolidate with better-performing accounts, or deactivate if truly inactive. Don\'t spread resources too thin across many platforms—focus on 2-3 platforms where your audience is active. It\'s better to excel on fewer platforms than underperform on many. Redirect resources from underperforming to high-performing accounts.',
    },
    {
      question: 'How do I benchmark my social media performance?',
      answer: 'Benchmark against three sources: your own historical data (compare to previous quarters/years to track growth), competitors (analyze similar brands\' performance), and industry averages (research industry-specific benchmarks). Key benchmarks: engagement rate (1-5% is typical), follower growth rate (2-5% monthly is healthy), response time (under 1 hour ideal), and reach rate (10-20% of followers). Use tools like Rival IQ, Socialbakers, or Sprout Social for competitive benchmarking. Remember: benchmarks provide context, but focus on improving YOUR performance over time. Every audience is unique—your benchmarks matter most.',
    },
    {
      question: 'What is a social media audit template?',
      answer: 'A social media audit template is a structured document for systematically reviewing social presence. Include sections for: account inventory (all profiles, URLs, follower counts), performance metrics (engagement, reach, growth), content analysis (top posts, content types), audience demographics, competitor comparison, SWOT analysis (strengths, weaknesses, opportunities, threats), and action items. Create spreadsheets tracking metrics over time. Templates ensure consistency across audits and make year-over-year comparisons easy. Customize templates for your specific goals and platforms. Many free templates exist online, or create your own. Templates save time and ensure thoroughness.',
    },
    {
      question: 'How do I audit competitor social media?',
      answer: 'Audit competitors by identifying 3-5 direct competitors, tracking their follower counts and growth, analyzing engagement rates, reviewing content strategies (types, frequency, topics), noting posting times and frequency, identifying their top-performing content, and observing audience interactions. Use tools like Social Blade, Phlanx, or manual tracking. Look for gaps—what are they doing that you\'re not? What opportunities are they missing? Don\'t copy competitors, but learn from their successes and failures. Competitive analysis reveals industry trends and helps differentiate your strategy. Focus on learning, not imitating.',
    },
    {
      question: 'What tools should I use for social media audits?',
      answer: 'Use native platform analytics (Instagram Insights, Facebook Analytics, Twitter Analytics, LinkedIn Analytics) for detailed platform-specific data, social media management tools (Hootsuite, Sprout Social, Buffer) for cross-platform analysis, competitive analysis tools (Rival IQ, Socialbakers) for benchmarking, and spreadsheets (Google Sheets, Excel) for organizing data and tracking over time. Free tools work for basic audits; paid tools provide deeper insights and automation. Start with native analytics and expand to paid tools as needs grow. The best tool is one you\'ll use consistently. Focus on actionable insights over data collection.',
    },
    {
      question: 'How do I turn audit findings into action?',
      answer: 'Turn findings into action by prioritizing issues (high-impact, quick wins first), setting specific, measurable goals (increase engagement rate by 2% in Q2), creating action plans with owners and deadlines, allocating resources (budget, time, tools), implementing changes systematically, and tracking results. Common actions: increase posting frequency on high-performing platforms, create more of top-performing content types, improve response times, optimize posting times, update outdated profiles, and remove or consolidate underperforming accounts. Review progress monthly. Audits are worthless without implementation—focus on actionable insights and follow through.',
    },
    {
      question: 'Should I audit fake followers and engagement?',
      answer: 'Yes, audit for fake followers and engagement. Fake followers hurt engagement rates, damage credibility, waste ad spend (targeting fake accounts), and violate platform terms of service. Identify fake followers through sudden follower spikes, accounts with no profile pictures or posts, generic usernames, and very low engagement despite high follower counts. Use tools like IG Audit, HypeAuditor, or Social Blade to detect fake followers. Remove fake followers (Instagram allows blocking suspicious accounts). Avoid buying followers or engagement. Focus on organic growth. Brands and sponsors check for fake followers—authenticity matters more than vanity metrics.',
    },
    {
      question: 'How do I measure social media ROI in an audit?',
      answer: 'Measure social media ROI by tracking conversions from social (sales, leads, sign-ups), calculating customer acquisition cost from social, monitoring traffic from social to website, tracking revenue attributed to social campaigns, and comparing social media costs (tools, ads, time) to results. Use UTM parameters to track social traffic in Google Analytics. Set up conversion tracking on platforms. Calculate ROI: (Revenue from Social - Social Media Costs) / Social Media Costs × 100. Not all value is monetary—brand awareness, customer service, and community building have value too. Align ROI metrics with business goals.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Engagement Calculator',
      description: 'Calculate social media engagement rates',
      url: '/tools/social/engagement-calculator-enhanced',
      category: 'Social',
    },
    {
      name: 'Best Time to Post',
      description: 'Find optimal posting times for engagement',
      url: '/tools/social/best-time-to-post-enhanced',
      category: 'Social',
    },
    {
      name: 'Hashtag Generator',
      description: 'Generate relevant hashtags for social media',
      url: '/tools/social/hashtag-generator-enhanced',
      category: 'Social',
    },
    {
      name: 'UTM Builder',
      description: 'Create trackable campaign URLs',
      url: '/tools/social/utm-builder-enhanced',
      category: 'Social',
    },
  ] as RelatedTool[],
};

