'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    PRODUCTS,
    ProductType,
    FULL_STACK_BUNDLE,
    getProductPlans,
    formatPrice,
    calculateYearlySavings
} from '@/config/product-plans';
import {
    Building2, TrendingUp, Search, Lightbulb,
    Check, X, ArrowRight, Sparkles
} from 'lucide-react';

const productIcons = {
    AGENCY_OS: Building2,
    OPTIMISER: TrendingUp,
    ANALYSER: Search,
    STRATEGISER: Lightbulb,
};

const productColors = {
    AGENCY_OS: {
        bg: 'bg-indigo-600',
        light: 'bg-indigo-600/10',
        text: 'text-indigo-400',
        ring: 'ring-indigo-500',
        hover: 'hover:bg-indigo-500',
    },
    OPTIMISER: {
        bg: 'bg-emerald-600',
        light: 'bg-emerald-600/10',
        text: 'text-emerald-400',
        ring: 'ring-emerald-500',
        hover: 'hover:bg-emerald-500',
    },
    ANALYSER: {
        bg: 'bg-amber-600',
        light: 'bg-amber-600/10',
        text: 'text-amber-400',
        ring: 'ring-amber-500',
        hover: 'hover:bg-amber-500',
    },
    STRATEGISER: {
        bg: 'bg-violet-600',
        light: 'bg-violet-600/10',
        text: 'text-violet-400',
        ring: 'ring-violet-500',
        hover: 'hover:bg-violet-500',
    },
};

type Currency = 'usd' | 'inr';
type Interval = 'monthly' | 'yearly';

export default function PricingPageClient() {
    const [selectedProduct, setSelectedProduct] = useState<ProductType | 'BUNDLE'>('AGENCY_OS');
    const [currency, setCurrency] = useState<Currency>('usd');
    const [interval, setInterval] = useState<Interval>('monthly');

    const products = Object.keys(PRODUCTS) as ProductType[];

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Hero */}
            <section className="py-20 px-4 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                    Choose individual products or bundle them all for maximum savings.
                    All plans include a 14-day free trial.
                </p>

                {/* Currency & Interval Toggle */}
                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setCurrency('usd')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currency === 'usd'
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            USD ($)
                        </button>
                        <button
                            onClick={() => setCurrency('inr')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${currency === 'inr'
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            INR (₹)
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
                        <button
                            onClick={() => setInterval('monthly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${interval === 'monthly'
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setInterval('yearly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${interval === 'yearly'
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Yearly <span className="text-emerald-400 text-xs ml-1">Save 17%</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Product Tabs */}
            <section className="px-4 pb-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-800/50 rounded-xl">
                        {products.map((productKey) => {
                            const product = PRODUCTS[productKey];
                            const Icon = productIcons[productKey];
                            const colors = productColors[productKey];
                            const isSelected = selectedProduct === productKey;

                            return (
                                <button
                                    key={productKey}
                                    onClick={() => setSelectedProduct(productKey)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isSelected
                                        ? `${colors.bg} text-white`
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {product.name}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setSelectedProduct('BUNDLE')}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${selectedProduct === 'BUNDLE'
                                ? 'bg-gradient-to-r from-indigo-600 via-emerald-600 to-violet-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            <Sparkles className="h-4 w-4" />
                            Full Stack Bundle
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-4 pb-20">
                <div className="max-w-7xl mx-auto">
                    {selectedProduct === 'BUNDLE' ? (
                        <BundlePricing currency={currency} interval={interval} />
                    ) : (
                        <ProductPricing
                            productKey={selectedProduct}
                            currency={currency}
                            interval={interval}
                        />
                    )}
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4 border-t border-slate-800">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-xl p-6">
                                <h3 className="text-lg font-medium text-white mb-2">{faq.question}</h3>
                                <p className="text-slate-400">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-slate-800/30">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-lg text-slate-400 mb-8">
                        Our team is here to help you choose the right plan for your needs.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                            Contact Sales
                        </Link>
                        <Link
                            href="/demo"
                            className="px-6 py-3 border border-slate-600 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            Watch Demo
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Product Pricing Component
function ProductPricing({
    productKey,
    currency,
    interval
}: {
    productKey: ProductType;
    currency: Currency;
    interval: Interval;
}) {
    const product = PRODUCTS[productKey];
    const plans = getProductPlans(productKey).filter(p => p.tier !== 'ENTERPRISE');
    const colors = productColors[productKey];
    const Icon = productIcons[productKey];

    return (
        <div>
            {/* Product Header */}
            <div className="text-center mb-12">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${colors.light} ${colors.text} ring-1 ${colors.ring}/20 mb-4`}>
                    <Icon className="h-4 w-4" />
                    {product.name}
                </div>
                <h2 className="text-2xl font-bold text-white">{product.headline}</h2>
                <p className="text-slate-400 mt-2">{product.subheadline}</p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => {
                    const price = plan.price[currency][interval];
                    const savings = calculateYearlySavings(productKey, plan.tier, currency);

                    return (
                        <div
                            key={plan.id}
                            className={`rounded-2xl p-8 ring-1 ${plan.popular
                                ? `${colors.light} ${colors.ring}`
                                : 'bg-slate-800/50 ring-slate-700'
                                }`}
                        >
                            {plan.badge && (
                                <span className={`inline-block ${colors.bg} px-3 py-1 text-xs font-medium text-white rounded-full mb-4`}>
                                    {plan.badge}
                                </span>
                            )}

                            <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                            <p className="text-sm text-slate-400 mt-1">{plan.tagline}</p>

                            <div className="mt-6">
                                <span className="text-4xl font-bold text-white">
                                    {price === 0 ? 'Free' : formatPrice(price, currency)}
                                </span>
                                {price > 0 && (
                                    <span className="text-slate-400">/{interval === 'monthly' ? 'mo' : 'yr'}</span>
                                )}
                            </div>

                            {interval === 'yearly' && savings.savingsPercent > 0 && price > 0 && (
                                <p className="text-sm text-emerald-400 mt-2">
                                    Save {formatPrice(savings.savings, currency)}/year
                                </p>
                            )}

                            <ul className="mt-8 space-y-3">
                                {plan.features.map((feature) => (
                                    <li key={feature.name} className="flex items-start gap-3">
                                        {feature.included ? (
                                            <Check className={`h-5 w-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                                        ) : (
                                            <X className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
                                            {feature.name}
                                            {feature.limit && feature.included && (
                                                <span className="text-slate-500"> ({feature.limit})</span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={price === 0 ? `/${product.route.replace('/', '')}` : '/checkout'}
                                className={`mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${plan.popular
                                    ? `${colors.bg} text-white ${colors.hover}`
                                    : 'bg-slate-700 text-white hover:bg-slate-600'
                                    }`}
                            >
                                {price === 0 ? 'Get Started Free' : 'Start 14-Day Trial'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Bundle Pricing Component
function BundlePricing({ currency, interval }: { currency: Currency; interval: Interval }) {
    const tiers = ['starter', 'pro', 'agency'] as const;

    return (
        <div>
            {/* Bundle Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/10 via-emerald-600/10 to-violet-600/10 text-white ring-1 ring-white/20 mb-4">
                    <Sparkles className="h-4 w-4" />
                    Full Stack Bundle
                </div>
                <h2 className="text-2xl font-bold text-white">All 4 Products. One Price. 30% Off.</h2>
                <p className="text-slate-400 mt-2">
                    Get Agency OS, The Optimiser, The Analyser, and The Strategiser together.
                </p>
            </div>

            {/* Bundle Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tiers.map((tier) => {
                    const bundlePrice = FULL_STACK_BUNDLE.price[tier][currency][interval];
                    const isPopular = tier === 'pro';

                    // Calculate savings vs individual
                    let individualTotal = 0;
                    (Object.keys(PRODUCTS) as ProductType[]).forEach(productKey => {
                        const plan = PRODUCTS[productKey].plans[tier.toUpperCase() as keyof typeof PRODUCTS[typeof productKey]['plans']];
                        if (plan) {
                            individualTotal += plan.price[currency][interval];
                        }
                    });
                    const savings = individualTotal - bundlePrice;

                    return (
                        <div
                            key={tier}
                            className={`rounded-2xl p-8 ring-1 ${isPopular
                                ? 'bg-gradient-to-b from-indigo-600/10 via-emerald-600/5 to-violet-600/10 ring-white/30'
                                : 'bg-slate-800/50 ring-slate-700'
                                }`}
                        >
                            {isPopular && (
                                <span className="inline-block bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-xs font-medium text-white rounded-full mb-4">
                                    Best Value
                                </span>
                            )}

                            <h3 className="text-xl font-semibold text-white capitalize">
                                Full Stack {tier}
                            </h3>
                            <p className="text-sm text-slate-400 mt-1">All 4 products</p>

                            <div className="mt-6">
                                <span className="text-4xl font-bold text-white">
                                    {formatPrice(bundlePrice, currency)}
                                </span>
                                <span className="text-slate-400">/{interval === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>

                            <p className="text-sm text-emerald-400 mt-2">
                                Save {formatPrice(savings, currency)} vs individual
                            </p>

                            <ul className="mt-8 space-y-3">
                                <li className="flex items-center gap-3">
                                    <Building2 className="h-5 w-5 text-indigo-400" />
                                    <span className="text-slate-300">Agency OS {tier}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                                    <span className="text-slate-300">The Optimiser {tier}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Search className="h-5 w-5 text-amber-400" />
                                    <span className="text-slate-300">The Analyser {tier}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Lightbulb className="h-5 w-5 text-violet-400" />
                                    <span className="text-slate-300">The Strategiser {tier}</span>
                                </li>
                            </ul>

                            <Link
                                href="/checkout?bundle=true"
                                className={`mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${isPopular
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500'
                                    : 'bg-slate-700 text-white hover:bg-slate-600'
                                    }`}
                            >
                                Get Full Stack
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// FAQs
const faqs = [
    {
        question: 'Can I subscribe to products individually?',
        answer: 'Yes! Each product (Agency OS, The Optimiser, The Analyser, The Strategiser) can be purchased separately. Or get all four with the Full Stack Bundle at 30% off.',
    },
    {
        question: 'What is Aureon Forge?',
        answer: 'Forge is our API & automation platform. All plans include API access with Sparks credits. Use Forge to build automation flows, generate images/videos programmatically, and integrate with your tools via webhooks.',
    },
    {
        question: 'What are Sparks?',
        answer: 'Sparks are credits used for AI-powered features like image generation (Flux), video creation (Runway/Kling), and LLM tasks. All plans include monthly Sparks allocations, with higher tiers getting more Sparks.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, UPI, and net banking through Razorpay. Enterprise customers can pay via invoice.',
    },
    {
        question: 'Is there a free trial?',
        answer: 'Yes! All paid plans include a 14-day free trial. The Strategiser also has a permanent free tier with limited features.',
    },
    {
        question: 'Can I switch between products?',
        answer: 'Absolutely! You can add or remove products from your subscription at any time. Changes take effect at your next billing cycle.',
    },
    {
        question: 'What happens when my trial ends?',
        answer: 'You\'ll be charged for your selected plan unless you cancel. We\'ll send reminders before your trial expires.',
    },
    {
        question: 'Do you offer annual discounts?',
        answer: 'Yes! Save 17% when you choose annual billing on any plan or bundle.',
    },
];
