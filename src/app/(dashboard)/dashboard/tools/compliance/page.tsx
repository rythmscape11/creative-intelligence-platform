'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CompliancePage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/tools/compliance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze text');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Analysis failed:', error);
            // You might want to add a toast notification here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Compliance Assistant</h1>
                <p className="text-muted-foreground">
                    Generate structured regulatory summaries and risk assessments from legal text.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Input Document</CardTitle>
                        <CardDescription>
                            Paste the regulatory text or policy document you want to analyze.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste legal text here..."
                            className="min-h-[400px] font-mono text-sm"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <Button
                            onClick={handleAnalyze}
                            disabled={!inputText || isLoading}
                            className="w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                'Generate Compliance Summary'
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="h-full bg-muted/50">
                    <CardHeader>
                        <CardTitle>Analysis Result</CardTitle>
                        <CardDescription>
                            AI-generated structured output (JSON enforcement).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {result ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                                    <span className="font-medium">Risk Level</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.risk_level === 'HIGH' ? 'bg-red-100 text-red-700' :
                                        result.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {result.risk_level}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        Key Obligations
                                    </h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-1">
                                        {result.key_obligations.map((item: string, i: number) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                        Missing Clauses
                                    </h3>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-1">
                                        {result.missing_clauses.map((item: string, i: number) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <h3 className="font-semibold mb-2">Summary</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {result.summary}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                                <p>No analysis generated yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
