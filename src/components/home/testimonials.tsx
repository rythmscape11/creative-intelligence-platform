'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    id: 1,
    content: "MediaPlanPro transformed how we approach marketing planning. What used to take weeks now takes minutes, and the quality is consistently excellent.",
    author: {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechStart Inc.",
    },
    rating: 5,
  },
  {
    id: 2,
    content: "The AI-generated plans are incredibly detailed and actionable. Our client presentations have never looked more professional.",
    author: {
      name: "Michael Rodriguez",
      role: "Agency Owner",
      company: "Digital Growth Agency",
    },
    rating: 5,
  },
  {
    id: 3,
    content: "As a freelance consultant, MediaPlanPro gives me the tools to compete with larger agencies. The export features are a game-changer.",
    author: {
      name: "Emily Johnson",
      role: "Marketing Consultant",
      company: "Independent",
    },
    rating: 5,
  },
];

export function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 bg-white dark:bg-bg-primary overflow-hidden"
    >
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white to-white dark:from-bg-secondary/50 dark:via-bg-primary dark:to-bg-primary pointer-events-none" />

      {/* Subtle mesh pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #F59E0B 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with fade-in animation */}
        <div className={`mx-auto max-w-2xl text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 dark:text-text-primary">
            Loved by marketing professionals
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-text-secondary">
            See what our users are saying about MediaPlanPro and how it's
            transforming their marketing planning process.
          </p>
        </div>

        {/* Testimonials grid with staggered animation */}
        <div className="mx-auto mt-16">
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card className="group p-8 flex flex-col h-full relative overflow-hidden border-gray-200 dark:border-border-primary hover:border-[#F59E0B]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#F59E0B]/5 hover:-translate-y-1">
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/0 via-[#F59E0B]/0 to-[#F59E0B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Rating with glow effect */}
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className="h-5 w-5 text-[#F59E0B] drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <blockquote className="text-gray-600 dark:text-text-secondary leading-relaxed mb-6 flex-grow">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author with enhanced avatar */}
                    <div className="flex items-center mt-auto">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-bg-elevated dark:to-bg-hover flex items-center justify-center flex-shrink-0 ring-2 ring-gray-200 dark:ring-border-primary group-hover:ring-[#F59E0B]/20 transition-all duration-300">
                        <span className="text-sm font-medium text-gray-600 dark:text-text-secondary">
                          {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900 dark:text-text-primary">
                          {testimonial.author.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-text-secondary">
                          {testimonial.author.role}
                          {testimonial.author.company !== 'Independent' && (
                            <span> at {testimonial.author.company}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators with premium styling */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-600 dark:text-text-secondary">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-bg-tertiary/50 border border-gray-200 dark:border-border-primary hover:border-[#F59E0B]/30 transition-all duration-300">
              <StarIcon className="h-4 w-4 text-[#F59E0B]" />
              <span className="font-medium text-gray-900 dark:text-text-primary">4.9/5</span>
              <span>average rating</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-bg-tertiary/50 border border-gray-200 dark:border-border-primary hover:border-[#F59E0B]/30 transition-all duration-300">
              <span className="font-medium text-gray-900 dark:text-text-primary">500+</span>
              <span>happy customers</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-bg-tertiary/50 border border-gray-200 dark:border-border-primary hover:border-[#F59E0B]/30 transition-all duration-300">
              <span className="font-medium text-gray-900 dark:text-text-primary">99.9%</span>
              <span>uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
