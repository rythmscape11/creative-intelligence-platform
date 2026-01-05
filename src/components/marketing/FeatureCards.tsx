'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface FeatureCard {
    icon?: ReactNode;
    title: string;
    description: string;
    href?: string;
    linkText?: string;
}

interface FeatureCardsProps {
    title?: string;
    subtitle?: string;
    cards: FeatureCard[];
    columns?: 2 | 3 | 4 | 5;
}

export function FeatureCards({ title, subtitle, cards, columns = 3 }: FeatureCardsProps) {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-2 lg:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
        5: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    };

    return (
        <section className="py-20 lg:py-28 bg-[#0F172A]">
            <div className="container mx-auto px-6 lg:px-12">
                {(title || subtitle) && (
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        {title && (
                            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">{title}</h2>
                        )}
                        {subtitle && <p className="text-lg text-[#94A3B8]">{subtitle}</p>}
                    </div>
                )}

                <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#3B82F6]/30 hover:bg-white/[0.07] transition-all duration-300"
                        >
                            {card.icon && (
                                <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mb-4 text-[#3B82F6]">
                                    {card.icon}
                                </div>
                            )}

                            <h3 className="text-xl font-semibold text-[#F1F5F9] mb-3">{card.title}</h3>
                            <p className="text-[#94A3B8] leading-relaxed mb-4">{card.description}</p>

                            {card.href && (
                                <Link
                                    href={card.href}
                                    className="inline-flex items-center text-[#3B82F6] hover:text-[#2563EB] font-medium transition-colors"
                                >
                                    {card.linkText || 'Learn more'} →
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeatureCards;

