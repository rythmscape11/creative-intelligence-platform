const SPAM_TRIGGERS = {
  high: ['viagra', 'cialis', 'lottery', 'winner', 'congratulations', 'claim your', 'act now', 'limited time', 'click here', 'buy now', 'order now', 'free money', 'earn cash', 'work from home', 'make money', 'get paid', 'no cost', 'risk free', 'satisfaction guaranteed', '100% free', 'call now', 'click below', 'dear friend', 'for instant access', 'get started now', 'increase sales', 'million dollars', 'once in lifetime', 'one time', 'pennies a day', 'potential earnings', 'pure profit', 'subject to credit', 'this is not spam', 'unsecured credit', 'why pay more', 'you have been selected'],
  medium: ['free', 'discount', 'save', 'deal', 'offer', 'bonus', 'gift', 'prize', 'urgent', 'important', 'reminder', 'expires', 'limited', 'hurry', 'act fast', 'don\'t delete', 'don\'t miss', 'exclusive', 'special promotion', 'apply now', 'buy direct', 'cancel', 'cheap', 'compare', 'copy', 'drastically reduced', 'eliminate', 'extra income', 'fantastic', 'for free', 'full refund', 'great offer', 'guarantee', 'incredible deal', 'join millions', 'lower rates', 'lowest price', 'money back', 'no catch', 'no fees', 'no hidden', 'no purchase necessary', 'no strings attached', 'not junk', 'obligation', 'off everything', 'per day', 'please read', 'price', 'priority mail', 'problem', 'promise', 'pure', 'refund', 'remove', 'reserves the right', 'reverses', 'risk', 'sale', 'save big', 'score', 'search engine', 'sent in error', 'serious', 'solution', 'stop', 'subscribe', 'success', 'supplies', 'take action', 'terms', 'trial', 'unlimited', 'unsubscribe', 'urgent', 'warranty', 'we hate spam', 'weight loss', 'what are you waiting for', 'while supplies last', 'will not believe', 'winner', 'winning', 'won', 'you are a winner', 'you\'ve been selected'],
  low: ['newsletter', 'update', 'announcement', 'new', 'latest', 'tips', 'guide', 'how to', 'learn', 'discover', 'explore']
};

export interface SpamAnalysis {
  score: number; // 0-10, where 0 is no spam, 10 is definitely spam
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Spam';
  triggers: { word: string; severity: 'high' | 'medium' | 'low' }[];
  suggestions: string[];
}

export function analyzeSpamScore(emailContent: string): SpamAnalysis {
  const lowerContent = emailContent.toLowerCase();
  const triggers: { word: string; severity: 'high' | 'medium' | 'low' }[] = [];
  
  let score = 0;
  
  // Check for high-severity spam triggers
  SPAM_TRIGGERS.high.forEach(word => {
    if (lowerContent.includes(word)) {
      triggers.push({ word, severity: 'high' });
      score += 3;
    }
  });
  
  // Check for medium-severity spam triggers
  SPAM_TRIGGERS.medium.forEach(word => {
    if (lowerContent.includes(word)) {
      triggers.push({ word, severity: 'medium' });
      score += 1;
    }
  });
  
  // Check for low-severity spam triggers
  SPAM_TRIGGERS.low.forEach(word => {
    if (lowerContent.includes(word)) {
      triggers.push({ word, severity: 'low' });
      score += 0.2;
    }
  });
  
  // Additional checks
  const exclamationCount = (emailContent.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    score += 1;
    triggers.push({ word: 'Multiple exclamation marks', severity: 'medium' });
  }
  
  const allCapsWords = emailContent.match(/\b[A-Z]{3,}\b/g) || [];
  if (allCapsWords.length > 2) {
    score += 1;
    triggers.push({ word: 'Excessive ALL CAPS', severity: 'medium' });
  }
  
  score = Math.min(10, score);
  
  // Determine rating
  let rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Spam';
  if (score <= 1) rating = 'Excellent';
  else if (score <= 3) rating = 'Good';
  else if (score <= 5) rating = 'Fair';
  else if (score <= 7) rating = 'Poor';
  else rating = 'Spam';
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (triggers.some(t => t.severity === 'high')) {
    suggestions.push('Remove high-risk spam trigger words immediately');
  }
  
  if (triggers.length > 5) {
    suggestions.push('Too many spam trigger words detected - rewrite your content');
  }
  
  if (exclamationCount > 3) {
    suggestions.push('Reduce exclamation marks to 1-2 maximum');
  }
  
  if (allCapsWords.length > 2) {
    suggestions.push('Avoid using ALL CAPS - use normal capitalization');
  }
  
  if (score <= 2) {
    suggestions.push('Great! Your email has a low spam score and should reach the inbox');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Consider reducing spam trigger words to improve deliverability');
  }
  
  return {
    score,
    rating,
    triggers: triggers.slice(0, 20), // Limit to top 20
    suggestions
  };
}

