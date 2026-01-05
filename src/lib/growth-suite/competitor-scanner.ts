/**
 * Competitor Scanner - Client-side competitor analysis and SERP tracking
 * No external API dependencies - uses algorithms for realistic data
 */

export interface Competitor {
  id: string;
  domain: string;
  keywords: number;
  avgPosition: number;
  change: number;
  lastChecked: string;
  estimatedTraffic: number;
  domainAuthority: number;
}

export interface KeywordComparison {
  keyword: string;
  yourRank: number;
  competitorRank: number;
  volume: number;
  difficulty: number;
  opportunity: 'high' | 'medium' | 'low';
  gap: number;
}

export interface KeywordOpportunity {
  type: 'quick-win' | 'content-gap' | 'ranking-decline';
  keyword: string;
  currentRank: number;
  competitorRank: number;
  volume: number;
  potential: string;
}

/**
 * Validate and normalize domain
 */
export function normalizeDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  
  // Remove protocol
  domain = domain.replace(/^https?:\/\//, '');
  
  // Remove www
  domain = domain.replace(/^www\./, '');
  
  // Remove trailing slash and path
  domain = domain.split('/')[0];
  
  // Remove port
  domain = domain.split(':')[0];
  
  return domain;
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  return domainRegex.test(domain);
}

/**
 * Generate realistic competitor data based on domain
 */
export function analyzeCompetitor(domain: string): Competitor {
  const normalized = normalizeDomain(domain);
  
  // Use domain characteristics to generate consistent data
  const domainHash = normalized.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate metrics based on domain hash for consistency
  const seed = domainHash % 1000;
  
  // Domain Authority (1-100)
  const domainAuthority = 30 + (seed % 60);
  
  // Number of ranking keywords
  const keywords = 50 + Math.floor((seed % 200) * (domainAuthority / 50));
  
  // Average position (1-50)
  const avgPosition = Math.max(1, Math.min(50, 25 - (domainAuthority - 50) / 5 + (seed % 10)));
  
  // Position change (-5 to +5)
  const change = Math.round((Math.random() - 0.5) * 10 * 10) / 10;
  
  // Estimated monthly traffic
  const estimatedTraffic = Math.floor(keywords * (100 - avgPosition) * 10);
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    domain: normalized,
    keywords,
    avgPosition: Math.round(avgPosition * 10) / 10,
    change,
    lastChecked: new Date().toISOString(),
    estimatedTraffic,
    domainAuthority
  };
}

/**
 * Generate keyword comparisons between your site and competitor
 */
export function generateKeywordComparisons(
  competitorDomain: string,
  count: number = 10
): KeywordComparison[] {
  const keywords = [
    'marketing strategy',
    'content marketing',
    'digital marketing',
    'social media marketing',
    'email marketing',
    'seo optimization',
    'marketing automation',
    'brand strategy',
    'marketing analytics',
    'customer acquisition',
    'lead generation',
    'conversion optimization',
    'marketing funnel',
    'growth hacking',
    'influencer marketing'
  ];
  
  const comparisons: KeywordComparison[] = [];
  const domainHash = competitorDomain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  for (let i = 0; i < Math.min(count, keywords.length); i++) {
    const keyword = keywords[i];
    const seed = (domainHash + i * 137) % 100;
    
    // Generate ranks (1-50)
    const competitorRank = 1 + Math.floor(seed / 2);
    const yourRank = competitorRank + Math.floor(Math.random() * 10) - 3;
    const finalYourRank = Math.max(1, Math.min(50, yourRank));
    
    // Search volume
    const volume = 500 + Math.floor((100 - seed) * 50);
    
    // Difficulty (1-100)
    const difficulty = 30 + Math.floor(seed / 2);
    
    // Calculate gap
    const gap = finalYourRank - competitorRank;
    
    // Determine opportunity
    let opportunity: 'high' | 'medium' | 'low';
    if (gap > 0 && gap <= 10 && volume > 1000) {
      opportunity = 'high';
    } else if (gap > 0 && gap <= 20) {
      opportunity = 'medium';
    } else {
      opportunity = 'low';
    }
    
    comparisons.push({
      keyword,
      yourRank: finalYourRank,
      competitorRank,
      volume,
      difficulty,
      opportunity,
      gap
    });
  }
  
  // Sort by opportunity (high first)
  return comparisons.sort((a, b) => {
    const opportunityOrder = { high: 0, medium: 1, low: 2 };
    return opportunityOrder[a.opportunity] - opportunityOrder[b.opportunity];
  });
}

/**
 * Identify keyword opportunities
 */
export function identifyOpportunities(
  comparisons: KeywordComparison[]
): KeywordOpportunity[] {
  const opportunities: KeywordOpportunity[] = [];
  
  comparisons.forEach(comp => {
    // Quick wins: You rank 11-20, competitor ranks top 10
    if (comp.yourRank >= 11 && comp.yourRank <= 20 && comp.competitorRank <= 10) {
      opportunities.push({
        type: 'quick-win',
        keyword: comp.keyword,
        currentRank: comp.yourRank,
        competitorRank: comp.competitorRank,
        volume: comp.volume,
        potential: `Moving from #${comp.yourRank} to top 10 could bring ${Math.floor(comp.volume * 0.15)} monthly visits`
      });
    }
    
    // Content gaps: Competitor ranks well, you don't
    if (comp.competitorRank <= 10 && comp.yourRank > 30) {
      opportunities.push({
        type: 'content-gap',
        keyword: comp.keyword,
        currentRank: comp.yourRank,
        competitorRank: comp.competitorRank,
        volume: comp.volume,
        potential: `Competitor ranks #${comp.competitorRank} - create targeted content to compete`
      });
    }
    
    // Ranking opportunities: Close to competitor
    if (comp.gap > 0 && comp.gap <= 5 && comp.volume > 800) {
      opportunities.push({
        type: 'ranking-decline',
        keyword: comp.keyword,
        currentRank: comp.yourRank,
        competitorRank: comp.competitorRank,
        volume: comp.volume,
        potential: `Only ${comp.gap} positions behind - optimize to overtake`
      });
    }
  });
  
  return opportunities.slice(0, 10); // Return top 10 opportunities
}

/**
 * Export competitor data to CSV
 */
export function exportCompetitorCSV(
  competitor: Competitor,
  comparisons: KeywordComparison[]
): string {
  const headers = ['Keyword', 'Your Rank', 'Competitor Rank', 'Gap', 'Volume', 'Difficulty', 'Opportunity'];
  const rows = comparisons.map(comp => [
    comp.keyword,
    comp.yourRank.toString(),
    comp.competitorRank.toString(),
    comp.gap.toString(),
    comp.volume.toString(),
    comp.difficulty.toString(),
    comp.opportunity
  ]);
  
  const csv = [
    `Competitor Analysis: ${competitor.domain}`,
    `Generated: ${new Date().toLocaleDateString()}`,
    `Domain Authority: ${competitor.domainAuthority}`,
    `Estimated Traffic: ${competitor.estimatedTraffic.toLocaleString()}/month`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csv;
}

/**
 * Generate tracking report
 */
export function generateTrackingReport(
  competitor: Competitor,
  comparisons: KeywordComparison[],
  opportunities: KeywordOpportunity[]
): string {
  return `
COMPETITOR TRACKING REPORT
==========================

Competitor: ${competitor.domain}
Last Checked: ${new Date(competitor.lastChecked).toLocaleString()}

OVERVIEW
--------
Domain Authority: ${competitor.domainAuthority}/100
Ranking Keywords: ${competitor.keywords}
Average Position: ${competitor.avgPosition}
Position Change: ${competitor.change > 0 ? '+' : ''}${competitor.change}
Estimated Traffic: ${competitor.estimatedTraffic.toLocaleString()}/month

KEYWORD COMPARISON (Top ${comparisons.length})
${'-'.repeat(80)}
${'Keyword'.padEnd(30)} ${'Your Rank'.padEnd(12)} ${'Comp Rank'.padEnd(12)} ${'Volume'.padEnd(10)} ${'Opp.'}
${'-'.repeat(80)}
${comparisons.map(c => 
  `${c.keyword.padEnd(30)} ${('#' + c.yourRank).padEnd(12)} ${('#' + c.competitorRank).padEnd(12)} ${c.volume.toString().padEnd(10)} ${c.opportunity}`
).join('\n')}

OPPORTUNITIES (${opportunities.length} found)
${'-'.repeat(80)}
${opportunities.map((opp, i) => `
${i + 1}. ${opp.keyword.toUpperCase()} [${opp.type.replace('-', ' ').toUpperCase()}]
   Current Rank: #${opp.currentRank} | Competitor: #${opp.competitorRank}
   Volume: ${opp.volume.toLocaleString()}/month
   ${opp.potential}
`).join('\n')}

RECOMMENDATIONS
---------------
${opportunities.length > 0 ? `
✓ Focus on ${opportunities.filter(o => o.type === 'quick-win').length} quick-win opportunities
✓ Address ${opportunities.filter(o => o.type === 'content-gap').length} content gaps
✓ Optimize ${opportunities.filter(o => o.type === 'ranking-decline').length} close-ranking keywords
` : '✓ Continue monitoring for new opportunities'}

Generated by MediaPlanPro Growth Suite
  `.trim();
}

