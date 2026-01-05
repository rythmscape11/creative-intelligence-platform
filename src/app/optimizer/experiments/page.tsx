'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import {
    FlaskConical,
    Plus,
    TrendingUp,
    CheckCircle2,
    Clock,
    Users,
    Percent,
    BarChart2,
} from 'lucide-react';

interface Experiment {
    id: string;
    name: string;
    type: string;
    status: 'RUNNING' | 'COMPLETED' | 'DRAFT';
    startDate: string;
    variants: Array<{
        name: string;
        traffic: number;
        conversions: number;
        conversionRate: number;
    }>;
    totalTraffic: number;
    winner?: string;
    confidence: number;
}

const DEMO_EXPERIMENTS: Experiment[] = [
    {
        id: '1',
        name: 'Headline A/B Test',
        type: 'CREATIVE',
        status: 'RUNNING',
        startDate: '2024-12-01',
        variants: [
            { name: 'Control: "Shop Now"', traffic: 5200, conversions: 156, conversionRate: 3.0 },
            { name: 'Variant: "Get Yours Today"', traffic: 5150, conversions: 190, conversionRate: 3.69 },
        ],
        totalTraffic: 10350,
        confidence: 92,
    },
    {
        id: '2',
        name: 'Audience Expansion Test',
        type: 'AUDIENCE',
        status: 'COMPLETED',
        startDate: '2024-11-15',
        variants: [
            { name: 'Core Audience', traffic: 8000, conversions: 240, conversionRate: 3.0 },
            { name: 'Expanded Lookalike', traffic: 8200, conversions: 295, conversionRate: 3.6 },
        ],
        totalTraffic: 16200,
        winner: 'Expanded Lookalike',
        confidence: 98,
    },
    {
        id: '3',
        name: 'Landing Page CTA Test',
        type: 'LANDING_PAGE',
        status: 'DRAFT',
        startDate: '',
        variants: [
            { name: 'Blue CTA Button', traffic: 0, conversions: 0, conversionRate: 0 },
            { name: 'Green CTA Button', traffic: 0, conversions: 0, conversionRate: 0 },
        ],
        totalTraffic: 0,
        confidence: 0,
    },
];

const STATUS_STYLES = {
    RUNNING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    DRAFT: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400',
};

const TYPE_LABELS = {
    CREATIVE: 'Creative Test',
    AUDIENCE: 'Audience Test',
    LANDING_PAGE: 'Landing Page',
    BIDDING: 'Bidding Strategy',
};

export default function ExperimentsPage() {
    const [experiments, setExperiments] = useState<Experiment[]>(DEMO_EXPERIMENTS);
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FlaskConical className="h-8 w-8 text-cyan-500" />
                        Experiments
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        A/B tests and multi-variant experiments
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Experiment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Experiment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Experiment Name</Label>
                                <Input placeholder="e.g. Headline A/B Test" />
                            </div>
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <select className="w-full px-3 py-2 border rounded-md bg-background">
                                    <option value="CREATIVE">Creative Test</option>
                                    <option value="AUDIENCE">Audience Test</option>
                                    <option value="LANDING_PAGE">Landing Page</option>
                                    <option value="BIDDING">Bidding Strategy</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Traffic Split</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" defaultValue="50" className="w-20" />
                                    <span>% Control</span>
                                    <span>/</span>
                                    <Input type="number" defaultValue="50" className="w-20" />
                                    <span>% Variant</span>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => {
                                    toast.success('Experiment created!');
                                    setDialogOpen(false);
                                }}>
                                    Create
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{experiments.length}</div>
                        <div className="text-sm text-muted-foreground">Total Experiments</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {experiments.filter(e => e.status === 'RUNNING').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Running</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {experiments.filter(e => e.status === 'COMPLETED').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                            {experiments.reduce((sum, e) => sum + e.totalTraffic, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Traffic</div>
                    </CardContent>
                </Card>
            </div>

            {/* Experiments List */}
            <div className="space-y-4">
                {experiments.map((experiment) => (
                    <Card key={experiment.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold">{experiment.name}</h3>
                                        <Badge className={STATUS_STYLES[experiment.status]}>
                                            {experiment.status}
                                        </Badge>
                                        <Badge variant="outline">
                                            {TYPE_LABELS[experiment.type as keyof typeof TYPE_LABELS]}
                                        </Badge>
                                    </div>
                                    {experiment.startDate && (
                                        <p className="text-sm text-muted-foreground">
                                            Started: {new Date(experiment.startDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                {experiment.winner && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="font-medium">Winner: {experiment.winner}</span>
                                    </div>
                                )}
                            </div>

                            {/* Variants */}
                            <div className="space-y-3">
                                {experiment.variants.map((variant, idx) => {
                                    const isWinner = experiment.winner === variant.name;
                                    const maxConvRate = Math.max(...experiment.variants.map(v => v.conversionRate));
                                    const barWidth = maxConvRate > 0 ? (variant.conversionRate / maxConvRate) * 100 : 0;

                                    return (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-lg border ${isWinner ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : ''}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{variant.name}</span>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        {variant.traffic.toLocaleString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                                                        {variant.conversions}
                                                    </span>
                                                    <span className={`font-bold ${isWinner ? 'text-green-600' : ''}`}>
                                                        {variant.conversionRate.toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <Progress value={barWidth} className="h-2" />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Confidence */}
                            {experiment.confidence > 0 && (
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Statistical Confidence</span>
                                    <span className={`font-medium ${experiment.confidence >= 95 ? 'text-green-600' : 'text-amber-600'}`}>
                                        {experiment.confidence}%
                                        {experiment.confidence >= 95 && ' (Significant)'}
                                    </span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex gap-2">
                                {experiment.status === 'RUNNING' && (
                                    <>
                                        <Button variant="outline" size="sm">
                                            Pause
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            End Early
                                        </Button>
                                    </>
                                )}
                                {experiment.status === 'COMPLETED' && experiment.winner && (
                                    <Button size="sm" className="gap-1">
                                        <TrendingUp className="h-4 w-4" />
                                        Roll Out Winner
                                    </Button>
                                )}
                                {experiment.status === 'DRAFT' && (
                                    <Button size="sm">
                                        Start Experiment
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
