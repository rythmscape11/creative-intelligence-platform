'use client';

import { TrendingUp, Users, ShoppingCart, Target } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

/**
 * Metrics That Matter Section
 * 
 * Shows funnel stages with relevant KPIs
 */

export function MetricsThatMatter() {
  const funnelStages = [
    {
      stage: 'Awareness',
      icon: Users,
      kpis: ['Impressions', 'Reach', 'Brand Mentions'],
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
    },
    {
      stage: 'Consideration',
      icon: Target,
      kpis: ['Website Traffic', 'Engagement Rate', 'Time on Site'],
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
    },
    {
      stage: 'Conversion',
      icon: ShoppingCart,
      kpis: ['Leads Generated', 'Conversion Rate', 'Cost per Lead'],
      color: 'from-[#F59E0B]/20 to-[#D97706]/20',
      borderColor: 'border-[#F59E0B]/30',
    },
    {
      stage: 'Retention',
      icon: TrendingUp,
      kpis: ['Customer LTV', 'Repeat Rate', 'Churn Rate'],
      color: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-text-primary mb-4">
            Track Metrics That Matter
          </h2>
          <p className="text-lg text-gray-600 dark:text-text-secondary max-w-2xl mx-auto">
            Every marketing plan includes funnel-specific KPIs to measure success at each stage.
          </p>
        </div>

        {/* Funnel Visualization */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {funnelStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stage.color} border ${stage.borderColor} rounded-lg p-6 hover:scale-105 transition-transform duration-300`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white dark:bg-bg-primary rounded-lg">
                      <Icon className="h-6 w-6 text-gray-900 dark:text-text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">{stage.stage}</h3>
                  </div>

                  <ul className="space-y-2">
                    {stage.kpis.map((kpi, kpiIndex) => (
                      <li key={kpiIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-text-secondary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-text-secondary">{kpi}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Funnel Flow Indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-border-primary" />
            <span className="text-xs text-gray-500 dark:text-text-tertiary uppercase tracking-wider">Full Funnel Coverage</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-border-primary" />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-text-secondary mb-4">
            MediaPlanPro automatically suggests the right KPIs for your business goals.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-6 h-auto bg-blue-600 hover:bg-blue-700 text-white">
              Start Building Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
