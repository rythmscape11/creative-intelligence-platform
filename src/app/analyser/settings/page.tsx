'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Settings,
    Globe,
    Bell,
    Key,
    Users,
    Zap,
} from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Settings className="h-8 w-8 text-emerald-500" />
                    Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Configure The Analyser preferences and integrations
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Default Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Default Country</label>
                            <Input defaultValue="United States" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Default Language</label>
                            <Input defaultValue="English" className="mt-1" />
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                            <p className="font-medium">Ranking Changes</p>
                            <p className="text-sm text-muted-foreground">Get notified when rankings change significantly</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">New Backlinks</p>
                            <p className="text-sm text-muted-foreground">Alert when new high-authority backlinks are detected</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Weekly Summary</p>
                            <p className="text-sm text-muted-foreground">Receive weekly performance digest</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Integrations
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/30">
                                <Zap className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium">Google Search Console</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                        </div>
                        <Button variant="outline">Connect</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded bg-orange-100 dark:bg-orange-900/30">
                                <Zap className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="font-medium">Google Analytics</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                            </div>
                        </div>
                        <Button variant="outline">Connect</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Usage & Limits
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm">Tracked Domains</span>
                                <span className="text-sm font-medium">5 / 10</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-1/2" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm">Tracked Keywords</span>
                                <span className="text-sm font-medium">2,450 / 5,000</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-1/2" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm">API Calls (Monthly)</span>
                                <span className="text-sm font-medium">12,400 / 50,000</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-1/4" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </div>
    );
}
