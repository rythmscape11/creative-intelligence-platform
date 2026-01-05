import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Target Audience Personas Generator
 * Creates detailed buyer personas based on business context
 */

interface Persona {
  name: string;
  demographics: string;
  psychographics: string;
  painPoints: string[];
  goals: string[];
  buyingJourney: string[];
  preferredChannels: string[];
  messagingApproach: string;
}



function generateB2BPersona(input: EnhancedStrategyInput, type: 'primary' | 'secondary'): Persona {
  if (type === 'primary') {
    return {
      name: 'Decision Maker David',
      demographics: `C-level executive or VP at ${input.companyStage === 'STARTUP' ? 'small to mid-sized' : input.companyStage === 'GROWTH' ? 'mid-sized to large' : 'enterprise'} companies in ${input.industry}. Age 40-55, MBA or advanced degree, $150k-$300k+ annual income. Located in ${input.geographicScope === 'GLOBAL' ? 'major business hubs globally' : input.geographicScope === 'NATIONAL' ? 'major US cities' : 'regional business centers'}.`,

      psychographics: `Results-driven, data-focused, risk-averse. Values ROI, efficiency, and proven solutions. Seeks vendors who understand their business challenges and can demonstrate clear value. Influenced by industry thought leaders, peer recommendations, and case studies. Time-constrained and expects concise, relevant information.`,

      painPoints: [
        `Struggling to achieve ${input.marketingObjectives.join(', ').toLowerCase()} with current solutions`,
        'Limited budget and resources for experimentation',
        'Need to demonstrate ROI to stakeholders and board',
        'Difficulty finding vendors who truly understand their industry',
        'Pressure to deliver results quickly while managing risk',
        ...(input.currentChallenges?.map(c => c.toLowerCase().replace(/_/g, ' ')) || []),
      ],

      goals: [
        `Achieve measurable improvement in ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')}`,
        'Find reliable, scalable solutions that grow with the business',
        'Reduce operational complexity and vendor management overhead',
        'Build competitive advantages in their market',
        'Demonstrate clear ROI to justify investment',
      ],

      buyingJourney: [
        'Awareness: Identifies business challenge or opportunity through industry reports, peer discussions, or internal analysis',
        'Research: Conducts extensive online research, reads case studies, attends webinars, and consults with peers',
        'Consideration: Evaluates 3-5 vendors, requests demos, reviews pricing, and checks references',
        'Decision: Involves procurement and legal teams, negotiates terms, requires executive approval',
        'Implementation: Expects white-glove onboarding, training, and ongoing support',
        'Advocacy: Becomes reference customer if successful, provides testimonials and case studies',
      ],

      preferredChannels: [
        'LinkedIn (professional networking and thought leadership)',
        'Industry publications and trade journals',
        'Webinars and virtual events',
        'Peer recommendations and referrals',
        'Google search for specific solutions',
        'Industry conferences and trade shows',
        ...(input.preferredChannels?.slice(0, 3) || []),
      ],

      messagingApproach: `Focus on ROI, efficiency gains, and risk mitigation. Use data-driven case studies and testimonials from similar companies. Emphasize ${input.brandPositioning === 'PREMIUM' ? 'premium quality and white-glove service' : input.brandPositioning === 'INNOVATIVE' ? 'cutting-edge innovation and competitive advantage' : input.brandPositioning === 'VALUE' ? 'cost-effectiveness and proven results' : 'reliability and industry expertise'}. Speak to business outcomes, not features. Provide clear implementation roadmap and success metrics.`,
    };
  } else {
    return {
      name: 'Influencer Ian',
      demographics: `Director or Manager level, age 30-45, responsible for day-to-day operations and vendor evaluation. Often the primary user of solutions and key influencer in purchasing decisions. Located in ${input.geographicScope === 'GLOBAL' ? 'various global markets' : 'regional offices'}.`,

      psychographics: `Hands-on, detail-oriented, focused on practical implementation. Values ease of use, integration capabilities, and vendor support. Seeks solutions that make their job easier and help them achieve their KPIs. Active in professional communities and online forums.`,

      painPoints: [
        'Overwhelmed with daily operational challenges',
        'Limited time for vendor evaluation and implementation',
        'Need solutions that integrate with existing tech stack',
        'Pressure to deliver results with limited resources',
        'Difficulty getting buy-in from leadership for new initiatives',
      ],

      goals: [
        'Find solutions that are easy to implement and use',
        'Improve team efficiency and productivity',
        'Demonstrate value to leadership',
        'Build skills and advance career',
        'Reduce manual work and automate processes',
      ],

      buyingJourney: [
        'Awareness: Discovers solutions through online search, peer recommendations, or social media',
        'Research: Reads reviews, watches product demos, joins user communities',
        'Evaluation: Tests free trials, compares features, assesses ease of use',
        'Advocacy: Champions solution internally, builds business case for leadership',
        'Implementation: Leads rollout, trains team, measures results',
        'Retention: Becomes power user and community advocate',
      ],

      preferredChannels: [
        'Google search and SEO content',
        'LinkedIn groups and professional communities',
        'YouTube tutorials and product demos',
        'Email newsletters with practical tips',
        'Peer review sites (G2, Capterra, TrustRadius)',
        'Industry blogs and podcasts',
      ],

      messagingApproach: `Focus on ease of use, practical benefits, and quick wins. Provide detailed product information, tutorials, and implementation guides. Emphasize integration capabilities and support quality. Use peer testimonials and user reviews. Offer free trials or demos to reduce risk.`,
    };
  }
}

function generateB2CPersona(input: EnhancedStrategyInput, type: 'primary' | 'secondary' | 'tertiary'): Persona {
  if (type === 'primary') {
    const ageRange = input.brandPositioning === 'PREMIUM' ? '35-55' : input.brandPositioning === 'INNOVATIVE' ? '25-40' : '25-65';
    const income = input.brandPositioning === 'PREMIUM' ? '$100k-$250k+' : input.brandPositioning === 'VALUE' ? '$40k-$80k' : '$60k-$120k';

    return {
      name: input.brandPositioning === 'PREMIUM' ? 'Premium Patricia' : input.brandPositioning === 'INNOVATIVE' ? 'Early Adopter Emma' : 'Value-Conscious Victor',

      demographics: `Age ${ageRange}, household income ${income}, ${input.geographicScope === 'GLOBAL' ? 'urban areas globally' : input.geographicScope === 'NATIONAL' ? 'suburban and urban US' : 'local metropolitan area'}. College-educated, ${input.brandPositioning === 'PREMIUM' ? 'high disposable income' : 'budget-conscious'}, active online shopper. ${input.targetAudience}`,

      psychographics: `${input.brandPositioning === 'PREMIUM' ? 'Values quality, exclusivity, and status. Willing to pay premium for superior products and experiences. Brand-conscious and seeks luxury.' : input.brandPositioning === 'INNOVATIVE' ? 'Tech-savvy early adopter who loves trying new products. Values innovation, uniqueness, and being first. Influences others through social media.' : input.brandPositioning === 'VALUE' ? 'Practical and price-conscious. Seeks best value for money. Researches extensively before purchasing. Loyal to brands that deliver consistent quality at fair prices.' : 'Balanced approach to quality and price. Values reliability and good customer service.'}`,

      painPoints: [
        `Difficulty finding ${input.brandPositioning === 'PREMIUM' ? 'truly premium products that justify the price' : input.brandPositioning === 'INNOVATIVE' ? 'innovative products that actually work' : 'good quality products at reasonable prices'}`,
        'Overwhelmed by too many choices in the market',
        'Uncertainty about product quality and authenticity',
        'Poor customer service experiences with other brands',
        'Time constraints for shopping and research',
        ...(input.currentChallenges?.includes('LOW_BRAND_AWARENESS') ? ['Unaware of better alternatives in the market'] : []),
      ],

      goals: [
        `Find ${input.brandPositioning === 'PREMIUM' ? 'premium products that enhance lifestyle and status' : input.brandPositioning === 'INNOVATIVE' ? 'cutting-edge products that solve problems uniquely' : 'reliable products that offer great value'}`,
        'Make confident purchasing decisions',
        'Save time in shopping and research',
        'Get excellent customer service and support',
        'Share discoveries with friends and family',
      ],

      buyingJourney: [
        `Awareness: Discovers brand through ${input.brandPositioning === 'PREMIUM' ? 'influencer recommendations, luxury publications, or exclusive events' : input.brandPositioning === 'INNOVATIVE' ? 'social media, tech blogs, or early adopter communities' : 'online ads, search, or word-of-mouth'}`,
        `Research: ${input.brandPositioning === 'PREMIUM' ? 'Reads reviews, checks brand heritage, seeks social proof from aspirational figures' : input.brandPositioning === 'INNOVATIVE' ? 'Watches unboxing videos, reads tech reviews, joins beta programs' : 'Compares prices, reads customer reviews, looks for deals and promotions'}`,
        `Consideration: Evaluates 2-4 brands, checks return policies, reads detailed product information`,
        `Purchase: ${input.brandPositioning === 'PREMIUM' ? 'Expects premium shopping experience, personalized service' : input.brandPositioning === 'INNOVATIVE' ? 'Quick decision if product meets innovation criteria' : 'Waits for promotions or uses discount codes'}`,
        `Post-Purchase: Shares experience on social media, writes reviews, recommends to others if satisfied`,
        `Loyalty: Becomes repeat customer and brand advocate if experience exceeds expectations`,
      ],

      preferredChannels: [
        input.brandPositioning === 'PREMIUM' ? 'Instagram and Pinterest (visual inspiration)' : 'Facebook and Instagram',
        input.brandPositioning === 'INNOVATIVE' ? 'YouTube (product reviews and unboxings)' : 'Google search',
        input.brandPositioning === 'PREMIUM' ? 'Luxury lifestyle publications' : 'Email marketing',
        'Brand website and e-commerce',
        input.brandPositioning === 'INNOVATIVE' ? 'TikTok and emerging platforms' : 'Comparison shopping sites',
        ...(input.preferredChannels?.slice(0, 2) || []),
      ],

      messagingApproach: `${input.brandPositioning === 'PREMIUM' ? 'Emphasize exclusivity, craftsmanship, and heritage. Use aspirational imagery and storytelling. Highlight celebrity endorsements and social proof from influential figures.' : input.brandPositioning === 'INNOVATIVE' ? 'Focus on innovation, uniqueness, and being first. Use tech-forward language and showcase cutting-edge features. Leverage early adopter testimonials and tech influencers.' : 'Highlight value proposition, quality-to-price ratio, and customer satisfaction. Use clear comparisons and money-back guarantees. Emphasize reliability and customer reviews.'}`,
    };
  } else if (type === 'secondary') {
    return {
      name: 'Budget-Conscious Betty',
      demographics: `Age 25-45, household income $35k-$70k, price-sensitive shopper. Lives in ${input.geographicScope === 'GLOBAL' ? 'various global markets' : 'suburban or rural areas'}. Family-oriented, seeks value and practicality.`,

      psychographics: `Practical, budget-conscious, and deal-seeking. Values functionality over brand names. Loyal to brands that consistently deliver value. Active in coupon communities and deal-sharing groups. Influenced by peer recommendations and online reviews.`,

      painPoints: [
        'Limited budget for discretionary spending',
        'Need to justify purchases to family',
        'Difficulty finding quality products at affordable prices',
        'Time spent searching for deals and promotions',
        'Concern about product quality at lower price points',
      ],

      goals: [
        'Maximize value for every dollar spent',
        'Find reliable products that last',
        'Save money for family priorities',
        'Make smart purchasing decisions',
        'Discover deals and promotions',
      ],

      buyingJourney: [
        'Awareness: Discovers products through deal sites, email promotions, or social media ads',
        'Research: Extensively compares prices across multiple retailers, reads reviews',
        'Consideration: Waits for sales, uses price tracking tools, seeks discount codes',
        'Purchase: Buys during promotions, uses cashback and rewards programs',
        'Post-Purchase: Shares deals with friends, writes reviews for future shoppers',
        'Loyalty: Returns if product delivers value, but will switch for better deals',
      ],

      preferredChannels: [
        'Email marketing with exclusive deals',
        'Facebook groups and deal communities',
        'Coupon and deal websites',
        'Google Shopping and price comparison sites',
        'Retailer apps with loyalty programs',
      ],

      messagingApproach: `Focus on value, savings, and promotions. Use clear pricing and discount messaging. Highlight money-back guarantees and free shipping. Emphasize durability and long-term value. Use customer testimonials about value and quality.`,
    };
  } else {
    return {
      name: 'Impulse Buyer Ian',
      demographics: `Age 18-35, digitally native, active on social media. Influenced by trends and social proof. Quick decision-maker with moderate disposable income.`,

      psychographics: `Spontaneous, trend-conscious, and socially influenced. Makes quick purchasing decisions based on emotional appeal. Values convenience and instant gratification. Highly active on social media and influenced by influencers and peers.`,

      painPoints: [
        'FOMO (fear of missing out) on trends',
        'Difficulty resisting impulse purchases',
        'Regret over hasty buying decisions',
        'Overwhelmed by social media advertising',
        'Need for instant gratification',
      ],

      goals: [
        'Stay on top of trends and be first among friends',
        'Express personality through purchases',
        'Share exciting discoveries on social media',
        'Get products quickly and conveniently',
        'Feel good about spontaneous purchases',
      ],

      buyingJourney: [
        'Awareness: Discovers through social media ads, influencer posts, or trending content',
        'Interest: Immediately attracted by visual appeal or social proof',
        'Decision: Makes quick purchase decision, often within minutes',
        'Purchase: Expects seamless checkout and fast shipping',
        'Sharing: Posts about purchase on social media immediately',
        'Retention: May or may not repurchase depending on product satisfaction',
      ],

      preferredChannels: [
        'Instagram and TikTok (visual and video content)',
        'Influencer marketing and sponsored posts',
        'Social commerce (Instagram Shopping, TikTok Shop)',
        'Mobile apps with one-click checkout',
        'Retargeting ads',
      ],

      messagingApproach: `Use eye-catching visuals and video content. Create urgency with limited-time offers and scarcity messaging. Leverage influencer partnerships and user-generated content. Make checkout process seamless and mobile-optimized. Focus on emotional appeal and social proof.`,
    };
  }
}

function generateSaaSPersona(input: EnhancedStrategyInput, type: 'primary' | 'secondary'): Persona {
  if (type === 'primary') {
    return {
      name: 'SaaS Savvy Sarah',
      demographics: `Product Manager or Operations Lead at ${input.companyStage === 'STARTUP' ? 'startup or small company' : 'growing company'}, age 28-42, tech-savvy, $80k-$150k income. Located in tech hubs or remote. Responsible for tool selection and team productivity.`,

      psychographics: `Data-driven, efficiency-focused, and tech-forward. Values tools that integrate well, have good UX, and provide clear ROI. Active in SaaS communities and product forums. Seeks solutions that scale with the business. Influenced by peer reviews and product comparisons.`,

      painPoints: [
        'Tool sprawl and integration challenges',
        'Difficulty getting team adoption of new tools',
        'Need to demonstrate ROI to leadership',
        'Limited budget for software subscriptions',
        'Concern about vendor lock-in and data portability',
      ],

      goals: [
        'Find tools that improve team productivity',
        'Reduce tool complexity and costs',
        'Ensure smooth integrations with existing stack',
        'Get quick team adoption and engagement',
        'Demonstrate measurable business impact',
      ],

      buyingJourney: [
        'Awareness: Discovers through product hunt, SaaS directories, or peer recommendations',
        'Research: Signs up for free trial, reads documentation, checks integration options',
        'Evaluation: Tests with small team, evaluates UX and features, compares pricing',
        'Decision: Builds business case, gets team feedback, negotiates pricing',
        'Onboarding: Expects smooth setup, good documentation, responsive support',
        'Expansion: Upgrades plan as team grows, becomes advocate if successful',
      ],

      preferredChannels: [
        'Product Hunt and SaaS directories',
        'LinkedIn and professional networks',
        'Product comparison sites (G2, Capterra)',
        'YouTube product demos and tutorials',
        'Email drip campaigns with educational content',
        'Webinars and product workshops',
      ],

      messagingApproach: `Focus on productivity gains, ease of use, and integration capabilities. Provide free trial with no credit card required. Use product-led growth approach with self-service onboarding. Highlight customer success stories and ROI metrics. Emphasize security, reliability, and support quality.`,
    };
  } else {
    return {
      name: 'Enterprise Eric',
      demographics: `IT Director or CTO at mid-to-large enterprise, age 40-55, responsible for technology decisions and vendor management. $150k-$250k+ income. Focused on security, scalability, and compliance.`,

      psychographics: `Risk-averse, security-focused, and process-oriented. Values enterprise-grade features, SLAs, and vendor stability. Requires extensive evaluation and approval processes. Influenced by analyst reports (Gartner, Forrester) and peer CIOs.`,

      painPoints: [
        'Security and compliance requirements',
        'Need for enterprise SLAs and support',
        'Complex procurement and approval processes',
        'Integration with legacy systems',
        'Vendor stability and long-term viability concerns',
      ],

      goals: [
        'Ensure security and compliance',
        'Minimize business disruption',
        'Negotiate favorable enterprise terms',
        'Build long-term vendor partnerships',
        'Demonstrate strategic value to board',
      ],

      buyingJourney: [
        'Awareness: Learns through analyst reports, industry events, or vendor outreach',
        'Research: Reviews security documentation, compliance certifications, case studies',
        'Evaluation: Conducts security audit, involves legal and procurement teams',
        'Negotiation: Requires custom pricing, SLAs, and contract terms',
        'Implementation: Expects dedicated account team and white-glove onboarding',
        'Partnership: Becomes reference customer and strategic partner',
      ],

      preferredChannels: [
        'Industry conferences and trade shows',
        'Analyst reports and webinars',
        'Direct sales and account management',
        'Peer networks and CIO forums',
        'LinkedIn thought leadership',
      ],

      messagingApproach: `Emphasize enterprise features, security, and compliance. Provide detailed security documentation and certifications. Highlight enterprise customer success stories. Offer dedicated account management and premium support. Focus on partnership and long-term value.`,
    };
  }
}

export function generateTargetAudiencePersonas(input: EnhancedStrategyInput, isPaid: boolean = false) {
  const basePersonas = [
    {
      name: 'Primary Decision Maker',
      demographics: 'Age 35-50, Senior Management, Urban/Suburban',
      psychographics: 'Value-driven, time-poor, seeks reliability and efficiency',
      painPoints: [
        'Inefficient current processes',
        'Lack of clear ROI visibility',
        'Resource constraints',
      ],
      goals: [
        'Streamline operations',
        'Demonstrate clear value to stakeholders',
        'Scale efficiently',
      ],
      buyingJourney: [
        'Problem identification',
        'Solution research',
        'Vendor comparison',
        'Decision',
      ],
      preferredChannels: ['LinkedIn', 'Industry Publications', 'Email'],
      messagingApproach: 'Focus on ROI, efficiency, and reliability',
    },
    {
      name: 'End User / Influencer',
      demographics: 'Age 25-40, Mid-level Professional',
      psychographics: 'Tech-savvy, ambitious, seeks ease of use',
      painPoints: [
        'Manual repetitive tasks',
        'Complex tools with steep learning curves',
      ],
      goals: [
        'Get work done faster',
        'Impress management with results',
      ],
      buyingJourney: [
        'Awareness of inefficiency',
        'Search for tools',
        'Trial/Demo',
        'Recommendation',
      ],
      preferredChannels: ['Social Media', 'Community Forums', 'Blogs'],
      messagingApproach: 'Focus on usability, features, and time-saving',
    },
  ];

  if (isPaid) {
    return [
      ...basePersonas.map(p => ({
        ...p,
        painPoints: [...p.painPoints, 'Fear of making the wrong choice', 'Integration headaches'],
        goals: [...p.goals, 'Career advancement', 'Building a legacy'],
        buyingJourney: [...p.buyingJourney, 'Internal consensus building', 'Procurement review'],
      })),
      {
        name: 'The Skeptic / Blocker',
        demographics: 'Age 40-60, Finance/Procurement',
        psychographics: 'Risk-averse, budget-conscious, detail-oriented',
        painPoints: [
          'Unproven solutions',
          'Hidden costs',
          'Security risks',
        ],
        goals: [
          'Minimize risk',
          'Ensure compliance',
          'Optimize budget',
        ],
        buyingJourney: [
          'Risk assessment',
          'Compliance check',
          'Contract negotiation',
        ],
        preferredChannels: ['White papers', 'Case studies', 'Direct sales'],
        messagingApproach: 'Focus on security, compliance, and total cost of ownership',
      }
    ];
  }

  return basePersonas;
}

function generateGenericPersona(input: EnhancedStrategyInput, type: 'primary' | 'secondary'): Persona {
  return {
    name: type === 'primary' ? 'Primary Customer' : 'Secondary Customer',
    demographics: `${input.targetAudience}. Operating in ${input.geographicScope.toLowerCase()} market with ${input.brandPositioning.toLowerCase()} positioning.`,

    psychographics: `Seeks solutions that align with ${input.marketingObjectives.join(', ').toLowerCase()} objectives. Values ${input.brandPositioning === 'PREMIUM' ? 'quality and exclusivity' : input.brandPositioning === 'VALUE' ? 'affordability and reliability' : input.brandPositioning === 'INNOVATIVE' ? 'innovation and uniqueness' : 'trust and consistency'}.`,

    painPoints: input.currentChallenges?.map(c => c.toLowerCase().replace(/_/g, ' ')) || [
      'Finding the right solution for their needs',
      'Uncertainty about product/service quality',
      'Limited time for research and evaluation',
    ],

    goals: [
      `Achieve ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} improvements`,
      'Find reliable and trustworthy solutions',
      'Make confident purchasing decisions',
      'Get good value for investment',
    ],

    buyingJourney: [
      'Awareness: Discovers through various marketing channels',
      'Research: Evaluates options and gathers information',
      'Consideration: Compares alternatives and seeks validation',
      'Decision: Makes purchase based on value proposition',
      'Post-Purchase: Evaluates satisfaction and considers advocacy',
    ],

    preferredChannels: input.preferredChannels || [
      'Online search',
      'Social media',
      'Email marketing',
      'Content marketing',
    ],

    messagingApproach: `Focus on ${input.brandPositioning.toLowerCase()} positioning and ${input.primaryKPI.toLowerCase().replace(/_/g, ' ')} outcomes. Address key pain points and demonstrate clear value proposition.`,
  };
}

