'use client';

import {
  PencilSquareIcon,
  SparklesIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    id: 1,
    name: 'Analyze',
    description: 'Input your business details. Our AI dissects your market, competitors, and audience instantly.',
    icon: PencilSquareIcon,
  },
  {
    id: 2,
    name: 'Strategize',
    description: 'Receive a Director-level marketing strategy, complete with channels, budget allocation, and KPIs.',
    icon: SparklesIcon,
  },
  {
    id: 3,
    name: 'Execute',
    description: 'Export to PowerPoint. Brief your team. Launch campaigns that actually convert.',
    icon: DocumentArrowDownIcon,
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 bg-transparent">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-gray-900 dark:text-text-primary">
            Analyze. <span className="text-gray-600 dark:text-text-secondary">Strategize.</span> Execute.
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-text-secondary">
            From raw idea to execution-ready plan in under 60 seconds.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-px transform -translate-y-1/2 hidden lg:block bg-gray-200 dark:bg-border-primary"></div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {steps.map((step, stepIdx) => (
                <div key={step.id} className="relative">
                  {/* Step icon */}
                  <div className="flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 relative z-10">
                      <step.icon className="h-8 w-8 text-gray-900 dark:text-text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-6 text-center">
                    <div className="text-sm font-normal mb-2 text-gray-500 dark:text-text-tertiary">
                      Step {step.id}
                    </div>
                    <h3 className="text-xl font-medium mb-4 text-gray-900 dark:text-text-primary">
                      {step.name}
                    </h3>
                    <p className="leading-relaxed text-gray-600 dark:text-text-secondary">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for mobile */}
                  {stepIdx < steps.length - 1 && (
                    <div className="flex justify-center mt-8 lg:hidden">
                      <div className="h-8 w-px bg-gray-200 dark:bg-border-primary"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center rounded-md px-6 py-3 text-sm font-normal bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            <SparklesIcon className="h-4 w-4 mr-2" />
            Ready to get started? It takes less than 5 minutes.
          </div>
        </div>
      </div>
    </section>
  );
}
