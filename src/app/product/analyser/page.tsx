import { Metadata } from 'next';
import { Search, BarChart3, Globe, FileQuestion } from 'lucide-react';
import { MarketingHero, FeatureCards, SplitSection, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
    title: 'The Analyser — Search, GEO & Competitor Intelligence | Aureon One',
    description:
        'Combine SEO, SEM, GEO, and competitive data to understand where you can truly win attention.',
};

const dataSources = [
    'Search performance from Google Search Console (GSC).',
    'User behaviour signals from Google Analytics 4 (GA4).',
    'Keyword & SERP data from trusted SEO APIs.',
    'Page-level insights from our own crawler.',
];

const capabilities = [
    {
        icon: <Search className="w-6 h-6" />,
        title: 'Keyword & Topic Analysis',
        description:
            'See volumes, difficulty, intent, and opportunity scores for the topics that matter.',
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Domain & Competitor Overview',
        description: 'Compare your visibility against key competitors and see where they outrank you.',
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: 'SERP & GEO Insights',
        description: 'Understand which pages surface in AI Overviews and answer-style results.',
    },
    {
        icon: <FileQuestion className="w-6 h-6" />,
        title: 'Content Gaps & Opportunities',
        description: "Find the questions you're not answering yet — but should be.",
    },
];

export default function AnalyserPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen">
            {/* Hero */}
            <MarketingHero
                eyebrow="Product · The Analyser"
                title="The Analyser — Search, GEO & Competitor Intelligence."
                subtitle="Combine SEO, SEM, GEO, and competitive data to understand where you can truly win attention."
                primaryCta={{ text: 'Explore Analyser', href: '/analyser' }}
                secondaryCta={{ text: 'Run a sample analysis', href: '/contact' }}
            />

            {/* Data Sources */}
            <section className="py-20 lg:py-28 bg-[#0F172A]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
                            Multiple data sources. One source of truth.
                        </h2>
                        <p className="text-lg text-[#94A3B8]">
                            The Analyser blends first-party and third-party data so you see the full picture.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <ul className="space-y-4">
                            {dataSources.map((source, index) => (
                                <li key={index} className="flex items-start gap-4 bg-white/5 rounded-lg p-4 border border-white/10">
                                    <span className="w-2 h-2 rounded-full bg-[#3B82F6] mt-2 flex-shrink-0" />
                                    <span className="text-[#94A3B8]">{source}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <FeatureCards
                title="Capabilities"
                cards={capabilities}
                columns={4}
            />

            {/* GEO Bridge */}
            <SplitSection
                title="The engine behind GEO."
                subtitle="The Analyser feeds GEO Engine with the search, SERP, and content context it needs to score pages, generate Q&A clusters, and suggest AI-first improvements."
                visual={
                    <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#A78BFA]/10 rounded-xl p-8 border border-white/10">
                        <div className="flex items-center justify-center gap-4">
                            <div className="bg-white/10 rounded-lg px-4 py-2 text-[#F1F5F9] font-medium">Analyser</div>
                            <div className="text-[#3B82F6] text-2xl">→</div>
                            <div className="bg-[#3B82F6]/20 rounded-lg px-4 py-2 text-[#3B82F6] font-medium">
                                GEO Engine
                            </div>
                            <div className="text-[#3B82F6] text-2xl">→</div>
                            <div className="bg-white/10 rounded-lg px-4 py-2 text-[#F1F5F9] font-medium">
                                Content/Strategy
                            </div>
                        </div>
                    </div>
                }
            />

            {/* CTA Band */}
            <CtaBand
                title="See what The Analyser reveals about your site."
                primaryCta={{ text: 'Start free workspace', href: '/auth/signup' }}
                secondaryCta={{ text: 'Book an insights session', href: '/contact' }}
            />
        </main>
    );
}
