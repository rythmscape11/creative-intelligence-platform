'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Loader2, Search, UserPlus, Trash2, Shield, Check, X, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WhitelistedUser {
    id: string;
    email: string;
    name: string | null;
    plan: string;
    whitelistedAt: string;
    whitelistedBy: string;
    expiresAt: string | null;
}

interface PricingPlan {
    id: string;
    name: string;
}

export function WhitelistManager() {
    const [whitelistedUsers, setWhitelistedUsers] = useState<WhitelistedUser[]>([]);
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('PRO');
    const [searching, setSearching] = useState(false);
    const [adding, setAdding] = useState(false);
    const [foundUser, setFoundUser] = useState<{ id: string; email: string; name: string | null } | null>(null);

    useEffect(() => {
        fetchWhitelistedUsers();
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/pricing');
            if (res.ok) {
                const data = await res.json();
                setPlans(data.filter((p: any) => p.id !== 'FREE'));
            }
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        }
    };

    const fetchWhitelistedUsers = async () => {
        try {
            const res = await fetch('/api/admin/whitelist');
            if (res.ok) {
                const data = await res.json();
                setWhitelistedUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch whitelisted users:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchUser = async () => {
        if (!searchEmail.trim()) {
            toast.error('Please enter an email address');
            return;
        }

        setSearching(true);
        setFoundUser(null);

        try {
            const res = await fetch(`/api/admin/users/search?email=${encodeURIComponent(searchEmail.trim())}`);
            if (res.ok) {
                const data = await res.json();
                if (data.user) {
                    setFoundUser(data.user);
                } else {
                    toast.error('User not found with that email');
                }
            } else {
                toast.error('Failed to search for user');
            }
        } catch (error) {
            console.error('Search failed:', error);
            toast.error('Search failed');
        } finally {
            setSearching(false);
        }
    };

    const addToWhitelist = async () => {
        if (!foundUser) return;

        setAdding(true);
        try {
            const res = await fetch('/api/admin/whitelist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: foundUser.id,
                    email: foundUser.email,
                    plan: selectedPlan,
                }),
            });

            if (res.ok) {
                toast.success(`${foundUser.email} granted ${selectedPlan} access`);
                setFoundUser(null);
                setSearchEmail('');
                fetchWhitelistedUsers();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to whitelist user');
            }
        } catch (error) {
            console.error('Failed to whitelist:', error);
            toast.error('Failed to whitelist user');
        } finally {
            setAdding(false);
        }
    };

    const removeFromWhitelist = async (userId: string, email: string) => {
        try {
            const res = await fetch(`/api/admin/whitelist?userId=${userId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success(`Removed ${email} from whitelist`);
                fetchWhitelistedUsers();
            } else {
                toast.error('Failed to remove from whitelist');
            }
        } catch (error) {
            console.error('Failed to remove:', error);
            toast.error('Failed to remove from whitelist');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Add User Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Grant Tier Access
                    </CardTitle>
                    <CardDescription>
                        Search for a user by email and grant them access to a paid tier without payment.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <Label className="sr-only">Email Address</Label>
                            <Input
                                type="email"
                                placeholder="user@example.com"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                            />
                        </div>
                        <Button onClick={searchUser} disabled={searching}>
                            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            <span className="ml-2">Search</span>
                        </Button>
                    </div>

                    {foundUser && (
                        <div className="bg-bg-secondary p-4 rounded-lg border border-border-primary">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white">{foundUser.email}</p>
                                    <p className="text-sm text-text-secondary">{foundUser.name || 'No name'}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plans.map(plan => (
                                                <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                                            ))}
                                            {plans.length === 0 && (
                                                <>
                                                    <SelectItem value="PRO">Pro</SelectItem>
                                                    <SelectItem value="AGENCY">Agency</SelectItem>
                                                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={addToWhitelist} disabled={adding}>
                                        {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                                        Grant Access
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Whitelisted Users Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Whitelisted Users</CardTitle>
                            <CardDescription>
                                Users with manually granted tier access ({whitelistedUsers.length} total)
                            </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={fetchWhitelistedUsers}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {whitelistedUsers.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">
                            No whitelisted users yet. Use the form above to grant access.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Granted</TableHead>
                                    <TableHead>By</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {whitelistedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>{user.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{user.plan}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-text-secondary">
                                            {new Date(user.whitelistedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-sm text-text-secondary">
                                            {user.whitelistedBy}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remove Access?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will revoke {user.email}&apos;s {user.plan} access. They will be downgraded to Free.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => removeFromWhitelist(user.id, user.email)}>
                                                            Remove Access
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
