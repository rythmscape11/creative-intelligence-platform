/**
 * AI Content Repurposer - Template-based content transformation
 * No external API dependencies - uses intelligent templates and formatting rules
 */

export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'facebook' | 'tiktok';

export interface PlatformConfig {
  id: Platform;
  name: string;
  maxLength: number;
  hashtagLimit: number;
  style: 'professional' | 'casual' | 'engaging';
  features: string[];
}

export const platformConfigs: Record<Platform, PlatformConfig> = {
  twitter: {
    id: 'twitter',
    name: 'Twitter/X Thread',
    maxLength: 280,
    hashtagLimit: 3,
    style: 'casual',
    features: ['threads', 'hashtags', 'mentions']
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn Post',
    maxLength: 3000,
    hashtagLimit: 5,
    style: 'professional',
    features: ['long-form', 'professional-tone', 'hashtags']
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram Caption',
    maxLength: 2200,
    hashtagLimit: 30,
    style: 'engaging',
    features: ['hashtags', 'emojis', 'call-to-action']
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube Description',
    maxLength: 5000,
    hashtagLimit: 15,
    style: 'engaging',
    features: ['timestamps', 'links', 'chapters']
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook Post',
    maxLength: 63206,
    hashtagLimit: 5,
    style: 'casual',
    features: ['long-form', 'questions', 'engagement']
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok Caption',
    maxLength: 2200,
    hashtagLimit: 5,
    style: 'casual',
    features: ['hashtags', 'trends', 'hooks']
  }
};

/**
 * Extract key points from source content
 */
function extractKeyPoints(content: string): string[] {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyPoints: string[] = [];
  
  // Look for sentences with key indicators
  const indicators = ['important', 'key', 'essential', 'critical', 'must', 'should', 'need to', 'how to', 'why'];
  
  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase();
    if (indicators.some(indicator => lower.includes(indicator))) {
      keyPoints.push(sentence.trim());
    }
  });
  
  // If not enough key points, take first few sentences
  if (keyPoints.length < 3) {
    return sentences.slice(0, 5).map(s => s.trim());
  }
  
  return keyPoints.slice(0, 5);
}

/**
 * Generate relevant hashtags based on content
 */
function generateHashtags(content: string, limit: number): string[] {
  const words = content.toLowerCase().split(/\s+/);
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they']);
  
  // Extract potential hashtag words (longer, meaningful words)
  const hashtagWords = words
    .filter(word => word.length > 4 && !commonWords.has(word))
    .filter(word => /^[a-z]+$/.test(word));
  
  // Count frequency
  const frequency: Record<string, number> = {};
  hashtagWords.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // Sort by frequency and take top words
  const topWords = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
  
  // Add some generic marketing hashtags
  const genericHashtags = ['marketing', 'business', 'growth', 'strategy', 'tips', 'success', 'entrepreneur'];
  const combined = [...topWords, ...genericHashtags.filter(h => !topWords.includes(h))];
  
  return combined.slice(0, limit).map(tag => `#${tag.charAt(0).toUpperCase() + tag.slice(1)}`);
}

/**
 * Create Twitter thread from content
 */
function createTwitterThread(content: string): string {
  const keyPoints = extractKeyPoints(content);
  const hashtags = generateHashtags(content, 3);
  
  let thread = '🧵 Thread:\n\n';
  
  // First tweet - hook
  const firstSentence = content.split(/[.!?]/)[0];
  thread += `1/ ${firstSentence}.\n\n`;
  
  // Key points as tweets
  keyPoints.forEach((point, i) => {
    const tweetNum = i + 2;
    let tweet = `${tweetNum}/ ${point}`;
    if (tweet.length > 280) {
      tweet = tweet.substring(0, 277) + '...';
    }
    thread += tweet + '\n\n';
  });
  
  // Final tweet with CTA
  thread += `${keyPoints.length + 2}/ Found this helpful? Follow for more insights! ${hashtags.slice(0, 2).join(' ')}`;
  
  return thread;
}

/**
 * Create LinkedIn post from content
 */
function createLinkedInPost(content: string): string {
  const keyPoints = extractKeyPoints(content);
  const hashtags = generateHashtags(content, 5);
  
  let post = '';
  
  // Hook
  const firstSentence = content.split(/[.!?]/)[0];
  post += `${firstSentence}.\n\n`;
  
  // Key insights
  post += '📊 Key Insights:\n\n';
  keyPoints.forEach((point, i) => {
    post += `${i + 1}. ${point}\n`;
  });
  
  post += '\n';
  
  // Call to action
  post += '💡 What\'s your experience with this? Share your thoughts in the comments!\n\n';
  
  // Hashtags
  post += hashtags.join(' ');
  
  // Trim if too long
  if (post.length > 3000) {
    post = post.substring(0, 2997) + '...';
  }
  
  return post;
}

/**
 * Create Instagram caption from content
 */
function createInstagramCaption(content: string): string {
  const keyPoints = extractKeyPoints(content);
  const hashtags = generateHashtags(content, 15);
  
  let caption = '';
  
  // Hook with emoji
  const firstSentence = content.split(/[.!?]/)[0];
  caption += `✨ ${firstSentence}.\n\n`;
  
  // Key points with emojis
  const emojis = ['💡', '🎯', '🚀', '⭐', '🔥'];
  keyPoints.slice(0, 3).forEach((point, i) => {
    caption += `${emojis[i]} ${point}\n\n`;
  });
  
  // CTA
  caption += '👉 Save this post for later!\n';
  caption += '💬 Drop a comment if you found this helpful!\n\n';
  
  // Hashtags
  caption += '.\n.\n.\n';
  caption += hashtags.join(' ');
  
  // Trim if too long
  if (caption.length > 2200) {
    caption = caption.substring(0, 2197) + '...';
  }
  
  return caption;
}

/**
 * Create YouTube description from content
 */
function createYouTubeDescription(content: string): string {
  const keyPoints = extractKeyPoints(content);
  const hashtags = generateHashtags(content, 10);
  
  let description = '';
  
  // Overview
  const firstSentence = content.split(/[.!?]/)[0];
  description += `${firstSentence}.\n\n`;
  
  // Timestamps (mock)
  description += '⏱️ TIMESTAMPS:\n';
  description += '0:00 - Introduction\n';
  keyPoints.forEach((point, i) => {
    const time = (i + 1) * 2;
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toString().padStart(2, '0');
    description += `${minutes}:${seconds} - ${point.substring(0, 50)}${point.length > 50 ? '...' : ''}\n`;
  });
  description += '\n';
  
  // Resources
  description += '📚 RESOURCES:\n';
  description += '• Free guide: [Your Link Here]\n';
  description += '• Join our community: [Your Link Here]\n\n';
  
  // Social links
  description += '🔗 CONNECT WITH US:\n';
  description += '• Website: [Your Website]\n';
  description += '• Twitter: [Your Twitter]\n';
  description += '• LinkedIn: [Your LinkedIn]\n\n';
  
  // Hashtags
  description += hashtags.join(' ');
  
  return description;
}

/**
 * Create Facebook post from content
 */
function createFacebookPost(content: string): string {
  const keyPoints = extractKeyPoints(content);
  const hashtags = generateHashtags(content, 5);
  
  let post = '';
  
  // Engaging hook
  const firstSentence = content.split(/[.!?]/)[0];
  post += `🎯 ${firstSentence}.\n\n`;
  
  // Story-like format
  post += 'Here\'s what you need to know:\n\n';
  keyPoints.forEach((point, i) => {
    post += `${i + 1}️⃣ ${point}\n\n`;
  });
  
  // Engagement question
  post += '❓ What do you think about this? Let me know in the comments!\n\n';
  
  // Hashtags
  post += hashtags.join(' ');
  
  return post;
}

/**
 * Create TikTok caption from content
 */
function createTikTokCaption(content: string): string {
  const keyPoints = extractKeyPoints(content);
  const hashtags = generateHashtags(content, 5);
  
  let caption = '';
  
  // Hook
  const firstSentence = content.split(/[.!?]/)[0];
  caption += `${firstSentence} 👀\n\n`;
  
  // Quick tips
  keyPoints.slice(0, 3).forEach((point, i) => {
    caption += `${i + 1}. ${point.substring(0, 100)}${point.length > 100 ? '...' : ''}\n`;
  });
  
  caption += '\n';
  
  // Trending hashtags
  caption += `${hashtags.join(' ')} #fyp #foryou #viral`;
  
  // Trim if too long
  if (caption.length > 2200) {
    caption = caption.substring(0, 2197) + '...';
  }
  
  return caption;
}

/**
 * Repurpose content for selected platforms
 */
export function repurposeContent(
  sourceContent: string,
  platforms: Platform[]
): Record<Platform, string> {
  const result: Record<string, string> = {};
  
  platforms.forEach(platform => {
    switch (platform) {
      case 'twitter':
        result[platform] = createTwitterThread(sourceContent);
        break;
      case 'linkedin':
        result[platform] = createLinkedInPost(sourceContent);
        break;
      case 'instagram':
        result[platform] = createInstagramCaption(sourceContent);
        break;
      case 'youtube':
        result[platform] = createYouTubeDescription(sourceContent);
        break;
      case 'facebook':
        result[platform] = createFacebookPost(sourceContent);
        break;
      case 'tiktok':
        result[platform] = createTikTokCaption(sourceContent);
        break;
    }
  });
  
  return result as Record<Platform, string>;
}

