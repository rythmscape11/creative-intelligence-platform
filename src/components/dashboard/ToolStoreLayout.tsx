'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    Squares2X2Icon,
    ListBulletIcon,
    StarIcon,
    ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export interface Tool {
    id: string;
    name: string;
    description: string;
    category: 'advertising' | 'content' | 'seo' | 'social' | 'email' | 'calculators';
    icon: string;
    url: string;
    isPremium: boolean;
    isNew: boolean;
    rating: number;
    usageCount: number;
    tags: string[];
}

const CATEGORY_LABELS: Record<string, { label: string; color: string; bgColor: string }> = {
    advertising: { label: 'Advertising', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
    content: { label: 'Content', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    seo: { label: 'SEO', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    social: { label: 'Social', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
    email: { label: 'Email', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
    calculators: { label: 'Calculators', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
};

// Sample tools data
const TOOLS_DATA: Tool[] = [
    { id: 'roi-calc', name: 'ROI Calculator', description: 'Calculate marketing return on investment', category: 'advertising', icon: '📊', url: '/tools/advertising/roi-calculator-enhanced', isPremium: false, isNew: false, rating: 4.8, usageCount: 15420, tags: ['roi', 'metrics', 'analytics'] },
    { id: 'budget-alloc', name: 'Budget Allocator', description: 'Optimize your marketing budget distribution', category: 'advertising', icon: '💰', url: '/tools/advertising/budget-allocator-enhanced', isPremium: false, isNew: false, rating: 4.7, usageCount: 12350, tags: ['budget', 'planning', 'allocation'] },
    { id: 'ad-copy', name: 'Ad Copy Generator', description: 'Generate compelling ad copy with AI', category: 'advertising', icon: '✍️', url: '/tools/advertising/ad-copy-generator-enhanced', isPremium: true, isNew: false, rating: 4.9, usageCount: 28900, tags: ['ai', 'copywriting', 'ads'] },
    { id: 'cpc-cpm', name: 'CPC/CPM Calculator', description: 'Calculate cost per click and impressions', category: 'advertising', icon: '🧮', url: '/tools/advertising/cpc-cpm-calculator-enhanced', isPremium: false, isNew: false, rating: 4.6, usageCount: 9800, tags: ['cpc', 'cpm', 'advertising'] },
    { id: 'headline', name: 'Headline Analyzer', description: 'Score and improve your headlines', category: 'content', icon: '📝', url: '/tools/content/headline-analyzer-enhanced', isPremium: false, isNew: false, rating: 4.8, usageCount: 21500, tags: ['headlines', 'copywriting', 'content'] },
    { id: 'blog-outline', name: 'Blog Outline Generator', description: 'Create structured blog post outlines', category: 'content', icon: '📋', url: '/tools/content/blog-outline-generator-enhanced', isPremium: true, isNew: true, rating: 4.7, usageCount: 8700, tags: ['blog', 'content', 'outline'] },
    { id: 'content-cal', name: 'Content Calendar', description: 'Plan your content publishing schedule', category: 'content', icon: '📅', url: '/tools/content/content-calendar-generator-enhanced', isPremium: true, isNew: false, rating: 4.6, usageCount: 7200, tags: ['calendar', 'planning', 'content'] },
    { id: 'keyword', name: 'Keyword Research', description: 'Find high-value keywords for your content', category: 'seo', icon: '🔑', url: '/tools/seo/keyword-research-enhanced', isPremium: true, isNew: false, rating: 4.9, usageCount: 32100, tags: ['keywords', 'seo', 'research'] },
    { id: 'schema', name: 'Schema Generator', description: 'Generate structured data markup', category: 'seo', icon: '🏷️', url: '/tools/seo/schema-generator-enhanced', isPremium: false, isNew: false, rating: 4.5, usageCount: 5600, tags: ['schema', 'structured-data', 'seo'] },
    { id: 'serp', name: 'SERP Preview', description: 'Preview how your page appears in search', category: 'seo', icon: '👁️', url: '/tools/seo/serp-preview-enhanced', isPremium: false, isNew: false, rating: 4.7, usageCount: 11200, tags: ['serp', 'preview', 'seo'] },
    { id: 'hashtag', name: 'Hashtag Generator', description: 'Generate relevant hashtags for social posts', category: 'social', icon: '#️⃣', url: '/tools/social/hashtag-generator-enhanced', isPremium: false, isNew: false, rating: 4.6, usageCount: 19800, tags: ['hashtags', 'social', 'instagram'] },
    { id: 'engagement', name: 'Engagement Calculator', description: 'Calculate social media engagement rates', category: 'social', icon: '❤️', url: '/tools/social/engagement-calculator-enhanced', isPremium: false, isNew: false, rating: 4.5, usageCount: 8900, tags: ['engagement', 'metrics', 'social'] },
    { id: 'utm', name: 'UTM Builder', description: 'Create UTM tracking parameters', category: 'social', icon: '🔗', url: '/tools/social/utm-builder-enhanced', isPremium: false, isNew: false, rating: 4.8, usageCount: 14500, tags: ['utm', 'tracking', 'analytics'] },
    { id: 'email-prev', name: 'Email Preview', description: 'Preview emails across different clients', category: 'email', icon: '📧', url: '/tools/email/email-preview-enhanced', isPremium: true, isNew: false, rating: 4.7, usageCount: 6800, tags: ['email', 'preview', 'testing'] },
    { id: 'spam', name: 'Spam Score Checker', description: 'Check if your email will land in spam', category: 'email', icon: '🛡️', url: '/tools/email/spam-score-checker-enhanced', isPremium: false, isNew: true, rating: 4.6, usageCount: 4200, tags: ['spam', 'email', 'deliverability'] },
    { id: 'signature', name: 'Signature Generator', description: 'Create professional email signatures', category: 'email', icon: '✒️', url: '/tools/email/signature-generator-enhanced', isPremium: false, isNew: false, rating: 4.4, usageCount: 7100, tags: ['signature', 'email', 'professional'] },
];

interface ToolStoreLayoutProps {
    tools?: Tool[];
    className?: string;
}

export function ToolStoreLayout({ tools = TOOLS_DATA, className = '' }: ToolStoreLayoutProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'new'>('popular');
    const [showPremiumOnly, setShowPremiumOnly] = useState(false);

    const categories = useMemo(() => {
        const cats = [...new Set(tools.map(t => t.category))];
        return cats.map(cat => ({
            id: cat,
            ...CATEGORY_LABELS[cat],
            count: tools.filter(t => t.category === cat).length
        }));
    }, [tools]);

    const filteredTools = useMemo(() => {
        let result = [...tools];

        // Filter by search
        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(t =>
                t.name.toLowerCase().includes(lower) ||
                t.description.toLowerCase().includes(lower) ||
                t.tags.some(tag => tag.toLowerCase().includes(lower))
            );
        }

        // Filter by category
        if (selectedCategory) {
            result = result.filter(t => t.category === selectedCategory);
        }

        // Filter premium only
        if (showPremiumOnly) {
            result = result.filter(t => t.isPremium);
        }

        // Sort
        switch (sortBy) {
            case 'popular':
                result.sort((a, b) => b.usageCount - a.usageCount);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'new':
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
        }

        return result;
    }, [tools, search, selectedCategory, sortBy, showPremiumOnly]);

    return (
        <div className={className}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Tool Store</h2>
                    <p className="text-text-secondary">50+ marketing tools at your fingertips</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search tools..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === null
                            ? 'bg-accent-primary text-white'
                            : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
                        }`}
                >
                    All ({tools.length})
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id
                                ? `${cat.bgColor} ${cat.color}`
                                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
                            }`}
                    >
                        {cat.label} ({cat.count})
                    </button>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border-primary">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="h-4 w-4 text-text-tertiary" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-bg-tertiary border border-border-primary rounded px-3 py-1.5 text-sm text-text-primary focus:outline-none"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="rating">Highest Rated</option>
                            <option value="new">Newest First</option>
                        </select>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showPremiumOnly}
                            onChange={(e) => setShowPremiumOnly(e.target.checked)}
                            className="rounded border-border-primary"
                        />
                        Premium Only
                    </label>
                </div>

                <div className="flex items-center gap-1 bg-bg-tertiary rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-bg-secondary text-text-primary' : 'text-text-tertiary'}`}
                    >
                        <Squares2X2Icon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-bg-secondary text-text-primary' : 'text-text-tertiary'}`}
                    >
                        <ListBulletIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="mb-4 text-sm text-text-secondary">
                Showing {filteredTools.length} of {tools.length} tools
            </div>

            {/* Tools Grid/List */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredTools.map(tool => (
                        <Link
                            key={tool.id}
                            href={tool.url}
                            className="group bg-bg-secondary border border-border-primary rounded-xl p-4 hover:border-accent-primary hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <span className="text-3xl">{tool.icon}</span>
                                <div className="flex items-center gap-1">
                                    {tool.isNew && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                            New
                                        </span>
                                    )}
                                    {tool.isPremium && (
                                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                                            Pro
                                        </span>
                                    )}
                                </div>
                            </div>
                            <h3 className="font-semibold text-text-primary group-hover:text-accent-highlight transition-colors">
                                {tool.name}
                            </h3>
                            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                                {tool.description}
                            </p>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-primary">
                                <div className="flex items-center gap-1">
                                    <StarIconSolid className="h-4 w-4 text-amber-400" />
                                    <span className="text-sm text-text-primary">{tool.rating}</span>
                                </div>
                                <div className="flex items-center gap-1 text-text-tertiary">
                                    <ArrowTrendingUpIcon className="h-4 w-4" />
                                    <span className="text-xs">{(tool.usageCount / 1000).toFixed(1)}k uses</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredTools.map(tool => (
                        <Link
                            key={tool.id}
                            href={tool.url}
                            className="group flex items-center gap-4 bg-bg-secondary border border-border-primary rounded-lg p-4 hover:border-accent-primary transition-all"
                        >
                            <span className="text-2xl">{tool.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-text-primary group-hover:text-accent-highlight transition-colors">
                                        {tool.name}
                                    </h3>
                                    {tool.isNew && (
                                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                            New
                                        </span>
                                    )}
                                    {tool.isPremium && (
                                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                                            Pro
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-secondary truncate">{tool.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <StarIconSolid className="h-4 w-4 text-amber-400" />
                                    <span className="text-text-primary">{tool.rating}</span>
                                </div>
                                <span className={`px-2 py-1 rounded ${CATEGORY_LABELS[tool.category].bgColor} ${CATEGORY_LABELS[tool.category].color} text-xs`}>
                                    {CATEGORY_LABELS[tool.category].label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {filteredTools.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-text-secondary">No tools found matching your criteria</p>
                    <button
                        onClick={() => { setSearch(''); setSelectedCategory(null); setShowPremiumOnly(false); }}
                        className="mt-2 text-accent-primary hover:text-accent-highlight"
                    >
                        Clear filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default ToolStoreLayout;
