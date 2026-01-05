export interface LandingPageChecklist {
  hasHeadline: boolean;
  hasSubheadline: boolean;
  hasCTA: boolean;
  hasBenefits: boolean;
  hasSocialProof: boolean;
  hasImages: boolean;
  hasVideo: boolean;
  hasTrustSignals: boolean;
  hasMobileOptimized: boolean;
  hasLoadSpeed: boolean;
}

export interface LandingPageAnalysis {
  score: number;
  rating: string;
  completedItems: number;
  totalItems: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export function analyzeLandingPage(checklist: LandingPageChecklist): LandingPageAnalysis {
  const items = Object.values(checklist);
  const completedItems = items.filter(Boolean).length;
  const totalItems = items.length;
  const score = Math.round((completedItems / totalItems) * 100);
  
  let rating = '';
  if (score >= 90) rating = 'Excellent';
  else if (score >= 75) rating = 'Good';
  else if (score >= 60) rating = 'Fair';
  else rating = 'Needs Improvement';
  
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (checklist.hasHeadline) {
    strengths.push('Clear headline present');
  } else {
    improvements.push('Add a compelling headline that communicates value');
  }
  
  if (checklist.hasCTA) {
    strengths.push('Call-to-action included');
  } else {
    improvements.push('Add a prominent call-to-action button');
  }
  
  if (checklist.hasBenefits) {
    strengths.push('Benefits clearly stated');
  } else {
    improvements.push('List key benefits and features');
  }
  
  if (checklist.hasSocialProof) {
    strengths.push('Social proof elements present');
  } else {
    improvements.push('Add testimonials, reviews, or case studies');
  }
  
  if (checklist.hasTrustSignals) {
    strengths.push('Trust signals included');
  } else {
    improvements.push('Add security badges, guarantees, or certifications');
  }
  
  if (checklist.hasMobileOptimized) {
    strengths.push('Mobile-optimized design');
  } else {
    improvements.push('Optimize for mobile devices (50%+ of traffic)');
  }
  
  if (checklist.hasLoadSpeed) {
    strengths.push('Fast loading speed');
  } else {
    improvements.push('Improve page load speed (target < 3 seconds)');
  }
  
  const recommendations: string[] = [
    'Use A/B testing to optimize conversion rates',
    'Keep forms short (3-5 fields maximum)',
    'Use contrasting colors for CTA buttons',
    'Add urgency or scarcity elements',
    'Remove navigation to reduce distractions',
    'Use high-quality, relevant images',
    'Include a clear value proposition above the fold',
    'Test different headlines and CTAs'
  ];
  
  return {
    score,
    rating,
    completedItems,
    totalItems,
    strengths,
    improvements,
    recommendations: recommendations.slice(0, 5)
  };
}

