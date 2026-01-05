import { ReadabilityScores } from '@/types/tools';

export function calculateReadability(text: string): ReadabilityScores {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const syllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const characters = text.replace(/\s/g, '').length;

  const sentenceCount = sentences.length || 1;
  const wordCount = words.length || 1;
  const syllableCount = syllables || 1;

  // Flesch Reading Ease: 206.835 - 1.015(words/sentences) - 84.6(syllables/words)
  const fleschReadingEase = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);

  // Flesch-Kincaid Grade Level: 0.39(words/sentences) + 11.8(syllables/words) - 15.59
  const fleschKincaidGrade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;

  // Gunning Fog Index: 0.4 * ((words/sentences) + 100 * (complex words/words))
  const complexWords = words.filter(w => countSyllables(w) >= 3).length;
  const gunningFog = 0.4 * ((wordCount / sentenceCount) + 100 * (complexWords / wordCount));

  // SMOG Index: 1.0430 * sqrt(polysyllables * (30/sentences)) + 3.1291
  const polysyllables = words.filter(w => countSyllables(w) >= 3).length;
  const smog = 1.0430 * Math.sqrt(polysyllables * (30 / sentenceCount)) + 3.1291;

  // Coleman-Liau Index: 0.0588 * L - 0.296 * S - 15.8
  // L = average number of letters per 100 words
  // S = average number of sentences per 100 words
  const L = (characters / wordCount) * 100;
  const S = (sentenceCount / wordCount) * 100;
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

  // Average grade level
  const averageGrade = (fleschKincaidGrade + gunningFog + smog + colemanLiau) / 4;

  // Reading level description
  const readingLevel = getReadingLevel(averageGrade);

  return {
    fleschReadingEase: Math.max(0, Math.min(100, fleschReadingEase)),
    fleschKincaidGrade: Math.max(0, fleschKincaidGrade),
    gunningFog: Math.max(0, gunningFog),
    smog: Math.max(0, smog),
    colemanLiau: Math.max(0, colemanLiau),
    averageGrade: Math.max(0, averageGrade),
    readingLevel
  };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;

  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  // Adjust for silent 'e'
  if (word.endsWith('e')) {
    count--;
  }

  // Ensure at least 1 syllable
  return Math.max(1, count);
}

function getReadingLevel(grade: number): string {
  if (grade <= 6) return 'Elementary School (Easy)';
  if (grade <= 8) return 'Middle School (Fairly Easy)';
  if (grade <= 10) return 'High School (Standard)';
  if (grade <= 12) return 'High School Senior (Fairly Difficult)';
  if (grade <= 16) return 'College (Difficult)';
  return 'College Graduate (Very Difficult)';
}

export function getFleschDescription(score: number): string {
  if (score >= 90) return 'Very Easy (5th grade)';
  if (score >= 80) return 'Easy (6th grade)';
  if (score >= 70) return 'Fairly Easy (7th grade)';
  if (score >= 60) return 'Standard (8th-9th grade)';
  if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
  if (score >= 30) return 'Difficult (College)';
  return 'Very Difficult (College graduate)';
}

