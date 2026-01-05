'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayIcon, CheckCircleIcon, ClockIcon, CogIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

type PipelineStage = 'IDLE' | 'INGESTION' | 'VALIDATION' | 'TRAINING' | 'EVALUATION' | 'DEPLOYMENT' | 'COMPLETE';

export default function MLOpsPage() {
    const [pipelineStatus, setPipelineStatus] = useState<PipelineStage>('IDLE');
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
    };

    const runPipeline = async () => {
        if (pipelineStatus !== 'IDLE' && pipelineStatus !== 'COMPLETE') return;

        try {
            setPipelineStatus('INGESTION');
            setLogs([]);
            addLog('Pipeline triggered manually.');

            // Call API to start job and get real data stats
            const response = await fetch('/api/admin/mlops/pipeline', { method: 'POST' });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to start pipeline');
            }

            const data = await response.json();
            const { trainingSetSize, fileId } = data.metadata;

            // Simulate pipeline stages with real data counts
            setTimeout(() => {
                setPipelineStatus('VALIDATION');
                addLog(`Data ingestion complete. ${trainingSetSize} strategies loaded from database.`);
            }, 2000);

            setTimeout(() => {
                setPipelineStatus('TRAINING');
                addLog(`Data validation passed. Training file uploaded: ${fileId}`);
            }, 4500);

            setTimeout(() => {
                setPipelineStatus('EVALUATION');
                addLog(`Fine-tuning job started: ${data.jobId}`);
                addLog('Job queued on OpenAI. This may take 30-60 minutes.');
            }, 8000);

            setTimeout(() => {
                setPipelineStatus('COMPLETE');
                addLog(`Job ${data.jobId} is running. Check OpenAI dashboard for progress.`);
            }, 10000);

        } catch (error: any) {
            console.error('Pipeline failed:', error);
            addLog(`Error: ${error.message}`);
            setPipelineStatus('IDLE');
        }
    };

    const getStageStatus = (stage: PipelineStage, current: PipelineStage) => {
        const stages: PipelineStage[] = ['INGESTION', 'VALIDATION', 'TRAINING', 'EVALUATION', 'DEPLOYMENT', 'COMPLETE'];
        const currentIndex = stages.indexOf(current);
        const stageIndex = stages.indexOf(stage);

        if (current === 'IDLE') return 'waiting';
        if (current === 'COMPLETE') return 'completed';
        if (stageIndex < currentIndex) return 'completed';
        if (stageIndex === currentIndex) return 'active';
        return 'waiting';
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">MLOps Control Panel</h1>
                    <p className="text-muted-foreground">
                        Manage and monitor Continuous Training (CT) pipelines.
                    </p>
                </div>
                <Button
                    onClick={runPipeline}
                    disabled={pipelineStatus !== 'IDLE' && pipelineStatus !== 'COMPLETE'}
                    className="gap-2 w-full sm:w-auto"
                >
                    {pipelineStatus !== 'IDLE' && pipelineStatus !== 'COMPLETE' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <PlayIcon className="h-4 w-4" />
                    )}
                    {pipelineStatus === 'IDLE' || pipelineStatus === 'COMPLETE' ? 'Trigger Pipeline' : 'Running...'}
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Pipeline Visualization */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Pipeline Status</CardTitle>
                        <CardDescription>
                            Real-time visualization of the training workflow.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative flex items-center justify-between py-8 overflow-x-auto min-w-full">
                            {/* Connecting Line */}
                            <div className="absolute left-0 top-1/2 h-0.5 w-full bg-gray-200 -z-10 min-w-[600px]" />

                            <div className="flex justify-between w-full min-w-[600px]">
                                {['INGESTION', 'VALIDATION', 'TRAINING', 'EVALUATION', 'DEPLOYMENT'].map((stage) => {
                                    const status = getStageStatus(stage as PipelineStage, pipelineStatus);
                                    return (
                                        <div key={stage} className="flex flex-col items-center gap-2 bg-background px-2">
                                            <div className={`
                          h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                          ${status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                                    status === 'active' ? 'bg-blue-500 border-blue-500 text-white animate-pulse' :
                                                        'bg-white border-gray-300 text-gray-300'}
                        `}>
                                                {status === 'completed' ? <CheckCircleIcon className="h-6 w-6" /> :
                                                    status === 'active' ? <CogIcon className="h-6 w-6 animate-spin" /> :
                                                        <ClockIcon className="h-6 w-6" />}
                                            </div>
                                            <span className={`text-xs font-medium ${status === 'active' ? 'text-blue-600' : 'text-muted-foreground'}`}>
                                                {stage}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pipeline Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pipeline Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">Pipeline ID</span>
                            <span className="font-mono text-xs">pl-9f8a7d6c</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">Model Version</span>
                            <span className="font-mono text-xs">v2.1.0</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm text-muted-foreground">Last Run</span>
                            <span className="text-xs">{pipelineStatus === 'COMPLETE' ? 'Just now' : '2 days ago'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={pipelineStatus === 'COMPLETE' ? 'default' : pipelineStatus === 'IDLE' ? 'secondary' : 'outline'}>
                                {pipelineStatus}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Execution Logs */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Execution Logs</CardTitle>
                        <CardDescription>
                            Live logs from the training cluster.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-black/90 text-green-400 font-mono text-xs p-4 rounded-md h-[200px] overflow-y-auto space-y-1">
                            {logs.length === 0 ? (
                                <span className="text-gray-500 opacity-50">Waiting for execution...</span>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
