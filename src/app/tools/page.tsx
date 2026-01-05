import { Metadata } from 'next';
import { ToolsPageClient } from './ToolsPageClient';
import { Tool } from '@/types/tools';

export const metadata: Metadata = {
  title: '30+ Free Marketing Tools - SEO, Content, Social Media & Analytics | Aureon One',
  description: 'Access 30+ powerful free marketing tools including SEO analyzers, content generators, social media planners, ROI calculators, and more. No signup required. Professional-grade tools for marketers.',
  keywords: [
    'free marketing tools',
    'SEO tools',
    'content marketing tools',
    'social media tools',
    'analytics tools',
    'email marketing tools',
    'advertising tools',
    'marketing calculator',
    'free SEO analyzer',
    'content generator',
    'social media planner',
    'ROI calculator',
    'calculators',
  ],
  authors: [{ name: 'Aureon One Team' }],
  openGraph: {
    title: '30+ Free Marketing Tools - SEO, Content, Social Media & Analytics',
    description: 'Access 30+ powerful free marketing tools for SEO, content creation, social media management, analytics, email marketing, and advertising. No signup required.',
    url: '/tools',
    siteName: 'Aureon One',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: '30+ Free Marketing Tools - SEO, Content, Social Media & Analytics',
    description: 'Access 30+ powerful free marketing tools for SEO, content creation, social media management, and analytics. No signup required.',
    creator: '@aureonone',
  },
  alternates: {
    canonical: '/tools',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const tools: Tool[] = [
  // Content Marketing Tools (8 tools)
  {
    id: 'headline-analyzer',
    name: 'Headline Analyzer',
    description: 'Score your headlines 0-100 with emotion and power word detection',
    category: 'content',
    icon: 'sparkles',
    href: '/tools/content/headline-analyzer-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'meta-description-generator',
    name: 'Meta Description Generator',
    description: 'Generate 5 SEO-optimized meta descriptions instantly',
    category: 'content',
    icon: 'file',
    href: '/tools/content/meta-description-generator-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'blog-outline-generator',
    name: 'Blog Outline Generator',
    description: 'Create structured blog outlines with 5 templates',
    category: 'content',
    icon: 'file',
    href: '/tools/content/blog-outline-generator-enhanced',
    isPro: false,
    value: 20
  },
  {
    id: 'readability-scorer',
    name: 'Readability Scorer',
    description: 'Analyze text with 5 readability formulas',
    category: 'content',
    icon: 'chart',
    href: '/tools/content/readability-scorer-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'keyword-density-checker',
    name: 'Keyword Density Checker',
    description: 'Check keyword density and avoid overuse',
    category: 'content',
    icon: 'search',
    href: '/tools/content/keyword-density-checker-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'social-caption-generator',
    name: 'Social Caption Generator',
    description: 'Generate engaging captions with 5 styles for all platforms',
    category: 'content',
    icon: 'sparkles',
    href: '/tools/content/social-caption-generator-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'email-subject-tester',
    name: 'Email Subject Tester',
    description: 'Test and optimize email subject lines for better open rates',
    category: 'content',
    icon: 'mail',
    href: '/tools/content/email-subject-tester-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'content-calendar-generator',
    name: 'Content Calendar Generator',
    description: 'Generate a 30-day content calendar for your marketing',
    category: 'content',
    icon: 'calendar',
    href: '/tools/content/content-calendar-generator-enhanced',
    isPro: false,
    value: 25
  },

  // SEO & Analytics Tools (10 tools)
  {
    id: 'serp-preview',
    name: 'SERP Preview',
    description: 'Preview how your page appears in Google search results',
    category: 'seo',
    icon: 'search',
    href: '/tools/seo/serp-preview-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'keyword-research',
    name: 'Keyword Research',
    description: 'Generate long-tail keyword variations with difficulty scores',
    category: 'seo',
    icon: 'search',
    href: '/tools/seo/keyword-research-enhanced',
    isPro: false,
    value: 30
  },
  {
    id: 'schema-generator',
    name: 'Schema Generator',
    description: 'Create JSON-LD structured data for 6 schema types',
    category: 'seo',
    icon: 'file',
    href: '/tools/seo/schema-generator-enhanced',
    isPro: false,
    value: 20
  },
  {
    id: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    description: 'Generate robots.txt files with form-based builder',
    category: 'seo',
    icon: 'file',
    href: '/tools/seo/robots-txt-generator-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'xml-sitemap-generator',
    name: 'XML Sitemap Generator',
    description: 'Generate XML sitemaps for search engines',
    category: 'seo',
    icon: 'file',
    href: '/tools/seo/xml-sitemap-generator-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'page-speed-analyzer',
    name: 'Page Speed Analyzer',
    description: 'Analyze page resources and get optimization suggestions',
    category: 'seo',
    icon: 'zap',
    href: '/tools/seo/page-speed-analyzer-enhanced',
    isPro: false,
    value: 20
  },
  {
    id: 'backlink-checker',
    name: 'Backlink Checker',
    description: 'Analyze your backlink profile health and quality',
    category: 'seo',
    icon: 'link',
    href: '/tools/seo/backlink-checker-enhanced',
    isPro: false,
    value: 30
  },

  // Social Media Tools (6 tools)
  {
    id: 'utm-builder',
    name: 'UTM Builder',
    description: 'Build campaign tracking URLs with UTM parameters',
    category: 'social',
    icon: 'share',
    href: '/tools/social/utm-builder-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'engagement-calculator',
    name: 'Engagement Calculator',
    description: 'Calculate social media engagement rates with benchmarks',
    category: 'social',
    icon: 'chart',
    href: '/tools/social/engagement-calculator-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    description: 'Generate platform-specific hashtags with volume estimates',
    category: 'social',
    icon: 'hash',
    href: '/tools/social/hashtag-generator-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'best-time-to-post',
    name: 'Best Time to Post',
    description: 'Find optimal posting times for maximum engagement',
    category: 'social',
    icon: 'clock',
    href: '/tools/social/best-time-to-post-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Get optimal image dimensions for social media platforms',
    category: 'social',
    icon: 'image',
    href: '/tools/social/image-resizer-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'social-audit-tool',
    name: 'Social Audit Tool',
    description: 'Audit your social media presence with 20-point checklist',
    category: 'social',
    icon: 'check',
    href: '/tools/social/social-audit-tool-enhanced',
    isPro: false,
    value: 20
  },

  // Email Marketing Tools (4 tools)
  {
    id: 'signature-generator',
    name: 'Email Signature Generator',
    description: 'Create professional HTML email signatures',
    category: 'email',
    icon: 'mail',
    href: '/tools/email/signature-generator-enhanced',
    isPro: false,
    value: 15
  },
  {
    id: 'email-preview',
    name: 'Email Preview Tool',
    description: 'Preview emails in Gmail, Outlook, Apple Mail, and Mobile',
    category: 'email',
    icon: 'eye',
    href: '/tools/email/email-preview-enhanced',
    isPro: false,
    value: 20
  },
  {
    id: 'spam-score-checker',
    name: 'Spam Score Checker',
    description: 'Check email content for spam triggers and improve deliverability',
    category: 'email',
    icon: 'shield',
    href: '/tools/email/spam-score-checker-enhanced',
    isPro: false,
    value: 25
  },
  {
    id: 'list-segmentation-calculator',
    name: 'List Segmentation Calculator',
    description: 'Calculate optimal email list segments for targeted campaigns',
    category: 'email',
    icon: 'users',
    href: '/tools/email/list-segmentation-calculator-enhanced',
    isPro: false,
    value: 20
  },

  // Advertising & ROI Tools (5 tools)
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    description: 'Calculate ROI, ROAS, CAC, CLV with visual charts',
    category: 'advertising',
    icon: 'dollar',
    href: '/tools/advertising/roi-calculator-enhanced',
    isPro: false,
    value: 25
  },
  {
    id: 'cpc-cpm-calculator',
    name: 'CPC/CPM Calculator',
    description: 'Calculate all ad metrics from any 2 inputs',
    category: 'advertising',
    icon: 'dollar',
    href: '/tools/advertising/cpc-cpm-calculator-enhanced',
    isPro: false,
    value: 10
  },
  {
    id: 'ad-copy-generator',
    name: 'Ad Copy Generator',
    description: 'Generate high-converting ad copy using 4 proven frameworks',
    category: 'advertising',
    icon: 'megaphone',
    href: '/tools/advertising/ad-copy-generator-enhanced',
    isPro: false,
    value: 30
  },
  {
    id: 'budget-allocator',
    name: 'Budget Allocator',
    description: 'Optimize your marketing budget across channels',
    category: 'advertising',
    icon: 'dollar',
    href: '/tools/advertising/budget-allocator-enhanced',
    isPro: false,
    value: 25
  },
  {
    id: 'landing-page-analyzer',
    name: 'Landing Page Analyzer',
    description: 'Analyze and optimize landing pages for conversions',
    category: 'advertising',
    icon: 'file-search',
    href: '/tools/advertising/landing-page-analyzer-enhanced',
    isPro: false,
    value: 30
  },
];

export default function ToolsPage() {
  const totalValue = tools.reduce((sum, tool) => sum + tool.value, 0);

  return (
    <>
      <ToolsPageClient tools={tools} totalValue={totalValue} />
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Aureon One Free Marketing Tools',
            description: '30+ free marketing tools for SEO, content creation, social media management, analytics, email marketing, and advertising',
            url: 'https://aureonone.com/tools',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            featureList: [
              'SEO Tools',
              'Content Marketing Tools',
              'Social Media Tools',
              'Analytics Tools',
              'Email Marketing Tools',
              'Advertising Tools',
              'Calculators',
            ],
            provider: {
              '@type': 'Organization',
              name: 'Aureon One',
              url: 'https://aureonone.com',
            },
          }),
        }}
      />
    </>
  );
}

