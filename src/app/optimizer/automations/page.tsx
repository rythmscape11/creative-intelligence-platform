'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
    Zap,
    Plus,
    Play,
    Pause,
    Settings,
    Trash2,
    Clock,
    Target,
    DollarSign,
    AlertTriangle,
    CheckCircle2,
    History,
} from 'lucide-react';

interface Rule {
    id: string;
    name: string;
    description: string;
    status: 'ACTIVE' | 'PAUSED' | 'DRAFT';
    conditions: string;
    action: string;
    lastRunAt: string | null;
    executionCount: number;
    runFrequency: string;
}

const DEMO_RULES: Rule[] = [
    {
        id: '1',
        name: 'Scale Winners',
        description: 'Increase budget by 20% for campaigns with ROAS > 3x over 7 days',
        status: 'ACTIVE',
        conditions: 'ROAS > 3.0 for 7 days',
        action: 'Increase budget by 20%',
        lastRunAt: new Date(Date.now() - 3600000).toISOString(),
        executionCount: 12,
        runFrequency: 'DAILY',
    },
    {
        id: '2',
        name: 'Cut Losers',
        description: 'Pause campaigns with CPA > $50 and spend > $100 over 3 days',
        status: 'ACTIVE',
        conditions: 'CPA > $50 AND Spend > $100 for 3 days',
        action: 'Pause campaign',
        lastRunAt: new Date(Date.now() - 7200000).toISOString(),
        executionCount: 5,
        runFrequency: 'DAILY',
    },
    {
        id: '3',
        name: 'Creative Fatigue Guard',
        description: 'Alert when ad frequency > 4 and CTR drops > 30%',
        status: 'PAUSED',
        conditions: 'Frequency > 4 AND CTR drop > 30%',
        action: 'Send alert',
        lastRunAt: null,
        executionCount: 0,
        runFrequency: 'HOURLY',
    },
];

const STATUS_STYLES = {
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    PAUSED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    DRAFT: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400',
};

const FREQUENCY_LABELS = {
    HOURLY: 'Every hour',
    DAILY: 'Once daily',
    WEEKLY: 'Weekly',
};

export default function AutomationsPage() {
    const [rules, setRules] = useState<Rule[]>(DEMO_RULES);
    const [dialogOpen, setDialogOpen] = useState(false);

    const toggleRule = (id: string) => {
        setRules(rules.map(r => {
            if (r.id === id) {
                const newStatus = r.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
                toast.success(`Rule ${newStatus === 'ACTIVE' ? 'activated' : 'paused'}`);
                return { ...r, status: newStatus };
            }
            return r;
        }));
    };

    const deleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
        toast.success('Rule deleted');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Zap className="h-8 w-8 text-amber-500" />
                        Automations
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Set up rules to automatically optimize your campaigns
                    </p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Automation Rule</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Rule Name</Label>
                                <Input placeholder="e.g. Scale Winners" />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input placeholder="What does this rule do?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Condition Metric</Label>
                                    <select className="w-full px-3 py-2 border rounded-md bg-background">
                                        <option>ROAS</option>
                                        <option>CPA</option>
                                        <option>CTR</option>
                                        <option>Spend</option>
                                        <option>Frequency</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Operator</Label>
                                    <select className="w-full px-3 py-2 border rounded-md bg-background">
                                        <option>Greater than</option>
                                        <option>Less than</option>
                                        <option>Equals</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Value</Label>
                                    <Input type="number" placeholder="3.0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Lookback (days)</Label>
                                    <Input type="number" placeholder="7" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Action</Label>
                                <select className="w-full px-3 py-2 border rounded-md bg-background">
                                    <option>Increase budget by %</option>
                                    <option>Decrease budget by %</option>
                                    <option>Pause campaign</option>
                                    <option>Activate campaign</option>
                                    <option>Send alert</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => {
                                    toast.success('Rule created!');
                                    setDialogOpen(false);
                                }}>
                                    Create Rule
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
                        <div className="text-2xl font-bold">{rules.length}</div>
                        <div className="text-sm text-muted-foreground">Total Rules</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {rules.filter(r => r.status === 'ACTIVE').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Active</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                            {rules.reduce((sum, r) => sum + r.executionCount, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Executions</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-indigo-600">$2,450</div>
                        <div className="text-sm text-muted-foreground">Saved (est.)</div>
                    </CardContent>
                </Card>
            </div>

            {/* Rules List */}
            {rules.length === 0 ? (
                <Card className="p-12 text-center">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No automation rules yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Create rules to automatically optimize your campaigns 24/7.
                    </p>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Rule
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {rules.map((rule) => (
                        <Card key={rule.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.status === 'ACTIVE'
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : 'bg-zinc-100 dark:bg-zinc-800'
                                            }`}>
                                            {rule.status === 'ACTIVE'
                                                ? <Play className="h-5 w-5 text-green-600" />
                                                : <Pause className="h-5 w-5 text-zinc-500" />
                                            }
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{rule.name}</h3>
                                                <Badge className={STATUS_STYLES[rule.status]}>
                                                    {rule.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {rule.description}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Target className="h-3 w-3" /> {rule.conditions}
                                                </span>
                                                <span>→</span>
                                                <span className="flex items-center gap-1">
                                                    <Zap className="h-3 w-3" /> {rule.action}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {FREQUENCY_LABELS[rule.runFrequency as keyof typeof FREQUENCY_LABELS]}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <History className="h-3 w-3" />
                                                    {rule.executionCount} executions
                                                </span>
                                                {rule.lastRunAt && (
                                                    <span>
                                                        Last run: {new Date(rule.lastRunAt).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={rule.status === 'ACTIVE'}
                                            onCheckedChange={() => toggleRule(rule.id)}
                                        />
                                        <Button variant="ghost" size="icon">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => deleteRule(rule.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
