import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Channel Strategy Generator
 * Creates detailed channel-by-channel marketing strategies with budget allocation
 */

interface ChannelStrategy {
  channel: string;
  rationale: string;
  tactics: string[];
  budgetAllocation: number;
  budgetPercentage: number;
  expectedROI: string;
  timeline: string;
  keyMetrics: string[];
  successCriteria: string[];
}

export function generateChannelStrategy(input: EnhancedStrategyInput, isPaid: boolean = false): ChannelStrategy[] {
  const channels: ChannelStrategy[] = [];
  const totalBudget = input.budget;

  // Determine priority channels based on business type, objectives, and preferences
  const priorityChannels = determinePriorityChannels(input, isPaid);

  // Allocate budget across channels
  const budgetAllocations = allocateBudget(priorityChannels, totalBudget, input);

  // Generate strategy for each channel
  priorityChannels.forEach((channel, index) => {
    const allocation = budgetAllocations[index];
    channels.push(generateChannelDetails(channel, allocation, totalBudget, input, isPaid));
  });

  return channels;
}

function determinePriorityChannels(input: EnhancedStrategyInput, isPaid: boolean): string[] {
  const channels: string[] = [];

  // Start with user preferences if provided
  if (input.preferredChannels && input.preferredChannels.length > 0) {
    channels.push(...input.preferredChannels.slice(0, 5));
  }

  // Add recommended channels based on business type
  if (input.businessType === 'B2B') {
    if (!channels.includes('CONTENT_MARKETING')) channels.push('CONTENT_MARKETING');
    if (!channels.includes('SEO')) channels.push('SEO');
    if (!channels.includes('EMAIL_MARKETING')) channels.push('EMAIL_MARKETING');
  } else if (input.businessType === 'B2C' || input.businessType === 'D2C' || input.businessType === 'ECOMMERCE') {
    if (!channels.includes('SOCIAL_MEDIA_PAID')) channels.push('SOCIAL_MEDIA_PAID');
    if (!channels.includes('PAID_SEARCH')) channels.push('PAID_SEARCH');
    if (!channels.includes('EMAIL_MARKETING')) channels.push('EMAIL_MARKETING');
  } else if (input.businessType === 'SAAS') {
    if (!channels.includes('CONTENT_MARKETING')) channels.push('CONTENT_MARKETING');
    if (!channels.includes('PAID_SEARCH')) channels.push('PAID_SEARCH');
    if (!channels.includes('SEO')) channels.push('SEO');
  }

  // Add channels based on objectives
  if (input.marketingObjectives.includes('BRAND_AWARENESS')) {
    if (!channels.includes('SOCIAL_MEDIA_ORGANIC')) channels.push('SOCIAL_MEDIA_ORGANIC');
    if (!channels.includes('PR')) channels.push('PR');
  }
  if (input.marketingObjectives.includes('LEAD_GENERATION')) {
    if (!channels.includes('PAID_SEARCH')) channels.push('PAID_SEARCH');
    if (!channels.includes('CONTENT_MARKETING')) channels.push('CONTENT_MARKETING');
  }
  if (input.marketingObjectives.includes('THOUGHT_LEADERSHIP')) {
    if (!channels.includes('CONTENT_MARKETING')) channels.push('CONTENT_MARKETING');
    if (!channels.includes('WEBINARS')) channels.push('WEBINARS');
  }

  // Ensure we have at least 4-6 channels
  if (channels.length < 4) {
    const defaultChannels = ['SEO', 'EMAIL_MARKETING', 'CONTENT_MARKETING', 'SOCIAL_MEDIA_ORGANIC'];
    defaultChannels.forEach(ch => {
      if (!channels.includes(ch) && channels.length < 6) {
        channels.push(ch);
      }
    });
  }

  if (isPaid) {
    // Add more specialized channels for paid users
    if (!channels.includes('RETARGETING')) channels.push('RETARGETING');
    if (!channels.includes('CONVERSION_RATE_OPTIMIZATION')) channels.push('CONVERSION_RATE_OPTIMIZATION');
  }

  return channels.slice(0, isPaid ? 8 : 6); // Limit to 6 channels for free, 8 for paid
}

function allocateBudget(channels: string[], totalBudget: number, input: EnhancedStrategyInput): number[] {
  const allocations: number[] = [];

  // Define base allocation percentages based on channel priority
  const baseAllocations: Record<string, number> = {
    // High ROI channels
    'SEO': 0.20,
    'EMAIL_MARKETING': 0.15,
    'CONTENT_MARKETING': 0.20,

    // Paid channels
    'PAID_SEARCH': 0.25,
    'SOCIAL_MEDIA_PAID': 0.20,
    'RETARGETING': 0.10,

    // Organic/Brand building
    'SOCIAL_MEDIA_ORGANIC': 0.10,
    'PR': 0.10,

    // Specialized channels
    'INFLUENCER_MARKETING': 0.15,
    'AFFILIATE_MARKETING': 0.10,
    'WEBINARS': 0.10,
    'VIDEO_MARKETING': 0.15,
    'EVENTS': 0.15,
    'PARTNERSHIPS': 0.10,
    'PODCAST': 0.08,
    'DIRECT_MAIL': 0.05,
    'TV_RADIO': 0.10,
    'CONVERSION_RATE_OPTIMIZATION': 0.05,
  };

  // Adjust allocations based on business context
  channels.forEach((channel, index) => {
    let percentage = baseAllocations[channel] || 0.10;

    // Adjust for company stage
    if (input.companyStage === 'STARTUP') {
      // Startups should focus more on high-ROI, low-cost channels
      if (['SEO', 'CONTENT_MARKETING', 'EMAIL_MARKETING', 'SOCIAL_MEDIA_ORGANIC'].includes(channel)) {
        percentage *= 1.3;
      }
      if (['TV_RADIO', 'EVENTS'].includes(channel)) {
        percentage *= 0.5;
      }
    } else if (input.companyStage === 'ENTERPRISE') {
      // Enterprise can invest more in brand building
      if (['PR', 'EVENTS', 'TV_RADIO'].includes(channel)) {
        percentage *= 1.5;
      }
    }

    // Adjust for budget size
    if (totalBudget < 50000) {
      // Small budgets should focus on organic and owned channels
      if (['SEO', 'CONTENT_MARKETING', 'EMAIL_MARKETING'].includes(channel)) {
        percentage *= 1.4;
      }
      if (['PAID_SEARCH', 'SOCIAL_MEDIA_PAID'].includes(channel)) {
        percentage *= 0.7;
      }
    } else if (totalBudget > 500000) {
      // Large budgets can diversify more
      if (['PAID_SEARCH', 'SOCIAL_MEDIA_PAID', 'EVENTS'].includes(channel)) {
        percentage *= 1.2;
      }
    }

    allocations.push(percentage);
  });

  // Normalize allocations to sum to 100%
  const total = allocations.reduce((sum, val) => sum + val, 0);
  const normalizedAllocations = allocations.map(val => (val / total) * totalBudget);

  return normalizedAllocations;
}

function generateChannelDetails(
  channel: string,
  budgetAllocation: number,
  totalBudget: number,
  input: EnhancedStrategyInput,
  isPaid: boolean
): ChannelStrategy {
  const budgetPercentage = (budgetAllocation / totalBudget) * 100;

  const channelData: Record<string, Partial<ChannelStrategy>> = {
    SEO: {
      channel: 'SEO (Search Engine Optimization)',
      rationale: `SEO provides long-term, sustainable traffic growth with high ROI. Essential for ${input.businessType} businesses to capture high-intent search traffic. Particularly effective for ${input.marketingObjectives.includes('LEAD_GENERATION') ? 'lead generation' : input.marketingObjectives.includes('BRAND_AWARENESS') ? 'brand visibility' : 'customer acquisition'}.`,
      tactics: [
        'Technical SEO audit and optimization (site speed, mobile-friendliness, crawlability)',
        'Keyword research and content gap analysis targeting buyer intent keywords',
        'On-page optimization (title tags, meta descriptions, header tags, schema markup)',
        'Content creation targeting high-value keywords and search intent',
        'Link building through guest posting, digital PR, and strategic partnerships',
        'Local SEO optimization (Google Business Profile, local citations, reviews)',
        'Competitor analysis and SERP monitoring',
        'Monthly performance reporting and strategy refinement',
      ],
      expectedROI: input.budget < 50000 ? '300-500%' : input.budget < 200000 ? '400-600%' : '500-800%',
      timeline: 'Results in 3-6 months, full impact in 6-12 months',
      keyMetrics: [
        'Organic traffic growth',
        'Keyword rankings (top 3, top 10 positions)',
        'Domain authority and backlink profile',
        'Organic conversion rate',
        'Pages indexed and crawl efficiency',
      ],
      successCriteria: [
        '50%+ increase in organic traffic within 6 months',
        '20+ keywords ranking in top 10 positions',
        'Domain authority increase of 10+ points',
        '3:1 or better ROI from organic traffic',
      ],
    },

    PAID_SEARCH: {
      channel: 'Paid Search (Google Ads, Bing Ads)',
      rationale: `Paid search captures high-intent users actively searching for solutions. Provides immediate visibility and measurable results. Ideal for ${input.businessType} businesses focused on ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')}.`,
      tactics: [
        'Campaign structure setup (brand, competitor, generic, long-tail campaigns)',
        'Keyword research and negative keyword management',
        'Ad copy testing (headlines, descriptions, extensions)',
        'Landing page optimization and A/B testing',
        'Bid strategy optimization (manual, automated, target ROAS)',
        'Audience targeting and remarketing campaigns',
        'Shopping campaigns (if e-commerce)',
        'Weekly optimization and monthly strategy reviews',
      ],
      expectedROI: input.businessType === 'B2B' ? '200-400%' : input.businessType === 'ECOMMERCE' ? '300-500%' : '250-450%',
      timeline: 'Immediate results, optimization ongoing',
      keyMetrics: [
        'Click-through rate (CTR)',
        'Cost per click (CPC)',
        'Conversion rate',
        'Cost per acquisition (CPA)',
        'Return on ad spend (ROAS)',
        'Quality score',
      ],
      successCriteria: [
        `CPA below $${input.businessType === 'B2B' ? '200' : input.businessType === 'SAAS' ? '150' : '50'}`,
        'ROAS of 3:1 or better',
        'Quality score of 7+ on primary keywords',
        'Conversion rate of 3%+ on landing pages',
      ],
    },

    CONTENT_MARKETING: {
      channel: 'Content Marketing (Blog, Videos, Podcasts)',
      rationale: `Content marketing builds authority, educates prospects, and supports SEO efforts. Critical for ${input.businessType} businesses to establish thought leadership and nurture leads through the buyer journey.`,
      tactics: [
        'Content strategy development aligned with buyer journey stages',
        'Blog content creation (2-4 posts per week targeting different funnel stages)',
        'Long-form guides, whitepapers, and ebooks for lead generation',
        'Video content creation (product demos, tutorials, thought leadership)',
        'Infographics and visual content for social sharing',
        'Case studies and customer success stories',
        'Content distribution and promotion across channels',
        'Content performance analysis and optimization',
      ],
      expectedROI: '400-700%',
      timeline: 'Results in 2-4 months, compounding over time',
      keyMetrics: [
        'Content engagement (time on page, scroll depth)',
        'Organic traffic from content',
        'Lead generation from gated content',
        'Social shares and backlinks',
        'Content-influenced conversions',
      ],
      successCriteria: [
        '100,000+ monthly content views',
        '500+ leads from gated content',
        '50+ backlinks from content',
        '5%+ conversion rate on CTAs',
      ],
    },

    EMAIL_MARKETING: {
      channel: 'Email Marketing',
      rationale: `Email provides direct communication with prospects and customers. Highest ROI of all digital channels. Essential for nurturing leads, customer retention, and driving repeat business.`,
      tactics: [
        'Email list building and segmentation strategy',
        'Welcome series and onboarding automation',
        'Lead nurturing drip campaigns',
        'Newsletter program (weekly or bi-weekly)',
        'Promotional campaigns and product launches',
        'Re-engagement campaigns for inactive subscribers',
        'Personalization and dynamic content',
        'A/B testing (subject lines, content, CTAs, send times)',
      ],
      expectedROI: '3600-4200%',
      timeline: 'Immediate for existing list, 3-6 months to build',
      keyMetrics: [
        'List growth rate',
        'Open rate',
        'Click-through rate',
        'Conversion rate',
        'Revenue per email',
        'Unsubscribe rate',
      ],
      successCriteria: [
        '25%+ open rate',
        '3%+ click-through rate',
        '2%+ conversion rate',
        '$1+ revenue per email sent',
      ],
    },

    SOCIAL_MEDIA_PAID: {
      channel: 'Social Media Advertising (Facebook, Instagram, LinkedIn, TikTok)',
      rationale: `Paid social enables precise audience targeting and brand awareness at scale. Effective for ${input.businessType} businesses to reach ${input.targetAudience} where they spend time.`,
      tactics: [
        `Platform selection (${input.businessType === 'B2B' ? 'LinkedIn primary' : input.businessType === 'B2C' ? 'Facebook, Instagram, TikTok' : 'Multi-platform'})`,
        'Audience research and custom audience creation',
        'Creative development (static ads, video ads, carousel ads, stories)',
        'Campaign structure (awareness, consideration, conversion)',
        'Retargeting campaigns for website visitors and engaged users',
        'Lookalike audience expansion',
        'A/B testing of creative, copy, and audiences',
        'Daily monitoring and weekly optimization',
      ],
      expectedROI: input.businessType === 'B2B' ? '200-350%' : '300-500%',
      timeline: 'Immediate results, optimization in 2-4 weeks',
      keyMetrics: [
        'Impressions and reach',
        'Cost per thousand impressions (CPM)',
        'Click-through rate (CTR)',
        'Cost per click (CPC)',
        'Conversion rate',
        'Cost per acquisition (CPA)',
      ],
      successCriteria: [
        `CPA below $${input.businessType === 'B2B' ? '150' : '40'}`,
        'CTR of 1.5%+ on ads',
        'ROAS of 2.5:1 or better',
        '1M+ monthly impressions',
      ],
    },

    SOCIAL_MEDIA_ORGANIC: {
      channel: 'Social Media (Organic)',
      rationale: `Organic social builds community, brand awareness, and customer relationships. Supports paid efforts and provides customer service channel. Essential for ${input.brandPositioning.toLowerCase()} brand positioning.`,
      tactics: [
        'Social media strategy and content calendar',
        'Daily posting across key platforms (3-5 posts per week per platform)',
        'Community management and engagement (responding to comments, DMs)',
        'User-generated content campaigns',
        'Influencer partnerships and collaborations',
        'Social listening and brand monitoring',
        'Employee advocacy program',
        'Monthly analytics and strategy refinement',
      ],
      expectedROI: '100-200% (indirect)',
      timeline: '3-6 months to build engaged following',
      keyMetrics: [
        'Follower growth rate',
        'Engagement rate (likes, comments, shares)',
        'Reach and impressions',
        'Share of voice',
        'Sentiment analysis',
      ],
      successCriteria: [
        '20%+ follower growth quarterly',
        '3%+ engagement rate',
        '100,000+ monthly reach',
        'Positive sentiment of 80%+',
      ],
    },

    RETARGETING: {
      channel: 'Retargeting (Cross-Channel)',
      rationale: 'Retargeting brings back visitors who didn\'t convert, increasing overall conversion rates and ROAS.',
      tactics: [
        'Pixel implementation and audience segmentation',
        'Dynamic product retargeting',
        'Cross-channel frequency capping',
        'Sequential messaging',
        'Win-back campaigns',
      ],
      expectedROI: '500-1000%',
      timeline: 'Immediate results',
      keyMetrics: ['Conversion Rate', 'CPA', 'ROAS', 'View-through conversions'],
      successCriteria: ['20% increase in overall conversion rate', '10x ROAS'],
    },

    CONVERSION_RATE_OPTIMIZATION: {
      channel: 'Conversion Rate Optimization (CRO)',
      rationale: 'Systematic testing to improve the percentage of visitors who take desired actions.',
      tactics: [
        'Heuristic analysis and user testing',
        'A/B testing of headlines, CTAs, and layouts',
        'Form optimization',
        'Speed optimization',
        'Personalization',
      ],
      expectedROI: '1000%+',
      timeline: 'Ongoing, results in 1-3 months',
      keyMetrics: ['Conversion Rate', 'Revenue Per Visitor', 'Bounce Rate'],
      successCriteria: ['50% increase in conversion rate over 12 months'],
    },
  };

  // Get channel details or create default
  const details = channelData[channel] || {
    channel: channel.replace(/_/g, ' '),
    rationale: `Strategic channel for achieving ${input.marketingObjectives.join(', ').toLowerCase()} objectives.`,
    tactics: ['Channel strategy development', 'Campaign execution', 'Performance monitoring', 'Optimization'],
    expectedROI: '200-400%',
    timeline: '3-6 months',
    keyMetrics: ['Reach', 'Engagement', 'Conversions', 'ROI'],
    successCriteria: ['Positive ROI', 'Growing engagement', 'Meeting KPI targets'],
  };

  if (isPaid) {
    return {
      ...details,
      tactics: [...(details.tactics || []), 'Advanced AI-driven optimization', 'Predictive analytics modeling'],
      keyMetrics: [...(details.keyMetrics || []), 'Customer Lifetime Value (CLV)', 'Multi-touch attribution'],
      budgetAllocation: Math.round(budgetAllocation),
      budgetPercentage: Math.round(budgetPercentage * 10) / 10,
    } as ChannelStrategy;
  }

  return {
    ...details,
    budgetAllocation: Math.round(budgetAllocation),
    budgetPercentage: Math.round(budgetPercentage * 10) / 10,
  } as ChannelStrategy;
}
