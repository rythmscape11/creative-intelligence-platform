export type SocialPlatform = 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'facebook';

export interface HashtagSuggestion {
  hashtag: string;
  volume: 'High' | 'Medium' | 'Low';
  competition: 'High' | 'Medium' | 'Low';
  category: 'Trending' | 'Niche' | 'Branded' | 'Community';
}

export function generateHashtags(keyword: string, platform: SocialPlatform): HashtagSuggestion[] {
  const baseKeyword = keyword.toLowerCase().trim().replace(/\s+/g, '');
  const suggestions: HashtagSuggestion[] = [];

  // Branded hashtags
  suggestions.push({
    hashtag: `#${baseKeyword}`,
    volume: 'Medium',
    competition: 'Medium',
    category: 'Branded'
  });

  // Trending variations
  const trendingPrefixes = ['best', 'top', 'daily', 'weekly', 'new'];
  trendingPrefixes.forEach(prefix => {
    suggestions.push({
      hashtag: `#${prefix}${baseKeyword}`,
      volume: 'High',
      competition: 'High',
      category: 'Trending'
    });
  });

  // Niche hashtags
  const nicheSuffixes = ['tips', 'hacks', 'ideas', 'inspiration', 'goals'];
  nicheSuffixes.forEach(suffix => {
    suggestions.push({
      hashtag: `#${baseKeyword}${suffix}`,
      volume: 'Low',
      competition: 'Low',
      category: 'Niche'
    });
  });

  // Community hashtags
  const communitySuffixes = ['community', 'lovers', 'life', 'gram', 'daily'];
  communitySuffixes.forEach(suffix => {
    suggestions.push({
      hashtag: `#${baseKeyword}${suffix}`,
      volume: 'Medium',
      competition: 'Medium',
      category: 'Community'
    });
  });

  // Platform-specific hashtags
  if (platform === 'instagram') {
    suggestions.push(
      { hashtag: '#instagood', volume: 'High', competition: 'High', category: 'Trending' },
      { hashtag: '#photooftheday', volume: 'High', competition: 'High', category: 'Trending' }
    );
  } else if (platform === 'twitter') {
    suggestions.push(
      { hashtag: '#trending', volume: 'High', competition: 'High', category: 'Trending' }
    );
  } else if (platform === 'linkedin') {
    suggestions.push(
      { hashtag: '#professional', volume: 'Medium', competition: 'Medium', category: 'Community' },
      { hashtag: '#business', volume: 'High', competition: 'High', category: 'Trending' }
    );
  } else if (platform === 'tiktok') {
    suggestions.push(
      { hashtag: '#fyp', volume: 'High', competition: 'High', category: 'Trending' },
      { hashtag: '#viral', volume: 'High', competition: 'High', category: 'Trending' }
    );
  }

  return suggestions.slice(0, 20); // Return top 20
}

export function getOptimalHashtagCount(platform: SocialPlatform): { min: number; max: number; recommended: number } {
  switch (platform) {
    case 'instagram':
      return { min: 5, max: 30, recommended: 11 };
    case 'twitter':
      return { min: 1, max: 2, recommended: 2 };
    case 'linkedin':
      return { min: 3, max: 5, recommended: 3 };
    case 'tiktok':
      return { min: 3, max: 5, recommended: 4 };
    case 'facebook':
      return { min: 1, max: 3, recommended: 2 };
    default:
      return { min: 1, max: 5, recommended: 3 };
  }
}

