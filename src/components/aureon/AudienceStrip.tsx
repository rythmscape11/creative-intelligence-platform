'use client';

import { Building2, Users, Sparkles } from 'lucide-react';

/**
 * Audience Strip Section
 * 
 * Three columns showing who Aureon One is built for.
 * Color Palette: Soft Midnight (Soothing)
 */

const audiences = [
    {
        title: 'Agencies',
        description: 'Run client strategy, optimisation, and reporting from one OS.',
        icon: Building2,
        color: 'text-[#3B82F6]',
        bg: 'bg-[#3B82F6]/10',
    },
    {
        title: 'In-house teams',
        description: 'Unify data, GEO, and execution across channels.',
        icon: Users,
        color: 'text-[#A78BFA]',
        bg: 'bg-[#A78BFA]/10',
    },
    {
        title: 'Consultants & growth leaders',
        description: 'Turn complex performance data into clean, confident decisions.',
        icon: Sparkles,
        color: 'text-[#10B981]',
        bg: 'bg-[#10B981]/10',
    },
];

export function AudienceStrip() {
    return (
        <section className="py-24 bg-gradient-to-b from-[#1E293B] to-[#0F172A]">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
                        Built for <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">modern marketing teams.</span>
                    </h2>
                </div>

                {/* Audience Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {audiences.map((audience) => (
                        <div
                            key={audience.title}
                            className="text-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${audience.bg} mb-6`}>
                                <audience.icon className={`w-8 h-8 ${audience.color}`} />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-[#F1F5F9] mb-3">
                                {audience.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[#94A3B8]">
                                {audience.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AudienceStrip;

