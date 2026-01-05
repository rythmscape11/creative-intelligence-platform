'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface SplitSectionProps {
    title: string;
    subtitle?: string;
    bullets?: string[];
    children?: ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    visual?: ReactNode;
    reversed?: boolean;
}

export function SplitSection({
    title,
    subtitle,
    bullets,
    children,
    imageSrc,
    imageAlt,
    visual,
    reversed = false,
}: SplitSectionProps) {
    return (
        <section className="py-20 lg:py-28 bg-[#0F172A]">
            <div className="container mx-auto px-6 lg:px-12">
                <div
                    className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}
                >
                    {/* Text Content */}
                    <div className={reversed ? 'lg:order-2' : ''}>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-6">{title}</h2>

                        {subtitle && <p className="text-lg text-[#94A3B8] mb-6 leading-relaxed">{subtitle}</p>}

                        {bullets && bullets.length > 0 && (
                            <ul className="space-y-4">
                                {bullets.map((bullet, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-[#3B82F6] mt-2 flex-shrink-0" />
                                        <span className="text-[#94A3B8]">{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {children}
                    </div>

                    {/* Visual Content */}
                    <div className={reversed ? 'lg:order-1' : ''}>
                        {visual ? (
                            visual
                        ) : imageSrc ? (
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                                <Image src={imageSrc} alt={imageAlt || ''} fill className="object-cover" />
                            </div>
                        ) : (
                            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center">
                                <div className="text-gray-500 text-sm">Visual placeholder</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SplitSection;
