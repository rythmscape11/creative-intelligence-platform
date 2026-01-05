/**
 * Automation Rules Page
 * Manage workflow automations for Agency OS
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Zap,
    Plus,
    Settings,
    Trash2,
    Copy,
    Play,
    Pause,
    ChevronRight,
    Bell,
    Mail,
    Webhook,
    CheckSquare,
    Clock,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AUTOMATION_TEMPLATES } from '@/lib/agency/automation-service';

interface AutomationRule {
    id: string;
    name: string;
    description?: string;
    trigger: string;
    actions: { type: string; config?: Record<string, unknown> }[];
    enabled: boolean;
    triggerCount: number;
    lastTriggered?: string;
}

const TRIGGER_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
    task_status_changed: { label: 'Task Status Changed', icon: <CheckSquare className="h-4 w-4" /> },
    task_assigned: { label: 'Task Assigned', icon: <CheckSquare className="h-4 w-4" /> },
    task_due_soon: { label: 'Task Due Soon', icon: <Clock className="h-4 w-4" /> },
    task_overdue: { label: 'Task Overdue', icon: <Clock className="h-4 w-4" /> },
    project_status_changed: { label: 'Project Status Changed', icon: <Settings className="h-4 w-4" /> },
    campaign_launched: { label: 'Campaign Launched', icon: <Zap className="h-4 w-4" /> },
    time_based: { label: 'Scheduled', icon: <Clock className="h-4 w-4" /> },
};

const ACTION_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
    send_notification: { label: 'Notification', icon: <Bell className="h-4 w-4" /> },
    send_email: { label: 'Email', icon: <Mail className="h-4 w-4" /> },
    send_webhook: { label: 'Webhook', icon: <Webhook className="h-4 w-4" /> },
    create_task: { label: 'Create Task', icon: <CheckSquare className="h-4 w-4" /> },
    move_to_status: { label: 'Move Status', icon: <ArrowRight className="h-4 w-4" /> },
    assign_user: { label: 'Assign User', icon: <CheckSquare className="h-4 w-4" /> },
    update_field: { label: 'Update Field', icon: <Settings className="h-4 w-4" /> },
};

export default function AutomationPage() {
    const [rules, setRules] = useState<AutomationRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTemplates, setShowTemplates] = useState(false);

    // Fetch rules from API
    const fetchRules = useCallback(async () => {
        try {
            const res = await fetch('/api/agency/automations');
            if (res.ok) {
                const data = await res.json();
                setRules(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch automations:', error);
            toast.error('Failed to load automations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

    const toggleRule = async (id: string, currentEnabled: boolean) => {
        try {
            const res = await fetch(`/api/agency/automations/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: !currentEnabled }),
            });
            if (res.ok) {
                setRules(rules.map(r =>
                    r.id === id ? { ...r, enabled: !currentEnabled } : r
                ));
                toast.success('Automation updated');
            } else {
                toast.error('Failed to update automation');
            }
        } catch (error) {
            toast.error('Failed to update automation');
        }
    };

    const addFromTemplate = async (template: typeof AUTOMATION_TEMPLATES[0]) => {
        try {
            const res = await fetch('/api/agency/automations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: template.name || 'New Automation',
                    description: template.description,
                    trigger: template.trigger || 'task_status_changed',
                    triggerConfig: template.triggerConfig,
                    conditions: template.conditions,
                    actions: template.actions || [],
                    enabled: false,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setRules([data.data, ...rules]);
                setShowTemplates(false);
                toast.success('Automation added from template');
            } else {
                toast.error('Failed to create automation');
            }
        } catch (error) {
            toast.error('Failed to create automation');
        }
    };

    const deleteRule = async (id: string) => {
        try {
            const res = await fetch(`/api/agency/automations/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setRules(rules.filter(r => r.id !== id));
                toast.success('Automation deleted');
            } else {
                toast.error('Failed to delete automation');
            }
        } catch (error) {
            toast.error('Failed to delete automation');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Zap className="h-6 w-6 text-amber-500" />
                        Automations
                    </h1>
                    <p className="text-muted-foreground">
                        Automate workflows and save time with triggers and actions
                    </p>
                </div>
                <Button onClick={() => setShowTemplates(!showTemplates)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Automation
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">{rules.length}</div>
                        <div className="text-sm text-muted-foreground">Total Automations</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {rules.filter(r => r.enabled).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Active</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold">
                            {rules.reduce((sum, r) => sum + r.triggerCount, 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">Times Triggered</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-amber-600">
                            ~{Math.round(rules.reduce((sum, r) => sum + r.triggerCount, 0) * 2)}h
                        </div>
                        <div className="text-sm text-muted-foreground">Time Saved</div>
                    </CardContent>
                </Card>
            </div>

            {/* Templates */}
            {showTemplates && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Choose a Template</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {AUTOMATION_TEMPLATES.map((template, i) => (
                                <button
                                    key={i}
                                    onClick={() => addFromTemplate(template)}
                                    className="p-4 border rounded-lg text-left hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                                >
                                    <div className="font-medium mb-1">{template.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {template.description}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {TRIGGER_LABELS[template.trigger || '']?.label || template.trigger}
                                        </Badge>
                                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                                        {template.actions?.map((a, j) => (
                                            <Badge key={j} variant="outline" className="text-xs">
                                                {ACTION_LABELS[a.type]?.label || a.type}
                                            </Badge>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Rules List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Your Automations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {rules.length === 0 ? (
                        <div className="text-center py-8">
                            <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No automations yet</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setShowTemplates(true)}
                            >
                                Add from Template
                            </Button>
                        </div>
                    ) : (
                        rules.map(rule => (
                            <div
                                key={rule.id}
                                className={`p-4 border rounded-lg transition-all ${rule.enabled ? 'bg-background' : 'bg-muted/50 opacity-75'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{rule.name}</h3>
                                            {rule.enabled ? (
                                                <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs">Paused</Badge>
                                            )}
                                        </div>
                                        {rule.description && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {rule.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="secondary" className="gap-1">
                                                {TRIGGER_LABELS[rule.trigger]?.icon}
                                                {TRIGGER_LABELS[rule.trigger]?.label || rule.trigger}
                                            </Badge>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                            {rule.actions.map((action, i) => (
                                                <Badge key={i} variant="outline" className="gap-1">
                                                    {ACTION_LABELS[action.type]?.icon}
                                                    {ACTION_LABELS[action.type]?.label || action.type}
                                                </Badge>
                                            ))}
                                        </div>
                                        {rule.lastTriggered && (
                                            <div className="text-xs text-muted-foreground mt-2">
                                                Last triggered: {new Date(rule.lastTriggered).toLocaleDateString()}
                                                {' • '}{rule.triggerCount} times total
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={rule.enabled}
                                            onCheckedChange={() => toggleRule(rule.id, rule.enabled)}
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteRule(rule.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
