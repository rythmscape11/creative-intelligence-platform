'use client';

import { useState } from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Sample Plan Preview Component
 * 
 * Shows a modal with a sample marketing plan
 * to reduce friction and build trust
 */

export function SamplePlanPreview() {
  const [isOpen, setIsOpen] = useState(false);

  const samplePlan = {
    businessName: 'TechStart SaaS',
    industry: 'B2B Software',
    targetAudience: 'Small to medium-sized businesses looking for project management solutions',
    sections: [
      {
        title: 'Executive Summary',
        content: 'A comprehensive marketing strategy designed to increase brand awareness, generate qualified leads, and drive customer acquisition for TechStart SaaS in the competitive project management software market.',
      },
      {
        title: 'Target Audience Analysis',
        content: 'Primary: Small business owners (10-50 employees) in tech, consulting, and creative industries. Secondary: Project managers and team leads seeking better collaboration tools.',
      },
      {
        title: 'Marketing Channels',
        content: 'Content Marketing (40%), Paid Search (25%), Social Media (20%), Email Marketing (15%). Focus on LinkedIn and industry-specific communities.',
      },
      {
        title: 'Budget Allocation',
        content: 'Monthly budget: $5,000. Content creation: $2,000, Paid ads: $1,500, Tools & software: $1,000, Miscellaneous: $500.',
      },
      {
        title: 'Key Metrics & KPIs',
        content: 'Website traffic: 10,000 monthly visitors, Lead generation: 200 qualified leads/month, Conversion rate: 5%, Customer acquisition cost: $250.',
      },
    ],
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 dark:text-[#F59E0B] dark:hover:text-[#FF8C00] transition-colors duration-200 group"
      >
        <DocumentTextIcon className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span className="underline underline-offset-4">See Sample Plan</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-bg-secondary rounded-lg shadow-2xl overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-bg-elevated border-b border-border-primary px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-medium text-text-primary">Sample Marketing Plan</h2>
                <p className="text-sm text-text-tertiary mt-1">
                  {samplePlan.businessName} - {samplePlan.industry}
                </p>
              </div>
              <Link href="/auth/signup">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 h-auto text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Create Your Plan Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Target Audience */}
              <div className="mb-6 p-4 bg-bg-primary rounded-lg border border-border-primary">
                <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-2">
                  Target Audience
                </h3>
                <p className="text-text-secondary">{samplePlan.targetAudience}</p>
              </div>

              {/* Plan Sections */}
              <div className="space-y-6">
                {samplePlan.sections.map((section, index) => (
                  <div key={index} className="pb-6 border-b border-border-primary last:border-0">
                    <h3 className="text-xl font-medium text-text-primary mb-3">
                      {section.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-8 p-6 bg-gradient-to-r from-bg-tertiary to-bg-elevated rounded-lg border border-[#F59E0B]/20">
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Ready to create your own plan?
                </h3>
                <p className="text-text-secondary mb-4">
                  Get a personalized marketing plan tailored to your business in just 60 seconds.
                </p>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/strategy';
                  }}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Create My Free Plan
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-bg-elevated border-t border-border-primary px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-text-tertiary">
                This is a sample plan. Your plan will be customized to your business.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

