'use client';

import { useState, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import AuthForm from '@/components/AuthForm';
import AnalysisDashboard from '@/components/AnalysisDashboard';
import { User, AnalysisResult } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://creative-intelligence-platform.onrender.com';

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = (loggedInUser: User, accessToken: string) => {
        setUser(loggedInUser);
        setToken(accessToken);
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        setResult(null);
    };

    // File upload handler
    const handleUpload = async (file: File) => {
        if (!token) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

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
    };

    if (!isMounted) return null;

    // If not logged in, show auth form
    if (!user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <AuthForm onLogin={handleLogin} />
            </main>
        );
    }

    // Main dashboard
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-white">Creative Intelligence</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-white text-sm">{user.email}</p>
                            <p className="text-purple-300 text-xs">
                                {user.tokens_used.toLocaleString()} / {user.token_budget.toLocaleString()} tokens
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
                {/* Upload Zone */}
                <UploadZone onUpload={handleUpload} analyzing={isLoading} />

                {error && (
                    <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 animate-fade-in">
                        {error}
                    </div>
                )}

                {/* Results */}
                {result && <AnalysisDashboard result={result} />}
            </div>
        </main>
    );
}
