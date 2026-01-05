import { EnhancedStrategyInput } from '../../validations/enhanced-strategy';

/**
 * Marketing Objectives & KPIs Generator
 * Creates SMART goals with specific metrics and targets
 */

interface ObjectiveKPI {
  objective: string;
  smartGoal: string;
  primaryMetrics: string[];
  targetValues: string[];
  measurementMethod: string;
  timeline: string;
}

export function generateMarketingObjectivesAndKPIs(input: EnhancedStrategyInput, isPaid: boolean = false): ObjectiveKPI[] {
  const objectives: ObjectiveKPI[] = [];

  // Generate KPIs for each marketing objective
  input.marketingObjectives.forEach(objective => {
    objectives.push(generateObjectiveKPI(objective, input, isPaid));
  });

  // Ensure primary KPI is included
  if (!input.marketingObjectives.some(obj => obj.includes(input.primaryKPI))) {
    objectives.unshift(generatePrimaryKPI(input, isPaid));
  }

  return objectives;
}

function generatePrimaryKPI(input: EnhancedStrategyInput, isPaid: boolean): ObjectiveKPI {
  const timeframeMonths = getTimeframeMonths(input.timeframe);

  const kpiMap: Record<string, ObjectiveKPI> = {
    REVENUE: {
      objective: 'Revenue Growth',
      smartGoal: `Increase revenue by ${input.companyStage === 'STARTUP' ? '100-200%' : input.companyStage === 'GROWTH' ? '50-100%' : '20-40%'} within ${timeframeMonths} months through marketing-driven customer acquisition and retention.`,
      primaryMetrics: ['Monthly Recurring Revenue (MRR)', 'Total Revenue', 'Revenue Growth Rate', 'Marketing-Attributed Revenue'],
      targetValues: [
        `$${Math.round(input.budget * 3).toLocaleString()} in marketing-attributed revenue`,
        `${input.companyStage === 'STARTUP' ? '150%' : input.companyStage === 'GROWTH' ? '75%' : '30%'} revenue growth`,
        '3:1 minimum marketing ROI',
      ],
      measurementMethod: 'Track revenue attribution through CRM and analytics platforms. Use multi-touch attribution model to credit marketing touchpoints. Monthly revenue reporting with year-over-year comparisons.',
      timeline: `${timeframeMonths} months with monthly milestones`,
    },

    LEADS: {
      objective: 'Lead Generation',
      smartGoal: `Generate ${input.businessType === 'B2B' ? '500-1000' : '2000-5000'} qualified leads within ${timeframeMonths} months with a lead-to-customer conversion rate of ${input.businessType === 'B2B' ? '10-15%' : '2-5%'}.`,
      primaryMetrics: ['Marketing Qualified Leads (MQLs)', 'Sales Qualified Leads (SQLs)', 'Lead-to-Customer Conversion Rate', 'Cost Per Lead'],
      targetValues: [
        `${input.businessType === 'B2B' ? '750' : '3500'} MQLs`,
        `${input.businessType === 'B2B' ? '300' : '1000'} SQLs`,
        `$${input.businessType === 'B2B' ? '50-100' : '10-25'} cost per lead`,
        `${input.businessType === 'B2B' ? '12%' : '3%'} conversion rate`,
      ],
      measurementMethod: 'Implement lead scoring system in CRM. Track lead source, quality, and conversion through sales funnel. Weekly lead generation reports and monthly quality audits.',
      timeline: `${timeframeMonths} months with weekly tracking`,
    },

    TRAFFIC: {
      objective: 'Website Traffic Growth',
      smartGoal: `Increase website traffic by 100-200% within ${timeframeMonths} months, reaching ${input.budget < 50000 ? '50,000' : input.budget < 200000 ? '200,000' : '500,000'}+ monthly visitors with 40%+ from organic sources.`,
      primaryMetrics: ['Total Website Visitors', 'Organic Traffic', 'Direct Traffic', 'Referral Traffic', 'Bounce Rate', 'Pages Per Session'],
      targetValues: [
        `${input.budget < 50000 ? '50,000' : input.budget < 200000 ? '200,000' : '500,000'}+ monthly visitors`,
        '150% traffic growth',
        '40%+ organic traffic share',
        'Bounce rate below 50%',
        '3+ pages per session',
      ],
      measurementMethod: 'Google Analytics 4 tracking with custom dashboards. UTM parameter tracking for all campaigns. Monthly traffic analysis with channel breakdown and user behavior insights.',
      timeline: `${timeframeMonths} months with monthly milestones`,
    },

    ENGAGEMENT: {
      objective: 'Customer Engagement',
      smartGoal: `Increase customer engagement by 100% within ${timeframeMonths} months across all digital touchpoints, achieving 5%+ engagement rate on social media and 25%+ email open rates.`,
      primaryMetrics: ['Social Media Engagement Rate', 'Email Open Rate', 'Email Click Rate', 'Time on Site', 'Return Visitor Rate'],
      targetValues: [
        '5%+ social media engagement rate',
        '25%+ email open rate',
        '3%+ email click rate',
        '3+ minutes average time on site',
        '40%+ return visitor rate',
      ],
      measurementMethod: 'Social media analytics platforms, email marketing platform metrics, Google Analytics engagement metrics. Weekly engagement reports and monthly trend analysis.',
      timeline: `${timeframeMonths} months with bi-weekly tracking`,
    },

    BRAND_METRICS: {
      objective: 'Brand Awareness & Recognition',
      smartGoal: `Increase brand awareness by 150% within ${timeframeMonths} months, achieving ${input.geographicScope === 'GLOBAL' ? '1M+' : input.geographicScope === 'NATIONAL' ? '500K+' : '100K+'} brand impressions monthly and 40%+ aided brand recall in target market.`,
      primaryMetrics: ['Brand Impressions', 'Share of Voice', 'Brand Recall', 'Brand Search Volume', 'Social Media Mentions'],
      targetValues: [
        `${input.geographicScope === 'GLOBAL' ? '1M+' : input.geographicScope === 'NATIONAL' ? '500K+' : '100K+'} monthly impressions`,
        '20%+ share of voice in industry',
        '40%+ aided brand recall',
        '100%+ increase in branded search volume',
      ],
      measurementMethod: 'Brand tracking surveys (quarterly), social listening tools, search volume analysis, media monitoring. Quarterly brand health reports.',
      timeline: `${timeframeMonths} months with quarterly surveys`,
    },

    CLV: {
      objective: 'Customer Lifetime Value Optimization',
      smartGoal: `Increase customer lifetime value by 50% within ${timeframeMonths} months through improved retention, upselling, and cross-selling strategies.`,
      primaryMetrics: ['Customer Lifetime Value (CLV)', 'Customer Retention Rate', 'Repeat Purchase Rate', 'Average Order Value', 'Churn Rate'],
      targetValues: [
        '50% increase in CLV',
        '80%+ retention rate',
        '40%+ repeat purchase rate',
        '25% increase in average order value',
        'Churn rate below 5% monthly',
      ],
      measurementMethod: 'CRM analytics, cohort analysis, customer segmentation. Monthly CLV calculations and retention analysis. Quarterly customer health scoring.',
      timeline: `${timeframeMonths} months with monthly cohort tracking`,
    },

    CUSTOMERS: {
      objective: 'Customer Acquisition',
      smartGoal: `Acquire ${input.businessType === 'B2B' ? '100-200' : '1000-2000'} new customers within ${timeframeMonths} months with a customer acquisition cost (CAC) of $${input.businessType === 'B2B' ? '500-1000' : '50-100'}.`,
      primaryMetrics: ['New Customers Acquired', 'Customer Acquisition Cost (CAC)', 'CAC Payback Period', 'Customer Acquisition Rate'],
      targetValues: [
        `${input.businessType === 'B2B' ? '150' : '1500'} new customers`,
        `$${input.businessType === 'B2B' ? '750' : '75'} average CAC`,
        '6 months CAC payback period',
        '3:1 LTV:CAC ratio',
      ],
      measurementMethod: 'CRM tracking, marketing attribution, customer acquisition funnel analysis. Monthly customer acquisition reports with cohort analysis.',
      timeline: `${timeframeMonths} months with monthly tracking`,
    },
  };

  const kpi = kpiMap[input.primaryKPI] || kpiMap.REVENUE;

  if (isPaid) {
    return {
      ...kpi,
      primaryMetrics: [...kpi.primaryMetrics, 'Net Promoter Score (NPS)', 'Customer Effort Score (CES)'],
      targetValues: [...kpi.targetValues, 'NPS > 50', 'CES < 2.5'],
      measurementMethod: `${kpi.measurementMethod} Automated real-time dashboards with anomaly detection.`,
    };
  }

  return kpi;
}

function generateObjectiveKPI(objective: string, input: EnhancedStrategyInput, isPaid: boolean): ObjectiveKPI {
  const timeframeMonths = getTimeframeMonths(input.timeframe);

  const objectiveMap: Record<string, ObjectiveKPI> = {
    BRAND_AWARENESS: {
      objective: 'Brand Awareness',
      smartGoal: `Increase brand awareness by 150% within ${timeframeMonths} months through multi-channel campaigns, achieving ${input.geographicScope === 'GLOBAL' ? '1M+' : '500K+'} monthly impressions.`,
      primaryMetrics: ['Brand Impressions', 'Reach', 'Share of Voice', 'Branded Search Volume'],
      targetValues: ['150% increase in brand awareness', '1M+ monthly impressions', '20% share of voice'],
      measurementMethod: 'Brand tracking surveys, social listening, search volume analysis',
      timeline: `${timeframeMonths} months`,
    },

    LEAD_GENERATION: {
      objective: 'Lead Generation',
      smartGoal: `Generate ${input.businessType === 'B2B' ? '750' : '3500'} qualified leads within ${timeframeMonths} months with cost per lead below $${input.businessType === 'B2B' ? '75' : '20'}.`,
      primaryMetrics: ['MQLs', 'SQLs', 'Cost Per Lead', 'Lead Quality Score'],
      targetValues: [`${input.businessType === 'B2B' ? '750' : '3500'} MQLs`, `$${input.businessType === 'B2B' ? '75' : '20'} CPL`],
      measurementMethod: 'CRM tracking, lead scoring, conversion analysis',
      timeline: `${timeframeMonths} months`,
    },

    CUSTOMER_ACQUISITION: {
      objective: 'Customer Acquisition',
      smartGoal: `Acquire ${input.businessType === 'B2B' ? '100-200' : '1000-2000'} new customers within ${timeframeMonths} months with CAC below $${input.businessType === 'B2B' ? '500' : '100'}.`,
      primaryMetrics: ['New Customers', 'Customer Acquisition Cost (CAC)', 'Conversion Rate', 'CAC Payback Period'],
      targetValues: [`${input.businessType === 'B2B' ? '150' : '1500'} new customers`, `$${input.businessType === 'B2B' ? '500' : '100'} CAC`, '3:1 LTV:CAC ratio'],
      measurementMethod: 'Sales data, marketing attribution, cohort analysis',
      timeline: `${timeframeMonths} months`,
    },

    CUSTOMER_RETENTION: {
      objective: 'Customer Retention',
      smartGoal: `Achieve 85%+ customer retention rate within ${timeframeMonths} months and reduce churn by 50%.`,
      primaryMetrics: ['Retention Rate', 'Churn Rate', 'Net Promoter Score (NPS)', 'Customer Satisfaction (CSAT)'],
      targetValues: ['85%+ retention rate', 'Churn below 5%', 'NPS of 50+', 'CSAT of 4.5+/5'],
      measurementMethod: 'Customer surveys, usage analytics, churn analysis',
      timeline: `${timeframeMonths} months`,
    },

    REVENUE_GROWTH: {
      objective: 'Revenue Growth',
      smartGoal: `Increase marketing-attributed revenue by ${input.companyStage === 'STARTUP' ? '150%' : '50%'} within ${timeframeMonths} months.`,
      primaryMetrics: ['Marketing-Attributed Revenue', 'Revenue Growth Rate', 'Marketing ROI'],
      targetValues: [`${input.companyStage === 'STARTUP' ? '150%' : '50%'} revenue growth`, '3:1 marketing ROI'],
      measurementMethod: 'Revenue attribution, CRM analytics, financial reporting',
      timeline: `${timeframeMonths} months`,
    },

    MARKET_SHARE: {
      objective: 'Market Share Growth',
      smartGoal: `Capture ${input.competitiveLandscape === 'BLUE_OCEAN' ? '30%' : '10%'} market share within ${timeframeMonths} months.`,
      primaryMetrics: ['Market Share %', 'Competitive Win Rate', 'Share of Voice'],
      targetValues: [`${input.competitiveLandscape === 'BLUE_OCEAN' ? '30%' : '10%'} market share`, '60% win rate'],
      measurementMethod: 'Market research, competitive analysis, sales data',
      timeline: `${timeframeMonths} months`,
    },

    PRODUCT_LAUNCH: {
      objective: 'Successful Product Launch',
      smartGoal: `Launch product to ${input.geographicScope === 'GLOBAL' ? '100,000+' : '50,000+'} target customers within ${Math.min(timeframeMonths, 6)} months with 20%+ adoption rate.`,
      primaryMetrics: ['Launch Reach', 'Adoption Rate', 'Product Awareness', 'Early Customer Satisfaction'],
      targetValues: [`${input.geographicScope === 'GLOBAL' ? '100,000+' : '50,000+'} reach`, '20% adoption rate', '80% awareness in target segment'],
      measurementMethod: 'Launch metrics tracking, surveys, sales data',
      timeline: `${Math.min(timeframeMonths, 6)} months`,
    },

    MARKET_EXPANSION: {
      objective: 'Market Expansion',
      smartGoal: `Successfully expand into ${input.geographicScope === 'GLOBAL' ? '3-5 new international markets' : input.geographicScope === 'NATIONAL' ? '5-10 new regions' : '2-3 new territories'} within ${timeframeMonths} months, achieving ${input.businessType === 'B2B' ? '50+' : '500+'} customers in new markets.`,
      primaryMetrics: ['New Market Penetration', 'Market Entry Success Rate', 'New Market Revenue', 'Customer Acquisition in New Markets'],
      targetValues: [`${input.geographicScope === 'GLOBAL' ? '4' : input.geographicScope === 'NATIONAL' ? '7' : '3'} new markets entered`, `${input.businessType === 'B2B' ? '50+' : '500+'} new market customers`, '20%+ of revenue from new markets'],
      measurementMethod: 'Market entry tracking, regional sales data, customer acquisition by geography, market penetration analysis',
      timeline: `${timeframeMonths} months`,
    },

    CUSTOMER_ENGAGEMENT: {
      objective: 'Customer Engagement',
      smartGoal: `Increase customer engagement by 100% within ${timeframeMonths} months across all touchpoints.`,
      primaryMetrics: ['Engagement Rate', 'Active Users', 'Time on Site', 'Interaction Frequency'],
      targetValues: ['100% engagement increase', '5%+ social engagement rate', '3+ min time on site'],
      measurementMethod: 'Analytics platforms, engagement tracking, user behavior analysis',
      timeline: `${timeframeMonths} months`,
    },

    THOUGHT_LEADERSHIP: {
      objective: 'Thought Leadership',
      smartGoal: `Establish ${input.businessName} as top 3 thought leader in ${input.industry} within ${timeframeMonths} months through content and speaking engagements.`,
      primaryMetrics: ['Content Reach', 'Speaking Engagements', 'Media Mentions', 'Industry Recognition'],
      targetValues: ['500K+ content reach', '10+ speaking engagements', '50+ media mentions', 'Top 3 industry ranking'],
      measurementMethod: 'Content analytics, media monitoring, industry surveys',
      timeline: `${timeframeMonths} months`,
    },
  };

  const obj = objectiveMap[objective] || {
    objective: objective.replace(/_/g, ' '),
    smartGoal: `Achieve ${objective.toLowerCase().replace(/_/g, ' ')} objectives within ${timeframeMonths} months.`,
    primaryMetrics: ['Key Performance Indicators', 'Success Metrics'],
    targetValues: ['Measurable improvement', 'Positive ROI'],
    measurementMethod: 'Analytics and reporting',
    timeline: `${timeframeMonths} months`,
  };

  if (isPaid) {
    return {
      ...obj,
      primaryMetrics: [...obj.primaryMetrics, 'Secondary Metric 1', 'Secondary Metric 2'],
      targetValues: [...obj.targetValues, 'Aggressive Stretch Goal'],
      measurementMethod: `${obj.measurementMethod} Integrated BI dashboard tracking.`,
    };
  }

  return obj;
}

function getTimeframeMonths(timeframe: string): number {
  const map: Record<string, number> = {
    '1-3-months': 3,
    '3-6-months': 6,
    '6-12-months': 12,
    '12-24-months': 24,
  };
  return map[timeframe] || 12;
}

