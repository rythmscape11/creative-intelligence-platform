'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeroOrbit } from './HeroOrbit';

/**
 * Aureon One Hero Section
 * 
 * Two-column layout with:
 * - Left: Heading, subtext, CTAs
 * - Right: Orbit logo visual with labels
 * 
 * Color Palette: Soft Midnight (Soothing)
 */
export function Hero() {
    return (
        <section className="relative overflow-hidden bg-[#0F172A] min-h-[90vh] flex items-center">
            {/* Background grid effect - softer violet dots */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, #A78BFA 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }} />
            </div>

            {/* Radial glow behind orbit - violet/blue blend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20">
                <div className="absolute inset-0 rounded-full bg-gradient-radial from-[#3B82F6]/30 via-[#A78BFA]/10 to-transparent blur-3xl" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-32 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        {/* Main Heading */}
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight md:leading-[1.1]">
                                <span className="text-[#F1F5F9]">Aureon One</span>
                                <br />
                                <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                                    Illuminate Your Marketing.
                                </span>
                            </h1>
                        </div>

                        {/* Subtext */}
                        <p className="text-lg md:text-xl text-[#94A3B8] max-w-xl leading-relaxed">
                            The AI-powered operating system for agencies and brands — unifying strategy, GEO, analytics, optimisation, and execution in one intelligent cloud.
                        </p>

                        {/* CTAs - Soothing blue primary, violet outline secondary */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-[#3B82F6]/25 hover:shadow-xl hover:shadow-[#3B82F6]/30 transition-all"
                                asChild
                            >
                                <Link href="/auth/signup">
                                    Start free workspace
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-[#A78BFA] text-[#A78BFA] hover:bg-[#A78BFA]/10 font-semibold px-8 py-6 text-lg rounded-lg"
                                asChild
                            >
                                <Link href="/contact">
                                    Book a strategy demo
                                </Link>
                            </Button>
                        </div>

                        {/* Trust Line */}
                        <p className="text-sm text-[#64748B] pt-4">
                            Built for performance teams, agencies, and growth leaders.
                        </p>
                    </div>

                    {/* Right Column - Orbit Visual */}
                    <div className="relative flex items-center justify-center lg:justify-end">
                        <HeroOrbit />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;

