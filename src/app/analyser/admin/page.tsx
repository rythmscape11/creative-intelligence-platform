'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    Plus,
    RefreshCw,
    Webhook,
    Users,
    CreditCard,
    CheckCircle,
    XCircle,
    Loader2,
    AlertTriangle
} from 'lucide-react';

interface AdminData {
    usersWithCredits: Array<{
        id: string;
        userId: string;
        creditsBalance: number;
        totalPurchased: number;
        totalUsed: number;
        updatedAt: string;
    }>;
    recentPurchases: Array<{
        id: string;
        userId: string;
        creditsPurchased: number;
        amountPaid: number;
        currency: string;
        status: string;
        createdAt: string;
    }>;
}

export default function AdminCreditsPage() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AdminData | null>(null);

    // Add credits form
    const [targetUserId, setTargetUserId] = useState('');
    const [creditsToAdd, setCreditsToAdd] = useState('100');
    const [reason, setReason] = useState('');
    const [addingCredits, setAddingCredits] = useState(false);
    const [addResult, setAddResult] = useState<{ success: boolean; message: string } | null>(null);

    // Webhook setup
    const [settingUpWebhook, setSettingUpWebhook] = useState(false);
    const [webhookResult, setWebhookResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    async function fetchAdminData() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/analyser/admin/credits');
            const data = await res.json();

            if (!data.success) {
                if (res.status === 403) {
                    setIsAdmin(false);
                    setError('Admin access required');
                } else {
                    setError(data.error || 'Failed to fetch data');
                }
                return;
            }

            setIsAdmin(true);
            setData(data);
        } catch (err) {
            setError('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    }

    async function handleAddCredits() {
        if (!targetUserId || !creditsToAdd) return;

        setAddingCredits(true);
        setAddResult(null);

        try {
            const res = await fetch('/api/analyser/admin/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add_credits',
                    targetUserId,
                    credits: parseInt(creditsToAdd, 10),
                    reason,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setAddResult({ success: true, message: `Added ${creditsToAdd} credits. New balance: ${data.newBalance}` });
                setTargetUserId('');
                setCreditsToAdd('100');
                setReason('');
                fetchAdminData(); // Refresh
            } else {
                setAddResult({ success: false, message: data.error || 'Failed to add credits' });
            }
        } catch (err) {
            setAddResult({ success: false, message: 'Request failed' });
        } finally {
            setAddingCredits(false);
        }
    }

    async function handleSetupWebhook() {
        setSettingUpWebhook(true);
        setWebhookResult(null);

        try {
            const res = await fetch('/api/analyser/admin/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'setup_webhook' }),
            });

            const data = await res.json();

            if (data.success) {
                setWebhookResult({ success: true, message: data.message });
            } else {
                setWebhookResult({ success: false, message: data.details || data.error });
            }
        } catch (err) {
            setWebhookResult({ success: false, message: 'Request failed' });
        } finally {
            setSettingUpWebhook(false);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-xl">
                <Card className="border-red-500/50">
                    <CardContent className="py-12 text-center">
                        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
                        <p className="text-muted-foreground">
                            You don't have permission to access this page.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="h-8 w-8 text-indigo-500" />
                    Admin: Credits Management
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage user credits and Razorpay configuration
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Add Credits */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Add Credits to User
                        </CardTitle>
                        <CardDescription>
                            Manually add credits after payment verification
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="userId">User ID (Clerk ID)</Label>
                            <Input
                                id="userId"
                                placeholder="user_2abc..."
                                value={targetUserId}
                                onChange={(e) => setTargetUserId(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="credits">Credits to Add</Label>
                            <Input
                                id="credits"
                                type="number"
                                placeholder="100"
                                value={creditsToAdd}
                                onChange={(e) => setCreditsToAdd(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="reason">Reason (optional)</Label>
                            <Input
                                id="reason"
                                placeholder="Test payment, refund, etc."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>

                        {addResult && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 ${addResult.success ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                                }`}>
                                {addResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                {addResult.message}
                            </div>
                        )}

                        <Button
                            onClick={handleAddCredits}
                            disabled={addingCredits || !targetUserId || !creditsToAdd}
                            className="w-full"
                        >
                            {addingCredits ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                            ) : (
                                <><Plus className="mr-2 h-4 w-4" /> Add Credits</>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Razorpay Webhook */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Webhook className="h-5 w-5" />
                            Razorpay Webhook
                        </CardTitle>
                        <CardDescription>
                            Configure webhook for automatic credit addition
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium mb-1">Webhook URL</p>
                            <code className="text-xs break-all">
                                https://www.aureonone.in/api/analyser/credits/webhook
                            </code>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm font-medium mb-2">Events</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">payment.authorized</Badge>
                                <Badge variant="secondary">payment.captured</Badge>
                                <Badge variant="secondary">payment.failed</Badge>
                            </div>
                        </div>

                        {webhookResult && (
                            <div className={`p-3 rounded-lg flex items-start gap-2 ${webhookResult.success ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                                }`}>
                                {webhookResult.success ? <CheckCircle className="h-4 w-4 mt-0.5" /> : <AlertTriangle className="h-4 w-4 mt-0.5" />}
                                <span className="text-sm">{webhookResult.message}</span>
                            </div>
                        )}

                        <Button
                            onClick={handleSetupWebhook}
                            disabled={settingUpWebhook}
                            variant="outline"
                            className="w-full"
                        >
                            {settingUpWebhook ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up...</>
                            ) : (
                                <><Webhook className="mr-2 h-4 w-4" /> Setup Webhook via API</>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Users with Credits */}
            {data && (
                <Card className="mb-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Users with Credits
                            </CardTitle>
                            <CardDescription>
                                {data.usersWithCredits.length} users
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={fetchAdminData}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-3 font-medium">User ID</th>
                                        <th className="text-right py-2 px-3 font-medium">Balance</th>
                                        <th className="text-right py-2 px-3 font-medium">Purchased</th>
                                        <th className="text-right py-2 px-3 font-medium">Used</th>
                                        <th className="text-left py-2 px-3 font-medium">Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.usersWithCredits.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="py-2 px-3 font-mono text-xs">{user.userId.slice(0, 20)}...</td>
                                            <td className="py-2 px-3 text-right font-medium">{user.creditsBalance}</td>
                                            <td className="py-2 px-3 text-right">{user.totalPurchased}</td>
                                            <td className="py-2 px-3 text-right">{user.totalUsed}</td>
                                            <td className="py-2 px-3 text-xs text-muted-foreground">
                                                {new Date(user.updatedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Purchases */}
            {data && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Recent Purchases
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-3 font-medium">User ID</th>
                                        <th className="text-right py-2 px-3 font-medium">Credits</th>
                                        <th className="text-right py-2 px-3 font-medium">Amount</th>
                                        <th className="text-center py-2 px-3 font-medium">Status</th>
                                        <th className="text-left py-2 px-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentPurchases.map((purchase) => (
                                        <tr key={purchase.id} className="border-b hover:bg-muted/50">
                                            <td className="py-2 px-3 font-mono text-xs">{purchase.userId.slice(0, 20)}...</td>
                                            <td className="py-2 px-3 text-right font-medium">{purchase.creditsPurchased}</td>
                                            <td className="py-2 px-3 text-right">
                                                {purchase.currency} {purchase.amountPaid}
                                            </td>
                                            <td className="py-2 px-3 text-center">
                                                <Badge variant={
                                                    purchase.status === 'completed' ? 'default' :
                                                        purchase.status === 'pending' ? 'secondary' : 'destructive'
                                                }>
                                                    {purchase.status}
                                                </Badge>
                                            </td>
                                            <td className="py-2 px-3 text-xs text-muted-foreground">
                                                {new Date(purchase.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
