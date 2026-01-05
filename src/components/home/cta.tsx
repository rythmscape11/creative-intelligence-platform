'use client';

import Link from 'next/link';
import { ArrowRightIcon, SparklesIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="relative py-16 bg-white dark:bg-black overflow-hidden border-t border-gray-100 dark:border-white/10">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white">
              <BuildingOffice2Icon className="h-6 w-6" />
            </div>
          </div>

          {/* Headline - Greyscale */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Ready to{' '}
            <span className="text-gray-600 dark:text-gray-300">
              scale your agency
            </span>
            ?
          </h2>

          {/* Subheadline */}
          <p className="text-lg leading-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            Join 500+ marketing agencies using MediaPlanPro's white-label tools,
            AI-powered insights, and client workspaces to deliver results faster.
          </p>

          {/* CTA Buttons - Greyscale */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/demo?plan=agency">
              <Button size="lg" className="text-lg px-8 py-6 h-auto bg-white text-black hover:bg-gray-100">
                Book a Demo
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto w-full sm:w-auto border-gray-300 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - Greyscale dots */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span>White-Label Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span>10 Client Workspaces</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
              <span>Custom Branding</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
