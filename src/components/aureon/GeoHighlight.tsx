'use client';

import { Check, Search, Brain, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * GEO Engine Highlight Section
 * 
 * Split layout showcasing the GEO Engine capabilities.
 */

const features = [
    'See how your pages appear in AI Overviews and answer engines.',
    'Get GEO scores and Q&A clusters for every key URL.',
    'Generate AI-first content briefs in one click.',
];

export function GeoHighlight() {
    return (
        <section className="py-24 bg-[#0F172A]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-full px-4 py-1.5">
                            <Brain className="w-4 h-4 text-[#3B82F6]" />
                            <span className="text-sm font-medium text-[#3B82F6]">AI-Native SEO</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F1F5F9] leading-tight">
                            GEO Engine — <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">built for the age of AI search.</span>
                        </h2>

                        {/* Features list */}
                        <ul className="space-y-4">
                            {features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-[#3B82F6]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-[#3B82F6]" />
                                    </div>
                                    <span className="text-[#94A3B8] text-lg">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <Button
                            size="lg"
                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-8 shadow-lg shadow-[#3B82F6]/25"
                            asChild
                        >
                            <Link href="/product/geo-engine">
                                Try GEO Engine
                            </Link>
                        </Button>
                    </div>

                    {/* Right Column - Mock UI Card */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 lg:p-8">
                        {/* URL Input */}
                        <div className="flex items-center gap-3 bg-black/40 rounded-lg px-4 py-3 mb-6 border border-white/5">
                            <Search className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-400">https://example.com/your-page</span>
                        </div>

                        {/* GEO Score */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-400">GEO Score</span>
                                <span className="text-2xl font-bold text-[#F1C40F]">78</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] rounded-full"
                                    style={{ width: '78%' }}
                                />
                            </div>
                        </div>

                        {/* Two columns */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Questions you answer */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500" />
                                    <span className="text-sm font-medium text-gray-300">Questions you answer</span>
                                </div>
                                <ul className="space-y-2">
                                    {['What is GEO?', 'How does AI search work?', 'Best practices for...'].map((q, i) => (
                                        <li key={i} className="text-sm text-gray-400 bg-white/5 rounded px-3 py-2">
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Questions to answer */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-[#F1C40F]" />
                                    <span className="text-sm font-medium text-gray-300">Questions to target</span>
                                </div>
                                <ul className="space-y-2">
                                    {['How to optimize for...', 'Why is GEO important?', 'GEO vs traditional SEO'].map((q, i) => (
                                        <li key={i} className="text-sm text-gray-400 bg-white/5 rounded px-3 py-2 border-l-2 border-[#F1C40F]">
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Generate button */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3 text-[#F1C40F]">
                                <FileText className="w-5 h-5" />
                                <span className="text-sm font-medium">Generate AI-first content brief</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default GeoHighlight;
