'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToolCard } from '@/components/tools/ToolCard';
import { Tool } from '@/types/tools';

interface ToolsPageClientProps {
    tools: Tool[];
    totalValue: number;
}

interface Category {
    id: string;
    name: string;
    count: number;
    href?: string;
}

export function ToolsPageClient({ tools, totalValue }: ToolsPageClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories: Category[] = [
        { id: 'all', name: 'All Tools', count: 68 },
        { id: 'content', name: 'Content Marketing', count: tools.filter(t => t.category === 'content').length },
        { id: 'seo', name: 'SEO & Analytics', count: tools.filter(t => t.category === 'seo').length },
        { id: 'social', name: 'Social Media', count: tools.filter(t => t.category === 'social').length },
        { id: 'email', name: 'Email Marketing', count: tools.filter(t => t.category === 'email').length },
        { id: 'advertising', name: 'Advertising & ROI', count: tools.filter(t => t.category === 'advertising').length },
        { id: 'calculators', name: 'Calculators', count: 38, href: '/tools/calculators' },
    ];

    const filteredTools = selectedCategory === 'all'
        ? tools
        : tools.filter(t => t.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background">
            <main id="main-content" className="bg-background">
                {/* Enhanced Hero Section */}
                <div className="bg-background text-foreground py-12 md:py-16 lg:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium mb-4 md:mb-6 bg-muted border border-border">
                                <span className="text-lg md:text-2xl">🎉</span>
                                <span>All 70+ Tools Now Available</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-4 md:mb-6 leading-tight px-4">
                                Complete Marketing Toolkit
                                <br />
                                <span className="text-muted-foreground">Worth ${totalValue}/month</span>
                                {' '}— Free Forever
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                                Everything you need to optimize your marketing campaigns across content, SEO, social media, email, and advertising — all in one place.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm mb-6 md:mb-8 px-4">
                                <div className="bg-muted px-3 py-2 md:px-5 md:py-3 rounded-md border border-border flex items-center gap-1.5 md:gap-2">
                                    <span className="text-base md:text-xl">✨</span>
                                    <span className="font-medium">No credit card required</span>
                                </div>
                                <div className="bg-muted px-3 py-2 md:px-5 md:py-3 rounded-md border border-border flex items-center gap-1.5 md:gap-2">
                                    <span className="text-base md:text-xl">⚡</span>
                                    <span className="font-medium">Instant results</span>
                                </div>
                                <div className="bg-muted px-3 py-2 md:px-5 md:py-3 rounded-md border border-border flex items-center gap-1.5 md:gap-2">
                                    <span className="text-base md:text-xl">🔒</span>
                                    <span className="font-medium">Privacy-friendly</span>
                                </div>
                                <div className="bg-muted px-3 py-2 md:px-5 md:py-3 rounded-md border border-border flex items-center gap-1.5 md:gap-2">
                                    <span className="text-base md:text-xl">🎯</span>
                                    <span className="font-medium">100% Free - No Limits</span>
                                </div>
                            </div>

                            {/* Social Proof */}
                            <p className="mt-6 md:mt-8 text-muted-foreground text-xs md:text-sm">
                                ⭐ Trusted by 1,000+ marketers worldwide
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tools Grid */}
                <div id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    {/* Category Filter */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                cat.href ? (
                                    <Link
                                        key={cat.id}
                                        href={cat.href}
                                        className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-md bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 transition-colors text-zinc-900 font-medium dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-700"
                                    >
                                        {cat.name} ({cat.count}) →
                                    </Link>
                                ) : (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-md transition-all duration-300 ${selectedCategory === cat.id
                                            ? 'bg-zinc-900 text-white font-medium shadow-md dark:bg-white dark:text-black'
                                            : 'bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                                            }`}
                                    >
                                        {cat.name} ({cat.count})
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filteredTools.map(tool => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>

                    {/* All Tools Available */}
                    <div className="mt-8 md:mt-12 text-center bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="text-4xl md:text-5xl mb-3 md:mb-4">🎉</div>
                        <h3 className="text-xl md:text-2xl font-medium text-zinc-900 dark:text-white mb-2">
                            All 70+ Tools Now Available!
                        </h3>
                        <p className="text-sm md:text-base text-zinc-500 mb-3 md:mb-4">
                            Complete marketing toolkit worth ${totalValue}/month - completely free
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs md:text-sm">
                            <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-zinc-200 dark:border-zinc-700">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">8</span> <span className="text-zinc-500">Content Tools</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-zinc-200 dark:border-zinc-700">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">7</span> <span className="text-zinc-500">SEO Tools</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-zinc-200 dark:border-zinc-700">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">6</span> <span className="text-zinc-500">Social Tools</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-zinc-200 dark:border-zinc-700">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">4</span> <span className="text-zinc-500">Email Tools</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-zinc-200 dark:border-zinc-700">
                                <span className="font-medium text-zinc-900 dark:text-zinc-100">5</span> <span className="text-zinc-500">Advertising Tools</span>
                            </div>
                            <Link href="/tools/calculators" className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                <span className="font-medium text-zinc-900 dark:text-white">38</span> <span className="text-zinc-600 dark:text-zinc-300">Calculators →</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Why Use These Tools Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mb-3 md:mb-4">
                            Why Use These Tools?
                        </h2>
                        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                            Streamline your marketing workflow with professional-grade tools designed for modern marketers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">Save Time</h3>
                            <p className="text-muted-foreground">
                                Instant calculations and generations - no waiting for results
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">Data-Driven Decisions</h3>
                            <p className="text-muted-foreground">
                                Make informed choices with analytics and insights
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">Optimize All Channels</h3>
                            <p className="text-muted-foreground">
                                Tools for content, SEO, social, email, and advertising
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">No Learning Curve</h3>
                            <p className="text-muted-foreground">
                                Simple, intuitive interfaces - start using immediately
                            </p>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="bg-background py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-foreground mb-3 md:mb-4">
                                How It Works
                            </h2>
                            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
                                Get results in 3 simple steps
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-foreground text-2xl font-medium border border-border">
                                    1
                                </div>
                                <h3 className="text-xl font-medium text-foreground mb-2">Choose Your Tool</h3>
                                <p className="text-muted-foreground">
                                    Browse 70+ tools across 6 categories and select the one you need
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-foreground text-2xl font-medium border border-border">
                                    2
                                </div>
                                <h3 className="text-xl font-medium text-foreground mb-2">Enter Your Data</h3>
                                <p className="text-muted-foreground">
                                    Fill in the simple form with your marketing data or content
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-foreground text-2xl font-medium border border-border">
                                    3
                                </div>
                                <h3 className="text-xl font-medium text-foreground mb-2">Get Instant Results</h3>
                                <p className="text-muted-foreground">
                                    View results immediately and export as PDF, CSV, or JSON
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
