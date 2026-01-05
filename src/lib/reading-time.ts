/**
 * Calculate reading time for a given text
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  // Remove HTML tags if present
  const plainText = text.replace(/<[^>]*>/g, '');
  
  // Count words (split by whitespace and filter empty strings)
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Calculate reading time in minutes (minimum 1 minute)
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, minutes);
}

/**
 * Format reading time as a human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min read")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}

/**
 * Calculate and format reading time in one function
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Formatted reading time string
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): string {
  const minutes = calculateReadingTime(text, wordsPerMinute);
  return formatReadingTime(minutes);
}

