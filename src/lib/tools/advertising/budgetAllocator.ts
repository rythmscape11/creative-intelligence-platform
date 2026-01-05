/**
 * Enhanced Budget Allocator with Advanced Allocation Strategies
 * Provides data-driven budget distribution across marketing channels
 */

export type AllocationMode = 'equal' | 'weighted' | 'performance' | 'roi-optimized' | 'growth';

export interface Channel {
  name: string;
  weight?: number;
  performance?: number;
  roi?: number;
  currentSpend?: number;
  conversions?: number;
  cpa?: number;
}

export interface BudgetAllocation {
  channel: string;
  amount: number;
  percentage: number;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
  expectedROI?: string;
  suggestedActions?: string[];
}

export interface AllocationSummary {
  allocations: BudgetAllocation[];
  insights: string[];
  totalBudget: number;
  recommendedRebalancing?: string[];
}

export function allocateBudget(
  totalBudget: number,
  channels: Channel[],
  mode: AllocationMode
): AllocationSummary {
  let allocations: BudgetAllocation[] = [];

  switch (mode) {
    case 'equal':
      allocations = allocateEqual(totalBudget, channels);
      break;
    case 'weighted':
      allocations = allocateWeighted(totalBudget, channels);
      break;
    case 'performance':
      allocations = allocatePerformance(totalBudget, channels);
      break;
    case 'roi-optimized':
      allocations = allocateROIOptimized(totalBudget, channels);
      break;
    case 'growth':
      allocations = allocateGrowth(totalBudget, channels);
      break;
    default:
      allocations = allocateEqual(totalBudget, channels);
  }

  // Generate insights
  const insights = generateInsights(allocations, totalBudget, mode);
  const recommendedRebalancing = generateRebalancingRecommendations(allocations, channels);

  return {
    allocations,
    insights,
    totalBudget,
    recommendedRebalancing
  };
}

function allocateEqual(totalBudget: number, channels: Channel[]): BudgetAllocation[] {
  const amountPerChannel = totalBudget / channels.length;
  const percentage = 100 / channels.length;

  return channels.map(channel => ({
    channel: channel.name,
    amount: Math.round(amountPerChannel * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    recommendation: 'Equal distribution - ideal for testing new channels or when performance data is limited',
    priority: 'medium' as const,
    suggestedActions: [
      'Track performance metrics closely',
      'Run A/B tests to identify top performers',
      'Plan to rebalance after 30 days of data'
    ]
  }));
}

function allocateWeighted(totalBudget: number, channels: Channel[]): BudgetAllocation[] {
  const totalWeight = channels.reduce((sum, ch) => sum + (ch.weight || 1), 0);

  return channels.map(channel => {
    const weight = channel.weight || 1;
    const percentage = (weight / totalWeight) * 100;
    const amount = (totalBudget * percentage) / 100;

    const isHighPriority = weight > totalWeight / channels.length;
    const priority = isHighPriority ? 'high' : percentage > 10 ? 'medium' : 'low';

    return {
      channel: channel.name,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
      recommendation: isHighPriority
        ? 'High priority channel - strategic focus with significant budget allocation'
        : 'Standard allocation based on strategic weight',
      priority: priority as 'high' | 'medium' | 'low',
      suggestedActions: isHighPriority
        ? ['Monitor ROI closely', 'Scale if performing well', 'Optimize creative and targeting']
        : ['Test and learn approach', 'Gather performance data', 'Consider increasing if ROI is strong']
    };
  });
}

function allocatePerformance(totalBudget: number, channels: Channel[]): BudgetAllocation[] {
  const totalPerformance = channels.reduce((sum, ch) => sum + (ch.performance || 1), 0);

  return channels.map(channel => {
    const performance = channel.performance || 1;
    const percentage = (performance / totalPerformance) * 100;
    const amount = (totalBudget * percentage) / 100;

    let recommendation = '';
    let priority: 'high' | 'medium' | 'low' = 'medium';
    let suggestedActions: string[] = [];

    if (percentage > 30) {
      recommendation = 'Top performer - maximize investment for best returns';
      priority = 'high';
      suggestedActions = [
        'Scale budget aggressively (20-30% increase)',
        'Maintain winning strategies',
        'Test new audiences to expand reach'
      ];
    } else if (percentage > 15) {
      recommendation = 'Good performer - maintain and optimize investment';
      priority = 'medium';
      suggestedActions = [
        'Optimize for efficiency',
        'Test incremental budget increases',
        'Analyze top-performing segments'
      ];
    } else {
      recommendation = 'Lower performer - optimize or consider reducing budget';
      priority = 'low';
      suggestedActions = [
        'Audit campaign setup and targeting',
        'Test new creative approaches',
        'Consider reallocating to higher performers'
      ];
    }

    return {
      channel: channel.name,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
      recommendation,
      priority,
      suggestedActions
    };
  });
}

function allocateROIOptimized(totalBudget: number, channels: Channel[]): BudgetAllocation[] {
  // Allocate based on ROI - channels with higher ROI get more budget
  const channelsWithROI = channels.filter(ch => ch.roi && ch.roi > 0);
  const zeroROIChannels = channels.filter(ch => !ch.roi || ch.roi <= 0);

  if (channelsWithROI.length === 0) {
    // Fallback to equal if no ROI data
    return allocateEqual(totalBudget, channels);
  }

  // Calculate total weighted ROI
  const totalWeightedROI = channelsWithROI.reduce((sum, ch) => sum + (ch.roi || 0), 0);

  // Build a bounded minimal pool for zero-ROI channels
  const MIN_ZERO_ROI_PERCENTAGE = 5;
  const MAX_ZERO_ROI_POOL_PERCENTAGE = 25;
  const unboundedZeroPool = zeroROIChannels.length * MIN_ZERO_ROI_PERCENTAGE;
  const zeroPoolPercentage = Math.min(unboundedZeroPool, MAX_ZERO_ROI_POOL_PERCENTAGE, 100);
  const remainingPercentage = Math.max(0, 100 - zeroPoolPercentage);

  const allocations: BudgetAllocation[] = channels.map(channel => {
    const roi = channel.roi || 0;

    if (roi <= 0) {
      const percentage = zeroROIChannels.length > 0 ? zeroPoolPercentage / zeroROIChannels.length : 0;
      const amount = (totalBudget * percentage) / 100;
      return {
        channel: channel.name,
        amount,
        percentage,
        recommendation: 'No ROI data - minimal allocation for testing',
        priority: 'low' as const,
        expectedROI: 'Unknown',
        suggestedActions: ['Gather ROI data', 'Run small test campaigns', 'Track conversions carefully']
      };
    }

    const percentage = (roi / totalWeightedROI) * remainingPercentage;
    const amount = (totalBudget * percentage) / 100;
    const expectedReturn = amount * (roi / 100);

    return {
      channel: channel.name,
      amount,
      percentage,
      recommendation: `ROI-optimized allocation - ${roi}% ROI expected`,
      priority: roi > 150 ? 'high' : roi > 75 ? 'medium' : 'low',
      expectedROI: `$${expectedReturn.toFixed(2)} (${roi}% ROI)`,
      suggestedActions: [
        `Expected return: $${expectedReturn.toFixed(2)}`,
        roi > 150 ? 'Excellent ROI - scale aggressively' : 'Monitor performance closely',
        'Optimize for maximum efficiency'
      ]
    };
  });

  const totalPercentage = allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
  if (totalPercentage === 0) return allocations;

  const rebalanceFactor = 100 / totalPercentage;

  return allocations.map(allocation => {
    const normalizedPercentage = Math.round(allocation.percentage * rebalanceFactor * 100) / 100;
    const normalizedAmount = Math.round((totalBudget * normalizedPercentage) / 100 * 100) / 100;

    return {
      ...allocation,
      percentage: normalizedPercentage,
      amount: normalizedAmount
    };
  });
}

function allocateGrowth(totalBudget: number, channels: Channel[]): BudgetAllocation[] {
  // Growth strategy: 70% to proven channels, 30% to testing/new channels
  const provenChannels = channels.filter(ch => (ch.performance || 0) > 5 || (ch.roi || 0) > 50);
  const testChannels = channels.filter(ch => (ch.performance || 0) <= 5 && (ch.roi || 0) <= 50);

  const provenBudget = totalBudget * 0.7;
  const testBudget = totalBudget * 0.3;

  const allocations: BudgetAllocation[] = [];

  // Allocate to proven channels
  if (provenChannels.length > 0) {
    const totalProvenPerf = provenChannels.reduce((sum, ch) => sum + (ch.performance || ch.roi || 1), 0);
    provenChannels.forEach(channel => {
      const perf = channel.performance || channel.roi || 1;
      const percentage = (perf / totalProvenPerf) * 70;
      const amount = (totalBudget * percentage) / 100;

      allocations.push({
        channel: channel.name,
        amount: Math.round(amount * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        recommendation: 'Proven channel - growth allocation for scaling',
        priority: 'high' as const,
        suggestedActions: [
          'Scale budget by 20-30% monthly',
          'Expand to new audiences',
          'Test new creative variations'
        ]
      });
    });
  }

  // Allocate to test channels
  if (testChannels.length > 0) {
    const amountPerTest = testBudget / testChannels.length;
    const percentagePerTest = 30 / testChannels.length;

    testChannels.forEach(channel => {
      allocations.push({
        channel: channel.name,
        amount: Math.round(amountPerTest * 100) / 100,
        percentage: Math.round(percentagePerTest * 100) / 100,
        recommendation: 'Test channel - growth allocation for experimentation',
        priority: 'medium' as const,
        suggestedActions: [
          'Run controlled experiments',
          'Gather performance data',
          'Graduate to proven if ROI > 100%'
        ]
      });
    });
  }

  // If all channels are proven or all are test, distribute accordingly
  if (provenChannels.length === 0) {
    return allocateEqual(totalBudget, channels);
  }
  if (testChannels.length === 0) {
    return allocatePerformance(totalBudget, channels);
  }

  return allocations;
}

function generateInsights(allocations: BudgetAllocation[], totalBudget: number, mode: AllocationMode): string[] {
  const insights: string[] = [];

  const topChannel = allocations.reduce((max, curr) =>
    curr.amount > max.amount ? curr : max
  );

  const lowChannels = allocations.filter(a => a.percentage < 10);

  insights.push(`💰 Total budget: $${totalBudget.toLocaleString()} allocated across ${allocations.length} channels`);
  insights.push(`🎯 Top allocation: ${topChannel.channel} receives $${topChannel.amount.toLocaleString()} (${topChannel.percentage.toFixed(1)}%)`);

  if (mode === 'roi-optimized') {
    const totalExpectedROI = allocations.reduce((sum, a) => {
      if (a.expectedROI && a.expectedROI !== 'Unknown') {
        const match = a.expectedROI.match(/\$([0-9.]+)/);
        return sum + (match ? parseFloat(match[1]) : 0);
      }
      return sum;
    }, 0);
    if (totalExpectedROI > 0) {
      insights.push(`📈 Expected total return: $${totalExpectedROI.toFixed(2)} from ROI-optimized allocation`);
    }
  }

  if (lowChannels.length > 0) {
    insights.push(`⚠️ ${lowChannels.length} channel(s) receiving less than 10% - consider consolidation or testing`);
  }

  if (allocations.length > 5) {
    insights.push(`📊 Managing ${allocations.length} channels - ensure you have resources to optimize each effectively`);
  }

  return insights;
}

function generateRebalancingRecommendations(allocations: BudgetAllocation[], channels: Channel[]): string[] {
  const recommendations: string[] = [];

  const highPriority = allocations.filter(a => a.priority === 'high');
  const lowPriority = allocations.filter(a => a.priority === 'low');

  if (highPriority.length > 0) {
    recommendations.push(`🚀 Scale high-priority channels: ${highPriority.map(a => a.channel).join(', ')}`);
  }

  if (lowPriority.length > 0) {
    recommendations.push(`🔍 Review low-priority channels: ${lowPriority.map(a => a.channel).join(', ')} - optimize or reallocate`);
  }

  recommendations.push('📅 Review allocation monthly and adjust based on performance data');
  recommendations.push('🧪 Reserve 10-15% of budget for testing new channels and strategies');
  recommendations.push('📊 Track ROI, CPA, and conversion rates for each channel to inform future allocations');

  return recommendations.slice(0, 5);
}

export function getRecommendations(allocations: BudgetAllocation[], totalBudget: number): string[] {
  const recommendations: string[] = [];

  const topChannel = allocations.reduce((max, curr) =>
    curr.amount > max.amount ? curr : max
  );

  recommendations.push(`Allocate ${topChannel.percentage.toFixed(1)}% ($${topChannel.amount.toLocaleString()}) to ${topChannel.channel}`);

  if (allocations.length > 3) {
    recommendations.push('Consider consolidating low-performing channels');
  }

  recommendations.push('Review and adjust allocation monthly based on performance');
  recommendations.push('Reserve 10-15% of budget for testing new channels');
  recommendations.push('Track ROI for each channel to optimize future allocations');

  return recommendations;
}
