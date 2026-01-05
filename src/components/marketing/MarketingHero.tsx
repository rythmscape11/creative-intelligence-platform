'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MarketingHeroProps {
    eyebrow?: string;
    title: string;
    subtitle: string;
    primaryCta: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
    centered?: boolean;
}

export function MarketingHero({
    eyebrow,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    centered = true,
}: MarketingHeroProps) {
    return (
        <section className="relative overflow-hidden bg-[#0F172A] py-24 lg:py-32">
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, #A78BFA 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <div className={`container mx-auto px-6 lg:px-12 relative z-10 ${centered ? 'text-center' : ''}`}>
                <div className={centered ? 'max-w-4xl mx-auto' : 'max-w-3xl'}>
                    {eyebrow && (
                        <p className="text-sm font-medium text-[#3B82F6] uppercase tracking-widest mb-4">
                            {eyebrow}
                        </p>
                    )}

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#F1F5F9] mb-6">
                        {title}
                    </h1>

                    <p className="text-lg md:text-xl text-[#94A3B8] leading-relaxed mb-10 max-w-2xl mx-auto">
                        {subtitle}
                    </p>

                    <div className={`flex flex-col sm:flex-row gap-4 ${centered ? 'justify-center' : ''}`}>
                        <Button
                            size="lg"
                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-8 py-6 text-lg rounded-lg shadow-lg shadow-[#3B82F6]/25"
                            asChild
                        >
                            <Link href={primaryCta.href}>{primaryCta.text}</Link>
                        </Button>

                        {secondaryCta && (
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-2 border-[#A78BFA]/50 text-[#A78BFA] hover:bg-[#A78BFA]/10 font-semibold px-8 py-6 text-lg rounded-lg"
                                asChild
                            >
                                <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MarketingHero;

