import { Metadata } from 'next';
import { Briefcase, TrendingUp, Search, Globe, Lightbulb } from 'lucide-react';
import { MarketingHero, FeatureCards, SplitSection, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
    title: 'The Aureon One Product Suite | Aureon One',
    description:
        'One operating system, five powerful modules. Choose what you need or run them all together under a single intelligent cloud.',
};

const moduleCards = [
    {
        icon: <Briefcase className="w-6 h-6" />,
        title: 'Agency OS',
        description: 'Projects, clients, approvals, and assets in one operational workspace.',
        href: '/product/agency-os',
        linkText: 'Learn more',
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: 'The Optimiser',
        description: 'AI-driven campaign optimisation across channels, budgets, and creatives.',
        href: '/product/optimiser',
        linkText: 'Learn more',
    },
    {
        icon: <Search className="w-6 h-6" />,
        title: 'The Analyser',
        description: 'SEO, SEM, GEO, and competitive intelligence powered by data and AI.',
        href: '/product/analyser',
        linkText: 'Learn more',
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: 'GEO Engine',
        description:
            'Generative Engine Optimisation for AI Overviews, answer engines, and the future of search.',
        href: '/product/geo-engine',
        linkText: 'Learn more',
    },
    {
        icon: <Lightbulb className="w-6 h-6" />,
        title: 'The Strategiser',
        description: 'Structured strategy builder for GTM plans, campaigns, and growth playbooks.',
        href: '/product/strategiser',
        linkText: 'Learn more',
    },
];

export default function ProductPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen">
            {/* Hero */}
            <MarketingHero
                eyebrow="Product"
                title="The Aureon One Product Suite"
                subtitle="One operating system, five powerful modules. Choose what you need or run them all together under a single intelligent cloud."
                primaryCta={{ text: 'Explore modules', href: '#modules' }}
                secondaryCta={{ text: 'Book a demo', href: '/contact' }}
            />

            {/* Module Grid */}
            <section id="modules">
                <FeatureCards
                    title="Five modules. One Aureon One."
                    subtitle="Each module is powerful on its own. Together, they create a complete marketing command center."
                    cards={moduleCards}
                    columns={5}
                />
            </section>

            {/* How Modules Connect */}
            <SplitSection
                title="Built to work together."
                subtitle="Strategies feed insights. Insights feed optimisation. Optimisation feeds execution."
                bullets={[
                    'The Strategiser designs the plan.',
                    'The Analyser and GEO Engine surface where you can win.',
                    'The Optimiser turns insights into actions across channels.',
                    'Agency OS keeps projects, tasks, and approvals moving.',
                ]}
                visual={
                    <div className="bg-gradient-to-br from-[#3B82F6]/10 to-[#A78BFA]/10 rounded-xl p-8 border border-white/10">
                        <div className="space-y-4">
                            {['Strategiser', 'Analyser + GEO', 'Optimiser', 'Agency OS'].map((step, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-[#3B82F6]/50 to-transparent" />
                                    <span className="text-[#F1F5F9] font-medium">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            />

            {/* CTA Band */}
            <CtaBand
                title="See Aureon One in action."
                subtitle="Walk through the full product suite with our team and map it to your workflows."
                primaryCta={{ text: 'Book a live demo', href: '/contact' }}
                secondaryCta={{ text: 'Start free workspace', href: '/auth/signup' }}
            />
        </main>
    );
}
