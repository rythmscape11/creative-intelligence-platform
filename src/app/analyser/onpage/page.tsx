'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Loader2,
    Target,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Zap,
    Image,
    FileText,
    Code,
    Smartphone,
    Search
} from 'lucide-react';

interface CoreWebVitals {
    lcp: { value: number; score: string };
    fid: { value: number; score: string };
    cls: { value: number; score: string };
    fcp: { value: number; score: string };
    ttfb: { value: number; score: string };
}

interface AuditResult {
    id: string;
    title: string;
    score: number;
    description: string;
    category: string;
}

interface OnPageResult {
    url: string;
    performanceScore: number;
    seoScore: number;
    accessibilityScore: number;
    bestPracticesScore: number;
    coreWebVitals: CoreWebVitals;
    audits: AuditResult[];
    opportunities: AuditResult[];
}

export default function OnPageAuditPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<OnPageResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function runAudit() {
        if (!url.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/analyser/pagespeed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error || 'Failed to run audit');
                return;
            }

            setResult(data);
        } catch (err) {
            setError('Failed to run audit');
        } finally {
            setLoading(false);
        }
    }

    function getScoreColor(score: number) {
        if (score >= 90) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    }

    function getScoreBg(score: number) {
        if (score >= 90) return 'bg-green-500';
        if (score >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    function getVitalIcon(score: string) {
        if (score === 'good') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        if (score === 'needs-improvement') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        return <XCircle className="h-4 w-4 text-red-500" />;
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Target className="h-8 w-8 text-cyan-500" />
                    On-Page SEO Audit
                </h1>
                <p className="text-muted-foreground mt-1">
                    Technical SEO audit with Core Web Vitals and optimization opportunities
                </p>
            </div>

            {/* Search Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Enter URL to Audit</CardTitle>
                    <CardDescription>
                        Get performance scores, Core Web Vitals, and SEO recommendations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="https://example.com/page"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && runAudit()}
                        />
                        <Button onClick={runAudit} disabled={loading || !url.trim()}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Auditing...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Run Audit
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
                    {/* Score Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Performance', score: result.performanceScore, icon: Zap },
                            { label: 'SEO', score: result.seoScore, icon: Search },
                            { label: 'Accessibility', score: result.accessibilityScore, icon: FileText },
                            { label: 'Best Practices', score: result.bestPracticesScore, icon: Code },
                        ].map((item) => (
                            <Card key={item.label}>
                                <CardContent className="py-6 text-center">
                                    <item.icon className={`h-8 w-8 mx-auto mb-2 ${getScoreColor(item.score)}`} />
                                    <div className={`text-4xl font-bold ${getScoreColor(item.score)}`}>
                                        {item.score}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
                                    <Progress
                                        value={item.score}
                                        className="mt-2 h-2"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Core Web Vitals */}
                    {result.coreWebVitals && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5" />
                                    Core Web Vitals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">LCP</span>
                                            {getVitalIcon(result.coreWebVitals.lcp.score)}
                                        </div>
                                        <p className="text-2xl font-bold">{result.coreWebVitals.lcp.value}s</p>
                                        <p className="text-xs text-muted-foreground">Largest Contentful Paint</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">FID</span>
                                            {getVitalIcon(result.coreWebVitals.fid.score)}
                                        </div>
                                        <p className="text-2xl font-bold">{result.coreWebVitals.fid.value}ms</p>
                                        <p className="text-xs text-muted-foreground">First Input Delay</p>
                                    </div>
                                    <div className="p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">CLS</span>
                                            {getVitalIcon(result.coreWebVitals.cls.score)}
                                        </div>
                                        <p className="text-2xl font-bold">{result.coreWebVitals.cls.value}</p>
                                        <p className="text-xs text-muted-foreground">Cumulative Layout Shift</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Opportunities */}
                    {result.opportunities && result.opportunities.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                                    Optimization Opportunities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {result.opportunities.map((opp, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                            <div className="w-12 text-center">
                                                <Badge variant={opp.score < 50 ? 'destructive' : 'secondary'}>
                                                    {opp.score}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="font-medium">{opp.title}</p>
                                                <p className="text-sm text-muted-foreground">{opp.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Passed Audits */}
                    {result.audits && result.audits.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    Passed Audits ({result.audits.filter(a => a.score >= 90).length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-2">
                                    {result.audits.filter(a => a.score >= 90).map((audit, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                            <span className="text-sm">{audit.title}</span>
                                        </div>
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
