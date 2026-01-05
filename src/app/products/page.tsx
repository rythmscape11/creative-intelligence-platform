'use client';

import { PRODUCTS, ProductType } from '@/config/product-plans';
import Link from 'next/link';
import { Building2, TrendingUp, Search, Lightbulb, ArrowRight } from 'lucide-react';

const productIcons = {
    AGENCY_OS: Building2,
    OPTIMISER: TrendingUp,
    ANALYSER: Search,
    STRATEGISER: Lightbulb,
};

const productColors = {
    AGENCY_OS: { bg: 'bg-indigo-600/10', text: 'text-indigo-400', ring: 'ring-indigo-500/20', hover: 'hover:ring-indigo-500' },
    OPTIMISER: { bg: 'bg-emerald-600/10', text: 'text-emerald-400', ring: 'ring-emerald-500/20', hover: 'hover:ring-emerald-500' },
    ANALYSER: { bg: 'bg-amber-600/10', text: 'text-amber-400', ring: 'ring-amber-500/20', hover: 'hover:ring-amber-500' },
    STRATEGISER: { bg: 'bg-violet-600/10', text: 'text-violet-400', ring: 'ring-violet-500/20', hover: 'hover:ring-violet-500' },
};

const productRoutes = {
    AGENCY_OS: '/products/agency-os',
    OPTIMISER: '/products/the-optimiser',
    ANALYSER: '/products/the-analyser',
    STRATEGISER: '/products/the-strategiser',
};

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.700),transparent)]" />

                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        Four Powerful Platforms.
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">
                            One Unified Suite.
                        </span>
                    </h1>

                    <p className="mt-6 text-xl leading-8 text-slate-300">
                        Aureon One combines agency management, campaign optimization, competitive intelligence, and AI strategy generation into one cohesive platform.
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {(Object.entries(PRODUCTS) as [ProductType, typeof PRODUCTS[ProductType]][]).map(([key, product]) => {
                            const Icon = productIcons[key];
                            const colors = productColors[key];
                            const route = productRoutes[key];

                            return (
                                <Link
                                    key={key}
                                    href={route}
                                    className={`group relative rounded-3xl bg-slate-800/50 p-8 ring-1 ring-slate-700 transition-all duration-300 ${colors.hover}`}
                                >
                                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}>
                                        <Icon className="h-4 w-4" />
                                        {product.name}
                                    </div>

                                    <h2 className="mt-6 text-2xl font-bold text-white">
                                        {product.headline}
                                    </h2>

                                    <p className="mt-4 text-slate-400 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                                            Key Outcomes
                                        </h4>
                                        <ul className="mt-3 space-y-2">
                                            {product.outcomes.slice(0, 3).map((outcome) => (
                                                <li key={outcome} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                                                    {outcome}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mt-8 flex items-center gap-2 text-sm font-medium">
                                        <span className={colors.text}>Explore {product.name}</span>
                                        <ArrowRight className={`h-4 w-4 ${colors.text} transition-transform group-hover:translate-x-1`} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bundle CTA */}
            <section className="py-24 px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-emerald-600 to-violet-600 p-px">
                        <div className="rounded-3xl bg-slate-900 p-12 text-center">
                            <h2 className="text-3xl font-bold text-white">
                                Get the Full Stack Bundle
                            </h2>
                            <p className="mt-4 text-lg text-slate-300">
                                All 4 products at 30% off. One subscription. Complete marketing power.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href="/pricing"
                                    className="rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 hover:bg-slate-100 transition-colors"
                                >
                                    View Bundle Pricing
                                </Link>
                                <Link
                                    href="/contact"
                                    className="rounded-lg border border-slate-600 px-8 py-3 font-semibold text-white hover:bg-slate-800 transition-colors"
                                >
                                    Talk to Sales
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Quick View */}
            <section className="py-16 px-6 lg:px-8 border-t border-slate-800">
                <div className="mx-auto max-w-7xl">
                    <h2 className="text-2xl font-bold text-white text-center mb-12">
                        Which Product is Right For You?
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="py-4 px-4 text-sm font-medium text-slate-400">Best For</th>
                                    <th className="py-4 px-4 text-sm font-medium text-indigo-400">Agency OS</th>
                                    <th className="py-4 px-4 text-sm font-medium text-emerald-400">The Optimiser</th>
                                    <th className="py-4 px-4 text-sm font-medium text-amber-400">The Analyser</th>
                                    <th className="py-4 px-4 text-sm font-medium text-violet-400">The Strategiser</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-800">
                                    <td className="py-4 px-4 text-sm text-slate-400">Primary Use</td>
                                    <td className="py-4 px-4 text-sm text-white">Client & Project Management</td>
                                    <td className="py-4 px-4 text-sm text-white">Ad Campaign Optimization</td>
                                    <td className="py-4 px-4 text-sm text-white">SEO & Competitive Research</td>
                                    <td className="py-4 px-4 text-sm text-white">Strategy Generation</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-4 px-4 text-sm text-slate-400">Ideal User</td>
                                    <td className="py-4 px-4 text-sm text-white">Agency Teams</td>
                                    <td className="py-4 px-4 text-sm text-white">Media Buyers</td>
                                    <td className="py-4 px-4 text-sm text-white">SEO Specialists</td>
                                    <td className="py-4 px-4 text-sm text-white">Strategists</td>
                                </tr>
                                <tr className="border-b border-slate-800">
                                    <td className="py-4 px-4 text-sm text-slate-400">Starting Price</td>
                                    <td className="py-4 px-4 text-sm text-white">$29/mo</td>
                                    <td className="py-4 px-4 text-sm text-white">$39/mo</td>
                                    <td className="py-4 px-4 text-sm text-white">$29/mo</td>
                                    <td className="py-4 px-4 text-sm text-white">Free</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
