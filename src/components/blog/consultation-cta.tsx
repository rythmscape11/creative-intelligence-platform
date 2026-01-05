'use client';

import Link from 'next/link';
import { CalendarIcon, SparklesIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

interface ConsultationCTAProps {
  variant?: 'default' | 'compact' | 'sidebar';
  title?: string;
  description?: string;
}

export function ConsultationCTA({
  variant = 'default',
  title = 'Ready to Transform Your Marketing?',
  description = 'Book a free consultation with our marketing experts and discover how AI-powered strategies can 10x your results.',
}: ConsultationCTAProps) {
  
  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl p-6 text-[#0A0A0A] shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="h-8 w-8" />
          <h3 className="text-xl font-bold">Free Consultation</h3>
        </div>
        <p className="text-sm mb-4 opacity-90">
          Get expert advice on your marketing strategy. No commitment required.
        </p>
        <Link
          href="/contact"
          className="block w-full text-center px-4 py-3 bg-[#0A0A0A] text-white rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
        >
          Book Free Call
        </Link>
        <p className="text-xs mt-3 opacity-75 text-center">
          ⚡ 30-minute strategy session
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] rounded-xl p-6 border-2 border-[#F59E0B] shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Need Help With Your Marketing?
            </h3>
            <p className="text-sm text-gray-300">
              Book a free 30-min consultation with our experts
            </p>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 px-6 py-3 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-all duration-300 font-semibold whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105"
            style={{ color: '#000000' }}
          >
            Book Now
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-8 md:p-12 border border-[#F59E0B] shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97706] opacity-5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F59E0B] rounded-full">
              <CalendarIcon className="h-8 w-8 text-[#0A0A0A]" />
            </div>
            <div className="p-3 bg-[#F59E0B] rounded-full">
              <SparklesIcon className="h-8 w-8 text-[#0A0A0A]" />
            </div>
            <div className="p-3 bg-[#F59E0B] rounded-full">
              <RocketLaunchIcon className="h-8 w-8 text-[#0A0A0A]" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#F59E0B] rounded-lg hover:bg-[#D97706] transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105"
            style={{ color: '#000000' }}
          >
            <CalendarIcon className="h-6 w-6 mr-2" style={{ color: '#000000' }} />
            Book Free Consultation
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#F59E0B] text-[#F59E0B] rounded-lg hover:bg-[#F59E0B] transition-all duration-300 font-bold text-lg"
            style={{ ['--hover-color' as string]: '#000000' } as React.CSSProperties}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#F59E0B')}
          >
            View Our Services
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
              ✓
            </div>
            <div>
              <p className="font-semibold text-white">Free 30-Min Session</p>
              <p className="text-sm text-gray-400">No credit card required</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
              ✓
            </div>
            <div>
              <p className="font-semibold text-white">Expert Guidance</p>
              <p className="text-sm text-gray-400">10+ years experience</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
              ✓
            </div>
            <div>
              <p className="font-semibold text-white">Actionable Insights</p>
              <p className="text-sm text-gray-400">Walk away with a plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

