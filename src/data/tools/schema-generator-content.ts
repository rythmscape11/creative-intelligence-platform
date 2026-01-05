import { FAQItem, TOCItem, HowToStep, RelatedTool } from '@/components/seo';

export const schemaGeneratorContent = {
  metadata: {
    title: 'Schema Markup Generator - Create Structured Data | Aureon One',
    description: 'Generate schema markup (JSON-LD) for rich search results. Free tool to create structured data for articles, products, events, and more.',
    keywords: ['schema markup generator', 'structured data generator', 'JSON-LD generator', 'rich snippets tool', 'schema.org generator'],
  },

  hero: {
    title: 'Schema Markup Generator',
    subtitle: 'Create Structured Data for Rich Results',
    description: 'Generate schema markup to enhance search listings with rich snippets, star ratings, prices, and more. Improve CTR and visibility.',
    primaryCTA: 'Generate Schema',
    secondaryCTA: 'View Examples',
  },

  quickAnswer: {
    question: 'What is Schema Markup?',
    answer: 'Schema markup is structured data code (JSON-LD, Microdata, or RDFa) added to webpages to help search engines understand content better. It enables rich results in search—star ratings, prices, event dates, FAQs, and more. Schema improves search visibility and click-through rates by making listings more informative and visually appealing. It\'s not a ranking factor but significantly enhances search presence.',
  },

  tableOfContents: [
    { id: 'how-to-use', title: 'How to Generate Schema Markup', level: 2 },
    { id: 'benefits', title: 'Benefits of Schema Markup', level: 2 },
    { id: 'schema-types', title: 'Common Schema Types', level: 2 },
    { id: 'implementation', title: 'Implementing Schema Markup', level: 2 },
    { id: 'faq', title: 'Frequently Asked Questions', level: 2 },
    { id: 'related-tools', title: 'Related SEO Tools', level: 2 },
  ] as TOCItem[],

  howToSteps: [
    { name: 'Select Schema Type', text: 'Choose schema type: Article, Product, Event, FAQ, HowTo, Organization, etc.' },
    { name: 'Enter Information', text: 'Fill in required and recommended properties for your chosen schema type.' },
    { name: 'Generate JSON-LD', text: 'Get properly formatted JSON-LD schema markup code.' },
    { name: 'Add to Page', text: 'Copy the schema code and add it to your webpage\'s <head> or <body>.' },
    { name: 'Test Schema', text: 'Validate using Google\'s Rich Results Test to ensure proper implementation.' },
    { name: 'Monitor Results', text: 'Track rich result appearance in Google Search Console.' },
  ] as HowToStep[],

  faqs: [
    {
      question: 'What is schema markup and why is it important?',
      answer: 'Schema markup is structured data vocabulary (from Schema.org) that helps search engines understand webpage content context and meaning. It\'s important because it enables rich results (enhanced search listings with ratings, prices, images, FAQs), improves click-through rates by 20-30% through more informative listings, helps search engines display your content in relevant features (knowledge panels, carousels), and provides better context for voice search and AI assistants. While not a direct ranking factor, schema significantly improves search visibility and user engagement. It\'s essential for competitive SEO in 2024.',
    },
    {
      question: 'What are the different types of schema markup?',
      answer: 'Common schema types include Article (news, blog posts), Product (e-commerce items with prices, ratings), Organization (company information, logo, social profiles), LocalBusiness (physical locations, hours, contact), Event (dates, locations, ticket info), FAQ (frequently asked questions), HowTo (step-by-step instructions), Recipe (ingredients, cooking time, nutrition), Review/Rating (star ratings, testimonials), VideoObject (video content), and Breadcrumb (navigation paths). Choose schema types matching your content. Multiple schemas can be used on one page. Focus on schemas that enable rich results for your content type.',
    },
    {
      question: 'What is JSON-LD and why should I use it?',
      answer: 'JSON-LD (JavaScript Object Notation for Linked Data) is Google\'s recommended format for schema markup. Use it because it\'s easier to implement (separate from HTML, usually in <script> tags), easier to maintain (doesn\'t intertwine with page content), less error-prone than Microdata or RDFa, and preferred by Google. JSON-LD can be added to <head> or <body> without affecting page rendering. It\'s the standard for modern schema implementation. While Microdata and RDFa still work, JSON-LD is simpler and more future-proof. All major search engines support JSON-LD.',
    },
    {
      question: 'How do I implement schema markup on my website?',
      answer: 'Implement schema by generating JSON-LD code using a schema generator or writing it manually, adding the code to your page\'s <head> section within <script type="application/ld+json"> tags, testing with Google\'s Rich Results Test to verify proper implementation, fixing any errors or warnings, and monitoring Google Search Console for rich result performance. For WordPress, use SEO plugins (Yoast, Rank Math, Schema Pro) that add schema automatically. For custom sites, add schema to templates. Implement schema on all relevant pages—products, articles, events, etc. Update schema when content changes.',
    },
    {
      question: 'What is the difference between schema markup and rich snippets?',
      answer: 'Schema markup is the structured data code you add to pages. Rich snippets are the enhanced search results that may appear because of that schema. Schema is the input; rich snippets are the potential output. Adding schema doesn\'t guarantee rich snippets—Google decides whether to display them based on content quality, schema correctness, and search query relevance. However, without schema, you can\'t get rich snippets. Think of schema as making your content eligible for rich results. Proper schema implementation significantly increases rich snippet likelihood, improving visibility and CTR.',
    },
    {
      question: 'How do I test my schema markup?',
      answer: 'Test schema using Google\'s Rich Results Test (search.google.com/test/rich-results) which shows how Google sees your schema and identifies errors, Schema Markup Validator (validator.schema.org) for general schema validation, and Google Search Console\'s Rich Results report for live performance data. Test before deploying to catch errors. Common issues include missing required properties, incorrect data types, and invalid URLs. Fix all errors and address warnings when possible. Test after any schema changes. Monitor Search Console for rich result impressions and clicks to measure schema impact.',
    },
    {
      question: 'Does schema markup improve SEO rankings?',
      answer: 'Schema markup is not a direct ranking factor—it doesn\'t make pages rank higher in search results. However, it indirectly improves SEO by increasing click-through rates through more attractive, informative listings, helping search engines understand content better (potentially improving relevance), enabling rich results that occupy more search real estate, and improving visibility in voice search and featured snippets. Higher CTR from rich results sends positive engagement signals to Google. While schema won\'t boost rankings alone, it\'s essential for maximizing visibility and traffic from existing rankings. It\'s a competitive advantage in search.',
    },
    {
      question: 'What are required vs. recommended schema properties?',
      answer: 'Required properties are mandatory for schema to be valid and eligible for rich results. For example, Product schema requires name, image, and offers. Recommended properties aren\'t mandatory but significantly improve rich result likelihood and quality. For Product, recommended properties include aggregateRating, review, and brand. Include all required properties to avoid errors. Add as many recommended properties as possible for best results. More complete schema data increases rich result chances. Check Google\'s documentation for each schema type to see required and recommended properties. Incomplete schema may not trigger rich results.',
    },
    {
      question: 'Can I use multiple schema types on one page?',
      answer: 'Yes, use multiple schema types when appropriate. For example, a blog post might have Article schema for the post, Organization schema for the publisher, and FAQ schema for questions in the content. An event page might combine Event schema with Organization and Place schemas. Use separate JSON-LD blocks for each schema type or nest related schemas. Ensure schemas don\'t conflict or duplicate information. Multiple schemas provide richer context to search engines. However, only use schemas that accurately represent page content—don\'t add irrelevant schemas just to get rich results.',
    },
    {
      question: 'How long does it take for schema to show in search results?',
      answer: 'After implementing schema, it typically takes 1-4 weeks for Google to crawl, process, and potentially display rich results. Timing varies based on crawl frequency (popular sites get crawled more often), schema correctness (errors delay or prevent rich results), content quality (Google only shows rich results for quality content), and competition (not all eligible pages get rich results). Request indexing in Google Search Console to speed up crawling. Monitor Search Console\'s Rich Results report for status. Don\'t expect immediate results—schema is a long-term SEO investment. Some pages may never get rich results despite correct schema.',
    },
    {
      question: 'What are common schema markup mistakes?',
      answer: 'Common mistakes include using schema for content not visible on the page (violates Google guidelines), marking up irrelevant content to manipulate rich results, missing required properties, incorrect data types (string instead of number), invalid URLs (relative instead of absolute), duplicate schema (same schema multiple times), using wrong schema type for content, not updating schema when content changes, and not testing before deployment. These mistakes prevent rich results or cause Google penalties. Always follow Google structured data guidelines, test thoroughly, and ensure schema accurately represents visible page content. Quality over quantity.',
    },
    {
      question: 'Should I use a schema plugin or add it manually?',
      answer: 'For WordPress and major CMSs, use reputable schema plugins (Yoast SEO, Rank Math, Schema Pro) for ease of implementation, automatic updates, and reduced errors. Plugins handle common schema types automatically and provide interfaces for customization. For custom sites or advanced needs, add schema manually for complete control, custom schema types, and optimal implementation. Manual implementation requires technical knowledge but offers flexibility. Hybrid approach: use plugins for basic schema, add custom JSON-LD for specialized needs. Regardless of method, always test schema and monitor performance. Choose based on technical expertise and requirements.',
    },
  ] as FAQItem[],

  relatedTools: [
    {
      name: 'SERP Preview',
      description: 'Preview how your page appears in search results',
      url: '/tools/seo/serp-preview-enhanced',
      category: 'SEO',
    },
    {
      name: 'Meta Description Generator',
      description: 'Create compelling meta descriptions',
      url: '/tools/content/meta-description-generator-enhanced',
      category: 'Content',
    },
    {
      name: 'Robots.txt Generator',
      description: 'Create robots.txt files for crawl control',
      url: '/tools/seo/robots-txt-generator-enhanced',
      category: 'SEO',
    },
    {
      name: 'XML Sitemap Generator',
      description: 'Create XML sitemaps for search engines',
      url: '/tools/seo/xml-sitemap-generator-enhanced',
      category: 'SEO',
    },
  ] as RelatedTool[],
};

