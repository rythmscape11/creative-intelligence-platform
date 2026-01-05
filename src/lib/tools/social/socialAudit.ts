export interface AuditItem {
  category: string;
  item: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SocialAuditResult {
  score: number;
  completedItems: number;
  totalItems: number;
  items: AuditItem[];
  recommendations: string[];
  strengths: string[];
  opportunities: string[];
  categoryScores: Record<string, number>;
  actionPlan: Array<{ category: string; items: string[] }>;
}

export function performSocialAudit(checklist: Record<string, boolean>): SocialAuditResult {
  const auditItems: AuditItem[] = [
    // Profile Basics (High Priority)
    { category: 'Profile Basics', item: 'Profile picture is clear and professional', completed: checklist.profilePicture || false, priority: 'High' },
    { category: 'Profile Basics', item: 'Cover/header image is branded', completed: checklist.coverImage || false, priority: 'High' },
    { category: 'Profile Basics', item: 'Bio/description is complete and compelling', completed: checklist.bio || false, priority: 'High' },
    { category: 'Profile Basics', item: 'Contact information is provided', completed: checklist.contact || false, priority: 'High' },
    { category: 'Profile Basics', item: 'Website link is included', completed: checklist.website || false, priority: 'High' },
    
    // Content Strategy (High Priority)
    { category: 'Content Strategy', item: 'Posting consistently (3+ times per week)', completed: checklist.postingFrequency || false, priority: 'High' },
    { category: 'Content Strategy', item: 'Content aligns with brand voice', completed: checklist.brandVoice || false, priority: 'High' },
    { category: 'Content Strategy', item: 'Using relevant hashtags', completed: checklist.hashtags || false, priority: 'Medium' },
    { category: 'Content Strategy', item: 'Mix of content types (images, videos, text)', completed: checklist.contentMix || false, priority: 'Medium' },
    
    // Engagement (Medium Priority)
    { category: 'Engagement', item: 'Responding to comments within 24 hours', completed: checklist.commentResponse || false, priority: 'Medium' },
    { category: 'Engagement', item: 'Engaging with other accounts', completed: checklist.engagement || false, priority: 'Medium' },
    { category: 'Engagement', item: 'Using calls-to-action in posts', completed: checklist.cta || false, priority: 'Medium' },
    
    // Optimization (Medium Priority)
    { category: 'Optimization', item: 'Images are optimized for platform', completed: checklist.imageOptimization || false, priority: 'Medium' },
    { category: 'Optimization', item: 'Posting at optimal times', completed: checklist.postingTimes || false, priority: 'Medium' },
    { category: 'Optimization', item: 'Using analytics to track performance', completed: checklist.analytics || false, priority: 'High' },
    
    // Advanced (Low Priority)
    { category: 'Advanced', item: 'Running paid campaigns', completed: checklist.paidCampaigns || false, priority: 'Low' },
    { category: 'Advanced', item: 'Collaborating with influencers', completed: checklist.influencers || false, priority: 'Low' },
    { category: 'Advanced', item: 'Using Stories/Reels features', completed: checklist.stories || false, priority: 'Medium' },
    { category: 'Advanced', item: 'Cross-promoting on other platforms', completed: checklist.crossPromotion || false, priority: 'Low' },
    { category: 'Advanced', item: 'User-generated content strategy', completed: checklist.ugc || false, priority: 'Low' }
  ];

  const completedItems = auditItems.filter(item => item.completed).length;
  const totalItems = auditItems.length;

  const priorityWeight: Record<AuditItem['priority'], number> = { High: 3, Medium: 2, Low: 1 };
  const weightedTotal = auditItems.reduce((sum, item) => sum + priorityWeight[item.priority], 0);
  const weightedScore = auditItems.reduce(
    (sum, item) => sum + (item.completed ? priorityWeight[item.priority] : 0),
    0
  );
  const score = Math.round((weightedScore / weightedTotal) * 100);

  const categoryScores: Record<string, number> = {};
  auditItems.forEach(item => {
    categoryScores[item.category] = categoryScores[item.category] || 0;
    if (item.completed) {
      categoryScores[item.category] += priorityWeight[item.priority];
    }
  });

  Object.keys(categoryScores).forEach(category => {
    const totalForCategory = auditItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + priorityWeight[item.priority], 0);
    categoryScores[category] = Math.round((categoryScores[category] / totalForCategory) * 100);
  });

  const recommendations: string[] = [];
  
  // Generate recommendations based on incomplete items
  const incompleteHighPriority = auditItems.filter(item => !item.completed && item.priority === 'High');
  const incompleteMediumPriority = auditItems.filter(item => !item.completed && item.priority === 'Medium');
  
  if (incompleteHighPriority.length > 0) {
    recommendations.push(`Complete ${incompleteHighPriority.length} high-priority items first`);
    incompleteHighPriority.slice(0, 3).forEach(item => {
      recommendations.push(`${item.item}`);
    });
  }
  
  if (incompleteMediumPriority.length > 0 && recommendations.length < 5) {
    incompleteMediumPriority.slice(0, 2).forEach(item => {
      recommendations.push(`${item.item}`);
    });
  }
  
  if (score >= 80) {
    recommendations.push('Great job! Your social media presence is strong');
  } else if (score >= 60) {
    recommendations.push('Good progress! Focus on high-priority items to improve');
  } else {
    recommendations.push('Start with profile basics and content strategy');
  }

  const strengths = Object.entries(categoryScores)
    .filter(([, value]) => value >= 80)
    .map(([category]) => `${category} is on track (80%+)`);

  const opportunities = Object.entries(categoryScores)
    .filter(([, value]) => value < 60)
    .map(([category]) => `${category} needs attention (<60%)`);

  // Build an action plan showing the next high-impact fixes instead of a generic list.
  const actionPlan = [
    {
      category: 'High Priority Fixes',
      items: incompleteHighPriority.slice(0, 3).map(item => item.item)
    },
    {
      category: 'Quick Wins',
      items: incompleteMediumPriority.slice(0, 3).map(item => item.item)
    }
  ].filter(section => section.items.length > 0);

  return {
    score,
    completedItems,
    totalItems,
    items: auditItems,
    recommendations,
    strengths,
    opportunities,
    categoryScores,
    actionPlan
  };
}
