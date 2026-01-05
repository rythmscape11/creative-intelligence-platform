import { Metadata } from 'next';
import { DollarSign, Eye, AlertTriangle, BookOpen } from 'lucide-react';
import { MarketingHero, FeatureCards, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
    title: 'The Optimiser — Performance, on Autopilot | Aureon One',
    description:
        'Connect your ad accounts, and let AI surface where to shift budgets, fix leaks, and scale what works.',
};

const capabilities = [
    {
        icon: <DollarSign className="w-6 h-6" />,
        title: 'Smart Budget Reallocation',
        description: 'Identify underperforming spends and shift budget toward higher-return campaigns.',
    },
    {
        icon: <Eye className="w-6 h-6" />,
        title: 'Creative & Audience Insights',
        description: 'See which creatives, hooks, and audiences are truly driving results.',
    },
    {
        icon: <AlertTriangle className="w-6 h-6" />,
        title: 'Anomaly Detection & Alerts',
        description: 'Catch performance spikes and drops as they happen, not after the fact.',
    },
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: 'Playbooks from Performance Data',
        description: 'Turn learnings into repeatable frameworks you can reuse across accounts.',
    },
];

const beforeAfter = {
    before: [
        'Endless platform tab-hopping',
        'Manual spreadsheets and screenshots',
        'Missed anomalies and wasted spend',
    ],
    after: [
        'One view for all key campaigns',
        'AI suggestions for what to do next',
        'Faster decisions, better ROAS',
    ],
};

export default function OptimiserPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen">
            {/* Hero */}
            <MarketingHero
                eyebrow="Product · The Optimiser"
                title="The Optimiser — Performance, on Autopilot."
                subtitle="Connect your ad accounts, and let AI surface where to shift budgets, fix leaks, and scale what works."
                primaryCta={{ text: 'Connect ad accounts', href: '/auth/signup' }}
                secondaryCta={{ text: 'View sample dashboard', href: '/contact' }}
            />

            {/* Channels Section */}
            <section className="py-16 bg-[#0F172A] border-b border-white/5">
                <div className="container mx-auto px-6 lg:px-12 text-center">
                    <h2 className="text-3xl font-bold text-[#F1F5F9] mb-4">
                        All your performance data, one intelligent view.
                    </h2>
                    <p className="text-[#94A3B8] mb-8">
                        Bring paid data from Meta, Google, LinkedIn, and more into a single performance control
                        panel.
                    </p>
                    <div className="flex justify-center gap-8 flex-wrap">
                        {['Meta', 'Google', 'LinkedIn', 'TikTok', 'Twitter'].map((channel) => (
                            <div
                                key={channel}
                                className="px-6 py-3 bg-white/5 rounded-lg border border-white/10 text-[#94A3B8]"
                            >
                                {channel}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Capabilities */}
            <FeatureCards
                title="Core Capabilities"
                cards={capabilities}
                columns={4}
            />

            {/* Before & After */}
            <section className="py-20 lg:py-28 bg-[#0F172A]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Before */}
                        <div className="bg-white/5 rounded-xl p-8 border border-white/10">
                            <h3 className="text-2xl font-bold text-[#94A3B8] mb-6">Before Aureon One</h3>
                            <ul className="space-y-4">
                                {beforeAfter.before.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[#94A3B8]">
                                        <span className="w-2 h-2 rounded-full bg-red-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* After */}
                        <div className="bg-gradient-to-br from-[#3B82F6]/10 to-[#A78BFA]/5 rounded-xl p-8 border border-[#3B82F6]/20">
                            <h3 className="text-2xl font-bold text-[#F1F5F9] mb-6">With The Optimiser</h3>
                            <ul className="space-y-4">
                                {beforeAfter.after.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[#F1F5F9]">
                                        <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Band */}
            <CtaBand
                title="Optimise your next campaign with The Optimiser."
                primaryCta={{ text: 'Start free workspace', href: '/auth/signup' }}
                secondaryCta={{ text: 'Book a performance review', href: '/contact' }}
            />
        </main>
    );
}
