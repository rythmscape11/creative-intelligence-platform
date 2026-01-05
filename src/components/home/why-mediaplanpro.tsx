'use client';

import { CheckCircle, X } from 'lucide-react';

/**
 * Why MediaPlanPro Section
 * 
 * Problem-Solution comparison table showing the value proposition
 */

export function WhyMediaPlanPro() {
  const comparisons = [
    {
      problem: 'You spend hours making decks',
      solution: 'Auto-generate ready-to-present PPT plans',
    },
    {
      problem: 'Metrics are scattered',
      solution: 'Unified dashboard with funnel metrics',
    },
    {
      problem: 'AI feels generic',
      solution: 'Context-aware marketing plans, not templates',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-bg-secondary border-y border-gray-200 dark:border-border-primary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-text-primary mb-4">
            Why MediaPlanPro?
          </h2>
          <p className="text-lg text-gray-600 dark:text-text-secondary max-w-2xl mx-auto">
            Stop wasting time on manual strategy work. Let AI do the heavy lifting.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problems Column */}
            <div>
              <div className="bg-white dark:bg-bg-primary border border-gray-200 dark:border-border-primary rounded-lg p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <X className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">The Problem</h3>
                </div>
                <div className="space-y-4">
                  {comparisons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-600 dark:text-text-secondary">{item.problem}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Solutions Column */}
            <div>
              <div className="bg-white dark:bg-bg-primary border border-gray-200 dark:border-border-primary rounded-lg p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary">What MPP Does</h3>
                </div>
                <div className="space-y-4">
                  {comparisons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 dark:text-text-secondary">{item.solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badge Line */}
          <div className="mt-8 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 bg-white dark:bg-bg-primary border border-gray-200 dark:border-border-primary rounded-full">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#F59E0B]" />
                <span className="text-sm text-gray-600 dark:text-text-secondary">Built for Agencies</span>
              </div>
              <div className="h-4 w-px bg-gray-200 dark:bg-border-primary" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#F59E0B]" />
                <span className="text-sm text-gray-600 dark:text-text-secondary">Startups</span>
              </div>
              <div className="h-4 w-px bg-gray-200 dark:bg-border-primary" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#F59E0B]" />
                <span className="text-sm text-gray-600 dark:text-text-secondary">Marketing Teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

