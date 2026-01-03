'use client';

import { useState } from 'react';
import { User } from '@/types';

interface AuthFormProps {
    onLogin: (user: User, token: string) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://creative-intelligence-platform.onrender.com';

export default function AuthForm({ onLogin }: AuthFormProps) {
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (authMode === 'register') {
                const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, org_name: orgName || null }),
                });
                if (!res.ok) throw new Error((await res.json()).detail);
                const data = await res.json();
                onLogin(data.user, data.access_token);
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
                onLogin(data.user, data.access_token);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
            </form>

            {error && (
                <p className="mt-4 text-red-400 text-center text-sm">{error}</p>
            )}
        </div>
    );
}
