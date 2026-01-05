/**
 * Heatmaps - Simulated click tracking and scroll depth analysis
 * No external dependencies - generates realistic heatmap data
 */

export interface ClickPoint {
  x: number;
  y: number;
  timestamp: string;
  element: string;
}

export interface ScrollData {
  depth: number;
  timestamp: string;
  duration: number;
}

export interface Session {
  id: string;
  pageUrl: string;
  startTime: string;
  duration: number;
  clicks: ClickPoint[];
  scrollData: ScrollData[];
  deviceType: 'desktop' | 'mobile' | 'tablet';
  exitPoint: number;
}

export interface PageHeatmap {
  pageUrl: string;
  totalSessions: number;
  totalClicks: number;
  avgScrollDepth: number;
  avgSessionDuration: number;
  clickHeatmap: ClickPoint[];
  scrollDepthDistribution: { depth: number; count: number }[];
  topClickedElements: { element: string; clicks: number }[];
}

/**
 * Generate simulated click points for a page
 */
export function generateClickPoints(count: number, pageHeight: number = 2000): ClickPoint[] {
  const elements = [
    'CTA Button',
    'Navigation Link',
    'Product Image',
    'Read More',
    'Sign Up Form',
    'Social Share',
    'Footer Link',
    'Hero Banner',
    'Pricing Card',
    'Feature Card'
  ];
  
  const clicks: ClickPoint[] = [];
  
  // Create hotspots (areas with more clicks)
  const hotspots = [
    { x: 50, y: 20, intensity: 0.4 }, // Hero CTA
    { x: 30, y: 40, intensity: 0.25 }, // Left feature
    { x: 70, y: 40, intensity: 0.25 }, // Right feature
    { x: 50, y: 80, intensity: 0.1 }, // Footer
  ];
  
  for (let i = 0; i < count; i++) {
    // Choose a hotspot based on intensity
    const rand = Math.random();
    let cumulativeIntensity = 0;
    let selectedHotspot = hotspots[0];
    
    for (const hotspot of hotspots) {
      cumulativeIntensity += hotspot.intensity;
      if (rand <= cumulativeIntensity) {
        selectedHotspot = hotspot;
        break;
      }
    }
    
    // Add some randomness around the hotspot
    const x = Math.max(0, Math.min(100, selectedHotspot.x + (Math.random() - 0.5) * 20));
    const y = Math.max(0, Math.min(100, selectedHotspot.y + (Math.random() - 0.5) * 15));
    
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    clicks.push({ x, y, timestamp, element });
  }
  
  return clicks;
}

/**
 * Generate scroll depth distribution
 */
export function generateScrollDepthDistribution(sessionCount: number): { depth: number; count: number }[] {
  const distribution: { depth: number; count: number }[] = [];
  
  // Most users scroll to some depth, fewer reach the bottom
  const depths = [0, 25, 50, 75, 100];
  const weights = [0.05, 0.15, 0.30, 0.30, 0.20]; // Fewer at 0%, more at middle, some at 100%
  
  depths.forEach((depth, index) => {
    const count = Math.floor(sessionCount * weights[index]);
    distribution.push({ depth, count });
  });
  
  return distribution;
}

/**
 * Generate simulated sessions for a page
 */
export function generateSessions(pageUrl: string, count: number): Session[] {
  const sessions: Session[] = [];
  const deviceTypes: ('desktop' | 'mobile' | 'tablet')[] = ['desktop', 'mobile', 'tablet'];
  const deviceWeights = [0.6, 0.3, 0.1]; // 60% desktop, 30% mobile, 10% tablet
  
  for (let i = 0; i < count; i++) {
    // Select device type based on weights
    const rand = Math.random();
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    let cumulative = 0;
    
    for (let j = 0; j < deviceTypes.length; j++) {
      cumulative += deviceWeights[j];
      if (rand <= cumulative) {
        deviceType = deviceTypes[j];
        break;
      }
    }
    
    const startTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
    const duration = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
    
    // Generate clicks for this session (0-10 clicks)
    const clickCount = Math.floor(Math.random() * 11);
    const clicks = generateClickPoints(clickCount);
    
    // Generate scroll data
    const maxScrollDepth = Math.floor(Math.random() * 100);
    const scrollData: ScrollData[] = [];
    
    for (let depth = 0; depth <= maxScrollDepth; depth += 25) {
      scrollData.push({
        depth,
        timestamp: new Date(new Date(startTime).getTime() + (depth / maxScrollDepth) * duration * 1000).toISOString(),
        duration: Math.floor((depth / maxScrollDepth) * duration)
      });
    }
    
    sessions.push({
      id: `session-${i}`,
      pageUrl,
      startTime,
      duration,
      clicks,
      scrollData,
      deviceType,
      exitPoint: maxScrollDepth
    });
  }
  
  return sessions;
}

/**
 * Generate page heatmap from sessions
 */
export function generatePageHeatmap(pageUrl: string, sessionCount: number = 100): PageHeatmap {
  const sessions = generateSessions(pageUrl, sessionCount);
  
  // Aggregate all clicks
  const allClicks: ClickPoint[] = [];
  sessions.forEach(session => {
    allClicks.push(...session.clicks);
  });
  
  // Calculate average scroll depth
  const avgScrollDepth = sessions.reduce((sum, s) => sum + s.exitPoint, 0) / sessions.length;
  
  // Calculate average session duration
  const avgSessionDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
  
  // Get scroll depth distribution
  const scrollDepthDistribution = generateScrollDepthDistribution(sessionCount);
  
  // Get top clicked elements
  const elementClicks = new Map<string, number>();
  allClicks.forEach(click => {
    elementClicks.set(click.element, (elementClicks.get(click.element) || 0) + 1);
  });
  
  const topClickedElements = Array.from(elementClicks.entries())
    .map(([element, clicks]) => ({ element, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
  
  return {
    pageUrl,
    totalSessions: sessionCount,
    totalClicks: allClicks.length,
    avgScrollDepth: Math.round(avgScrollDepth),
    avgSessionDuration: Math.round(avgSessionDuration),
    clickHeatmap: allClicks,
    scrollDepthDistribution,
    topClickedElements
  };
}

/**
 * Generate tracking script code
 */
export function generateTrackingScript(siteId: string): string {
  return `<!-- MediaPlanPro Heatmap Tracking -->
<script>
(function() {
  var siteId = '${siteId}';
  var apiEndpoint = 'https://track.mediaplanpro.com/collect';
  
  // Track clicks
  document.addEventListener('click', function(e) {
    var x = (e.clientX / window.innerWidth) * 100;
    var y = ((e.clientY + window.scrollY) / document.body.scrollHeight) * 100;
    var element = e.target.tagName + (e.target.className ? '.' + e.target.className.split(' ')[0] : '');
    
    sendEvent('click', {
      x: x,
      y: y,
      element: element,
      pageUrl: window.location.pathname
    });
  });
  
  // Track scroll depth
  var maxScroll = 0;
  var scrollTimer;
  
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      var scrollDepth = ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100;
      
      if (scrollDepth > maxScroll) {
        maxScroll = scrollDepth;
        sendEvent('scroll', {
          depth: Math.round(scrollDepth),
          pageUrl: window.location.pathname
        });
      }
    }, 150);
  });
  
  // Track session
  var sessionStart = Date.now();
  
  window.addEventListener('beforeunload', function() {
    var duration = Math.round((Date.now() - sessionStart) / 1000);
    sendEvent('session', {
      duration: duration,
      exitPoint: maxScroll,
      pageUrl: window.location.pathname
    });
  });
  
  // Send event to server
  function sendEvent(type, data) {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(apiEndpoint, JSON.stringify({
        siteId: siteId,
        type: type,
        data: data,
        timestamp: new Date().toISOString()
      }));
    }
  }
})();
</script>`;
}

/**
 * Export heatmap data to CSV
 */
export function exportHeatmapCSV(heatmap: PageHeatmap): string {
  const headers = ['Element', 'Clicks', 'Percentage'];
  
  const totalClicks = heatmap.totalClicks;
  const rows = heatmap.topClickedElements.map(item => [
    item.element,
    item.clicks.toString(),
    `${((item.clicks / totalClicks) * 100).toFixed(2)}%`
  ]);
  
  const csv = [
    `Heatmap Report - ${heatmap.pageUrl}`,
    `Total Sessions: ${heatmap.totalSessions}`,
    `Total Clicks: ${heatmap.totalClicks}`,
    `Avg Scroll Depth: ${heatmap.avgScrollDepth}%`,
    `Avg Session Duration: ${heatmap.avgSessionDuration}s`,
    '',
    'SCROLL DEPTH DISTRIBUTION',
    'Depth,Sessions',
    ...heatmap.scrollDepthDistribution.map(d => `${d.depth}%,${d.count}`),
    '',
    'TOP CLICKED ELEMENTS',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csv;
}

/**
 * Get heatmap intensity for a point (for visualization)
 */
export function getHeatmapIntensity(x: number, y: number, clicks: ClickPoint[], radius: number = 5): number {
  let intensity = 0;
  
  clicks.forEach(click => {
    const distance = Math.sqrt(Math.pow(x - click.x, 2) + Math.pow(y - click.y, 2));
    if (distance < radius) {
      intensity += (1 - distance / radius);
    }
  });
  
  return Math.min(1, intensity / 10); // Normalize to 0-1
}

