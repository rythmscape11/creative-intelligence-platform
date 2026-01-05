/**
 * Attribution - Multi-touch attribution modeling
 * No external dependencies - client-side attribution calculations
 */

export type AttributionModel = 'first-touch' | 'last-touch' | 'linear' | 'position-based' | 'time-decay';

export interface Touchpoint {
  channel: string;
  timestamp: string;
  position: number;
}

export interface Journey {
  id: string;
  touchpoints: Touchpoint[];
  converted: boolean;
  revenue: number;
  conversionDate: string | null;
}

export interface ChannelAttribution {
  channel: string;
  credit: number;
  conversions: number;
  revenue: number;
  sessions: number;
  conversionRate: number;
  revenuePerSession: number;
}

export interface AttributionReport {
  model: AttributionModel;
  totalConversions: number;
  totalRevenue: number;
  totalSessions: number;
  channels: ChannelAttribution[];
  journeyStats: {
    avgTouchpoints: number;
    avgJourneyLength: number;
    multiTouchJourneys: number;
  };
}

/**
 * Generate sample customer journeys
 */
export function generateSampleJourneys(count: number = 100): Journey[] {
  const channels = ['Organic Search', 'Paid Search', 'Social Media', 'Direct', 'Email', 'Referral', 'Display Ads'];
  const journeys: Journey[] = [];
  
  for (let i = 0; i < count; i++) {
    const touchpointCount = Math.floor(Math.random() * 5) + 1; // 1-5 touchpoints
    const touchpoints: Touchpoint[] = [];
    
    // Generate touchpoints over time
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
    
    for (let j = 0; j < touchpointCount; j++) {
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const timestamp = new Date(startDate);
      timestamp.setHours(timestamp.getHours() + (j * 24)); // Space out by days
      
      touchpoints.push({
        channel,
        timestamp: timestamp.toISOString(),
        position: j
      });
    }
    
    // 30% conversion rate
    const converted = Math.random() < 0.3;
    const revenue = converted ? Math.floor(Math.random() * 500) + 50 : 0;
    
    journeys.push({
      id: `journey-${i}`,
      touchpoints,
      converted,
      revenue,
      conversionDate: converted ? touchpoints[touchpoints.length - 1].timestamp : null
    });
  }
  
  return journeys;
}

/**
 * First Touch Attribution - All credit to first touchpoint
 */
function firstTouchAttribution(journeys: Journey[]): Map<string, number> {
  const attribution = new Map<string, number>();
  
  journeys.forEach(journey => {
    if (journey.converted && journey.touchpoints.length > 0) {
      const firstChannel = journey.touchpoints[0].channel;
      attribution.set(firstChannel, (attribution.get(firstChannel) || 0) + 1);
    }
  });
  
  return attribution;
}

/**
 * Last Touch Attribution - All credit to last touchpoint
 */
function lastTouchAttribution(journeys: Journey[]): Map<string, number> {
  const attribution = new Map<string, number>();
  
  journeys.forEach(journey => {
    if (journey.converted && journey.touchpoints.length > 0) {
      const lastChannel = journey.touchpoints[journey.touchpoints.length - 1].channel;
      attribution.set(lastChannel, (attribution.get(lastChannel) || 0) + 1);
    }
  });
  
  return attribution;
}

/**
 * Linear Attribution - Equal credit to all touchpoints
 */
function linearAttribution(journeys: Journey[]): Map<string, number> {
  const attribution = new Map<string, number>();
  
  journeys.forEach(journey => {
    if (journey.converted && journey.touchpoints.length > 0) {
      const credit = 1 / journey.touchpoints.length;
      
      journey.touchpoints.forEach(touchpoint => {
        attribution.set(
          touchpoint.channel,
          (attribution.get(touchpoint.channel) || 0) + credit
        );
      });
    }
  });
  
  return attribution;
}

/**
 * Position-Based Attribution - 40% first, 40% last, 20% middle
 */
function positionBasedAttribution(journeys: Journey[]): Map<string, number> {
  const attribution = new Map<string, number>();
  
  journeys.forEach(journey => {
    if (journey.converted && journey.touchpoints.length > 0) {
      const touchpointCount = journey.touchpoints.length;
      
      if (touchpointCount === 1) {
        // Single touchpoint gets 100%
        const channel = journey.touchpoints[0].channel;
        attribution.set(channel, (attribution.get(channel) || 0) + 1);
      } else if (touchpointCount === 2) {
        // Two touchpoints: 50% each
        journey.touchpoints.forEach(touchpoint => {
          attribution.set(
            touchpoint.channel,
            (attribution.get(touchpoint.channel) || 0) + 0.5
          );
        });
      } else {
        // Multiple touchpoints: 40% first, 40% last, 20% split among middle
        const firstChannel = journey.touchpoints[0].channel;
        const lastChannel = journey.touchpoints[touchpointCount - 1].channel;
        const middleCredit = 0.2 / (touchpointCount - 2);
        
        attribution.set(firstChannel, (attribution.get(firstChannel) || 0) + 0.4);
        attribution.set(lastChannel, (attribution.get(lastChannel) || 0) + 0.4);
        
        for (let i = 1; i < touchpointCount - 1; i++) {
          const channel = journey.touchpoints[i].channel;
          attribution.set(channel, (attribution.get(channel) || 0) + middleCredit);
        }
      }
    }
  });
  
  return attribution;
}

/**
 * Time Decay Attribution - More credit to recent touchpoints
 */
function timeDecayAttribution(journeys: Journey[]): Map<string, number> {
  const attribution = new Map<string, number>();
  const halfLife = 7; // 7 days half-life
  
  journeys.forEach(journey => {
    if (journey.converted && journey.touchpoints.length > 0) {
      const conversionTime = new Date(journey.touchpoints[journey.touchpoints.length - 1].timestamp).getTime();
      
      // Calculate weights based on time decay
      const weights = journey.touchpoints.map(touchpoint => {
        const touchpointTime = new Date(touchpoint.timestamp).getTime();
        const daysDiff = (conversionTime - touchpointTime) / (1000 * 60 * 60 * 24);
        return Math.pow(2, -daysDiff / halfLife);
      });
      
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      // Distribute credit based on normalized weights
      journey.touchpoints.forEach((touchpoint, index) => {
        const credit = weights[index] / totalWeight;
        attribution.set(
          touchpoint.channel,
          (attribution.get(touchpoint.channel) || 0) + credit
        );
      });
    }
  });
  
  return attribution;
}

/**
 * Calculate attribution based on selected model
 */
export function calculateAttribution(
  journeys: Journey[],
  model: AttributionModel
): Map<string, number> {
  switch (model) {
    case 'first-touch':
      return firstTouchAttribution(journeys);
    case 'last-touch':
      return lastTouchAttribution(journeys);
    case 'linear':
      return linearAttribution(journeys);
    case 'position-based':
      return positionBasedAttribution(journeys);
    case 'time-decay':
      return timeDecayAttribution(journeys);
    default:
      return new Map();
  }
}

/**
 * Generate full attribution report
 */
export function generateAttributionReport(
  journeys: Journey[],
  model: AttributionModel
): AttributionReport {
  const attribution = calculateAttribution(journeys, model);
  
  // Calculate channel sessions (all touchpoints, not just conversions)
  const channelSessions = new Map<string, number>();
  journeys.forEach(journey => {
    const seenChannels = new Set<string>();
    journey.touchpoints.forEach(touchpoint => {
      if (!seenChannels.has(touchpoint.channel)) {
        channelSessions.set(
          touchpoint.channel,
          (channelSessions.get(touchpoint.channel) || 0) + 1
        );
        seenChannels.add(touchpoint.channel);
      }
    });
  });
  
  // Calculate revenue attribution
  const revenueAttribution = new Map<string, number>();
  journeys.forEach(journey => {
    if (journey.converted && journey.revenue > 0) {
      const journeyAttribution = calculateAttribution([journey], model);
      journeyAttribution.forEach((credit, channel) => {
        revenueAttribution.set(
          channel,
          (revenueAttribution.get(channel) || 0) + (credit * journey.revenue)
        );
      });
    }
  });
  
  // Build channel attribution array
  const channels: ChannelAttribution[] = [];
  const allChannels = new Set([...attribution.keys(), ...channelSessions.keys()]);
  
  allChannels.forEach(channel => {
    const conversions = attribution.get(channel) || 0;
    const sessions = channelSessions.get(channel) || 0;
    const revenue = revenueAttribution.get(channel) || 0;
    
    channels.push({
      channel,
      credit: Math.round(conversions * 100) / 100,
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
      sessions,
      conversionRate: sessions > 0 ? Math.round((conversions / sessions) * 1000) / 10 : 0,
      revenuePerSession: sessions > 0 ? Math.round((revenue / sessions) * 100) / 100 : 0
    });
  });
  
  // Sort by conversions descending
  channels.sort((a, b) => b.conversions - a.conversions);
  
  // Calculate journey stats
  const convertedJourneys = journeys.filter(j => j.converted);
  const avgTouchpoints = convertedJourneys.length > 0
    ? convertedJourneys.reduce((sum, j) => sum + j.touchpoints.length, 0) / convertedJourneys.length
    : 0;
  
  const avgJourneyLength = convertedJourneys.length > 0
    ? convertedJourneys.reduce((sum, j) => {
        const first = new Date(j.touchpoints[0].timestamp);
        const last = new Date(j.touchpoints[j.touchpoints.length - 1].timestamp);
        return sum + (last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24);
      }, 0) / convertedJourneys.length
    : 0;
  
  const multiTouchJourneys = convertedJourneys.filter(j => j.touchpoints.length > 1).length;
  
  return {
    model,
    totalConversions: Math.round(channels.reduce((sum, c) => sum + c.conversions, 0)),
    totalRevenue: Math.round(channels.reduce((sum, c) => sum + c.revenue, 0)),
    totalSessions: channels.reduce((sum, c) => sum + c.sessions, 0),
    channels,
    journeyStats: {
      avgTouchpoints: Math.round(avgTouchpoints * 10) / 10,
      avgJourneyLength: Math.round(avgJourneyLength * 10) / 10,
      multiTouchJourneys
    }
  };
}

/**
 * Export attribution report to CSV
 */
export function exportAttributionCSV(report: AttributionReport): string {
  const headers = ['Channel', 'Sessions', 'Conversions', 'Conversion Rate', 'Revenue', 'Revenue/Session', 'Attribution Credit'];
  
  const rows = report.channels.map(channel => [
    channel.channel,
    channel.sessions.toString(),
    channel.conversions.toString(),
    `${channel.conversionRate}%`,
    `$${channel.revenue.toLocaleString()}`,
    `$${channel.revenuePerSession}`,
    channel.credit.toFixed(2)
  ]);
  
  const csv = [
    `Attribution Report - ${report.model.replace('-', ' ').toUpperCase()}`,
    `Total Sessions: ${report.totalSessions}`,
    `Total Conversions: ${report.totalConversions}`,
    `Total Revenue: $${report.totalRevenue.toLocaleString()}`,
    `Avg Touchpoints: ${report.journeyStats.avgTouchpoints}`,
    `Avg Journey Length: ${report.journeyStats.avgJourneyLength} days`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csv;
}

