import { Metadata } from 'next';
import { Users, CheckSquare, FolderOpen, BarChart3, Shield, Layers } from 'lucide-react';
import { MarketingHero, FeatureCards, SplitSection, CtaBand } from '@/components/marketing';

export const metadata: Metadata = {
    title: 'Agency OS — Stable Operations Platform | Aureon One',
    description:
        'A structured operating system for modern marketing agencies. Manage clients, campaigns, and deliverables with enterprise-grade reliability.',
};

const capabilities = [
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Client & Workspace Management',
        description: 'Organize clients into dedicated workspaces with clear ownership, permissions, and audit trails.',
    },
    {
        icon: <Layers className="w-6 h-6" />,
        title: 'Campaign Projects',
        description: 'Structure campaigns as projects with timelines, status tracking, and team assignments.',
    },
    {
        icon: <CheckSquare className="w-6 h-6" />,
        title: 'Deliverables & Tasks',
        description: 'Break down campaigns into trackable deliverables with priorities, deadlines, and accountability.',
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Cycles & Sprints',
        description: 'Run time-boxed phases for predictable delivery and clear progress visibility.',
    },
    {
        icon: <FolderOpen className="w-6 h-6" />,
        title: 'Views & Dashboards',
        description: 'Kanban, list, and calendar views to match how your team works best.',
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: 'Reliability & Audit',
        description: 'Activity logs, version history, and role-based access for enterprise accountability.',
    },
];

const strengths = [
    {
        title: 'Built on proven infrastructure',
        description: 'Powered by battle-tested open-source foundations, not fragile custom code.',
    },
    {
        title: 'Structured for agencies',
        description: 'Terminology and workflows designed for client work, campaigns, and retainers.',
    },
    {
        title: 'Ready for scale',
        description: 'Multi-tenant architecture supports growing teams and expanding client bases.',
    },
];

export default function AgencyOSPage() {
    return (
        <main className="bg-[#0F172A] min-h-screen">
            {/* Hero */}
            <MarketingHero
                eyebrow="Product · Agency OS"
                title="Agency OS — Stable Operations for Modern Agencies"
                subtitle="A structured operating system built for reliability. Manage clients, campaigns, and deliverables without the chaos."
                primaryCta={{ text: 'Launch Agency OS', href: '/agency' }}
                secondaryCta={{ text: 'See how it works', href: '#capabilities' }}
            />

            {/* Key Capabilities */}
            <FeatureCards
                title="Everything runs through one stable system."
                subtitle="Replace scattered tools, brittle workflows, and manual tracking with structured operations."
                cards={capabilities}
                columns={3}
            />

            {/* Workflow Preview */}
            <SplitSection
                title="Designed for real agency operations."
                bullets={[
                    'Onboard clients with structured workspaces, not ad-hoc folders.',
                    'Track every deliverable from assignment to completion with full visibility.',
                    'Run campaigns in time-boxed cycles for predictable outcomes.',
                ]}
            />

            {/* Strengths Section */}
            <section id="capabilities" className="py-20 lg:py-28 bg-[#0F172A]">
                <div className="container mx-auto px-6 lg:px-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] text-center mb-16">
                        Same product. Stronger foundation.
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {strengths.map((item, index) => (
                            <div key={index} className="text-center">
                                <h3 className="text-xl font-semibold text-[#3B82F6] mb-3">{item.title}</h3>
                                <p className="text-[#94A3B8]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Band */}
            <CtaBand
                title="Run your agency on stable infrastructure."
                primaryCta={{ text: 'Get started', href: '/agency' }}
                secondaryCta={{ text: 'Contact sales', href: '/contact' }}
            />
        </main>
    );
}
