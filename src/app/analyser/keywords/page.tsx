'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, TrendingUp, TrendingDown, Minus, DollarSign, BarChart2 } from 'lucide-react';

interface KeywordData {
    keyword: string;
    searchVolume: number;
    cpc: number;
    competition: number;
    competitionLevel: string;
    monthlySearches: { year: number; month: number; volume: number }[];
}

export default function KeywordResearchPage() {
    const [keywords, setKeywords] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<KeywordData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [creditsUsed, setCreditsUsed] = useState(0);

    async function searchKeywords() {
        if (!keywords.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const keywordList = keywords.split('\n').map(k => k.trim()).filter(k => k.length > 0);

            const res = await fetch('/api/analyser/keywords/dataforseo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keywords: keywordList }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || 'Failed to fetch keywords');
                return;
            }

            setResults(data.keywords || []);
            setCreditsUsed(data.creditsUsed || keywordList.length);
        } catch (err) {
            setError('Failed to fetch keyword data');
        } finally {
            setLoading(false);
        }
    }

    function formatNumber(num: number): string {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    function getCompetitionColor(level: string): string {
        switch (level?.toLowerCase()) {
            case 'low': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'high': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    function getTrendIcon(data: KeywordData) {
        if (!data.monthlySearches || data.monthlySearches.length < 2) {
            return <Minus className="h-4 w-4 text-gray-400" />;
        }
        const recent = data.monthlySearches[data.monthlySearches.length - 1]?.volume || 0;
        const older = data.monthlySearches[0]?.volume || 0;
        if (recent > older * 1.1) return <TrendingUp className="h-4 w-4 text-green-500" />;
        if (recent < older * 0.9) return <TrendingDown className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4 text-gray-400" />;
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Search className="h-8 w-8 text-blue-500" />
                    Keyword Research
                </h1>
                <p className="text-muted-foreground mt-1">
                    Get search volume, CPC, and competition data powered by DataForSEO
                </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Enter Keywords</CardTitle>
                    <CardDescription>
                        One keyword per line. Maximum 100 keywords per request. Costs 1 credit per keyword.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <textarea
                            placeholder="Enter keywords (one per line)&#10;e.g.&#10;seo tools&#10;digital marketing&#10;content strategy"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {keywords.split('\n').filter(k => k.trim()).length} keywords = {keywords.split('\n').filter(k => k.trim()).length} credits
                            </span>
                            <Button onClick={searchKeywords} disabled={loading || !keywords.trim()}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Search Keywords
                                    </>
                                )}
                            </Button>
                        </div>
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
            {results.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Results ({results.length} keywords)</CardTitle>
                            <Badge variant="outline">{creditsUsed} credits used</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium">Keyword</th>
                                        <th className="text-right py-3 px-4 font-medium">Volume</th>
                                        <th className="text-right py-3 px-4 font-medium">CPC</th>
                                        <th className="text-center py-3 px-4 font-medium">Competition</th>
                                        <th className="text-center py-3 px-4 font-medium">Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((kw, i) => (
                                        <tr key={i} className="border-b hover:bg-muted/50">
                                            <td className="py-3 px-4 font-medium">{kw.keyword}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                                    {formatNumber(kw.searchVolume)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <DollarSign className="h-4 w-4 text-green-500" />
                                                    {kw.cpc?.toFixed(2) || '0.00'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <Badge className={getCompetitionColor(kw.competitionLevel)}>
                                                    {kw.competitionLevel || 'Unknown'}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {getTrendIcon(kw)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
