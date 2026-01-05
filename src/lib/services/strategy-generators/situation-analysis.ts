import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Situation Analysis Generator
 * Generates comprehensive market and competitive analysis
 */

export function generateSituationAnalysis(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const marketAnalysis = generateMarketAnalysis(input);
  const competitiveAnalysis = generateCompetitiveAnalysis(input);
  const swotAnalysis = generateSWOTAnalysis(input);
  const keyInsights = generateKeyInsights(input);

  return {
    marketAnalysis,
    competitiveAnalysis,
    swotAnalysis,
    keyInsights,
  };
}

function generateMarketAnalysis(input: EnhancedStrategyInput): string {
  const maturityDescriptions: Record<string, string> = {
    EMERGING: 'rapidly evolving with high growth potential but significant uncertainty',
    GROWING: 'expanding with increasing competition and market validation',
    MATURE: 'well-established with stable growth and defined competitive dynamics',
    DECLINING: 'contracting and requiring innovation or market repositioning',
  };

  const scopeDescriptions: Record<string, string> = {
    LOCAL: 'localized market dynamics with community-focused opportunities',
    REGIONAL: 'regional market presence with multi-market coordination needs',
    NATIONAL: 'national market scale with diverse regional considerations',
    INTERNATIONAL: 'cross-border operations with cultural and regulatory complexity',
    GLOBAL: 'worldwide presence requiring sophisticated global-local balance',
  };

  return `The ${input.industry} market is currently ${maturityDescriptions[input.targetMarketMaturity]}, presenting both opportunities and challenges for ${input.businessType} businesses. Operating at a ${scopeDescriptions[input.geographicScope]}, ${input.businessName} must navigate a ${input.competitiveLandscape.toLowerCase().replace('_', ' ')} competitive environment.

Key Market Characteristics:
• Market Maturity: ${input.targetMarketMaturity.replace('_', ' ')} stage with ${input.targetMarketMaturity === 'EMERGING' ? 'high growth potential' : input.targetMarketMaturity === 'GROWING' ? 'accelerating adoption' : input.targetMarketMaturity === 'MATURE' ? 'stable demand' : 'transformation needs'}
• Competitive Intensity: ${input.competitiveLandscape === 'BLUE_OCEAN' ? 'Low - uncontested market space' : input.competitiveLandscape === 'RED_OCEAN' ? 'High - intense competition' : input.competitiveLandscape === 'NICHE' ? 'Moderate - specialized segment' : 'High - dominated by established players'}
• Geographic Scope: ${input.geographicScope.replace('_', ' ')} presence requiring ${input.geographicScope === 'GLOBAL' ? 'multi-market strategies' : input.geographicScope === 'INTERNATIONAL' ? 'cross-border coordination' : 'focused market penetration'}
• Business Model: ${input.businessType} model at ${input.companyStage.toLowerCase()} stage

Market Trends & Dynamics:
${input.targetMarketMaturity === 'EMERGING' ? '• Rapid innovation and market education required\n• First-mover advantages available\n• High customer acquisition costs but strong growth potential' : ''}
${input.targetMarketMaturity === 'GROWING' ? '• Increasing competition and market consolidation\n• Customer expectations rising\n• Opportunity for category leadership' : ''}
${input.targetMarketMaturity === 'MATURE' ? '• Established customer behaviors and preferences\n• Differentiation through innovation and service\n• Focus on market share and efficiency' : ''}
${input.targetMarketMaturity === 'DECLINING' ? '• Market transformation and disruption opportunities\n• Need for innovation and repositioning\n• Focus on niche segments and value creation' : ''}

Customer Landscape:
${input.targetAudience}

${input.seasonalityFactors ? `Seasonality Considerations:\n${input.seasonalityFactors}\n` : ''}
${input.regulatoryConstraints ? `Regulatory Environment:\n${input.regulatoryConstraints}` : ''}`;
}

function generateCompetitiveAnalysis(input: EnhancedStrategyInput): string {
  const landscapeAnalysis: Record<string, string> = {
    BLUE_OCEAN: `Operating in a blue ocean market provides significant advantages:
• Limited direct competition allows for market definition and category creation
• Opportunity to establish brand as category leader
• Ability to set customer expectations and industry standards
• Focus on market creation rather than market share battles
• Higher margins due to reduced price competition`,

    RED_OCEAN: `The red ocean competitive landscape requires strategic differentiation:
• Intense competition demands clear competitive advantages
• Price pressure and margin compression are constant challenges
• Customer acquisition costs are elevated due to competitive bidding
• Brand differentiation and customer experience are critical
• Innovation and operational excellence are table stakes`,

    NICHE: `Niche market positioning offers focused opportunities:
• Specialized expertise and deep customer understanding provide advantages
• Lower competition but smaller addressable market
• Strong customer loyalty and community building potential
• Opportunity for premium pricing through specialization
• Vulnerability to market changes and larger competitors entering`,

    MONOPOLISTIC: `Competing in a monopolistic market requires strategic approach:
• Market dominated by few large players with significant resources
• Barriers to entry are substantial
• Differentiation through innovation, service, or niche focus essential
• Partnership and ecosystem strategies may be necessary
• Focus on underserved segments or emerging needs`,
  };

  return `${landscapeAnalysis[input.competitiveLandscape]}

${input.competitorInfo ? `Competitive Intelligence:\n${input.competitorInfo}\n` : ''}
Competitive Positioning Strategy:
• Brand Positioning: ${input.brandPositioning} positioning to differentiate from competitors
• Value Proposition: Leverage ${input.businessType} model advantages
• Market Approach: ${input.companyStage === 'STARTUP' ? 'Agile and innovative market entry' : input.companyStage === 'GROWTH' ? 'Rapid scaling and market penetration' : input.companyStage === 'MATURE' ? 'Market leadership and optimization' : 'Enterprise-scale operations and partnerships'}

Key Competitive Factors:
• Brand recognition and trust
• Product/service quality and innovation
• Customer experience and support
• Pricing and value proposition
• Distribution and market access
• Technology and operational capabilities
• Marketing effectiveness and reach`;
}

function generateSWOTAnalysis(input: EnhancedStrategyInput) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: string[] = [];
  const threats: string[] = [];

  // Strengths based on inputs
  if (input.brandPositioning === 'PREMIUM') {
    strengths.push('Premium brand positioning allows for higher margins and quality focus');
  } else if (input.brandPositioning === 'INNOVATIVE') {
    strengths.push('Innovation-focused positioning attracts early adopters and thought leaders');
  } else if (input.brandPositioning === 'VALUE') {
    strengths.push('Value positioning appeals to price-conscious customers and larger market');
  }

  if (input.companyStage === 'STARTUP') {
    strengths.push('Agility and ability to pivot quickly based on market feedback');
    weaknesses.push('Limited brand recognition and market presence');
    weaknesses.push('Resource constraints in budget and team');
  } else if (input.companyStage === 'GROWTH') {
    strengths.push('Proven product-market fit and growing customer base');
    strengths.push('Momentum and market validation');
    weaknesses.push('Scaling challenges and operational complexity');
  } else if (input.companyStage === 'MATURE') {
    strengths.push('Established brand and market position');
    strengths.push('Proven processes and experienced team');
    weaknesses.push('Potential organizational inertia and slower innovation');
  } else if (input.companyStage === 'ENTERPRISE') {
    strengths.push('Significant resources and market influence');
    strengths.push('Established partnerships and distribution channels');
    weaknesses.push('Organizational complexity and slower decision-making');
  }

  if (input.existingMarTech && input.existingMarTech.length > 0) {
    strengths.push(`Existing marketing technology stack (${input.existingMarTech.length} tools) provides foundation`);
  } else {
    weaknesses.push('Limited marketing technology infrastructure');
  }

  if (input.marketingMaturity === 'EXPERT' || input.marketingMaturity === 'ADVANCED') {
    strengths.push('Sophisticated marketing capabilities and expertise');
  } else {
    weaknesses.push('Marketing capabilities need development and training');
  }

  // Opportunities based on market context
  if (input.targetMarketMaturity === 'EMERGING') {
    opportunities.push('First-mover advantage in emerging market');
    opportunities.push('Ability to define category and set standards');
  } else if (input.targetMarketMaturity === 'GROWING') {
    opportunities.push('Ride the wave of market growth and expansion');
    opportunities.push('Capture market share from slower competitors');
  }

  if (input.competitiveLandscape === 'BLUE_OCEAN') {
    opportunities.push('Uncontested market space with minimal competition');
    opportunities.push('Opportunity to create new demand and customer segments');
  }

  if (input.geographicScope === 'GLOBAL' || input.geographicScope === 'INTERNATIONAL') {
    opportunities.push('International expansion and new market entry');
    opportunities.push('Diversification across multiple geographies');
  }

  opportunities.push(`Leverage ${input.preferredChannels?.length || 'multiple'} marketing channels for integrated campaigns`);
  opportunities.push('Build data-driven marketing capabilities for competitive advantage');
  opportunities.push('Develop strategic partnerships and ecosystem plays');

  // Threats based on challenges
  if (input.currentChallenges) {
    if (input.currentChallenges.includes('INTENSE_COMPETITION')) {
      threats.push('Intense competitive pressure and market saturation');
    }
    if (input.currentChallenges.includes('LIMITED_BUDGET')) {
      threats.push('Budget constraints limiting marketing reach and capabilities');
    }
    if (input.currentChallenges.includes('TECHNOLOGY_GAPS')) {
      threats.push('Technology limitations impacting marketing effectiveness');
    }
    if (input.currentChallenges.includes('LONG_SALES_CYCLES')) {
      threats.push('Extended sales cycles affecting cash flow and growth');
    }
  }

  if (input.competitiveLandscape === 'RED_OCEAN') {
    threats.push('Price wars and margin compression from competitors');
  }

  threats.push('Technology disruption and changing marketing landscape');
  threats.push('Economic uncertainty and market volatility');
  threats.push('Data privacy regulations and marketing restrictions');

  return {
    strengths,
    weaknesses,
    opportunities,
    threats,
  };
}

function generateKeyInsights(input: EnhancedStrategyInput): string[] {
  const insights: string[] = [];

  // Market-specific insights
  if (input.targetMarketMaturity === 'EMERGING' && input.competitiveLandscape === 'BLUE_OCEAN') {
    insights.push('Unique opportunity to define the category and establish market leadership in an emerging, uncontested space');
  }

  if (input.businessType === 'B2B' && input.companyStage === 'STARTUP') {
    insights.push('B2B startups should focus on thought leadership and relationship building to overcome trust barriers');
  }

  if (input.businessType === 'B2C' && input.brandPositioning === 'PREMIUM') {
    insights.push('Premium B2C positioning requires consistent brand experience across all touchpoints to justify price premium');
  }

  // Budget and resource insights
  if (input.budget < 50000 && input.teamSize === 'SOLO') {
    insights.push('Limited budget and solo operation requires focus on high-ROI channels and automation');
  } else if (input.budget > 500000 && input.teamSize.includes('LARGE')) {
    insights.push('Significant budget and team size enable multi-channel integrated campaigns and sophisticated attribution');
  }

  // Challenge-specific insights
  if (input.currentChallenges?.includes('LOW_BRAND_AWARENESS') && input.marketingObjectives.includes('BRAND_AWARENESS')) {
    insights.push('Brand awareness challenge aligns with objectives - focus on reach and frequency in early phases');
  }

  if (input.currentChallenges?.includes('LIMITED_BUDGET') && input.primaryKPI === 'REVENUE') {
    insights.push('Limited budget requires focus on high-ROI channels and customer lifetime value optimization');
  }

  // Strategic insights
  insights.push(`${input.businessType} model at ${input.companyStage.toLowerCase()} stage requires balance between growth and efficiency`);
  insights.push(`${input.geographicScope} scope demands ${input.geographicScope === 'GLOBAL' ? 'localized strategies within global framework' : 'focused market penetration'}`);

  if (input.marketingMaturity === 'BEGINNER') {
    insights.push('Building marketing capabilities should be parallel priority alongside campaign execution');
  }

  return insights;
}

