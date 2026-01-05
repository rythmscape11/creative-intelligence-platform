'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Sparkles, AlertCircle, CheckCircle2, XCircle, TrendingUp, FileText, Code, Lightbulb } from 'lucide-react';

interface GeoScore {
    contentClarity: number;
    qaCoverage: number;
    entityRichness: number;
    schemaPresence: number;
    freshness: number;
    authority: number;
}

interface GeoResult {
    success: boolean;
    analysisId?: string;
    geoScore: number;
    interpretation: { label: string; color: string; description: string };
    scores: GeoScore;
    contentSummary: string;
    entities: { brands: string[]; topics: string[]; locations: string[]; people: string[] };
    qaClustersCovered: string[];
    qaClustersGaps: string[];
    structuralIssues: string[];
    schemaSuggestions: string[];
    recommendations: string[];
    improvedOutline?: string;
    error?: string;
}

interface CreditBalance {
    balance: number;
    totalPurchased: number;
    totalUsed: number;
}

export default function GeoLabPage() {
    const [url, setUrl] = useState('');
    const [targetTopic, setTargetTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeoResult | null>(null);
    const [credits, setCredits] = useState<CreditBalance | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    // Fetch credits on load
    useEffect(() => {
        fetchCredits();
        fetchHistory();
    }, []);

    async function fetchCredits() {
        try {
            const res = await fetch('/api/analyser/credits');
            const data = await res.json();
            if (data.success) {
                setCredits(data.credits);
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        }
    }

    async function fetchHistory() {
        try {
            const res = await fetch('/api/analyser/geo?limit=5');
            const data = await res.json();
            if (data.success) {
                setHistory(data.analyses);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        }
    }

    async function runAnalysis() {
        if (!url) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/analyser/geo/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, targetTopic: targetTopic || undefined }),
            });

            const data = await res.json();
            setResult(data);

            // Refresh credits and history
            fetchCredits();
            fetchHistory();
        } catch (error) {
            setResult({
                success: false,
                geoScore: 0,
                interpretation: { label: 'Error', color: 'red', description: 'Analysis failed' },
                scores: { contentClarity: 0, qaCoverage: 0, entityRichness: 0, schemaPresence: 0, freshness: 0, authority: 0 },
                contentSummary: '',
                entities: { brands: [], topics: [], locations: [], people: [] },
                qaClustersCovered: [],
                qaClustersGaps: [],
                structuralIssues: [],
                schemaSuggestions: [],
                recommendations: [],
                error: 'Failed to analyze URL',
            });
        } finally {
            setLoading(false);
        }
    }

    function getScoreColor(score: number) {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-red-500';
    }

    function getScoreBg(score: number) {
        if (score >= 80) return 'bg-green-500/10';
        if (score >= 60) return 'bg-blue-500/10';
        if (score >= 40) return 'bg-yellow-500/10';
        return 'bg-red-500/10';
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Sparkles className="h-8 w-8 text-purple-500" />
                            GEO Lab
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Analyze your pages for AI search visibility (ChatGPT, Gemini, Perplexity, AI Overviews)
                        </p>
                    </div>
                    {credits && (
                        <Card className="px-4 py-2">
                            <div className="text-sm text-muted-foreground">Credits</div>
                            <div className="text-2xl font-bold">{credits.balance}</div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Analysis Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Analyze a Page</CardTitle>
                    <CardDescription>
                        Enter a URL to get GEO insights and recommendations. Costs 25 credits per analysis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="https://example.com/your-page"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                placeholder="Target topic (optional)"
                                value={targetTopic}
                                onChange={(e) => setTargetTopic(e.target.value)}
                                className="w-64"
                            />
                            <Button onClick={runAnalysis} disabled={loading || !url}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Analyze
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Error State */}
                    {!result.success && (
                        <Card className="border-red-500/50">
                            <CardContent className="py-6">
                                <div className="flex items-center gap-2 text-red-500">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="font-medium">{result.error}</span>
                                </div>
                                {result.error?.includes('credits') && (
                                    <Button className="mt-4" variant="outline">
                                        Buy Credits
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Success State */}
                    {result.success && (
                        <>
                            {/* Overall Score */}
                            <Card>
                                <CardContent className="py-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium mb-1">GEO Score</h3>
                                            <p className="text-muted-foreground">{result.interpretation.description}</p>
                                        </div>
                                        <div className={`text-6xl font-bold ${getScoreColor(result.geoScore)}`}>
                                            {result.geoScore}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Score Breakdown */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {[
                                    { label: 'Content Clarity', score: result.scores.contentClarity, weight: '20%' },
                                    { label: 'Q&A Coverage', score: result.scores.qaCoverage, weight: '25%' },
                                    { label: 'Entity Richness', score: result.scores.entityRichness, weight: '15%' },
                                    { label: 'Schema', score: result.scores.schemaPresence, weight: '15%' },
                                    { label: 'Freshness', score: result.scores.freshness, weight: '10%' },
                                    { label: 'Authority', score: result.scores.authority, weight: '15%' },
                                ].map((item) => (
                                    <Card key={item.label} className={getScoreBg(item.score)}>
                                        <CardContent className="py-4 text-center">
                                            <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                                                {item.score}
                                            </div>
                                            <div className="text-sm font-medium">{item.label}</div>
                                            <div className="text-xs text-muted-foreground">{item.weight}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Content Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Content Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{result.contentSummary}</p>

                                    {/* Entities */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {result.entities.topics.map((topic, i) => (
                                            <Badge key={i} variant="secondary">{topic}</Badge>
                                        ))}
                                        {result.entities.brands.map((brand, i) => (
                                            <Badge key={i} variant="outline">{brand}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Q&A Coverage */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 className="h-5 w-5" />
                                            Questions Answered
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {result.qaClustersCovered.map((q, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                                    <span>{q}</span>
                                                </li>
                                            ))}
                                            {result.qaClustersCovered.length === 0 && (
                                                <li className="text-muted-foreground">No clear Q&A patterns detected</li>
                                            )}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-amber-600">
                                            <XCircle className="h-5 w-5" />
                                            Questions Missing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {result.qaClustersGaps.map((q, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <XCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                                    <span>{q}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recommendations */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                                        Recommendations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {result.recommendations.map((rec, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                                <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Schema Suggestions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Code className="h-5 w-5" />
                                        Schema Suggestions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {result.schemaSuggestions.map((schema, i) => (
                                            <Badge key={i} variant="outline" className="px-3 py-1">
                                                {schema}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            )}

            {/* Recent History */}
            {history.length > 0 && !result && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Analyses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{item.pageTitle || item.url}</div>
                                        <div className="text-sm text-muted-foreground truncate">{item.url}</div>
                                    </div>
                                    <div className={`text-2xl font-bold ${getScoreColor(item.geoScore)}`}>
                                        {item.geoScore}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
