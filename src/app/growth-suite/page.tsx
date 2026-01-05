import Link from 'next/link';
import {
  FlaskConical,
  TrendingUp,
  Search,
  Sparkles,
  Layout,
  MousePointer,
  Target,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

export const metadata = {
  title: 'Growth Suite - Aureon One',
  description: 'Comprehensive marketing growth tools for experimentation, attribution, SEO, content repurposing, and more.',
};

const tools = [
  {
    id: 'experiments',
    name: 'Experiment Builder',
    description: 'Create and run A/B tests with real-time stats and Bayesian analysis',
    icon: FlaskConical,
    href: '/growth-suite/experiments',
    features: ['Visual editor', 'Traffic splitting', 'Real-time stats', 'GA4 integration'],
    status: 'available',
  },
  {
    id: 'attribution',
    name: 'Attribution Explorer',
    description: 'Multi-touch attribution modeling with Sankey visualizations',
    icon: TrendingUp,
    href: '/growth-suite/attribution',
    features: ['Session stitching', 'Multiple models', 'Revenue tracking', 'CSV export'],
    status: 'available',
  },
  {
    id: 'seo',
    name: 'SEO Opportunity Engine',
    description: 'Discover keyword opportunities and generate AI-powered content briefs',
    icon: Search,
    href: '/growth-suite/seo',
    features: ['Search Console', 'Opportunity scoring', 'AI briefs', 'Export options'],
    status: 'available',
  },
  {
    id: 'repurposer',
    name: 'AI Content Repurposer',
    description: 'Transform content into social posts, emails, and video scripts',
    icon: Sparkles,
    href: '/growth-suite/repurposer',
    features: ['Multi-platform', 'Thumbnail generator', 'Hashtag suggestions', 'ZIP export'],
    status: 'available',
  },
  {
    id: 'widgets',
    name: 'Widget Library',
    description: 'Conversion optimization widgets with WYSIWYG editor',
    icon: Layout,
    href: '/growth-suite/widgets',
    features: ['Exit-intent', 'Slide-ins', 'Sticky bars', 'Social proof'],
    status: 'available',
  },
  {
    id: 'heatmaps',
    name: 'Heatmaps & Sessions',
    description: 'User behavior insights with click heatmaps and session replays',
    icon: MousePointer,
    href: '/growth-suite/heatmaps',
    features: ['Click tracking', 'Scroll depth', 'Session replay', 'PII masking'],
    status: 'available',
  },
  {
    id: 'competitors',
    name: 'Competitor Scanner',
    description: 'Track competitor rankings and get alerts for SERP changes',
    icon: Target,
    href: '/growth-suite/competitors',
    features: ['SERP tracking', 'Keyword monitoring', 'Email alerts', 'Weekly snapshots'],
    status: 'available',
  },
];

const benefits = [
  'Free tier with generous limits',
  'Seamless integration with existing tools',
  'Real-time analytics and insights',
  'Export data in multiple formats',
  'Privacy-first with PII masking',
  'Mobile-responsive dashboards',
];

export default function GrowthSuitePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-bg-primary">
      <main id="main-content" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 bg-gray-50 dark:bg-bg-tertiary border border-gray-200 dark:border-border-primary rounded-lg p-12 animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#F59E0B]/20 flex items-center justify-center">
                <Zap className="h-10 w-10 text-[#F59E0B]" />
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-text-primary">
              Growth Suite
            </h1>

            <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-text-secondary">
              Comprehensive marketing growth tools to solve daily marketer pain points.
              From experimentation to attribution, SEO to content repurposing—everything you need in one place.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="#tools"
                className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary h-11 px-6 py-2.5 text-base"
              >
                Explore Tools
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 border border-gray-200 dark:border-border-primary bg-transparent text-gray-900 dark:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-hover hover:border-blue-500 dark:hover:border-border-hover h-11 px-6 py-2.5 text-base"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-16 bg-gray-50 dark:bg-bg-tertiary border border-gray-200 dark:border-border-primary rounded-lg p-8 stagger-1">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-text-primary">
              Why Growth Suite?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
                  <span className="text-gray-600 dark:text-text-secondary">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          <div id="tools" className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-text-primary">
              7 Powerful Tools
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool, index) => {
                const Icon = tool.icon;
                const staggerClass = index < 6 ? `stagger-${(index % 3) + 1}` : '';

                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className={`bg-white dark:bg-bg-tertiary border border-gray-200 dark:border-border-primary rounded-lg p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-500 dark:hover:border-border-hover ${staggerClass}`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="rounded-lg p-3 mr-4 bg-[#F59E0B]/20">
                        <Icon className="h-6 w-6 text-[#F59E0B]" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-text-primary">
                        {tool.name}
                      </h3>
                    </div>

                    <p className="mb-4 text-gray-600 dark:text-text-secondary">
                      {tool.description}
                    </p>

                    <ul className="space-y-2 mb-4">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-text-tertiary">
                          <CheckCircle className="h-4 w-4 mr-2 text-[#F59E0B]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#F59E0B]">
                        {tool.status === 'available' ? 'Available Now' : 'Coming Soon'}
                      </span>
                      <ArrowRight className="h-5 w-5 text-[#F59E0B]" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gray-50 dark:bg-bg-tertiary border border-gray-200 dark:border-border-primary rounded-lg p-12 text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-text-primary">
              Ready to Accelerate Your Growth?
            </h2>

            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600 dark:text-text-secondary">
              Start with our free tier and unlock powerful marketing tools.
              No credit card required.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/growth-suite/experiments"
                className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary h-11 px-6 py-2.5 text-base"
              >
                Start with Experiments
                <FlaskConical className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 border border-gray-200 dark:border-border-primary bg-transparent text-gray-900 dark:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-hover hover:border-blue-500 dark:hover:border-border-hover h-11 px-6 py-2.5 text-base"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

