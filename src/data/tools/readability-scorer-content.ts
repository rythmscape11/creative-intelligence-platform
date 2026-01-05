import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const readabilityScorerContent = {
  metadata: {
    title: 'Readability Scorer - Analyze Content Readability | Aureon One',
    description: 'Check content readability with Flesch Reading Ease, grade level, and comprehension scores. Free tool for content writers and editors.',
    keywords: ['readability scorer', 'readability checker', 'content readability tool', 'Flesch reading ease', 'grade level checker'],
  },

  hero: {
    title: 'Readability Scorer',
    subtitle: 'Analyze and Improve Content Readability',
    description: 'Check your content\'s readability score, grade level, and comprehension difficulty. Ensure your content is accessible to your target audience.',
    primaryCTA: 'Check Readability',
    secondaryCTA: 'Learn More',
  },

  quickAnswer: {
    question: 'What is a Readability Score?',
    answer: 'A readability score measures how easy content is to read and understand, using metrics like Flesch Reading Ease (0-100 scale) and grade level. Higher Flesch scores (60-70) indicate easier reading. Scores consider sentence length, word complexity, and syllable count. Optimal readability varies by audience—general content targets 8th-grade level, while technical content may be higher.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Readability Scorer', level: 2 },
    { id: 'benefits', title: 'Benefits & Use Cases', level: 2 },
    { id: 'scoring-methods', title: 'Readability Scoring Methods', level: 2 },
    { id: 'improvement-tips', title: 'How to Improve Readability', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Content Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Paste Your Content', text: 'Copy and paste your content into the readability scorer.' },
    { name: 'Analyze Scores', text: 'Get instant readability scores including Flesch Reading Ease and grade level.' },
    { name: 'Review Metrics', text: 'Check sentence length, word complexity, and passive voice usage.' },
    { name: 'Read Suggestions', text: 'Get specific recommendations to improve readability for your target audience.' },
    { name: 'Edit and Retest', text: 'Make improvements and retest until you achieve optimal readability scores.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is a readability score?',
      answer: 'A readability score is a numerical measure of how easy text is to read and understand. Common metrics include Flesch Reading Ease (0-100, higher is easier), Flesch-Kincaid Grade Level (U.S. school grade), Gunning Fog Index, and SMOG Index. These scores analyze sentence length, word complexity, syllable count, and other factors. A Flesch score of 60-70 is considered standard, readable by 13-15 year olds. Scores help writers match content complexity to audience education level, improving comprehension and engagement.',
    },
    {
      question: 'What is a good readability score?',
      answer: 'A good readability score depends on your audience and content type. For general web content, aim for Flesch Reading Ease of 60-70 (8th-9th grade level). Marketing content should be 70-80 (7th-8th grade). Technical or academic content may be 50-60 (10th-12th grade). News articles target 60-70. Children\'s content needs 80-90 (5th-6th grade). Higher scores indicate easier reading. Most successful online content scores 60-80, balancing sophistication with accessibility. Test your specific audience—B2B professionals may accept lower scores than general consumers.',
    },
    {
      question: 'How do I improve my content\'s readability?',
      answer: 'Improve readability by shortening sentences (aim for 15-20 words average), using simpler words when possible, breaking long paragraphs into shorter ones (3-4 sentences), using active voice instead of passive, adding subheadings for scannability, using bullet points and lists, avoiding jargon or explaining technical terms, varying sentence length for rhythm, and using transition words for flow. Read content aloud to identify awkward phrasing. Tools like Hemingway Editor highlight complex sentences. Focus on clarity over cleverness. Simpler writing isn\'t "dumbing down"—it\'s respecting reader time and cognitive load.',
    },
    {
      question: 'Does readability affect SEO?',
      answer: 'Yes, readability indirectly affects SEO through user engagement signals. Readable content keeps visitors on page longer (lower bounce rate), encourages scrolling and interaction (dwell time), increases social sharing and backlinks, and improves mobile user experience. Google\'s algorithms prioritize user satisfaction, which correlates with readability. While readability isn\'t a direct ranking factor, its impact on engagement metrics influences rankings. Additionally, readable content is more likely to earn featured snippets. Balance SEO keyword optimization with readability—keyword-stuffed but unreadable content won\'t rank well despite optimization.',
    },
    {
      question: 'What is the Flesch Reading Ease score?',
      answer: 'The Flesch Reading Ease score rates text on a 0-100 scale based on sentence length and syllables per word. Higher scores indicate easier reading: 90-100 is very easy (5th grade), 80-90 is easy (6th grade), 70-80 is fairly easy (7th grade), 60-70 is standard (8th-9th grade), 50-60 is fairly difficult (10th-12th grade), 30-50 is difficult (college), and 0-30 is very difficult (college graduate). Most web content should score 60-70. The formula is: 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words).',
    },
    {
      question: 'What is grade level in readability?',
      answer: 'Grade level indicates the U.S. school grade needed to understand text. An 8th-grade level means typical 13-14 year olds can comprehend it. Flesch-Kincaid Grade Level is most common, calculated from sentence length and word length. Most newspapers target 8th-10th grade. Web content should be 7th-9th grade for general audiences. Academic papers may be 12th grade or higher. Lower grade levels don\'t mean simplistic content—they indicate accessibility. Even educated readers prefer clear, concise writing. Aim for the lowest grade level that maintains necessary precision and sophistication.',
    },
    {
      question: 'Should all content have the same readability level?',
      answer: 'No, readability should match audience and content purpose. General marketing content targets 7th-8th grade for broad accessibility. Technical documentation may require 10th-12th grade for precision. Academic papers are often college-level. Children\'s content needs 3rd-6th grade. Legal documents, while often complex, benefit from simplification when possible. B2B content for experts can be more complex than B2C. However, even specialized audiences appreciate clarity. Don\'t use complexity to appear sophisticated—use the simplest language that accurately conveys your message. Test different readability levels with your specific audience.',
    },
    {
      question: 'How does sentence length affect readability?',
      answer: 'Sentence length significantly impacts readability. Shorter sentences (10-15 words) are easier to process and understand. Longer sentences (25+ words) increase cognitive load and confusion risk. Optimal average is 15-20 words per sentence. However, vary sentence length for rhythm and engagement—all short sentences feel choppy, all long sentences feel dense. Mix short punchy sentences with longer, more complex ones. Break run-on sentences into multiple sentences. Use punctuation (commas, semicolons) to create natural pauses. Shorter sentences particularly benefit mobile readers and non-native speakers.',
    },
    {
      question: 'What is passive voice and why does it hurt readability?',
      answer: 'Passive voice occurs when the subject receives the action rather than performing it. "The ball was thrown by John" (passive) versus "John threw the ball" (active). Passive voice hurts readability by adding words, obscuring who performs actions, creating distance from readers, and making sentences less direct and engaging. It\'s not always wrong—use passive voice when the actor is unknown or unimportant, or to emphasize the action over the actor. However, active voice is generally clearer, more concise, and more engaging. Aim for 80%+ active voice in most content.',
    },
    {
      question: 'Can readability tools help with different languages?',
      answer: 'Readability tools work best for English, with some supporting Spanish, French, German, and other major languages. However, formulas like Flesch Reading Ease are calibrated for English and may not translate accurately to other languages with different grammatical structures. Language-specific readability tools exist for major languages. When writing in non-English languages, use native readability tools when available. Universal principles still apply: shorter sentences, simpler words, active voice, and clear structure improve readability across languages. Consider cultural context—acceptable complexity varies by language and culture.',
    },
    {
      question: 'How do I balance readability with technical accuracy?',
      answer: 'Balance readability and technical accuracy by explaining technical terms when first used, using analogies to clarify complex concepts, breaking complex ideas into digestible chunks, providing examples alongside technical explanations, using glossaries for specialized terminology, and structuring content so readers can skip technical details if desired. Don\'t sacrifice accuracy for simplicity—find clearer ways to express complex ideas. Use appendices or expandable sections for technical depth. Test content with target audience members to ensure both clarity and accuracy. Good technical writing is both precise and accessible.',
    },
    {
      question: 'What are common readability mistakes?',
      answer: 'Common mistakes include using unnecessarily complex words, writing overly long sentences (25+ words), creating dense paragraphs (6+ sentences), overusing passive voice, including too much jargon without explanation, lacking clear structure and headings, using inconsistent terminology, writing without considering audience knowledge level, and not testing readability before publishing. Avoid these by writing for your audience, using readability tools during editing, reading content aloud, getting feedback from target readers, and prioritizing clarity over showing off vocabulary. Remember: the goal is communication, not demonstration of expertise.',
    },
    {
      question: 'How does readability affect content engagement?',
      answer: 'Readability directly impacts engagement metrics: readable content increases time on page (users can consume more content faster), reduces bounce rate (users don\'t leave due to confusion), improves scroll depth (users read further), increases social shares (people share content they understand), and boosts conversions (clear CTAs get more action). Difficult-to-read content frustrates users, especially on mobile devices. Readable content respects user time and cognitive resources. Even highly educated audiences prefer clear, concise writing. Improved readability can increase engagement by 20-40%, significantly impacting content ROI.',
    },
    {
      question: 'Should I check readability before or after SEO optimization?',
      answer: 'Check readability throughout the content creation process: during drafting to maintain clarity, after SEO optimization to ensure keywords do not hurt readability, and before final publication as a quality check. SEO and readability should work together, not compete. Keyword-optimized but unreadable content will not perform well. Use keywords naturally within readable sentences. If SEO optimization reduces readability significantly, revise to balance both. Modern SEO prioritizes user experience, so readable content that satisfies user intent ranks better than keyword-stuffed but difficult content. Integrate both considerations from the start.',
    },
    {
      question: 'How do readability scores vary by industry?',
      answer: 'Readability varies significantly by industry: Healthcare and medical content often requires 10th-12th grade for accuracy but should simplify patient-facing content to 6th-8th grade. Legal documents are typically college-level but consumer legal content should be 8th-10th grade. Financial services balance technical precision (10th-12th grade) with consumer accessibility (7th-9th grade). Technology and software documentation ranges from 8th grade (user guides) to college-level (developer documentation). Marketing and e-commerce target 6th-8th grade for broad appeal. Education content varies by student age. Analyze top-performing content in your industry to identify optimal readability levels.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Headline Analyzer',
      description: 'Score and optimize headlines for engagement',
      url: '/tools/content/headline-analyzer-enhanced',
      category: 'Content',
    },
    {
      name: 'Blog Outline Generator',
      description: 'Create SEO-optimized blog post structures',
      url: '/tools/content/blog-outline-generator-enhanced',
      category: 'Content',
    },
    {
      name: 'Keyword Density Checker',
      description: 'Analyze keyword usage and optimize for SEO',
      url: '/tools/content/keyword-density-checker-enhanced',
      category: 'Content',
    },
    {
      name: 'Meta Description Generator',
      description: 'Create compelling meta descriptions',
      url: '/tools/content/meta-description-generator-enhanced',
      category: 'Content',
    },
  ] as RelatedTool[],
};

