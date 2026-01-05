'use client';

import { Users, TrendingUp, Star, Award } from 'lucide-react';
import { SOCIAL_PROOF } from '@/config/pricing';

interface SocialProofProps {
  variant?: 'stats' | 'testimonials' | 'both';
  className?: string;
}

export function SocialProof({ variant = 'both', className = '' }: SocialProofProps) {
  if (variant === 'stats' || variant === 'both') {
    return (
      <div className={className}>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-gray-900 dark:text-text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-1">
              {SOCIAL_PROOF.totalUsers}
            </div>
            <div className="text-sm text-gray-600 dark:text-text-secondary">
              Active Users
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-gray-900 dark:text-text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-1">
              {SOCIAL_PROOF.strategiesGenerated}
            </div>
            <div className="text-sm text-gray-600 dark:text-text-secondary">
              Strategies Generated
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-gray-900 dark:text-text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-1">
              {SOCIAL_PROOF.averageRating}
            </div>
            <div className="text-sm text-gray-600 dark:text-text-secondary">
              Average Rating
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-bg-tertiary rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-gray-900 dark:text-text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-text-primary mb-1">
              30+
            </div>
            <div className="text-sm text-gray-600 dark:text-text-secondary">
              Free Tools
            </div>
          </div>
        </div>

        {/* Testimonials Removed */}
      </div>
    );
  }

  // Testimonials only
  return (
    <div className={className}>
      <div className="grid md:grid-cols-3 gap-6">
        {SOCIAL_PROOF.testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-bg-secondary border border-gray-200 dark:border-border-primary rounded-lg p-6"
          >
            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-600 dark:text-text-secondary mb-4 italic">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-text-primary text-sm">
                  {testimonial.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-text-tertiary">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact version for inline use
// Compact version for inline use
export function SocialProofBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 text-sm text-gray-600 dark:text-text-secondary ${className}`}>
      <div className="flex items-center gap-1">
        <Users className="w-4 h-4 text-gray-900 dark:text-text-primary" />
        <span className="font-semibold text-gray-900 dark:text-text-primary">{SOCIAL_PROOF.totalUsers}</span>
        <span>marketers</span>
      </div>
      <span className="text-gray-500 dark:text-text-tertiary">•</span>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-gray-900 dark:text-text-primary" />
        <span className="font-semibold text-gray-900 dark:text-text-primary">{SOCIAL_PROOF.averageRating}</span>
        <span>rating</span>
      </div>
    </div>
  );
}

