'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

/**
 * Compact Testimonials Component
 * 
 * Displays testimonials in a carousel slider
 * with auto-scroll and manual navigation
 */

const testimonials = [
  {
    quote: "MediaPlanPro has transformed how we approach marketing. The tools are incredibly powerful and easy to use.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote: "The Pro plan pays for itself. The AI recommendations alone have improved our conversion rates by 45%.",
    author: "Michael Chen",
    role: "Founder",
    company: "GrowthLabs",
    rating: 5,
  },
  {
    quote: "I use MediaPlanPro every single day. The headline analyzer and readability scores are game-changers.",
    author: "Emily Rodriguez",
    role: "Content Manager",
    company: "ContentFirst",
    rating: 5,
  },
];

export function CompactTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of manual interaction
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % testimonials.length;
    goToSlide(newIndex);
  };

  return (
    <section className="py-12 bg-white dark:bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-gray-500 dark:text-text-tertiary uppercase tracking-wider">
            Loved by Marketing Teams
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div className="bg-gray-50 dark:bg-bg-secondary border border-gray-200 dark:border-border-primary rounded-lg p-8 hover:border-blue-500/30 dark:hover:border-[#F59E0B]/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-[#F59E0B]/5">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4 justify-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 text-amber-500 dark:text-[#F59E0B] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-gray-600 dark:text-text-secondary leading-relaxed mb-6 italic text-center text-lg">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-bg-elevated dark:to-bg-hover flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-border-primary">
                        <span className="text-sm font-medium text-gray-700 dark:text-text-secondary">
                          {testimonial.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4 text-center">
                        <div className="font-semibold text-gray-900 dark:text-text-primary">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-text-tertiary">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 bg-white dark:bg-bg-elevated border border-gray-200 dark:border-border-primary rounded-full p-2 hover:bg-gray-50 dark:hover:bg-bg-hover transition-colors shadow-lg"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-text-secondary" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 bg-white dark:bg-bg-elevated border border-gray-200 dark:border-border-primary rounded-full p-2 hover:bg-gray-50 dark:hover:bg-bg-hover transition-colors shadow-lg"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-text-secondary" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'w-8 bg-blue-500 dark:bg-[#F59E0B]'
                    : 'w-2 bg-gray-300 dark:bg-border-primary hover:bg-gray-400 dark:hover:bg-border-hover'
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

