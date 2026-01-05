'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface KeywordGap {
    keyword: string;
    yourPosition: number | null;
    competitorPosition: number;
    volume: number;
    difficulty: string;
    opportunity: 'high' | 'medium' | 'low';
}

interface GapAnalysis {
    yourDomain: string;
    competitorDomain: string;
    totalGaps: number;
    highOpportunity: number;
    commonKeywords: number;
    gaps: KeywordGap[];
}

export default function ContentGapPage() {
    const [yourDomain, setYourDomain] = useState('');
    const [competitorDomain, setCompetitorDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GapAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function analyzeGaps() {
        if (!yourDomain.trim() || !competitorDomain.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // Use domain comparison via DataForSEO
            const [yourRes, compRes] = await Promise.all([
                fetch('/api/analyser/domain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain: yourDomain, action: 'keywords', limit: 100 }),
                }),
                fetch('/api/analyser/domain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ domain: competitorDomain, action: 'keywords', limit: 100 }),
                }),
            ]);

            const yourData = await yourRes.json();
            const compData = await compRes.json();

            if (!yourData.success || !compData.success) {
                setError(yourData.error || compData.error || 'Failed to analyze domains');
                return;
            }

            // Find gaps - keywords competitor ranks for but you don't
            const yourKeywords = new Set((yourData.keywords || []).map((k: any) => k.keyword.toLowerCase()));
            const gaps: KeywordGap[] = [];

            for (const kw of (compData.keywords || [])) {
                const isGap = !yourKeywords.has(kw.keyword.toLowerCase());
                if (isGap || kw.position < 10) {
                    gaps.push({
                        keyword: kw.keyword,
                        yourPosition: yourKeywords.has(kw.keyword.toLowerCase())
                            ? (yourData.keywords || []).find((k: any) => k.keyword.toLowerCase() === kw.keyword.toLowerCase())?.position || null
                            : null,
                        competitorPosition: kw.position,
                        volume: kw.searchVolume,
                        difficulty: kw.position <= 3 ? 'high' : kw.position <= 10 ? 'medium' : 'low',
                        opportunity: !yourKeywords.has(kw.keyword.toLowerCase()) && kw.searchVolume > 1000 ? 'high'
                            : !yourKeywords.has(kw.keyword.toLowerCase()) ? 'medium' : 'low',
                    });
                }
            }

            // Sort by opportunity
            gaps.sort((a, b) => {
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.opportunity] - order[b.opportunity] || b.volume - a.volume;
            });

            setResult({
                yourDomain: yourDomain.replace(/^https?:\/\//, '').replace(/^www\./, ''),
                competitorDomain: competitorDomain.replace(/^https?:\/\//, '').replace(/^www\./, ''),
                totalGaps: gaps.filter(g => g.yourPosition === null).length,
                highOpportunity: gaps.filter(g => g.opportunity === 'high').length,
                commonKeywords: gaps.filter(g => g.yourPosition !== null).length,
                gaps: gaps.slice(0, 50),
            });
        } catch (err) {
            setError('Failed to analyze content gaps');
        } finally {
            setLoading(false);
        }
    }

    function getOpportunityColor(opp: string) {
        switch (opp) {
            case 'high': return 'bg-green-100 text-green-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lightbulb className="h-8 w-8 text-amber-500" />
                    Content Gap Finder
                </h1>
                <p className="text-muted-foreground mt-1">
                    Find keywords your competitors rank for that you're missing (20 credits)
                </p>
            </div>

            {/* Input Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Compare Domains</CardTitle>
                    <CardDescription>
                        Enter your domain and a competitor to find content opportunities
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Your Domain</label>
                            <Input
                                placeholder="yourdomain.com"
                                value={yourDomain}
                                onChange={(e) => setYourDomain(e.target.value)}
                            />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Competitor Domain</label>
                            <Input
                                placeholder="competitor.com"
                                value={competitorDomain}
                                onChange={(e) => setCompetitorDomain(e.target.value)}
                            />
                        </div>
                        <Button onClick={analyzeGaps} disabled={loading || !yourDomain.trim() || !competitorDomain.trim()}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Find Gaps
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
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="py-6 text-center">
                                <p className="text-4xl font-bold text-amber-500">{result.totalGaps}</p>
                                <p className="text-sm text-muted-foreground">Content Gaps</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-6 text-center">
                                <p className="text-4xl font-bold text-green-500">{result.highOpportunity}</p>
                                <p className="text-sm text-muted-foreground">High Opportunity</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="py-6 text-center">
                                <p className="text-4xl font-bold text-blue-500">{result.commonKeywords}</p>
                                <p className="text-sm text-muted-foreground">Common Keywords</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gap Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Keyword Opportunities</CardTitle>
                            <CardDescription>
                                Keywords {result.competitorDomain} ranks for
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 font-medium">Keyword</th>
                                            <th className="text-center py-3 px-4 font-medium">Your Position</th>
                                            <th className="text-center py-3 px-4 font-medium">Competitor</th>
                                            <th className="text-right py-3 px-4 font-medium">Volume</th>
                                            <th className="text-center py-3 px-4 font-medium">Opportunity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.gaps.map((gap, i) => (
                                            <tr key={i} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">{gap.keyword}</td>
                                                <td className="py-3 px-4 text-center">
                                                    {gap.yourPosition ? (
                                                        <Badge variant="outline">#{gap.yourPosition}</Badge>
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <Badge variant="secondary">#{gap.competitorPosition}</Badge>
                                                </td>
                                                <td className="py-3 px-4 text-right">{gap.volume.toLocaleString()}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <Badge className={getOpportunityColor(gap.opportunity)}>
                                                        {gap.opportunity}
                                                    </Badge>
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
