import { Metadata } from 'next';
import { Gauge, HelpCircle, Building2, FileText } from 'lucide-react';
import { MarketingHero, FeatureCards, SplitSection, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
    title: 'GEO Engine — Generative Engine Optimisation | Aureon One',
    description:
        'Optimise your content for AI Overviews, answer engines, and the next wave of search — without guessing.',
};

const capabilities = [
    {
        icon: <Gauge className="w-6 h-6" />,
        title: 'GEO Score per Page',
        description: 'Get a 0–100 score that reflects how ready a page is for AI-driven discovery.',
    },
    {
        icon: <HelpCircle className="w-6 h-6" />,
        title: 'Q&A Clusters',
        description: 'See which questions your page already answers — and which questions you should add.',
    },
    {
        icon: <Building2 className="w-6 h-6" />,
        title: 'Entities & Schema Suggestions',
        description: 'Identify key entities and get suggestions for structured data and schema types.',
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: 'AI-First Content Briefs',
        description:
            'Generate outlines, FAQs, and answer blocks designed for AI Overviews and chat interfaces.',
    },
];

const whyGeoMatters = [
    'AI Overviews and answer engines are changing how users discover content.',
    'Generic on-page SEO is no longer enough to stand out in AI-summarised results.',
    'GEO helps you stay visible when search becomes conversational.',
];

export default function GeoEnginePage() {
    return (
        <main className="bg-[#0F172A] min-h-screen">
            {/* Hero */}
            <MarketingHero
                eyebrow="Product · GEO Engine"
                title="GEO Engine — Generative Engine Optimisation."
                subtitle="Optimise your content for AI Overviews, answer engines, and the next wave of search — without guessing."
                primaryCta={{ text: 'Run a GEO analysis', href: '/analyser/geo' }}
                secondaryCta={{ text: 'View sample GEO report', href: '/contact' }}
            />

            {/* What is GEO */}
            <section className="py-20 lg:py-28 bg-[#0F172A] border-b border-white/5">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-6">
                            What is Generative Engine Optimisation?
                        </h2>
                        <p className="text-lg text-[#94A3B8] leading-relaxed">
                            GEO is the practice of making your content easy for AI systems to understand,
                            summarise, and recommend. Instead of chasing only blue links, GEO prepares your
                            pages for AI Overviews, chat-based search, and answer-driven experiences.
                        </p>
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <FeatureCards title="GEO Capabilities" cards={capabilities} columns={4} />

            {/* Sample Report */}
            <SplitSection
                title="From page to GEO report in minutes."
                subtitle="Enter a URL, and GEO Engine analyses the content, SERP context, entities, and queries to produce a detailed report. No manual scraping. No guesswork."
                visual={
                    <div className="bg-gradient-to-br from-[#0B0C10] to-[#1a1a2e] rounded-xl p-6 border border-white/10">
                        {/* Mock UI */}
                        <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                            <input
                                type="text"
                                placeholder="https://example.com/page"
                                className="w-full bg-transparent text-gray-400 outline-none"
                                readOnly
                            />
                        </div>

                        {/* GEO Score */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[#3B82F6] relative">
                                <span className="text-4xl font-bold text-[#F1F5F9]">86</span>
                                <span className="absolute bottom-4 text-sm text-[#94A3B8]">/100</span>
                            </div>
                            <p className="text-sm text-[#3B82F6] mt-3 font-medium">GEO Score</p>
                        </div>

                        {/* Q&A Columns */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-[#3B82F6] font-medium mb-2">Questions you answer</p>
                                <ul className="space-y-1 text-[#94A3B8]">
                                    <li>• What is GEO?</li>
                                    <li>• How does it work?</li>
                                </ul>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-[#F1F5F9] font-medium mb-2">Questions to add</p>
                                <ul className="space-y-1 text-[#94A3B8]">
                                    <li>• Why is GEO important?</li>
                                    <li>• How to get started?</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                }
            />

            {/* Why GEO Matters */}
            <section className="py-20 lg:py-28 bg-[#0F172A]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-8 text-center">
                            Why GEO matters right now.
                        </h2>
                        <ul className="space-y-6">
                            {whyGeoMatters.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-4 bg-gradient-to-r from-[#3B82F6]/10 to-transparent rounded-lg p-4 border-l-4 border-[#3B82F6]"
                                >
                                    <span className="text-[#94A3B8]">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Band */}
            <CtaBand
                title="Prepare your content for the future of search."
                subtitle="Start running GEO analyses on your most important pages with Aureon One."
                primaryCta={{ text: 'Run a GEO analysis', href: '/analyser/geo' }}
                secondaryCta={{ text: 'Book a GEO strategy session', href: '/contact' }}
            />
        </main>
    );
}
