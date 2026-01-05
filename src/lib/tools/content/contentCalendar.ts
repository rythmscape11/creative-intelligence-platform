export type ContentType = 'blog' | 'social' | 'email' | 'video' | 'mixed';
export type PostingFrequency = 'daily' | '3x-week' | 'weekly' | '2x-week';

export interface CalendarEntry {
  date: string;
  day: string;
  contentType: string;
  topic: string;
  platform: string;
}

export interface CalendarStats {
  totalPosts: number;
  blogPosts: number;
  socialPosts: number;
  emailCampaigns: number;
  videoPosts: number;
  busiestDay?: string;
  consistencyScore: number;
  byType: Record<string, number>;
  byPlatform: Record<string, number>;
}

const MIN_DAYS = 7;
const MAX_DAYS = 90;

const CONTENT_TOPICS = {
  blog: [
    'How-to Guide', 'Industry Trends', 'Case Study', 'Product Update',
    'Expert Interview', 'Listicle', 'Tutorial', 'Best Practices'
  ],
  social: [
    'Behind the Scenes', 'User Generated Content', 'Poll/Question',
    'Product Showcase', 'Team Spotlight', 'Industry News', 'Tip of the Day'
  ],
  email: [
    'Newsletter', 'Product Launch', 'Special Offer', 'Educational Content',
    'Customer Story', 'Event Invitation', 'Survey', 'Re-engagement'
  ],
  video: [
    'Product Demo', 'Tutorial', 'Customer Testimonial', 'Behind the Scenes',
    'Q&A Session', 'Industry Update', 'How-to Video', 'Webinar'
  ]
};

const PLATFORMS = {
  blog: ['Website Blog'],
  social: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok'],
  email: ['Email Campaign'],
  video: ['YouTube', 'Instagram Reels', 'TikTok', 'LinkedIn Video']
};

function sanitizeDayCount(days: number): number {
  if (!Number.isFinite(days)) {
    throw new Error('Number of days must be a valid number.');
  }
  const rounded = Math.round(days);
  if (rounded < MIN_DAYS || rounded > MAX_DAYS) {
    throw new Error(`Number of days must be between ${MIN_DAYS} and ${MAX_DAYS}.`);
  }
  return rounded;
}

function assertValidDate(date: Date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('Please provide a valid start date.');
  }
}

export function generateContentCalendar(
  startDate: Date,
  days: number,
  contentType: ContentType,
  frequency: PostingFrequency
): CalendarEntry[] {
  assertValidDate(startDate);
  const targetDays = sanitizeDayCount(days);
  const calendar: CalendarEntry[] = [];
  const postsPerWeek = getPostsPerWeek(frequency);

  const currentDate = new Date(startDate);
  let postCount = 0;

  for (let i = 0; i < targetDays; i++) {
    const dayOfWeek = currentDate.getDay();
    const shouldPost = shouldPostOnDay(dayOfWeek, postCount, postsPerWeek);

    if (shouldPost) {
      const type = contentType === 'mixed'
        ? (getRandomContentType() as Exclude<ContentType, 'mixed'>)
        : contentType;

      const topics = CONTENT_TOPICS[type];
      const platforms = PLATFORMS[type];

      if (!topics || !platforms) {
        throw new Error('Unsupported content type selected.');
      }

      calendar.push({
        date: currentDate.toISOString().split('T')[0],
        day: getDayName(dayOfWeek),
        contentType: type.charAt(0).toUpperCase() + type.slice(1),
        topic: topics[postCount % topics.length],
        platform: platforms[postCount % platforms.length]
      });

      postCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (calendar.length === 0) {
    throw new Error('No content slots were generated. Try increasing the number of days or frequency.');
  }

  return calendar;
}

function getPostsPerWeek(frequency: PostingFrequency): number {
  switch (frequency) {
    case 'daily': return 7;
    case '3x-week': return 3;
    case '2x-week': return 2;
    case 'weekly': return 1;
    default: return 3;
  }
}

function shouldPostOnDay(dayOfWeek: number, postCount: number, postsPerWeek: number): boolean {
  if (postsPerWeek === 7) return true; // Daily
  if (postsPerWeek === 1) return dayOfWeek === 2; // Weekly on Tuesday
  if (postsPerWeek === 2) return dayOfWeek === 2 || dayOfWeek === 4; // Tue & Thu
  if (postsPerWeek === 3) return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Mon, Wed, Fri
  return false;
}

function getRandomContentType(): Exclude<ContentType, 'mixed'> {
  const types: Exclude<ContentType, 'mixed'>[] = ['blog', 'social', 'email', 'video'];
  return types[Math.floor(Math.random() * types.length)];
}

function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
}

export function getCalendarStats(calendar: CalendarEntry[]): CalendarStats {
  const byType: Record<string, number> = {};
  const byPlatform: Record<string, number> = {};
  const byDay: Record<string, number> = {};

  calendar.forEach(entry => {
    byType[entry.contentType] = (byType[entry.contentType] || 0) + 1;
    byPlatform[entry.platform] = (byPlatform[entry.platform] || 0) + 1;
    byDay[entry.day] = (byDay[entry.day] || 0) + 1;
  });

  const busiestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]?.[0];
  const uniquePostingDays = Object.keys(byDay).length || 1;
  // Consistency score helps users quickly understand if posts are evenly distributed.
  const consistencyScore = Math.min(100, Math.round((calendar.length / uniquePostingDays) * 10));

  return {
    totalPosts: calendar.length,
    blogPosts: byType.Blog || 0,
    socialPosts: byType.Social || 0,
    emailCampaigns: byType.Email || 0,
    videoPosts: byType.Video || 0,
    busiestDay,
    consistencyScore,
    byType,
    byPlatform
  };
}
