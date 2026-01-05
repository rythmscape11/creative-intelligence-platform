import Link from 'next/link';
import { Metadata } from 'next';
import {
    Calculator,
    TrendingUp,
    Mail,
    MessageSquare,
    FileText,
    DollarSign,
    Target,
    ArrowRight,
} from 'lucide-react';
import { CALCULATOR_CONFIGS, getCalculatorsByCategory } from '@/config/calculators';

export const metadata: Metadata = {
    title: 'Free Marketing Calculators | ROI, Budget, Conversion Tools',
    description: 'Free marketing calculators for ROI, budget planning, conversion rates, email metrics, and social media analytics. Make data-driven decisions.',
    keywords: ['marketing calculator', 'roi calculator', 'conversion rate calculator', 'cpm calculator', 'cpc calculator', 'free marketing tools'],
};

const CATEGORIES = [
    { id: 'roi', name: 'ROI Calculators', icon: TrendingUp, color: 'cyan' },
    { id: 'budget', name: 'Budget & Planning', icon: DollarSign, color: 'green' },
    { id: 'conversion', name: 'Conversion Metrics', icon: Target, color: 'purple' },
    { id: 'email', name: 'Email Marketing', icon: Mail, color: 'amber' },
    { id: 'social', name: 'Social Media', icon: MessageSquare, color: 'pink' },
    { id: 'content', name: 'Content Marketing', icon: FileText, color: 'indigo' },
    { id: 'advertising', name: 'Advertising', icon: DollarSign, color: 'orange' },
];

export default function CalculatorsPage() {
    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary border-b border-border-primary">
                <div className="max-w-6xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400 mb-6">
                            <Calculator className="w-4 h-4" />
                            {CALCULATOR_CONFIGS.length}+ Free Calculators
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                            Marketing Calculators
                        </h1>

                        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                            Free tools to calculate ROI, budget, conversion rates, and more.
                            Make data-driven marketing decisions.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { label: 'Calculators', value: `${CALCULATOR_CONFIGS.length}+` },
                            { label: 'Categories', value: CATEGORIES.length.toString() },
                            { label: 'Users', value: '50K+' },
                            { label: 'Calculations/Day', value: '10K+' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-bg-tertiary/50 border border-border-primary rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                                <div className="text-sm text-text-secondary">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calculator Categories */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const calculators = getCalculatorsByCategory(category.id as any);

                    if (calculators.length === 0) return null;

                    return (
                        <div key={category.id} className="mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 bg-${category.color}-500/20 rounded-lg`}>
                                    <Icon className={`w-6 h-6 text-${category.color}-400`} />
                                </div>
                                <h2 className="text-2xl font-bold text-text-primary">
                                    {category.name}
                                </h2>
                                <span className="text-sm text-text-tertiary">
                                    ({calculators.length} tools)
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {calculators.map((calc) => (
                                    <Link
                                        key={calc.slug}
                                        href={`/tools/calculators/${calc.slug}`}
                                        className="group bg-bg-secondary border border-border-primary rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-text-primary group-hover:text-cyan-400 transition-colors">
                                                {calc.title}
                                            </h3>
                                            <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-sm text-text-secondary line-clamp-2">
                                            {calc.description}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-y border-purple-500/20">
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold text-text-primary mb-4">
                        Need a Complete Marketing Strategy?
                    </h2>
                    <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                        Our AI-powered Strategy Generator creates comprehensive marketing plans
                        tailored to your business. Get channel recommendations, budget allocation,
                        and actionable tactics in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/strategy-generator">
                            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg transition-all">
                                Generate Free Strategy
                            </button>
                        </Link>
                        <Link href="/pricing">
                            <button className="px-8 py-4 bg-bg-secondary border border-border-primary text-text-primary font-semibold rounded-xl hover:border-cyan-500/50 transition-all">
                                View Pro Features
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
