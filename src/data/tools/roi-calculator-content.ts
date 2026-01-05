import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const roiCalculatorContent = {
  metadata: {
    title: 'ROI Calculator - Calculate Marketing Return on Investment & ROAS | Aureon One',
    description: 'Free ROI and ROAS calculator for marketing campaigns. Calculate return on investment, return on ad spend, payback period, and profitability for your advertising efforts.',
    keywords: [
      'ROI calculator',
      'ROAS calculator',
      'return on investment calculator',
      'marketing ROI calculator',
      'advertising ROI',
      'calculate ROI',
      'return on ad spend',
    ],
  },

  hero: {
    title: 'ROI & ROAS Calculator',
    subtitle: 'Calculate Marketing Return on Investment',
    description: 'Measure the profitability of your marketing campaigns with our comprehensive ROI and ROAS calculator. Track revenue, costs, and returns to make data-driven investment decisions.',
    primaryCTA: 'Calculate ROI',
    secondaryCTA: 'View Examples',
  },

  quickAnswer: {
    question: 'What is ROI in marketing?',
    answer: 'ROI (Return on Investment) measures the profitability of marketing campaigns, calculated as (Revenue - Cost) ÷ Cost × 100. A 200% ROI means you earned $2 for every $1 spent. ROAS (Return on Ad Spend) is similar but expressed as a ratio: Revenue ÷ Ad Spend. A 5:1 ROAS means $5 revenue per $1 ad spend. Both metrics help determine campaign profitability and guide budget allocation.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Calculator', level: 2 },
    { id: 'benefits', title: 'Benefits & Use Cases', level: 2 },
    { id: 'best-practices', title: 'ROI Measurement Best Practices', level: 2 },
    { id: 'metrics-explained', title: 'ROI Metrics Explained', level: 2 },
    { id: 'examples', title: 'Calculation Examples', level: 2 },
    { id: 'advanced-features', title: 'Advanced Features', level: 2 },
    { id: 'integration', title: 'Integration with Your Workflow', level: 2 },
    { id: 'glossary', title: 'ROI Terminology', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Marketing Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    {
      name: 'Enter Campaign Investment',
      text: 'Input your total marketing investment including ad spend, creative costs, agency fees, tools, and any other campaign-related expenses. Be comprehensive to get accurate ROI.',
    },
    {
      name: 'Input Revenue Generated',
      text: 'Enter the total revenue directly attributed to your marketing campaign. Use attribution models (first-touch, last-touch, or multi-touch) to determine accurate revenue attribution.',
    },
    {
      name: 'Add Customer Lifetime Value (Optional)',
      text: 'For more accurate long-term ROI, include average customer lifetime value (LTV) rather than just initial purchase value. This is especially important for subscription and repeat-purchase businesses.',
    },
    {
      name: 'Review Calculated Metrics',
      text: 'Analyze your ROI percentage, ROAS ratio, profit margin, payback period, and break-even point. These metrics provide comprehensive view of campaign profitability.',
    },
    {
      name: 'Compare Against Benchmarks',
      text: 'Compare your results against industry benchmarks and your historical performance. Identify whether your campaigns are meeting, exceeding, or falling short of targets.',
    },
    {
      name: 'Make Data-Driven Decisions',
      text: 'Use ROI insights to scale profitable campaigns, pause underperforming ones, and reallocate budget to highest-returning channels and tactics.',
    },
  ] as HowToStep[],

  faqs: [
    {
      question: 'How do I calculate ROI for marketing campaigns?',
      answer: 'Calculate marketing ROI using this formula: <strong>ROI = (Revenue - Cost) ÷ Cost × 100</strong>. Example: If you spent $10,000 on a campaign and generated $30,000 in revenue, ROI = ($30,000 - $10,000) ÷ $10,000 × 100 = 200%. This means you earned $2 for every $1 spent. Include all costs: ad spend, creative production, agency fees, tools, and employee time. For accurate attribution, use tracking pixels, UTM parameters, and CRM integration to connect revenue to specific campaigns.',
      keywords: ['calculate ROI', 'marketing ROI formula', 'ROI calculation'],
    },
    {
      question: 'What is the difference between ROI and ROAS?',
      answer: '<strong>ROI (Return on Investment)</strong> is expressed as a percentage: (Revenue - Cost) ÷ Cost × 100. A 200% ROI means you made $2 profit per $1 spent. <strong>ROAS (Return on Ad Spend)</strong> is expressed as a ratio: Revenue ÷ Ad Spend. A 3:1 ROAS means $3 revenue per $1 ad spend. Key difference: ROI accounts for profit (revenue minus costs), while ROAS only considers revenue. Example: $1,000 ad spend generates $4,000 revenue with $2,000 product costs. ROAS = 4:1, but ROI = ($4,000 - $1,000 - $2,000) ÷ $1,000 = 100%. Use ROAS for quick campaign comparison, ROI for true profitability.',
      keywords: ['ROI vs ROAS', 'difference ROI ROAS', 'ROAS explained'],
    },
    {
      question: 'What is a good ROI for marketing?',
      answer: 'A good marketing ROI varies by industry and channel: <strong>Digital advertising</strong> 200-400% ROI (3:1 to 5:1 ROAS), <strong>Email marketing</strong> 3,600% ROI ($36 return per $1 spent), <strong>SEO</strong> 500-1,000% ROI (long-term compounding), <strong>Content marketing</strong> 300-500% ROI, <strong>Social media ads</strong> 200-300% ROI. Minimum acceptable ROI is typically 100% (break-even). Target 200%+ ROI for sustainable growth. High-ticket B2B services may accept lower initial ROI (50-100%) due to high customer lifetime value. E-commerce typically needs 300%+ ROI due to lower margins.',
      keywords: ['good ROI', 'marketing ROI benchmark', 'average ROI'],
    },
    {
      question: 'How do I calculate ROAS (Return on Ad Spend)?',
      answer: 'Calculate ROAS using: <strong>ROAS = Revenue from Ads ÷ Total Ad Spend</strong>. Express as ratio (5:1) or multiply by 100 for percentage (500%). Example: Spent $2,000 on Facebook ads, generated $10,000 in revenue. ROAS = $10,000 ÷ $2,000 = 5:1 or 500%. To calculate required ad spend for target revenue: <strong>Ad Spend = Target Revenue ÷ Target ROAS</strong>. If you want $50,000 revenue with 4:1 ROAS, you need $50,000 ÷ 4 = $12,500 ad spend. Track ROAS by campaign, ad set, and individual ad to identify top performers.',
      keywords: ['calculate ROAS', 'ROAS formula', 'return on ad spend calculation'],
    },
    {
      question: 'What is customer lifetime value (LTV) and how does it affect ROI?',
      answer: 'Customer Lifetime Value (LTV) is the total revenue a customer generates over their entire relationship with your business. Formula: <strong>LTV = Average Purchase Value × Purchase Frequency × Customer Lifespan</strong>. Example: $100 average order, 4 purchases/year, 3-year lifespan = $1,200 LTV. LTV dramatically affects ROI calculations. If initial purchase is $100 but LTV is $1,200, you can afford 10x higher acquisition costs. SaaS and subscription businesses must use LTV for accurate ROI. Calculate <strong>LTV:CAC ratio</strong> (Lifetime Value ÷ Customer Acquisition Cost). Target 3:1 ratio minimum, 5:1 ideal.',
      keywords: ['customer lifetime value', 'LTV calculation', 'LTV ROI'],
    },
    {
      question: 'How long should I wait to measure marketing ROI?',
      answer: 'Measurement timeframe varies by channel and sales cycle: <strong>Paid search ads</strong> 7-30 days (immediate conversions), <strong>Social media ads</strong> 14-60 days (longer consideration), <strong>SEO</strong> 6-12 months (long-term results), <strong>Content marketing</strong> 3-6 months (compounding effect), <strong>Email campaigns</strong> 7-14 days (quick response). B2B with long sales cycles (3-12 months) should measure at 90-180 days. Use <strong>multi-touch attribution</strong> to credit campaigns throughout customer journey. Set up milestone tracking: immediate ROI (30 days), short-term ROI (90 days), long-term ROI (12 months).',
      keywords: ['measure ROI timeframe', 'when to measure ROI', 'ROI measurement period'],
    },
    {
      question: 'What costs should I include in ROI calculations?',
      answer: 'Include all campaign-related costs for accurate ROI: <strong>1) Direct ad spend</strong> (platform costs), <strong>2) Creative production</strong> (design, copywriting, video), <strong>3) Agency/consultant fees</strong> (management, strategy), <strong>4) Marketing tools</strong> (software, analytics, automation), <strong>5) Employee time</strong> (internal team hours × hourly rate), <strong>6) Landing page development</strong> (design, development, hosting), <strong>7) Testing costs</strong> (A/B testing tools, research). Don\'t include: general overhead, unrelated salaries, or sunk costs. Many businesses underestimate true costs by 30-50%, inflating ROI calculations. Use fully-loaded cost accounting for accuracy.',
      keywords: ['ROI costs', 'what to include in ROI', 'marketing costs'],
    },
    {
      question: 'How do I improve marketing ROI?',
      answer: 'Improve ROI with these strategies: <strong>1) Increase conversion rates</strong> (optimize landing pages, improve CTAs), <strong>2) Reduce customer acquisition cost</strong> (better targeting, higher quality scores), <strong>3) Increase average order value</strong> (upsells, bundles, premium tiers), <strong>4) Improve customer retention</strong> (email nurture, loyalty programs), <strong>5) Focus on high-ROI channels</strong> (reallocate budget from low performers), <strong>6) Optimize attribution</strong> (credit all touchpoints, not just last-click), <strong>7) Reduce waste</strong> (negative keywords, audience exclusions), <strong>8) Test continuously</strong> (A/B test ads, landing pages, offers). Even 10% improvement in conversion rate can double ROI.',
      keywords: ['improve ROI', 'increase marketing ROI', 'better ROI'],
    },
    {
      question: 'What is payback period and how do I calculate it?',
      answer: 'Payback period is the time required to recover your marketing investment. Formula: <strong>Payback Period = Total Investment ÷ Monthly Profit</strong>. Example: Spent $12,000 on campaign generating $2,000 monthly profit. Payback period = $12,000 ÷ $2,000 = 6 months. Target payback periods: <strong>E-commerce</strong> 1-3 months, <strong>SaaS</strong> 6-12 months, <strong>B2B services</strong> 3-6 months. Shorter payback periods mean faster cash flow recovery and ability to reinvest. For subscription businesses, calculate <strong>CAC payback</strong>: Customer Acquisition Cost ÷ Monthly Recurring Revenue. Aim for under 12 months.',
      keywords: ['payback period', 'calculate payback period', 'ROI payback'],
    },
    {
      question: 'How do I calculate ROI for different marketing channels?',
      answer: 'Calculate channel-specific ROI to optimize budget allocation: <strong>Paid Search</strong> - Track conversions via Google Ads conversion tracking, <strong>Social Media</strong> - Use platform pixels (Facebook Pixel, LinkedIn Insight Tag), <strong>Email</strong> - Track clicks and conversions via UTM parameters, <strong>SEO</strong> - Attribute organic traffic conversions in Google Analytics, <strong>Content Marketing</strong> - Track assisted conversions and engagement metrics. Use <strong>UTM parameters</strong> consistently (utm_source, utm_medium, utm_campaign) to track all channels in Google Analytics. Set up <strong>multi-touch attribution</strong> to credit multiple touchpoints. Compare channel ROI monthly to identify winners and losers.',
      keywords: ['channel ROI', 'calculate ROI by channel', 'marketing channel ROI'],
    },
    {
      question: 'What is the difference between gross ROI and net ROI?',
      answer: '<strong>Gross ROI</strong> only considers direct revenue and ad spend: (Revenue - Ad Spend) ÷ Ad Spend. <strong>Net ROI</strong> includes all costs: (Revenue - All Costs) ÷ All Costs. Example: $10,000 ad spend generates $40,000 revenue, but $15,000 in product costs and $5,000 in overhead. Gross ROI = ($40,000 - $10,000) ÷ $10,000 = 300%. Net ROI = ($40,000 - $10,000 - $15,000 - $5,000) ÷ $30,000 = 33%. Always use net ROI for business decisions. Gross ROI is useful for quick campaign comparison but doesn\'t reflect true profitability. Many businesses make unprofitable decisions by focusing only on gross ROI.',
      keywords: ['gross ROI', 'net ROI', 'ROI types'],
    },
    {
      question: 'How do I set ROI targets for my marketing campaigns?',
      answer: 'Set ROI targets based on business model and goals: <strong>1) Calculate break-even ROI</strong> (minimum to cover costs = 0% ROI), <strong>2) Determine acceptable ROI</strong> (typically 100-200% for sustainability), <strong>3) Set stretch ROI goals</strong> (300-500% for high performance). Consider: <strong>Profit margins</strong> (low-margin businesses need higher ROI), <strong>Customer LTV</strong> (high LTV allows lower initial ROI), <strong>Growth stage</strong> (startups may accept lower ROI for market share), <strong>Channel maturity</strong> (new channels need time to optimize). Set tiered targets: <strong>Minimum</strong> 100% ROI (break-even), <strong>Target</strong> 200-300% ROI (profitable), <strong>Excellent</strong> 400%+ ROI (scale aggressively).',
      keywords: ['ROI targets', 'set ROI goals', 'target ROI'],
    },
    {
      question: 'What is attribution and how does it affect ROI calculations?',
      answer: 'Attribution determines which marketing touchpoints receive credit for conversions. Models include: <strong>Last-click attribution</strong> (100% credit to final touchpoint - undervalues awareness), <strong>First-click attribution</strong> (100% credit to first touchpoint - undervalues conversion tactics), <strong>Linear attribution</strong> (equal credit to all touchpoints), <strong>Time-decay attribution</strong> (more credit to recent touchpoints), <strong>Position-based attribution</strong> (40% first, 40% last, 20% middle). Example: Customer sees Facebook ad, clicks Google ad, converts. Last-click gives Google 100% credit, but Facebook assisted. Use <strong>multi-touch attribution</strong> for accurate ROI. Google Analytics 4 offers data-driven attribution using machine learning.',
      keywords: ['attribution', 'marketing attribution', 'attribution models'],
    },
    {
      question: 'How do I calculate ROI for brand awareness campaigns?',
      answer: 'Brand awareness ROI is challenging but measurable: <strong>1) Track brand search volume</strong> (increase in branded searches), <strong>2) Measure direct traffic</strong> (people typing your URL), <strong>3) Monitor social mentions</strong> (brand name mentions, sentiment), <strong>4) Survey brand recall</strong> (aided/unaided awareness), <strong>5) Measure assisted conversions</strong> (awareness touchpoints in conversion path). Assign monetary value: If brand campaign costs $50,000 and increases branded searches by 10,000 with 5% conversion rate and $100 average order value, revenue = 10,000 × 0.05 × $100 = $50,000. ROI = ($50,000 - $50,000) ÷ $50,000 = 0%. Add long-term value and assisted conversions for true impact.',
      keywords: ['brand awareness ROI', 'calculate awareness ROI', 'brand campaign ROI'],
    },
    {
      question: 'What tools can I use to track marketing ROI?',
      answer: 'Essential ROI tracking tools: <strong>Google Analytics 4</strong> for conversion tracking and attribution, <strong>Google Ads</strong> for paid search ROI, <strong>Facebook Ads Manager</strong> for social media ROI, <strong>HubSpot</strong> or <strong>Salesforce</strong> for CRM and lead tracking, <strong>Supermetrics</strong> or <strong>Funnel.io</strong> for multi-channel reporting, <strong>Google Data Studio</strong> for custom dashboards, <strong>Triple Whale</strong> or <strong>Northbeam</strong> for e-commerce attribution, <strong>Wicked Reports</strong> for multi-touch attribution. Set up: conversion tracking pixels, UTM parameters, CRM integration, and automated reporting. Review ROI weekly for paid campaigns, monthly for organic channels.',
      keywords: ['ROI tracking tools', 'measure ROI tools', 'ROI software'],
    },
    {
      question: 'How do I calculate ROI for SEO?',
      answer: 'Calculate SEO ROI: <strong>ROI = (Organic Traffic Value - SEO Costs) ÷ SEO Costs × 100</strong>. Determine organic traffic value: <strong>1) Track organic conversions</strong> in Google Analytics, <strong>2) Multiply by average order value</strong>, <strong>3) Or estimate traffic value</strong> (organic traffic × conversion rate × AOV). Example: SEO costs $5,000/month (content, links, tools). Organic traffic generates 500 conversions × $100 AOV = $50,000 revenue. ROI = ($50,000 - $5,000) ÷ $5,000 = 900%. SEO has compounding returns - year 1 might be 100% ROI, year 2 could be 500%+ as rankings improve. Track rankings, organic traffic, and conversions monthly.',
      keywords: ['SEO ROI', 'calculate SEO ROI', 'organic search ROI'],
    },
    {
      question: 'What is the 5:1 ROAS rule?',
      answer: 'The 5:1 ROAS rule suggests targeting $5 in revenue for every $1 in ad spend (500% ROAS or 400% ROI). This accounts for: <strong>1) Product costs</strong> (typically 30-40% of revenue), <strong>2) Operating expenses</strong> (20-30% of revenue), <strong>3) Profit margin</strong> (20-30% of revenue). Example: $1 ad spend generates $5 revenue. After $2 product cost and $1.50 operating costs, you have $1.50 profit = 150% ROI. Lower ROAS works for high-margin businesses (software, services). Higher ROAS needed for low-margin businesses (retail, e-commerce). Adjust based on your specific margins: <strong>High margin (70%+)</strong> 3:1 ROAS acceptable, <strong>Medium margin (40-70%)</strong> 4:1 ROAS target, <strong>Low margin (under 40%)</strong> 6:1+ ROAS required.',
      keywords: ['5:1 ROAS', 'ROAS rule', 'target ROAS'],
    },
    {
      question: 'How do I calculate incremental ROI?',
      answer: 'Incremental ROI measures the additional return from increased marketing spend. Formula: <strong>Incremental ROI = (New Revenue - Baseline Revenue - Additional Cost) ÷ Additional Cost</strong>. Example: Baseline $10,000/month spend generates $40,000 revenue. Increase to $15,000/month generates $55,000 revenue. Incremental ROI = ($55,000 - $40,000 - $5,000) ÷ $5,000 = 200%. This shows whether additional investment is worthwhile. Use for: <strong>Budget increase decisions</strong>, <strong>Channel expansion</strong>, <strong>New campaign launches</strong>. Run <strong>holdout tests</strong>: pause campaigns in test markets to measure true incremental impact. Incremental ROI often decreases as spend increases (diminishing returns).',
      keywords: ['incremental ROI', 'marginal ROI', 'calculate incremental return'],
    },
    {
      question: 'What is the difference between ROI and profit margin?',
      answer: '<strong>ROI</strong> measures return relative to investment: (Revenue - Cost) ÷ Cost × 100. <strong>Profit Margin</strong> measures profit relative to revenue: (Revenue - Cost) ÷ Revenue × 100. Example: $10,000 investment generates $30,000 revenue. ROI = ($30,000 - $10,000) ÷ $10,000 = 200%. Profit Margin = ($30,000 - $10,000) ÷ $30,000 = 67%. ROI shows investment efficiency (how much you made on what you spent). Profit margin shows business efficiency (how much you keep from what you sell). Use ROI for marketing decisions, profit margin for pricing and business model decisions. Both are important for overall profitability.',
      keywords: ['ROI vs profit margin', 'profit margin', 'ROI difference'],
    },
    {
      question: 'How do I report marketing ROI to stakeholders?',
      answer: 'Effective ROI reporting includes: <strong>1) Executive summary</strong> (overall ROI, ROAS, key wins), <strong>2) Channel breakdown</strong> (ROI by channel with trends), <strong>3) Campaign performance</strong> (top/bottom performers), <strong>4) Attribution insights</strong> (multi-touch journey analysis), <strong>5) Recommendations</strong> (scale winners, pause losers, test opportunities). Use visualizations: <strong>ROI trend charts</strong>, <strong>Channel comparison tables</strong>, <strong>Funnel diagrams</strong>, <strong>Attribution paths</strong>. Include context: <strong>Industry benchmarks</strong>, <strong>Historical comparison</strong>, <strong>Seasonality factors</strong>. Report monthly for tactical decisions, quarterly for strategic planning. Focus on actionable insights, not just numbers. Explain what ROI means for business goals (revenue, growth, profitability).',
      keywords: ['report ROI', 'ROI reporting', 'marketing reports'],
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Budget Allocator',
      description: 'Allocate marketing budget across channels based on ROI and performance data.',
      url: '/tools/advertising/budget-allocator-enhanced',
      category: 'Advertising',
    },
    {
      name: 'CPC/CPM Calculator',
      description: 'Calculate advertising costs and metrics that feed into ROI calculations.',
      url: '/tools/advertising/cpc-cpm-calculator-enhanced',
      category: 'Advertising',
    },
    {
      name: 'Ad Copy Generator',
      description: 'Create high-converting ad copy to improve ROAS and overall campaign ROI.',
      url: '/tools/advertising/ad-copy-generator-enhanced',
      category: 'Advertising',
    },
  ] as RelatedTool[],
};

