'use client';

import Link from 'next/link';
import {
  SparklesIcon,
  ChartBarIcon,
  MegaphoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const toolCategories = [
  {
    name: 'Marketing Calculators',
    icon: CalculatorIcon,
    count: 38,
    benefits: 'ROI, ROAS, LTV, CAC, CPA, conversion rate, and 30+ more',
    href: '/tools/calculators',
    highlight: true,
  },
  {
    name: 'Content Marketing',
    icon: SparklesIcon,
    count: 8,
    benefits: 'Create engaging content faster, optimize headlines, improve readability',
    href: '/tools/content',
  },
  {
    name: 'SEO & Analytics',
    icon: ChartBarIcon,
    count: 10,
    benefits: 'Boost search rankings, generate schema markup, analyze page speed',
    href: '/tools/seo',
  },
  {
    name: 'Social Media',
    icon: MegaphoneIcon,
    count: 6,
    benefits: 'Maximize engagement, find best posting times, optimize images',
    href: '/tools/social',
  },
  {
    name: 'Email Marketing',
    icon: EnvelopeIcon,
    count: 4,
    benefits: 'Improve deliverability, avoid spam filters, segment audiences',
    href: '/tools/email',
  },
  {
    name: 'Advertising & ROI',
    icon: CurrencyDollarIcon,
    count: 5,
    benefits: 'Optimize ad spend, calculate ROAS, improve landing pages',
    href: '/tools/advertising',
  },
];

const keyBenefits = [
  {
    title: 'No Credit Card Required',
    description: 'Start using all 70+ tools immediately - no payment info needed',
  },
  {
    title: 'Instant Results',
    description: 'Client-side processing means instant calculations with no waiting',
  },
  {
    title: 'Privacy-Friendly',
    description: 'No external APIs - your data stays private and secure',
  },
  {
    title: 'Export Anywhere',
    description: 'Download results as PDF, CSV, JSON, or copy to clipboard',
  },
];

export function FreeToolsSection() {
  return (
    <section className="py-16 bg-transparent border-t border-zinc-200 dark:border-zinc-900">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800">
            <CalculatorIcon className="h-4 w-4" />
            <span>70+ Free Marketing Tools</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-text-primary">
            Professional Marketing Tools Worth{' '}
            <span className="text-zinc-900 dark:text-white underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4">$540/month</span>
            {' '}— Completely Free
          </h2>

          <p className="text-xl leading-8 text-gray-600 dark:text-text-secondary">
            Access our complete suite including 38 marketing calculators.
            No credit card required, instant results.
          </p>
        </div>

        {/* Tool Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {toolCategories.map((category) => (
            <Card key={category.name} className="p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                  <category.icon className="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
                <div className="flex-1">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold mb-1 text-gray-900 dark:text-text-primary">
                      {category.name}
                    </CardTitle>
                    <p className="text-sm font-medium mb-2 text-gray-500 dark:text-text-tertiary">
                      {category.count} Tools Available
                    </p>
                    <CardDescription className="text-sm leading-relaxed text-gray-600 dark:text-text-secondary">
                      {category.benefits}
                    </CardDescription>
                  </CardHeader>
                </div>
              </div>
            </Card>
          ))}

          {/* CTA Card - Minimalist */}
          <Card className="p-6 bg-zinc-900 text-white flex flex-col justify-center items-center text-center shadow-md dark:bg-zinc-800 dark:text-white">
            <SparklesIcon className="h-12 w-12 mb-4 text-white opacity-80" />
            <h3 className="text-2xl font-bold mb-2 text-white">70+ Tools Total</h3>
            <p className="text-zinc-300 mb-6">Complete marketing toolkit</p>
            <Link href="/tools">
              <Button size="sm" className="text-sm px-6 bg-white text-black hover:bg-gray-100 border-none">
                Explore All Tools
                <ArrowRightIcon className="ml-2 h-4 w-4 inline" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Key Benefits - Minimalist */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 border-t border-gray-100 dark:border-border-primary pt-12">
          {keyBenefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3">
              <div className="mt-1 p-1 bg-gray-100 dark:bg-bg-tertiary rounded-full">
                <svg className="h-4 w-4 text-gray-900 dark:text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold mb-1 text-gray-900 dark:text-text-primary">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-text-secondary">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof & CTA - Minimalist */}
        <div className="text-center p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 backdrop-blur-sm">
          <p className="text-xl font-medium mb-8 text-gray-900 dark:text-text-primary max-w-2xl mx-auto">
            Join <span className="font-bold">1,000+ marketers</span> using these tools daily to optimize their campaigns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/tools">
              <Button size="lg" className="text-lg px-8 py-6 h-auto bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
                Try Free Tools Now
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="lg" className="text-lg px-8 py-6 h-auto text-gray-600 hover:text-gray-900 hover:bg-transparent underline underline-offset-4">
                Upgrade to Pro - Unlimited
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500 dark:text-text-tertiary">
            Free tier: 10 uses/tool/day • Pro tier: Unlimited access to all tools
          </p>
        </div>
      </div>
    </section>
  );
}

