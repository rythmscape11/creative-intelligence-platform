import { AdMetrics } from '@/types/tools';

/**
 * Calculate comprehensive ad metrics with insights and recommendations
 */
export function calculateAdMetrics(input: AdMetrics): AdMetrics {
  const result: AdMetrics = { ...input };

  // CPC = Spend / Clicks
  if (input.spend !== undefined && input.clicks !== undefined && input.clicks > 0) {
    result.cpc = input.spend / input.clicks;
  }

  // CPM = (Spend / Impressions) * 1000
  if (input.spend !== undefined && input.impressions !== undefined && input.impressions > 0) {
    result.cpm = (input.spend / input.impressions) * 1000;
  }

  // CPA = Spend / Conversions
  if (input.spend !== undefined && input.conversions !== undefined && input.conversions > 0) {
    result.cpa = input.spend / input.conversions;
  }

  // CTR = (Clicks / Impressions) * 100
  if (input.clicks !== undefined && input.impressions !== undefined && input.impressions > 0) {
    result.ctr = (input.clicks / input.impressions) * 100;
  }

  // Conversion Rate = (Conversions / Clicks) * 100
  if (input.conversions !== undefined && input.clicks !== undefined && input.clicks > 0) {
    result.conversionRate = (input.conversions / input.clicks) * 100;
  }

  // Calculate missing values if we have enough data

  // If we have CPC and clicks, calculate spend
  if (input.cpc !== undefined && input.clicks !== undefined && result.spend === undefined) {
    result.spend = input.cpc * input.clicks;
  }

  // If we have CPM and impressions, calculate spend
  if (input.cpm !== undefined && input.impressions !== undefined && result.spend === undefined) {
    result.spend = (input.cpm * input.impressions) / 1000;
  }

  // If we have spend and CPC, calculate clicks
  if (input.spend !== undefined && input.cpc !== undefined && result.clicks === undefined) {
    result.clicks = input.spend / input.cpc;
  }

  // If we have spend and CPM, calculate impressions
  if (input.spend !== undefined && input.cpm !== undefined && result.impressions === undefined) {
    result.impressions = (input.spend * 1000) / input.cpm;
  }

  // Generate insights and recommendations
  const platform = input.platform || 'google';
  result.insights = generateInsights(result, platform);
  result.recommendations = generateRecommendations(result, platform);

  return result;
}

/**
 * Generate actionable insights based on ad metrics
 */
function generateInsights(metrics: AdMetrics, platform: string): string[] {
  const insights: string[] = [];
  const benchmarks = getBenchmarks(platform);

  // CPC Insights
  if (metrics.cpc !== undefined) {
    const cpcRating = getMetricRating('cpc', metrics.cpc, platform);
    if (cpcRating.rating === 'Excellent') {
      insights.push(`💰 Your CPC of $${metrics.cpc.toFixed(2)} is excellent - ${((benchmarks.cpc.avg - metrics.cpc) / benchmarks.cpc.avg * 100).toFixed(0)}% below industry average!`);
    } else if (cpcRating.rating === 'Poor') {
      insights.push(`⚠️ Your CPC of $${metrics.cpc.toFixed(2)} is ${((metrics.cpc - benchmarks.cpc.avg) / benchmarks.cpc.avg * 100).toFixed(0)}% above average - optimization needed`);
    }
  }

  // CTR Insights
  if (metrics.ctr !== undefined) {
    const ctrRating = getMetricRating('ctr', metrics.ctr, platform);
    if (ctrRating.rating === 'Excellent') {
      insights.push(`🎯 Outstanding CTR of ${metrics.ctr.toFixed(2)}% - your ad copy and targeting are highly effective!`);
    } else if (ctrRating.rating === 'Poor') {
      insights.push(`📉 CTR of ${metrics.ctr.toFixed(2)}% is below average - consider improving ad copy and targeting`);
    }
  }

  // Conversion Rate Insights
  if (metrics.conversionRate !== undefined) {
    const cvRating = getMetricRating('conversionRate', metrics.conversionRate, platform);
    if (cvRating.rating === 'Excellent') {
      insights.push(`✅ Excellent conversion rate of ${metrics.conversionRate.toFixed(2)}% - your landing page and offer are converting well!`);
    } else if (cvRating.rating === 'Poor') {
      insights.push(`🔍 Conversion rate of ${metrics.conversionRate.toFixed(2)}% needs improvement - focus on landing page optimization`);
    }
  }

  // CPM Insights
  if (metrics.cpm !== undefined) {
    const cpmRating = getMetricRating('cpm', metrics.cpm, platform);
    insights.push(`📊 Your CPM of $${metrics.cpm.toFixed(2)} is ${cpmRating.rating.toLowerCase()} for ${platform} ads`);
  }

  return insights.slice(0, 4);
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(metrics: AdMetrics, platform: string): string[] {
  const recommendations: string[] = [];
  const benchmarks = getBenchmarks(platform);

  // CPC Recommendations
  if (metrics.cpc !== undefined && metrics.cpc > benchmarks.cpc.avg) {
    recommendations.push('🎯 Lower CPC: Improve Quality Score by enhancing ad relevance and landing page experience');
    recommendations.push('📱 Test different ad formats and placements to find lower-cost options');
  }

  // CTR Recommendations
  if (metrics.ctr !== undefined && metrics.ctr < benchmarks.ctr.avg) {
    recommendations.push('✍️ Improve ad copy with stronger CTAs and emotional triggers');
    recommendations.push('🎨 Test different ad creatives and headlines to boost click-through rate');
  }

  // Conversion Rate Recommendations
  if (metrics.conversionRate !== undefined && metrics.conversionRate < benchmarks.conversionRate.avg) {
    recommendations.push('🚀 Optimize landing page: Improve load speed, clarity, and CTA prominence');
    recommendations.push('🧪 A/B test different offers, headlines, and form lengths');
  }

  // General Recommendations
  if (metrics.ctr !== undefined && metrics.ctr >= benchmarks.ctr.avg && metrics.conversionRate !== undefined && metrics.conversionRate < benchmarks.conversionRate.avg) {
    recommendations.push('⚡ High CTR but low conversions suggests a landing page mismatch - ensure message consistency');
  }

  if (recommendations.length === 0) {
    recommendations.push('🎉 Excellent performance across all metrics! Continue monitoring and testing incremental improvements');
    recommendations.push('📈 Consider scaling budget by 20-30% while maintaining current performance levels');
  }

  return recommendations.slice(0, 5);
}

export function getBenchmarks(platform: string = 'google'): {
  cpc: { min: number; max: number; avg: number };
  cpm: { min: number; max: number; avg: number };
  ctr: { min: number; max: number; avg: number };
  conversionRate: { min: number; max: number; avg: number };
} {
  const benchmarks: Record<string, any> = {
    google: {
      cpc: { min: 1, max: 5, avg: 2.5 },
      cpm: { min: 2, max: 10, avg: 5 },
      ctr: { min: 2, max: 5, avg: 3.5 },
      conversionRate: { min: 2, max: 5, avg: 3.5 }
    },
    facebook: {
      cpc: { min: 0.5, max: 3, avg: 1.5 },
      cpm: { min: 5, max: 15, avg: 10 },
      ctr: { min: 0.5, max: 2, avg: 1 },
      conversionRate: { min: 1, max: 3, avg: 2 }
    },
    linkedin: {
      cpc: { min: 2, max: 7, avg: 5 },
      cpm: { min: 6, max: 20, avg: 12 },
      ctr: { min: 0.3, max: 1, avg: 0.6 },
      conversionRate: { min: 1, max: 4, avg: 2.5 }
    }
  };

  return benchmarks[platform] || benchmarks.google;
}

export function getMetricRating(metric: string, value: number, platform: string = 'google'): {
  rating: string;
  color: string;
} {
  const benchmarks = getBenchmarks(platform);
  const benchmark = benchmarks[metric as keyof typeof benchmarks];

  if (!benchmark) return { rating: 'Unknown', color: 'gray' };

  if (metric === 'cpc' || metric === 'cpm' || metric === 'cpa') {
    // Lower is better for costs
    if (value <= benchmark.min) return { rating: 'Excellent', color: 'green' };
    if (value <= benchmark.avg) return { rating: 'Good', color: 'blue' };
    if (value <= benchmark.max) return { rating: 'Average', color: 'yellow' };
    return { rating: 'Poor', color: 'red' };
  } else {
    // Higher is better for rates
    if (value >= benchmark.max) return { rating: 'Excellent', color: 'green' };
    if (value >= benchmark.avg) return { rating: 'Good', color: 'blue' };
    if (value >= benchmark.min) return { rating: 'Average', color: 'yellow' };
    return { rating: 'Poor', color: 'red' };
  }
}

