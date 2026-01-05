'use client';

import Link from 'next/link';
import {
    Briefcase,
    LineChart,
    Search,
    Sparkles,
    BarChart3,
    Zap,
    ArrowRight
} from 'lucide-react';

/**
 * Product Suite Section
 * 
 * Six module cards showcasing Aureon One's core products.
 */

const products = [
    {
        name: 'Agency OS',
        description: 'Projects, clients, approvals, and assets in one workspace.',
        icon: Briefcase,
        href: '/product/agency-os',
        color: 'from-blue-500/20 to-blue-600/20',
        iconColor: 'text-blue-400',
    },
    {
        name: 'The Optimiser',
        description: 'AI campaign optimisation and performance insights.',
        icon: LineChart,
        href: '/product/optimiser',
        color: 'from-green-500/20 to-green-600/20',
        iconColor: 'text-green-400',
    },
    {
        name: 'The Analyser',
        description: 'SEO, SEM, GEO, and competitor intelligence.',
        icon: Search,
        href: '/product/analyser',
        color: 'from-purple-500/20 to-purple-600/20',
        iconColor: 'text-purple-400',
    },
    {
        name: 'GEO Engine',
        description: 'Generative Engine Optimisation for AI search and answer engines.',
        icon: Sparkles,
        href: '/product/geo-engine',
        color: 'from-[#A78BFA]/20 to-[#8B5CF6]/20',
        iconColor: 'text-[#A78BFA]',
    },
    {
        name: 'The Strategiser',
        description: 'Strategy builder, playbooks, and growth frameworks.',
        icon: BarChart3,
        href: '/product/strategiser',
        color: 'from-[#3B82F6]/20 to-[#2563EB]/20',
        iconColor: 'text-[#3B82F6]',
    },
    {
        name: 'Aureon Forge',
        description: 'Visual automation flows, AI content generation, and public API access.',
        icon: Zap,
        href: '/products/forge',
        color: 'from-amber-500/20 to-amber-600/20',
        iconColor: 'text-amber-400',
        badge: 'NEW',
    },
];

export function ProductSuite() {
    return (
        <section className="py-24 bg-[#0F172A]">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
                        One platform. <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">Six powerful modules.</span>
                    </h2>
                    <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
                        Everything you need to plan, analyse, optimise, and execute marketing at scale.
                    </p>
                </div>

                {/* Product Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Link
                            key={product.name}
                            href={product.href}
                            className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-[#3B82F6]/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${product.iconColor}`}>
                                    <product.icon className="w-6 h-6" />
                                </div>

                                {/* Title with Badge */}
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold text-[#F1F5F9] group-hover:text-[#3B82F6] transition-colors">
                                        {product.name}
                                    </h3>
                                    {'badge' in product && product.badge && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-black rounded-full">
                                            {product.badge}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-[#94A3B8] mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                {/* Learn more link */}
                                <div className="flex items-center text-sm text-[#64748B] group-hover:text-[#3B82F6] transition-colors">
                                    <span>Learn more</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductSuite;
