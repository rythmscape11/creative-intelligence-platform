'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Shield, CreditCard } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your Strategiser preferences</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Preferences
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Default Industry</Label>
                        <Input placeholder="e.g., SaaS, E-commerce" />
                    </div>
                    <div className="space-y-2">
                        <Label>Default Currency</Label>
                        <Input placeholder="USD" />
                    </div>
                    <Button>Save Preferences</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Notification settings coming soon</p>
                </CardContent>
            </Card>
        </div>
    );
}
