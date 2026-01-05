'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import {
    Sparkles,
    Building2,
    Target,
    Users,
    DollarSign,
    ArrowRight,
    Loader2,
} from 'lucide-react';

export default function CreateStrategyPage() {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleGenerate = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Redirect to strategy view
        }, 3000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Create Marketing Strategy</h1>
                <p className="text-muted-foreground mt-2">
                    Let AI generate a comprehensive marketing strategy for your business
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s
                                ? 'bg-violet-600 text-white'
                                : 'bg-zinc-200 dark:bg-zinc-700 text-muted-foreground'
                            }`}>
                            {s}
                        </div>
                        {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-700'}`} />}
                    </div>
                ))}
            </div>

            {/* Step 1: Business Info */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                <Building2 className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <CardTitle>Business Information</CardTitle>
                                <CardDescription>Tell us about your business</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Business Name</Label>
                            <Input placeholder="e.g., Acme Corporation" />
                        </div>
                        <div className="space-y-2">
                            <Label>Industry</Label>
                            <Input placeholder="e.g., SaaS, E-commerce, Healthcare" />
                        </div>
                        <div className="space-y-2">
                            <Label>Business Description</Label>
                            <Textarea
                                placeholder="Describe what your business does, your products/services, and unique value proposition..."
                                rows={4}
                            />
                        </div>
                        <Button onClick={() => setStep(2)} className="w-full bg-violet-600 hover:bg-violet-700">
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Goals & Audience */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                <Target className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <CardTitle>Goals & Target Audience</CardTitle>
                                <CardDescription>Define your objectives and audience</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Primary Marketing Goal</Label>
                            <Input placeholder="e.g., Increase leads by 50%, Launch new product" />
                        </div>
                        <div className="space-y-2">
                            <Label>Target Audience</Label>
                            <Textarea
                                placeholder="Describe your ideal customer - demographics, behaviors, pain points..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Competitors (optional)</Label>
                            <Input placeholder="e.g., Company A, Company B" />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                Back
                            </Button>
                            <Button onClick={() => setStep(3)} className="flex-1 bg-violet-600 hover:bg-violet-700">
                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Budget & Timeline */}
            {step === 3 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50">
                                <DollarSign className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                                <CardTitle>Budget & Timeline</CardTitle>
                                <CardDescription>Set your constraints</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Monthly Budget</Label>
                                <Input type="number" placeholder="e.g., 10000" />
                            </div>
                            <div className="space-y-2">
                                <Label>Currency</Label>
                                <Input placeholder="USD" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Campaign Duration</Label>
                            <Input placeholder="e.g., 3 months, 6 months, 1 year" />
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                Back
                            </Button>
                            <Button
                                onClick={handleGenerate}
                                className="flex-1 bg-violet-600 hover:bg-violet-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Strategy
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
