import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Additional Strategy Sections
 * Content strategy, customer journey, measurement, technology, appendix
 */

// Content Strategy
export function generateContentStrategy(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const contentThemes = [
    `${input.industry} industry insights and trends`,
    `${input.businessType} best practices and how-to guides`,
    `Customer success stories and case studies`,
    `Product/service education and tutorials`,
    `Thought leadership and expert perspectives`,
  ];

  const contentPillars = [
    {
      pillar: 'Educational Content',
      description: 'Help prospects understand their challenges and potential solutions',
      contentTypes: ['How-to guides', 'Tutorials', 'Webinars', 'Explainer videos', 'FAQs'],
    },
    {
      pillar: 'Thought Leadership',
      description: 'Establish authority and expertise in the industry',
      contentTypes: ['Industry reports', 'Original research', 'Expert interviews', 'Opinion pieces', 'Podcasts'],
    },
    {
      pillar: 'Product/Solution Content',
      description: 'Showcase value proposition and differentiation',
      contentTypes: ['Product demos', 'Feature highlights', 'Comparison guides', 'Use cases', 'ROI calculators'],
    },
    {
      pillar: 'Customer Stories',
      description: 'Build trust through social proof and real results',
      contentTypes: ['Case studies', 'Testimonials', 'Video interviews', 'Success metrics', 'Before/after stories'],
    },
  ];

  return {
    contentThemes: isPaid ? [...contentThemes, 'Emerging technology and innovation insights', 'Community-driven content initiatives'] : contentThemes,
    contentPillars: isPaid ? [...contentPillars, {
      pillar: 'Data-Driven Insights',
      description: 'Leverage proprietary data and analytics to provide unique market insights',
      contentTypes: ['Original research reports', 'Data visualizations', 'Trend analysis', 'Predictive insights'],
    }] : contentPillars,
    contentCalendar: {
      frequency: input.budget < 50000 ? '2-3 blog posts per week, 5-7 social posts per day' : '4-5 blog posts per week, 10-15 social posts per day, 1-2 videos per week',
      distribution: [
        'Company blog and website',
        'Email newsletter (weekly or bi-weekly)',
        'Social media platforms (daily)',
        'Industry publications (guest posts monthly)',
        'YouTube and video platforms',
        'LinkedIn and professional networks',
      ],
    },
    seoStrategy: `Focus on ${input.businessType === 'B2B' ? 'long-tail, high-intent keywords' : 'transactional and informational keywords'} targeting ${input.targetAudience}. Create comprehensive pillar pages for core topics with supporting cluster content. Optimize for featured snippets and voice search. Build authoritative backlink profile through digital PR and guest posting.`,
    distributionPlan: [
      'Owned channels: Blog, email list, social media profiles',
      'Earned channels: PR, guest posts, influencer mentions, organic social shares',
      'Paid channels: Social media ads, content promotion, sponsored content',
      'Partnerships: Co-marketing, content syndication, industry collaborations',
    ],
  };
}

// Customer Journey Mapping
export function generateCustomerJourneyMapping(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const journeyStage = {
    awareness: {
      stage: 'Awareness',
      customerMindset: 'Identifying problem or opportunity, seeking information',
      marketingActivities: [
        'SEO-optimized blog content targeting problem-aware keywords',
        'Social media content showcasing industry insights',
        'Display advertising and social media ads',
        'PR and media coverage',
        'Industry events and webinars',
      ],
      contentTypes: [
        'Educational blog posts',
        'Industry reports and research',
        'Infographics and visual content',
        'Social media posts',
        'Podcast episodes',
      ],
      channels: ['SEO', 'Social Media', 'PR', 'Display Ads', 'Content Marketing'],
      metrics: ['Impressions', 'Reach', 'Website traffic', 'Social engagement', 'Brand awareness'],
    },
    consideration: {
      stage: 'Consideration',
      customerMindset: 'Evaluating solutions, comparing options, seeking validation',
      marketingActivities: [
        'Comparison guides and product pages',
        'Webinars and product demos',
        'Email nurture campaigns',
        'Retargeting campaigns',
        'Case studies and testimonials',
      ],
      contentTypes: [
        'Comparison guides',
        'Product demos and videos',
        'Case studies',
        'Whitepapers and ebooks',
        'Webinars',
        'Email series',
      ],
      channels: ['Email Marketing', 'Retargeting', 'Content Marketing', 'Webinars', 'Social Proof'],
      metrics: ['Lead generation', 'Email engagement', 'Content downloads', 'Demo requests', 'Time on site'],
    },
    decision: {
      stage: 'Decision',
      customerMindset: 'Ready to purchase, final evaluation, seeking reassurance',
      marketingActivities: [
        'Free trials or demos',
        'Personalized sales outreach',
        'Customer testimonials and reviews',
        'Limited-time offers or incentives',
        'ROI calculators and business case tools',
      ],
      contentTypes: [
        'Product specifications',
        'Pricing information',
        'Customer testimonials',
        'ROI calculators',
        'Implementation guides',
        'FAQ pages',
      ],
      channels: ['Sales Outreach', 'Email', 'Retargeting', 'Customer Reviews', 'Direct Response'],
      metrics: ['Conversion rate', 'Sales qualified leads', 'Trial signups', 'Purchase rate', 'Deal velocity'],
    },
    retention: {
      stage: 'Retention',
      customerMindset: 'Using product/service, seeking value, considering renewal',
      marketingActivities: [
        'Onboarding email series',
        'Customer success check-ins',
        'Product education and training',
        'Feature announcements and updates',
        'Customer community engagement',
      ],
      contentTypes: [
        'Onboarding guides',
        'Tutorial videos',
        'Best practices content',
        'Product updates',
        'Customer newsletters',
        'Success stories',
      ],
      channels: ['Email', 'In-app messaging', 'Customer portal', 'Webinars', 'Community'],
      metrics: ['Product usage', 'Customer satisfaction (CSAT)', 'Net Promoter Score (NPS)', 'Retention rate', 'Churn rate'],
    },
    advocacy: {
      stage: 'Advocacy',
      customerMindset: 'Satisfied customer, willing to recommend, seeking recognition',
      marketingActivities: [
        'Referral program',
        'Customer case study development',
        'Review and testimonial requests',
        'User-generated content campaigns',
        'VIP customer events',
      ],
      contentTypes: [
        'Case studies',
        'Video testimonials',
        'User-generated content',
        'Success stories',
        'Referral program materials',
      ],
      channels: ['Referral Program', 'Social Media', 'Review Sites', 'Events', 'Community'],
      metrics: ['Referrals', 'Reviews and ratings', 'Social mentions', 'Case studies created', 'Customer lifetime value'],
    },
  };

  if (isPaid) {
    return {
      ...journeyStage,
      expansion: {
        stage: 'Expansion',
        customerMindset: 'Exploring additional products/services, seeking more value',
        marketingActivities: [
          'Upsell and cross-sell campaigns',
          'Advanced feature education',
          'Account expansion strategies',
          'Executive engagement programs',
        ],
        contentTypes: ['Advanced use cases', 'ROI expansion calculators', 'Enterprise guides'],
        channels: ['Account-based marketing', 'Email', 'In-app', 'Sales enablement'],
        metrics: ['Expansion revenue', 'Upsell rate', 'Cross-sell rate', 'Account growth'],
      },
    };
  }

  return journeyStage;
}

// Measurement & Analytics
export function generateMeasurementAndAnalytics(input: EnhancedStrategyInput, isPaid: boolean = false) {
  return {
    dashboards: [
      'Executive Dashboard: High-level KPIs, ROI, revenue attribution',
      'Channel Performance Dashboard: Traffic, conversions, cost per acquisition by channel',
      'Content Performance Dashboard: Top content, engagement metrics, SEO rankings',
      'Lead Generation Dashboard: Lead volume, quality, conversion rates, pipeline',
      'Customer Journey Dashboard: Funnel metrics, drop-off points, conversion paths',
      ...(isPaid ? ['Predictive Analytics Dashboard: Churn prediction, LTV forecasting, trend analysis', 'Competitive Intelligence Dashboard: Market share, competitor activity, sentiment analysis'] : []),
    ],
    reportingCadence: 'Daily automated reports for key metrics, weekly team reviews, monthly executive reports, quarterly strategic reviews',
    keyReports: [
      'Monthly Marketing Performance Report (KPIs, channel performance, ROI)',
      'Quarterly Business Review (strategic progress, market insights, recommendations)',
      'Campaign Post-Mortems (learnings, optimizations, best practices)',
      'Competitive Analysis Report (quarterly)',
      'Customer Insights Report (quarterly)',
    ],
    optimizationPlan: 'Continuous optimization cycle: Monitor daily → Analyze weekly → Test bi-weekly → Implement monthly. Focus on improving conversion rates, reducing CAC, increasing LTV, and maximizing ROI across all channels.',
    testingStrategy: [
      'A/B testing: Landing pages, ad copy, email subject lines, CTAs',
      'Multivariate testing: Complex page elements and user flows',
      'Channel testing: New platforms and tactics (10% of budget)',
      'Audience testing: New segments and targeting approaches',
      'Messaging testing: Value propositions and positioning',
    ],
    attributionModel: input.businessType === 'B2B' ? 'Multi-touch attribution (W-shaped model giving credit to first touch, lead creation, and opportunity creation)' : 'Last-click attribution with assisted conversions tracking for full customer journey visibility',
  };
}

// Competitive Differentiation
export function generateCompetitiveDifferentiation(input: EnhancedStrategyInput, isPaid: boolean = false) {
  return {
    uniqueSellingPropositions: [
      `${input.brandPositioning} positioning in ${input.competitiveLandscape.toLowerCase().replace(/_/g, ' ')} market`,
      `Specialized ${input.businessType} expertise in ${input.industry}`,
      `${input.companyStage === 'STARTUP' ? 'Agile and innovative approach' : input.companyStage === 'ENTERPRISE' ? 'Enterprise-scale capabilities' : 'Proven scalability and growth expertise'}`,
      `Focus on ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} outcomes`,
    ],
    competitiveAdvantages: [
      `${input.marketingMaturity === 'EXPERT' ? 'World-class marketing capabilities' : 'Committed to marketing excellence'}`,
      `${input.geographicScope} market presence and expertise`,
      `${input.existingMarTech && input.existingMarTech.length > 0 ? 'Advanced marketing technology stack' : 'Modern marketing approach'}`,
      'Customer-centric strategy and execution',
    ],
    marketGaps: [
      `Underserved ${input.targetAudience} segment`,
      `Lack of ${input.brandPositioning.toLowerCase()} options in market`,
      `Limited ${input.businessType} solutions with comprehensive approach`,
    ],
    innovationOpportunities: [
      'Leverage emerging channels and platforms',
      'Implement AI and automation for personalization',
      'Create category-defining content and thought leadership',
      'Build community and ecosystem around brand',
      ...(isPaid ? ['Develop proprietary data products', 'Launch industry-first initiatives', 'Create strategic IP and frameworks'] : []),
    ],
  };
}

// Technology & Tools
export function generateTechnologyAndTools(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const tools: any[] = [];

  // Essential tools for all
  tools.push({
    category: 'Analytics',
    tool: 'Google Analytics 4',
    purpose: 'Website analytics, user behavior tracking, conversion measurement',
    priority: 'Critical',
    estimatedCost: 'Free',
  });

  tools.push({
    category: 'CRM',
    tool: input.businessType === 'B2B' ? 'HubSpot or Salesforce' : 'HubSpot or Klaviyo',
    purpose: 'Customer relationship management, lead tracking, sales pipeline',
    priority: 'Critical',
    estimatedCost: input.budget < 50000 ? '$50-200/month' : '$500-2000/month',
  });

  tools.push({
    category: 'Email Marketing',
    tool: input.businessType === 'B2B' ? 'HubSpot or Marketo' : 'Klaviyo or Mailchimp',
    purpose: 'Email campaigns, automation, segmentation',
    priority: 'Critical',
    estimatedCost: '$50-500/month',
  });

  // SEO tools
  if (input.preferredChannels?.includes('SEO') || input.budget > 30000) {
    tools.push({
      category: 'SEO',
      tool: 'Ahrefs or SEMrush',
      purpose: 'Keyword research, competitor analysis, backlink tracking',
      priority: 'High',
      estimatedCost: '$99-399/month',
    });
  }

  // Social media tools
  if (input.preferredChannels?.includes('SOCIAL_MEDIA_ORGANIC') || input.preferredChannels?.includes('SOCIAL_MEDIA_PAID')) {
    tools.push({
      category: 'Social Media Management',
      tool: 'Hootsuite or Buffer',
      purpose: 'Social media scheduling, monitoring, analytics',
      priority: 'High',
      estimatedCost: '$29-129/month',
    });
  }

  // Marketing automation
  if (input.budget > 50000) {
    tools.push({
      category: 'Marketing Automation',
      tool: input.businessType === 'B2B' ? 'Marketo or Pardot' : 'HubSpot or ActiveCampaign',
      purpose: 'Lead nurturing, scoring, multi-channel automation',
      priority: 'Medium',
      estimatedCost: '$1000-3000/month',
    });
  }

  // Additional tools based on budget
  if (input.budget > 100000) {
    tools.push({
      category: 'Attribution',
      tool: 'Bizible or HubSpot Attribution',
      purpose: 'Multi-touch attribution, ROI tracking',
      priority: 'Medium',
      estimatedCost: '$1000-2500/month',
    });
  }

  if (isPaid) {
    tools.push({
      category: 'AI/ML Platform',
      tool: 'Salesforce Einstein or Adobe Sensei',
      purpose: 'Predictive analytics, personalization, AI-driven insights',
      priority: 'Medium',
      estimatedCost: '$2000-5000/month',
    });
  }

  return {
    recommended: tools,
    integrationPlan: 'Implement tools in phases: Phase 1 (Month 1): Analytics, CRM, Email. Phase 2 (Month 2-3): SEO, Social Media. Phase 3 (Month 4-6): Marketing Automation, Advanced Analytics. Ensure all tools integrate with CRM as central hub.',
  };
}

// Appendix
export function generateAppendix(input: EnhancedStrategyInput, isPaid: boolean = false) {
  return {
    glossary: [
      { term: 'CAC', definition: 'Customer Acquisition Cost - Total cost to acquire a new customer' },
      { term: 'LTV', definition: 'Lifetime Value - Total revenue expected from a customer over their lifetime' },
      { term: 'MQL', definition: 'Marketing Qualified Lead - Lead that meets criteria for sales follow-up' },
      { term: 'SQL', definition: 'Sales Qualified Lead - Lead vetted by sales as ready for direct sales engagement' },
      { term: 'ROAS', definition: 'Return on Ad Spend - Revenue generated per dollar spent on advertising' },
      { term: 'CTR', definition: 'Click-Through Rate - Percentage of people who click on a link or ad' },
      { term: 'CRO', definition: 'Conversion Rate Optimization - Process of improving conversion rates' },
      { term: 'NPS', definition: 'Net Promoter Score - Customer loyalty and satisfaction metric' },
      ...(isPaid ? [
        { term: 'ABM', definition: 'Account-Based Marketing - Targeted marketing approach for high-value accounts' },
        { term: 'CLV', definition: 'Customer Lifetime Value - Same as LTV, total value of customer relationship' },
        { term: 'MAU', definition: 'Monthly Active Users - Number of unique users engaging with product monthly' },
      ] : []),
    ],
    resources: [
      'Google Analytics Academy (free training)',
      'HubSpot Academy (free marketing certifications)',
      'Content Marketing Institute (industry insights)',
      'MarketingProfs (best practices and training)',
      `${input.industry} industry associations and publications`,
    ],
    benchmarks: [
      {
        metric: 'Website Conversion Rate',
        industryAverage: input.businessType === 'B2B' ? '2-3%' : '2-4%',
        topPerformers: input.businessType === 'B2B' ? '5-10%' : '5-15%',
        yourTarget: input.businessType === 'B2B' ? '4-6%' : '5-8%',
      },
      {
        metric: 'Email Open Rate',
        industryAverage: '15-25%',
        topPerformers: '30-40%',
        yourTarget: '25-30%',
      },
      {
        metric: 'Social Media Engagement',
        industryAverage: '1-3%',
        topPerformers: '5-10%',
        yourTarget: '3-5%',
      },
      {
        metric: 'Marketing ROI',
        industryAverage: '2:1 to 3:1',
        topPerformers: '5:1 to 10:1',
        yourTarget: '3:1 to 5:1',
      },
    ],
  };
}

