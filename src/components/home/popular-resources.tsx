'use client';

import Link from 'next/link';
import { ArrowRightIcon, BookOpenIcon, WrenchIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const popularTools = [
  {
    name: 'Headline Analyzer',
    description: 'Score your headlines 0-100 with emotion and power word detection',
    href: '/tools/content/headline-analyzer-enhanced',
    category: 'Content',
  },
  {
    name: 'SEO Keyword Research',
    description: 'Find high-value keywords with search volume and competition data',
    href: '/tools/seo/keyword-research-enhanced',
    category: 'SEO',
  },
  {
    name: 'ROI Calculator',
    description: 'Calculate marketing ROI and track campaign performance',
    href: '/tools/advertising/roi-calculator-enhanced',
    category: 'Analytics',
  },
  {
    name: 'Meta Description Generator',
    description: 'Generate 5 SEO-optimized meta descriptions instantly',
    href: '/tools/content/meta-description-generator-enhanced',
    category: 'SEO',
  },
  {
    name: 'Social Media Engagement Calculator',
    description: 'Measure and improve your social media engagement rates',
    href: '/tools/social/engagement-calculator-enhanced',
    category: 'Social',
  },
  {
    name: 'Email Spam Score Checker',
    description: 'Test your emails to avoid spam filters and improve deliverability',
    href: '/tools/email/spam-score-checker-enhanced',
    category: 'Email',
  },
];

const popularResources = [
  {
    name: 'AI Marketing Plan Generator',
    description: 'Complete guide to using AI for creating comprehensive marketing strategies',
    href: '/resources/ai-marketing-plan-generator',
    icon: '🤖',
  },
  {
    name: 'Marketing KPI Dashboard',
    description: 'Track the metrics that matter most for your marketing success',
    href: '/resources/marketing-kpi-dashboard',
    icon: '📊',
  },
  {
    name: 'Marketing Strategy Template',
    description: 'Free downloadable template for building your marketing plan',
    href: '/resources/marketing-strategy-template',
    icon: '📋',
  },
  {
    name: 'AI for Agencies',
    description: 'How marketing agencies can leverage AI to scale their services',
    href: '/resources/ai-for-agencies',
    icon: '🚀',
  },
];

export function PopularResources() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-bg-secondary">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-4 text-gray-900 dark:text-text-primary">
            Popular Tools & Resources
          </h2>
          <p className="text-lg text-gray-600 dark:text-text-secondary">
            Explore our most-used marketing tools and comprehensive guides
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Tools */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <WrenchIcon className="h-6 w-6 text-gray-600 dark:text-text-secondary" />
              <h3 className="text-2xl font-medium text-gray-900 dark:text-text-primary">Most Popular Tools</h3>
            </div>

            {/* Mobile: Horizontal Scroll / Desktop: Vertical Stack */}
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory lg:block lg:overflow-visible lg:pb-0 lg:space-y-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
              {popularTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="flex-shrink-0 w-[85vw] sm:w-[300px] lg:w-auto snap-center block p-4 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary hover:bg-gray-50 dark:hover:bg-bg-elevated hover:border-blue-500 dark:hover:border-border-hover transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 h-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-text-primary group-hover:text-text-brand transition-colors line-clamp-1">
                          {tool.name}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-bg-elevated text-gray-500 dark:text-text-tertiary border border-gray-200 dark:border-border-primary whitespace-nowrap">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-text-secondary line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-gray-500 dark:text-text-tertiary group-hover:text-text-brand group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-2 lg:mt-6 text-center">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-text-brand hover:text-text-brand-hover font-medium transition-colors"
              >
                View All 70+ Tools
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Popular Resources */}
          <div className="mt-8 lg:mt-0">
            <div className="flex items-center gap-2 mb-6">
              <BookOpenIcon className="h-6 w-6 text-gray-600 dark:text-text-secondary" />
              <h3 className="text-2xl font-medium text-gray-900 dark:text-text-primary">Featured Guides</h3>
            </div>

            {/* Mobile: Horizontal Scroll / Desktop: Vertical Stack */}
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory lg:block lg:overflow-visible lg:pb-0 lg:space-y-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
              {popularResources.map((resource) => (
                <Link
                  key={resource.name}
                  href={resource.href}
                  className="flex-shrink-0 w-[85vw] sm:w-[300px] lg:w-auto snap-center block p-4 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary hover:bg-gray-50 dark:hover:bg-bg-elevated hover:border-blue-500 dark:hover:border-border-hover transition-all group"
                >
                  <div className="flex items-start gap-4 h-full">
                    <div className="text-3xl flex-shrink-0">{resource.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-text-primary group-hover:text-text-brand transition-colors mb-1 line-clamp-1">
                        {resource.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-text-secondary line-clamp-2">
                        {resource.description}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-gray-500 dark:text-text-tertiary group-hover:text-text-brand group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-2 lg:mt-6 text-center">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-text-brand hover:text-text-brand-hover font-medium transition-colors"
              >
                Browse All Resources
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-8 rounded-lg border border-gray-200 dark:border-border-primary bg-gray-100 dark:bg-bg-tertiary">
          <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-600 dark:text-text-secondary" />
          <h3 className="text-2xl font-medium mb-3 text-gray-900 dark:text-text-primary">
            Ready to Build Your Marketing Strategy?
          </h3>
          <p className="text-gray-600 dark:text-text-secondary mb-6 max-w-2xl mx-auto">
            Use our AI-powered strategy builder to create a comprehensive marketing plan in minutes.
            Export to PowerPoint, Word, or Excel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-text-brand text-white font-medium hover:bg-text-brand-hover transition-colors"
            >
              Start Building Free
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-gray-200 dark:border-border-primary bg-white dark:bg-bg-primary text-gray-900 dark:text-text-primary font-medium hover:bg-gray-50 dark:hover:bg-bg-elevated transition-colors"
            >
              Read Marketing Insights
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

