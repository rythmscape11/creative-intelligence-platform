'use client';

import { PRODUCTS } from '@/config/product-plans';
import Link from 'next/link';
import {
    TrendingUp, Zap, Target, Brain, Bell,
    BarChart3, ArrowRight, Check, Sparkles
} from 'lucide-react';

const product = PRODUCTS.OPTIMISER;

const features = [
    {
        icon: Target,
        title: 'Multi-Platform Dashboard',
        description: 'Connect Meta, Google, LinkedIn, and TikTok ads in one unified view.',
    },
    {
        icon: Brain,
        title: 'AI Recommendations',
        description: 'Get actionable suggestions to improve ROAS, reduce waste, and scale winners.',
    },
    {
        icon: Sparkles,
        title: 'Creative Fatigue Detection',
        description: 'Know exactly when your creatives are burning out before performance tanks.',
    },
    {
        icon: BarChart3,
        title: 'Budget Optimization',
        description: 'AI-powered budget allocation across campaigns and platforms.',
    },
    {
        icon: Zap,
        title: 'Automation Rules',
        description: 'Set rules to automatically pause, scale, or adjust campaigns.',
    },
    {
        icon: Bell,
        title: 'Proactive Alerts',
        description: 'Get notified of anomalies, opportunities, and risks in real-time.',
    },
];

export default function OptimiserPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.900),transparent)]" />

                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 ring-1 ring-emerald-500/20">
                        <TrendingUp className="h-4 w-4" />
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
                            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/contact"
                            className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors"
                        >
                            Book a Demo <span aria-hidden="true">→</span>
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
                                <div className="text-2xl font-bold text-emerald-400">
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
                            Optimize Smarter, Not Harder
                        </h2>
                        <p className="mt-4 text-lg text-slate-400">
                            AI-powered insights that turn data into action and campaigns into revenue.
                        </p>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="relative rounded-2xl bg-slate-800/50 p-8 ring-1 ring-slate-700 hover:ring-emerald-500/50 transition-all"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600/10">
                                    <feature.icon className="h-6 w-6 text-emerald-400" />
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
                                <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                <span className="text-white">{audience}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Plans That Scale With You
                        </h2>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {['STARTER', 'PRO', 'AGENCY'].map((tier) => {
                            const plan = product.plans[tier as keyof typeof product.plans];
                            if (!plan) return null;

                            return (
                                <div
                                    key={tier}
                                    className={`rounded-2xl p-8 ring-1 ${plan.popular
                                            ? 'bg-emerald-600/10 ring-emerald-500'
                                            : 'bg-slate-800/50 ring-slate-700'
                                        }`}
                                >
                                    {plan.badge && (
                                        <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white mb-4">
                                            {plan.badge}
                                        </span>
                                    )}
                                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                                    <div className="mt-6">
                                        <span className="text-4xl font-bold text-white">
                                            ${plan.price.usd.monthly}
                                        </span>
                                        <span className="text-slate-400">/mo</span>
                                    </div>
                                    <ul className="mt-8 space-y-3">
                                        {plan.features.slice(0, 5).map((feature) => (
                                            <li key={feature.name} className="flex items-center gap-2">
                                                <Check className={`h-4 w-4 ${feature.included ? 'text-emerald-400' : 'text-slate-600'}`} />
                                                <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href="/pricing"
                                        className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${plan.popular
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                                : 'bg-slate-700 text-white hover:bg-slate-600'
                                            }`}
                                    >
                                        Get Started
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
                        Stop Guessing. Start Optimizing.
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        Join thousands of marketers using AI to maximize their ad performance.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/pricing"
                            className="rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all flex items-center gap-2"
                        >
                            Start Optimizing Now <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
