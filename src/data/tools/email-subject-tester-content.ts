import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const emailSubjectTesterContent = {
  // SEO Metadata
  metadata: {
    title: 'Email Subject Line Tester - Optimize for Higher Open Rates | Aureon One',
    description: 'Test and optimize email subject lines for maximum open rates. Free subject line analyzer tool for email marketers and copywriters.',
    keywords: [
      'email subject line tester',
      'subject line analyzer',
      'email subject optimizer',
      'open rate predictor',
      'email subject generator',
      'subject line score',
      'email marketing tool',
    ],
  },

  // Hero Section
  hero: {
    title: 'Email Subject Line Tester',
    subtitle: 'Optimize Subject Lines for Higher Open Rates',
    description: 'Test your email subject lines for spam triggers, character length, emotional impact, and mobile optimization. Get actionable insights to boost open rates.',
    primaryCTA: 'Test Subject Line',
    secondaryCTA: 'View Best Practices',
  },

  // Quick Answer (Featured Snippet Target)
  quickAnswer: {
    question: 'What is an Email Subject Line Tester?',
    answer: 'An email subject line tester is a tool that analyzes email subject lines for factors affecting open rates including spam trigger words, character length, personalization, emotional appeal, and mobile display. It provides a score and specific recommendations to improve deliverability and engagement, helping email marketers optimize campaigns before sending.',
  },

  // Table of Contents
  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Subject Line Tester', level: 2 },
    { id: 'benefits', title: 'Benefits & Use Cases', level: 2 },
    { id: 'scoring', title: 'How Subject Lines Are Scored', level: 2 },
    { id: 'best-practices', title: 'Subject Line Best Practices', level: 2 },
    { id: 'examples', title: 'High-Performing Examples', level: 2 },
    { id: 'spam-triggers', title: 'Avoiding Spam Triggers', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Email Tools', level: 2 },
  ] as TOCItem[],

  // How-To Steps (for HowTo Schema)
  howToSteps: [
    {
      name: 'Enter Subject Line',
      text: 'Type your email subject line into the tester. Include any personalization tokens or emojis you plan to use.',
    },
    {
      name: 'Review Score',
      text: 'Get an instant score based on length, spam triggers, emotional words, and mobile optimization.',
    },
    {
      name: 'Check Spam Analysis',
      text: 'Review spam trigger words and phrases that might send your email to junk folders.',
    },
    {
      name: 'Analyze Mobile Preview',
      text: 'See how your subject line appears on mobile devices where most emails are opened.',
    },
    {
      name: 'Read Recommendations',
      text: 'Get specific suggestions to improve open rates and deliverability.',
    },
    {
      name: 'Test Variations',
      text: 'Create and test multiple subject line variations to find the best performer for A/B testing.',
    },
  ] as HowToStep[],

  // FAQ Items (20 items)
  faqs: [
    {
      question: 'What is an email subject line tester?',
      answer: 'An email subject line tester is a specialized tool that evaluates email subject lines before sending campaigns. It analyzes multiple factors including character length for mobile display, spam trigger words that affect deliverability, emotional impact and power words, personalization elements, special characters and emojis, and overall engagement potential. The tool provides a numerical score and specific recommendations to improve open rates. This pre-send testing helps email marketers optimize subject lines for maximum deliverability and engagement.',
    },
    {
      question: 'What is a good email open rate?',
      answer: 'A good email open rate varies by industry but generally ranges from 15-25%. B2B industries average 15-20%, while B2C can reach 20-25%. Non-profit organizations often see higher rates (25-30%). However, open rates depend on list quality, audience engagement, sending frequency, and subject line effectiveness. Rates above 30% are excellent. Below 10% indicates problems with deliverability, list quality, or subject lines. Focus on improving your own baseline rather than industry averages. Track open rate trends over time and test subject line variations to continuously improve performance.',
    },
    {
      question: 'How long should email subject lines be?',
      answer: 'Optimal email subject lines are 40-50 characters or 6-10 words for mobile display. Mobile devices, where 60-70% of emails are opened, truncate longer subject lines. Desktop clients display up to 60-70 characters. Shorter subject lines (under 40 characters) can be impactful but may lack context. Longer subject lines (50-70 characters) work for desktop but get cut off on mobile. Test both short punchy subject lines and longer descriptive ones for your audience. Front-load important words since the beginning always displays. Character count matters more than word count for mobile optimization.',
    },
    {
      question: 'What are spam trigger words in subject lines?',
      answer: 'Spam trigger words are terms that email filters flag as potentially spammy, reducing deliverability. Common triggers include: money-related words (free, cash, earn, $$$), urgency words (act now, urgent, limited time), excessive punctuation (!!!, ???), all caps text, words like "guarantee," "winner," "congratulations," medical/pharmaceutical terms, and phrases like "click here" or "buy now." Using multiple triggers compounds the problem. However, context matters—legitimate businesses can use these words if overall email quality is high. Avoid obvious spam language while maintaining authentic, engaging subject lines.',
    },
    {
      question: 'Should I use emojis in email subject lines?',
      answer: 'Emojis in subject lines can increase open rates by 15-20% when used strategically. They add visual interest in crowded inboxes and convey emotion quickly. However, effectiveness varies by audience—B2C and younger demographics respond better than B2B or older audiences. Use 1-2 relevant emojis maximum; more appears unprofessional. Place emojis at the beginning or end, not middle. Test emoji rendering across email clients as some don\'t display properly. Ensure emojis match your brand voice and message. A/B test emoji versus non-emoji subject lines for your specific audience before widespread use.',
    },
    {
      question: 'How does personalization affect email open rates?',
      answer: 'Personalization significantly boosts open rates, with personalized subject lines increasing opens by 26% on average. Using recipient\'s first name is most common but can feel generic if overused. More effective personalization includes location, company name, recent behavior, purchase history, or interests. Dynamic content based on segments performs better than simple name insertion. However, incorrect personalization (wrong name, outdated information) damages trust and increases unsubscribes. Ensure data accuracy before personalizing. Test different personalization types for your audience. Balance personalization with privacy concerns—overly specific personalization can feel invasive.',
    },
    {
      question: 'What makes a subject line compelling?',
      answer: 'Compelling subject lines combine several elements: clear value proposition (what readers gain), curiosity or intrigue without clickbait, relevance to recipient interests or needs, urgency or timeliness when appropriate, personalization that feels authentic, specificity over vague promises, and emotional connection through power words. They avoid spam triggers while maintaining engagement. The best subject lines match email content—misleading subject lines increase unsubscribes despite higher initial opens. Test different approaches (question vs. statement, benefit vs. curiosity) to find what resonates with your specific audience and content type.',
    },
    {
      question: 'How do I A/B test email subject lines?',
      answer: 'A/B test subject lines by sending two variations to small segments (10-15% each) of your list, then sending the winner to the remaining 70-80%. Test one variable at a time: length, personalization, emoji use, question vs. statement, or emotional tone. Run tests for 2-4 hours to gather sufficient data. Ensure statistical significance (typically 1000+ recipients per variation). Use your email platform\'s built-in A/B testing features. Track opens, clicks, and conversions, not just opens. Document winning patterns to inform future campaigns. Test continuously as audience preferences evolve over time.',
    },
    {
      question: 'What\'s the difference between subject lines and preheader text?',
      answer: 'Subject lines are the main headline displayed in inbox listings, typically 40-70 characters. Preheader text (also called preview text) appears after the subject line in many email clients, showing the first 35-140 characters of email content. Together, they provide 90-140 characters to convince recipients to open. Optimize both: use subject line for main hook, preheader for supporting detail or additional value proposition. Don\'t repeat subject line in preheader. Avoid default preheader text like "View in browser" or "Unsubscribe." Craft intentional preheader text that complements your subject line for maximum impact.',
    },
    {
      question: 'How do subject lines affect email deliverability?',
      answer: 'Subject lines significantly impact deliverability through spam filter scoring. Spam trigger words, excessive punctuation, all caps, and misleading content increase spam scores, sending emails to junk folders. Consistent subject line quality builds sender reputation over time. Subject lines that generate high engagement (opens, clicks) improve future deliverability as ISPs recognize valuable content. Conversely, subject lines causing spam complaints or low engagement hurt sender reputation. Maintain consistent sending practices, avoid deceptive subject lines, and focus on relevance to your audience. Good deliverability requires both technical setup and quality content signaled by subject lines.',
    },
    {
      question: 'Should I use questions in email subject lines?',
      answer: 'Question-based subject lines can be highly effective, increasing open rates by 10-15% when done well. They engage curiosity and imply the email contains answers. Effective questions address reader pain points, desires, or interests. However, avoid obvious or rhetorical questions that don\'t create genuine curiosity. Questions work best when the answer isn\'t immediately obvious and provides real value. Test questions against statement-based subject lines for your audience. Some industries and audiences respond better to direct statements. Vary your approach—using questions in every email reduces their effectiveness through predictability.',
    },
    {
      question: 'How do I write subject lines for different email types?',
      answer: 'Adapt subject lines to email type: Promotional emails emphasize offers, discounts, or urgency. Newsletter subject lines highlight valuable content or insights. Transactional emails are clear and descriptive (order confirmation, shipping update). Welcome emails set expectations and build excitement. Re-engagement emails acknowledge absence and offer incentive to return. Event invitations include date, topic, and value proposition. Each type has different goals and reader expectations. Promotional emails can be more aggressive, while transactional emails should be straightforward. Match subject line tone and content to email purpose for optimal performance and subscriber satisfaction.',
    },
    {
      question: 'What are common subject line mistakes to avoid?',
      answer: 'Common mistakes include: using all caps (appears as shouting and triggers spam filters), excessive punctuation (!!!, ???), misleading clickbait that doesn\'t match content, being too vague ("Newsletter #47"), using too many spam trigger words, making subject lines too long for mobile, forgetting to test personalization tokens, using "Re:" or "Fwd:" deceptively, neglecting to preview on mobile devices, and not A/B testing. Avoid generic subject lines that don\'t differentiate your email. Don\'t sacrifice clarity for cleverness. Test subject lines with colleagues before sending to large lists to catch unclear or problematic phrasing.',
    },
    {
      question: 'How do I create urgency without being spammy?',
      answer: 'Create authentic urgency by using real deadlines (sale ends Friday, registration closes tomorrow), limited availability (only 10 spots left, while supplies last), or timely relevance (tax deadline approaching, seasonal opportunity). Be specific with dates and times rather than vague "limited time." Explain why urgency exists (product launch, event date, seasonal relevance). Avoid false urgency or constantly claiming scarcity—this damages trust. Use urgency sparingly for genuinely time-sensitive offers. Balance urgency language with value proposition. Phrases like "ending soon" or "last chance" work better than aggressive "act now" or "urgent." Authenticity maintains deliverability and subscriber trust.',
    },
    {
      question: 'Can subject line testing improve overall email performance?',
      answer: 'Yes, subject line testing significantly improves overall email performance beyond just open rates. Better subject lines attract more qualified subscribers who engage with content, improving click-through rates and conversions. Higher engagement signals to ISPs that your emails are valuable, improving deliverability for future campaigns. Testing reveals audience preferences, informing broader content strategy. Improved open rates increase revenue per email sent, improving campaign ROI. Subject line optimization is one of the highest-leverage email improvements—small changes yield significant results. Consistent testing and optimization can improve open rates by 20-50% over time, dramatically impacting email marketing effectiveness.',
    },
    {
      question: 'How do I write subject lines for mobile users?',
      answer: 'Optimize for mobile by keeping subject lines under 40 characters so they display fully on small screens. Front-load important words since the end may be truncated. Use clear, simple language that\'s scannable at a glance. Test how subject lines appear on actual mobile devices, not just desktop. Consider that mobile users often check email in distracting environments—subject lines must grab attention quickly. Avoid complex punctuation or special characters that may not render properly. Use emojis strategically for visual interest. Remember that 60-70% of emails are opened on mobile, so mobile optimization isn\'t optional—it\'s essential for email success.',
    },
    {
      question: 'What role does timing play with subject lines?',
      answer: 'Timing and subject lines work together for optimal performance. Time-sensitive subject lines (flash sale, today only) require strategic send times when recipients can act. Morning sends might use productivity-focused subject lines, while evening sends can be more casual or entertaining. Day of week affects subject line effectiveness—Monday emails might emphasize efficiency, Friday emails can be lighter. Seasonal or event-based subject lines must align with relevant dates. Test send times with different subject line styles to find optimal combinations. However, great subject lines can overcome suboptimal timing, while poor subject lines fail regardless of perfect timing. Focus on both for maximum impact.',
    },
    {
      question: 'How do I maintain subject line quality at scale?',
      answer: 'Maintain quality at scale by creating subject line templates for common email types, establishing brand guidelines for tone and style, using subject line testing tools consistently, building a swipe file of high-performing subject lines, training team members on best practices, implementing approval workflows for campaign emails, and regularly reviewing performance data to identify patterns. Automate testing where possible but maintain human review for brand voice. Create checklists for subject line requirements (length, spam check, mobile preview). Schedule regular team reviews of subject line performance. Quality at scale requires systems, training, and continuous improvement processes.',
    },
    {
      question: 'Should I use numbers in email subject lines?',
      answer: 'Numbers in subject lines can increase open rates by 15-20% by setting clear expectations and suggesting specific, actionable content. They work well for listicles ("5 Ways to..."), statistics ("73% of marketers..."), discounts ("Save 25%"), or deadlines ("3 days left"). Numbers stand out visually in text-heavy inboxes. Use digits (5) rather than words (five) for better scannability. However, avoid overusing numbers in every email—variety maintains interest. Ensure numbers are accurate and meaningful, not arbitrary. Test numbered versus non-numbered subject lines for your specific audience and content type to determine effectiveness.',
    },
    {
      question: 'How do I write subject lines that build trust?',
      answer: 'Build trust through subject lines by being accurate and honest about email content, avoiding clickbait or misleading promises, using your recognizable sender name, maintaining consistent tone and quality, delivering on subject line promises, being transparent about promotional content, respecting subscriber preferences and frequency, and personalizing appropriately without being creepy. Include your brand name when relevant for recognition. Avoid deceptive tactics like fake "Re:" or "Fwd:" prefixes. Honor unsubscribe requests promptly. Trust builds over time through consistent, valuable emails with subject lines that accurately represent content. Trustworthy subject lines may have slightly lower initial opens but build loyal, engaged subscribers.',
    },
  ] as FAQItem[],

  // Related Tools
  relatedTools: [
    {
      name: 'Spam Score Checker',
      description: 'Test email content for spam triggers',
      url: '/tools/email/spam-score-checker-enhanced',
      category: 'Email',
    },
    {
      name: 'Headline Analyzer',
      description: 'Score and optimize headlines for engagement',
      url: '/tools/content/headline-analyzer-enhanced',
      category: 'Content',
    },
    {
      name: 'Email Preview',
      description: 'Preview emails across different clients',
      url: '/tools/email/email-preview-enhanced',
      category: 'Email',
    },
    {
      name: 'Content Calendar Generator',
      description: 'Plan your email campaign schedule',
      url: '/tools/content/content-calendar-generator-enhanced',
      category: 'Content',
    },
  ] as RelatedTool[],
};

