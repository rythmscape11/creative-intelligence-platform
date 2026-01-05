import { StrategyInput } from '@/lib/validations/strategy';
import { EnterpriseStrategyPlan } from '@/types';
import { OpenAIStrategyService } from './openai-client';

interface ProcessingOptions {
  useAI?: boolean;
  fallbackToRules?: boolean;
}

interface StrategyOutput {
  executiveSummary: string;
  targetAudience: Array<{
    name: string;
    demographics: string;
    psychographics: string;
    painPoints: string[];
    preferredChannels: string[];
  }>;
  marketingChannels: Array<{
    name: string;
    description: string;
    budgetAllocation: number;
    expectedROI: string;
    tactics: string[];
    timeline: string;
  }>;
  contentStrategy: {
    themes: string[];
    contentTypes: Array<{
      type: string;
      description: string;
      frequency: string;
      platforms: string[];
    }>;
    frequency: string;
    distribution: string[];
  };
  timeline: Array<{
    phase: string;
    duration: string;
    activities: string[];
    deliverables: string[];
  }>;
  budget: {
    total: number;
    channels: Array<{
      channel: string;
      amount: number;
      percentage: number;
    }>;
    contingency: number;
  };
  kpis: Array<{
    metric: string;
    target: string;
    measurement: string;
    frequency: string;
  }>;
  recommendations: string[];
  enterprisePlan: EnterpriseStrategyPlan;
}

export class StrategyProcessor {
  /**
   * Process strategy input and generate comprehensive marketing strategy
   */
  static async processStrategy(
    input: StrategyInput,
    userId: string,
    options: ProcessingOptions = { useAI: true, fallbackToRules: true }
  ): Promise<{ output: StrategyOutput; generatedBy: 'AI' | 'FALLBACK' }> {
    try {
      // Try AI processing first if enabled
      if (options.useAI) {
        try {
          console.log('🤖 Generating strategy using OpenAI...');
          const aiOutput = await OpenAIStrategyService.generateStrategy(input, userId);
          const normalizedOutput: StrategyOutput = {
            ...aiOutput,
            enterprisePlan: aiOutput.enterprisePlan || this.buildEnterprisePlan(input),
          };
          console.log('✅ AI strategy generation successful');
          return {
            output: normalizedOutput,
            generatedBy: 'AI',
          };
        } catch (aiError) {
          console.error('❌ AI strategy generation failed:', aiError);

          if (!options.fallbackToRules) {
            throw aiError;
          }

          console.log('🔄 Falling back to rules-based generation...');
        }
      }

      // Use rules-based generation as fallback
      console.log('⚙️ Generating strategy using rules engine...');
      const output = this.generateWithRules(input);
      console.log('✅ Rules-based strategy generation successful');
      return {
        output,
        generatedBy: 'FALLBACK',
      };
    } catch (error) {
      console.error('Strategy processing error:', error);

      if (options.fallbackToRules) {
        const output = this.generateWithRules(input);
        return {
          output,
          generatedBy: 'FALLBACK',
        };
      }

      throw error;
    }
  }

  /**
   * Rules-based strategy generation
   */
  private static generateWithRules(input: StrategyInput): StrategyOutput {
    const budgetDistribution = this.calculateBudgetDistribution(input);
    const channels = this.selectMarketingChannels(input, budgetDistribution);
    const timeline = this.generateTimeline(input);
    const kpis = this.generateKPIs(input);
    const recommendations = this.generateRecommendations(input);

    return {
      executiveSummary: this.generateExecutiveSummary(input),
      targetAudience: this.analyzeTargetAudience(input),
      marketingChannels: channels,
      contentStrategy: this.generateContentStrategy(input),
      timeline,
      budget: {
        total: input.budget,
        channels: budgetDistribution,
        contingency: Math.round(input.budget * 0.1),
      },
      kpis,
      recommendations,
      enterprisePlan: this.buildEnterprisePlan(input),
    };
  }

  /**
   * Generate executive summary
   */
  private static generateExecutiveSummary(input: StrategyInput): string {
    const timeframeText = input.timeframe.replace('-', ' ');
    const objectivesText = input.objectives.slice(0, 3).join(', ');

    return `This comprehensive marketing strategy for ${input.businessName} focuses on ${objectivesText} over a ${timeframeText} period. With a budget of ${this.formatCurrency(input.budget)}, the strategy leverages digital-first approaches tailored to the ${input.industry} industry. The plan addresses current challenges while building sustainable growth through targeted audience engagement and measurable outcomes.`;
  }

  /**
   * Analyze target audience
   */
  private static analyzeTargetAudience(input: StrategyInput): StrategyOutput['targetAudience'] {
    return [
      {
        name: 'Primary Audience',
        demographics: input.targetAudience,
        psychographics: this.generatePsychographics(input),
        painPoints: this.extractPainPoints(input),
        preferredChannels: this.getPreferredChannels(input),
      },
    ];
  }

  /**
   * Calculate budget distribution across channels
   */
  private static calculateBudgetDistribution(input: StrategyInput): Array<{
    channel: string;
    amount: number;
    percentage: number;
  }> {
    const distributions = this.getBudgetDistributionByIndustry(input.industry);
    // Reserve 10% for contingency, distribute 90% across channels
    const availableBudget = input.budget * 0.9;

    return distributions.map(dist => ({
      channel: dist.channel,
      amount: Math.round(availableBudget * dist.percentage),
      percentage: Math.round(dist.percentage * 100),
    }));
  }

  /**
   * Select appropriate marketing channels
   */
  private static selectMarketingChannels(
    input: StrategyInput,
    budgetDistribution: Array<{ channel: string; amount: number; percentage: number }>
  ): StrategyOutput['marketingChannels'] {
    const channelTemplates = this.getChannelTemplates(input.industry);

    return budgetDistribution.map(budget => {
      const template = channelTemplates[budget.channel] || channelTemplates['Digital Marketing'];

      return {
        name: budget.channel,
        description: template.description,
        budgetAllocation: budget.amount,
        expectedROI: template.expectedROI,
        tactics: template.tactics,
        timeline: input.timeframe,
      };
    });
  }

  /**
   * Generate content strategy
   */
  private static generateContentStrategy(input: StrategyInput): StrategyOutput['contentStrategy'] {
    const themes = this.getContentThemes(input);
    const contentTypes = this.getContentTypes(input);

    return {
      themes,
      contentTypes,
      frequency: this.getContentFrequency(input.budget),
      distribution: ['Website', 'Social Media', 'Email', 'Blog'],
    };
  }

  /**
   * Generate project timeline
   */
  private static generateTimeline(input: StrategyInput): StrategyOutput['timeline'] {
    const phases = this.getTimelinePhases(input.timeframe);

    return phases.map((phase, index) => ({
      phase: `Phase ${index + 1}: ${phase.name}`,
      duration: phase.duration,
      activities: phase.activities,
      deliverables: phase.deliverables,
    }));
  }

  /**
   * Generate KPIs based on objectives
   */
  private static generateKPIs(input: StrategyInput): StrategyOutput['kpis'] {
    const kpiTemplates = this.getKPITemplates();

    return input.objectives.slice(0, 5).map(objective => {
      const template = kpiTemplates[objective] || kpiTemplates['default'];

      return {
        metric: template.metric,
        target: this.calculateTarget(template.target, input.budget),
        measurement: template.measurement,
        frequency: template.frequency,
      };
    });
  }

  /**
   * Generate strategic recommendations
   */
  private static generateRecommendations(input: StrategyInput): string[] {
    const baseRecommendations = [
      'Implement comprehensive analytics tracking from day one',
      'Focus on high-ROI digital channels for maximum impact',
      'Create a consistent content calendar and publishing schedule',
      'Establish clear KPIs and review performance monthly',
      'Build an email list as a owned media asset',
    ];

    const industryRecommendations = this.getIndustryRecommendations(input.industry);
    const budgetRecommendations = this.getBudgetRecommendations(input.budget);

    return [...baseRecommendations, ...industryRecommendations, ...budgetRecommendations].slice(0, 8);
  }

  private static buildEnterprisePlan(input: StrategyInput): EnterpriseStrategyPlan {
    const regions = [
      'North America',
      'Europe',
      'Asia-Pacific',
      'Latin America',
      'Middle East & Africa',
    ];

    const regionDetails = regions.map((region, index) => ({
      region,
      marketMaturity:
        index === 0
          ? 'Highly mature market with sophisticated enterprise buyers and entrenched competitors.'
          : index === 1
            ? 'Diverse regulatory environment with high expectations for localization and sustainability.'
            : index === 2
              ? 'Rapidly growing digital-first buyers with fragmented platform usage.'
              : index === 3
                ? 'Mobile-first audiences with strong community influence and emerging purchasing power.'
                : 'High-growth markets shaped by government investment, mobile penetration, and localized platforms.',
      competitiveIntensity:
        index === 0
          ? 'Hyper-competitive; requires differentiated value narrative and ABM precision.'
          : 'Regional specialists and global players compete aggressively on service, compliance, and ecosystem depth.',
      customerBehavior:
        index === 2
          ? 'Buyers conduct extensive research via local super-apps, messaging platforms, and community reviews.'
          : 'Decision makers expect localized proof points, pricing, and in-language enablement.',
      opportunities: [
        `Position ${input.businessName} as a trusted innovation partner for ${input.industry} leaders in ${region}.`,
        'Leverage global IP and adapt it with local proof points, compliance assurances, and partner ecosystems.',
      ],
      risks: [
        'Privacy and procurement regulations that can delay or derail programs.',
        'Platform fragmentation increasing campaign complexity and costs.',
      ],
    }));

    const globalSegments = [
      {
        name: 'Enterprise Transformation Leaders',
        description: `C-level and VP stakeholders modernizing ${input.industry} capabilities across multiple regions.`,
        preferredChannels: ['Executive councils', 'Analyst content', 'LinkedIn thought leadership'],
      },
      {
        name: 'Regional Growth Teams',
        description: 'Country or business unit leads accountable for double-digit growth and localization.',
        preferredChannels: ['Localized events', 'Regional paid social/search', 'Partner ecosystems'],
      },
      {
        name: 'Innovation Pods & Emerging Units',
        description: 'Cross-functional teams piloting new offerings before global rollout.',
        preferredChannels: ['Webinars', 'Communities', 'Influencer or partner collaborations'],
      },
    ];

    return {
      executiveSummary: {
        overview: `This enterprise strategy equips ${input.businessName} to scale ${input.industry} growth globally while aligning with objectives such as ${input.objectives
          .slice(0, 3)
          .join(', ')}.`,
        globalPriorities: [
          'Balance centralized strategy with regional agility.',
          'Use integrated lifecycle plays that reuse insights across channels.',
          'Institutionalize experimentation and governance to reduce risk.',
        ],
        investmentRationale: [
          'Tie budgets directly to revenue, market share, CLV, and profitability goals.',
          'Enable reusable campaign kits that local teams can adapt quickly.',
          'Build visibility into ROI, compliance posture, and resource utilization.',
        ],
        expectedImpact: [
          'Higher pipeline velocity in strategic accounts.',
          'Consistent customer experience across touchpoints and regions.',
          'Improved transparency for reallocating budget toward high performers.',
        ],
        globalRisks: [
          'Approval bottlenecks across regions — mitigate with a clear RACI and review cadence.',
          'Data privacy/regulatory changes — mitigate with privacy-by-design stack and local legal allies.',
          'Regional resourcing gaps — mitigate through shared services and partner ecosystems.',
        ],
      },
      marketOverview: {
        globalSnapshot: `Global demand for ${input.industry} solutions is accelerating as enterprises digitize operations, prioritize efficiency, and expect measurable ROI.`,
        keyTrends: [
          'Convergence of brand, demand, and customer marketing under revenue mandates.',
          'Heightened scrutiny on profitability, CAC efficiency, and lifecycle retention.',
          'Need for localized storytelling that respects cultural nuance without fragmenting brand trust.',
        ],
        regions: regionDetails,
      },
      segmentationAndUseCases: {
        globalSegments: globalSegments.map((segment) => ({
          name: segment.name,
          description: segment.description,
          regionalNotes: [
            'Local language content and platform preferences vary by region.',
            'Proof points and compliance messages must map to local regulations.',
            'Channel mix should reflect dominant platforms (LinkedIn, Xing, WeChat, Line, WhatsApp, local publishers).',
          ],
          preferredChannels: segment.preferredChannels,
        })),
        regionalAdaptations: regionDetails.map((region) => ({
          region: region.region,
          adaptations: [
            'Translate anchor content and emphasize locally relevant case studies.',
            'Empower regional partners and influencers to provide social proof.',
            'Align campaign timing to fiscal calendars, holidays, and major industry events.',
          ],
        })),
        useCases: globalSegments.map((segment) => ({
          segment: segment.name,
          scenarios: [
            'Global consolidation or modernization of fragmented solutions.',
            'Launch of new offerings requiring localized enablement and proof.',
            'Innovation pilots that need structured experimentation before scaling.',
          ],
        })),
      },
      objectivesAndKPIs: [
        {
          businessGoal: 'Revenue Growth',
          marketingObjective: 'Accelerate enterprise pipeline within priority accounts and verticals.',
          primaryKPIs: ['Marketing-sourced pipeline', 'Win rate', 'Average deal size'],
          secondaryKPIs: ['Share of voice', 'Executive engagement depth'],
          leadingIndicators: ['Account engagement scores', 'Event/webinar participation', 'Digital intent signals'],
          laggingIndicators: ['ARR/ACV', 'Contribution margin', 'Payback period'],
        },
        {
          businessGoal: 'Market Share Expansion',
          marketingObjective: 'Drive regional penetration with localized plays and partner activation.',
          primaryKPIs: ['Regional pipeline', 'Influenced revenue', 'Partner-sourced pipeline'],
          secondaryKPIs: ['New market launches', 'PR/earned coverage'],
          leadingIndicators: ['Localized traffic', 'Community or social engagement', 'Partner enablement completion'],
          laggingIndicators: ['Territory bookings', 'Channel ROI'],
        },
        {
          businessGoal: 'Customer Lifetime Value',
          marketingObjective: 'Boost retention and expansion via lifecycle orchestration.',
          primaryKPIs: ['Net revenue retention', 'Upsell/cross-sell pipeline'],
          secondaryKPIs: ['Customer advocacy index', 'Product adoption rate'],
          leadingIndicators: ['Engagement with enablement programs', 'Health score trend'],
          laggingIndicators: ['LTV/CAC', 'Gross margin'],
        },
      ],
      governanceModel: {
        executiveSponsors: ['Chief Marketing Officer', 'Chief Revenue Officer', 'Regional Presidents'],
        globalMarketingLeads: ['SVP, Integrated Campaigns', 'VP, Global Demand Generation'],
        regionalLeads: [
          'Regional Marketing Director, North America',
          'Regional Marketing Director, Europe',
          'Regional Marketing Director, APAC',
        ],
        crossFunctionalPartners: ['Sales Leadership', 'Product', 'Customer Success', 'Finance', 'Legal & Compliance'],
        decisionFramework:
          'Centralize positioning, technology, and measurement while giving regions autonomy to localize messaging, media, and partner execution.',
        reviewCadence: [
          'Monthly business reviews covering performance, budget variance, and experiment readouts.',
          'Quarterly strategic reviews to reprioritize regions, rebalance budget, and scale winning plays.',
          'Campaign/post-program retrospectives within 10 business days.',
        ],
      },
      resourcingAndBudget: {
        headcountPlan: [
          { function: 'Demand Generation & ABM Center of Excellence', notes: 'Designs global plays and enablement kits.' },
          { function: 'Regional Campaign Pods', notes: 'Localize offers and manage field execution.' },
          { function: 'Marketing Operations & Analytics', notes: 'Own data, automation, attribution, and experimentation.' },
          { function: 'Content & Thought Leadership', notes: 'Produce modular content, case studies, and translations.' },
        ],
        partnerStrategy: [
          'Retain global agency partners for strategy, creative governance, and analytics accelerators.',
          'Deploy regional specialists for paid media, events, and influencer programs.',
          'Curate localization partners to keep turnaround fast and on-brand.',
        ],
        budgetModel: {
          summary: `Allocate ${this.formatCurrency(input.budget)} using a 70/20/10 approach—70% core growth plays, 20% regional accelerators, 10% experimentation.`,
          regionalAllocations: regionDetails.map((region, index) => ({
            region: region.region,
            percentage: [34, 24, 20, 12, 10][index],
            notes: 'Review quarterly and shift funds to regions exceeding contribution targets.',
          })),
          channelAllocations: [
            { channel: 'Digital Demand (Paid Search/Social, Programmatic, ABM)', percentage: 32, notes: 'Global orchestration with localized targeting and creative.' },
            { channel: 'Content & Thought Leadership', percentage: 18, notes: 'Fund translation and local proof points.' },
            { channel: 'Events, Communities, and Partners', percentage: 22, notes: 'Blend global flagships with regional roadshows.' },
            { channel: 'Lifecycle / Email / Marketing Automation', percentage: 15, notes: 'Power retention and expansion across accounts.' },
            { channel: 'Influencer/PR/Brand', percentage: 3, notes: 'Region-specific credibility builders.' },
          ],
          innovationReserve: 'Hold ~10% for experiments, pilots, and rapid-response opportunities surfaced in reviews.',
        },
      },
      technologyDataCompliance: {
        martechStack: [
          { category: 'CRM', recommendation: 'Enterprise CRM with region-specific data residency controls', purpose: 'Unified account visibility and forecasting.' },
          { category: 'Marketing Automation', recommendation: 'Global MAP supporting multilingual nurtures and lead scoring', purpose: 'Lifecycle orchestration.' },
          { category: 'Analytics & Attribution', recommendation: 'Multi-touch attribution platform feeding BI dashboards', purpose: 'Measure contribution and optimize mix.' },
          { category: 'CDP/Data Warehouse', recommendation: 'Global CDP connected to privacy-aware activation layers', purpose: 'Audience intelligence and personalization.' },
          { category: 'Consent & Privacy Management', recommendation: 'Central consent hub covering GDPR, CCPA, and equivalent local regulations', purpose: 'Manage preferences and regulatory proof.' },
        ],
        dataFlow: [
          'Capture consented data via web, events, product, and partner channels with region tagging.',
          'Sync to MAP and CRM with standardized taxonomies and privacy enforcement.',
          'Push into CDP/data warehouse for segmentation and activation back into channels.',
        ],
        complianceChecklist: [
          'Privacy: GDPR, CCPA, LGPD, PDPA, and equivalent local regulations.',
          'Channel rules: CAN-SPAM, CASL, and local SMS/WhatsApp opt-in laws.',
          'Industry-specific regulations (financial promotions, health/medical, public sector) where relevant.',
        ],
      },
      integratedChannelStrategy: {
        lifecycleNarrative: 'Coordinate Awareness → Consideration → Decision → Retention/Advocacy with data flowing across touchpoints so insights from one channel fuel the next.',
        channels: [
          {
            channel: 'SEO & Content',
            role: 'Capture global demand and position thought leadership.',
            globalTactics: ['Pillar + cluster architecture', 'Executive insight reports', 'Customer evidence libraries'],
            regionalAdaptations: ['Translate anchor assets', 'Publish with local compliance notes', 'Optimize for Baidu/Naver/Yandex where applicable'],
            keyMetrics: ['Organic pipeline', 'Share of voice', 'Content-assisted revenue'],
            timeToImpact: '3-6 months for new assets, faster for localized refreshes',
            signalReuse: ['Feed winning topics into paid/social messaging', 'Use content engagement to trigger nurtures'],
          },
          {
            channel: 'Paid Media & ABM',
            role: 'Accelerate pipeline with account-based precision.',
            globalTactics: ['Always-on paid search', 'Programmatic/LinkedIn ABM', 'Intent-triggered retargeting'],
            regionalAdaptations: ['Activate WeChat, Line, Kakao, or TikTok for Business', 'Localized offers, currencies, and cultural cues'],
            keyMetrics: ['MQAs', 'Cost per qualified opportunity', 'Pipeline velocity'],
            timeToImpact: '4-8 weeks with optimization cycles',
            signalReuse: ['Pass engagement to SDRs/sales', 'Trigger lifecycle nurtures'],
          },
          {
            channel: 'Events & Partner Ecosystem',
            role: 'Deepen trust, create co-selling motions, and enable in-region communities.',
            globalTactics: ['Flagship executive forums', 'Industry conference activations'],
            regionalAdaptations: ['Localized roadshows', 'Association partnerships', 'Influencer-led roundtables'],
            keyMetrics: ['Influenced revenue', 'Partner-sourced pipeline', 'Event engagement depth'],
            timeToImpact: 'Immediate relationship lift; pipeline influence measured over 1-3 quarters',
            signalReuse: ['Convert event content to on-demand programs', 'Feed attendee insights to account teams'],
          },
        ],
      },
      regionalPlaybooks: regionDetails.map((region) => ({
        region: region.region,
        prioritySegments: ['Tier 1 enterprise accounts', 'Regional innovators within high-growth verticals'],
        propositions: [
          `De-risk ${input.industry} transformation with ${input.businessName}'s global expertise and in-region delivery.`,
          'Compliance-ready solutions supported by multilingual experts and partners.',
        ],
        localizedTactics: [
          'Account-based field events with joint customer evidence.',
          'Localized paid social/search on dominant platforms.',
          'Partner co-marketing and reseller enablement.',
        ],
        budgetGuidance: 'Allocate based on revenue contribution and growth potential, revisited every quarter.',
        leadingKPIs: ['Regional pipeline growth', 'Account engagement depth', 'Velocity improvements'],
      })),
      measurementAndOptimization: {
        globalDashboard: ['Marketing-sourced pipeline/revenue', 'Win rates by segment/region', 'CAC & payback', 'Net revenue retention'],
        regionalDashboardGuidelines: [
          'Mirror global KPIs while adding region-specific channel efficiency metrics.',
          'Surface localization throughput, compliance readiness, and partner influence.',
        ],
        testAndLearnFramework: [
          'Define hypothesis, audience, control, variant, success metric, and timeline for every experiment.',
          'Share learnings monthly across global and regional teams.',
          'Prioritize experiments that inform reallocation decisions or capability investments.',
        ],
        reviewCadence: {
          monthly: ['Performance stand-ups per region', 'Budget vs. plan alignment', 'Experiment readouts'],
          quarterly: ['Executive business reviews', 'Budget reallocation and roadmap updates'],
        },
        reallocationGuidelines: [
          'Shift up to 15% of spend quarterly toward regions/channels exceeding targets.',
          'Pause underperforming tactics after two negative cycles unless learning potential remains high.',
          'Protect innovation reserve to pilot new plays before scaling.',
        ],
      },
      roadmap90To180: {
        quickWins90Days: [
          'Launch global-to-local campaign kits with localization guardrails.',
          'Stand up unified KPI dashboards accessible to global and regional leaders.',
          'Activate executive briefing content tailored to top segments with regional proof.',
        ],
        initiatives90To180: [
          'Deploy lifecycle nurture programs mapped to complex enterprise journeys.',
          'Implement privacy-by-design enhancements across martech stack.',
          'Scale partner co-marketing and influencer accelerators in APAC and LATAM.',
        ],
        dependencies: [
          'Dedicated program owners for each major region',
          'Shared services budget for localization, testing, and analytics',
          'Integrated CRM/MAP/CDP to power personalization and measurement',
        ],
      },
    };
  }

  // Helper methods for data generation
  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private static generatePsychographics(input: StrategyInput): string {
    const industryPsychographics: Record<string, string> = {
      'technology': 'Early adopters, value innovation and efficiency',
      'healthcare': 'Health-conscious, value trust and expertise',
      'finance': 'Security-focused, value stability and growth',
      'retail': 'Value-conscious, convenience-oriented shoppers',
      'education': 'Knowledge-seekers, value quality and outcomes',
      'default': 'Quality-focused, value-driven decision makers',
    };

    return industryPsychographics[input.industry] || industryPsychographics['default'];
  }

  private static extractPainPoints(input: StrategyInput): string[] {
    // Extract pain points from current challenges
    const challenges = input.currentChallenges.toLowerCase();
    const commonPainPoints = [
      'Limited brand awareness',
      'High customer acquisition costs',
      'Low conversion rates',
      'Inconsistent messaging',
      'Limited online presence',
    ];

    return commonPainPoints.slice(0, 3);
  }

  private static getPreferredChannels(input: StrategyInput): string[] {
    const industryChannels: Record<string, string[]> = {
      'technology': ['LinkedIn', 'Google Ads', 'Content Marketing', 'Webinars'],
      'healthcare': ['Google Ads', 'Content Marketing', 'Email', 'Referrals'],
      'retail': ['Social Media', 'Google Ads', 'Email', 'Influencer Marketing'],
      'default': ['Social Media', 'Google Ads', 'Email', 'Content Marketing'],
    };

    return industryChannels[input.industry] || industryChannels['default'];
  }

  private static getBudgetDistributionByIndustry(industry: string): Array<{ channel: string; percentage: number }> {
    const distributions: Record<string, Array<{ channel: string; percentage: number }>> = {
      'technology': [
        { channel: 'Digital Marketing', percentage: 0.5 },
        { channel: 'Content Marketing', percentage: 0.25 },
        { channel: 'Events & Webinars', percentage: 0.15 },
        { channel: 'Traditional Marketing', percentage: 0.1 },
      ],
      'retail': [
        { channel: 'Digital Marketing', percentage: 0.4 },
        { channel: 'Social Media Marketing', percentage: 0.3 },
        { channel: 'Traditional Marketing', percentage: 0.2 },
        { channel: 'Influencer Marketing', percentage: 0.1 },
      ],
      'default': [
        { channel: 'Digital Marketing', percentage: 0.6 },
        { channel: 'Traditional Marketing', percentage: 0.3 },
        { channel: 'Content Marketing', percentage: 0.1 },
      ],
    };

    return distributions[industry] || distributions['default'];
  }

  private static getChannelTemplates(industry: string): Record<string, any> {
    return {
      'Digital Marketing': {
        description: 'Online marketing channels including SEO, PPC, and social media',
        expectedROI: '200-400%',
        tactics: ['SEO', 'Google Ads', 'Facebook Ads', 'Email Marketing'],
      },
      'Content Marketing': {
        description: 'Educational and engaging content to attract and retain customers',
        expectedROI: '300-500%',
        tactics: ['Blog Posts', 'Videos', 'Whitepapers', 'Case Studies'],
      },
      'Social Media Marketing': {
        description: 'Engaging with audiences across social media platforms',
        expectedROI: '150-300%',
        tactics: ['Organic Posts', 'Paid Ads', 'Influencer Partnerships', 'Community Building'],
      },
      'Traditional Marketing': {
        description: 'Offline marketing channels and traditional advertising',
        expectedROI: '100-200%',
        tactics: ['Print Ads', 'Radio', 'Direct Mail', 'Outdoor Advertising'],
      },
    };
  }

  private static getContentThemes(input: StrategyInput): string[] {
    const themes = ['Brand Awareness', 'Lead Generation', 'Customer Education', 'Industry Expertise'];
    return themes.slice(0, 3);
  }

  private static getContentTypes(input: StrategyInput): StrategyOutput['contentStrategy']['contentTypes'] {
    return [
      {
        type: 'Blog Posts',
        description: 'Educational and informative articles',
        frequency: 'Weekly',
        platforms: ['Website', 'LinkedIn'],
      },
      {
        type: 'Social Media Posts',
        description: 'Engaging social content',
        frequency: 'Daily',
        platforms: ['Facebook', 'Instagram', 'LinkedIn'],
      },
    ];
  }

  private static getContentFrequency(budget: number): string {
    if (budget >= 50000) return 'Daily';
    if (budget >= 20000) return 'Weekly';
    return 'Bi-weekly';
  }

  private static getTimelinePhases(timeframe: string): Array<{ name: string; duration: string; activities: string[]; deliverables: string[] }> {
    const isLongTerm = timeframe.includes('12') || timeframe.includes('18') || timeframe.includes('24');

    if (isLongTerm) {
      return [
        {
          name: 'Foundation',
          duration: '1-2 months',
          activities: ['Setup analytics', 'Create brand guidelines', 'Build content calendar'],
          deliverables: ['Analytics dashboard', 'Brand guide', 'Content plan'],
        },
        {
          name: 'Launch',
          duration: '2-4 months',
          activities: ['Launch campaigns', 'Create content', 'Monitor performance'],
          deliverables: ['Campaign launches', 'Content library', 'Performance reports'],
        },
        {
          name: 'Optimization',
          duration: 'Ongoing',
          activities: ['Optimize campaigns', 'Scale successful tactics', 'Test new channels'],
          deliverables: ['Optimized campaigns', 'Scaling plan', 'Test results'],
        },
      ];
    }

    return [
      {
        name: 'Setup & Launch',
        duration: '2-4 weeks',
        activities: ['Setup tracking', 'Launch initial campaigns', 'Create content'],
        deliverables: ['Analytics setup', 'Campaign launches', 'Initial content'],
      },
      {
        name: 'Execution & Optimization',
        duration: 'Ongoing',
        activities: ['Monitor performance', 'Optimize campaigns', 'Create content'],
        deliverables: ['Performance reports', 'Optimized campaigns', 'Content library'],
      },
    ];
  }

  private static getKPITemplates(): Record<string, any> {
    return {
      'Increase brand awareness': {
        metric: 'Brand Awareness',
        target: '50% increase',
        measurement: 'Brand surveys and social mentions',
        frequency: 'Quarterly',
      },
      'Generate more leads': {
        metric: 'Lead Generation',
        target: '100 leads/month',
        measurement: 'CRM tracking',
        frequency: 'Monthly',
      },
      'Boost sales revenue': {
        metric: 'Revenue Growth',
        target: '25% increase',
        measurement: 'Sales tracking',
        frequency: 'Monthly',
      },
      'default': {
        metric: 'Website Traffic',
        target: '50% increase',
        measurement: 'Google Analytics',
        frequency: 'Monthly',
      },
    };
  }

  private static calculateTarget(baseTarget: string, budget: number): string {
    // Adjust targets based on budget
    if (budget >= 100000) {
      return baseTarget.replace(/\d+/, (match) => String(parseInt(match) * 2));
    }
    return baseTarget;
  }

  private static getIndustryRecommendations(industry: string): string[] {
    const recommendations: Record<string, string[]> = {
      'technology': [
        'Leverage thought leadership content to build credibility',
        'Focus on LinkedIn for B2B lead generation',
      ],
      'retail': [
        'Implement retargeting campaigns for abandoned carts',
        'Use user-generated content for social proof',
      ],
      'healthcare': [
        'Ensure all marketing complies with HIPAA regulations',
        'Focus on educational content to build trust',
      ],
      'default': [
        'Test different messaging approaches with A/B testing',
        'Build partnerships with complementary businesses',
      ],
    };

    return recommendations[industry] || recommendations['default'];
  }

  private static getBudgetRecommendations(budget: number): string[] {
    if (budget >= 100000) {
      return [
        'Consider hiring a dedicated marketing team or agency',
        'Invest in marketing automation tools',
      ];
    } else if (budget >= 20000) {
      return [
        'Focus on 2-3 high-impact channels rather than spreading thin',
        'Invest in quality content creation',
      ];
    } else {
      return [
        'Start with organic social media and content marketing',
        'Focus on email marketing for direct customer communication',
      ];
    }
  }
}
