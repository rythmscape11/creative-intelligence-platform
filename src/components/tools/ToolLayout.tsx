'use client';

import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  children: ReactNode;
}

const categoryColors = {
  content: 'text-[#F59E0B]',
  seo: 'text-green-400',
  social: 'text-purple-400',
  email: 'text-orange-400',
  advertising: 'text-red-400'
};

export function ToolLayout({ title, description, category, children }: ToolLayoutProps) {
  const categoryColor = categoryColors[category as keyof typeof categoryColors] || categoryColors.content;

  return (
    <div className="min-h-screen bg-white dark:bg-bg-primary">
      <div className="min-h-screen bg-white dark:bg-bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Back Button */}
          <Link href="/tools">
            <Button variant="ghost" size="sm" className="mb-4 sm:mb-6 gap-2 text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-hover">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Tools</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <span className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${categoryColor}`}>
                {category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-text-primary mb-2 sm:mb-3">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-text-secondary">
              {description}
            </p>
          </div>

          {/* Content */}
          <div className="bg-gray-50 dark:bg-bg-secondary rounded-lg shadow-sm border border-gray-200 dark:border-border-primary p-4 sm:p-6 lg:p-8">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 dark:text-text-tertiary px-4">
            <p>
              Part of MediaPlanPro's free marketing tools suite • Worth $495/month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

