import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Brand Positioning Generator
 * Creates comprehensive brand positioning and messaging framework
 */

interface BrandPositioning {
  positioningStatement: string;
  valueProposition: string;
  brandPillars: string[];
  messagingFramework: {
    coreMessage: string;
    supportingMessages: string[];
    proofPoints: string[];
  };
  competitiveDifferentiation: string[];
}

export function generateBrandPositioning(input: EnhancedStrategyInput, isPaid: boolean = false): BrandPositioning {
  const positioningStatement = generatePositioningStatement(input, isPaid);
  const valueProposition = generateValueProposition(input, isPaid);
  const brandPillars = generateBrandPillars(input, isPaid);
  const messagingFramework = generateMessagingFramework(input, isPaid);
  const competitiveDifferentiation = generateCompetitiveDifferentiation(input, isPaid);

  return {
    positioningStatement,
    valueProposition,
    brandPillars,
    messagingFramework,
    competitiveDifferentiation,
  };
}

function generatePositioningStatement(input: EnhancedStrategyInput, isPaid: boolean): string {
  const targetMap: Record<string, string> = {
    B2B: 'businesses',
    B2C: 'consumers',
    B2B2C: 'businesses and their customers',
    D2C: 'consumers',
    MARKETPLACE: 'buyers and sellers',
    SAAS: 'teams and organizations',
    ECOMMERCE: 'online shoppers',
    SERVICE: 'clients',
  };

  const positioningMap: Record<string, string> = {
    PREMIUM: 'premium, high-quality',
    VALUE: 'affordable, value-driven',
    INNOVATIVE: 'innovative, cutting-edge',
    RELIABLE: 'trusted, reliable',
    CUSTOMER_CENTRIC: 'customer-focused, service-oriented',
  };

  const target = targetMap[input.businessType] || 'customers';
  const positioning = positioningMap[input.brandPositioning] || 'quality';

  const baseStatement = `For ${target} in the ${input.industry} industry who need ${input.marketingObjectives[0]?.toLowerCase().replace(/_/g, ' ') || 'marketing solutions'}, ${input.businessName} is the ${positioning} ${input.businessType} solution that delivers ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} results. Unlike competitors in this ${input.competitiveLandscape.toLowerCase().replace(/_/g, ' ')} market, we provide ${input.brandPositioning === 'PREMIUM' ? 'unparalleled quality and service' : input.brandPositioning === 'VALUE' ? 'exceptional value without compromising quality' : input.brandPositioning === 'INNOVATIVE' ? 'breakthrough innovation and unique capabilities' : input.brandPositioning === 'RELIABLE' ? 'proven reliability and trusted expertise' : 'exceptional customer experience and personalized service'}.`;

  if (isPaid) {
    return `${baseStatement} Our unique approach leverages ${input.companyStage === 'STARTUP' ? 'agile methodologies' : 'proven frameworks'} to ensure ${input.marketingObjectives.includes('CUSTOMER_RETENTION') ? 'long-term partnership value' : 'rapid value realization'}, backed by ${input.marketingMaturity === 'EXPERT' ? 'industry-leading expertise' : 'dedicated support'}.`;
  }

  return baseStatement;
}

function generateValueProposition(input: EnhancedStrategyInput, isPaid: boolean): string {
  const stageValue: Record<string, string> = {
    STARTUP: 'agile, innovative approach that adapts to your evolving needs',
    GROWTH: 'scalable solutions that grow with your business',
    MATURE: 'proven expertise and industry-leading capabilities',
    ENTERPRISE: 'enterprise-grade solutions with comprehensive support',
  };

  const landscapeValue: Record<string, string> = {
    BLUE_OCEAN: 'pioneering solutions in an emerging market',
    RED_OCEAN: 'clear differentiation in a competitive landscape',
    NICHE: 'specialized expertise in your specific market segment',
    MONOPOLISTIC: 'innovative alternatives to established players',
  };

  const valueProps: string[] = [];

  // Core value based on positioning
  if (input.brandPositioning === 'PREMIUM') {
    valueProps.push('Exceptional quality and premium experience that justifies the investment');
    valueProps.push('White-glove service and personalized attention');
    valueProps.push('Exclusive access to premium features and capabilities');
  } else if (input.brandPositioning === 'VALUE') {
    valueProps.push('Best-in-class value without compromising on quality');
    valueProps.push('Transparent pricing and no hidden costs');
    valueProps.push('Proven ROI and cost-effectiveness');
  } else if (input.brandPositioning === 'INNOVATIVE') {
    valueProps.push('Cutting-edge innovation that gives you competitive advantage');
    valueProps.push('First-to-market features and capabilities');
    valueProps.push('Continuous innovation and product evolution');
  } else if (input.brandPositioning === 'RELIABLE') {
    valueProps.push('Proven track record and industry expertise');
    valueProps.push('Reliable, consistent performance you can count on');
    valueProps.push('Deep industry knowledge and best practices');
  } else if (input.brandPositioning === 'CUSTOMER_CENTRIC') {
    valueProps.push('Exceptional customer experience at every touchpoint');
    valueProps.push('Personalized solutions tailored to your unique needs');
    valueProps.push('Dedicated support and customer success focus');
  }

  // Add stage-specific value
  valueProps.push(stageValue[input.companyStage]);

  // Add landscape-specific value
  valueProps.push(landscapeValue[input.competitiveLandscape]);

  // Add objective-specific value
  if (input.marketingObjectives.includes('BRAND_AWARENESS')) {
    valueProps.push('Proven strategies to build brand recognition and recall');
  }
  if (input.marketingObjectives.includes('LEAD_GENERATION')) {
    valueProps.push('High-quality lead generation that drives pipeline growth');
  }
  if (input.marketingObjectives.includes('CUSTOMER_ACQUISITION')) {
    valueProps.push('Efficient customer acquisition with optimized CAC');
  }
  if (input.marketingObjectives.includes('CUSTOMER_RETENTION')) {
    valueProps.push('Customer retention strategies that maximize lifetime value');
  }

  if (isPaid) {
    valueProps.push('Data-driven insights that empower smarter decision making');
    valueProps.push('Holistic ecosystem integration for seamless operations');
  }

  return `${input.businessName} delivers ${valueProps.join('. ')}. Our ${stageValue[input.companyStage]} ensures you get the results you need to achieve ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} goals.`;
}

function generateBrandPillars(input: EnhancedStrategyInput, isPaid: boolean): string[] {
  const pillars: string[] = [];

  // Pillar 1: Based on positioning
  const positioningPillars: Record<string, string> = {
    PREMIUM: 'Excellence & Quality',
    VALUE: 'Value & Accessibility',
    INNOVATIVE: 'Innovation & Progress',
    RELIABLE: 'Trust & Reliability',
    CUSTOMER_CENTRIC: 'Customer Experience & Service',
  };
  pillars.push(positioningPillars[input.brandPositioning]);

  // Pillar 2: Based on business type
  const businessPillars: Record<string, string> = {
    B2B: 'Partnership & Collaboration',
    B2C: 'Customer Experience & Satisfaction',
    B2B2C: 'Ecosystem & Integration',
    D2C: 'Direct Connection & Authenticity',
    MARKETPLACE: 'Community & Trust',
    SAAS: 'Productivity & Efficiency',
    ECOMMERCE: 'Convenience & Selection',
    SERVICE: 'Expertise & Results',
  };
  pillars.push(businessPillars[input.businessType]);

  // Pillar 3: Based on primary objective
  if (input.marketingObjectives.includes('CUSTOMER_RETENTION') || input.marketingObjectives.includes('CUSTOMER_ENGAGEMENT')) {
    pillars.push('Customer Success & Support');
  } else if (input.marketingObjectives.includes('THOUGHT_LEADERSHIP')) {
    pillars.push('Thought Leadership & Expertise');
  } else if (input.marketingObjectives.includes('BRAND_AWARENESS')) {
    pillars.push('Visibility & Recognition');
  } else {
    pillars.push('Results & Performance');
  }

  // Pillar 4: Based on market context
  if (input.targetMarketMaturity === 'EMERGING') {
    pillars.push('Innovation & Market Leadership');
  } else if (input.competitiveLandscape === 'BLUE_OCEAN') {
    pillars.push('Category Creation & Education');
  } else if (input.competitiveLandscape === 'RED_OCEAN') {
    pillars.push('Differentiation & Unique Value');
  } else {
    pillars.push('Specialization & Focus');
  }

  if (isPaid) {
    pillars.push('Data Integrity & Security');
    pillars.push('Sustainability & Social Responsibility');
  }

  return pillars.slice(0, isPaid ? 6 : 4); // Return more pillars for paid
}

function generateMessagingFramework(input: EnhancedStrategyInput, isPaid: boolean) {
  // Core message
  const coreMessage = `${input.businessName} ${input.brandPositioning === 'PREMIUM' ? 'delivers premium' : input.brandPositioning === 'VALUE' ? 'provides exceptional value in' : input.brandPositioning === 'INNOVATIVE' ? 'innovates' : input.brandPositioning === 'RELIABLE' ? 'brings proven expertise to' : 'puts customers first in'} ${input.industry} ${input.businessType === 'B2B' ? 'for businesses' : input.businessType === 'B2C' ? 'for consumers' : 'solutions'} that drive ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} results.`;

  // Supporting messages
  const supportingMessages: string[] = [];

  // Message 1: Problem/Solution
  if (input.currentChallenges && input.currentChallenges.length > 0) {
    const topChallenge = input.currentChallenges[0].toLowerCase().replace(/_/g, ' ');
    supportingMessages.push(`We solve ${topChallenge} with our ${input.brandPositioning.toLowerCase()} approach`);
  } else {
    supportingMessages.push(`We help you achieve ${input.marketingObjectives[0]?.toLowerCase().replace(/_/g, ' ') || 'your goals'} faster and more effectively`);
  }

  // Message 2: Differentiation
  if (input.competitiveLandscape === 'BLUE_OCEAN') {
    supportingMessages.push('As pioneers in this space, we define the category and set the standards');
  } else if (input.competitiveLandscape === 'RED_OCEAN') {
    supportingMessages.push(`Our ${input.brandPositioning.toLowerCase()} positioning sets us apart in a crowded market`);
  } else if (input.competitiveLandscape === 'NICHE') {
    supportingMessages.push('Our specialized focus means deeper expertise and better results for your specific needs');
  } else {
    supportingMessages.push('We offer a fresh alternative to established players with innovative approaches');
  }

  // Message 3: Proof/Results
  supportingMessages.push(`Proven track record of delivering ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} improvements for ${input.businessType} companies`);

  // Message 4: Scale/Scope
  if (input.geographicScope === 'GLOBAL') {
    supportingMessages.push('Global reach with local expertise across all major markets');
  } else if (input.geographicScope === 'NATIONAL') {
    supportingMessages.push('National presence with deep understanding of regional markets');
  } else {
    supportingMessages.push(`Focused ${input.geographicScope.toLowerCase()} presence ensures personalized service and market expertise`);
  }

  if (isPaid) {
    supportingMessages.push('Enterprise-grade security and compliance you can trust');
    supportingMessages.push('Seamless integration with your existing workflows');
  }

  // Proof points
  const proofPoints: string[] = [];

  // Proof point 1: Stage credibility
  if (input.companyStage === 'STARTUP') {
    proofPoints.push('Agile and innovative approach that adapts quickly to market changes');
  } else if (input.companyStage === 'GROWTH') {
    proofPoints.push('Proven product-market fit with growing customer base and market validation');
  } else if (input.companyStage === 'MATURE') {
    proofPoints.push('Established market leader with years of proven expertise and customer success');
  } else {
    proofPoints.push('Enterprise-scale operations with comprehensive capabilities and resources');
  }

  // Proof point 2: Technology/Capabilities
  if (input.existingMarTech && input.existingMarTech.length > 0) {
    proofPoints.push(`Advanced technology stack including ${input.existingMarTech.slice(0, 3).join(', ')}`);
  } else {
    proofPoints.push('Cutting-edge technology and modern marketing capabilities');
  }

  // Proof point 3: Team/Expertise
  if (input.marketingMaturity === 'EXPERT' || input.marketingMaturity === 'ADVANCED') {
    proofPoints.push('World-class team with deep industry expertise and proven methodologies');
  } else {
    proofPoints.push('Dedicated team committed to your success with continuous learning and improvement');
  }

  // Proof point 4: Results orientation
  proofPoints.push(`Focus on measurable ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} outcomes with transparent reporting`);

  // Proof point 5: Customer success
  if (input.businessType === 'B2B' || input.businessType === 'SAAS') {
    proofPoints.push('Dedicated customer success team ensuring your long-term success');
  } else {
    proofPoints.push('Customer-first approach with exceptional support and service');
  }

  if (isPaid) {
    proofPoints.push('ISO 27001 certified security standards');
    proofPoints.push('99.9% uptime SLA guarantee');
  }

  return {
    coreMessage,
    supportingMessages,
    proofPoints,
  };
}

function generateCompetitiveDifferentiation(input: EnhancedStrategyInput, isPaid: boolean): string[] {
  const differentiators: string[] = [];

  // Positioning-based differentiation
  if (input.brandPositioning === 'PREMIUM') {
    differentiators.push('Premium quality and white-glove service that justifies higher investment');
    differentiators.push('Exclusive features and capabilities not available from value competitors');
    differentiators.push('Personalized attention and dedicated account management');
  } else if (input.brandPositioning === 'VALUE') {
    differentiators.push('Superior value proposition with transparent, competitive pricing');
    differentiators.push('No compromise on quality despite lower price point');
    differentiators.push('Efficient operations that pass savings to customers');
  } else if (input.brandPositioning === 'INNOVATIVE') {
    differentiators.push('First-to-market innovation and cutting-edge capabilities');
    differentiators.push('Continuous product evolution and feature releases');
    differentiators.push('Technology leadership and forward-thinking approach');
  } else if (input.brandPositioning === 'RELIABLE') {
    differentiators.push('Proven track record and industry expertise spanning years');
    differentiators.push('Reliable, consistent performance and established best practices');
    differentiators.push('Deep industry relationships and market knowledge');
  } else if (input.brandPositioning === 'CUSTOMER_CENTRIC') {
    differentiators.push('Exceptional customer experience and personalized service');
    differentiators.push('Customer success focus with dedicated support teams');
    differentiators.push('Continuous feedback integration and customer-driven innovation');
  }

  // Stage-based differentiation
  if (input.companyStage === 'STARTUP') {
    differentiators.push('Agility and speed to adapt to customer needs and market changes');
    differentiators.push('Direct access to founders and decision-makers');
  } else if (input.companyStage === 'GROWTH') {
    differentiators.push('Proven scalability with systems that grow with your business');
    differentiators.push('Balance of innovation and stability');
  } else if (input.companyStage === 'MATURE') {
    differentiators.push('Market-leading position with comprehensive capabilities');
    differentiators.push('Financial stability and long-term partnership potential');
  } else {
    differentiators.push('Enterprise-grade security, compliance, and SLAs');
    differentiators.push('Global resources with local market expertise');
  }

  // Business model differentiation
  if (input.businessType === 'D2C') {
    differentiators.push('Direct relationship with customers eliminating middlemen');
    differentiators.push('Better margins allowing for superior quality and value');
  } else if (input.businessType === 'SAAS') {
    differentiators.push('Cloud-based accessibility and automatic updates');
    differentiators.push('Flexible pricing and scalability');
  } else if (input.businessType === 'MARKETPLACE') {
    differentiators.push('Network effects creating value for all participants');
    differentiators.push('Trust and safety mechanisms protecting all parties');
  }

  // Market context differentiation
  if (input.competitiveLandscape === 'BLUE_OCEAN') {
    differentiators.push('Category leadership and market definition');
    differentiators.push('First-mover advantages and brand recognition');
  } else if (input.competitiveLandscape === 'NICHE') {
    differentiators.push('Specialized expertise in specific market segment');
    differentiators.push('Deep understanding of unique customer needs');
  }

  // Capability differentiation
  if (input.marketingMaturity === 'EXPERT' || input.marketingMaturity === 'ADVANCED') {
    differentiators.push('Sophisticated marketing capabilities and data-driven approach');
    differentiators.push('Advanced analytics and optimization methodologies');
  }

  // Geographic differentiation
  if (input.geographicScope === 'GLOBAL') {
    differentiators.push('Global presence with local market expertise');
    differentiators.push('Cross-market insights and best practices');
  } else if (input.geographicScope === 'LOCAL') {
    differentiators.push('Deep local market knowledge and community connections');
    differentiators.push('Personalized service and local accountability');
  }

  if (isPaid) {
    differentiators.push('Proprietary technology and IP');
    differentiators.push('Exclusive strategic partnerships');
  }

  return differentiators.slice(0, isPaid ? 12 : 8); // Return more differentiators for paid
}
