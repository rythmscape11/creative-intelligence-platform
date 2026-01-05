import { Metadata } from 'next';
import { Building2, Users, TrendingUp } from 'lucide-react';
import { MarketingHero, FeatureCards, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
    title: 'Solutions for Modern Marketing Teams | Aureon One',
    description:
        'Aureon One adapts to agencies, in-house teams, and consultants so each can operate with clarity.',
};

const customerTypes = [
    {
        icon: <Building2 className="w-6 h-6" />,
        title: 'Agencies',
        description: 'Centralise clients, projects, performance, and reporting.',
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'In-house teams',
        description: 'Unify channels, partners, and GEO insights across markets.',
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: 'Consultants & growth leaders',
        description: 'Run deep analysis and build strategic recommendations faster.',
    },
];

const useCases = [
    'New client discovery & onboarding',
    'Quarterly business reviews (QBRs)',
    'Always-on performance optimisation',
    'GEO-led content and SEO programs',
];

export default function SolutionsPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen">
            {/* Hero */}
            <MarketingHero
                title="Solutions for modern marketing teams."
                subtitle="Aureon One adapts to agencies, in-house teams, and consultants so each can operate with clarity."
                primaryCta={{ text: 'Explore products', href: '/product' }}
                secondaryCta={{ text: 'Talk to us', href: '/contact' }}
            />

            {/* By Customer Type */}
            <FeatureCards title="Built for your team." cards={customerTypes} columns={3} />

            {/* Use Cases */}
            <section className="py-20 lg:py-28 bg-[#0F172A]">
                <div className="container mx-auto px-6 lg:px-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] text-center mb-12">
                        Key use cases.
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {useCases.map((useCase, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#3B82F6]/30 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] font-bold">
                                    {index + 1}
                                </div>
                                <span className="text-[#F1F5F9]">{useCase}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Band */}
            <CtaBand
                title="See how Aureon One fits your workflow."
                primaryCta={{ text: 'Book a demo', href: '/contact' }}
                secondaryCta={{ text: 'Start free', href: '/auth/signup' }}
            />
        </main>
    );
}
