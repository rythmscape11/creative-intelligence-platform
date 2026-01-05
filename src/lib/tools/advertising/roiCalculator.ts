import { ROIInput, ROIOutput } from '@/types/tools';

/**
 * Enhanced ROI Calculator with Advanced Metrics and Industry Benchmarks
 * Provides comprehensive financial analysis for marketing campaigns
 */
export function calculateROI(input: ROIInput): ROIOutput {
  const { investment, revenue, costs = 0, customers = 0, avgOrderValue = 0, customerLifetimeMonths = 0 } = input;

  // Validate inputs
  if (investment <= 0) {
    throw new Error('Investment must be greater than 0');
  }

  // Core Metrics
  // ROI = ((Revenue - Total Costs) / Total Costs) * 100
  const totalCosts = investment + costs;
  const roi = ((revenue - totalCosts) / totalCosts) * 100;

  // ROAS = Revenue / Ad Spend (Investment only, not including other costs)
  const roas = revenue / investment;

  // CAC = Total Marketing Spend / Number of Customers Acquired
  const cac = customers > 0 ? totalCosts / customers : 0;

  // CLV = Average Order Value * Average Purchase Frequency * Customer Lifetime
  // Assuming monthly purchases for simplicity
  const clv = avgOrderValue && customerLifetimeMonths
    ? avgOrderValue * customerLifetimeMonths
    : 0;

  // Advanced Metrics
  // LTV:CAC Ratio - Industry benchmark is 3:1 or higher
  const ltvCacRatio = cac > 0 && clv > 0 ? clv / cac : 0;

  // Payback Period (months) - Time to recover CAC
  const monthlyRevenue = avgOrderValue || 0;
  const paybackPeriod = monthlyRevenue > 0 && cac > 0
    ? Math.ceil(cac / monthlyRevenue)
    : 0;

  // Break-even Point (days) - When revenue equals total investment
  const dailyRevenue = revenue / 30;
  const breakEven = dailyRevenue > 0 ? Math.ceil(totalCosts / dailyRevenue) : 0;

  // Profit Margin = ((Revenue - Total Costs) / Revenue) * 100
  const profitMargin = revenue > 0 ? ((revenue - totalCosts) / revenue) * 100 : 0;

  // Net Profit = Revenue - Total Costs
  const netProfit = revenue - totalCosts;

  // Gross Profit = Revenue - Investment (excluding additional costs)
  const grossProfit = revenue - investment;

  // Marketing Efficiency Ratio (MER) = Revenue / Marketing Spend
  const mer = totalCosts > 0 ? revenue / totalCosts : 0;

  // Customer Acquisition Efficiency = Revenue per Customer / CAC
  const revenuePerCustomer = customers > 0 ? revenue / customers : 0;
  const acquisitionEfficiency = cac > 0 ? revenuePerCustomer / cac : 0;

  // Generate insights and recommendations
  const insights = generateROIInsights({
    roi,
    roas,
    cac,
    clv,
    ltvCacRatio,
    paybackPeriod,
    profitMargin,
    mer,
    acquisitionEfficiency,
    customers,
    revenue,
    investment
  });

  return {
    roi: roi.toFixed(2),
    roas: roas.toFixed(2),
    cac: cac.toFixed(2),
    clv: clv.toFixed(2),
    breakEven,
    profitMargin: profitMargin.toFixed(2),
    netProfit: netProfit.toFixed(2),
    // Enhanced metrics
    ltvCacRatio: ltvCacRatio.toFixed(2),
    paybackPeriod,
    grossProfit: grossProfit.toFixed(2),
    mer: mer.toFixed(2),
    revenuePerCustomer: revenuePerCustomer.toFixed(2),
    acquisitionEfficiency: acquisitionEfficiency.toFixed(2),
    insights,
    recommendations: generateRecommendations({
      roi,
      roas,
      ltvCacRatio,
      profitMargin,
      paybackPeriod,
      cac,
      clv
    })
  };
}

export function getROIRating(roi: number): { rating: string; color: string; description: string } {
  if (roi >= 150) return {
    rating: 'Outstanding',
    color: 'green',
    description: 'Exceptional performance - significantly above industry average'
  };
  if (roi >= 100) return {
    rating: 'Excellent',
    color: 'green',
    description: 'Strong performance - doubling your investment'
  };
  if (roi >= 50) return {
    rating: 'Good',
    color: 'blue',
    description: 'Solid performance - above break-even with healthy returns'
  };
  if (roi >= 0) return {
    rating: 'Fair',
    color: 'yellow',
    description: 'Marginal performance - breaking even or slight profit'
  };
  return {
    rating: 'Poor',
    color: 'red',
    description: 'Underperforming - losing money on this campaign'
  };
}

export function getROASRating(roas: number): { rating: string; color: string; description: string } {
  if (roas >= 5) return {
    rating: 'Outstanding',
    color: 'green',
    description: '$5+ return per $1 spent - exceptional efficiency'
  };
  if (roas >= 4) return {
    rating: 'Excellent',
    color: 'green',
    description: '$4+ return per $1 spent - strong performance'
  };
  if (roas >= 2) return {
    rating: 'Good',
    color: 'blue',
    description: '$2+ return per $1 spent - profitable campaign'
  };
  if (roas >= 1) return {
    rating: 'Fair',
    color: 'yellow',
    description: 'Breaking even - needs optimization'
  };
  return {
    rating: 'Poor',
    color: 'red',
    description: 'Losing money - immediate action required'
  };
}

function generateROIInsights(metrics: {
  roi: number;
  roas: number;
  cac: number;
  clv: number;
  ltvCacRatio: number;
  paybackPeriod: number;
  profitMargin: number;
  mer: number;
  acquisitionEfficiency: number;
  customers: number;
  revenue: number;
  investment: number;
}): string[] {
  const insights: string[] = [];

  // ROI Insights
  if (metrics.roi > 100) {
    insights.push(`🎯 Your ROI of ${metrics.roi.toFixed(0)}% means you're earning $${(metrics.roi / 100 + 1).toFixed(2)} for every $1 invested - excellent performance!`);
  } else if (metrics.roi > 0) {
    insights.push(`📊 Your ROI of ${metrics.roi.toFixed(0)}% is positive but has room for improvement. Industry leaders typically achieve 150%+ ROI.`);
  } else {
    insights.push(`⚠️ Negative ROI of ${metrics.roi.toFixed(0)}% indicates you're losing money. Focus on reducing costs or improving conversion rates.`);
  }

  // LTV:CAC Ratio Insights
  if (metrics.ltvCacRatio >= 3) {
    insights.push(`✅ Your LTV:CAC ratio of ${metrics.ltvCacRatio.toFixed(1)}:1 is healthy (benchmark: 3:1). You're acquiring customers efficiently.`);
  } else if (metrics.ltvCacRatio > 0) {
    insights.push(`⚡ Your LTV:CAC ratio of ${metrics.ltvCacRatio.toFixed(1)}:1 is below the 3:1 benchmark. Consider increasing customer lifetime value or reducing acquisition costs.`);
  }

  // Payback Period Insights
  if (metrics.paybackPeriod > 0 && metrics.paybackPeriod <= 12) {
    insights.push(`⏱️ Your ${metrics.paybackPeriod}-month payback period is excellent. You'll recover customer acquisition costs quickly.`);
  } else if (metrics.paybackPeriod > 12) {
    insights.push(`📅 Your ${metrics.paybackPeriod}-month payback period is long. Consider strategies to accelerate revenue or reduce CAC.`);
  }

  // Profit Margin Insights
  if (metrics.profitMargin >= 30) {
    insights.push(`💰 Your ${metrics.profitMargin.toFixed(0)}% profit margin is strong, leaving room for scaling and experimentation.`);
  } else if (metrics.profitMargin >= 15) {
    insights.push(`📈 Your ${metrics.profitMargin.toFixed(0)}% profit margin is moderate. Look for opportunities to optimize costs.`);
  } else if (metrics.profitMargin > 0) {
    insights.push(`⚠️ Your ${metrics.profitMargin.toFixed(0)}% profit margin is thin. Small changes in costs could impact profitability significantly.`);
  }

  return insights.slice(0, 4); // Return top 4 insights
}

function generateRecommendations(metrics: {
  roi: number;
  roas: number;
  ltvCacRatio: number;
  profitMargin: number;
  paybackPeriod: number;
  cac: number;
  clv: number;
}): string[] {
  const recommendations: string[] = [];

  // ROI-based recommendations
  if (metrics.roi < 50) {
    recommendations.push('🎯 Optimize targeting to reach higher-intent audiences and reduce wasted ad spend');
    recommendations.push('📝 Test different ad creatives and messaging to improve conversion rates');
    recommendations.push('🔍 Analyze your funnel for drop-off points and optimize the customer journey');
  } else if (metrics.roi < 100) {
    recommendations.push('📊 Your campaign is profitable - consider scaling budget by 20-30% to maximize returns');
    recommendations.push('🧪 Run A/B tests on landing pages to improve conversion rates further');
  } else {
    recommendations.push('🚀 Excellent performance! Scale your budget aggressively while maintaining quality');
    recommendations.push('📈 Document your winning strategies and replicate across other channels');
  }

  // LTV:CAC recommendations
  if (metrics.ltvCacRatio < 3 && metrics.ltvCacRatio > 0) {
    recommendations.push('💎 Increase CLV through upsells, cross-sells, and retention programs');
    recommendations.push('🎁 Implement loyalty programs to extend customer lifetime');
  }

  // ROAS recommendations
  if (metrics.roas < 2) {
    recommendations.push('⚡ Focus on high-performing channels and pause underperforming campaigns');
    recommendations.push('🎯 Refine audience targeting using lookalike audiences and retargeting');
  }

  // Payback period recommendations
  if (metrics.paybackPeriod > 12) {
    recommendations.push('⏰ Reduce payback period by offering introductory promotions or payment plans');
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

