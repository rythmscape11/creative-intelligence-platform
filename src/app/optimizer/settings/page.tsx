'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import {
    Settings,
    Link2,
    Bell,
    Target,
    TrendingUp,
    DollarSign,
    Zap,
} from 'lucide-react';

export default function OptimizerSettingsPage() {
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Settings saved successfully');
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Settings className="h-8 w-8 text-purple-500" />
                    Optimizer Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Configure The Optimiser preferences and ad platform connections
                </p>
            </div>

            {/* Goals & Targets */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Goals & Targets
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Target ROAS</label>
                            <Input type="number" defaultValue="4.5" className="mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">Minimum acceptable return on ad spend</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Max CPA ($)</label>
                            <Input type="number" defaultValue="50" className="mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">Maximum cost per acquisition</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Monthly Budget ($)</label>
                            <Input type="number" defaultValue="10000" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Target CTR (%)</label>
                            <Input type="number" defaultValue="2.5" step="0.1" className="mt-1" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Performance Alerts</p>
                            <p className="text-sm text-muted-foreground">Get notified when campaigns underperform</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Budget Warnings</p>
                            <p className="text-sm text-muted-foreground">Alert when nearing budget limits</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Weekly Optimization Report</p>
                            <p className="text-sm text-muted-foreground">Receive weekly AI recommendations digest</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Auto-Apply Safe Changes</p>
                            <p className="text-sm text-muted-foreground">Automatically apply low-risk optimizations</p>
                        </div>
                        <Switch />
                    </div>
                </CardContent>
            </Card>

            {/* Platform Connections */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Ad Platform Connections
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30">
                                <Zap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">Google Ads</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => toast.success('Opening Google Ads OAuth...')}>
                            Connect
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-indigo-100 dark:bg-indigo-900/30">
                                <Zap className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="font-medium">Meta Ads (Facebook/Instagram)</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => toast.success('Opening Meta Ads OAuth...')}>
                            Connect
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-green-100 dark:bg-green-900/30">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium">LinkedIn Ads</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => toast.success('Opening LinkedIn Ads OAuth...')}>
                            Connect
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-red-100 dark:bg-red-900/30">
                                <DollarSign className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <p className="font-medium">CSV Data Upload</p>
                                <p className="text-sm text-emerald-600 font-medium">Enabled</p>
                            </div>
                        </div>
                        <Button variant="secondary">Configure</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Usage */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Usage & Limits
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm">Connected Accounts</span>
                                <span className="text-sm font-medium">2 / 5</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-2/5" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm">Campaigns Analyzed</span>
                                <span className="text-sm font-medium">45 / 100</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-1/2" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm">AI Recommendations (Monthly)</span>
                                <span className="text-sm font-medium">234 / 500</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-1/2" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleSave}
                disabled={saving}
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
    );
}
