'use client';

import { PRODUCTS } from '@/config/product-plans';
import Link from 'next/link';
import {
    Lightbulb, FileText, PieChart, Users,
    Target, Layers, ArrowRight, Check, Zap
} from 'lucide-react';

const product = PRODUCTS.STRATEGISER;

const features = [
    {
        icon: Zap,
        title: 'AI Strategy Generation',
        description: 'Generate comprehensive marketing strategies in under 60 seconds using advanced AI.',
    },
    {
        icon: Target,
        title: 'Full-Funnel Planning',
        description: 'Strategies that cover awareness, consideration, conversion, and retention.',
    },
    {
        icon: PieChart,
        title: 'Channel Mix Optimization',
        description: 'AI-recommended channel allocation based on your goals and budget.',
    },
    {
        icon: Users,
        title: 'Persona-Based Strategies',
        description: 'Tailored recommendations for different audience segments.',
    },
    {
        icon: Layers,
        title: 'Competitive Positioning',
        description: 'Insights on how to differentiate from your competitors.',
    },
    {
        icon: FileText,
        title: 'Professional Exports',
        description: 'Export to PDF, PowerPoint, or Word for client presentations.',
    },
];

export default function StrategiserPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-violet-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.violet.900),transparent)]" />

                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 text-sm text-violet-400 ring-1 ring-violet-500/20">
                        <Lightbulb className="h-4 w-4" />
                        {product.name}
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        {product.headline}
                    </h1>

                    <p className="mt-6 text-xl leading-8 text-slate-300">
                        {product.subheadline}
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/pricing"
                            className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition-all"
                        >
                            Try Free
                        </Link>
                        <Link
                            href="/strategy"
                            className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors"
                        >
                            See Demo <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-slate-800">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {product.outcomes.map((outcome, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-bold text-violet-400">
                                    {outcome.split(' ')[0]}
                                </div>
                                <div className="mt-1 text-sm text-slate-400">
                                    {outcome.split(' ').slice(1).join(' ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Strategy on Demand
                        </h2>
                        <p className="mt-4 text-lg text-slate-400">
                            Stop spending hours on strategy docs. Let AI do the heavy lifting.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="relative rounded-2xl bg-slate-800/50 p-8 ring-1 ring-slate-700 hover:ring-violet-500/50 transition-all"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600/10">
                                    <feature.icon className="h-6 w-6 text-violet-400" />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-white">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Audience Section */}
            <section className="py-24 bg-slate-800/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Built For
                        </h2>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {product.targetAudience.map((audience) => (
                            <div
                                key={audience}
                                className="flex items-center gap-3 rounded-lg bg-slate-800 p-4"
                            >
                                <Check className="h-5 w-5 text-violet-400 flex-shrink-0" />
                                <span className="text-white">{audience}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview with Free Tier */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Start Free, Scale As You Grow
                        </h2>
                        <p className="mt-4 text-lg text-slate-400">
                            The Strategiser is the only product with a free tier. Try it today.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {['FREE', 'STARTER', 'PRO', 'AGENCY'].map((tier) => {
                            const plan = product.plans[tier as keyof typeof product.plans];
                            if (!plan) return null;

                            return (
                                <div
                                    key={tier}
                                    className={`rounded-2xl p-6 ring-1 ${plan.popular
                                            ? 'bg-violet-600/10 ring-violet-500'
                                            : tier === 'FREE'
                                                ? 'bg-slate-800/30 ring-slate-600'
                                                : 'bg-slate-800/50 ring-slate-700'
                                        }`}
                                >
                                    {plan.badge && (
                                        <span className="inline-block rounded-full bg-violet-500 px-3 py-1 text-xs font-medium text-white mb-4">
                                            {plan.badge}
                                        </span>
                                    )}
                                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                                    <div className="mt-4">
                                        <span className="text-3xl font-bold text-white">
                                            {plan.price.usd.monthly === 0 ? 'Free' : `$${plan.price.usd.monthly}`}
                                        </span>
                                        {plan.price.usd.monthly > 0 && (
                                            <span className="text-slate-400">/mo</span>
                                        )}
                                    </div>
                                    <ul className="mt-6 space-y-2">
                                        {plan.features.slice(0, 4).map((feature) => (
                                            <li key={feature.name} className="flex items-center gap-2 text-sm">
                                                <Check className={`h-4 w-4 ${feature.included ? 'text-violet-400' : 'text-slate-600'}`} />
                                                <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={tier === 'FREE' ? '/strategy' : '/pricing'}
                                        className={`mt-6 block w-full rounded-lg py-2 text-center text-sm font-semibold transition-all ${plan.popular
                                                ? 'bg-violet-600 text-white hover:bg-violet-500'
                                                : 'bg-slate-700 text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        {tier === 'FREE' ? 'Start Free' : 'Get Started'}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-slate-800">
                <div className="mx-auto max-w-4xl text-center px-6">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Your Next Strategy is 60 Seconds Away
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        Join thousands of marketers who create winning strategies with AI.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/strategy"
                            className="rounded-lg bg-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-violet-500 transition-all flex items-center gap-2"
                        >
                            Create Your First Strategy <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
