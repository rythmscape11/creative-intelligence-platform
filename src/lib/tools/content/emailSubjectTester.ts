/**
 * Enhanced Email Subject Line Tester
 * Analyzes subject lines for deliverability, engagement, and conversion potential
 */

// Spam trigger words categorized by severity
const HIGH_RISK_SPAM_WORDS = [
  'free', 'winner', 'cash', 'prize', 'earn money', 'make money', 'get paid',
  'click here', 'buy now', 'order now', 'act now', '100% free', 'risk-free',
  'no obligation', 'guarantee', 'congratulations', 'you won', 'claim now'
];

const MEDIUM_RISK_SPAM_WORDS = [
  'bonus', 'income', 'profit', 'limited time', 'urgent', 'subscribe',
  'sign up', 'amazing deal', 'incredible offer', 'unbelievable', 'miracle',
  'special promotion', 'exclusive deal', 'once in a lifetime'
];

const URGENCY_WORDS = [
  'urgent', 'hurry', 'fast', 'quick', 'now', 'today', 'limited', 'expires',
  'deadline', 'last chance', 'ending soon', 'final hours', 'don\'t miss'
];

const PERSONALIZATION_PATTERNS = [
  '{name}', '{firstname}', '{lastname}', '{company}', '{title}',
  '{{', '}}', '[name]', '[firstname]'
];

const CURIOSITY_WORDS = [
  'secret', 'revealed', 'discover', 'find out', 'learn', 'insider',
  'behind the scenes', 'exclusive', 'sneak peek', 'preview'
];

const POWER_WORDS = [
  'proven', 'guaranteed', 'results', 'transform', 'boost', 'increase',
  'improve', 'master', 'ultimate', 'complete', 'essential', 'critical'
];

export interface EmailSubjectAnalysis {
  score: number;
  length: number;
  lengthRating: string;
  wordCount: number;
  hasPersonalization: boolean;
  hasUrgency: boolean;
  hasCuriosity: boolean;
  hasNumbers: boolean;
  hasQuestion: boolean;
  hasSpamWords: string[];
  spamRisk: 'low' | 'medium' | 'high';
  hasEmoji: boolean;
  emojiCount: number;
  hasAllCaps: boolean;
  hasExcessivePunctuation: boolean;
  powerWords: string[];
  predictedOpenRate: number;
  predictedOpenRateRange: string;
  openRateLabel: string;
  mobilePreview: string;
  desktopPreview: string;
  suggestions: string[];
  insights: string[];
}

export function analyzeEmailSubject(rawSubject: string): EmailSubjectAnalysis {
  const subject = typeof rawSubject === 'string' ? rawSubject.trim() : '';
  if (!subject) {
    throw new Error('Please enter a subject line to analyze.');
  }

  const length = subject.length;
  const lowerSubject = subject.toLowerCase();
  const words = subject.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Check for personalization
  const hasPersonalization = PERSONALIZATION_PATTERNS.some(pattern => subject.includes(pattern));

  // Check for urgency
  const hasUrgency = URGENCY_WORDS.some(word => lowerSubject.includes(word));

  // Check for curiosity
  const hasCuriosity = CURIOSITY_WORDS.some(word => lowerSubject.includes(word));

  // Check for numbers
  const hasNumbers = /\d/.test(subject);

  // Check for question
  const hasQuestion = subject.includes('?');

  // Check for spam words with severity
  const highRiskSpam = HIGH_RISK_SPAM_WORDS.filter(word => lowerSubject.includes(word));
  const mediumRiskSpam = MEDIUM_RISK_SPAM_WORDS.filter(word => lowerSubject.includes(word));
  const hasSpamWords = [...highRiskSpam, ...mediumRiskSpam];

  // Determine spam risk level
  let spamRisk: 'low' | 'medium' | 'high' = 'low';
  if (highRiskSpam.length > 0 || mediumRiskSpam.length >= 3) {
    spamRisk = 'high';
  } else if (mediumRiskSpam.length > 0) {
    spamRisk = 'medium';
  }

  // Check for emoji
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/gu;
  const emojiMatches = subject.match(emojiRegex) || [];
  const emojiCount = emojiMatches.length;
  const hasEmoji = emojiCount > 0;

  // Check for all caps
  const hasAllCaps = subject === subject.toUpperCase() && subject.length > 3;

  // Check for excessive punctuation
  const hasExcessivePunctuation = /[!?]{2,}/.test(subject) || (subject.match(/!/g) || []).length > 1;

  // Find power words
  const powerWords = POWER_WORDS.filter(word => lowerSubject.includes(word));

  // Calculate score (0-100)
  let score = 50; // Start at neutral
  const suggestions: string[] = [];
  const insights: string[] = [];

  // Length scoring (optimal: 30-50 characters)
  let lengthRating = 'Too Short';
  if (length >= 30 && length <= 50) {
    score += 20;
    insights.push(`✅ Perfect length (${length} chars) - optimal for both mobile and desktop`);
    lengthRating = 'Ideal (30-50 chars)';
  } else if (length >= 20 && length < 30) {
    score += 10;
    suggestions.push(`📏 Increase to 30-50 characters for better visibility (currently ${length})`);
    lengthRating = 'Slightly Short';
  } else if (length > 50 && length <= 60) {
    score += 5;
    suggestions.push(`✂️ Shorten to under 50 characters to avoid truncation on mobile (currently ${length})`);
    lengthRating = 'Slightly Long';
  } else if (length > 60) {
    score -= 10;
    suggestions.push(`⚠️ Too long (${length} chars) - will be cut off on mobile. Aim for 30-50 characters`);
    lengthRating = 'Too Long';
  } else {
    score -= 15;
    suggestions.push(`📏 Too short (${length} chars) - add more context. Aim for 30-50 characters`);
    lengthRating = 'Too Short';
  }

  // Word count scoring (optimal: 4-9 words)
  if (wordCount >= 4 && wordCount <= 9) {
    score += 10;
  } else if (wordCount < 4) {
    suggestions.push(`📝 Add more words for clarity (currently ${wordCount} words, aim for 4-9)`);
  } else {
    suggestions.push(`✂️ Reduce word count for impact (currently ${wordCount} words, aim for 4-9)`);
  }

  // Personalization bonus
  if (hasPersonalization) {
    score += 15;
    insights.push('🎯 Personalization detected - can increase open rates by 26%');
  } else {
    suggestions.push('👤 Add personalization like {firstname} to boost open rates by 26%');
  }

  // Urgency check
  if (hasUrgency) {
    score += 8;
    insights.push('⏰ Urgency detected - creates FOMO and drives immediate action');
  } else {
    suggestions.push('⏰ Consider adding urgency ("today", "limited") to drive action');
  }

  // Curiosity bonus
  if (hasCuriosity) {
    score += 8;
    insights.push('🔍 Curiosity trigger detected - encourages opens to learn more');
  }

  // Numbers bonus
  if (hasNumbers) {
    score += 7;
    insights.push('🔢 Numbers detected - increases credibility and specificity');
  } else {
    suggestions.push('🔢 Add specific numbers ("5 tips", "30% off") for better performance');
  }

  // Question bonus
  if (hasQuestion) {
    score += 5;
    insights.push('❓ Question format - engages curiosity and prompts mental response');
  }

  // Spam words penalty
  if (highRiskSpam.length > 0) {
    score -= highRiskSpam.length * 15;
    suggestions.push(`🚨 Remove high-risk spam words: ${highRiskSpam.join(', ')}`);
  }
  if (mediumRiskSpam.length > 0) {
    score -= mediumRiskSpam.length * 8;
    suggestions.push(`⚠️ Reduce medium-risk words: ${mediumRiskSpam.join(', ')}`);
  }

  // Emoji scoring
  if (emojiCount === 1) {
    score += 7;
    insights.push('😊 One emoji - perfect for standing out without looking spammy');
  } else if (emojiCount === 2) {
    score += 3;
    suggestions.push('😊 Two emojis is okay, but one is optimal for professionalism');
  } else if (emojiCount > 2) {
    score -= 10;
    suggestions.push(`⚠️ Too many emojis (${emojiCount}) - use only 1 for best results`);
  } else {
    suggestions.push('😊 Add one relevant emoji to increase open rates by 45%');
  }

  // All caps penalty
  if (hasAllCaps) {
    score -= 20;
    suggestions.push('🚫 AVOID ALL CAPS - looks spammy and unprofessional');
  }

  // Excessive punctuation penalty
  if (hasExcessivePunctuation) {
    score -= 15;
    suggestions.push('❗ Remove excessive punctuation (!!! or ???) - appears desperate');
  }

  // Power words bonus
  if (powerWords.length > 0 && powerWords.length <= 2) {
    score += 6;
    insights.push(`💪 Power words detected: ${powerWords.join(', ')}`);
  } else if (powerWords.length > 2) {
    suggestions.push('⚡ Too many power words can seem salesy - use 1-2 maximum');
  }

  // Ensure score is within 0-100
  score = Math.max(0, Math.min(100, score));

  // Generate open rate prediction
  const openRateBand = getOpenRateBand(score);

  // Generate mobile and desktop previews
  const mobilePreview = length > 40 ? subject.substring(0, 37) + '...' : subject;
  const desktopPreview = length > 60 ? subject.substring(0, 57) + '...' : subject;

  // Add final suggestions if score is perfect
  if (score >= 90 && suggestions.length === 0) {
    suggestions.push('🎉 Outstanding subject line! This follows all email marketing best practices');
    suggestions.push('✅ Ready to send - expected to perform in the top 10% of emails');
  } else if (suggestions.length === 0) {
    suggestions.push('✅ Solid subject line that follows most best practices');
  }

  // Add spam risk warning
  if (spamRisk === 'high') {
    suggestions.unshift('🚨 HIGH SPAM RISK - This email may be filtered. Remove spam trigger words immediately');
  } else if (spamRisk === 'medium') {
    suggestions.unshift('⚠️ MEDIUM SPAM RISK - Consider rewording to avoid spam filters');
  }

  // Limit suggestions to top 6
  const topSuggestions = suggestions.slice(0, 6);
  const topInsights = insights.slice(0, 5);

  return {
    score,
    length,
    lengthRating,
    wordCount,
    hasPersonalization,
    hasUrgency,
    hasCuriosity,
    hasNumbers,
    hasQuestion,
    hasSpamWords,
    spamRisk,
    hasEmoji,
    emojiCount,
    hasAllCaps,
    hasExcessivePunctuation,
    powerWords,
    predictedOpenRate: openRateBand.midpoint,
    predictedOpenRateRange: openRateBand.range,
    openRateLabel: openRateBand.label,
    mobilePreview,
    desktopPreview,
    suggestions: topSuggestions,
    insights: topInsights
  };
}

function getOpenRateBand(score: number) {
  if (score >= 80) {
    return { range: '25-35%', midpoint: 30, label: 'Excellent' };
  }
  if (score >= 65) {
    return { range: '20-25%', midpoint: 22, label: 'Good' };
  }
  if (score >= 50) {
    return { range: '15-20%', midpoint: 17, label: 'Average' };
  }
  if (score >= 35) {
    return { range: '10-15%', midpoint: 12, label: 'Needs Improvement' };
  }

  return { range: '5-10%', midpoint: 8, label: 'Poor' };
}
