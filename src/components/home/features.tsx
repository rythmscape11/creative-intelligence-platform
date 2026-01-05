'use client';

import {
  SparklesIcon,
  DocumentArrowDownIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  CalculatorIcon,
  PaintBrushIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'AI Strategy Generator',
    description: 'Director-level marketing strategies in under 5 minutes. Full-funnel plans with channels, budgets, and KPIs.',
    icon: SparklesIcon,
    highlight: true,
    badge: 'Core Feature',
  },
  {
    name: 'White-Label Reports',
    description: 'Add your logo, brand colors, and custom domains. Clients never see MediaPlanPro branding.',
    icon: PaintBrushIcon,
    badge: 'Agency',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'Client Workspaces',
    description: '10 separate workspaces for client management. Each with its own branding and strategy history.',
    icon: BuildingOffice2Icon,
    badge: 'Agency',
    gradient: 'from-purple-500 to-indigo-500',
  },
  {
    name: 'Export Anywhere',
    description: 'Download to PowerPoint, Word, Excel, or PDF. Professional templates ready for presentations.',
    icon: DocumentArrowDownIcon,
  },
  {
    name: '38+ Marketing Calculators',
    description: 'ROI, ROAS, LTV, CAC, CPA, and 30+ more. Free tools that drive organic traffic.',
    icon: CalculatorIcon,
    badge: 'Free',
  },
  {
    name: 'Team Collaboration',
    description: '10 seats included with Agency plan. Role-based permissions for your entire team.',
    icon: UserGroupIcon,
    badge: 'Agency',
    gradient: 'from-purple-500 to-indigo-500',
  },
];

export function Features() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-bg-primary">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <SparklesIcon className="h-3.5 w-3.5" />
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-text-primary mb-6">
            Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
              modern agencies
            </span>
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed text-gray-600 dark:text-text-secondary">
            White-label everything. Manage clients. Export professional reports.
            All the tools you need to scale.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${feature.gradient
                    ? 'bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-purple-500/20 hover:border-purple-500/40'
                    : 'bg-white/50 dark:bg-bg-secondary/50 border-gray-200 dark:border-border-primary hover:border-cyan-500/50'
                  } backdrop-blur-sm`}
              >
                {/* Badge */}
                {feature.badge && (
                  <div className={`absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-xs font-semibold ${feature.badge === 'Agency'
                      ? 'bg-purple-500 text-white'
                      : feature.badge === 'Free'
                        ? 'bg-green-500 text-white'
                        : 'bg-cyan-500 text-white'
                    }`}>
                    {feature.badge}
                  </div>
                )}

                <div className={`flex items-center justify-center h-12 w-12 rounded-xl mb-6 ${feature.gradient
                    ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400'
                    : 'bg-gray-100 dark:bg-bg-tertiary text-gray-700 dark:text-text-primary'
                  }`}>
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section - Updated with consistent metrics */}
        <div className="mt-20 rounded-2xl border border-gray-200 dark:border-border-primary bg-gradient-to-br from-gray-50 to-white dark:from-bg-secondary dark:to-bg-tertiary p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">
                500+
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-text-secondary">
                Agencies Worldwide
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                10K+
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-text-secondary">
                Reports Generated
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-cyan-500">
                38+
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-text-secondary">
                Free Calculators
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                98%
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-text-secondary">
                Time Saved
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

