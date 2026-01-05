'use client';

import { FeatureGuard } from '@/components/feature-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function GeoEnginePage() {
    return (
        <FeatureGuard feature="geo_engine" showComingSoon={true}>
            <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold text-text-primary mb-2 flex items-center gap-3">
                            <Sparkles className="h-8 w-8 text-amber-500" />
                            GEO Engine <span className="text-sm bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full border border-amber-500/20">Beta</span>
                        </h1>
                        <p className="text-text-secondary">
                            Generative Engine Optimization - Influence AI search results
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-bg-secondary border-border-primary">
                            <CardContent className="p-8 space-y-4">
                                <h2 className="text-2xl font-bold text-text-primary">Determine Your Visibility</h2>
                                <p className="text-text-secondary">
                                    Analyze how your brand appears in AI-generated answers on platforms like ChatGPT, Gemini, and Perplexity.
                                </p>
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                                    Run Analysis
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-bg-secondary border-border-primary">
                            <CardContent className="p-8 space-y-4">
                                <h2 className="text-2xl font-bold text-text-primary">Optimize Content</h2>
                                <p className="text-text-secondary">
                                    Get actionable insights to improve your content's "citability" by LLMs.
                                </p>
                                <Button variant="outline">
                                    View Recommendations
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </FeatureGuard>
    );
}
