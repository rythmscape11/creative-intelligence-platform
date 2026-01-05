'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface CtaBandProps {
    title: string;
    subtitle?: string;
    primaryCta: {
        text: string;
        href: string;
    };
    secondaryCta?: {
        text: string;
        href: string;
    };
    showOrbit?: boolean;
}

export function CtaBand({ title, subtitle, primaryCta, secondaryCta, showOrbit = true }: CtaBandProps) {
    return (
        <section className="relative py-20 lg:py-28 bg-gradient-to-b from-[#0F172A] to-[#1E293B] overflow-hidden">
            {/* Orbit watermark */}
            {showOrbit && (
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Image
                        src="/brand/aureon-one-icon-gold.svg"
                        alt=""
                        width={600}
                        height={600}
                        className="object-contain"
                    />
                </div>
            )}

            <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F1F5F9] mb-4">{title}</h2>

                    {subtitle && <p className="text-lg text-[#94A3B8] mb-10">{subtitle}</p>}

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

export default CtaBand;

