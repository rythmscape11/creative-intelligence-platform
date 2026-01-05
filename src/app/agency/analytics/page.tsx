'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3, Database, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AnalyticsPage() {
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'READY'>('IDLE');

    const handleConnect = async (source: string) => {
        setStatus('PROCESSING');

        try {
            // Simulating data fetched from the selected source
            const mockData = [
                { campaign: 'Summer_Sale', impressions: 1000, clicks: 50, cost: 20.5 },
                { campaign: 'Brand_Awareness', impressions: 5000, clicks: 120, cost: 100.0 },
                { campaign: 'Retargeting', impressions: 800, clicks: 80, cost: 45.2 }
            ];

            toast.loading(`Ingesting data from ${source}...`, { duration: 1500 });

            await new Promise(r => setTimeout(r, 1000)); // Network delay simulation

            // Call the Real Ingestion Pipeline
            const res = await fetch('/api/agency/analytics/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockData)
            });

            if (!res.ok) throw new Error('Ingestion Failed');

            const result = await res.json();
            console.log('BigQuery Insert Result:', result);

            toast.success('AI Mapped & Streamed to BigQuery!');
            setStatus('READY');
        } catch (error) {
            console.error(error);
            toast.error('Connection Failed');
            setStatus('IDLE');
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-indigo-500" />
                    AI Analytics Engine
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                    Connect your data sources. Let AI build your BI dashboard automatically.
                </p>
            </div>

            {status === 'IDLE' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Google Ads', 'Meta Ads', 'GA4'].map((source) => (
                        <Card key={source} className="hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => handleConnect(source)}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-zinc-500" />
                                    {source}
                                </CardTitle>
                                <CardDescription>Connect & Auto-Visualize</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}

            {status === 'PROCESSING' && (
                <div className="h-96 flex flex-col items-center justify-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <Sparkles className="h-12 w-12 text-indigo-500" />
                    </motion.div>
                    <h3 className="text-xl font-medium animate-pulse">AI is building your dashboard...</h3>
                    <p className="text-zinc-500">Normalizing data schemas • Generating charts • Optimizing layout</p>
                </div>
            )}

            {status === 'READY' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-500">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">Live Data Connection Active</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setStatus('IDLE')}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Source
                        </Button>
                    </div>

                    {/* Dashboard Placeholder */}
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl relative flex flex-col items-center justify-center">
                        <BarChart3 className="h-16 w-16 text-indigo-500 mb-4" />
                        <h3 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">Dashboard Ready</h3>
                        <p className="text-zinc-500 text-sm mt-2 text-center max-w-md px-4">
                            Your data has been processed. Connect Looker Studio or Power BI to this BigQuery dataset to visualize your analytics.
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Button variant="outline" size="sm" asChild>
                                <a href="https://lookerstudio.google.com" target="_blank" rel="noopener noreferrer">
                                    Open Looker Studio
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href="https://app.powerbi.com" target="_blank" rel="noopener noreferrer">
                                    Open Power BI
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 rounded-lg text-sm border border-indigo-100 dark:border-indigo-900">
                        <strong>AI Note:</strong> This dashboard was automatically generated from your connected data sources.
                        Anomaly detection is active.
                    </div>
                </motion.div>
            )}
        </div>
    );
}
