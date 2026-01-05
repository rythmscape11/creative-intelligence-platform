export type CaptionStyle =
  | 'professional'
  | 'casual'
  | 'inspirational'
  | 'humorous'
  | 'educational'
  | 'storytelling'
  | 'sales'
  | 'community';
export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest' | 'youtube' | 'threads';

export interface CaptionResult {
  caption: string;
  hashtags: string[];
  characterCount: number;
  style: CaptionStyle;
}

const CAPTION_TEMPLATES: Record<CaptionStyle, string[]> = {
  professional: [
    'Excited to share {topic}. {benefit}. Learn more in our latest update.',
    'Industry insight: {topic}. {benefit}. What are your thoughts?',
    'We\'re proud to announce {topic}. {benefit}. Stay tuned for more updates.',
    '{topic} is transforming the way we work. {benefit}. Join the conversation.',
    'Key takeaway: {topic}. {benefit}. Share your experience below.'
  ],
  casual: [
    'Hey everyone! 👋 Just wanted to share {topic}. {benefit}. Let me know what you think!',
    'So excited about {topic}! {benefit}. Who else is loving this?',
    'Can we talk about {topic}? {benefit}. Drop a comment if you agree!',
    'Real talk: {topic}. {benefit}. What\'s your take?',
    'Quick update on {topic}! {benefit}. Swipe to see more ➡️'
  ],
  inspirational: [
    'Every journey starts with a single step. {topic}. {benefit}. Keep pushing forward! 💪',
    'Believe in the power of {topic}. {benefit}. Your potential is limitless.',
    'Success is built on {topic}. {benefit}. Dream big, work hard, stay focused.',
    'Transform your mindset with {topic}. {benefit}. You\'ve got this! ✨',
    'The future belongs to those who {topic}. {benefit}. Start today, thank yourself tomorrow.'
  ],
  humorous: [
    'Me: I should probably {topic}. Also me: {benefit}. 😂 Can anyone relate?',
    'Plot twist: {topic}. {benefit}. I did not see that coming! 🤣',
    'When life gives you {topic}, {benefit}. Just kidding, but seriously...',
    'Nobody: ... Absolutely nobody: ... Me: {topic}. {benefit}. 😅',
    'Breaking news: {topic}. {benefit}. This is not a drill! 🚨'
  ],
  educational: [
    'Did you know? {topic}. {benefit}. Here\'s what you need to know 👇',
    'Quick lesson: {topic}. {benefit}. Save this for later! 📚',
    'Let\'s break down {topic}. {benefit}. Swipe for the full guide ➡️',
    'Master the art of {topic}. {benefit}. Follow for more tips!',
    'Pro tip: {topic}. {benefit}. Tag someone who needs to see this! 🎯'
  ],
  storytelling: [
    'Once upon a deadline: {topic}. {benefit}. Here\'s how it unfolded…',
    'We used to struggle with {topic}, then everything changed. {benefit}.',
    'Behind the scenes of {topic}: {benefit}. Ready for chapter two?',
    'Grab a coffee ☕ Here’s the story of {topic}. {benefit}.',
    'This week’s client win: {topic}. {benefit}. Proud of the team!'
  ],
  sales: [
    '🚀 Limited drop: {topic}. {benefit}. Tap the link before it’s gone!',
    'Your exclusive invite to {topic}. {benefit}. Use code TODAY.',
    'Proof that {topic}. {benefit}. Ready to upgrade?',
    'Only 10 spots left for {topic}. {benefit}. Claim yours now.',
    'Run toward {topic}. {benefit}. DM “READY” to lock it in.'
  ],
  community: [
    'We asked our community about {topic}—{benefit}. What do you think?',
    'Shoutout to everyone championing {topic}. {benefit}. Tag a friend!',
    'Open thread 👉 {topic}. {benefit}. Drop your go-to tip below.',
    'We’re building {topic}. {benefit}. Want in?',
    'Community check-in: {topic}. {benefit}. Sound off in the comments.'
  ]
};

const HASHTAG_SETS: Record<Platform, string[]> = {
  instagram: ['#instagood', '#photooftheday', '#instadaily', '#picoftheday', '#instamood'],
  facebook: ['#facebook', '#socialmedia', '#community', '#trending'],
  twitter: ['#twitter', '#trending', '#viral', '#news'],
  linkedin: ['#linkedin', '#professional', '#business', '#career', '#networking'],
  tiktok: ['#fyp', '#foryou', '#viral', '#trending', '#tiktok'],
  pinterest: ['#pinterest', '#pinspo', '#designinspiration', '#creativecommunity'],
  youtube: ['#youtube', '#creator', '#howto', '#videotips'],
  threads: ['#threads', '#communitychat', '#realtalk', '#buildinpublic']
};

export function generateSocialCaption(
  topic: string,
  benefit: string,
  style: CaptionStyle,
  platform: Platform
): CaptionResult[] {
  // Fallback templates keep expanded dropdown choices from breaking when new styles are selected.
  const templates = CAPTION_TEMPLATES[style] || CAPTION_TEMPLATES.professional;
  const platformHashtags = HASHTAG_SETS[platform] || HASHTAG_SETS.instagram;
  
  const results: CaptionResult[] = templates.map(template => {
    const caption = template
      .replace('{topic}', topic)
      .replace('{benefit}', benefit);
    
    // Generate topic-based hashtags
    const topicWords = topic.toLowerCase().split(' ').filter(word => word.length > 3);
    const topicHashtags = topicWords.slice(0, 3).map(word => `#${word.replace(/[^a-z0-9]/g, '')}`);
    
    const hashtags = [...topicHashtags, ...platformHashtags.slice(0, 2)];
    
    return {
      caption,
      hashtags,
      characterCount: caption.length,
      style
    };
  });
  
  return results;
}

export function getCharacterLimit(platform: Platform): number {
  switch (platform) {
    case 'twitter': return 280;
    case 'instagram': return 2200;
    case 'facebook': return 63206;
    case 'linkedin': return 3000;
    case 'tiktok': return 2200;
    default: return 2200;
  }
}
