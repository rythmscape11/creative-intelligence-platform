export interface KeywordSuggestion {
  keyword: string;
  searchVolume: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  cpc?: string; // Estimated Cost Per Click
  competition?: number; // 0-100 score
  trend?: 'Rising' | 'Stable' | 'Declining';
  seasonality?: string;
}

export function generateKeywordSuggestions(seedKeyword: string): KeywordSuggestion[] {
  const seed = seedKeyword.toLowerCase().trim();
  const suggestions: KeywordSuggestion[] = [];
  const currentMonth = new Date().getMonth() + 1;

  // Question-based keywords (High engagement, low competition)
  const questionWords = ['how to', 'what is', 'why', 'when', 'where', 'who', 'best way to', 'can you', 'should i'];
  questionWords.forEach(q => {
    const kw = `${q} ${seed}`;
    suggestions.push({
      keyword: kw,
      searchVolume: estimateSearchVolume(kw),
      difficulty: 'Easy',
      intent: 'Informational',
      cpc: '$0.50 - $1.20',
      competition: 25,
      trend: 'Stable'
    });
  });

  // Long-tail variations (Commercial intent)
  const modifiers = ['best', 'top', 'free', 'online', 'guide', 'tips', 'tools', 'software', 'platform', 'service'];
  modifiers.forEach(mod => {
    const kw = `${mod} ${seed}`;
    suggestions.push({
      keyword: kw,
      searchVolume: estimateSearchVolume(kw),
      difficulty: 'Medium',
      intent: 'Commercial',
      cpc: '$1.50 - $3.00',
      competition: 55,
      trend: 'Rising'
    });
  });

  // Comparison keywords (High conversion intent)
  const comparisonTerms = ['vs', 'versus', 'compared to', 'or', 'alternatives', 'competitors'];
  comparisonTerms.forEach(term => {
    const kw = `${seed} ${term}`;
    suggestions.push({
      keyword: kw,
      searchVolume: 'Medium',
      difficulty: 'Easy',
      intent: 'Commercial',
      cpc: '$2.00 - $4.50',
      competition: 45,
      trend: 'Rising'
    });
  });

  // Buying intent keywords (Highest CPC)
  const buyingModifiers = ['buy', 'price', 'cost', 'cheap', 'discount', 'deal', 'coupon', 'sale', 'purchase'];
  buyingModifiers.forEach(mod => {
    const kw = `${mod} ${seed}`;
    suggestions.push({
      keyword: kw,
      searchVolume: estimateSearchVolume(kw),
      difficulty: 'Hard',
      intent: 'Transactional',
      cpc: '$3.00 - $8.00',
      competition: 85,
      trend: 'Stable'
    });
  });

  // Year-specific (Trending)
  const currentYear = new Date().getFullYear();
  suggestions.push({
    keyword: `${seed} ${currentYear}`,
    searchVolume: 'High',
    difficulty: 'Medium',
    intent: 'Informational',
    cpc: '$1.00 - $2.50',
    competition: 60,
    trend: 'Rising'
  });

  // Location-based (Local SEO)
  const locationModifiers = ['near me', 'in [city]', 'local', 'nearby'];
  locationModifiers.forEach(loc => {
    const kw = `${seed} ${loc}`;
    suggestions.push({
      keyword: kw,
      searchVolume: 'Medium',
      difficulty: 'Medium',
      intent: 'Navigational',
      cpc: '$2.50 - $5.00',
      competition: 50,
      trend: 'Rising'
    });
  });

  // Tutorial/guide keywords (Content marketing)
  const tutorialTerms = ['tutorial', 'guide', 'for beginners', 'step by step', 'course', 'training', 'learn'];
  tutorialTerms.forEach(term => {
    const kw = `${seed} ${term}`;
    suggestions.push({
      keyword: kw,
      searchVolume: estimateSearchVolume(kw),
      difficulty: 'Easy',
      intent: 'Informational',
      cpc: '$0.80 - $1.80',
      competition: 30,
      trend: 'Stable'
    });
  });

  // Problem-solving keywords (Support content)
  const problemTerms = ['not working', 'problems', 'issues', 'troubleshooting', 'fix', 'error', 'help'];
  problemTerms.forEach(term => {
    const kw = `${seed} ${term}`;
    suggestions.push({
      keyword: kw,
      searchVolume: 'Low',
      difficulty: 'Easy',
      intent: 'Informational',
      cpc: '$0.40 - $1.00',
      competition: 20,
      trend: 'Stable'
    });
  });

  // Review keywords (Trust building)
  const reviewTerms = ['review', 'reviews', 'rating', 'testimonial', 'feedback', 'worth it'];
  reviewTerms.forEach(term => {
    const kw = `${seed} ${term}`;
    suggestions.push({
      keyword: kw,
      searchVolume: 'Medium',
      difficulty: 'Medium',
      intent: 'Commercial',
      cpc: '$1.80 - $3.50',
      competition: 65,
      trend: 'Rising'
    });
  });

  // Seasonal keywords (if applicable)
  const seasonality = detectSeasonality(seed, currentMonth);
  if (seasonality) {
    suggestions.push({
      keyword: `${seed} ${seasonality.term}`,
      searchVolume: 'High',
      difficulty: 'Medium',
      intent: 'Commercial',
      cpc: '$2.00 - $5.00',
      competition: 70,
      trend: 'Rising',
      seasonality: seasonality.season
    });
  }

  // Sort by estimated value (search volume * intent strength / difficulty)
  return suggestions.sort((a, b) => {
    const scoreA = calculateKeywordScore(a);
    const scoreB = calculateKeywordScore(b);
    return scoreB - scoreA;
  }).slice(0, 50); // Return top 50 keywords
}

export function estimateSearchVolume(keyword: string): 'High' | 'Medium' | 'Low' {
  const wordCount = keyword.split(' ').length;
  const hasNumber = /\d/.test(keyword);
  const hasYear = /20\d{2}/.test(keyword);

  // Short keywords = higher volume
  if (wordCount <= 2) return 'High';

  // Listicles and year-specific = medium-high volume
  if (hasNumber || hasYear) return 'Medium';

  // Long-tail = lower volume but higher conversion
  if (wordCount <= 4) return 'Medium';
  return 'Low';
}

export function estimateDifficulty(keyword: string, intent: string): 'Easy' | 'Medium' | 'Hard' {
  const wordCount = keyword.split(' ').length;

  // Transactional keywords are always competitive
  if (intent === 'Transactional') return 'Hard';

  // Commercial keywords are moderately competitive
  if (intent === 'Commercial' && wordCount <= 3) return 'Hard';

  // Long-tail keywords are easier to rank
  if (wordCount >= 5) return 'Easy';
  if (wordCount === 4) return 'Easy';
  if (wordCount === 3) return 'Medium';

  // Short keywords are very competitive
  return 'Hard';
}

// Calculate keyword opportunity score
function calculateKeywordScore(keyword: KeywordSuggestion): number {
  let score = 0;

  // Search volume weight
  if (keyword.searchVolume === 'High') score += 50;
  else if (keyword.searchVolume === 'Medium') score += 30;
  else score += 10;

  // Difficulty weight (inverse - easier is better)
  if (keyword.difficulty === 'Easy') score += 40;
  else if (keyword.difficulty === 'Medium') score += 20;
  else score += 5;

  // Intent weight
  if (keyword.intent === 'Transactional') score += 30;
  else if (keyword.intent === 'Commercial') score += 25;
  else if (keyword.intent === 'Navigational') score += 15;
  else score += 10;

  // Competition weight (inverse)
  if (keyword.competition) {
    score += (100 - keyword.competition) / 2;
  }

  // Trend bonus
  if (keyword.trend === 'Rising') score += 20;
  else if (keyword.trend === 'Stable') score += 10;

  return score;
}

// Detect seasonal keywords
function detectSeasonality(keyword: string, currentMonth: number): { term: string; season: string } | null {
  const seasonalTerms: { [key: string]: { months: number[]; term: string; season: string } } = {
    'holiday': { months: [11, 12], term: 'holiday', season: 'Winter Holidays' },
    'christmas': { months: [11, 12], term: 'christmas', season: 'Christmas' },
    'black friday': { months: [10, 11], term: 'black friday', season: 'Black Friday' },
    'summer': { months: [5, 6, 7, 8], term: 'summer', season: 'Summer' },
    'back to school': { months: [7, 8], term: 'back to school', season: 'Back to School' },
    'tax': { months: [3, 4], term: 'tax season', season: 'Tax Season' },
    'new year': { months: [12, 1], term: 'new year', season: 'New Year' }
  };

  for (const [key, data] of Object.entries(seasonalTerms)) {
    if (keyword.toLowerCase().includes(key) && data.months.includes(currentMonth)) {
      return { term: data.term, season: data.season };
    }
  }

  return null;
}

