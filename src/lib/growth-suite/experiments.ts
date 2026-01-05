/**
 * Experiments - Client-side A/B testing with statistical analysis
 * No external dependencies - simulates realistic experiment data
 */

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface Variant {
  id: string;
  name: string;
  traffic: number;
  views: number;
  conversions: number;
  conversionRate: number;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  variants: Variant[];
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  totalViews: number;
  totalConversions: number;
  winner: string | null;
  confidence: number;
}

/**
 * Calculate conversion rate
 */
export function calculateConversionRate(conversions: number, views: number): number {
  if (views === 0) return 0;
  return Math.round((conversions / views) * 1000) / 10;
}

/**
 * Calculate uplift percentage between two variants
 */
export function calculateUplift(controlRate: number, variantRate: number): number {
  if (controlRate === 0) return 0;
  return Math.round(((variantRate - controlRate) / controlRate) * 1000) / 10;
}

/**
 * Calculate statistical significance (simplified z-test)
 */
export function calculateSignificance(
  controlConversions: number,
  controlViews: number,
  variantConversions: number,
  variantViews: number
): number {
  if (controlViews === 0 || variantViews === 0) return 0;
  
  const p1 = controlConversions / controlViews;
  const p2 = variantConversions / variantViews;
  const pPool = (controlConversions + variantConversions) / (controlViews + variantViews);
  
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / controlViews + 1 / variantViews));
  
  if (se === 0) return 0;
  
  const z = Math.abs((p1 - p2) / se);
  
  // Convert z-score to confidence percentage (simplified)
  // z > 1.96 = 95% confidence, z > 2.58 = 99% confidence
  let confidence = 0;
  if (z >= 2.58) confidence = 99;
  else if (z >= 1.96) confidence = 95;
  else if (z >= 1.65) confidence = 90;
  else if (z >= 1.28) confidence = 80;
  else confidence = Math.round(z * 40);
  
  return Math.min(99, confidence);
}

/**
 * Determine experiment winner
 */
export function determineWinner(variants: Variant[]): string | null {
  if (variants.length < 2) return null;
  
  const control = variants[0];
  const bestVariant = variants.slice(1).reduce((best, current) => 
    current.conversionRate > best.conversionRate ? current : best
  , variants[1]);
  
  // Check if best variant has significantly better conversion rate
  const significance = calculateSignificance(
    control.conversions,
    control.views,
    bestVariant.conversions,
    bestVariant.views
  );
  
  // Need at least 95% confidence to declare a winner
  if (significance >= 95 && bestVariant.conversionRate > control.conversionRate) {
    return bestVariant.id;
  }
  
  return null;
}

/**
 * Simulate experiment views and conversions over time
 */
export function simulateExperimentData(
  experiment: Experiment,
  daysRunning: number
): Experiment {
  const updatedVariants = experiment.variants.map((variant, index) => {
    // Base conversion rate varies by variant
    const baseRate = 0.05 + (index * 0.01); // Control: 5%, Variant A: 6%, etc.
    
    // Simulate daily views based on traffic allocation
    const dailyViews = Math.floor(100 * (variant.traffic / 100));
    const totalViews = dailyViews * daysRunning;
    
    // Add some randomness to conversions
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const conversions = Math.floor(totalViews * baseRate * randomFactor);
    
    return {
      ...variant,
      views: totalViews,
      conversions,
      conversionRate: calculateConversionRate(conversions, totalViews)
    };
  });
  
  const totalViews = updatedVariants.reduce((sum, v) => sum + v.views, 0);
  const totalConversions = updatedVariants.reduce((sum, v) => sum + v.conversions, 0);
  
  const winner = determineWinner(updatedVariants);
  const confidence = updatedVariants.length >= 2 
    ? calculateSignificance(
        updatedVariants[0].conversions,
        updatedVariants[0].views,
        updatedVariants[1].conversions,
        updatedVariants[1].views
      )
    : 0;
  
  return {
    ...experiment,
    variants: updatedVariants,
    totalViews,
    totalConversions,
    winner,
    confidence
  };
}

/**
 * Create a new experiment
 */
export function createExperiment(
  name: string,
  description: string,
  variantNames: string[]
): Experiment {
  const trafficSplit = Math.floor(100 / variantNames.length);
  const remainder = 100 - (trafficSplit * variantNames.length);
  
  const variants: Variant[] = variantNames.map((variantName, index) => ({
    id: `variant-${index}`,
    name: variantName,
    traffic: trafficSplit + (index === 0 ? remainder : 0),
    views: 0,
    conversions: 0,
    conversionRate: 0
  }));
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name,
    description,
    status: 'draft',
    variants,
    startDate: null,
    endDate: null,
    createdAt: new Date().toISOString(),
    totalViews: 0,
    totalConversions: 0,
    winner: null,
    confidence: 0
  };
}

/**
 * Start an experiment
 */
export function startExperiment(experiment: Experiment): Experiment {
  return {
    ...experiment,
    status: 'running',
    startDate: new Date().toISOString()
  };
}

/**
 * Pause an experiment
 */
export function pauseExperiment(experiment: Experiment): Experiment {
  return {
    ...experiment,
    status: 'paused'
  };
}

/**
 * Complete an experiment
 */
export function completeExperiment(experiment: Experiment): Experiment {
  return {
    ...experiment,
    status: 'completed',
    endDate: new Date().toISOString()
  };
}

/**
 * Export experiment results to CSV
 */
export function exportExperimentCSV(experiment: Experiment): string {
  const headers = ['Variant', 'Traffic %', 'Views', 'Conversions', 'Conversion Rate', 'Uplift vs Control'];
  
  const controlRate = experiment.variants[0]?.conversionRate || 0;
  
  const rows = experiment.variants.map((variant, index) => {
    const uplift = index === 0 ? '0%' : `${calculateUplift(controlRate, variant.conversionRate)}%`;
    return [
      variant.name,
      `${variant.traffic}%`,
      variant.views.toString(),
      variant.conversions.toString(),
      `${variant.conversionRate}%`,
      uplift
    ];
  });
  
  const csv = [
    `Experiment: ${experiment.name}`,
    `Status: ${experiment.status}`,
    `Started: ${experiment.startDate ? new Date(experiment.startDate).toLocaleDateString() : 'Not started'}`,
    `Confidence: ${experiment.confidence}%`,
    `Winner: ${experiment.winner ? experiment.variants.find(v => v.id === experiment.winner)?.name : 'No winner yet'}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csv;
}

/**
 * Generate experiment report
 */
export function generateExperimentReport(experiment: Experiment): string {
  const controlVariant = experiment.variants[0];
  const bestVariant = experiment.variants.slice(1).reduce((best, current) => 
    current.conversionRate > best.conversionRate ? current : best
  , experiment.variants[1] || experiment.variants[0]);
  
  const uplift = calculateUplift(controlVariant.conversionRate, bestVariant.conversionRate);
  
  return `
EXPERIMENT REPORT
=================

Experiment: ${experiment.name}
Description: ${experiment.description}
Status: ${experiment.status.toUpperCase()}
Started: ${experiment.startDate ? new Date(experiment.startDate).toLocaleDateString() : 'Not started'}
${experiment.endDate ? `Ended: ${new Date(experiment.endDate).toLocaleDateString()}` : ''}

OVERALL STATISTICS
------------------
Total Views: ${experiment.totalViews.toLocaleString()}
Total Conversions: ${experiment.totalConversions.toLocaleString()}
Statistical Confidence: ${experiment.confidence}%
${experiment.winner ? `Winner: ${experiment.variants.find(v => v.id === experiment.winner)?.name}` : 'No winner yet'}

VARIANT PERFORMANCE
-------------------
${experiment.variants.map((variant, index) => `
${variant.name}${index === 0 ? ' (Control)' : ''}
  Traffic Allocation: ${variant.traffic}%
  Views: ${variant.views.toLocaleString()}
  Conversions: ${variant.conversions.toLocaleString()}
  Conversion Rate: ${variant.conversionRate}%
  ${index > 0 ? `Uplift vs Control: ${calculateUplift(controlVariant.conversionRate, variant.conversionRate)}%` : ''}
`).join('\n')}

RECOMMENDATIONS
---------------
${experiment.confidence >= 95 
  ? `✅ Statistically significant result! ${bestVariant.name} shows ${uplift}% improvement.`
  : experiment.confidence >= 80
  ? `⚠️ Results are promising but need more data for 95% confidence.`
  : `❌ Not enough data yet. Continue running the experiment.`
}

${experiment.totalViews < 1000 
  ? '💡 Tip: Aim for at least 1000 views per variant for reliable results.'
  : ''
}

Generated by MediaPlanPro Growth Suite
  `.trim();
}

