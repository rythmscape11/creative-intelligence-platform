'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BanknotesIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Loader2 } from 'lucide-react';

export default function GovernorPage() {
    const [budgetData, setBudgetData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/governor/stats');
                if (response.ok) {
                    const data = await response.json();
                    setBudgetData(data);
                }
            } catch (error) {
                console.error('Failed to fetch governor stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!budgetData) {
        return (
            <div className="p-6 text-center text-muted-foreground">
                Failed to load budget data.
            </div>
        );
    }

    const percentageUsed = (budgetData.currentSpend / budgetData.totalBudget) * 100;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">CMS Governor</h1>
                    <p className="text-muted-foreground">
                        Financial governance and budget enforcement for AI operations.
                    </p>
                </div>
                <Badge variant={budgetData.status === 'HEALTHY' ? 'default' : 'destructive'} className="text-lg px-4 py-1">
                    {budgetData.status}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                        <BanknotesIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${budgetData.totalBudget.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Monthly Hard Limit</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Spend</CardTitle>
                        <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${budgetData.currentSpend.toFixed(4)}</div>
                        <p className="text-xs text-muted-foreground">
                            {percentageUsed.toFixed(1)}% used
                        </p>
                        <Progress value={percentageUsed} className="mt-2 h-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projected Spend</CardTitle>
                        <ExclamationTriangleIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${budgetData.projectedSpend.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Based on current usage</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Budget Enforcement Rules</CardTitle>
                    <CardDescription>
                        Active policies enforced by the Governor microservice.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium">Hard Stop Limit</p>
                                <p className="text-sm text-muted-foreground">Blocks all AI requests when budget exceeds 90%</p>
                            </div>
                            <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="font-medium">Rate Limiting</p>
                                <p className="text-sm text-muted-foreground">Max 100 requests per minute per user</p>
                            </div>
                            <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Model Downgrade</p>
                                <p className="text-sm text-muted-foreground">Automatically switches to gpt-3.5-turbo when spend &gt; 50%</p>
                            </div>
                            <Badge variant="secondary">Planned</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
