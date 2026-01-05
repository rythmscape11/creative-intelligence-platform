'use client';

import { Plug, Lightbulb, Rocket } from 'lucide-react';

/**
 * How It Works Section
 * 
 * Three-step flow: Connect → Illuminate → Act
 * Color Palette: Soft Midnight (Soothing)
 */

const steps = [
    {
        step: 1,
        title: 'Connect',
        description: 'Integrate ad platforms, analytics, search data, and CRM.',
        icon: Plug,
        color: 'bg-[#3B82F6]',
    },
    {
        step: 2,
        title: 'Illuminate',
        description: "Aureon One's AI + GEO engine surfaces what truly drives performance.",
        icon: Lightbulb,
        color: 'bg-[#A78BFA]',
    },
    {
        step: 3,
        title: 'Act',
        description: 'Push optimisation, strategy, and tasks directly into your workflows.',
        icon: Rocket,
        color: 'bg-[#10B981]',
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
                        How <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Aureon One</span> works
                    </h2>
                    <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
                        From data chaos to execution clarity in three steps.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={step.step} className="relative">
                            {/* Connector line (not on last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent" />
                            )}

                            <div className="relative text-center">
                                {/* Step number badge */}
                                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${step.color} mb-6 shadow-lg`}>
                                    <step.icon className="w-10 h-10 text-white" />
                                </div>

                                {/* Step number */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0F172A] border border-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                                    <span className="text-sm font-bold text-[#F1F5F9]">{step.step}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-[#F1F5F9] mb-3">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-[#94A3B8] max-w-xs mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;

