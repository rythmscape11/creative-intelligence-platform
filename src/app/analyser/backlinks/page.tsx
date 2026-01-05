'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link2, ExternalLink, CheckCircle, XCircle, Globe, Search } from 'lucide-react';

interface Backlink {
    sourceUrl: string;
    sourceDomain: string;
    targetUrl: string;
    anchorText: string;
    domainRank: number;
    pageRank: number;
    isDofollow: boolean;
    firstSeen: string;
    lastSeen: string;
}

interface BacklinkSummary {
    domain: string;
    totalBacklinks: number;
    referringDomains: number;
    referringIps: number;
    dofollowBacklinks: number;
    nofollowBacklinks: number;
    domainRank: number;
    topBacklinks: Backlink[];
}

export default function BacklinksPage() {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<BacklinkSummary | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function analyzeBacklinks() {
        if (!domain.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/analyser/backlinks/dataforseo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain, limit: 50 }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || 'Failed to analyze backlinks');
                return;
            }

            setResult(data.backlinks);
        } catch (err) {
            setError('Failed to analyze backlinks');
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
                    <Link2 className="h-8 w-8 text-orange-500" />
                    Backlink Analysis
                </h1>
                <p className="text-muted-foreground mt-1">
                    Full backlink profile with referring domains (15 credits)
                </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Enter Domain</CardTitle>
                    <CardDescription>
                        Get complete backlink profile with all referring domains and link quality metrics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="e.g., example.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && analyzeBacklinks()}
                        />
                        <Button onClick={analyzeBacklinks} disabled={loading || !domain.trim()}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Analyze Backlinks
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
            {result && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="py-4 text-center">
                                <p className="text-3xl font-bold">{formatNumber(result.totalBacklinks)}</p>
                                <p className="text-sm text-muted-foreground">Total Backlinks</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-4 text-center">
                                <p className="text-3xl font-bold">{formatNumber(result.referringDomains)}</p>
                                <p className="text-sm text-muted-foreground">Referring Domains</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-4 text-center">
                                <p className="text-3xl font-bold text-green-600">{formatNumber(result.dofollowBacklinks)}</p>
                                <p className="text-sm text-muted-foreground">Dofollow Links</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-4 text-center">
                                <p className="text-3xl font-bold">{result.domainRank || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">Domain Rank</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Backlinks Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Backlinks ({result.topBacklinks.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium">Source</th>
                                            <th className="text-left py-3 px-4 font-medium">Anchor Text</th>
                                            <th className="text-center py-3 px-4 font-medium">DR</th>
                                            <th className="text-center py-3 px-4 font-medium">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.topBacklinks.map((bl, i) => (
                                            <tr key={i} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <a
                                                                href={bl.sourceUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 hover:underline flex items-center gap-1"
                                                            >
                                                                {bl.sourceDomain}
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                                {bl.sourceUrl}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="bg-muted px-2 py-1 rounded text-sm">
                                                        {bl.anchorText || '[no anchor]'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <Badge variant="outline">{bl.domainRank}</Badge>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {bl.isDofollow ? (
                                                        <Badge className="bg-green-100 text-green-700">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            dofollow
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-700">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            nofollow
                                                        </Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
