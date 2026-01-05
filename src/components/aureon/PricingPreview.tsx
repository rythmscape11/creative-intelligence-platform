'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Pricing Preview Section
 * 
 * Three plan cards with features and CTAs.
 * Color Palette: Soft Midnight (Soothing)
 */

const plans = [
    {
        name: 'Starter',
        description: 'For solos & small teams',
        price: '$49',
        period: '/month',
        features: [
            'Agency OS basics',
            '3 client workspaces',
            'GEO Engine (limited)',
            'Email support',
        ],
        cta: 'Start free trial',
        ctaVariant: 'outline' as const,
        popular: false,
    },
    {
        name: 'Growth',
        description: 'For agencies & mid-sized brands',
        price: '$199',
        period: '/month',
        features: [
            'Full Agency OS',
            '10 client workspaces',
            'The Analyser + GEO Engine',
            'The Optimiser',
            'Priority support',
        ],
        cta: 'Start free trial',
        ctaVariant: 'default' as const,
        popular: true,
    },
    {
        name: 'Enterprise',
        description: 'Custom for large teams',
        price: 'Custom',
        period: '',
        features: [
            'Unlimited workspaces',
            'All modules included',
            'White-label options',
            'API access',
            'Dedicated success manager',
        ],
        cta: 'Talk to us',
        ctaVariant: 'outline' as const,
        popular: false,
    },
];

export function PricingPreview() {
    return (
        <section className="py-24 bg-[#0F172A]">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
                        Pricing that <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">scales with you.</span>
                    </h2>
                    <p className="text-[#94A3B8] text-lg">
                        Start free. Upgrade as you grow.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 ${plan.popular
                                ? 'bg-gradient-to-b from-[#3B82F6]/10 to-[#A78BFA]/5 border-2 border-[#3B82F6]/50'
                                : 'bg-white/[0.02] border border-white/10'
                                }`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-xs font-bold px-4 py-1 rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            {/* Plan name */}
                            <h3 className="text-xl font-bold text-[#F1F5F9] mb-1">
                                {plan.name}
                            </h3>
                            <p className="text-sm text-[#94A3B8] mb-6">
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-[#F1F5F9]">{plan.price}</span>
                                <span className="text-[#94A3B8]">{plan.period}</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className={`w-5 h-5 ${plan.popular ? 'text-[#3B82F6]' : 'text-[#10B981]'}`} />
                                        <span className="text-[#94A3B8] text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Button
                                className={`w-full ${plan.popular
                                    ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                                    : 'border-white/20 text-white hover:bg-white/5'
                                    }`}
                                variant={plan.ctaVariant}
                                asChild
                            >
                                <Link href={plan.name === 'Enterprise' ? '/contact' : '/auth/signup'}>
                                    {plan.cta}
                                </Link>
                            </Button>
                        </div>
                    ))}
                </div>

                {/* View all plans link */}
                <div className="text-center mt-12">
                    <Link href="/pricing" className="text-[#A78BFA] hover:underline font-medium">
                        View full pricing details →
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default PricingPreview;

