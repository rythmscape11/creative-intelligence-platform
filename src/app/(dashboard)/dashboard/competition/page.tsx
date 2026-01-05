'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as Unlink, Clock, Trash, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import {
    Loader2, Plus, Trash2, TrendingUp, AlertTriangle, Lightbulb, Target, Newspaper, ExternalLink,
    Download, BarChart3, PieChart, Activity, Users, Zap, Shield, History
} from 'lucide-react';
import {
    ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
    ScatterChart, Scatter, ZAxis
} from 'recharts';

// --- Interfaces ---

interface AnalysisResult {
    id?: string; // Report ID from persistence
    executiveSummary: string;
    marketData: {
        totalMarketSize: string;
        cagr: string;
        forecastYear: string;
    };
    competitorInsights: {
        name: string;
        strengths: string[];
        weaknesses: string[];
        marketPosition: string;
        marketShareEstimate: number;
        sentimentScore: number;
        keyStrategies: string[];
        socialPresence: {
            channels: string[];
            strategy: string;
            followersEstimate: string;
        };
        visualIdentity: {
            description: string;
            sentiment: string;
        };
    }[];
    marketGaps: {
        opportunity: string;
        description: string;
        potentialImpact: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
    keywordAnalysis: {
        term: string;
        volume: string;
        difficulty: number;
        cpc: string;
        status: 'Breakout' | 'Stable' | 'Declining';
        topCompetitor: string;
    }[];
    competitorEcosystem: {
        direct: string[];
        indirect: string[];
        emerging: string[];
    };
    // New Enterprise Fields
    trafficAnalysis?: {
        visits: string;
        avgDuration: string;
        bounceRate: string;
        sources: { name: string; percentage: number }[];
    };
    audienceDemographics?: {
        ageBrackets: { range: string; percentage: number }[];
        genderSplit: { male: number; female: number };
        topInterests: string[];
        geoDistribution: { country: string; percentage: number }[];
    };
    adCreativeAnalysis?: {
        topThemes: string[];
        adFormats: string[];
        tone: string;
        visualStyle: string;
    };
    swotAnalysis?: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    recommendedActions: string[];
    industryNews: {
        articles: { title: string; link: string; pubDate: string; source: string }[];
        trends: { trend: string; impact: string; sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'; growthRate: string }[];
        marketOutlook: string;
    };
}

interface HistoryItem {
    id: string;
    industry: string;
    focusArea: string | null;
    competitors: string; // JSON string
    createdAt: string;
}

// --- Constants ---

const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

export default function CompetitionAnalysisPage() {
    // --- State ---
    const [competitors, setCompetitors] = useState<{ name: string; url: string }[]>([{ name: '', url: '' }]);
    const [industry, setIndustry] = useState('');
    const [focusArea, setFocusArea] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [geography, setGeography] = useState('');

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [currentReportId, setCurrentReportId] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // --- Handlers ---

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/competition/reports');
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (e) {
            console.error('Failed to fetch history', e);
        }
    };

    const loadReport = async (id: string) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch(`/api/competition/reports/${id}`);
            if (!res.ok) throw new Error('Failed to load report');

            const report = await res.json();
            const parsedResult = JSON.parse(report.result);

            // Populate state
            setIndustry(report.industry);
            setFocusArea(report.focusArea || '');

            // safely parse competitors
            try {
                const comps = JSON.parse(report.competitors);
                if (Array.isArray(comps)) {
                    // Normalize to current UI format if needed
                    // stored format might be [{name, url}] or ["name"]
                    setCompetitors(comps.map((c: any) =>
                        typeof c === 'string' ? { name: c, url: '' } : { name: c.name, url: c.url || '' }
                    ));
                }
            } catch (e) { }

            setResult({ ...parsedResult, id: report.id });
            setCurrentReportId(report.id);
            setIsAnalyzing(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            toast({ title: 'Error', description: 'Failed to load report.', type: 'error' });
            setIsAnalyzing(false);
        }
    };

    const deleteReport = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/competition/reports/${id}`, { method: 'DELETE' });
            setHistory(history.filter(h => h.id !== id));
            toast({ title: 'Report Deleted', type: 'success' });
            if (currentReportId === id) {
                setResult(null);
                setCurrentReportId(null);
            }
        } catch (e) {
            toast({ title: 'Error', description: 'Failed to delete.', type: 'error' });
        }
    }

    const addCompetitor = () => {
        if (competitors.length < 3) {
            setCompetitors([...competitors, { name: '', url: '' }]);
        } else {
            toast({ title: 'Limit Reached', description: 'Maximum 3 competitors allowed for deep analysis.', type: 'warning' });
        }
    };
    const removeCompetitor = (index: number) => setCompetitors(competitors.filter((_, i) => i !== index));

    const updateCompetitorName = (index: number, value: string) => {
        const newCompetitors = [...competitors];
        newCompetitors[index].name = value;
        setCompetitors(newCompetitors);
    };

    const updateCompetitorUrl = (index: number, value: string) => {
        const newCompetitors = [...competitors];
        newCompetitors[index].url = value;
        setCompetitors(newCompetitors);
    };

    const [analysisStage, setAnalysisStage] = useState<'IDLE' | 'MARKET' | 'COMPETITORS' | 'SYNTHESIS' | 'COMPLETE'>('IDLE');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => setLogs(prev => [...prev, message]);

    const handleAnalyze = async () => {
        // Validation
        const validCompetitors = competitors.filter(c => c.name.trim() !== '');
        if (validCompetitors.length === 0) {
            toast({ title: 'Validation Error', description: 'Please add at least one competitor name.', type: 'error' });
            return;
        }
        if (!industry.trim()) {
            toast({ title: 'Validation Error', description: 'Please specify the industry.', type: 'error' });
            return;
        }

        setIsAnalyzing(true);
        setResult(null);
        setCurrentReportId(null);
        setLoadingProgress(0);
        setLogs([]);
        setAnalysisStage('MARKET');


        try {
            // Simplified Single-Call Approach (Server-Side Optimization)
            addLog(`Analyzing ${industry} industry and ${validCompetitors.length} competitors...`);
            setAnalysisStage('MARKET');

            const response = await fetch('/api/competition/analyze-edge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    competitors: validCompetitors,
                    industry,
                    focusArea: `${focusArea} ${geography}`,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.error;
                } catch (e) {
                    errorMessage = `Server Error (${response.status}): ${response.statusText}`;
                }
                throw new Error(errorMessage || 'Analysis failed. Please try again.');
            }

            let result: AnalysisResult;
            try {
                result = await response.json();
            } catch (e) {
                console.error('Failed to parse JSON response', e);
                throw new Error('Invalid response from server. Please try again.');
            }

            // Frontend Validation
            if (!result.marketData || !result.competitorInsights || result.competitorInsights.length === 0) {
                throw new Error('Received incomplete data. Please try again.');
            }

            setLoadingProgress(100);
            setAnalysisStage('COMPLETE');
            setResult(result);
            if (result.id) setCurrentReportId(result.id);
            setIsAnalyzing(false);
            addLog('Comprehensive analysis complete!');
            toast({ title: 'Success', description: 'Comprehensive analysis complete!', type: 'success' });

            // Refresh history
            fetchHistory();

        } catch (error: any) {
            console.error(error);
            setIsAnalyzing(false);
            setAnalysisStage('IDLE');
            // Show specific error message if available
            toast({ title: 'Analysis Failed', description: error.message || 'An unexpected error occurred.', type: 'error' });
        }
    };

    const handleExport = async (format: 'pdf' | 'csv') => {
        const id = currentReportId || result?.id;
        if (!id) {
            toast({ title: 'Not Saved', description: 'Please save or regenerate the analysis first.', type: 'warning' });
            return;
        }

        toast({ title: 'Exporting...', description: `Generating ${format.toUpperCase()} report.`, type: 'info' });
        try {
            const res = await fetch(`/api/competition/reports/${id}/export`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ format })
            });

            const data = await res.json();

            if (data.success) {
                toast({ title: 'Success', description: 'Export initiated. In a real app, download would start.', type: 'success' });
                // In production, window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Export failed');
            }

        } catch (e) {
            toast({ title: 'Export Error', description: 'Failed to generate report.', type: 'error' });
        }
    };

    // --- Render ---

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Market Intelligence & Competition Analysis</h1>
                <p className="text-muted-foreground mt-2">
                    AI-powered insights with live news, social, and visual analysis.
                </p>
            </div>

            {isAnalyzing ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-6">
                    <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm font-medium text-muted-foreground">
                            <span>{analysisStage === 'MARKET' ? 'Analyzing Market Trends' :
                                analysisStage === 'COMPETITORS' ? 'Deep Diving Competitors' :
                                    analysisStage === 'SYNTHESIS' ? 'Synthesizing Strategy' : 'Initializing...'}</span>
                            <span>{Math.round(loadingProgress)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-out"
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                    </div>

                    <Card className="w-full bg-black/90 border-zinc-800 font-mono text-sm shadow-2xl">
                        <CardHeader className="border-b border-zinc-800 py-3 px-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="ml-2 text-zinc-400 text-xs">AI Agent Terminal</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 h-[300px] overflow-y-auto space-y-2 text-green-400">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <span className="text-zinc-500">{'>'}</span>
                                    <span>{log}</span>
                                </div>
                            ))}
                            <div className="animate-pulse">_</div>
                        </CardContent>
                    </Card>
                </div>
            ) : !result ? (
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Input Section */}
                    <Card className="md:col-span-3 lg:col-span-2 bg-card border-border">
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                            <CardDescription>Define your market and competitors for deep analysis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Industry <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="e.g. SaaS, E-commerce, Fintech"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Geography</Label>
                                    <Input
                                        placeholder="e.g. North America, Global, UK"
                                        value={geography}
                                        onChange={(e) => setGeography(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Target Audience</Label>
                                    <Input
                                        placeholder="e.g. SMBs, Enterprise, Gen Z"
                                        value={targetAudience}
                                        onChange={(e) => setTargetAudience(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Focus Area (Optional)</Label>
                                    <Input
                                        placeholder="e.g. Pricing, UX, Marketing Strategy"
                                        value={focusArea}
                                        onChange={(e) => setFocusArea(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Competitors <span className="text-red-500">*</span></Label>
                                {competitors.map((competitor, index) => (
                                    <div key={index} className="flex gap-3 items-start p-3 border border-border rounded-lg bg-muted/30">
                                        <div className="grid gap-2 flex-1 md:grid-cols-2">
                                            <Input
                                                placeholder={`Competitor ${index + 1} Name`}
                                                value={competitor.name}
                                                onChange={(e) => updateCompetitorName(index, e.target.value)}
                                                className="bg-background"
                                            />
                                            <Input
                                                placeholder="Website URL (e.g. https://example.com)"
                                                value={competitor.url}
                                                onChange={(e) => updateCompetitorUrl(index, e.target.value)}
                                                className="bg-background text-xs"
                                            />
                                        </div>
                                        {competitors.length > 1 && (
                                            <Button variant="ghost" size="icon" onClick={() => removeCompetitor(index)} className="text-destructive hover:bg-destructive/10 mt-1">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addCompetitor} className="w-full border-dashed">
                                    <Plus className="h-4 w-4 mr-2" /> Add Competitor
                                </Button>
                            </div>

                            <Button
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={handleAnalyze}
                                size="lg"
                            >
                                Generate Comprehensive Analysis
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Helper / History Side Panel */}
                    <Card className="md:col-span-3 lg:col-span-1 bg-muted/20 border-border max-h-[600px] overflow-hidden flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <History className="w-4 h-4" /> Recent Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground overflow-y-auto flex-1 p-4 pt-0">
                            {history.length === 0 ? (
                                <div className="text-center py-8 opacity-50">
                                    <p>No past analysis found.</p>
                                    <p className="text-xs mt-1">Your generated reports will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {history.map(item => (
                                        <div
                                            key={item.id}
                                            className="group p-3 bg-background border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-all shadow-sm"
                                            onClick={() => loadReport(item.id)}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-foreground truncate block max-w-[180px]" title={item.industry}>{item.industry}</span>
                                                <button
                                                    onClick={(e) => deleteReport(e, item.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                            {item.focusArea && (
                                                <div className="mt-1 text-xs px-1.5 py-0.5 bg-muted rounded inline-block">
                                                    {item.focusArea}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-border mt-4">
                                <h4 className="font-medium text-foreground mb-2 text-xs uppercase tracking-wider">Why use this tool?</h4>
                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-center gap-2"><Target className="w-3 h-3 text-primary" /> Identify market gaps</li>
                                    <li className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-primary" /> Track emerging trends</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Header Actions */}
                    <div className="flex justify-between items-center">
                        <Button variant="outline" onClick={() => { setResult(null); setCurrentReportId(null); }}>← New Analysis</Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleExport('csv')}>
                                <Download className="w-4 h-4 mr-2" /> Export CSV
                            </Button>
                            <Button onClick={() => handleExport('pdf')}>
                                <Download className="w-4 h-4 mr-2" /> Export PDF
                            </Button>
                        </div>
                    </div>

                    {/* Executive Summary & Market Data */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2 bg-gradient-to-br from-card to-muted/20 border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                                    Executive Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{result.executiveSummary}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle>Market Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Market Size</p>
                                    <p className="text-2xl font-bold text-primary">{result.marketData.totalMarketSize}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">CAGR</p>
                                    <p className="text-2xl font-bold text-green-500">{result.marketData.cagr}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Forecast Year</p>
                                    <p className="text-xl font-semibold">{result.marketData.forecastYear}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Market Share Chart */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-blue-500" />
                                    Estimated Market Share
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={result.competitorInsights}
                                            dataKey="marketShareEstimate"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {result.competitorInsights.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Sentiment Analysis Chart */}
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-purple-500" />
                                    Brand Sentiment Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={result.competitorInsights} layout="vertical" margin={{ left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }} />
                                        <Bar dataKey="sentimentScore" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Competitor Deep Dive */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {result.competitorInsights.map((insight, i) => (
                            <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-lg flex justify-between">
                                        {insight.name}
                                        <span className="text-sm font-normal px-2 py-1 bg-muted rounded text-muted-foreground">{insight.marketPosition}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm">
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <span className="font-semibold text-primary block mb-1">Visual Identity</span>
                                        <p className="text-muted-foreground">{insight.visualIdentity.description}</p>
                                    </div>
                                    <div className="p-3 bg-muted/30 rounded-lg">
                                        <span className="font-semibold text-blue-500 block mb-1">Social Strategy</span>
                                        <p className="text-muted-foreground">{insight.socialPresence.strategy}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Est. Followers: {insight.socialPresence.followersEstimate}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-green-500">Strengths</span>
                                        <ul className="list-disc list-inside text-muted-foreground mt-1">
                                            {insight.strengths.slice(0, 3).map((s, idx) => <li key={idx}>{s}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-red-500">Weaknesses</span>
                                        <ul className="list-disc list-inside text-muted-foreground mt-1">
                                            {insight.weaknesses.slice(0, 3).map((w, idx) => <li key={idx}>{w}</li>)}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Enterprise Analysis Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Traffic Analysis */}
                        {
                            result.trafficAnalysis && (
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-primary" />
                                            Traffic Intelligence
                                        </CardTitle>
                                        <CardDescription>Estimated traffic sources and engagement</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                                <div className="p-2 bg-muted/50 rounded-lg">
                                                    <div className="text-xs text-muted-foreground">Visits</div>
                                                    <div className="font-bold">{result.trafficAnalysis.visits}</div>
                                                </div>
                                                <div className="p-2 bg-muted/50 rounded-lg">
                                                    <div className="text-xs text-muted-foreground">Duration</div>
                                                    <div className="font-bold">{result.trafficAnalysis.avgDuration}</div>
                                                </div>
                                                <div className="p-2 bg-muted/50 rounded-lg">
                                                    <div className="text-xs text-muted-foreground">Bounce</div>
                                                    <div className="font-bold">{result.trafficAnalysis.bounceRate}</div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {result.trafficAnalysis.sources.map((source, i) => (
                                                    <div key={i} className="flex items-center justify-between text-sm">
                                                        <span>{source.name}</span>
                                                        <div className="flex items-center gap-2 w-1/2">
                                                            <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                                                                <div className="h-full bg-primary" style={{ width: `${source.percentage}%` }} />
                                                            </div>
                                                            <span className="w-8 text-right text-xs text-muted-foreground">{source.percentage}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        }

                        {/* Audience Demographics */}
                        {
                            result.audienceDemographics && (
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-primary" />
                                            Audience Demographics
                                        </CardTitle>
                                        <CardDescription>Who is visiting their site?</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                                <div className="text-center">
                                                    <div className="text-xs text-muted-foreground">Male</div>
                                                    <div className="font-bold text-blue-500">{result.audienceDemographics.genderSplit.male}%</div>
                                                </div>
                                                <div className="h-8 w-px bg-border" />
                                                <div className="text-center">
                                                    <div className="text-xs text-muted-foreground">Female</div>
                                                    <div className="font-bold text-pink-500">{result.audienceDemographics.genderSplit.female}%</div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Age Distribution</h4>
                                                <div className="flex items-end gap-1 h-24">
                                                    {result.audienceDemographics.ageBrackets.map((bracket, i) => (
                                                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                                            <div className="w-full bg-primary/20 rounded-t-sm relative group-hover:bg-primary/40 transition-colors" style={{ height: `${bracket.percentage}%` }}>
                                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity bg-popover px-1 rounded shadow-sm border">{bracket.percentage}%</span>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground rotate-0 whitespace-nowrap">{bracket.range}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        }
                    </div>

                    {/* SWOT Analysis */}
                    {result.swotAnalysis && (
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-primary" />
                                    Strategic SWOT Analysis
                                </CardTitle>
                                <CardDescription>Comprehensive strategic assessment</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                                        <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Strengths</h4>
                                        <ul className="space-y-1">
                                            {result.swotAnalysis.strengths.map((item, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                                        <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Weaknesses</h4>
                                        <ul className="space-y-1">
                                            {result.swotAnalysis.weaknesses.map((item, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                                        <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2"><Zap className="w-4 h-4" /> Opportunities</h4>
                                        <ul className="space-y-1">
                                            {result.swotAnalysis.opportunities.map((item, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                                        <h4 className="font-semibold text-orange-600 mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Threats</h4>
                                        <ul className="space-y-1">
                                            {result.swotAnalysis.threats.map((item, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Trends & News */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    Key Industry Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {result.industryNews.trends.map((trend, i) => (
                                    <div key={i} className="flex items-start justify-between p-3 bg-muted/20 rounded-lg">
                                        <div>
                                            <p className="font-medium text-foreground">{trend.trend}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{trend.impact}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded font-medium ${trend.sentiment === 'POSITIVE' ? 'bg-green-500/10 text-green-500' :
                                                trend.sentiment === 'NEGATIVE' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {trend.growthRate}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Newspaper className="w-5 h-5 text-blue-500" />
                                    Recent News
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {result.industryNews.articles.slice(0, 5).map((article, i) => (
                                        <li key={i} className="text-sm border-b border-border last:border-0 pb-2 last:pb-0">
                                            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium block truncate">
                                                {article.title}
                                            </a>
                                            <span className="text-xs text-muted-foreground">{article.source} • {new Date(article.pubDate).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Keyword Intelligence Section */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-red-500" />
                                Advanced Keyword Intelligence
                            </CardTitle>
                            <CardDescription>High-value opportunities and breakout terms</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Bubble Chart */}
                            <div className="h-[350px] w-full bg-muted/10 rounded-lg p-4 border border-border">
                                <h4 className="text-sm font-medium mb-4 text-center text-muted-foreground">Opportunity Map (Volume vs. Difficulty)</h4>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis type="number" dataKey="difficulty" name="Difficulty" unit="%" domain={[0, 100]} label={{ value: 'Difficulty', position: 'bottom', fill: '#9CA3AF' }} />
                                        <YAxis type="category" dataKey="volume" name="Volume" allowDuplicatedCategory={false} label={{ value: 'Volume', angle: -90, position: 'left', fill: '#9CA3AF' }} />
                                        <ZAxis type="number" dataKey="cpcVal" range={[50, 400]} name="CPC" />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-card border border-border p-3 rounded shadow-xl text-xs">
                                                        <p className="font-bold text-white mb-1">{data.term}</p>
                                                        <p className="text-zinc-400">Vol: {data.volume}</p>
                                                        <p className="text-zinc-400">Diff: {data.difficulty}%</p>
                                                        <p className="text-zinc-400">CPC: {data.cpc}</p>
                                                        <p className={`mt-1 font-medium ${data.status === 'Breakout' ? 'text-green-400' : 'text-zinc-500'}`}>{data.status}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Scatter name="Keywords" data={result.keywordAnalysis.map(k => ({
                                            ...k,
                                            cpcVal: parseFloat(k.cpc.replace(/[^0-9.]/g, '')) || 1
                                        }))} fill="#8884d8">
                                            {result.keywordAnalysis.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.status === 'Breakout' ? '#10B981' : entry.status === 'Declining' ? '#EF4444' : '#3B82F6'} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Data Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Keyword</th>
                                            <th className="px-4 py-3">Volume</th>
                                            <th className="px-4 py-3">Difficulty</th>
                                            <th className="px-4 py-3">CPC</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 rounded-r-lg">Top Competitor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.keywordAnalysis.map((k, i) => (
                                            <tr key={i} className="border-b border-border hover:bg-muted/10 transition-colors">
                                                <td className="px-4 py-3 font-medium text-foreground">{k.term}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{k.volume}</td>
                                                <td className="px-4 py-3">
                                                    <div className="w-full bg-secondary rounded-full h-1.5 max-w-[60px]">
                                                        <div className={`h-1.5 rounded-full ${k.difficulty > 70 ? 'bg-red-500' : k.difficulty > 40 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${k.difficulty}%` }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{k.cpc}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${k.status === 'Breakout' ? 'bg-green-500/10 text-green-500' :
                                                        k.status === 'Declining' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                        }`}>
                                                        {k.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{k.topCompetitor}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Competitor Ecosystem */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-500" />
                                Competitor Ecosystem
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-red-500 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500" /> Direct Competitors
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.competitorEcosystem?.direct.map((c, i) => (
                                            <span key={i} className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20">{c}</span>
                                        )) || <span className="text-xs text-muted-foreground">None identified</span>}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-yellow-500 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500" /> Indirect / Substitutes
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.competitorEcosystem?.indirect.map((c, i) => (
                                            <span key={i} className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded border border-yellow-500/20">{c}</span>
                                        )) || <span className="text-xs text-muted-foreground">None identified</span>}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-blue-500 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Emerging Threats
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.competitorEcosystem?.emerging.map((c, i) => (
                                            <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs rounded border border-blue-500/20">{c}</span>
                                        )) || <span className="text-xs text-muted-foreground">None identified</span>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Market Gaps */}
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Market Gaps & Opportunities
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {result.marketGaps.map((gap, i) => (
                                    <div key={i} className="p-4 rounded-lg bg-muted/20 border border-border">
                                        <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold mb-2 ${gap.potentialImpact === 'HIGH' ? 'bg-green-500/20 text-green-500' :
                                            gap.potentialImpact === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                                                'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {gap.potentialImpact} IMPACT
                                        </div>
                                        <h4 className="font-semibold text-foreground mb-1">{gap.opportunity}</h4>
                                        <p className="text-sm text-muted-foreground">{gap.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommended Actions */}
                    <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
                        <CardHeader>
                            <CardTitle>Strategic Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gap-2 md:grid-cols-2">
                                {result.recommendedActions.map((action, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                                        <span className="text-primary font-bold mt-1">•</span>
                                        {action}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )
            }
        </div >
    );
}
