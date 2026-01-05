import { EngagementInput, EngagementOutput } from '@/types/tools';

function validateEngagementInput({ followers, likes, comments, shares }: EngagementInput) {
  // Input validation keeps the calculator from producing NaN values that used to surface as "unexpected error".
  const numericFields = { followers, likes, comments, shares };
  Object.entries(numericFields).forEach(([key, value]) => {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`The ${key} value must be a non-negative number.`);
    }
  });

  if (followers === 0) {
    throw new Error('Followers must be greater than zero to calculate engagement rate.');
  }
}

/**
 * Calculate comprehensive social media engagement metrics with insights
 */
export function calculateEngagement(input: EngagementInput): EngagementOutput {
  validateEngagementInput(input);

  const { followers, likes, comments, shares, posts } = input;
  const followerCount = Math.max(followers, 1);
  const totalEngagements = likes + comments + shares;
  const engagementRate = (totalEngagements / followerCount) * 100;

  const rating = getEngagementRating(engagementRate, input.platform);
  const benchmark = getBenchmark(input.platform);

  // Calculate additional metrics
  const safePostCount = posts && posts > 0 ? posts : undefined;
  const avgEngagementsPerPost = safePostCount ? totalEngagements / safePostCount : 0;
  const commentToLikeRatio = likes > 0 ? (comments / likes) * 100 : 0;
  const shareRate = (shares / followerCount) * 100;
  const viralityScore = calculateViralityScore(likes, comments, shares, followerCount);

  // Generate insights and recommendations
  const insights = generateEngagementInsights(
    engagementRate,
    commentToLikeRatio,
    shareRate,
    viralityScore,
    input.platform,
    rating
  );
  const recommendations = generateEngagementRecommendations(
    engagementRate,
    commentToLikeRatio,
    shareRate,
    input.platform,
    rating
  );

  return {
    engagementRate: engagementRate.toFixed(2),
    rating,
    benchmark,
    totalEngagements,
    avgEngagementsPerPost: safePostCount ? avgEngagementsPerPost.toFixed(1) : undefined,
    commentToLikeRatio: commentToLikeRatio.toFixed(2),
    shareRate: shareRate.toFixed(3),
    viralityScore: viralityScore.toFixed(1),
    insights,
    recommendations
  };
}

/**
 * Calculate virality score (0-100) based on engagement distribution
 */
function calculateViralityScore(likes: number, comments: number, shares: number, followers: number): number {
  // Shares are weighted highest (viral indicator)
  // Comments are weighted medium (engagement depth)
  // Likes are weighted lowest (passive engagement)
  const shareWeight = 5;
  const commentWeight = 3;
  const likeWeight = 1;

  const weightedScore = (shares * shareWeight + comments * commentWeight + likes * likeWeight) / followers;

  // Normalize to 0-100 scale
  return Math.min(weightedScore * 20, 100);
}

/**
 * Generate actionable insights based on engagement metrics
 */
function generateEngagementInsights(
  engagementRate: number,
  commentToLikeRatio: number,
  shareRate: number,
  viralityScore: number,
  platform: string,
  rating: string
): string[] {
  const insights: string[] = [];

  // Overall engagement insight
  if (rating === 'Excellent') {
    insights.push(`🎉 Outstanding ${engagementRate.toFixed(2)}% engagement rate - you're in the top 10% of ${platform} accounts!`);
  } else if (rating === 'Good') {
    insights.push(`✅ Solid ${engagementRate.toFixed(2)}% engagement rate - above average for ${platform}`);
  } else if (rating === 'Average') {
    insights.push(`📊 Average ${engagementRate.toFixed(2)}% engagement rate - room for improvement on ${platform}`);
  } else {
    insights.push(`⚠️ ${engagementRate.toFixed(2)}% engagement rate is below ${platform} benchmarks - optimization needed`);
  }

  // Comment-to-like ratio insight
  if (commentToLikeRatio > 10) {
    insights.push(`💬 Excellent comment-to-like ratio (${commentToLikeRatio.toFixed(1)}%) - your content sparks meaningful conversations!`);
  } else if (commentToLikeRatio < 3) {
    insights.push(`🤔 Low comment-to-like ratio (${commentToLikeRatio.toFixed(1)}%) - consider asking more questions to drive discussions`);
  }

  // Share rate insight
  if (shareRate > 0.5) {
    insights.push(`🚀 High share rate (${shareRate.toFixed(2)}%) - your content has strong viral potential!`);
  } else if (shareRate < 0.1) {
    insights.push(`📤 Low share rate (${shareRate.toFixed(2)}%) - create more shareable, value-packed content`);
  }

  // Virality score insight
  if (viralityScore > 70) {
    insights.push(`⭐ Virality score of ${viralityScore.toFixed(0)}/100 - your content is highly shareable and engaging!`);
  } else if (viralityScore < 30) {
    insights.push(`📈 Virality score of ${viralityScore.toFixed(0)}/100 - focus on creating more share-worthy content`);
  }

  return insights.slice(0, 4);
}

/**
 * Generate actionable recommendations
 */
function generateEngagementRecommendations(
  engagementRate: number,
  commentToLikeRatio: number,
  shareRate: number,
  platform: string,
  rating: string
): string[] {
  const recommendations: string[] = [];
  const thresholds = getThresholds(platform);

  // Engagement rate recommendations
  if (engagementRate < thresholds.good) {
    recommendations.push('🎯 Post at optimal times when your audience is most active (use analytics to find peak hours)');
    recommendations.push('📸 Use high-quality visuals and videos - they get 2-3x more engagement than text-only posts');
    recommendations.push('💡 Create content that educates, entertains, or inspires - focus on value over promotion');
  }

  // Comment recommendations
  if (commentToLikeRatio < 5) {
    recommendations.push('❓ Ask open-ended questions in your captions to encourage comments and discussions');
    recommendations.push('💬 Respond to every comment within 1 hour to boost algorithmic visibility and build community');
  }

  // Share recommendations
  if (shareRate < 0.2) {
    recommendations.push('📊 Create data-driven infographics and statistics that people want to share with their network');
    recommendations.push('🎁 Develop "save-worthy" content like tutorials, tips, and resources that provide lasting value');
  }

  // Platform-specific recommendations
  if (platform === 'instagram') {
    recommendations.push('📱 Use Instagram Reels and Stories - they get 3-5x more reach than regular posts');
  } else if (platform === 'tiktok') {
    recommendations.push('🎵 Leverage trending sounds and hashtags to maximize discoverability');
  } else if (platform === 'linkedin') {
    recommendations.push('💼 Share industry insights and thought leadership to establish authority');
  }

  // General best practices
  if (rating === 'Excellent') {
    recommendations.push('🚀 Maintain consistency: Post 3-5x per week at the same times to keep momentum');
    recommendations.push('🤝 Collaborate with other creators in your niche to cross-pollinate audiences');
  }

  return recommendations.slice(0, 5);
}

function getThresholds(platform: string): { excellent: number; good: number; average: number } {
  const thresholds: Record<string, { excellent: number; good: number; average: number }> = {
    instagram: { excellent: 3, good: 1.5, average: 0.5 },
    facebook: { excellent: 1, good: 0.5, average: 0.2 },
    twitter: { excellent: 0.5, good: 0.2, average: 0.1 },
    linkedin: { excellent: 2, good: 1, average: 0.5 },
    tiktok: { excellent: 5, good: 3, average: 1 }
  };

  return thresholds[platform] || thresholds.instagram;
}

function getEngagementRating(rate: number, platform: string): 'Excellent' | 'Good' | 'Average' | 'Poor' {
  const thresholds: Record<string, { excellent: number; good: number; average: number }> = {
    instagram: { excellent: 3, good: 1.5, average: 0.5 },
    facebook: { excellent: 1, good: 0.5, average: 0.2 },
    twitter: { excellent: 0.5, good: 0.2, average: 0.1 },
    linkedin: { excellent: 2, good: 1, average: 0.5 },
    tiktok: { excellent: 5, good: 3, average: 1 }
  };

  const threshold = thresholds[platform] || thresholds.instagram;

  if (rate >= threshold.excellent) return 'Excellent';
  if (rate >= threshold.good) return 'Good';
  if (rate >= threshold.average) return 'Average';
  return 'Poor';
}

function getBenchmark(platform: string): string {
  const benchmarks: Record<string, string> = {
    instagram: '1-3% (avg: 1.5%)',
    facebook: '0.2-1% (avg: 0.5%)',
    twitter: '0.1-0.5% (avg: 0.2%)',
    linkedin: '0.5-2% (avg: 1%)',
    tiktok: '3-5% (avg: 4%)'
  };

  return benchmarks[platform] || benchmarks.instagram;
}
