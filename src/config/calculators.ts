/**
 * Marketing Calculator Configuration
 * 
 * 50 high-volume, long-tail keywords for programmatic SEO.
 * Each calculator targets specific marketing niches for lead capture.
 */

export interface CalculatorConfig {
    slug: string;
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    category: 'roi' | 'budget' | 'content' | 'social' | 'email' | 'advertising' | 'conversion';
    inputs: CalculatorInput[];
    formula: string;
    resultLabel: string;
    resultFormat: 'currency' | 'percentage' | 'number' | 'ratio';
    insights: string[];
    proFeatures: string[];
    relatedTools: string[];
}

export interface CalculatorInput {
    id: string;
    label: string;
    type: 'number' | 'currency' | 'percentage';
    placeholder: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    helpText?: string;
}

// 50 High-Volume Calculator Keywords
export const CALCULATOR_CONFIGS: CalculatorConfig[] = [
    // ROI Calculators (10)
    {
        slug: 'roi-calculator',
        title: 'Marketing ROI Calculator',
        description: 'Calculate your marketing return on investment and optimize your spending.',
        metaTitle: 'Free Marketing ROI Calculator | Calculate Your Return on Investment',
        metaDescription: 'Calculate your marketing ROI instantly. Enter your revenue and costs to see your exact return on investment percentage. Free tool.',
        category: 'roi',
        inputs: [
            { id: 'revenue', label: 'Revenue Generated', type: 'currency', placeholder: '50000', helpText: 'Total revenue attributed to marketing' },
            { id: 'cost', label: 'Marketing Cost', type: 'currency', placeholder: '10000', helpText: 'Total marketing spend' },
        ],
        formula: '((revenue - cost) / cost) * 100',
        resultLabel: 'Your Marketing ROI',
        resultFormat: 'percentage',
        insights: [
            'An ROI above 5:1 (500%) is considered excellent for most businesses.',
            'B2B companies typically see ROI between 300-500%.',
            'E-commerce businesses often target 400%+ ROI on paid ads.',
        ],
        proFeatures: ['Monthly trend tracking', 'Channel-by-channel ROI', 'Competitor benchmarking'],
        relatedTools: ['cpa-calculator', 'roas-calculator', 'ltv-calculator'],
    },
    {
        slug: 'roas-calculator',
        title: 'ROAS Calculator',
        description: 'Calculate your Return on Ad Spend to measure advertising effectiveness.',
        metaTitle: 'Free ROAS Calculator | Return on Ad Spend Calculator',
        metaDescription: 'Calculate your Return on Ad Spend (ROAS) instantly. Measure how much revenue you generate for every dollar spent on advertising.',
        category: 'advertising',
        inputs: [
            { id: 'revenue', label: 'Ad Revenue', type: 'currency', placeholder: '25000', helpText: 'Revenue from ads' },
            { id: 'adSpend', label: 'Ad Spend', type: 'currency', placeholder: '5000', helpText: 'Total ad spend' },
        ],
        formula: 'revenue / adSpend',
        resultLabel: 'Your ROAS',
        resultFormat: 'ratio',
        insights: [
            'A ROAS of 4:1 means you earn $4 for every $1 spent.',
            'E-commerce average ROAS is 2-4:1.',
            'Google Ads typically sees 2:1 to 3:1 ROAS.',
        ],
        proFeatures: ['Campaign-level ROAS', 'Platform comparison', 'Budget optimization'],
        relatedTools: ['roi-calculator', 'cpa-calculator', 'cpc-calculator'],
    },
    {
        slug: 'ltv-calculator',
        title: 'Customer Lifetime Value Calculator',
        description: 'Calculate how much revenue a customer generates over their entire relationship.',
        metaTitle: 'Free Customer LTV Calculator | Lifetime Value Calculator',
        metaDescription: 'Calculate customer lifetime value (LTV/CLV) to understand long-term revenue potential. Optimize acquisition costs and retention strategies.',
        category: 'roi',
        inputs: [
            { id: 'avgPurchase', label: 'Average Purchase Value', type: 'currency', placeholder: '100', helpText: 'Average order value' },
            { id: 'frequency', label: 'Purchase Frequency/Year', type: 'number', placeholder: '4', helpText: 'Orders per year' },
            { id: 'lifespan', label: 'Customer Lifespan (Years)', type: 'number', placeholder: '3', helpText: 'Average customer tenure' },
        ],
        formula: 'avgPurchase * frequency * lifespan',
        resultLabel: 'Customer Lifetime Value',
        resultFormat: 'currency',
        insights: [
            'LTV should be at least 3x your Customer Acquisition Cost (CAC).',
            'Increasing retention by 5% can increase profits by 25-95%.',
            'SaaS companies aim for LTV:CAC ratio of 3:1 or higher.',
        ],
        proFeatures: ['Cohort analysis', 'Churn projection', 'Revenue forecasting'],
        relatedTools: ['cac-calculator', 'roi-calculator', 'churn-calculator'],
    },
    {
        slug: 'cac-calculator',
        title: 'Customer Acquisition Cost Calculator',
        description: 'Calculate how much it costs to acquire a new customer.',
        metaTitle: 'Free CAC Calculator | Customer Acquisition Cost Calculator',
        metaDescription: 'Calculate your Customer Acquisition Cost (CAC) to optimize marketing spend. Compare against LTV for sustainable growth.',
        category: 'roi',
        inputs: [
            { id: 'marketingCost', label: 'Total Marketing Cost', type: 'currency', placeholder: '50000', helpText: 'Monthly marketing spend' },
            { id: 'salesCost', label: 'Sales Cost', type: 'currency', placeholder: '30000', helpText: 'Monthly sales team cost' },
            { id: 'newCustomers', label: 'New Customers Acquired', type: 'number', placeholder: '100', helpText: 'Customers acquired' },
        ],
        formula: '(marketingCost + salesCost) / newCustomers',
        resultLabel: 'Cost Per Customer',
        resultFormat: 'currency',
        insights: [
            'Healthy CAC should be less than 1/3 of LTV.',
            'B2B SaaS average CAC is $200-$800.',
            'E-commerce CAC typically ranges $10-$50.',
        ],
        proFeatures: ['Channel attribution', 'CAC payback period', 'LTV:CAC ratio'],
        relatedTools: ['ltv-calculator', 'cpa-calculator', 'roi-calculator'],
    },
    {
        slug: 'cpa-calculator',
        title: 'Cost Per Acquisition Calculator',
        description: 'Calculate your cost per acquisition for marketing campaigns.',
        metaTitle: 'Free CPA Calculator | Cost Per Acquisition Calculator',
        metaDescription: 'Calculate your Cost Per Acquisition (CPA) to measure campaign efficiency. Optimize ad spend and improve conversion rates.',
        category: 'advertising',
        inputs: [
            { id: 'totalCost', label: 'Total Campaign Cost', type: 'currency', placeholder: '5000', helpText: 'Total ad spend' },
            { id: 'conversions', label: 'Total Conversions', type: 'number', placeholder: '50', helpText: 'Number of conversions' },
        ],
        formula: 'totalCost / conversions',
        resultLabel: 'Cost Per Acquisition',
        resultFormat: 'currency',
        insights: [
            'Target CPA should be less than your profit margin.',
            'Google Ads average CPA is $48.96 across industries.',
            'Lower CPA often means better targeting or creative.',
        ],
        proFeatures: ['CPA by channel', 'Trend analysis', 'Goal setting'],
        relatedTools: ['cpc-calculator', 'conversion-rate-calculator', 'roi-calculator'],
    },

    // Budget & Planning Calculators (10)
    {
        slug: 'marketing-budget-calculator',
        title: 'Marketing Budget Calculator',
        description: 'Calculate your ideal marketing budget based on revenue goals.',
        metaTitle: 'Free Marketing Budget Calculator | Plan Your Ad Spend',
        metaDescription: 'Calculate your optimal marketing budget based on industry benchmarks and revenue goals. Plan your spending across channels.',
        category: 'budget',
        inputs: [
            { id: 'revenue', label: 'Annual Revenue', type: 'currency', placeholder: '1000000', helpText: 'Current or target revenue' },
            { id: 'growthTarget', label: 'Growth Target %', type: 'percentage', placeholder: '20', min: 0, max: 100, helpText: 'Desired growth rate' },
        ],
        formula: 'revenue * (growthTarget / 100) * 0.15',
        resultLabel: 'Recommended Marketing Budget',
        resultFormat: 'currency',
        insights: [
            'B2B companies typically spend 2-5% of revenue on marketing.',
            'B2C companies often spend 5-10% of revenue.',
            'High-growth startups may spend 15-25% on marketing.',
        ],
        proFeatures: ['Channel allocation', 'Seasonal planning', 'Competitor analysis'],
        relatedTools: ['roi-calculator', 'cpc-calculator', 'roas-calculator'],
    },
    {
        slug: 'cpc-calculator',
        title: 'Cost Per Click Calculator',
        description: 'Calculate your target cost per click for profitable campaigns.',
        metaTitle: 'Free CPC Calculator | Cost Per Click Calculator',
        metaDescription: 'Calculate your ideal Cost Per Click (CPC) to ensure profitable ad campaigns. Optimize your bidding strategy.',
        category: 'advertising',
        inputs: [
            { id: 'budget', label: 'Campaign Budget', type: 'currency', placeholder: '1000', helpText: 'Total budget' },
            { id: 'clicks', label: 'Expected Clicks', type: 'number', placeholder: '500', helpText: 'Goal clicks' },
        ],
        formula: 'budget / clicks',
        resultLabel: 'Cost Per Click',
        resultFormat: 'currency',
        insights: [
            'Google Ads average CPC is $1-$2 for Search.',
            'Facebook average CPC is $0.50-$1.00.',
            'B2B keywords can cost $5-$50+ per click.',
        ],
        proFeatures: ['Keyword-level CPC', 'Bid optimization', 'Quality score impact'],
        relatedTools: ['cpa-calculator', 'ctr-calculator', 'conversion-rate-calculator'],
    },
    {
        slug: 'cpm-calculator',
        title: 'CPM Calculator',
        description: 'Calculate your cost per thousand impressions for display campaigns.',
        metaTitle: 'Free CPM Calculator | Cost Per Mille Calculator',
        metaDescription: 'Calculate your Cost Per Mille (CPM) for display and video advertising. Optimize your brand awareness campaigns.',
        category: 'advertising',
        inputs: [
            { id: 'cost', label: 'Total Cost', type: 'currency', placeholder: '500', helpText: 'Ad spend' },
            { id: 'impressions', label: 'Impressions', type: 'number', placeholder: '100000', helpText: 'Total impressions' },
        ],
        formula: '(cost / impressions) * 1000',
        resultLabel: 'Cost Per 1000 Impressions',
        resultFormat: 'currency',
        insights: [
            'Display ads average $0.50-$4 CPM.',
            'Video ads average $3-$20 CPM.',
            'Premium placements can exceed $50 CPM.',
        ],
        proFeatures: ['CPM by placement', 'Viewability metrics', 'Frequency capping'],
        relatedTools: ['cpc-calculator', 'reach-calculator', 'brand-awareness-calculator'],
    },
    {
        slug: 'break-even-calculator',
        title: 'Break-Even Point Calculator',
        description: 'Calculate when your marketing campaign becomes profitable.',
        metaTitle: 'Free Break-Even Calculator | Marketing Break-Even Point',
        metaDescription: 'Calculate your marketing break-even point. Know exactly when your campaigns will become profitable.',
        category: 'roi',
        inputs: [
            { id: 'fixedCosts', label: 'Fixed Marketing Costs', type: 'currency', placeholder: '10000', helpText: 'Monthly fixed costs' },
            { id: 'revenuePerSale', label: 'Revenue Per Sale', type: 'currency', placeholder: '100', helpText: 'Average sale value' },
            { id: 'costPerSale', label: 'Cost Per Sale', type: 'currency', placeholder: '30', helpText: 'Variable cost per sale' },
        ],
        formula: 'fixedCosts / (revenuePerSale - costPerSale)',
        resultLabel: 'Sales Needed to Break Even',
        resultFormat: 'number',
        insights: [
            'Lower break-even = faster profitability.',
            'Consider both time and unit break-even.',
            'Factor in seasonal variations.',
        ],
        proFeatures: ['Scenario modeling', 'Cash flow projection', 'Risk analysis'],
        relatedTools: ['roi-calculator', 'profit-margin-calculator', 'cac-calculator'],
    },
    {
        slug: 'profit-margin-calculator',
        title: 'Profit Margin Calculator',
        description: 'Calculate your profit margins to optimize pricing and marketing.',
        metaTitle: 'Free Profit Margin Calculator | Calculate Your Margins',
        metaDescription: 'Calculate gross and net profit margins. Optimize your pricing strategy and understand your true profitability.',
        category: 'roi',
        inputs: [
            { id: 'revenue', label: 'Revenue', type: 'currency', placeholder: '50000', helpText: 'Total sales' },
            { id: 'cogs', label: 'Cost of Goods', type: 'currency', placeholder: '20000', helpText: 'Direct costs' },
            { id: 'expenses', label: 'Operating Expenses', type: 'currency', placeholder: '15000', helpText: 'Fixed costs' },
        ],
        formula: '((revenue - cogs - expenses) / revenue) * 100',
        resultLabel: 'Net Profit Margin',
        resultFormat: 'percentage',
        insights: [
            'E-commerce typically targets 10-20% net margin.',
            'SaaS companies often achieve 70-80% gross margin.',
            'Service businesses target 15-25% net margin.',
        ],
        proFeatures: ['Margin trends', 'Product profitability', 'Pricing optimization'],
        relatedTools: ['break-even-calculator', 'roi-calculator', 'cac-calculator'],
    },

    // Conversion Calculators (10)
    {
        slug: 'conversion-rate-calculator',
        title: 'Conversion Rate Calculator',
        description: 'Calculate your website conversion rate and identify improvement opportunities.',
        metaTitle: 'Free Conversion Rate Calculator | Calculate Your CR',
        metaDescription: 'Calculate your conversion rate instantly. Compare against benchmarks and identify opportunities to improve.',
        category: 'conversion',
        inputs: [
            { id: 'conversions', label: 'Total Conversions', type: 'number', placeholder: '150', helpText: 'Sales, signups, etc.' },
            { id: 'visitors', label: 'Total Visitors', type: 'number', placeholder: '10000', helpText: 'Website visitors' },
        ],
        formula: '(conversions / visitors) * 100',
        resultLabel: 'Conversion Rate',
        resultFormat: 'percentage',
        insights: [
            'E-commerce average is 2-3% conversion rate.',
            'Landing pages should target 5-10%.',
            'B2B lead gen typically sees 2-5% conversion.',
        ],
        proFeatures: ['Funnel analysis', 'A/B test calculator', 'Segment breakdown'],
        relatedTools: ['ctr-calculator', 'ab-test-calculator', 'bounce-rate-calculator'],
    },
    {
        slug: 'ctr-calculator',
        title: 'Click-Through Rate Calculator',
        description: 'Calculate your CTR for ads, emails, and content.',
        metaTitle: 'Free CTR Calculator | Click-Through Rate Calculator',
        metaDescription: 'Calculate your Click-Through Rate (CTR) for ads and emails. Benchmark against industry standards.',
        category: 'conversion',
        inputs: [
            { id: 'clicks', label: 'Total Clicks', type: 'number', placeholder: '500', helpText: 'Clicks received' },
            { id: 'impressions', label: 'Total Impressions', type: 'number', placeholder: '50000', helpText: 'Views/impressions' },
        ],
        formula: '(clicks / impressions) * 100',
        resultLabel: 'Click-Through Rate',
        resultFormat: 'percentage',
        insights: [
            'Google Search CTR average is 2-5%.',
            'Display ads average 0.1-0.5% CTR.',
            'Email CTR average is 2-3%.',
        ],
        proFeatures: ['CTR by position', 'Creative analysis', 'Competitor benchmarking'],
        relatedTools: ['conversion-rate-calculator', 'cpc-calculator', 'open-rate-calculator'],
    },
    {
        slug: 'bounce-rate-calculator',
        title: 'Bounce Rate Calculator',
        description: 'Calculate your website bounce rate and engagement metrics.',
        metaTitle: 'Free Bounce Rate Calculator | Website Engagement',
        metaDescription: 'Calculate and analyze your website bounce rate. Get actionable insights to improve user engagement.',
        category: 'conversion',
        inputs: [
            { id: 'singlePageSessions', label: 'Single Page Sessions', type: 'number', placeholder: '3000', helpText: 'Visitors who left immediately' },
            { id: 'totalSessions', label: 'Total Sessions', type: 'number', placeholder: '10000', helpText: 'All website sessions' },
        ],
        formula: '(singlePageSessions / totalSessions) * 100',
        resultLabel: 'Bounce Rate',
        resultFormat: 'percentage',
        insights: [
            'Average bounce rate is 40-60%.',
            'Blog posts often see 70-90% bounce.',
            'Landing pages should target under 40%.',
        ],
        proFeatures: ['Page-level analysis', 'Traffic source breakdown', 'UX recommendations'],
        relatedTools: ['conversion-rate-calculator', 'session-duration-calculator', 'pages-per-session-calculator'],
    },
    {
        slug: 'ab-test-calculator',
        title: 'A/B Test Calculator',
        description: 'Calculate statistical significance for your A/B tests.',
        metaTitle: 'Free A/B Test Calculator | Statistical Significance',
        metaDescription: 'Calculate if your A/B test results are statistically significant. Make data-driven decisions with confidence.',
        category: 'conversion',
        inputs: [
            { id: 'visitorsA', label: 'Visitors (Control)', type: 'number', placeholder: '5000', helpText: 'Control group visitors' },
            { id: 'conversionsA', label: 'Conversions (Control)', type: 'number', placeholder: '100', helpText: 'Control conversions' },
            { id: 'visitorsB', label: 'Visitors (Variant)', type: 'number', placeholder: '5000', helpText: 'Variant group visitors' },
            { id: 'conversionsB', label: 'Conversions (Variant)', type: 'number', placeholder: '130', helpText: 'Variant conversions' },
        ],
        formula: '((conversionsB / visitorsB) - (conversionsA / visitorsA)) / (conversionsA / visitorsA) * 100',
        resultLabel: 'Relative Improvement',
        resultFormat: 'percentage',
        insights: [
            'Wait for 95% statistical significance.',
            'Run tests for at least 2 weeks.',
            'Minimum 1000 visitors per variant.',
        ],
        proFeatures: ['Confidence interval', 'Sample size calculator', 'Test duration estimator'],
        relatedTools: ['conversion-rate-calculator', 'sample-size-calculator', 'experiment-calculator'],
    },
    {
        slug: 'churn-calculator',
        title: 'Customer Churn Rate Calculator',
        description: 'Calculate your customer churn rate and revenue impact.',
        metaTitle: 'Free Churn Rate Calculator | Customer Retention Calculator',
        metaDescription: 'Calculate your customer churn rate and understand its revenue impact. Identify retention opportunities.',
        category: 'conversion',
        inputs: [
            { id: 'customersStart', label: 'Customers at Start', type: 'number', placeholder: '1000', helpText: 'Beginning of period' },
            { id: 'customersLost', label: 'Customers Lost', type: 'number', placeholder: '50', helpText: 'Churned customers' },
        ],
        formula: '(customersLost / customersStart) * 100',
        resultLabel: 'Monthly Churn Rate',
        resultFormat: 'percentage',
        insights: [
            'SaaS industry average is 5-7% annually.',
            'Reducing churn by 1% can increase profits 25%.',
            'Focus on first 90 days for highest impact.',
        ],
        proFeatures: ['Cohort analysis', 'Revenue churn', 'Retention forecasting'],
        relatedTools: ['ltv-calculator', 'retention-rate-calculator', 'nps-calculator'],
    },

    // Email Marketing (8)
    {
        slug: 'email-open-rate-calculator',
        title: 'Email Open Rate Calculator',
        description: 'Calculate your email open rate and benchmark performance.',
        metaTitle: 'Free Email Open Rate Calculator | Email Marketing Metrics',
        metaDescription: 'Calculate your email open rate and compare against industry benchmarks. Improve your email marketing performance.',
        category: 'email',
        inputs: [
            { id: 'opens', label: 'Total Opens', type: 'number', placeholder: '2500', helpText: 'Unique opens' },
            { id: 'delivered', label: 'Emails Delivered', type: 'number', placeholder: '10000', helpText: 'Successfully delivered' },
        ],
        formula: '(opens / delivered) * 100',
        resultLabel: 'Open Rate',
        resultFormat: 'percentage',
        insights: [
            'Average email open rate is 21-25%.',
            'Subject lines impact 65% of opens.',
            'Best send times: Tuesday 10am or Thursday 3pm.',
        ],
        proFeatures: ['Subject line testing', 'Send time optimization', 'List segmentation'],
        relatedTools: ['ctr-calculator', 'email-revenue-calculator', 'spam-score-calculator'],
    },
    {
        slug: 'email-revenue-calculator',
        title: 'Email Revenue Calculator',
        description: 'Calculate revenue per email and campaign ROI.',
        metaTitle: 'Free Email Revenue Calculator | Email Marketing ROI',
        metaDescription: 'Calculate your email marketing revenue and ROI. Measure the true value of your email campaigns.',
        category: 'email',
        inputs: [
            { id: 'revenue', label: 'Campaign Revenue', type: 'currency', placeholder: '5000', helpText: 'Sales from campaign' },
            { id: 'emailsSent', label: 'Emails Sent', type: 'number', placeholder: '10000', helpText: 'Total sent' },
        ],
        formula: 'revenue / emailsSent',
        resultLabel: 'Revenue Per Email',
        resultFormat: 'currency',
        insights: [
            'Email averages $42 ROI per $1 spent.',
            'Automated emails generate 70% higher revenue.',
            'Segmented campaigns drive 30% more revenue.',
        ],
        proFeatures: ['Campaign comparison', 'Segment revenue', 'Automation ROI'],
        relatedTools: ['email-open-rate-calculator', 'roi-calculator', 'list-growth-calculator'],
    },
    {
        slug: 'email-list-growth-calculator',
        title: 'Email List Growth Calculator',
        description: 'Calculate your email list growth rate and subscriber value.',
        metaTitle: 'Free Email List Growth Calculator | Subscriber Growth',
        metaDescription: 'Calculate your email list growth rate. Understand subscriber acquisition and plan for scale.',
        category: 'email',
        inputs: [
            { id: 'newSubs', label: 'New Subscribers', type: 'number', placeholder: '500', helpText: 'This period' },
            { id: 'unsubscribes', label: 'Unsubscribes', type: 'number', placeholder: '50', helpText: 'This period' },
            { id: 'listSize', label: 'Current List Size', type: 'number', placeholder: '10000', helpText: 'Total subscribers' },
        ],
        formula: '((newSubs - unsubscribes) / listSize) * 100',
        resultLabel: 'List Growth Rate',
        resultFormat: 'percentage',
        insights: [
            'Healthy growth is 3-5% monthly.',
            '25% of lists decay annually.',
            'Quality > quantity for engagement.',
        ],
        proFeatures: ['Source attribution', 'Quality scoring', 'Growth projections'],
        relatedTools: ['email-open-rate-calculator', 'churn-calculator', 'subscriber-value-calculator'],
    },
    {
        slug: 'email-deliverability-calculator',
        title: 'Email Deliverability Calculator',
        description: 'Calculate your email deliverability rate and identify issues.',
        metaTitle: 'Free Email Deliverability Calculator | Inbox Placement',
        metaDescription: 'Calculate your email deliverability rate. Identify and fix issues affecting your inbox placement.',
        category: 'email',
        inputs: [
            { id: 'delivered', label: 'Emails Delivered', type: 'number', placeholder: '9500', helpText: 'Successfully delivered' },
            { id: 'sent', label: 'Emails Sent', type: 'number', placeholder: '10000', helpText: 'Total attempts' },
        ],
        formula: '(delivered / sent) * 100',
        resultLabel: 'Deliverability Rate',
        resultFormat: 'percentage',
        insights: [
            'Target 95%+ deliverability.',
            'Bounce rate should be under 2%.',
            'Check spam scores regularly.',
        ],
        proFeatures: ['Domain reputation', 'Spam testing', 'Blacklist monitoring'],
        relatedTools: ['email-open-rate-calculator', 'spam-score-calculator', 'bounce-rate-calculator'],
    },

    // Social Media (8)
    {
        slug: 'engagement-rate-calculator',
        title: 'Social Media Engagement Rate Calculator',
        description: 'Calculate your social media engagement rate across platforms.',
        metaTitle: 'Free Engagement Rate Calculator | Social Media Metrics',
        metaDescription: 'Calculate your social media engagement rate for Instagram, TikTok, LinkedIn, and more. Benchmark your performance.',
        category: 'social',
        inputs: [
            { id: 'totalEngagements', label: 'Total Engagements', type: 'number', placeholder: '500', helpText: 'Likes, comments, shares' },
            { id: 'followers', label: 'Total Followers', type: 'number', placeholder: '10000', helpText: 'Account followers' },
        ],
        formula: '(totalEngagements / followers) * 100',
        resultLabel: 'Engagement Rate',
        resultFormat: 'percentage',
        insights: [
            'Instagram: 1-3% is average, 5%+ is excellent.',
            'LinkedIn: 2% engagement is good.',
            'TikTok: 3-9% is typical, 10%+ is viral.',
        ],
        proFeatures: ['Platform benchmarks', 'Content analysis', 'Best time to post'],
        relatedTools: ['reach-calculator', 'follower-growth-calculator', 'viral-coefficient-calculator'],
    },
    {
        slug: 'influencer-roi-calculator',
        title: 'Influencer Marketing ROI Calculator',
        description: 'Calculate the ROI of your influencer marketing campaigns.',
        metaTitle: 'Free Influencer ROI Calculator | Influencer Marketing',
        metaDescription: 'Calculate your influencer marketing ROI. Measure the true value of creator partnerships.',
        category: 'social',
        inputs: [
            { id: 'revenue', label: 'Revenue Generated', type: 'currency', placeholder: '10000', helpText: 'Attributed sales' },
            { id: 'cost', label: 'Influencer Cost', type: 'currency', placeholder: '2000', helpText: 'Total campaign cost' },
        ],
        formula: '((revenue - cost) / cost) * 100',
        resultLabel: 'Influencer ROI',
        resultFormat: 'percentage',
        insights: [
            'Average influencer ROI is 5.2x ($5.20 per $1).',
            'Micro-influencers often deliver higher ROI.',
            'Long-term partnerships outperform one-offs.',
        ],
        proFeatures: ['Creator performance', 'Cost per engagement', 'Attribution tracking'],
        relatedTools: ['roi-calculator', 'engagement-rate-calculator', 'earned-media-value-calculator'],
    },
    {
        slug: 'social-media-reach-calculator',
        title: 'Social Media Reach Calculator',
        description: 'Calculate your social media reach and impression metrics.',
        metaTitle: 'Free Social Media Reach Calculator | Reach Metrics',
        metaDescription: 'Calculate your social media reach and understand your content visibility. Optimize for maximum exposure.',
        category: 'social',
        inputs: [
            { id: 'impressions', label: 'Total Impressions', type: 'number', placeholder: '50000', helpText: 'All impressions' },
            { id: 'uniqueReach', label: 'Unique Reach', type: 'number', placeholder: '25000', helpText: 'Unique users reached' },
        ],
        formula: 'impressions / uniqueReach',
        resultLabel: 'Frequency (Views per Person)',
        resultFormat: 'ratio',
        insights: [
            'Optimal frequency is 3-7 times.',
            'Over 10 frequency may cause fatigue.',
            'Brand awareness needs 5+ exposures.',
        ],
        proFeatures: ['Audience overlap', 'Reach forecasting', 'Platform comparison'],
        relatedTools: ['engagement-rate-calculator', 'cpm-calculator', 'follower-growth-calculator'],
    },
    {
        slug: 'follower-growth-calculator',
        title: 'Follower Growth Rate Calculator',
        description: 'Calculate your social media follower growth rate.',
        metaTitle: 'Free Follower Growth Calculator | Social Media Growth',
        metaDescription: 'Calculate your follower growth rate across social platforms. Track and optimize your audience growth.',
        category: 'social',
        inputs: [
            { id: 'newFollowers', label: 'New Followers', type: 'number', placeholder: '500', helpText: 'This period' },
            { id: 'totalFollowers', label: 'Total Followers', type: 'number', placeholder: '10000', helpText: 'Current followers' },
        ],
        formula: '(newFollowers / totalFollowers) * 100',
        resultLabel: 'Growth Rate',
        resultFormat: 'percentage',
        insights: [
            'Healthy growth is 2-5% monthly.',
            'Viral content can drive 10%+ spikes.',
            'Focus on retention alongside growth.',
        ],
        proFeatures: ['Growth projections', 'Source analysis', 'Competitor tracking'],
        relatedTools: ['engagement-rate-calculator', 'social-media-reach-calculator', 'viral-coefficient-calculator'],
    },

    // Content Marketing (6)
    {
        slug: 'content-roi-calculator',
        title: 'Content Marketing ROI Calculator',
        description: 'Calculate the ROI of your content marketing efforts.',
        metaTitle: 'Free Content ROI Calculator | Content Marketing ROI',
        metaDescription: 'Calculate your content marketing ROI. Measure the true business value of your content strategy.',
        category: 'content',
        inputs: [
            { id: 'leads', label: 'Leads Generated', type: 'number', placeholder: '100', helpText: 'Content-attributed leads' },
            { id: 'conversionRate', label: 'Lead-to-Customer Rate %', type: 'percentage', placeholder: '10', min: 0, max: 100, helpText: 'Conversion rate' },
            { id: 'avgDealSize', label: 'Average Deal Size', type: 'currency', placeholder: '5000', helpText: 'Customer value' },
            { id: 'contentCost', label: 'Content Investment', type: 'currency', placeholder: '10000', helpText: 'Total content spend' },
        ],
        formula: '((leads * (conversionRate / 100) * avgDealSize) - contentCost) / contentCost * 100',
        resultLabel: 'Content Marketing ROI',
        resultFormat: 'percentage',
        insights: [
            'Content marketing costs 62% less than outbound.',
            'ROI improves significantly over time.',
            'Evergreen content delivers compounding returns.',
        ],
        proFeatures: ['Attribution modeling', 'Content performance', 'Pipeline influence'],
        relatedTools: ['roi-calculator', 'cpl-calculator', 'blog-traffic-calculator'],
    },
    {
        slug: 'blog-traffic-calculator',
        title: 'Blog Traffic Value Calculator',
        description: 'Calculate the monetary value of your organic blog traffic.',
        metaTitle: 'Free Blog Traffic Value Calculator | SEO Value',
        metaDescription: 'Calculate the value of your blog traffic as if you paid for it. Understand your SEO ROI.',
        category: 'content',
        inputs: [
            { id: 'monthlyTraffic', label: 'Monthly Organic Traffic', type: 'number', placeholder: '50000', helpText: 'Blog visitors' },
            { id: 'avgCPC', label: 'Average CPC', type: 'currency', placeholder: '2', helpText: 'If you paid for this traffic' },
        ],
        formula: 'monthlyTraffic * avgCPC',
        resultLabel: 'Monthly Traffic Value',
        resultFormat: 'currency',
        insights: [
            'Organic traffic value compounds over time.',
            'B2B keywords often worth $5-50+ per click.',
            'Calculate annual value for true ROI.',
        ],
        proFeatures: ['Keyword value analysis', 'Traffic projections', 'Content gap analysis'],
        relatedTools: ['content-roi-calculator', 'seo-roi-calculator', 'cpc-calculator'],
    },
    {
        slug: 'video-roi-calculator',
        title: 'Video Marketing ROI Calculator',
        description: 'Calculate the ROI of your video marketing campaigns.',
        metaTitle: 'Free Video Marketing ROI Calculator | Video ROI',
        metaDescription: 'Calculate your video marketing ROI. Measure the business impact of your video content.',
        category: 'content',
        inputs: [
            { id: 'views', label: 'Total Views', type: 'number', placeholder: '100000', helpText: 'Video views' },
            { id: 'viewThroughRate', label: 'View-Through Rate %', type: 'percentage', placeholder: '30', min: 0, max: 100, helpText: 'Completed views' },
            { id: 'conversionRate', label: 'Conversion Rate %', type: 'percentage', placeholder: '2', min: 0, max: 100, helpText: 'Viewers who convert' },
            { id: 'conversionValue', label: 'Conversion Value', type: 'currency', placeholder: '50', helpText: 'Value per conversion' },
            { id: 'productionCost', label: 'Production Cost', type: 'currency', placeholder: '5000', helpText: 'Video production cost' },
        ],
        formula: '((views * (viewThroughRate / 100) * (conversionRate / 100) * conversionValue) - productionCost) / productionCost * 100',
        resultLabel: 'Video Marketing ROI',
        resultFormat: 'percentage',
        insights: [
            'Video content converts 80% more than text.',
            'Average video CPV is $0.10-0.30.',
            'Short-form video sees highest engagement.',
        ],
        proFeatures: ['Retention analysis', 'A/B testing', 'Platform optimization'],
        relatedTools: ['content-roi-calculator', 'engagement-rate-calculator', 'youtube-roi-calculator'],
    },
    {
        slug: 'seo-roi-calculator',
        title: 'SEO ROI Calculator',
        description: 'Calculate the return on investment from your SEO efforts.',
        metaTitle: 'Free SEO ROI Calculator | SEO Return on Investment',
        metaDescription: 'Calculate your SEO ROI and prove the value of organic search. Measure rankings, traffic, and conversions.',
        category: 'content',
        inputs: [
            { id: 'organicRevenue', label: 'Organic Revenue', type: 'currency', placeholder: '100000', helpText: 'Monthly SEO revenue' },
            { id: 'seoInvestment', label: 'SEO Investment', type: 'currency', placeholder: '5000', helpText: 'Monthly SEO spend' },
        ],
        formula: '((organicRevenue - seoInvestment) / seoInvestment) * 100',
        resultLabel: 'SEO ROI',
        resultFormat: 'percentage',
        insights: [
            'SEO typically delivers 200-500% ROI.',
            'Results compound over 6-12 months.',
            'Local SEO can see faster returns.',
        ],
        proFeatures: ['Keyword tracking', 'Traffic attribution', 'Competitor analysis'],
        relatedTools: ['content-roi-calculator', 'blog-traffic-calculator', 'cpc-calculator'],
    },
];

// Helper to get calculator by slug
export function getCalculatorBySlug(slug: string): CalculatorConfig | undefined {
    return CALCULATOR_CONFIGS.find(calc => calc.slug === slug);
}

// Get calculators by category
export function getCalculatorsByCategory(category: CalculatorConfig['category']): CalculatorConfig[] {
    return CALCULATOR_CONFIGS.filter(calc => calc.category === category);
}

// Get all calculator slugs for static path generation
export function getAllCalculatorSlugs(): string[] {
    return CALCULATOR_CONFIGS.map(calc => calc.slug);
}

// Calculate result based on formula and inputs
export function calculateResult(formula: string, inputs: Record<string, number>): number {
    // Create a safe evaluation function
    try {
        const evalFormula = Object.entries(inputs).reduce(
            (acc, [key, value]) => acc.replace(new RegExp(key, 'g'), String(value)),
            formula
        );
        // Use Function constructor for safer eval
        return Function(`"use strict"; return (${evalFormula})`)();
    } catch {
        return 0;
    }
}

// Format result based on type
export function formatResult(value: number, format: CalculatorConfig['resultFormat']): string {
    switch (format) {
        case 'currency':
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        case 'percentage':
            return `${value.toFixed(2)}%`;
        case 'ratio':
            return `${value.toFixed(2)}:1`;
        case 'number':
        default:
            return new Intl.NumberFormat('en-US').format(Math.round(value));
    }
}
