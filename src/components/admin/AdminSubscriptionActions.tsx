'use client';

/**
 * Admin Subscription Actions Component
 * 
 * Provides UI for founder-led sales actions:
 * - Extend trial
 * - Comp a plan
 * - Cancel subscription
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Gift, XCircle, AlertTriangle } from 'lucide-react';

interface SubscriptionActionsProps {
    userId: string;
    userEmail: string;
    currentPlan?: string;
    currentStatus?: string;
    onActionComplete?: () => void;
}

type ActionType = 'extend_trial' | 'comp_plan' | 'cancel' | null;

export function AdminSubscriptionActions({
    userId,
    userEmail,
    currentPlan = 'FREE',
    currentStatus = 'NONE',
    onActionComplete,
}: SubscriptionActionsProps) {
    const [activeAction, setActiveAction] = useState<ActionType>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [daysToAdd, setDaysToAdd] = useState('14');
    const [selectedPlan, setSelectedPlan] = useState('PRO');
    const [reason, setReason] = useState('');

    const executeAction = async () => {
        if (!activeAction) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/admin/subscription-actions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: activeAction,
                    targetUserId: userId,
                    plan: selectedPlan,
                    daysToAdd: parseInt(daysToAdd, 10),
                    reason,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Action failed');
            }

            setSuccess(data.message);
            onActionComplete?.();

            // Close dialog after 2 seconds on success
            setTimeout(() => {
                setActiveAction(null);
                setSuccess(null);
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {/* Extend Trial Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveAction('extend_trial')}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
                <Clock className="h-4 w-4 mr-1" />
                Extend Trial
            </Button>

            {/* Comp Plan Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveAction('comp_plan')}
                className="text-green-600 border-green-600 hover:bg-green-50"
            >
                <Gift className="h-4 w-4 mr-1" />
                Comp Plan
            </Button>

            {/* Cancel Button */}
            {currentStatus === 'ACTIVE' && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveAction('cancel')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                </Button>
            )}

            {/* Extend Trial Dialog */}
            <Dialog open={activeAction === 'extend_trial'} onOpenChange={() => setActiveAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Extend Trial</DialogTitle>
                        <DialogDescription>
                            Extend trial period for {userEmail}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Days to Add</Label>
                            <Input
                                type="number"
                                value={daysToAdd}
                                onChange={(e) => setDaysToAdd(e.target.value)}
                                min="1"
                                max="90"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Reason (optional)</Label>
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Demo follow-up, VIP prospect"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-green-500 text-sm">✅ {success}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActiveAction(null)}>
                            Cancel
                        </Button>
                        <Button onClick={executeAction} disabled={loading}>
                            {loading ? 'Processing...' : 'Extend Trial'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Comp Plan Dialog */}
            <Dialog open={activeAction === 'comp_plan'} onOpenChange={() => setActiveAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Comp Plan</DialogTitle>
                        <DialogDescription>
                            Gift a paid plan to {userEmail} (1 year)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Plan</Label>
                            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRO">Pro ($49/mo value)</SelectItem>
                                    <SelectItem value="AGENCY">Agency ($299/mo value)</SelectItem>
                                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Reason (required)</Label>
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Beta tester, Influencer partnership"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-green-500 text-sm">✅ {success}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActiveAction(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={executeAction}
                            disabled={loading || !reason}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {loading ? 'Processing...' : 'Gift Plan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Dialog */}
            <Dialog open={activeAction === 'cancel'} onOpenChange={() => setActiveAction(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle><span className="text-red-600">Cancel Subscription</span></DialogTitle>
                        <DialogDescription>
                            Cancel subscription for {userEmail}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-700 dark:text-red-400 text-sm">
                                ⚠️ This will immediately cancel the user&apos;s subscription. They will lose access to paid features.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Reason (required)</Label>
                            <Input
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="e.g., Refund request, Chargeback"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm flex items-center gap-1">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="text-green-500 text-sm">✅ {success}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActiveAction(null)}>
                            Keep Active
                        </Button>
                        <Button
                            onClick={executeAction}
                            disabled={loading || !reason}
                            variant="destructive"
                        >
                            {loading ? 'Processing...' : 'Cancel Subscription'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
