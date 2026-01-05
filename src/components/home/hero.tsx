'use client';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { HeroCTA } from './hero-cta';

/**
 * Pulsating Stat Component - Greyscale
 */
function PulsatingStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center group cursor-default">
      <span className="text-xl sm:text-2xl font-semibold text-white group-hover:text-gray-300 transition-colors duration-300">
        {value}
      </span>
      <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 uppercase tracking-wide">{label}</span>
    </div>
  );
}

/**
 * Hero Component - Clean, Static, Premium Black Background
 */
export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black" />

      {/* Content Layer */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 sm:py-20 text-center">

        {/* Main Heading - Greyscale */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in-up">
            <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium tracking-wider text-gray-300 uppercase backdrop-blur-sm shadow-sm ring-1 ring-white/10">
              AI-Powered Strategy
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter max-w-5xl mx-auto mb-6 leading-tight">
            <span className="text-white block sm:inline">The Marketing</span>{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 block sm:inline">
              Command Center
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto">
            for Modern Agencies
          </p>
        </div>

        {/* Secondary Headline - Greyscale */}
        <div className="mb-8">
          <h2 className="text-sm sm:text-base leading-relaxed text-gray-500 max-w-2xl mx-auto font-normal">
            White-label strategies, client workspaces, and
            <span className="text-gray-300"> AI-powered insights</span> — deliver
            <span className="text-gray-300"> agency-grade results</span> in minutes
          </h2>
        </div>

        {/* CTA Buttons - Greyscale */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <HeroCTA />
          <Link href="/services">
            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto rounded-full text-sm px-8 py-6 h-auto text-gray-400 hover:text-white hover:bg-white/10 border border-gray-700 hover:border-gray-500 transition-all duration-300"
            >
              Explore Services
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Stats Row - Greyscale */}
        <div>
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            <PulsatingStat value="500+" label="Agencies" />
            <div className="w-px h-8 bg-gray-700/50" />
            <PulsatingStat value="10K+" label="Reports" />
            <div className="w-px h-8 bg-gray-700/50 hidden sm:block" />
            <PulsatingStat value="98%" label="Time Saved" />
          </div>
        </div>

        {/* Scroll indicator - Greyscale, no animation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <span className="text-xs">Scroll to explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
