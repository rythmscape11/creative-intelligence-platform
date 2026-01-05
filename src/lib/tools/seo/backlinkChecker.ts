export interface BacklinkData {
  url: string;
  anchorText: string;
  doFollow: boolean;
}

export interface BacklinkAnalysis {
  totalBacklinks: number;
  doFollowCount: number;
  noFollowCount: number;
  healthScore: number;
  rating: string;
  anchorTextDiversity: number;
  recommendations: string[];
  topAnchors: { text: string; count: number }[];
}

export function analyzeBacklinks(backlinks: BacklinkData[]): BacklinkAnalysis {
  const totalBacklinks = backlinks.length;
  const doFollowCount = backlinks.filter(b => b.doFollow).length;
  const noFollowCount = totalBacklinks - doFollowCount;
  
  // Calculate anchor text diversity
  const anchorTexts = new Map<string, number>();
  backlinks.forEach(b => {
    const text = b.anchorText.toLowerCase();
    anchorTexts.set(text, (anchorTexts.get(text) || 0) + 1);
  });
  
  const uniqueAnchors = anchorTexts.size;
  const anchorTextDiversity = totalBacklinks > 0 
    ? Math.round((uniqueAnchors / totalBacklinks) * 100) 
    : 0;
  
  // Calculate health score
  let healthScore = 0;
  
  // DoFollow ratio (max 40 points)
  const doFollowRatio = totalBacklinks > 0 ? doFollowCount / totalBacklinks : 0;
  healthScore += Math.min(40, doFollowRatio * 50);
  
  // Anchor text diversity (max 30 points)
  healthScore += Math.min(30, anchorTextDiversity * 0.5);
  
  // Total backlinks (max 30 points)
  if (totalBacklinks >= 100) healthScore += 30;
  else if (totalBacklinks >= 50) healthScore += 20;
  else if (totalBacklinks >= 20) healthScore += 10;
  else if (totalBacklinks >= 10) healthScore += 5;
  
  healthScore = Math.round(Math.min(100, healthScore));
  
  // Determine rating
  let rating = '';
  if (healthScore >= 80) rating = 'Excellent';
  else if (healthScore >= 60) rating = 'Good';
  else if (healthScore >= 40) rating = 'Fair';
  else rating = 'Needs Improvement';
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (doFollowRatio < 0.5) {
    recommendations.push('Increase dofollow backlinks - aim for 60-70% dofollow ratio');
  }
  
  if (anchorTextDiversity < 50) {
    recommendations.push('Diversify anchor text to avoid over-optimization penalties');
  }
  
  if (totalBacklinks < 20) {
    recommendations.push('Build more backlinks through guest posting and outreach');
  }
  
  recommendations.push('Focus on high-authority domains (DA 50+)');
  recommendations.push('Regularly audit and disavow toxic backlinks');
  recommendations.push('Monitor competitor backlinks for opportunities');
  
  if (healthScore >= 80) {
    recommendations.push('Great backlink profile! Maintain quality over quantity');
  }
  
  // Get top anchors
  const topAnchors = Array.from(anchorTexts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    totalBacklinks,
    doFollowCount,
    noFollowCount,
    healthScore,
    rating,
    anchorTextDiversity,
    recommendations,
    topAnchors
  };
}

export function parseBacklinkList(text: string): BacklinkData[] {
  const lines = text.split('\n').filter(line => line.trim());
  const backlinks: BacklinkData[] = [];
  
  lines.forEach(line => {
    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      backlinks.push({
        url: parts[0],
        anchorText: parts[1],
        doFollow: parts[2]?.toLowerCase() !== 'nofollow'
      });
    }
  });
  
  return backlinks;
}

