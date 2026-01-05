export interface SegmentationInput {
  totalSubscribers: number;
  engagementRate: number; // percentage
  conversionRate: number; // percentage
}

export interface SegmentResult {
  segment: string;
  size: number;
  percentage: number;
  description: string;
  strategy: string;
}

export interface SegmentationAnalysis {
  segments: SegmentResult[];
  recommendations: string[];
  totalSubscribers: number;
}

export function calculateListSegmentation(input: SegmentationInput): SegmentationAnalysis {
  const { totalSubscribers, engagementRate, conversionRate } = input;
  
  // Calculate segment sizes based on typical distribution
  const highlyEngaged = Math.round(totalSubscribers * (engagementRate / 100) * 0.3);
  const moderatelyEngaged = Math.round(totalSubscribers * (engagementRate / 100) * 0.5);
  const lowEngaged = Math.round(totalSubscribers * (engagementRate / 100) * 0.2);
  const inactive = totalSubscribers - (highlyEngaged + moderatelyEngaged + lowEngaged);
  
  const segments: SegmentResult[] = [
    {
      segment: 'Highly Engaged',
      size: highlyEngaged,
      percentage: Math.round((highlyEngaged / totalSubscribers) * 100),
      description: 'Opens and clicks regularly, high conversion potential',
      strategy: 'Send premium content, exclusive offers, and new product launches'
    },
    {
      segment: 'Moderately Engaged',
      size: moderatelyEngaged,
      percentage: Math.round((moderatelyEngaged / totalSubscribers) * 100),
      description: 'Opens occasionally, needs nurturing',
      strategy: 'Educational content, case studies, and gentle CTAs'
    },
    {
      segment: 'Low Engagement',
      size: lowEngaged,
      percentage: Math.round((lowEngaged / totalSubscribers) * 100),
      description: 'Rarely opens, at risk of becoming inactive',
      strategy: 'Re-engagement campaigns, surveys, and preference updates'
    },
    {
      segment: 'Inactive',
      size: inactive,
      percentage: Math.round((inactive / totalSubscribers) * 100),
      description: 'No engagement in 90+ days',
      strategy: 'Win-back campaigns or consider removing to improve deliverability'
    }
  ];
  
  const recommendations: string[] = [];
  
  // Generate recommendations based on data
  const inactivePercentage = (inactive / totalSubscribers) * 100;
  if (inactivePercentage > 30) {
    recommendations.push('High inactive rate detected. Run a win-back campaign or clean your list');
  }
  
  if (engagementRate < 20) {
    recommendations.push('Low overall engagement. Review your content strategy and sending frequency');
  }
  
  if (conversionRate < 2) {
    recommendations.push('Low conversion rate. Improve your CTAs and landing pages');
  }
  
  recommendations.push('Send different content to each segment based on their engagement level');
  recommendations.push('Monitor segment movement monthly to track list health');
  recommendations.push('Use A/B testing to optimize campaigns for each segment');
  
  if (highlyEngaged > 0) {
    recommendations.push(`Focus on your ${highlyEngaged} highly engaged subscribers for maximum ROI`);
  }
  
  return {
    segments,
    recommendations,
    totalSubscribers
  };
}

