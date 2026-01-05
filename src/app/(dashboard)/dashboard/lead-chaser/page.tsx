'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toaster';
import { ToolGate } from '@/components/access/tool-gate';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Play,
    Pause,
    MoreHorizontal,
    Mail,
    Clock,
    CheckCircle2,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

interface LeadSequence {
    id: string;
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
    currentStep: number;
    nextRunAt: string | null;
    lastRunAt: string | null;
    createdAt: string;
    leadCapture: {
        name: string;
        email: string;
        source: string;
    };
    emailsSent: {
        sentAt: string;
        subject: string;
    }[];
}

export default function LeadChaserPage() {
    const [sequences, setSequences] = useState<LeadSequence[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSequences = async () => {
        try {
            const res = await fetch('/api/lead-chaser/sequences');
            if (!res.ok) throw new Error('Failed to fetch sequences');
            const data = await res.json();
            setSequences(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to load sequences.',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSequences();
    }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        try {
            const res = await fetch(`/api/lead-chaser/sequences/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            setSequences(sequences.map(s =>
                s.id === id ? { ...s, status: newStatus } : s
            ));

            toast({
                title: 'Status Updated',
                description: `Sequence ${newStatus.toLowerCase()}.`,
                type: 'success',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update status.',
                type: 'error',
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE': return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>;
            case 'PAUSED': return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Paused</Badge>;
            case 'COMPLETED': return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Completed</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <ToolGate toolId="lead-chaser">
            <div className="space-y-8 p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Lead Chaser Activity</h1>
                        <p className="text-muted-foreground mt-2">
                            Monitor and manage AI-driven email nurturing sequences.
                        </p>
                    </div>
                    <Button variant="outline" onClick={fetchSequences} disabled={isLoading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Active Sequences</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {sequences.filter(s => s.status === 'ACTIVE').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Emails Sent (Total)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {sequences.reduce((acc, s) => acc + (s.currentStep - 1), 0)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {sequences.filter(s => s.status === 'COMPLETED').length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Manage your running sequences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Lead</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Next Run</TableHead>
                                    <TableHead>Last Email</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sequences.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No active sequences found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sequences.map((sequence) => (
                                        <TableRow key={sequence.id}>
                                            <TableCell>
                                                <div className="font-medium">{sequence.leadCapture.name || 'Unknown'}</div>
                                                <div className="text-xs text-muted-foreground">{sequence.leadCapture.email}</div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(sequence.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full max-w-[80px] h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all"
                                                            style={{ width: `${(sequence.currentStep / 5) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">Step {sequence.currentStep}/5</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {sequence.nextRunAt ? (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(sequence.nextRunAt).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {sequence.emailsSent[0] ? (
                                                    <div className="text-xs text-muted-foreground max-w-[200px] truncate" title={sequence.emailsSent[0].subject}>
                                                        {sequence.emailsSent[0].subject}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">None</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {(sequence.status === 'ACTIVE' || sequence.status === 'PAUSED') && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleStatus(sequence.id, sequence.status)}
                                                    >
                                                        {sequence.status === 'ACTIVE' ? (
                                                            <Pause className="w-4 h-4 text-yellow-500" />
                                                        ) : (
                                                            <Play className="w-4 h-4 text-green-500" />
                                                        )}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ToolGate>
    );
}
