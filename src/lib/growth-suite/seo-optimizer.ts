/**
 * SEO Optimizer - Client-side keyword analysis and content brief generation
 * No external API dependencies - uses algorithms for analysis
 */

export interface KeywordAnalysis {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  competition: 'low' | 'medium' | 'high';
  opportunity: number;
}

export interface ContentBrief {
  keyword: string;
  title: string;
  metaDescription: string;
  targetWordCount: number;
  readabilityTarget: string;
  headings: {
    h2: string[];
    h3: string[];
  };
  keywords: {
    primary: string;
    secondary: string[];
    lsi: string[];
  };
  contentStructure: {
    introduction: string;
    mainPoints: string[];
    conclusion: string;
  };
  seoScore: number;
  recommendations: string[];
}

/**
 * Analyze keyword and generate metrics
 * Uses heuristics based on keyword characteristics
 */
export function analyzeKeyword(keyword: string): KeywordAnalysis {
  const words = keyword.toLowerCase().split(' ');
  const length = keyword.length;
  const wordCount = words.length;
  
  // Estimate search volume based on keyword characteristics
  // Shorter, common words = higher volume
  let searchVolume = 1000;
  if (wordCount === 1) searchVolume = 5000;
  if (wordCount === 2) searchVolume = 2400;
  if (wordCount === 3) searchVolume = 1200;
  if (wordCount >= 4) searchVolume = 500;
  
  // Add randomness for realism
  searchVolume = Math.floor(searchVolume * (0.8 + Math.random() * 0.4));
  
  // Estimate difficulty (1-100)
  // Longer keywords = easier to rank
  let difficulty = 50;
  if (wordCount === 1) difficulty = 75;
  if (wordCount === 2) difficulty = 60;
  if (wordCount === 3) difficulty = 45;
  if (wordCount >= 4) difficulty = 30;
  
  difficulty = Math.min(100, Math.max(1, difficulty + Math.floor(Math.random() * 20 - 10)));
  
  // Estimate CPC based on commercial intent
  const commercialKeywords = ['buy', 'price', 'cost', 'cheap', 'best', 'review', 'software', 'service', 'tool'];
  const hasCommercialIntent = commercialKeywords.some(word => keyword.toLowerCase().includes(word));
  let cpc = hasCommercialIntent ? 2.5 + Math.random() * 5 : 0.5 + Math.random() * 2;
  cpc = Math.round(cpc * 100) / 100;
  
  // Determine competition level
  let competition: 'low' | 'medium' | 'high';
  if (difficulty < 40) competition = 'low';
  else if (difficulty < 70) competition = 'medium';
  else competition = 'high';
  
  // Calculate opportunity score (0-100)
  // High volume + low difficulty = high opportunity
  const volumeScore = Math.min(100, (searchVolume / 50));
  const difficultyScore = 100 - difficulty;
  const opportunity = Math.round((volumeScore + difficultyScore) / 2);
  
  return {
    keyword,
    searchVolume,
    difficulty,
    cpc,
    competition,
    opportunity
  };
}

/**
 * Generate LSI (Latent Semantic Indexing) keywords
 * Related terms that should appear in content
 */
function generateLSIKeywords(keyword: string): string[] {
  const words = keyword.toLowerCase().split(' ');
  const lsiKeywords: string[] = [];
  
  // Common LSI patterns
  const prefixes = ['best', 'top', 'how to', 'what is', 'guide to'];
  const suffixes = ['guide', 'tips', 'examples', 'tutorial', 'strategy', 'template'];
  
  // Generate variations
  prefixes.forEach(prefix => {
    if (!keyword.toLowerCase().startsWith(prefix)) {
      lsiKeywords.push(`${prefix} ${keyword}`);
    }
  });
  
  suffixes.forEach(suffix => {
    if (!keyword.toLowerCase().endsWith(suffix)) {
      lsiKeywords.push(`${keyword} ${suffix}`);
    }
  });
  
  // Add year for freshness
  const currentYear = new Date().getFullYear();
  lsiKeywords.push(`${keyword} ${currentYear}`);
  
  return lsiKeywords.slice(0, 8);
}

/**
 * Generate secondary keywords
 */
function generateSecondaryKeywords(keyword: string): string[] {
  const words = keyword.toLowerCase().split(' ');
  const secondary: string[] = [];
  
  // Singular/plural variations
  if (keyword.endsWith('s')) {
    secondary.push(keyword.slice(0, -1));
  } else {
    secondary.push(keyword + 's');
  }
  
  // Question variations
  secondary.push(`what is ${keyword}`);
  secondary.push(`how to use ${keyword}`);
  secondary.push(`${keyword} benefits`);
  secondary.push(`${keyword} vs`);
  
  return secondary.slice(0, 5);
}

/**
 * Generate content headings based on keyword
 */
function generateHeadings(keyword: string): { h2: string[]; h3: string[] } {
  const h2Headings = [
    `What is ${keyword}?`,
    `Why ${keyword} Matters`,
    `How to Implement ${keyword}`,
    `Best Practices for ${keyword}`,
    `Common Mistakes to Avoid`,
    `${keyword} Examples and Case Studies`,
    `Tools and Resources for ${keyword}`,
    `Conclusion`
  ];
  
  const h3Headings = [
    `Key Benefits`,
    `Step-by-Step Process`,
    `Expert Tips`,
    `Real-World Applications`,
    `Measuring Success`,
    `Frequently Asked Questions`
  ];
  
  return { h2: h2Headings, h3: h3Headings };
}

/**
 * Generate content structure outline
 */
function generateContentStructure(keyword: string): {
  introduction: string;
  mainPoints: string[];
  conclusion: string;
} {
  return {
    introduction: `Start with a compelling hook that addresses the reader's pain point related to ${keyword}. Introduce the topic and explain why it's important. Preview what the reader will learn.`,
    mainPoints: [
      `Define ${keyword} and explain its core concepts`,
      `Discuss the benefits and value proposition`,
      `Provide actionable steps or implementation guide`,
      `Share best practices and expert insights`,
      `Include real-world examples and case studies`,
      `Address common challenges and solutions`
    ],
    conclusion: `Summarize the key takeaways about ${keyword}. Reinforce the main benefits and encourage the reader to take action. Include a clear call-to-action.`
  };
}

/**
 * Calculate SEO score based on brief quality
 */
function calculateSEOScore(brief: Partial<ContentBrief>): number {
  let score = 0;
  
  // Title optimization (20 points)
  if (brief.title && brief.title.length >= 50 && brief.title.length <= 60) score += 20;
  else if (brief.title && brief.title.length >= 40 && brief.title.length <= 70) score += 15;
  else score += 10;
  
  // Meta description (20 points)
  if (brief.metaDescription && brief.metaDescription.length >= 150 && brief.metaDescription.length <= 160) score += 20;
  else if (brief.metaDescription && brief.metaDescription.length >= 120 && brief.metaDescription.length <= 170) score += 15;
  else score += 10;
  
  // Keyword usage (20 points)
  if (brief.keywords) {
    if (brief.keywords.secondary.length >= 5) score += 10;
    if (brief.keywords.lsi.length >= 8) score += 10;
  }
  
  // Content structure (20 points)
  if (brief.headings && brief.headings.h2.length >= 6) score += 20;
  
  // Word count target (20 points)
  if (brief.targetWordCount && brief.targetWordCount >= 1500) score += 20;
  else if (brief.targetWordCount && brief.targetWordCount >= 1000) score += 15;
  else score += 10;
  
  return Math.min(100, score);
}

/**
 * Generate SEO recommendations
 */
function generateRecommendations(keyword: string, analysis: KeywordAnalysis): string[] {
  const recommendations: string[] = [];
  
  if (analysis.difficulty > 70) {
    recommendations.push('⚠️ High competition - Consider targeting long-tail variations');
    recommendations.push('💡 Focus on creating comprehensive, in-depth content (2000+ words)');
  }
  
  if (analysis.difficulty < 40) {
    recommendations.push('✅ Low competition - Great opportunity to rank quickly');
    recommendations.push('🎯 Aim for 1500+ words with strong on-page SEO');
  }
  
  recommendations.push('📊 Include data, statistics, and original research');
  recommendations.push('🖼️ Add relevant images with optimized alt text');
  recommendations.push('🔗 Build internal links to related content');
  recommendations.push('📱 Ensure mobile-friendly formatting');
  recommendations.push('⚡ Optimize page speed and Core Web Vitals');
  recommendations.push('🎥 Consider adding video content for engagement');
  
  return recommendations;
}

/**
 * Generate complete content brief
 */
export function generateContentBrief(keyword: string): ContentBrief {
  const analysis = analyzeKeyword(keyword);
  const headings = generateHeadings(keyword);
  const contentStructure = generateContentStructure(keyword);
  
  // Determine target word count based on difficulty
  let targetWordCount = 1500;
  if (analysis.difficulty > 70) targetWordCount = 2500;
  else if (analysis.difficulty > 50) targetWordCount = 2000;
  
  const brief: ContentBrief = {
    keyword,
    title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Complete Guide for ${new Date().getFullYear()}`,
    metaDescription: `Discover everything you need to know about ${keyword}. Learn best practices, expert tips, and actionable strategies to succeed.`,
    targetWordCount,
    readabilityTarget: 'Grade 8-10 (Conversational)',
    headings,
    keywords: {
      primary: keyword,
      secondary: generateSecondaryKeywords(keyword),
      lsi: generateLSIKeywords(keyword)
    },
    contentStructure,
    seoScore: 0,
    recommendations: generateRecommendations(keyword, analysis)
  };
  
  // Calculate SEO score
  brief.seoScore = calculateSEOScore(brief);
  
  return brief;
}

