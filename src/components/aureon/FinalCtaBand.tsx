'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Final CTA Band Section
 * 
 * Dark strip with orbit watermark and conversion CTAs.
 * Color Palette: Soft Midnight (Soothing)
 */
export function FinalCtaBand() {
    return (
        <section className="relative py-24 bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0F172A] overflow-hidden">
            {/* Orbit watermark - violet tint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
                <Image
                    src="/brand/aureon-one-icon-gold.svg"
                    alt="Aureon One"
                    width={500}
                    height={500}
                    className="object-contain"
                />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Heading */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F1F5F9] mb-6">
                        Ready to <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">illuminate your marketing?</span>
                    </h2>

                    {/* Subtext */}
                    <p className="text-[#94A3B8] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        Start with Aureon One and see your strategy, GEO, and performance from one command center.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-10 py-6 text-lg rounded-lg shadow-lg shadow-[#3B82F6]/25"
                            asChild
                        >
                            <Link href="/auth/signup">
                                Start free workspace
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-[#A78BFA]/50 text-[#A78BFA] hover:bg-[#A78BFA]/10 font-semibold px-10 py-6 text-lg rounded-lg"
                            asChild
                        >
                            <Link href="/contact">
                                Book a demo
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FinalCtaBand;

