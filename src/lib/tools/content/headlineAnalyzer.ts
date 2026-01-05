import { HeadlineAnalysis } from '@/types/tools';

// Enhanced Power Words with Weighted Scoring
const POWER_WORDS = {
  high: ['ultimate', 'guaranteed', 'proven', 'revolutionary', 'exclusive', 'secret', 'breakthrough', 'master'],
  medium: ['amazing', 'awesome', 'best', 'boost', 'brilliant', 'complete', 'comprehensive', 'definitive'],
  low: ['easy', 'effective', 'essential', 'expert', 'fast', 'free', 'guide', 'hack', 'incredible', 'instant', 'new', 'perfect', 'powerful', 'quick', 'simple', 'smart', 'step-by-step', 'stunning', 'super', 'top', 'unique', 'unlock', 'vital', 'winning']
};

// Enhanced Emotion Words with Categories
const EMOTION_WORDS = {
  positive: ['beautiful', 'confident', 'delightful', 'excited', 'fearless', 'grateful', 'happy', 'hopeful', 'inspiring', 'joyful', 'love', 'magical', 'passionate', 'peaceful', 'proud', 'thrilled', 'triumphant', 'wonderful'],
  negative: ['afraid', 'angry', 'anxious', 'devastated', 'frustrated', 'heartbreaking', 'lonely', 'nervous', 'overwhelmed', 'sad', 'scared', 'shocking', 'surprised', 'terrified', 'tragic', 'worried'],
  curiosity: ['crazy', 'hilarious', 'shocking', 'surprising', 'unbelievable', 'bizarre', 'strange', 'weird']
};

// Question Words for Engagement
const QUESTION_WORDS = ['how', 'what', 'why', 'when', 'where', 'who', 'which', 'can', 'should', 'will', 'do', 'does', 'is', 'are'];

// Urgency Words
const URGENCY_WORDS = ['now', 'today', 'urgent', 'limited', 'hurry', 'fast', 'quick', 'immediately', 'deadline', 'expires', 'last chance', 'ending soon'];

// Industry-Specific Keywords
const INDUSTRY_KEYWORDS = {
  marketing: ['seo', 'conversion', 'traffic', 'leads', 'roi', 'engagement', 'viral', 'growth'],
  business: ['profit', 'revenue', 'sales', 'productivity', 'efficiency', 'strategy', 'success'],
  tech: ['ai', 'automation', 'software', 'app', 'tool', 'platform', 'digital', 'cloud'],
  content: ['blog', 'article', 'guide', 'tutorial', 'tips', 'tricks', 'hacks', 'secrets']
};

export function analyzeHeadline(headlineInput: string): HeadlineAnalysis {
  const headline = typeof headlineInput === 'string' ? headlineInput.trim() : '';
  if (!headline) {
    throw new Error('Please enter a headline to analyze.');
  }

  try {
    const words = headline.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const characterCount = headline.length;

  // Advanced Power Word Detection with Weighted Scoring
  const powerWordsFound: string[] = [];
  let powerWordScore = 0;

  words.forEach(word => {
    if (POWER_WORDS.high.some(pw => word.includes(pw))) {
      powerWordsFound.push(word);
      powerWordScore += 3;
    } else if (POWER_WORDS.medium.some(pw => word.includes(pw))) {
      powerWordsFound.push(word);
      powerWordScore += 2;
    } else if (POWER_WORDS.low.some(pw => word.includes(pw))) {
      powerWordsFound.push(word);
      powerWordScore += 1;
    }
  });

  // Advanced Emotion Word Detection with Categories
  const emotionWordsFound: string[] = [];
  let emotionScore = 0;

  words.forEach(word => {
    if (EMOTION_WORDS.positive.some(ew => word.includes(ew))) {
      emotionWordsFound.push(word);
      emotionScore += 2;
    } else if (EMOTION_WORDS.negative.some(ew => word.includes(ew))) {
      emotionWordsFound.push(word);
      emotionScore += 1.5;
    } else if (EMOTION_WORDS.curiosity.some(ew => word.includes(ew))) {
      emotionWordsFound.push(word);
      emotionScore += 2.5;
    }
  });

  // Check for numbers and brackets
  const hasNumber = /\d/.test(headline);
  const hasBrackets = /[\[\(\{]/.test(headline);
  const numberMatch = headline.match(/\d+/);
  const numberValue = numberMatch ? parseInt(numberMatch[0]) : 0;

  // Question detection
  const isQuestion = QUESTION_WORDS.some(qw => words.includes(qw)) || headline.includes('?');

  // Urgency detection
  const hasUrgency = URGENCY_WORDS.some(uw => headline.toLowerCase().includes(uw));

  // Industry detection
  let industry: string | null = null;
  for (const [ind, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some(kw => headline.toLowerCase().includes(kw))) {
      industry = ind;
      break;
    }
  }

  // Advanced Sentiment Analysis with Scoring
  const sentiment = analyzeSentiment(headline, words);

  // Readability: Check for complex words
  const complexWords = words.filter(w => w.length > 12).length;

  // Calculate Advanced Score (0-100)
  let score = 0;

  // 1. Word Count (25 points max)
  if (wordCount >= 6 && wordCount <= 12) {
    score += 25;
  } else if (wordCount >= 4 && wordCount <= 15) {
    score += 15;
  } else if (wordCount >= 3 && wordCount <= 18) {
    score += 8;
  }

  // 2. Character Count (20 points max)
  if (characterCount >= 55 && characterCount <= 65) {
    score += 20;
  } else if (characterCount >= 40 && characterCount <= 70) {
    score += 12;
  } else if (characterCount >= 30 && characterCount <= 80) {
    score += 6;
  }

  // 3. Power Words (20 points max)
  if (powerWordScore >= 4 && powerWordScore <= 6) {
    score += 20;
  } else if (powerWordScore >= 2) {
    score += 12;
  } else if (powerWordScore >= 1) {
    score += 6;
  }

  // 4. Emotion Words (15 points max)
  if (emotionScore >= 2 && emotionScore <= 5) {
    score += 15;
  } else if (emotionScore >= 1) {
    score += 8;
  }

  // 5. Numbers (10 points max)
  if (hasNumber) {
    if (numberValue >= 3 && numberValue <= 20) {
      score += 10; // Optimal range for listicles
    } else if (numberValue > 0) {
      score += 6;
    }
  }

  // 6. Brackets Bonus (5 points)
  if (hasBrackets) {
    score += 5;
  }

  // 7. Question Bonus (5 points)
  if (isQuestion) {
    score += 5;
  }

  // 8. Urgency Bonus (5 points)
  if (hasUrgency) {
    score += 5;
  }

  // 9. Sentiment Bonus (5 points)
  if (sentiment === 'positive' || sentiment === 'curiosity') {
    score += 5;
  }

  // 10. Readability Penalty
  if (complexWords > 2) {
    score -= 5;
  }

  // Generate advanced suggestions
  const suggestions = generateSuggestions({
    wordCount,
    characterCount,
    powerWords: powerWordsFound.length,
    emotionWords: emotionWordsFound.length,
    hasNumber,
    hasBrackets,
    isQuestion,
    hasUrgency,
    sentiment,
    industry,
    complexWords,
    numberValue
  });

    return {
      score: Math.min(Math.max(score, 0), 100),
      wordCount,
      characterCount,
      emotionWords: emotionWordsFound,
      powerWords: powerWordsFound,
      hasNumber,
      sentiment,
      suggestions
    };
  } catch (error) {
    // Normalize unknown parsing failures so the UI can surface a helpful error message instead of crashing.
    throw new Error(
      (error as Error)?.message || 'We were unable to analyze this headline. Please try a simpler variation.'
    );
  }
}

function analyzeSentiment(text: string, _words: string[]): 'positive' | 'negative' | 'neutral' | 'curiosity' {
  const positiveWords = ['best', 'great', 'amazing', 'awesome', 'excellent', 'perfect', 'love', 'happy', 'wonderful', 'success', 'win', 'achieve'];
  const negativeWords = ['worst', 'bad', 'terrible', 'awful', 'hate', 'sad', 'angry', 'fail', 'mistake', 'avoid', 'stop', 'never'];
  const curiosityWords = ['secret', 'hidden', 'revealed', 'shocking', 'surprising', 'unbelievable', 'nobody', 'everyone'];

  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(w => lowerText.includes(w)).length;
  const negativeCount = negativeWords.filter(w => lowerText.includes(w)).length;
  const curiosityCount = curiosityWords.filter(w => lowerText.includes(w)).length;

  if (curiosityCount > 0) return 'curiosity';
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function generateSuggestions(analysis: {
  wordCount: number;
  characterCount: number;
  powerWords: number;
  emotionWords: number;
  hasNumber: boolean;
  hasBrackets: boolean;
  isQuestion: boolean;
  hasUrgency: boolean;
  sentiment: string;
  industry: string | null;
  complexWords: number;
  numberValue: number;
}): string[] {
  const suggestions: string[] = [];

  // Word Count Suggestions
  if (analysis.wordCount < 6) {
    suggestions.push('📏 Add more words to make your headline more descriptive (aim for 6-12 words for optimal engagement)');
  } else if (analysis.wordCount > 12) {
    suggestions.push('✂️ Shorten your headline for better impact (aim for 6-12 words - shorter headlines get 21% more clicks)');
  }

  // Character Count Suggestions
  if (analysis.characterCount < 55) {
    suggestions.push('📊 Increase character count to 55-65 for optimal SEO visibility in search results');
  } else if (analysis.characterCount > 65) {
    suggestions.push('⚠️ Reduce character count to 55-65 to avoid truncation in Google search results');
  }

  // Power Words Suggestions
  if (analysis.powerWords === 0) {
    suggestions.push('💪 Add a power word like "ultimate", "proven", or "guaranteed" to increase impact by up to 40%');
  } else if (analysis.powerWords > 3) {
    suggestions.push('⚡ Too many power words can seem spammy - use 1-2 for best results and authenticity');
  }

  // Emotion Words Suggestions
  if (analysis.emotionWords === 0) {
    suggestions.push('❤️ Add an emotion word to create a stronger connection with readers (increases engagement by 25%)');
  } else if (analysis.emotionWords > 3) {
    suggestions.push('🎭 Too many emotion words can reduce credibility - use 1-2 for balanced appeal');
  }

  // Number Suggestions
  if (!analysis.hasNumber) {
    suggestions.push('🔢 Consider adding a number (e.g., "7 Ways" or "10 Tips") - headlines with numbers get 36% more clicks');
  } else if (analysis.numberValue > 0) {
    if (analysis.numberValue < 3) {
      suggestions.push('📈 Numbers 3-20 perform best in headlines - consider increasing your list size');
    } else if (analysis.numberValue > 20) {
      suggestions.push('📉 Numbers above 20 can seem overwhelming - consider breaking into smaller, focused lists');
    }
  }

  // Brackets Suggestion
  if (!analysis.hasBrackets) {
    suggestions.push('📦 Add brackets [Like This] to increase click-through rate by 38% (use sparingly)');
  }

  // Question Suggestion
  if (!analysis.isQuestion) {
    suggestions.push('❓ Consider making it a question to increase engagement (questions get 14% more clicks)');
  }

  // Urgency Suggestion
  if (!analysis.hasUrgency) {
    suggestions.push('⏰ Add urgency words like "now", "today", or "limited" to drive immediate action');
  }

  // Sentiment Suggestions
  if (analysis.sentiment === 'negative') {
    suggestions.push('😊 Consider using more positive language to attract readers (positive headlines get 29% more engagement)');
  } else if (analysis.sentiment === 'neutral') {
    suggestions.push('🎯 Add emotional or curiosity-driven words to make your headline more compelling');
  }

  // Readability Suggestions
  if (analysis.complexWords > 2) {
    suggestions.push('📖 Simplify complex words for better readability - aim for 8th-grade reading level');
  }

  // Industry-Specific Suggestions
  if (analysis.industry) {
    suggestions.push(`🎯 Great! Your headline targets the ${analysis.industry} industry - ensure it speaks to your audience's pain points`);
  }

  // Perfect Headline
  if (suggestions.length === 0) {
    suggestions.push('🎉 Excellent headline! It follows best practices for engagement, SEO, and click-through rate.');
    suggestions.push('✅ Your headline has optimal word count, character count, power words, and emotional appeal.');
    suggestions.push('🚀 This headline is likely to perform well across social media, email, and search engines.');
  }

  // Limit to top 5 most important suggestions
  return suggestions.slice(0, 5);
}
