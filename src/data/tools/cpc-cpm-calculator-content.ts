import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const cpcCpmCalculatorContent = {
  metadata: {
    title: 'CPC & CPM Calculator - Calculate Cost Per Click & Cost Per Mille | Aureon One',
    description: 'Free CPC and CPM calculator for digital advertising. Calculate cost per click, cost per thousand impressions, CTR, and optimize your ad spend across Google Ads, Facebook, and more.',
    keywords: [
      'CPC calculator',
      'CPM calculator',
      'cost per click calculator',
      'cost per mille calculator',
      'advertising cost calculator',
      'CTR calculator',
      'ad metrics calculator',
      'digital advertising calculator',
    ],
  },

  hero: {
    title: 'CPC & CPM Calculator',
    subtitle: 'Calculate Advertising Costs and Performance Metrics',
    description: 'Instantly calculate Cost Per Click (CPC), Cost Per Mille (CPM), Click-Through Rate (CTR), and other essential advertising metrics. Make data-driven decisions about your ad campaigns.',
    primaryCTA: 'Calculate Ad Metrics',
    secondaryCTA: 'View Examples',
  },

  quickAnswer: {
    question: 'What is CPC and CPM in advertising?',
    answer: 'CPC (Cost Per Click) is the amount you pay each time someone clicks your ad, calculated as Total Ad Spend ÷ Total Clicks. CPM (Cost Per Mille) is the cost per 1,000 impressions, calculated as (Total Ad Spend ÷ Total Impressions) × 1,000. CPC is ideal for conversion-focused campaigns, while CPM works best for brand awareness campaigns.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Calculator', level: 2 },
    { id: 'benefits', title: 'Benefits & Use Cases', level: 2 },
    { id: 'best-practices', title: 'CPC & CPM Best Practices', level: 2 },
    { id: 'metrics-explained', title: 'Advertising Metrics Explained', level: 2 },
    { id: 'examples', title: 'Calculation Examples', level: 2 },
    { id: 'advanced-features', title: 'Advanced Features', level: 2 },
    { id: 'integration', title: 'Integration with Your Workflow', level: 2 },
    { id: 'glossary', title: 'Advertising Terminology', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Marketing Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    {
      name: 'Select Your Calculation Type',
      text: 'Choose whether you want to calculate CPC (Cost Per Click), CPM (Cost Per Mille/1000 impressions), CTR (Click-Through Rate), or total campaign costs. Each metric serves different campaign objectives.',
    },
    {
      name: 'Enter Your Campaign Data',
      text: 'Input your advertising metrics: total ad spend, number of impressions, number of clicks, and conversions. You can enter any combination of these values depending on what you want to calculate.',
    },
    {
      name: 'Review Calculated Metrics',
      text: 'The calculator automatically computes all related metrics including CPC, CPM, CTR, conversion rate, cost per conversion, and total campaign performance indicators.',
    },
    {
      name: 'Compare Platform Benchmarks',
      text: 'Compare your calculated metrics against industry benchmarks for Google Ads, Facebook Ads, LinkedIn Ads, and other platforms to assess campaign performance.',
    },
    {
      name: 'Optimize Your Bidding Strategy',
      text: 'Use the insights to adjust your bidding strategy. If CPC is too high, consider improving ad quality score or targeting. If CPM is high, refine your audience targeting.',
    },
    {
      name: 'Export and Share Results',
      text: 'Export your calculations to CSV, PDF, or copy to clipboard for reporting to stakeholders or integrating into your campaign performance dashboards.',
    },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is the difference between CPC and CPM?',
      answer: 'CPC (Cost Per Click) charges you when someone clicks your ad, making it ideal for direct response campaigns focused on website traffic, leads, or sales. CPM (Cost Per Mille) charges per 1,000 impressions regardless of clicks, making it better for brand awareness campaigns where reach matters more than immediate action. CPC campaigns typically cost $0.50-$5.00 per click, while CPM campaigns cost $2-$10 per 1,000 impressions. Choose CPC for conversion goals and CPM for visibility goals.',
      keywords: ['CPC vs CPM', 'cost per click', 'cost per impression'],
    },
    {
      question: 'How do I calculate CPC (Cost Per Click)?',
      answer: 'Calculate CPC using this formula: <strong>CPC = Total Ad Spend ÷ Total Clicks</strong>. For example, if you spent $500 and received 250 clicks, your CPC is $500 ÷ 250 = $2.00 per click. To calculate total cost from CPC: <strong>Total Cost = CPC × Number of Clicks</strong>. If your target CPC is $1.50 and you want 1,000 clicks, you need a budget of $1,500. Lower CPC indicates more efficient campaigns and better ad quality scores.',
      keywords: ['CPC calculation', 'cost per click formula', 'calculate CPC'],
    },
    {
      question: 'How do I calculate CPM (Cost Per Mille)?',
      answer: 'Calculate CPM using this formula: <strong>CPM = (Total Ad Spend ÷ Total Impressions) × 1,000</strong>. For example, if you spent $200 and received 50,000 impressions, your CPM is ($200 ÷ 50,000) × 1,000 = $4.00 per thousand impressions. To calculate total cost from CPM: <strong>Total Cost = (CPM × Impressions) ÷ 1,000</strong>. If CPM is $6 and you want 100,000 impressions, you need ($6 × 100,000) ÷ 1,000 = $600 budget.',
      keywords: ['CPM calculation', 'cost per mille formula', 'calculate CPM'],
    },
    {
      question: 'What is a good CPC for Google Ads?',
      answer: 'Average CPC on Google Ads varies by industry: <strong>E-commerce</strong> $1.16, <strong>Legal services</strong> $6.75, <strong>Technology</strong> $3.80, <strong>Real estate</strong> $2.37, <strong>Healthcare</strong> $2.62, <strong>Finance</strong> $3.44. A "good" CPC is one that maintains profitable ROAS (Return on Ad Spend). If your customer lifetime value is $500 and target ROAS is 5:1, you can afford up to $100 CPA, which might allow $5-10 CPC depending on conversion rates. Focus on CPC relative to conversion value, not absolute numbers.',
      keywords: ['good CPC', 'Google Ads CPC', 'average cost per click'],
    },
    {
      question: 'What is a good CPM for Facebook Ads?',
      answer: 'Average Facebook CPM ranges from $5-$12 depending on targeting, industry, and season. <strong>Broad targeting</strong> typically costs $5-7 CPM, <strong>Interest-based targeting</strong> $7-10 CPM, <strong>Lookalike audiences</strong> $8-12 CPM, <strong>Retargeting</strong> $10-15 CPM. CPM increases during Q4 (holiday season) by 30-50%. A good CPM is one that delivers your target cost per result. If you need 2% CTR and $2 CPC, you can afford up to $40 CPM ($2 × 20 clicks per 1,000 impressions). Monitor CPM trends and adjust targeting to maintain efficiency.',
      keywords: ['good CPM', 'Facebook CPM', 'average CPM'],
    },
    {
      question: 'How do I calculate CTR (Click-Through Rate)?',
      answer: 'Calculate CTR using this formula: <strong>CTR = (Total Clicks ÷ Total Impressions) × 100</strong>. For example, if your ad received 500 clicks from 25,000 impressions, CTR is (500 ÷ 25,000) × 100 = 2.0%. Average CTRs vary by platform: <strong>Google Search Ads</strong> 3-5%, <strong>Google Display Ads</strong> 0.5-1%, <strong>Facebook Ads</strong> 0.9-1.6%, <strong>LinkedIn Ads</strong> 0.4-0.8%. Higher CTR indicates relevant, compelling ads and typically correlates with lower CPC due to better quality scores.',
      keywords: ['CTR calculation', 'click-through rate', 'calculate CTR'],
    },
    {
      question: 'Should I use CPC or CPM bidding?',
      answer: 'Choose <strong>CPC bidding</strong> when your goal is clicks, traffic, leads, or sales. CPC works best for search ads, retargeting, and conversion campaigns where you pay only for engaged users. Choose <strong>CPM bidding</strong> when your goal is brand awareness, reach, or video views. CPM works best for display ads, video ads, and top-of-funnel campaigns where impressions matter. Use <strong>CPC for bottom-funnel</strong> (high intent, ready to convert) and <strong>CPM for top-funnel</strong> (building awareness, reaching new audiences). Test both to find what delivers better ROI for your specific goals.',
      keywords: ['CPC vs CPM bidding', 'bidding strategy', 'when to use CPC'],
    },
    {
      question: 'How can I lower my CPC?',
      answer: 'Lower CPC with these strategies: <strong>1) Improve Quality Score</strong> by creating relevant ads and landing pages (can reduce CPC by 50%+), <strong>2) Refine targeting</strong> to reach high-intent audiences, <strong>3) Use negative keywords</strong> to exclude irrelevant searches, <strong>4) Improve ad copy</strong> to increase CTR (higher CTR = lower CPC), <strong>5) Test different ad formats</strong> (responsive ads often have lower CPC), <strong>6) Adjust bidding strategy</strong> to automated bidding like Target CPA, <strong>7) Optimize landing pages</strong> for better conversion rates, <strong>8) Schedule ads</strong> during high-converting times. Even small quality score improvements can significantly reduce costs.',
      keywords: ['lower CPC', 'reduce cost per click', 'improve CPC'],
    },
    {
      question: 'How can I lower my CPM?',
      answer: 'Reduce CPM with these tactics: <strong>1) Broaden targeting</strong> to increase available inventory (narrower targeting = higher CPM), <strong>2) Exclude expensive placements</strong> that don\'t convert, <strong>3) Use automatic placements</strong> instead of manual selection, <strong>4) Improve ad relevance score</strong> through better creative and targeting alignment, <strong>5) Test different ad formats</strong> (carousel, video, single image), <strong>6) Avoid peak seasons</strong> like Q4 when CPM spikes 30-50%, <strong>7) Use frequency capping</strong> to avoid showing ads too often to same users, <strong>8) A/B test creative</strong> to find high-engagement ads that platforms reward with lower CPM.',
      keywords: ['lower CPM', 'reduce CPM', 'improve CPM'],
    },
    {
      question: 'What is the relationship between CPC, CPM, and CTR?',
      answer: 'These metrics are mathematically related: <strong>CPC = CPM ÷ (CTR × 10)</strong>. For example, if CPM is $10 and CTR is 2%, then CPC = $10 ÷ (2 × 10) = $0.50. Conversely, <strong>CPM = CPC × CTR × 10</strong>. This relationship shows that improving CTR lowers your effective CPC even if CPM stays constant. A campaign with $10 CPM and 1% CTR has $1.00 CPC, but improving CTR to 2% drops CPC to $0.50. Focus on CTR optimization to improve both CPC and CPM efficiency simultaneously.',
      keywords: ['CPC CPM CTR relationship', 'advertising metrics relationship', 'calculate from CTR'],
    },
    {
      question: 'How do I calculate cost per conversion?',
      answer: 'Calculate cost per conversion (CPA - Cost Per Acquisition) using: <strong>CPA = Total Ad Spend ÷ Total Conversions</strong>. For example, if you spent $1,000 and got 50 conversions, CPA is $1,000 ÷ 50 = $20 per conversion. You can also calculate from CPC: <strong>CPA = CPC ÷ Conversion Rate</strong>. If CPC is $2 and conversion rate is 5%, then CPA = $2 ÷ 0.05 = $40. Target CPA should be lower than customer lifetime value. If LTV is $200, aim for CPA under $40-50 (5:1 to 4:1 ROAS) to maintain profitability.',
      keywords: ['cost per conversion', 'CPA calculation', 'calculate CPA'],
    },
    {
      question: 'What is eCPM and how is it different from CPM?',
      answer: 'eCPM (effective Cost Per Mille) is a normalized metric that converts any pricing model to a CPM equivalent for comparison. Formula: <strong>eCPM = (Total Earnings ÷ Total Impressions) × 1,000</strong>. For publishers, it shows revenue per 1,000 impressions regardless of whether ads are sold on CPC, CPM, or CPA basis. For advertisers, it helps compare campaigns with different bidding models. Example: A CPC campaign with $2 CPC and 2% CTR has eCPM of ($2 × 20 clicks) ÷ 1,000 impressions × 1,000 = $40. Use eCPM to compare performance across different campaign types.',
      keywords: ['eCPM', 'effective CPM', 'eCPM calculation'],
    },
    {
      question: 'How do CPC and CPM vary by advertising platform?',
      answer: 'Platform CPC/CPM benchmarks: <strong>Google Search Ads</strong> - CPC $1-2, CPM $2-5 (high intent), <strong>Google Display Network</strong> - CPC $0.50-1, CPM $2-4 (broad reach), <strong>Facebook/Instagram</strong> - CPC $0.50-2, CPM $5-12 (visual, social), <strong>LinkedIn</strong> - CPC $5-8, CPM $30-50 (B2B, professional), <strong>Twitter</strong> - CPC $0.50-2, CPM $6-10 (real-time, news), <strong>TikTok</strong> - CPC $1-2, CPM $10-15 (young audience, video). LinkedIn has highest costs but best B2B targeting. Facebook offers best balance of reach and cost for B2C.',
      keywords: ['CPC by platform', 'CPM by platform', 'advertising platform costs'],
    },
    {
      question: 'What factors affect CPC and CPM costs?',
      answer: 'Key factors influencing costs: <strong>1) Competition</strong> - More advertisers bidding = higher costs, <strong>2) Quality Score/Relevance</strong> - Better scores = 50%+ lower costs, <strong>3) Targeting specificity</strong> - Narrow targeting = higher CPM, <strong>4) Industry</strong> - Legal, finance, insurance have highest CPC ($5-10+), <strong>5) Seasonality</strong> - Q4 costs increase 30-50%, <strong>6) Ad placement</strong> - Premium placements cost more, <strong>7) Device type</strong> - Mobile often cheaper than desktop, <strong>8) Geographic location</strong> - US/UK/AU more expensive than developing markets, <strong>9) Time of day</strong> - Business hours typically more expensive, <strong>10) Ad format</strong> - Video ads often have higher CPM than static images.',
      keywords: ['CPC factors', 'CPM factors', 'what affects advertising costs'],
    },
    {
      question: 'How do I set a CPC or CPM bid?',
      answer: 'Set bids using these methods: <strong>1) Manual CPC bidding</strong> - Set maximum CPC you\'re willing to pay (good for control and testing), <strong>2) Enhanced CPC</strong> - Manual bids with automatic adjustments (balances control and automation), <strong>3) Target CPA bidding</strong> - Platform optimizes to hit your target cost per conversion, <strong>4) Maximize Clicks</strong> - Get most clicks within budget, <strong>5) Target ROAS</strong> - Optimize for return on ad spend target. Start with manual bidding to gather data, then switch to automated bidding after 50+ conversions. Set initial CPC at 50-75% of your maximum affordable CPC, then adjust based on performance.',
      keywords: ['set CPC bid', 'CPC bidding strategy', 'how to bid'],
    },
    {
      question: 'What is a good conversion rate for paid ads?',
      answer: 'Average conversion rates by industry: <strong>E-commerce</strong> 2-3%, <strong>B2B services</strong> 2-5%, <strong>SaaS</strong> 3-5%, <strong>Finance</strong> 5-10%, <strong>Legal</strong> 5-7%, <strong>Healthcare</strong> 3-5%. Conversion rates vary by traffic source: <strong>Google Search Ads</strong> 3-5% (high intent), <strong>Facebook Ads</strong> 1-2% (cold traffic), <strong>Retargeting</strong> 5-10% (warm traffic), <strong>Email</strong> 10-15% (owned audience). A "good" conversion rate depends on your CPC and target CPA. If CPC is $2 and target CPA is $40, you need 5% conversion rate. Focus on improving conversion rate to lower effective CPA.',
      keywords: ['good conversion rate', 'average conversion rate', 'conversion benchmarks'],
    },
    {
      question: 'How do I calculate ROAS from CPC and conversion data?',
      answer: 'Calculate ROAS (Return on Ad Spend) using: <strong>ROAS = Revenue from Ads ÷ Total Ad Spend</strong>. Example: If you spent $1,000 and generated $4,000 in revenue, ROAS is $4,000 ÷ $1,000 = 4:1 or 400%. You can also calculate from CPC: If CPC is $2, conversion rate is 5%, and average order value is $100, then CPA = $2 ÷ 0.05 = $40, and ROAS = $100 ÷ $40 = 2.5:1. Target ROAS varies by business model: <strong>E-commerce</strong> 4:1+, <strong>SaaS</strong> 3:1+, <strong>Lead generation</strong> 5:1+. Account for customer lifetime value, not just initial purchase.',
      keywords: ['calculate ROAS', 'return on ad spend', 'ROAS formula'],
    },
    {
      question: 'What is viewable CPM (vCPM)?',
      answer: 'vCPM (viewable CPM) charges only when an ad is actually viewable according to IAB standards: at least 50% of the ad pixels visible for at least 1 second (display ads) or 2 seconds (video ads). Regular CPM counts all impressions even if not seen. vCPM is typically 20-40% higher than standard CPM because you pay only for viewable impressions. Formula: <strong>vCPM = (Total Cost ÷ Viewable Impressions) × 1,000</strong>. Use vCPM for brand awareness campaigns where actual visibility matters. It ensures your budget goes toward impressions that users actually see, improving campaign effectiveness.',
      keywords: ['vCPM', 'viewable CPM', 'viewable impressions'],
    },
    {
      question: 'How do I compare CPC and CPM campaigns?',
      answer: 'Compare campaigns using <strong>eCPM</strong> (effective CPM) to normalize different bidding models. For CPC campaigns: <strong>eCPM = CPC × CTR × 1,000</strong>. Example: Campaign A (CPC) has $1 CPC and 2% CTR = $20 eCPM. Campaign B (CPM) has $15 CPM. Campaign B is more cost-effective. Also compare <strong>Cost Per Result</strong>: If Campaign A gets 100 conversions at $2,000 spend ($20 CPA) and Campaign B gets 120 conversions at $2,000 spend ($16.67 CPA), Campaign B wins despite higher eCPM. Always evaluate based on your actual goal metric (conversions, leads, sales), not just CPC or CPM.',
      keywords: ['compare CPC CPM', 'CPC vs CPM comparison', 'which is better'],
    },
    {
      question: 'What tools can help me track and optimize CPC and CPM?',
      answer: 'Essential tools for tracking and optimization: <strong>Google Ads</strong> built-in reporting for Search and Display campaigns, <strong>Facebook Ads Manager</strong> for social media metrics, <strong>Google Analytics 4</strong> for cross-platform attribution and conversion tracking, <strong>Google Data Studio</strong> for custom dashboards combining multiple sources, <strong>SEMrush</strong> or <strong>SpyFu</strong> for competitive CPC analysis, <strong>Optmyzr</strong> or <strong>Adalysis</strong> for automated bid management, <strong>Supermetrics</strong> for data aggregation and reporting. Set up automated alerts for CPC/CPM increases above 20%, CTR drops below benchmarks, and CPA exceeding targets. Review metrics daily during launch, then weekly for optimization.',
      keywords: ['CPC tracking tools', 'CPM optimization tools', 'advertising analytics'],
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'ROI Calculator',
      description: 'Calculate return on investment and ROAS for your advertising campaigns.',
      url: '/tools/advertising/roi-calculator-enhanced',
      category: 'Advertising',
    },
    {
      name: 'Budget Allocator',
      description: 'Optimize budget distribution across marketing channels based on CPC and performance.',
      url: '/tools/advertising/budget-allocator-enhanced',
      category: 'Advertising',
    },
    {
      name: 'Ad Copy Generator',
      description: 'Create high-converting ad copy to improve CTR and lower CPC.',
      url: '/tools/advertising/ad-copy-generator-enhanced',
      category: 'Advertising',
    },
  ] as RelatedTool[],
};

