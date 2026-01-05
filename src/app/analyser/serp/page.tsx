'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileSearch, ExternalLink, Award, MessageSquare, Search } from 'lucide-react';

interface SerpResult {
    type: string;
    position: number;
    title: string;
    url: string;
    domain: string;
    description?: string;
}

interface SerpAnalysis {
    keyword: string;
    totalResults: number;
    organicResults: SerpResult[];
    paidResults: SerpResult[];
    featuredSnippet?: SerpResult;
    peopleAlsoAsk: string[];
    relatedSearches: string[];
}

export default function SerpAnalysisPage() {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SerpAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function analyzeSERP() {
        if (!keyword.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/analyser/serp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || 'Failed to analyze SERP');
                return;
            }

            setResult(data.serp);
        } catch (err) {
            setError('Failed to analyze SERP');
        } finally {
            setLoading(false);
        }
    }

    function formatNumber(num: number): string {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileSearch className="h-8 w-8 text-green-500" />
                    SERP Analysis
                </h1>
                <p className="text-muted-foreground mt-1">
                    Analyze search engine results page for any keyword (5 credits)
                </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Enter Keyword</CardTitle>
                    <CardDescription>
                        Get full SERP data including organic results, paid ads, featured snippets, and People Also Ask
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Enter a keyword to analyze"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && analyzeSERP()}
                        />
                        <Button onClick={analyzeSERP} disabled={loading || !keyword.trim()}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Analyze SERP
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
                    {/* Overview */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>SERP for "{result.keyword}"</CardTitle>
                                <Badge variant="outline">{formatNumber(result.totalResults)} results</Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Featured Snippet */}
                    {result.featuredSnippet && (
                        <Card className="border-yellow-500/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-600">
                                    <Award className="h-5 w-5" />
                                    Featured Snippet
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <h3 className="font-medium text-lg">{result.featuredSnippet.title}</h3>
                                <p className="text-muted-foreground mt-1">{result.featuredSnippet.description}</p>
                                <a
                                    href={result.featuredSnippet.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline flex items-center gap-1 mt-2"
                                >
                                    {result.featuredSnippet.domain}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paid Results */}
                    {result.paidResults.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-700">Ads</Badge>
                                    Paid Results ({result.paidResults.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {result.paidResults.slice(0, 5).map((r, i) => (
                                        <div key={i} className="border-l-2 border-green-500 pl-4">
                                            <a
                                                href={r.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                {r.title}
                                            </a>
                                            <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                                            <p className="text-xs text-green-600 mt-1">{r.domain}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Organic Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Organic Results ({result.organicResults.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {result.organicResults.map((r, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                                            {r.position}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <a
                                                href={r.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline font-medium line-clamp-1"
                                            >
                                                {r.title}
                                            </a>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                                            <p className="text-xs text-green-600 mt-1">{r.domain}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* People Also Ask */}
                    {result.peopleAlsoAsk.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    People Also Ask
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {result.peopleAlsoAsk.map((q, i) => (
                                        <li key={i} className="p-3 bg-muted/50 rounded-lg">{q}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Related Searches */}
                    {result.relatedSearches.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Related Searches</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {result.relatedSearches.map((s, i) => (
                                        <Badge key={i} variant="secondary" className="px-3 py-1">{s}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}
