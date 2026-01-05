import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Quick Wins Generator (30-60-90 Day Plan)
 * Creates actionable quick wins for immediate impact
 */

interface QuickWin {
  action: string;
  expectedImpact: string;
  effort: string;
  resources: string[];
}

interface QuickWins {
  thirtyDays: QuickWin[];
  sixtyDays: QuickWin[];
  ninetyDays: QuickWin[];
}

export function generateQuickWins(input: EnhancedStrategyInput, isPaid: boolean = false): QuickWins {
  return {
    thirtyDays: generateThirtyDayWins(input, isPaid),
    sixtyDays: generateSixtyDayWins(input, isPaid),
    ninetyDays: generateNinetyDayWins(input, isPaid),
  };
}

function generateThirtyDayWins(input: EnhancedStrategyInput, isPaid: boolean): QuickWin[] {
  const wins: QuickWin[] = [];

  // Universal quick wins
  wins.push({
    action: 'Implement Google Analytics 4 and conversion tracking',
    expectedImpact: 'Establish baseline metrics and enable data-driven decision making',
    effort: 'Low',
    resources: ['Marketing analyst or developer', 'Google Analytics account', '4-8 hours'],
  });

  wins.push({
    action: 'Optimize Google Business Profile and local SEO basics',
    expectedImpact: '20-30% increase in local search visibility within 30 days',
    effort: 'Low',
    resources: ['Marketing coordinator', 'Business information', '2-4 hours'],
  });

  wins.push({
    action: 'Set up email capture on website with lead magnet',
    expectedImpact: 'Begin building email list, 2-5% conversion rate on traffic',
    effort: 'Low',
    resources: ['Designer for lead magnet', 'Email platform', 'Landing page tool', '8-12 hours'],
  });

  // Business type specific
  if (input.businessType === 'B2B' || input.businessType === 'SAAS') {
    wins.push({
      action: 'Launch LinkedIn company page optimization and posting schedule',
      expectedImpact: 'Increase professional visibility, 50-100 new followers in 30 days',
      effort: 'Low',
      resources: ['Social media manager', 'Content calendar', '3-5 hours/week'],
    });

    wins.push({
      action: 'Create and publish 3-5 high-value blog posts targeting buyer keywords',
      expectedImpact: 'Begin SEO foundation, attract 500-1000 organic visitors',
      effort: 'Medium',
      resources: ['Content writer', 'SEO tool', '20-30 hours'],
    });
  } else if (input.businessType === 'B2C' || input.businessType === 'ECOMMERCE') {
    wins.push({
      action: 'Launch Instagram/Facebook business profiles with 20 posts',
      expectedImpact: 'Build social presence, 200-500 initial followers',
      effort: 'Low',
      resources: ['Social media manager', 'Content creator', '10-15 hours'],
    });

    wins.push({
      action: 'Set up Google Shopping campaigns (if e-commerce)',
      expectedImpact: 'Immediate product visibility, 2-5x ROAS potential',
      effort: 'Medium',
      resources: ['PPC specialist', 'Product feed', '$500-2000 ad budget'],
    });
  }

  // Budget-based wins
  if (input.budget > 50000) {
    wins.push({
      action: 'Launch small-scale paid search campaign targeting high-intent keywords',
      expectedImpact: 'Immediate traffic and leads, test messaging and offers',
      effort: 'Medium',
      resources: ['PPC specialist', '$1000-3000 ad budget', 'Landing pages'],
    });
  }

  // Challenge-based wins
  if (input.currentChallenges?.includes('LOW_BRAND_AWARENESS')) {
    wins.push({
      action: 'Launch PR outreach to 20-30 relevant industry publications',
      expectedImpact: 'Secure 2-5 media mentions, increase brand visibility',
      effort: 'Medium',
      resources: ['PR specialist or founder', 'Media list', '10-15 hours'],
    });
  }

  if (input.currentChallenges?.includes('POOR_CONVERSION')) {
    wins.push({
      action: 'Implement basic website CRO improvements (CTAs, forms, page speed)',
      expectedImpact: '10-20% improvement in conversion rate',
      effort: 'Low-Medium',
      resources: ['Web developer', 'CRO tools', '8-16 hours'],
    });
  }

  if (isPaid) {
    wins.push({
      action: 'Conduct comprehensive competitor analysis and gap assessment',
      expectedImpact: 'Identify 3-5 high-value opportunities competitors are missing',
      effort: 'Medium',
      resources: ['Strategic planner', 'Competitor analysis tools', '15-20 hours'],
    });
  }

  return wins.slice(0, isPaid ? 8 : 6); // Top 6 quick wins for 30 days, 8 for paid
}

function generateSixtyDayWins(input: EnhancedStrategyInput, isPaid: boolean): QuickWin[] {
  const wins: QuickWin[] = [];

  wins.push({
    action: 'Launch email nurture campaign for new leads',
    expectedImpact: '15-25% increase in lead-to-customer conversion',
    effort: 'Medium',
    resources: ['Email marketer', 'Marketing automation platform', '20-30 hours'],
  });

  wins.push({
    action: 'Create and promote comprehensive buyer\'s guide or industry report',
    expectedImpact: '200-500 new leads, establish thought leadership',
    effort: 'High',
    resources: ['Content writer', 'Designer', 'Promotion budget $500-1500', '40-60 hours'],
  });

  wins.push({
    action: 'Implement retargeting campaigns across Google and social platforms',
    expectedImpact: '2-3x increase in conversion rate from website visitors',
    effort: 'Medium',
    resources: ['PPC specialist', '$1000-3000 monthly budget', 'Creative assets'],
  });

  if (input.businessType === 'B2B' || input.businessType === 'SAAS') {
    wins.push({
      action: 'Host first webinar or virtual event on industry topic',
      expectedImpact: '50-150 registrations, 30-50 qualified leads',
      effort: 'High',
      resources: ['Subject matter expert', 'Webinar platform', 'Promotion budget', '30-40 hours'],
    });

    wins.push({
      action: 'Launch account-based marketing (ABM) pilot for top 20 target accounts',
      expectedImpact: '3-5 new enterprise opportunities',
      effort: 'High',
      resources: ['ABM platform', 'Sales alignment', 'Custom content', '40-50 hours'],
    });
  } else {
    wins.push({
      action: 'Launch influencer partnership campaign with 5-10 micro-influencers',
      expectedImpact: '50K-200K impressions, 500-2000 new followers',
      effort: 'Medium',
      resources: ['Influencer outreach', '$2000-5000 budget', 'Product samples'],
    });

    wins.push({
      action: 'Create user-generated content campaign with incentives',
      expectedImpact: '50-100 customer posts, increased social proof',
      effort: 'Medium',
      resources: ['Social media manager', 'Incentive budget $500-1500', '15-20 hours'],
    });
  }

  wins.push({
    action: 'Optimize top 10 website pages for SEO and conversion',
    expectedImpact: '30-50% increase in organic traffic and conversions',
    effort: 'Medium',
    resources: ['SEO specialist', 'Web developer', 'Copywriter', '30-40 hours'],
  });

  if (input.budget > 100000) {
    wins.push({
      action: 'Launch multi-channel brand awareness campaign',
      expectedImpact: '500K-1M impressions, 50% increase in brand searches',
      effort: 'High',
      resources: ['Creative team', '$10K-25K ad budget', 'Multiple channels'],
    });
  }

  if (isPaid) {
    wins.push({
      action: 'Implement advanced marketing automation workflows',
      expectedImpact: 'Reduce manual tasks by 40%, improve lead response time',
      effort: 'High',
      resources: ['Automation specialist', 'CRM integration', '30-40 hours'],
    });
  }

  return wins.slice(0, isPaid ? 8 : 6); // Top 6 wins for 60 days, 8 for paid
}

function generateNinetyDayWins(input: EnhancedStrategyInput, isPaid: boolean): QuickWin[] {
  const wins: QuickWin[] = [];

  wins.push({
    action: 'Launch comprehensive content marketing program (blog, video, social)',
    expectedImpact: '100K+ monthly content views, 500+ leads from content',
    effort: 'High',
    resources: ['Content team (2-3 people)', 'Production tools', '80-120 hours/month'],
  });

  wins.push({
    action: 'Implement marketing automation and lead scoring system',
    expectedImpact: '30-40% improvement in sales efficiency, better lead quality',
    effort: 'High',
    resources: ['Marketing ops specialist', 'Automation platform', 'Sales alignment', '60-80 hours'],
  });

  wins.push({
    action: 'Launch customer referral program',
    expectedImpact: '15-25% of new customers from referrals',
    effort: 'Medium',
    resources: ['Program design', 'Incentive budget', 'Tracking system', '30-40 hours'],
  });

  wins.push({
    action: 'Develop and launch strategic partnership with complementary brand',
    expectedImpact: 'Access to new audience, 20-30% increase in leads',
    effort: 'High',
    resources: ['Business development', 'Co-marketing materials', '50-70 hours'],
  });

  if (input.businessType === 'B2B' || input.businessType === 'SAAS') {
    wins.push({
      action: 'Create comprehensive sales enablement content library',
      expectedImpact: '25-35% increase in sales win rate',
      effort: 'High',
      resources: ['Content team', 'Sales input', 'Design resources', '60-80 hours'],
    });

    wins.push({
      action: 'Launch customer success program with case studies and testimonials',
      expectedImpact: '20% improvement in retention, 10+ case studies',
      effort: 'Medium',
      resources: ['Customer success manager', 'Video/content production', '40-50 hours'],
    });
  } else {
    wins.push({
      action: 'Launch loyalty program for repeat customers',
      expectedImpact: '30-40% increase in repeat purchase rate',
      effort: 'High',
      resources: ['Program platform', 'Incentive budget', 'Marketing materials', '50-60 hours'],
    });

    wins.push({
      action: 'Create seasonal campaign with limited-time offers',
      expectedImpact: '50-100% spike in sales during campaign period',
      effort: 'Medium',
      resources: ['Creative team', 'Ad budget $5K-15K', 'Inventory planning'],
    });
  }

  wins.push({
    action: 'Implement comprehensive analytics dashboard and reporting system',
    expectedImpact: 'Real-time visibility into all marketing metrics, faster optimization',
    effort: 'Medium',
    resources: ['Analytics specialist', 'BI tool', 'Data integration', '40-50 hours'],
  });

  if (input.marketingObjectives.includes('THOUGHT_LEADERSHIP')) {
    wins.push({
      action: 'Secure 3-5 speaking engagements at industry events',
      expectedImpact: 'Establish thought leadership, 500-1000 new contacts',
      effort: 'High',
      resources: ['Executive time', 'Event sponsorships', 'Presentation materials', '60-80 hours'],
    });
  }

  if (input.geographicScope === 'GLOBAL' || input.geographicScope === 'INTERNATIONAL') {
    wins.push({
      action: 'Launch pilot campaign in new geographic market',
      expectedImpact: 'Test market viability, 100-300 new customers in new market',
      effort: 'High',
      resources: ['Market research', 'Localization', 'Local marketing budget', '80-100 hours'],
    });
  }

  if (isPaid) {
    wins.push({
      action: 'Develop AI-driven predictive churn model',
      expectedImpact: 'Reduce churn by proactive intervention, save 10-15% of at-risk revenue',
      effort: 'High',
      resources: ['Data scientist', 'ML infrastructure', '40-60 hours'],
    });
  }

  return wins.slice(0, isPaid ? 8 : 6); // Top 6 wins for 90 days, 8 for paid
}
