'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

const channels = [
    { name: 'Paid Search', percentage: 25, spend: 2500 },
    { name: 'Paid Social', percentage: 30, spend: 3000 },
    { name: 'Content Marketing', percentage: 20, spend: 2000 },
    { name: 'Email Marketing', percentage: 10, spend: 1000 },
    { name: 'SEO', percentage: 15, spend: 1500 },
];

export default function ChannelMixPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Channel Mix Optimization</h1>
                <p className="text-muted-foreground">Recommended budget allocation across marketing channels</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Budget Allocation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {channels.map((channel) => (
                                <div key={channel.name} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>{channel.name}</span>
                                        <span className="font-medium">{channel.percentage}% (${channel.spend})</span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                        <div
                                            className="bg-violet-500 h-2 rounded-full"
                                            style={{ width: `${channel.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-violet-600">$10,000</div>
                        <p className="text-muted-foreground mt-2">Monthly allocation</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
