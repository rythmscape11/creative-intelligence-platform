import Link from 'next/link';
import {
    Zap,
    BarChart3,
    Users,
    Target,
    Sparkles,
    Calendar,
    FileText,
    PieChart,
    TrendingUp,
    Shield,
    Clock,
    CheckCircle,
} from 'lucide-react';

export const metadata = {
    title: 'Features | Aureon One',
    description: 'Explore all features of Aureon One - AI-powered marketing strategy, agency management, and growth tools.',
};

const FEATURES = [
    {
        category: 'AI Strategy',
        icon: Sparkles,
        color: 'from-purple-500 to-violet-600',
        items: [
            { name: 'Strategy Builder', desc: 'AI-generated marketing strategies', href: '/strategy' },
            { name: 'Competition Analysis', desc: 'Benchmark against competitors', href: '/growth-suite/competitors' },
            { name: 'Market Intelligence', desc: 'Real-time market insights', href: '/growth-suite' },
        ],
    },
    {
        category: 'Marketing Tools',
        icon: Target,
        color: 'from-blue-500 to-cyan-600',
        items: [
            { name: 'Ad Copy Generator', desc: 'AI-powered ad copy', href: '/tools/advertising/ad-copy-generator-enhanced' },
            { name: 'SEO Suite', desc: 'Keyword research & more', href: '/tools/seo/keyword-research-enhanced' },
            { name: 'Social Media', desc: 'Scheduling & analytics', href: '/tools/social/hashtag-generator-enhanced' },
        ],
    },
    {
        category: 'Agency OS',
        icon: Users,
        color: 'from-emerald-500 to-green-600',
        items: [
            { name: 'Client Management', desc: 'CRM for agencies', href: '/agency/clients' },
            { name: 'Project Tracker', desc: 'Kanban & timelines', href: '/agency/projects' },
            { name: 'Reports', desc: 'Automated reporting', href: '/agency/reports' },
        ],
    },
    {
        category: 'Analytics',
        icon: BarChart3,
        color: 'from-amber-500 to-orange-600',
        items: [
            { name: 'Dashboard', desc: 'Real-time metrics', href: '/agency' },
            { name: 'Ad Platform Sync', desc: 'Google, Meta, more', href: '/agency/ads' },
            { name: 'Time Tracking', desc: 'Billable hours', href: '/agency/time-tracker' },
        ],
    },
];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Powerful Features
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Everything you need to create winning marketing strategies, manage clients, and grow your agency.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
                    {FEATURES.map((category) => (
                        <div
                            key={category.category}
                            className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color}`}>
                                    <category.icon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold">{category.category}</h2>
                            </div>
                            <div className="space-y-4">
                                {category.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-start gap-3 p-4 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                                    >
                                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-zinc-400">{item.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/pricing"
                            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            View Pricing
                        </Link>
                        <Link
                            href="/strategy"
                            className="px-8 py-3 border border-zinc-700 rounded-lg font-semibold hover:bg-zinc-800 transition-colors"
                        >
                            Try Strategy Builder
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
