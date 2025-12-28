'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface User {
    id: string;
    email: string;
    org_name: string | null;
    tier: string;
    token_budget: number;
    tokens_used: number;
}

interface Pillar {
    name: string;
    score: number;
    confidence: string;
    confidence_reason: string;
    vs_category_avg: number;
    explanation: {
        what_drove_this: string[];
        what_hurt_this: string[];
        what_to_fix_first: string;
        expected_fix_impact: number;
        boardroom_summary: string;
    };
}

interface AnalysisResult {
    analysis_id: string;
    status: string;
    score?: {
        overall_score: number;
        confidence: string;
        confidence_band: [number, number];
        decision_summary: {
            run_decision: string;
            platform_fit: string;
            success_rationale: string;
            priority_improvement: string;
            expected_uplift: string;
        };
        pillars: Pillar[];
        warnings: string[];
        contradictions: string[];
    };
    differentiation?: {
        distinctiveness_score: number;
        is_me_too: boolean;
        generic_claims: string[];
        suggestions: string[];
    };
    layer_summary?: {
        deterministic_signals: number;
        perceptual_signals: number;
        cognitive_signals: number;
    };
    processing_time_ms?: number;
    total_tokens_used?: number;
    warnings?: string[];
    errors?: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://creative-intelligence-platform.onrender.com';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');

    // Auth handlers
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (authMode === 'register') {
                const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, org_name: orgName || null }),
                });
                if (!res.ok) throw new Error((await res.json()).detail);
                const data = await res.json();
                setToken(data.access_token);
                setUser(data.user);
            } else {
                const formData = new URLSearchParams();
                formData.append('username', email);
                formData.append('password', password);
                const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData,
                });
                if (!res.ok) throw new Error((await res.json()).detail);
                const data = await res.json();
                setToken(data.access_token);
                setUser(data.user);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    // File upload handler
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!acceptedFiles.length || !token) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        try {
            const res = await fetch(`${API_BASE}/api/v1/analysis/?category=general&platform=general&funnel_stage=awareness`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Analysis failed');
            }

            const data = await res.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxFiles: 1,
    });

    // If not logged in, show auth form
    if (!user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-white/20">
                    <h1 className="text-3xl font-bold text-white text-center mb-2">
                        Creative Intelligence
                    </h1>
                    <p className="text-purple-300 text-center mb-8">CMO-Grade Scoring Platform</p>

                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setAuthMode('login')}
                            className={`flex-1 py-2 rounded-lg font-medium transition ${authMode === 'login' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/60'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setAuthMode('register')}
                            className={`flex-1 py-2 rounded-lg font-medium transition ${authMode === 'register' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/60'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                            required
                        />
                        {authMode === 'register' && (
                            <input
                                type="text"
                                placeholder="Organization Name (optional)"
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                            />
                        )}
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition"
                        >
                            {authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    {error && (
                        <p className="mt-4 text-red-400 text-center text-sm">{error}</p>
                    )}
                </div>
            </main>
        );
    }

    // Main dashboard
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">Creative Intelligence</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-white text-sm">{user.email}</p>
                            <p className="text-purple-300 text-xs">
                                {user.tokens_used.toLocaleString()} / {user.token_budget.toLocaleString()} tokens
                            </p>
                        </div>
                        <button
                            onClick={() => { setUser(null); setToken(null); setResult(null); }}
                            className="px-3 py-1 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Upload Zone */}
                <div
                    {...getRootProps()}
                    className={`p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition ${isDragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 hover:border-purple-400/50'
                        }`}
                >
                    <input {...getInputProps()} />
                    {isLoading ? (
                        <div className="space-y-4">
                            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-white">Analyzing creative with three-layer scoring...</p>
                        </div>
                    ) : (
                        <>
                            <div className="text-5xl mb-4">🎨</div>
                            <p className="text-white text-lg font-medium">Drop your creative here</p>
                            <p className="text-white/60 text-sm mt-1">PNG, JPG, WEBP up to 10MB</p>
                        </>
                    )}
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200">
                        {error}
                    </div>
                )}

                {/* Results */}
                {result?.score && (
                    <div className="mt-8 space-y-6">
                        {/* Overall Score Card */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-semibold">Overall Score</h2>
                                    <p className="text-white/60 text-sm mt-1">
                                        Confidence: {result.score.confidence} ({result.score.confidence_band[0]} - {result.score.confidence_band[1]})
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-5xl font-bold ${result.score.overall_score >= 70 ? 'text-green-400' :
                                        result.score.overall_score >= 50 ? 'text-yellow-400' : 'text-red-400'
                                        }`}>
                                        {result.score.overall_score}
                                    </div>
                                    <p className="text-white/60 text-sm">/ 100</p>
                                </div>
                            </div>

                            {/* Layer Summary */}
                            {result.layer_summary && (
                                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-400">{result.layer_summary.deterministic_signals}</p>
                                        <p className="text-white/60 text-xs">Deterministic</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-purple-400">{result.layer_summary.perceptual_signals}</p>
                                        <p className="text-white/60 text-xs">Perceptual</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-pink-400">{result.layer_summary.cognitive_signals}</p>
                                        <p className="text-white/60 text-xs">Cognitive</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CMO Decision Summary */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
                            <h3 className="text-white font-semibold text-lg mb-4">📊 CMO Decision Summary</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-purple-300 text-sm">Run Decision</p>
                                    <p className="text-white font-medium">{result.score.decision_summary.run_decision}</p>
                                </div>
                                <div>
                                    <p className="text-purple-300 text-sm">Platform Fit</p>
                                    <p className="text-white font-medium">{result.score.decision_summary.platform_fit}</p>
                                </div>
                                <div>
                                    <p className="text-purple-300 text-sm">Why It Will Work</p>
                                    <p className="text-white font-medium">{result.score.decision_summary.success_rationale}</p>
                                </div>
                                <div>
                                    <p className="text-purple-300 text-sm">Priority Improvement</p>
                                    <p className="text-white font-medium">{result.score.decision_summary.priority_improvement}</p>
                                </div>
                            </div>
                        </div>

                        {/* Pillars */}
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <h3 className="text-white font-semibold text-lg mb-4">📈 Pillar Breakdown</h3>
                            <div className="space-y-4">
                                {result.score.pillars.map((pillar) => (
                                    <div key={pillar.name} className="border border-white/10 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white font-medium">{pillar.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${pillar.confidence === 'high' ? 'bg-green-500/30 text-green-300' :
                                                    pillar.confidence === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                                                        'bg-red-500/30 text-red-300'
                                                    }`}>
                                                    {pillar.confidence}
                                                </span>
                                                <span className={`text-xl font-bold ${pillar.score >= 70 ? 'text-green-400' :
                                                    pillar.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                                                    }`}>
                                                    {pillar.score}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                                            <div
                                                className={`h-2 rounded-full ${pillar.score >= 70 ? 'bg-green-400' :
                                                    pillar.score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                                    }`}
                                                style={{ width: `${pillar.score}%` }}
                                            />
                                        </div>
                                        <p className="text-white/70 text-sm">{pillar.explanation.boardroom_summary}</p>
                                        <p className="text-purple-300 text-xs mt-2">
                                            Fix: {pillar.explanation.what_to_fix_first} (+{pillar.explanation.expected_fix_impact} pts)
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warnings */}
                        {(result.score.warnings.length > 0 || result.score.contradictions.length > 0) && (
                            <div className="bg-yellow-500/20 rounded-2xl p-6 border border-yellow-500/30">
                                <h3 className="text-yellow-300 font-semibold mb-3">⚠️ Warnings & Contradictions</h3>
                                <ul className="space-y-1">
                                    {result.score.warnings.map((w, i) => (
                                        <li key={i} className="text-yellow-100 text-sm">• {w}</li>
                                    ))}
                                    {result.score.contradictions.map((c, i) => (
                                        <li key={`c-${i}`} className="text-orange-200 text-sm">• {c}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-white/60 text-sm">Processing Time</p>
                                <p className="text-white text-xl font-semibold">{result.processing_time_ms}ms</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-white/60 text-sm">Tokens Used</p>
                                <p className="text-white text-xl font-semibold">{result.total_tokens_used?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
