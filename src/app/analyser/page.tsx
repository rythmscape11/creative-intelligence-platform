'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Globe,
    Link2,
    TrendingUp,
    Sparkles,
    BarChart3,
    Coins,
    ArrowRight,
    Zap,
    Target,
    FileSearch
} from 'lucide-react';

interface CreditBalance {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
}

interface UsageSummary {
    totalOperations: number;
    totalCreditsUsed: number;
}

export default function AnalyserDashboard() {
    const [credits, setCredits] = useState<CreditBalance | null>(null);
    const [usage, setUsage] = useState<UsageSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [creditsRes, usageRes] = await Promise.all([
                    fetch('/api/analyser/credits'),
                    fetch('/api/analyser/usage?period=30d'),
                ]);

                const creditsData = await creditsRes.json();
                const usageData = await usageRes.json();

                if (creditsData.success) setCredits(creditsData.credits);
                if (usageData.success) setUsage(usageData.summary);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const tools = [
        {
            id: 'keywords',
            title: 'Keyword Research',
            description: 'Search volume, CPC, competition for any keyword',
            icon: Search,
            href: '/analyser/keywords',
            credits: '1 credit/keyword',
            color: 'bg-blue-500/10 text-blue-600',
            features: ['Search Volume', 'CPC Data', 'Competition Index', 'Trend Data'],
        },
        {
            id: 'serp',
            title: 'SERP Analysis',
            description: 'Full organic & paid results for any search query',
            icon: FileSearch,
            href: '/analyser/serp',
            credits: '5 credits',
            color: 'bg-green-500/10 text-green-600',
            features: ['Top 100 Results', 'Featured Snippets', 'People Also Ask', 'Paid Ads'],
        },
        {
            id: 'domain',
            title: 'Domain Intelligence',
            description: 'Traffic estimates, top keywords, competitor analysis',
            icon: Globe,
            href: '/analyser/domain',
            credits: '10 credits',
            color: 'bg-purple-500/10 text-purple-600',
            features: ['Traffic Estimates', 'Ranking Keywords', 'Domain Authority', 'Competitors'],
        },
        {
            id: 'backlinks',
            title: 'Backlink Analysis',
            description: 'Full backlink profile with referring domains',
            icon: Link2,
            href: '/analyser/backlinks',
            credits: '15 credits',
            color: 'bg-orange-500/10 text-orange-600',
            features: ['All Backlinks', 'Referring Domains', 'Anchor Text', 'Link Quality'],
        },
        {
            id: 'geo',
            title: 'GEO Lab',
            description: 'AI search visibility scoring for ChatGPT, Gemini, Perplexity',
            icon: Sparkles,
            href: '/analyser/geo',
            credits: '25 credits',
            color: 'bg-pink-500/10 text-pink-600',
            features: ['GEO Score', 'Q&A Gaps', 'Schema Suggestions', 'AI Recommendations'],
            badge: 'NEW',
        },
        {
            id: 'onpage',
            title: 'On-Page SEO',
            description: 'Technical SEO audit with Core Web Vitals',
            icon: Target,
            href: '/analyser/onpage',
            credits: '20 credits',
            color: 'bg-cyan-500/10 text-cyan-600',
            features: ['Core Web Vitals', 'Performance Score', 'SEO Score', 'Opportunities'],
        },
        {
            id: 'content-gap',
            title: 'Content Gap Finder',
            description: 'Find keywords competitors rank for that you miss',
            icon: Zap,
            href: '/analyser/content-gap',
            credits: '20 credits',
            color: 'bg-amber-500/10 text-amber-600',
            features: ['Competitor Compare', 'Keyword Gaps', 'Opportunity Score', 'Volume Data'],
            badge: 'NEW',
        },
    ];

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-indigo-500" />
                    The Analyser
                </h1>
                <p className="text-muted-foreground mt-1">
                    Complete SEO intelligence powered by DataForSEO + AI
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Credit Balance</p>
                                <p className="text-3xl font-bold">{loading ? '...' : credits?.balance || 0}</p>
                            </div>
                            <Coins className="h-8 w-8 text-yellow-500" />
                        </div>
                        <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                            <Link href="/analyser/credits">Buy Credits</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Operations (30d)</p>
                                <p className="text-3xl font-bold">{loading ? '...' : usage?.totalOperations || 0}</p>
                            </div>
                            <Zap className="h-8 w-8 text-purple-500" />
                        </div>
                        <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                            <Link href="/analyser/usage">View Usage</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Credits Used (30d)</p>
                                <p className="text-3xl font-bold">{loading ? '...' : usage?.totalCreditsUsed || 0}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                        <Button size="sm" variant="outline" className="mt-2 w-full" asChild>
                            <Link href="/analyser/settings">Settings</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <Card key={tool.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-lg ${tool.color}`}>
                                    <tool.icon className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    {tool.badge && (
                                        <Badge variant="secondary" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                                            {tool.badge}
                                        </Badge>
                                    )}
                                    <Badge variant="outline">{tool.credits}</Badge>
                                </div>
                            </div>
                            <CardTitle className="mt-4">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-1 mb-4">
                                {tool.features.map((feature, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full" asChild>
                                <Link href={tool.href}>
                                    Open Tool <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/analyser/keywords">
                                <Search className="mr-2 h-4 w-4" />
                                Research Keywords
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/analyser/domain">
                                <Globe className="mr-2 h-4 w-4" />
                                Analyze Domain
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/analyser/geo">
                                <Sparkles className="mr-2 h-4 w-4" />
                                GEO Analysis
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/analyser/serp">
                                <FileSearch className="mr-2 h-4 w-4" />
                                Check SERP
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
