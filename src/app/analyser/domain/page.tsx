'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, Users, Link2, TrendingUp, Search, ArrowUpRight } from 'lucide-react';

interface DomainOverview {
    domain: string;
    organicTraffic: number;
    organicKeywords: number;
    paidTraffic: number;
    paidKeywords: number;
    backlinks: number;
    referringDomains: number;
    domainRank: number;
}

interface DomainKeyword {
    keyword: string;
    position: number;
    searchVolume: number;
    url: string;
    traffic: number;
}

export default function DomainAnalysisPage() {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [overview, setOverview] = useState<DomainOverview | null>(null);
    const [keywords, setKeywords] = useState<DomainKeyword[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'keywords'>('overview');

    async function analyzeDomain() {
        if (!domain.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // Get overview
            const overviewRes = await fetch('/api/analyser/domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain, action: 'overview' }),
            });
            const overviewData = await overviewRes.json();

            if (!overviewData.success) {
                setError(overviewData.error || 'Failed to analyze domain');
                return;
            }
            setOverview(overviewData.overview);

            // Get keywords
            const keywordsRes = await fetch('/api/analyser/domain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain, action: 'keywords', limit: 50 }),
            });
            const keywordsData = await keywordsRes.json();
            if (keywordsData.success) {
                setKeywords(keywordsData.keywords || []);
            }
        } catch (err) {
            setError('Failed to analyze domain');
        } finally {
            setLoading(false);
        }
    }

    function formatNumber(num: number): string {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Globe className="h-8 w-8 text-purple-500" />
                    Domain Intelligence
                </h1>
                <p className="text-muted-foreground mt-1">
                    Analyze any domain's traffic, keywords, and backlinks (10 credits per analysis)
                </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Enter Domain</CardTitle>
                    <CardDescription>
                        Get traffic estimates, ranking keywords, and competitive intelligence
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="e.g., example.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && analyzeDomain()}
                        />
                        <Button onClick={analyzeDomain} disabled={loading || !domain.trim()}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Analyze Domain
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Error */}
            {error && (
                <Card className="mb-8 border-red-500/50">
                    <CardContent className="py-4">
                        <p className="text-red-500">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Results */}
            {overview && (
                <div className="space-y-6">
                    {/* Domain Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">{overview.domain}</CardTitle>
                                <Badge variant="outline" className="text-lg px-4 py-1">
                                    Rank #{overview.domainRank || 'N/A'}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="py-4 text-center">
                                <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                                <p className="text-2xl font-bold">{formatNumber(overview.organicTraffic)}</p>
                                <p className="text-sm text-muted-foreground">Monthly Traffic</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-4 text-center">
                                <Search className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                                <p className="text-2xl font-bold">{formatNumber(overview.organicKeywords)}</p>
                                <p className="text-sm text-muted-foreground">Organic Keywords</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-4 text-center">
                                <Link2 className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                                <p className="text-2xl font-bold">{formatNumber(overview.backlinks)}</p>
                                <p className="text-sm text-muted-foreground">Backlinks</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-4 text-center">
                                <Users className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                                <p className="text-2xl font-bold">{formatNumber(overview.referringDomains)}</p>
                                <p className="text-sm text-muted-foreground">Referring Domains</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <Button
                            variant={activeTab === 'overview' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </Button>
                        <Button
                            variant={activeTab === 'keywords' ? 'default' : 'outline'}
                            onClick={() => setActiveTab('keywords')}
                        >
                            Top Keywords ({keywords.length})
                        </Button>
                    </div>

                    {/* Keywords Table */}
                    {activeTab === 'keywords' && keywords.length > 0 && (
                        <Card>
                            <CardContent className="py-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-medium">#</th>
                                                <th className="text-left py-3 px-4 font-medium">Keyword</th>
                                                <th className="text-right py-3 px-4 font-medium">Position</th>
                                                <th className="text-right py-3 px-4 font-medium">Volume</th>
                                                <th className="text-right py-3 px-4 font-medium">Traffic</th>
                                                <th className="text-left py-3 px-4 font-medium">URL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {keywords.map((kw, i) => (
                                                <tr key={i} className="border-b hover:bg-muted/50">
                                                    <td className="py-3 px-4 text-muted-foreground">{i + 1}</td>
                                                    <td className="py-3 px-4 font-medium">{kw.keyword}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <Badge variant={kw.position <= 3 ? 'default' : 'outline'}>
                                                            #{kw.position}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">{formatNumber(kw.searchVolume)}</td>
                                                    <td className="py-3 px-4 text-right text-green-600">{formatNumber(kw.traffic)}</td>
                                                    <td className="py-3 px-4">
                                                        <a
                                                            href={kw.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                                                        >
                                                            {new URL(kw.url).pathname}
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Overview Info */}
                    {activeTab === 'overview' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Organic Traffic</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Monthly Traffic</span>
                                            <span className="font-medium">{formatNumber(overview.organicTraffic)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Ranking Keywords</span>
                                            <span className="font-medium">{formatNumber(overview.organicKeywords)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Paid Traffic</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Paid Traffic</span>
                                            <span className="font-medium">{formatNumber(overview.paidTraffic)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Paid Keywords</span>
                                            <span className="font-medium">{formatNumber(overview.paidKeywords)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
