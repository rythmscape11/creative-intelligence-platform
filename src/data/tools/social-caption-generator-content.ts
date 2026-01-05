import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const socialCaptionGeneratorContent = {
  metadata: {
    title: 'Social Media Caption Generator - Create Engaging Captions | Aureon One',
    description: 'Generate engaging social media captions with hashtags and emojis. Free tool for social media managers, content creators, and influencers.',
    keywords: ['social media caption generator', 'Instagram caption generator', 'social post creator', 'caption ideas tool', 'hashtag generator'],
  },

  hero: {
    title: 'Social Caption Generator',
    subtitle: 'Create Engaging Social Media Captions',
    description: 'Generate compelling captions for Instagram, Facebook, Twitter, and LinkedIn. Include relevant hashtags, emojis, and calls-to-action.',
    primaryCTA: 'Generate Caption',
    secondaryCTA: 'View Examples',
  },

  quickAnswer: {
    question: 'What is a Social Caption Generator?',
    answer: 'A social caption generator is an AI-powered tool that creates engaging social media captions for platforms like Instagram, Facebook, Twitter, and LinkedIn. It generates captions with appropriate tone, hashtags, emojis, and calls-to-action based on your content topic, brand voice, and target audience. The tool helps social media managers save time while maintaining consistent, engaging content.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Use the Caption Generator', level: 2 },
    { id: 'benefits', title: 'Benefits & Use Cases', level: 2 },
    { id: 'best-practices', title: 'Caption Writing Best Practices', level: 2 },
    { id: 'platform-tips', title: 'Platform-Specific Tips', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related Social Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Select Platform', text: 'Choose your target social media platform (Instagram, Facebook, Twitter, LinkedIn).' },
    { name: 'Enter Topic', text: 'Input your post topic, product, or message you want to convey.' },
    { name: 'Choose Tone', text: 'Select caption tone: professional, casual, humorous, inspirational, or promotional.' },
    { name: 'Generate Captions', text: 'Get multiple caption variations with hashtags and emojis.' },
    { name: 'Customize', text: 'Edit generated captions to match your brand voice and specific needs.' },
    { name: 'Post and Track', text: 'Use the caption in your social post and monitor engagement performance.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What makes a good social media caption?',
      answer: 'A good social media caption combines several elements: a strong hook in the first line to grab attention, clear value or message that resonates with your audience, appropriate tone matching your brand and platform, relevant hashtags for discoverability (3-5 for most platforms), strategic emoji use for visual interest and emotion, a call-to-action encouraging engagement, and optimal length for the platform. Great captions tell stories, ask questions, provide value, or entertain while maintaining authenticity. They should complement your visual content and encourage likes, comments, shares, or clicks.',
    },
    {
      question: 'How long should social media captions be?',
      answer: 'Optimal caption length varies by platform: Instagram allows 2,200 characters but engagement peaks at 138-150 characters, though longer storytelling captions (1,000-2,000 characters) work for certain brands. Facebook performs best at 40-80 characters for high engagement, though longer posts work for community building. Twitter is limited to 280 characters, with 71-100 characters showing highest engagement. LinkedIn allows 3,000 characters with 150-300 performing well for professional content. TikTok captions should be 150-300 characters. Front-load important information as users may not expand long captions. Test different lengths for your specific audience.',
    },
    {
      question: 'How many hashtags should I use?',
      answer: 'Hashtag strategy varies by platform: Instagram allows 30 hashtags but 3-5 relevant hashtags perform best for engagement, with 9-11 maximizing reach. Use a mix of popular, niche, and branded hashtags. Facebook posts with 1-2 hashtags perform better than those with more. Twitter works well with 1-2 hashtags maximum. LinkedIn posts should use 3-5 professional hashtags. TikTok benefits from 3-5 trending and niche hashtags. Quality matters more than quantity—use relevant, specific hashtags your target audience follows. Research hashtag performance and avoid banned or spam-associated hashtags.',
    },
    {
      question: 'Should I use emojis in social media captions?',
      answer: 'Yes, emojis can increase engagement by 15-20% when used appropriately. They add visual interest, convey emotion quickly, break up text for readability, and make content feel more personal and relatable. Use 2-5 emojis per caption for optimal impact. Place emojis strategically: at the beginning for attention, as bullet points for lists, or to emphasize key points. Ensure emojis match your brand voice—professional B2B brands use fewer and more conservative emojis than B2C lifestyle brands. Avoid emoji overload that makes captions hard to read. Test emoji usage with your specific audience.',
    },
    {
      question: 'How do I write captions for different platforms?',
      answer: 'Adapt captions to each platform\'s culture and audience: Instagram favors storytelling, lifestyle content, and visual descriptions with hashtags. Facebook works well for conversational, community-building content with questions. Twitter requires concise, witty, or newsworthy content with trending hashtags. LinkedIn needs professional, value-driven content with industry insights. TikTok captions should be casual, trendy, and encourage participation. Each platform has different optimal lengths, hashtag strategies, and tone expectations. Repurpose core messages across platforms but customize format, length, and style for each. Test what resonates with your audience on each platform.',
    },
    {
      question: 'What are caption hooks and why are they important?',
      answer: 'Caption hooks are attention-grabbing opening lines that entice users to read more or stop scrolling. They\'re crucial because users decide whether to engage within 1-2 seconds. Effective hooks include asking intriguing questions, making bold statements, sharing surprising statistics, creating curiosity gaps, using humor or wit, or addressing pain points directly. The first 125 characters are especially important as they appear before "...more" on Instagram. Strong hooks increase read-through rates, engagement, and shares. Test different hook styles: question-based, statement-based, or story-based to find what works for your audience.',
    },
    {
      question: 'How do I include calls-to-action in captions?',
      answer: 'Include CTAs by being specific and direct about desired action: "Double tap if you agree," "Tag a friend who needs this," "Click the link in bio," "Share your thoughts in comments," "Save this for later," or "DM us for details." Place CTAs strategically—at the end after providing value, or at the beginning for urgent actions. Make CTAs easy and low-friction. Use action verbs and create urgency when appropriate. Test different CTA types: engagement-focused (like, comment, share), traffic-focused (link clicks), or conversion-focused (purchase, sign up). Effective CTAs can increase engagement by 30-50%.',
    },
    {
      question: 'Can I reuse captions across different posts?',
      answer: 'Yes, but with strategic adaptation. Create caption templates for recurring content types (product launches, testimonials, tips) while customizing specifics. Reuse high-performing captions for similar content, updating details and hashtags. Repurpose captions across platforms with platform-specific adjustments. However, avoid exact duplication too frequently as it appears lazy and reduces authenticity. Maintain a caption swipe file of successful captions for inspiration. Use scheduling tools to plan caption variations. The key is balancing efficiency with freshness—templates save time while customization maintains engagement and relevance.',
    },
    {
      question: 'How do I write captions that increase engagement?',
      answer: 'Increase engagement by asking questions that encourage comments, creating relatable content that prompts tags and shares, using storytelling that builds emotional connection, providing valuable tips or insights worth saving, incorporating trending topics or challenges, encouraging user-generated content, creating polls or "this or that" choices, and ending with clear CTAs. Respond to comments quickly to boost algorithm visibility. Post when your audience is most active. Use carousel posts with caption teasers. Test different engagement tactics and analyze which generate most likes, comments, shares, and saves for your specific audience.',
    },
    {
      question: 'What are caption mistakes to avoid?',
      answer: 'Avoid these common mistakes: being too salesy or promotional without providing value, using irrelevant hashtags for reach instead of relevance, writing vague captions that don\'t complement visuals, neglecting to proofread for typos and errors, using too many emojis that hurt readability, copying competitor captions without customization, ignoring platform-specific best practices, not including CTAs, making captions too long without line breaks, and using banned or spam hashtags. Also avoid controversial topics unless aligned with brand values, and don\'t use clickbait that doesn\'t match content. Focus on authenticity, value, and audience needs.',
    },
    {
      question: 'How do I maintain brand voice in captions?',
      answer: 'Maintain brand voice by creating brand voice guidelines documenting tone, language, and style, developing caption templates that reflect brand personality, using consistent vocabulary and phrases, maintaining appropriate formality level (casual vs. professional), staying true to brand values and messaging, and training all team members on brand voice. Create a caption approval process for consistency. Build a swipe file of on-brand captions as examples. Use brand-specific emojis and hashtags consistently. However, allow flexibility for platform differences and trending topics while maintaining core brand identity. Consistency builds recognition and trust.',
    },
    {
      question: 'Should I use line breaks in captions?',
      answer: 'Yes, line breaks significantly improve caption readability and engagement. They create visual white space, make captions scannable, emphasize key points, and reduce overwhelming text blocks. Use line breaks after 1-2 sentences, before and after lists or key points, and to separate different ideas. On Instagram, use periods or dashes on separate lines to create breaks (Instagram removes multiple line breaks). Most platforms support line breaks natively. Well-formatted captions with strategic line breaks can increase read-through rates by 20-30%. Test different formatting styles to find what works best for your content and audience.',
    },
    {
      question: 'How do I write captions for video content?',
      answer: 'Video captions should complement, not repeat, video content. Provide context or setup that makes viewers want to watch, tease key moments or value without spoiling, include timestamps for longer videos, add information not in the video (links, resources, credits), use captions to make videos accessible (many watch without sound), and include relevant hashtags for discoverability. For short-form video (TikTok, Reels), captions can be minimal as text often appears in video. For long-form (YouTube, IGTV), detailed captions with timestamps and resources add value. Always include CTAs encouraging views, likes, or shares.',
    },
    {
      question: 'Can caption generators help with content planning?',
      answer: 'Yes, caption generators significantly aid content planning by providing caption ideas that inspire visual content, helping batch-create captions for scheduled posts, maintaining consistent tone across content calendar, generating variations for A/B testing, and overcoming writer\'s block for daily posting. Use generators to create caption banks for different content types (products, tips, quotes, behind-the-scenes). Combine with content calendars for comprehensive planning. However, always customize generated captions to maintain authenticity and brand voice. Generators are starting points, not final solutions. The best approach combines AI efficiency with human creativity and brand knowledge.',
    },
    {
      question: 'How do I measure caption effectiveness?',
      answer: 'Measure caption effectiveness through engagement rate (likes, comments, shares relative to followers), reach and impressions (how many people see posts), saves (indicating valuable content), click-through rate on links, follower growth from posts, and conversion tracking for business goals. Use platform analytics to compare caption styles, lengths, and CTA types. Track which hashtags drive most engagement. A/B test caption variations when possible. Analyze top-performing captions to identify successful patterns. Monitor comments for sentiment and feedback. Effective captions show above-average engagement for your account and drive desired actions (awareness, traffic, conversions).',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'Hashtag Generator',
      description: 'Generate relevant hashtags for social media',
      url: '/tools/social/hashtag-generator-enhanced',
      category: 'Social',
    },
    {
      name: 'Best Time to Post',
      description: 'Find optimal posting times for engagement',
      url: '/tools/social/best-time-to-post-enhanced',
      category: 'Social',
    },
    {
      name: 'Engagement Calculator',
      description: 'Calculate social media engagement rates',
      url: '/tools/social/engagement-calculator-enhanced',
      category: 'Social',
    },
    {
      name: 'Content Calendar Generator',
      description: 'Plan your social media content schedule',
      url: '/tools/content/content-calendar-generator-enhanced',
      category: 'Content',
    },
  ] as RelatedTool[],
};

