import { KeywordDensity } from '@/types/tools';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with'
]);

export function analyzeKeywordDensity(text: string): KeywordDensity[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const totalWords = words.length;
  const wordCounts: Record<string, number> = {};

  // Count word occurrences
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Calculate density and sort
  const densities: KeywordDensity[] = Object.entries(wordCounts)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: (count / totalWords) * 100,
      isOverused: (count / totalWords) * 100 > 3
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Top 20 keywords

  return densities;
}

export function analyzePhrases(text: string, phraseLength: number = 2): KeywordDensity[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);

  const phrases: Record<string, number> = {};
  const totalPhrases = Math.max(1, words.length - phraseLength + 1);

  // Generate phrases
  for (let i = 0; i <= words.length - phraseLength; i++) {
    const phrase = words.slice(i, i + phraseLength).join(' ');
    // Skip if contains stop words only
    if (!words.slice(i, i + phraseLength).every(w => STOP_WORDS.has(w))) {
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
  }

  // Calculate density and sort
  const densities: KeywordDensity[] = Object.entries(phrases)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: (count / totalPhrases) * 100,
      isOverused: (count / totalPhrases) * 100 > 2
    }))
    .filter(d => d.count > 1) // Only show phrases that appear more than once
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 phrases

  return densities;
}

