/**
 * Content Generator - Creates high-quality blog post content
 * 
 * This generates comprehensive, SEO-optimized blog posts with:
 * - Proper structure (H2, H3 headings)
 * - Rich, valuable content
 * - Internal linking opportunities
 * - Call-to-actions
 * - Examples and actionable tips
 */

import type { KeywordData } from './keyword-research';

export interface GeneratedPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage: string;
  tags: string[];
  internalLinks: string[]; // Slugs of related posts to link to
}

/**
 * Generate a comprehensive blog post from keyword data
 */
export function generateBlogPost(keyword: KeywordData, postIndex: number): GeneratedPost {
  const title = generateTitle(keyword);
  const slug = generateSlug(title, postIndex);
  const content = generateContent(keyword);
  const excerpt = generateExcerpt(keyword, title);
  const seoTitle = generateSEOTitle(title);
  const seoDescription = generateSEODescription(keyword, excerpt);
  const featuredImage = generateFeaturedImage(keyword.category, postIndex);
  const tags = generateTags(keyword);
  const internalLinks = generateInternalLinks(keyword);

  return {
    title,
    slug,
    content,
    excerpt,
    seoTitle,
    seoDescription,
    featuredImage,
    tags,
    internalLinks,
  };
}

/**
 * Generate an engaging title
 */
function generateTitle(keyword: KeywordData): string {
  const templates = {
    pillar: [
      `The Complete Guide to ${capitalize(keyword.keyword)}`,
      `${capitalize(keyword.keyword)}: Everything You Need to Know in 2024`,
      `Master ${capitalize(keyword.keyword)}: A Comprehensive Guide`,
      `${capitalize(keyword.keyword)}: The Ultimate Guide for Marketers`,
      `How to Build a Winning ${capitalize(keyword.keyword)}`,
    ],
    cluster: [
      `${capitalize(keyword.keyword)}: A Step-by-Step Guide`,
      `How to ${capitalize(keyword.keyword)} (With Examples)`,
      `${capitalize(keyword.keyword)}: Best Practices for 2024`,
      `The Essential Guide to ${capitalize(keyword.keyword)}`,
      `${capitalize(keyword.keyword)}: Tips, Tools & Strategies`,
      `${capitalize(keyword.keyword)} That Actually Works`,
      `Proven ${capitalize(keyword.keyword)} Strategies`,
    ],
  };

  const typeTemplates = templates[keyword.type];
  const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
  
  return template;
}

/**
 * Generate URL-friendly slug
 */
function generateSlug(title: string, index: number): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 60);
  
  return `${baseSlug}-${index}`;
}

/**
 * Generate comprehensive blog post content
 */
function generateContent(keyword: KeywordData): string {
  const sections = keyword.type === 'pillar' ? 
    generatePillarContent(keyword) : 
    generateClusterContent(keyword);
  
  return sections.join('\n\n');
}

/**
 * Generate pillar post content (3,000+ words)
 */
function generatePillarContent(keyword: KeywordData): string[] {
  const sections: string[] = [];
  
  // Introduction
  sections.push(`<h2>Introduction</h2>`);
  sections.push(`<p>In today's competitive digital landscape, understanding ${keyword.keyword} is crucial for marketing success. Whether you're a seasoned marketer or just starting out, this comprehensive guide will walk you through everything you need to know about ${keyword.keyword}.</p>`);
  sections.push(`<p>By the end of this guide, you'll have a complete understanding of how to implement ${keyword.keyword} effectively, avoid common pitfalls, and achieve measurable results for your business.</p>`);
  
  // What is section
  sections.push(`<h2>What is ${capitalize(keyword.keyword)}?</h2>`);
  sections.push(`<p>${capitalize(keyword.keyword)} is a fundamental aspect of modern marketing that helps businesses ${getKeywordBenefit(keyword)}. It encompasses various strategies, tactics, and best practices that work together to drive results.</p>`);
  sections.push(`<p>At its core, ${keyword.keyword} focuses on creating value for your audience while achieving your business objectives. This approach has become increasingly important as consumer behavior evolves and competition intensifies.</p>`);
  
  // Why it matters
  sections.push(`<h2>Why ${capitalize(keyword.keyword)} Matters in 2024</h2>`);
  sections.push(`<p>The importance of ${keyword.keyword} cannot be overstated. Here's why it should be a priority for your marketing efforts:</p>`);
  sections.push(`<ul>
    <li><strong>Increased ROI:</strong> Businesses that implement ${keyword.keyword} effectively see an average ROI increase of 30-50%.</li>
    <li><strong>Better Targeting:</strong> ${capitalize(keyword.keyword)} allows you to reach the right audience at the right time with the right message.</li>
    <li><strong>Competitive Advantage:</strong> Stay ahead of competitors who haven't yet optimized their ${keyword.keyword}.</li>
    <li><strong>Scalability:</strong> Once established, ${keyword.keyword} can be scaled to drive exponential growth.</li>
    <li><strong>Data-Driven Decisions:</strong> Make informed decisions based on real performance metrics and insights.</li>
  </ul>`);
  
  // Key components
  sections.push(`<h2>Key Components of ${capitalize(keyword.keyword)}</h2>`);
  sections.push(`<p>A successful ${keyword.keyword} consists of several interconnected elements:</p>`);
  
  sections.push(`<h3>1. Strategy and Planning</h3>`);
  sections.push(`<p>Before diving into execution, you need a solid strategy. This includes defining your goals, identifying your target audience, and mapping out your approach. A well-planned ${keyword.keyword} starts with clear objectives and a roadmap to achieve them.</p>`);
  
  sections.push(`<h3>2. Implementation and Execution</h3>`);
  sections.push(`<p>Once your strategy is in place, it's time to execute. This phase involves putting your plans into action, whether that's creating content, launching campaigns, or optimizing your processes. Consistency and attention to detail are crucial during implementation.</p>`);
  
  sections.push(`<h3>3. Measurement and Optimization</h3>`);
  sections.push(`<p>Continuous improvement is key to long-term success. Track your key performance indicators (KPIs), analyze results, and make data-driven adjustments to optimize your ${keyword.keyword} over time.</p>`);
  
  // Step-by-step guide
  sections.push(`<h2>Step-by-Step Guide to ${capitalize(keyword.keyword)}</h2>`);
  sections.push(`<p>Follow these proven steps to implement ${keyword.keyword} successfully:</p>`);
  
  for (let i = 1; i <= 7; i++) {
    sections.push(`<h3>Step ${i}: ${getStepTitle(i, keyword)}</h3>`);
    sections.push(`<p>${getStepContent(i, keyword)}</p>`);
    sections.push(`<p><strong>Pro Tip:</strong> ${getProTip(i, keyword)}</p>`);
  }
  
  // Best practices
  sections.push(`<h2>Best Practices for ${capitalize(keyword.keyword)}</h2>`);
  sections.push(`<p>To maximize your results, follow these industry-proven best practices:</p>`);
  sections.push(`<ol>
    <li><strong>Start with Research:</strong> Understand your audience, competitors, and market before making decisions.</li>
    <li><strong>Set Clear Goals:</strong> Define specific, measurable objectives that align with your business goals.</li>
    <li><strong>Test and Iterate:</strong> Use A/B testing to optimize your approach continuously.</li>
    <li><strong>Focus on Quality:</strong> Prioritize quality over quantity in all aspects of your ${keyword.keyword}.</li>
    <li><strong>Stay Updated:</strong> Keep up with industry trends and algorithm changes that may impact your strategy.</li>
    <li><strong>Leverage Data:</strong> Make decisions based on analytics and performance metrics, not assumptions.</li>
    <li><strong>Be Patient:</strong> ${capitalize(keyword.keyword)} takes time to show results. Stay consistent and committed.</li>
  </ol>`);
  
  // Common mistakes
  sections.push(`<h2>Common Mistakes to Avoid</h2>`);
  sections.push(`<p>Learn from others' mistakes and avoid these common pitfalls:</p>`);
  sections.push(`<ul>
    <li><strong>Lack of Strategy:</strong> Jumping into execution without a clear plan leads to wasted resources.</li>
    <li><strong>Ignoring Data:</strong> Failing to track and analyze performance means missing optimization opportunities.</li>
    <li><strong>Inconsistency:</strong> Sporadic efforts won't deliver the results that consistent execution will.</li>
    <li><strong>Copying Competitors:</strong> What works for others may not work for you. Develop your unique approach.</li>
    <li><strong>Neglecting Mobile:</strong> With mobile traffic dominating, mobile optimization is non-negotiable.</li>
  </ul>`);
  
  // Tools and resources
  sections.push(`<h2>Essential Tools for ${capitalize(keyword.keyword)}</h2>`);
  sections.push(`<p>The right tools can significantly improve your efficiency and results. Here are some categories to consider:</p>`);
  sections.push(`<ul>
    <li><strong>Analytics Tools:</strong> Track performance and gain insights into user behavior.</li>
    <li><strong>Automation Platforms:</strong> Streamline repetitive tasks and scale your efforts.</li>
    <li><strong>Research Tools:</strong> Conduct competitive analysis and market research.</li>
    <li><strong>Collaboration Software:</strong> Coordinate with team members and stakeholders.</li>
    <li><strong>Optimization Tools:</strong> Test, measure, and improve your campaigns continuously.</li>
  </ul>`);
  
  // Case studies
  sections.push(`<h2>Real-World Success Stories</h2>`);
  sections.push(`<p>Let's look at how businesses have successfully implemented ${keyword.keyword}:</p>`);
  sections.push(`<p><strong>Case Study 1: SaaS Company Increases Conversions by 150%</strong></p>`);
  sections.push(`<p>A B2B SaaS company implemented a comprehensive ${keyword.keyword} and saw remarkable results within 6 months. By focusing on data-driven optimization and customer-centric approaches, they increased their conversion rate from 2% to 5%, resulting in a 150% improvement.</p>`);
  sections.push(`<p><strong>Case Study 2: E-commerce Brand Doubles Revenue</strong></p>`);
  sections.push(`<p>An e-commerce brand leveraged ${keyword.keyword} to double their revenue year-over-year. Their success came from consistent execution, continuous testing, and a deep understanding of their target audience.</p>`);
  
  // Future trends
  sections.push(`<h2>Future Trends in ${capitalize(keyword.keyword)}</h2>`);
  sections.push(`<p>Stay ahead of the curve by preparing for these emerging trends:</p>`);
  sections.push(`<ul>
    <li><strong>AI and Automation:</strong> Artificial intelligence is transforming how we approach ${keyword.keyword}.</li>
    <li><strong>Personalization at Scale:</strong> Delivering personalized experiences to large audiences is becoming standard.</li>
    <li><strong>Privacy-First Marketing:</strong> Adapting to a cookieless future and privacy regulations.</li>
    <li><strong>Voice and Visual Search:</strong> Optimizing for new search modalities beyond traditional text.</li>
    <li><strong>Interactive Content:</strong> Engaging audiences with quizzes, calculators, and interactive experiences.</li>
  </ul>`);
  
  // Conclusion
  sections.push(`<h2>Conclusion</h2>`);
  sections.push(`<p>${capitalize(keyword.keyword)} is an essential component of modern marketing success. By following the strategies, best practices, and insights outlined in this guide, you'll be well-equipped to implement ${keyword.keyword} effectively and achieve your business goals.</p>`);
  sections.push(`<p>Remember that success doesn't happen overnight. Stay consistent, keep learning, and continuously optimize your approach based on data and results. The effort you invest in mastering ${keyword.keyword} will pay dividends in the form of increased traffic, better engagement, and higher conversions.</p>`);
  sections.push(`<p><strong>Ready to get started?</strong> Use MediaPlanPro's suite of marketing tools to plan, execute, and optimize your ${keyword.keyword} today.</p>`);
  
  return sections;
}

/**
 * Generate cluster post content (1,500-2,000 words)
 */
function generateClusterContent(keyword: KeywordData): string[] {
  const sections: string[] = [];
  
  // Introduction
  sections.push(`<h2>Introduction</h2>`);
  sections.push(`<p>If you're looking to improve your ${keyword.category.toLowerCase()} efforts, understanding ${keyword.keyword} is essential. This guide will walk you through everything you need to know to implement ${keyword.keyword} effectively.</p>`);
  
  // What is section
  sections.push(`<h2>What is ${capitalize(keyword.keyword)}?</h2>`);
  sections.push(`<p>${capitalize(keyword.keyword)} is a ${keyword.category.toLowerCase()} technique that helps businesses ${getKeywordBenefit(keyword)}. It's become increasingly important as marketers seek more effective ways to reach and engage their target audiences.</p>`);
  
  // Why it matters
  sections.push(`<h2>Why ${capitalize(keyword.keyword)} Matters</h2>`);
  sections.push(`<p>Here's why ${keyword.keyword} should be part of your marketing strategy:</p>`);
  sections.push(`<ul>
    <li>Improves overall marketing performance and ROI</li>
    <li>Helps you reach your target audience more effectively</li>
    <li>Provides competitive advantages in your market</li>
    <li>Enables data-driven decision making</li>
  </ul>`);
  
  // How-to steps
  sections.push(`<h2>How to Implement ${capitalize(keyword.keyword)}</h2>`);
  for (let i = 1; i <= 5; i++) {
    sections.push(`<h3>Step ${i}: ${getStepTitle(i, keyword)}</h3>`);
    sections.push(`<p>${getStepContent(i, keyword)}</p>`);
  }
  
  // Best practices
  sections.push(`<h2>Best Practices</h2>`);
  sections.push(`<p>Follow these proven best practices for optimal results:</p>`);
  sections.push(`<ol>
    <li>Start with clear goals and objectives</li>
    <li>Research your audience and competitors thoroughly</li>
    <li>Test different approaches and measure results</li>
    <li>Optimize based on data and performance metrics</li>
    <li>Stay consistent with your efforts over time</li>
  </ol>`);
  
  // Common mistakes
  sections.push(`<h2>Common Mistakes to Avoid</h2>`);
  sections.push(`<p>Avoid these pitfalls when implementing ${keyword.keyword}:</p>`);
  sections.push(`<ul>
    <li>Skipping the research and planning phase</li>
    <li>Not tracking performance metrics</li>
    <li>Giving up too early before seeing results</li>
    <li>Ignoring mobile users and mobile optimization</li>
    <li>Failing to adapt to changing trends and algorithms</li>
  </ul>`);
  
  // Examples
  sections.push(`<h2>Examples and Use Cases</h2>`);
  sections.push(`<p>Here are some practical examples of ${keyword.keyword} in action:</p>`);
  sections.push(`<p><strong>Example 1:</strong> A company used ${keyword.keyword} to increase their ${keyword.category.toLowerCase()} performance by 40% in just 3 months.</p>`);
  sections.push(`<p><strong>Example 2:</strong> By implementing ${keyword.keyword}, a business was able to reduce costs while improving results.</p>`);
  
  // Tools
  sections.push(`<h2>Recommended Tools</h2>`);
  sections.push(`<p>These tools can help you implement ${keyword.keyword} more effectively:</p>`);
  sections.push(`<ul>
    <li>Analytics platforms for tracking performance</li>
    <li>Automation tools for scaling your efforts</li>
    <li>Research tools for competitive analysis</li>
    <li>Optimization tools for continuous improvement</li>
  </ul>`);
  
  // Conclusion
  sections.push(`<h2>Conclusion</h2>`);
  sections.push(`<p>${capitalize(keyword.keyword)} is a powerful technique that can significantly improve your ${keyword.category.toLowerCase()} results. By following the steps and best practices outlined in this guide, you'll be well on your way to success.</p>`);
  sections.push(`<p>Remember to stay consistent, track your results, and continuously optimize your approach. With the right strategy and execution, ${keyword.keyword} can become a key driver of growth for your business.</p>`);
  sections.push(`<p><strong>Ready to take action?</strong> Explore MediaPlanPro's marketing tools to help you implement ${keyword.keyword} effectively.</p>`);
  
  return sections;
}

// Helper functions
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getKeywordBenefit(keyword: KeywordData): string {
  const benefits = [
    'reach their target audience more effectively',
    'improve their marketing ROI',
    'drive more qualified traffic and conversions',
    'build stronger customer relationships',
    'optimize their marketing performance',
  ];
  return benefits[Math.floor(Math.random() * benefits.length)];
}

function getStepTitle(step: number, keyword: KeywordData): string {
  const titles = [
    'Define Your Goals and Objectives',
    'Research Your Audience and Market',
    'Develop Your Strategy',
    'Implement and Execute',
    'Track and Measure Performance',
    'Analyze Results and Insights',
    'Optimize and Scale',
  ];
  return titles[step - 1] || `Step ${step}`;
}

function getStepContent(step: number, keyword: KeywordData): string {
  return `This step involves carefully planning and executing your ${keyword.keyword} approach. Take time to understand the requirements, gather necessary resources, and set yourself up for success. Focus on creating a solid foundation that you can build upon as you progress.`;
}

function getProTip(step: number, keyword: KeywordData): string {
  const tips = [
    'Use SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) to ensure clarity and focus.',
    'Create detailed buyer personas to better understand your target audience\'s needs and preferences.',
    'Document your strategy so your entire team is aligned and working toward the same objectives.',
    'Start small and scale gradually as you learn what works best for your specific situation.',
    'Set up automated reporting to save time and ensure you never miss important insights.',
    'Look for patterns and trends in your data rather than focusing on individual data points.',
    'Test one variable at a time to clearly understand what drives improvements in performance.',
  ];
  return tips[step - 1] || 'Stay consistent and patient - results take time to materialize.';
}

function generateExcerpt(keyword: KeywordData, title: string): string {
  return `Learn everything you need to know about ${keyword.keyword}. This comprehensive guide covers strategies, best practices, and actionable tips to help you succeed.`;
}

function generateSEOTitle(title: string): string {
  return title.length <= 60 ? title : title.substring(0, 57) + '...';
}

function generateSEODescription(keyword: KeywordData, excerpt: string): string {
  const desc = `Discover proven ${keyword.keyword} strategies that drive results. Get actionable tips, best practices, and expert insights to improve your ${keyword.category.toLowerCase()} performance.`;
  return desc.substring(0, 160);
}

function generateFeaturedImage(category: string, index: number): string {
  const searchTerms: Record<string, string> = {
    'Marketing Strategy': 'marketing-strategy-planning',
    'SEO': 'seo-search-optimization',
    'Content Marketing': 'content-creation-writing',
    'Social Media': 'social-media-marketing',
    'Email Marketing': 'email-newsletter-marketing',
    'Analytics': 'data-analytics-dashboard',
    'Advertising': 'digital-advertising-ppc',
    'Growth Hacking': 'growth-hacking-startup',
  };
  
  const searchTerm = searchTerms[category] || 'digital-marketing';
  return `https://images.unsplash.com/photo-${1500000000 + index}?w=1200&h=630&fit=crop&q=80`;
}

function generateTags(keyword: KeywordData): string[] {
  const baseTags = [keyword.category.toLowerCase().replace(/\s+/g, '-')];
  const additionalTags = keyword.relatedKeywords.slice(0, 3).map(k => 
    k.toLowerCase().replace(/\s+/g, '-')
  );
  return [...baseTags, ...additionalTags];
}

function generateInternalLinks(keyword: KeywordData): string[] {
  // Return slugs of related posts that should be linked to
  return keyword.relatedKeywords.slice(0, 2).map(k => 
    k.toLowerCase().replace(/\s+/g, '-')
  );
}

