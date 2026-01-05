import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Supporting Strategy Generators
 * Implementation timeline, budget breakdown, risk assessment, team structure, etc.
 */

// Implementation Timeline
export function generateImplementationTimeline(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const timeframeMonths = getTimeframeMonths(input.timeframe);
  const phases: any[] = [];

  // Phase 1: Foundation (Month 1-2)
  phases.push({
    phase: 'Phase 1: Foundation & Setup',
    duration: '1-2 months',
    objectives: [
      'Establish marketing infrastructure and analytics',
      'Build foundational content and assets',
      'Set up initial campaigns and channels',
      'Implement tracking and measurement systems',
      ...(isPaid ? ['Conduct deep-dive competitor audit', 'Finalize comprehensive brand voice guidelines'] : []),
    ],
    activities: [
      'Google Analytics 4 and conversion tracking setup',
      'Marketing automation platform configuration',
      'Website optimization (SEO, CRO, speed)',
      'Brand guidelines and messaging framework finalization',
      'Initial content creation (10-15 pieces)',
      'Social media profile setup and optimization',
      'Email marketing infrastructure setup',
      ...(isPaid ? ['Competitor backlink analysis', 'User journey mapping workshop', 'Tech stack integration audit'] : []),
    ],
    deliverables: [
      'Analytics dashboard and reporting system',
      'Marketing technology stack configured',
      'Brand messaging guide',
      'Initial content library (blog posts, social content)',
      'Email templates and automation workflows',
      'Campaign tracking and attribution model',
      ...(isPaid ? ['Competitor landscape report', 'Detailed user personas deck'] : []),
    ],
    milestones: [
      'All tracking and analytics operational',
      'First 5 blog posts published',
      'Social media profiles active with 20+ posts',
      'Email list building initiated',
    ],
    dependencies: [
      'Access to website and hosting',
      'Marketing platform subscriptions approved',
      'Brand assets and guidelines available',
    ],
  });

  // Phase 2: Launch & Scale (Month 2-4)
  phases.push({
    phase: 'Phase 2: Campaign Launch & Initial Optimization',
    duration: timeframeMonths <= 6 ? '2-3 months' : '2-4 months',
    objectives: [
      'Launch multi-channel marketing campaigns',
      'Generate initial leads and customers',
      'Test and optimize messaging and offers',
      'Build audience and engagement',
    ],
    activities: [
      'Paid search campaigns launch (Google Ads, Bing)',
      'Social media advertising campaigns',
      'Content marketing program execution',
      'Email nurture campaigns activation',
      'SEO optimization and link building',
      'PR and outreach initiatives',
      'A/B testing of landing pages and ads',
      ...(isPaid ? ['Multivariate testing setup', 'Influencer outreach pilot', 'Retargeting pixel implementation'] : []),
    ],
    deliverables: [
      'Active campaigns across 4-6 channels',
      '20-30 pieces of content published',
      'Lead generation system operational',
      'First customer acquisitions from marketing',
      'Initial performance data and insights',
    ],
    milestones: [
      `${input.businessType === 'B2B' ? '100+' : '500+'} leads generated`,
      '50%+ increase in website traffic',
      'First marketing-attributed customers',
      'Positive ROI on at least 2 channels',
    ],
    dependencies: [
      'Phase 1 completion',
      'Marketing budget allocated',
      'Content production capacity',
    ],
  });

  // Phase 3: Optimization & Growth (Month 4-8)
  if (timeframeMonths >= 6) {
    phases.push({
      phase: 'Phase 3: Optimization & Scale',
      duration: '3-4 months',
      objectives: [
        'Optimize campaigns based on performance data',
        'Scale successful channels and tactics',
        'Expand into new channels and audiences',
        'Improve conversion rates and efficiency',
      ],
      activities: [
        'Data-driven campaign optimization',
        'Budget reallocation to top-performing channels',
        'Advanced targeting and segmentation',
        'Conversion rate optimization program',
        'Customer retention initiatives',
        'Partnership and collaboration development',
        'Advanced content formats (video, webinars, podcasts)',
        ...(isPaid ? ['Predictive analytics modeling', 'Customer loyalty program design', 'International market feasibility study'] : []),
      ],
      deliverables: [
        'Optimized campaign performance (30%+ improvement)',
        'Expanded channel mix',
        'Customer success stories and case studies',
        'Refined buyer personas and messaging',
        'Improved conversion funnels',
      ],
      milestones: [
        '3:1 or better marketing ROI',
        `${input.businessType === 'B2B' ? '500+' : '2000+'} total leads`,
        '100%+ increase in organic traffic',
        'Customer retention program launched',
      ],
      dependencies: [
        'Phase 2 performance data',
        'Budget for scaling',
        'Team capacity for expansion',
      ],
    });
  }

  // Phase 4: Maturity & Innovation (Month 8-12+)
  if (timeframeMonths >= 12) {
    phases.push({
      phase: 'Phase 4: Maturity & Innovation',
      duration: '4-6 months',
      objectives: [
        'Achieve sustainable, predictable growth',
        'Innovate with new channels and tactics',
        'Build brand authority and thought leadership',
        'Maximize customer lifetime value',
      ],
      activities: [
        'Advanced marketing automation and personalization',
        'Account-based marketing (if B2B)',
        'Influencer and partnership programs',
        'Community building initiatives',
        'Thought leadership content and speaking',
        'International or new market expansion',
        'Advanced analytics and attribution',
        ...(isPaid ? ['AI-driven content personalization', 'Strategic M&A scouting', 'Ecosystem development'] : []),
      ],
      deliverables: [
        'Mature, optimized marketing engine',
        'Thought leadership positioning',
        'Customer advocacy program',
        'Predictable lead and revenue generation',
        'Comprehensive performance analytics',
      ],
      milestones: [
        'Consistent month-over-month growth',
        '5:1 or better marketing ROI',
        'Top 3 industry thought leader position',
        'Self-sustaining customer referral program',
      ],
      dependencies: [
        'Phase 3 success metrics achieved',
        'Continued budget and resources',
        'Executive support for innovation',
      ],
    });
  }

  return phases;
}

// Budget Breakdown
export function generateBudgetBreakdown(input: EnhancedStrategyInput, channelAllocations: any[], isPaid: boolean = false) {
  const totalBudget = input.budget;
  const contingency = Math.round(totalBudget * 0.10); // 10% contingency

  return {
    totalBudget,
    channelAllocations: channelAllocations.map(channel => ({
      channel: channel.channel,
      amount: channel.budgetAllocation,
      percentage: channel.budgetPercentage,
      breakdown: generateChannelBreakdown(channel.channel, channel.budgetAllocation, isPaid),
    })),
    contingency,
    contingencyPercentage: 10,
    roiProjections: {
      conservative: `${Math.round(totalBudget * 2).toLocaleString()} (2:1 ROI)`,
      moderate: `${Math.round(totalBudget * 3.5).toLocaleString()} (3.5:1 ROI)`,
      optimistic: `${Math.round(totalBudget * 5).toLocaleString()} (5:1 ROI)`,
      ...(isPaid ? {
        breakEvenPoint: 'Month 4-5',
        lifetimeValueImpact: '+25% CLV',
        cacPaybackPeriod: '3.5 months',
      } : {}),
    },
  };
}

function generateChannelBreakdown(channel: string, budget: number, isPaid: boolean) {
  const breakdowns: Record<string, any[]> = {
    'SEO (Search Engine Optimization)': [
      { item: 'SEO tools and software', cost: Math.round(budget * 0.15) },
      { item: 'Content creation', cost: Math.round(budget * 0.35) },
      { item: 'Link building and outreach', cost: Math.round(budget * 0.25) },
      { item: 'Technical SEO and development', cost: Math.round(budget * 0.15) },
      { item: 'SEO consulting/agency', cost: Math.round(budget * 0.10) },
    ],
    'Paid Search (Google Ads, Bing Ads)': [
      { item: 'Ad spend', cost: Math.round(budget * 0.75) },
      { item: 'Landing page development', cost: Math.round(budget * 0.10) },
      { item: 'PPC management tools', cost: Math.round(budget * 0.05) },
      { item: 'PPC specialist/agency', cost: Math.round(budget * 0.10) },
    ],
    'Content Marketing (Blog, Videos, Podcasts)': [
      { item: 'Content writers and creators', cost: Math.round(budget * 0.40) },
      { item: 'Design and production', cost: Math.round(budget * 0.25) },
      { item: 'Content tools and software', cost: Math.round(budget * 0.10) },
      { item: 'Content promotion', cost: Math.round(budget * 0.15) },
      { item: 'Content strategy consulting', cost: Math.round(budget * 0.10) },
    ],
    'Email Marketing': [
      { item: 'Email platform subscription', cost: Math.round(budget * 0.20) },
      { item: 'Email copywriting and design', cost: Math.round(budget * 0.30) },
      { item: 'List building and lead magnets', cost: Math.round(budget * 0.25) },
      { item: 'Email automation setup', cost: Math.round(budget * 0.15) },
      { item: 'Testing and optimization', cost: Math.round(budget * 0.10) },
    ],
  };

  const breakdown = breakdowns[channel] || [
    { item: 'Platform/tools', cost: Math.round(budget * 0.25) },
    { item: 'Creative and content', cost: Math.round(budget * 0.35) },
    { item: 'Media/ad spend', cost: Math.round(budget * 0.30) },
    { item: 'Management and optimization', cost: Math.round(budget * 0.10) },
  ];

  if (isPaid) {
    // Add more granular items for paid users, splitting 'Management and optimization' or adding specific tools
    // For simplicity, we'll append a note or a small specific item if budget allows, 
    // but since we are rounding percentages, let's just keep the structure but maybe add a 'Detailed Audit' item if it was generic.
    // Actually, let's just return the breakdown as is for now, but the function signature update is important for consistency.
    // We could add a 'Performance Buffer' item by taking 1% from others, but that's complex.
    // Let's just return the breakdown. The main value add is in the ROI projections in the parent function.
    return breakdown;
  }

  return breakdown;
}

// Risk Assessment
export function generateRiskAssessment(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const risks: any[] = [];

  // Budget-related risks
  if (input.budget < 50000) {
    risks.push({
      risk: 'Limited budget may restrict channel diversification and testing',
      likelihood: 'High',
      impact: 'Medium',
      mitigationStrategy: 'Focus on high-ROI organic channels (SEO, content, email). Prioritize quick wins and measurable results. Consider phased budget increases based on performance.',
    });
  }

  // Competition risks
  if (input.competitiveLandscape === 'RED_OCEAN') {
    risks.push({
      risk: 'Intense competition may drive up customer acquisition costs',
      likelihood: 'High',
      impact: 'High',
      mitigationStrategy: 'Focus on differentiation and niche targeting. Build strong brand and customer loyalty. Invest in owned channels (content, email, community) to reduce dependency on paid channels.',
    });
  }

  // Market maturity risks
  if (input.targetMarketMaturity === 'EMERGING') {
    risks.push({
      risk: 'Market education required may extend sales cycles and increase CAC',
      likelihood: 'Medium',
      impact: 'Medium',
      mitigationStrategy: 'Invest heavily in educational content and thought leadership. Build partnerships with industry influencers. Focus on early adopters and innovators first.',
    });
  } else if (input.targetMarketMaturity === 'DECLINING') {
    risks.push({
      risk: 'Declining market may limit growth potential',
      likelihood: 'High',
      impact: 'High',
      mitigationStrategy: 'Focus on market share capture from competitors. Innovate to create new demand. Consider adjacent market expansion.',
    });
  }

  // Team/resource risks
  if (input.teamSize === 'SOLO' || input.teamSize === 'SMALL_2_5') {
    risks.push({
      risk: 'Limited team capacity may slow execution and limit channel coverage',
      likelihood: 'High',
      impact: 'Medium',
      mitigationStrategy: 'Leverage automation and tools. Consider outsourcing specialized tasks. Focus on fewer channels with deeper execution. Build scalable systems early.',
    });
  }

  // Expertise risks
  if (input.marketingMaturity === 'BEGINNER') {
    risks.push({
      risk: 'Limited marketing expertise may lead to inefficient spending and suboptimal results',
      likelihood: 'Medium',
      impact: 'High',
      mitigationStrategy: 'Invest in training and education. Hire experienced consultants or agencies for critical areas. Start with proven, lower-risk tactics. Build expertise gradually.',
    });
  }

  // Technology risks
  if (!input.existingMarTech || input.existingMarTech.length < 3) {
    risks.push({
      risk: 'Lack of marketing technology infrastructure may limit capabilities',
      likelihood: 'Medium',
      impact: 'Medium',
      mitigationStrategy: 'Prioritize essential tools (analytics, CRM, email platform). Choose integrated platforms over point solutions. Implement in phases to avoid overwhelm.',
    });
  }

  // Universal risks
  risks.push({
    risk: 'Algorithm changes (Google, Facebook, etc.) may impact channel performance',
    likelihood: 'Medium',
    impact: 'Medium',
    mitigationStrategy: 'Diversify across multiple channels. Focus on owned channels (email list, content). Stay informed on platform updates. Build resilient, multi-channel strategies.',
  });

  risks.push({
    risk: 'Economic downturn or market changes may impact budget and demand',
    likelihood: 'Low-Medium',
    impact: 'High',
    mitigationStrategy: 'Build flexible budget allocation. Focus on ROI and efficiency. Maintain strong customer relationships. Have contingency plans for budget cuts.',
  });

  if (isPaid) {
    risks.push({
      risk: 'Data privacy regulations (GDPR, CCPA) compliance gaps',
      likelihood: 'Low',
      impact: 'High',
      mitigationStrategy: 'Conduct regular privacy audits. Implement robust consent management platforms. Ensure all data handling practices are documented and compliant.',
    });
    risks.push({
      risk: 'Brand reputation damage from negative social sentiment',
      likelihood: 'Low',
      impact: 'High',
      mitigationStrategy: 'Implement 24/7 social listening and crisis management protocols. Proactive community engagement. Transparent communication strategy.',
    });
  }

  return risks;
}

// Team Structure
export function generateTeamStructure(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const roles: any[] = [];

  // Core roles based on team size
  if (input.teamSize === 'SOLO') {
    roles.push({
      role: 'Marketing Generalist / Founder',
      responsibilities: ['Strategy and planning', 'Content creation', 'Campaign management', 'Analytics and reporting'],
      skillsRequired: ['Digital marketing fundamentals', 'Content creation', 'Basic analytics', 'Project management'],
      priority: 'Critical',
      internalOrExternal: 'Internal',
    });
    roles.push({
      role: 'Freelance Specialists (as needed)',
      responsibilities: ['Specialized tasks (design, development, copywriting)'],
      skillsRequired: ['Specific expertise areas'],
      priority: 'High',
      internalOrExternal: 'External',
    });
  } else if (input.teamSize === 'SMALL_2_5') {
    roles.push({
      role: 'Marketing Manager',
      responsibilities: ['Strategy development', 'Team coordination', 'Budget management', 'Performance reporting'],
      skillsRequired: ['Marketing strategy', 'Team leadership', 'Analytics', 'Budget management'],
      priority: 'Critical',
      internalOrExternal: 'Internal',
    });
    roles.push({
      role: 'Content Marketing Specialist',
      responsibilities: ['Content strategy', 'Blog writing', 'Social media', 'SEO optimization'],
      skillsRequired: ['Content creation', 'SEO', 'Social media', 'Copywriting'],
      priority: 'High',
      internalOrExternal: 'Internal',
    });
    roles.push({
      role: 'Digital Marketing Specialist',
      responsibilities: ['Paid advertising', 'Email marketing', 'Marketing automation', 'Analytics'],
      skillsRequired: ['PPC', 'Email marketing', 'Marketing automation', 'Data analysis'],
      priority: 'High',
      internalOrExternal: 'Internal or External',
    });
  } else {
    // Larger teams
    roles.push({
      role: 'VP Marketing / CMO',
      responsibilities: ['Overall strategy', 'Team leadership', 'Budget ownership', 'Executive reporting'],
      skillsRequired: ['Strategic planning', 'Leadership', 'P&L management', 'Executive communication'],
      priority: 'Critical',
      internalOrExternal: 'Internal',
    });
    roles.push({
      role: 'Content Marketing Manager',
      responsibilities: ['Content strategy', 'Team management', 'Editorial calendar', 'SEO strategy'],
      skillsRequired: ['Content strategy', 'Team management', 'SEO', 'Analytics'],
      priority: 'High',
      internalOrExternal: 'Internal',
    });
    roles.push({
      role: 'Demand Generation Manager',
      responsibilities: ['Lead generation', 'Paid campaigns', 'Marketing automation', 'Conversion optimization'],
      skillsRequired: ['Demand gen', 'PPC', 'Marketing automation', 'Analytics'],
      priority: 'High',
      internalOrExternal: 'Internal',
    });
    roles.push({
      role: 'Marketing Operations Specialist',
      responsibilities: ['MarTech stack', 'Data and analytics', 'Process optimization', 'Reporting'],
      skillsRequired: ['Marketing technology', 'Data analysis', 'Process design', 'Technical skills'],
      priority: 'Medium',
      internalOrExternal: 'Internal',
    });
  }

  if (isPaid) {
    roles.push({
      role: 'Data Analyst / Growth Hacker',
      responsibilities: ['Deep data analysis', 'Experimentation framework', 'Funnel optimization', 'Predictive modeling'],
      skillsRequired: ['SQL', 'Python/R', 'Statistical analysis', 'Growth marketing'],
      priority: 'Medium',
      internalOrExternal: 'Internal or External',
    });
  }

  return {
    recommendedRoles: roles,
    organizationalChart: `Marketing team structure for ${input.teamSize.toLowerCase().replace(/_/g, ' ')} organization with focus on ${input.marketingObjectives.slice(0, 2).join(' and ').toLowerCase().replace(/_/g, ' ')}.`,
    trainingNeeds: [
      'Marketing analytics and data-driven decision making',
      `${input.businessType} marketing best practices`,
      'Marketing automation and technology tools',
      'Content creation and storytelling',
      'Performance marketing and optimization',
      ...(isPaid ? ['Advanced AI marketing tools', 'Crisis management simulation'] : []),
    ],
  };
}

// Helper function
function getTimeframeMonths(timeframe: string): number {
  const map: Record<string, number> = {
    '1-3-months': 3,
    '3-6-months': 6,
    '6-12-months': 12,
    '12-24-months': 24,
  };
  return map[timeframe] || 12;
}

