export interface MetaDescriptionInput {
  keyword: string;
  topic: string;
  cta?: string;
}

export function generateMetaDescriptions(input: MetaDescriptionInput): string[] {
  const { keyword, topic, cta = 'Learn more' } = input;
  
  const templates = [
    // Template 1: Question-based
    `Looking for ${keyword}? Discover ${topic} and ${cta.toLowerCase()} about how to get started today.`,
    
    // Template 2: Benefit-focused
    `${topic} - Get expert insights on ${keyword}. ${cta} and unlock the full potential of your strategy.`,
    
    // Template 3: How-to style
    `Learn how ${keyword} can transform ${topic}. Step-by-step guide with proven results. ${cta} now!`,
    
    // Template 4: Problem-solution
    `Struggling with ${keyword}? Our comprehensive guide to ${topic} has the answers you need. ${cta} today.`,
    
    // Template 5: Authority-based
    `Expert guide to ${keyword} and ${topic}. Trusted by thousands. ${cta} and see why we're the #1 choice.`
  ];

  // Ensure all descriptions are within 150-160 characters
  return templates.map(desc => {
    if (desc.length > 160) {
      return desc.substring(0, 157) + '...';
    }
    return desc;
  });
}

export function validateMetaDescription(description: string): {
  isValid: boolean;
  length: number;
  issues: string[];
  suggestions: string[];
} {
  const length = description.length;
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (length < 120) {
    issues.push('Too short - may not be compelling enough');
    suggestions.push('Add more details about your content to reach 150-160 characters');
  }

  if (length > 160) {
    issues.push('Too long - will be truncated in search results');
    suggestions.push('Shorten to 150-160 characters to avoid truncation');
  }

  if (!/[.!?]$/.test(description)) {
    suggestions.push('Consider ending with punctuation for better readability');
  }

  if (description.toLowerCase().split(/\s+/).length < 15) {
    suggestions.push('Add more descriptive words to make it more compelling');
  }

  const isValid = length >= 120 && length <= 160;

  return { isValid, length, issues, suggestions };
}

