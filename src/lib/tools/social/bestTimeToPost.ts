export type Industry = 'ecommerce' | 'saas' | 'media' | 'education' | 'healthcare' | 'finance';
export type Platform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'pinterest' | 'youtube' | 'threads';

export interface TimeSlot {
  day: string;
  time: string;
  engagement: 'High' | 'Medium' | 'Low';
}

export function getBestTimesToPost(platform: Platform, industry: Industry): TimeSlot[] {
  const baseSchedule = getPlatformSchedule(platform);
  const industryModifier = getIndustryModifier(industry);
  
  return baseSchedule.map(slot => ({
    ...slot,
    engagement: adjustEngagement(slot.engagement, industryModifier)
  }));
}

function getPlatformSchedule(platform: Platform): TimeSlot[] {
  switch (platform) {
    case 'instagram':
      return [
        { day: 'Monday', time: '11:00 AM', engagement: 'High' },
        { day: 'Tuesday', time: '2:00 PM', engagement: 'High' },
        { day: 'Wednesday', time: '11:00 AM', engagement: 'High' },
        { day: 'Thursday', time: '11:00 AM', engagement: 'Medium' },
        { day: 'Friday', time: '10:00 AM', engagement: 'High' },
        { day: 'Saturday', time: '11:00 AM', engagement: 'Medium' },
        { day: 'Sunday', time: '9:00 AM', engagement: 'Low' }
      ];
    case 'facebook':
      return [
        { day: 'Monday', time: '1:00 PM', engagement: 'Medium' },
        { day: 'Tuesday', time: '12:00 PM', engagement: 'High' },
        { day: 'Wednesday', time: '1:00 PM', engagement: 'High' },
        { day: 'Thursday', time: '12:00 PM', engagement: 'High' },
        { day: 'Friday', time: '1:00 PM', engagement: 'Medium' },
        { day: 'Saturday', time: '12:00 PM', engagement: 'Low' },
        { day: 'Sunday', time: '12:00 PM', engagement: 'Low' }
      ];
    case 'twitter':
      return [
        { day: 'Monday', time: '9:00 AM', engagement: 'High' },
        { day: 'Tuesday', time: '9:00 AM', engagement: 'High' },
        { day: 'Wednesday', time: '9:00 AM', engagement: 'High' },
        { day: 'Thursday', time: '9:00 AM', engagement: 'Medium' },
        { day: 'Friday', time: '9:00 AM', engagement: 'Medium' },
        { day: 'Saturday', time: '10:00 AM', engagement: 'Low' },
        { day: 'Sunday', time: '10:00 AM', engagement: 'Low' }
      ];
    case 'linkedin':
      return [
        { day: 'Monday', time: '8:00 AM', engagement: 'High' },
        { day: 'Tuesday', time: '10:00 AM', engagement: 'High' },
        { day: 'Wednesday', time: '9:00 AM', engagement: 'High' },
        { day: 'Thursday', time: '10:00 AM', engagement: 'Medium' },
        { day: 'Friday', time: '9:00 AM', engagement: 'Medium' },
        { day: 'Saturday', time: '10:00 AM', engagement: 'Low' },
        { day: 'Sunday', time: '10:00 AM', engagement: 'Low' }
      ];
    case 'tiktok':
      return [
        { day: 'Monday', time: '6:00 PM', engagement: 'High' },
        { day: 'Tuesday', time: '6:00 PM', engagement: 'High' },
        { day: 'Wednesday', time: '7:00 PM', engagement: 'High' },
        { day: 'Thursday', time: '7:00 PM', engagement: 'High' },
        { day: 'Friday', time: '5:00 PM', engagement: 'High' },
        { day: 'Saturday', time: '11:00 AM', engagement: 'Medium' },
        { day: 'Sunday', time: '7:00 PM', engagement: 'Medium' }
      ];
    case 'pinterest':
      return [
        { day: 'Monday', time: '8:00 PM', engagement: 'Medium' },
        { day: 'Tuesday', time: '9:00 PM', engagement: 'Medium' },
        { day: 'Wednesday', time: '8:00 PM', engagement: 'High' },
        { day: 'Thursday', time: '8:00 PM', engagement: 'High' },
        { day: 'Friday', time: '7:00 PM', engagement: 'Medium' },
        { day: 'Saturday', time: '10:00 AM', engagement: 'High' },
        { day: 'Sunday', time: '10:00 AM', engagement: 'Medium' }
      ];
    case 'youtube':
      return [
        { day: 'Monday', time: '6:00 PM', engagement: 'Medium' },
        { day: 'Tuesday', time: '5:00 PM', engagement: 'High' },
        { day: 'Wednesday', time: '5:00 PM', engagement: 'High' },
        { day: 'Thursday', time: '6:00 PM', engagement: 'High' },
        { day: 'Friday', time: '3:00 PM', engagement: 'Medium' },
        { day: 'Saturday', time: '11:00 AM', engagement: 'High' },
        { day: 'Sunday', time: '11:00 AM', engagement: 'Medium' }
      ];
    case 'threads':
      return [
        { day: 'Monday', time: '8:00 AM', engagement: 'High' },
        { day: 'Tuesday', time: '8:00 AM', engagement: 'High' },
        { day: 'Wednesday', time: '7:00 AM', engagement: 'Medium' },
        { day: 'Thursday', time: '8:00 AM', engagement: 'Medium' },
        { day: 'Friday', time: '9:00 AM', engagement: 'High' },
        { day: 'Saturday', time: '9:00 AM', engagement: 'Low' },
        { day: 'Sunday', time: '9:00 AM', engagement: 'Low' }
      ];
    default:
      return [];
  }
}

function getIndustryModifier(industry: Industry): number {
  switch (industry) {
    case 'ecommerce': return 0;
    case 'saas': return 1;
    case 'media': return 0;
    case 'education': return 1;
    case 'healthcare': return 1;
    case 'finance': return 1;
    default: return 0;
  }
}

function adjustEngagement(engagement: 'High' | 'Medium' | 'Low', modifier: number): 'High' | 'Medium' | 'Low' {
  if (modifier === 0) return engagement;
  
  if (engagement === 'High' && modifier > 0) return 'Medium';
  if (engagement === 'Low' && modifier < 0) return 'Medium';
  
  return engagement;
}
