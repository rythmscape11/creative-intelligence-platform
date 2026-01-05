import { Metadata } from 'next';
import { Rocket, Target, Calendar, Globe } from 'lucide-react';
import { MarketingHero, FeatureCards, SplitSection, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
    title: 'The Strategiser — Strategy, Systemised | Aureon One',
    description:
        'Transform research, performance data, and GEO insights into clear, repeatable growth playbooks.',
};

const templates = [
    {
        icon: <Rocket className="w-6 h-6" />,
        title: 'GTM Strategy Template',
        description: 'Launch new products and markets with clarity.',
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: 'Campaign Strategy Template',
        description: 'Design full-funnel campaigns with budgets and milestones.',
    },
    {
        icon: <Calendar className="w-6 h-6" />,
        title: 'Annual Media Strategy Template',
        description: 'Plan the year by quarter, season, or category.',
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: 'GEO-Informed Content Roadmap',
        description: 'Build content plans that align with AI search opportunities.',
    },
];

const connectedBullets = [
    'Send experiments and priorities to The Optimiser as test briefs.',
    'Turn strategic pillars into projects and tasks in Agency OS.',
    'Use insights from The Analyser and GEO Engine to update strategy over time.',
];

export default function StrategiserPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen">
            {/* Hero */}
            <MarketingHero
                eyebrow="Product · The Strategiser"
                title="The Strategiser — Strategy, Systemised."
                subtitle="Transform research, performance data, and GEO insights into clear, repeatable growth playbooks."
                primaryCta={{ text: 'Build a strategy', href: '/strategiser' }}
                secondaryCta={{ text: 'Browse templates', href: '#templates' }}
            />

            {/* Inputs & Outputs */}
            <section className="py-20 lg:py-28 bg-[#0F172A] border-b border-white/5">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-6">
                            From scattered inputs to structured plans.
                        </h2>
                        <div className="space-y-4 text-lg text-[#94A3B8]">
                            <p>Feed in market research, performance learnings, and competitive intel.</p>
                            <p>
                                Get back channel mixes, messaging pillars, funnels, and testing roadmaps you can
                                execute.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates */}
            <section id="templates">
                <FeatureCards title="Template Gallery" cards={templates} columns={4} />
            </section>

            {/* Connected to Execution */}
            <SplitSection
                title="Connected to execution."
                subtitle="The Strategiser doesn't just produce documents — it pushes outputs to other modules so strategy becomes action."
                bullets={connectedBullets}
            />

            {/* CTA Band */}
            <CtaBand
                title="Design your next growth playbook with The Strategiser."
                primaryCta={{ text: 'Start free workspace', href: '/auth/signup' }}
                secondaryCta={{ text: 'Talk to our team', href: '/contact' }}
            />
        </main>
    );
}
