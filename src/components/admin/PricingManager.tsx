'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import { Loader2, RefreshCw, Save, Plus, Trash2, Edit, X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PricingFeature {
    name: string;
    description?: string;
    included: boolean;
    limit?: string | number;
    highlight?: boolean;
}

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    tagline: string;
    targetAudience: string;
    priceMonthly: number;
    priceYearly: number;
    currency: string;
    razorpayIdMonthly?: string;
    razorpayIdYearly?: string;
    features: PricingFeature[];
    limits: Record<string, any>;
    popular: boolean;
    cta: string;
    ctaSecondary?: string;
    badge?: string;
    isActive: boolean;
}

const DEFAULT_PLAN: PricingPlan = {
    id: '',
    name: '',
    description: '',
    tagline: '',
    targetAudience: '',
    priceMonthly: 0,
    priceYearly: 0,
    currency: 'INR',
    features: [],
    limits: {},
    popular: false,
    cta: 'Subscribe',
    isActive: true
};

export function PricingManager() {
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch('/api/admin/pricing');
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            } else {
                toast.error('Failed to fetch pricing plans');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error loading plans');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingPlan) return;
        setSaving(true);
        try {
            const res = await fetch('/api/admin/pricing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingPlan),
            });

            if (res.ok) {
                const savedPlan = await res.json();
                setPlans(prev => {
                    const exists = prev.find(p => p.id === savedPlan.id);
                    if (exists) {
                        return prev.map(p => p.id === savedPlan.id ? savedPlan : p);
                    }
                    return [...prev, savedPlan];
                });
                toast.success('Plan saved successfully');
                setIsDialogOpen(false);
                setEditingPlan(null);
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to save plan');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error saving plan');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/pricing?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setPlans(plans.filter(p => p.id !== id));
                toast.success('Plan deleted');
            } else {
                toast.error('Failed to delete plan');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error deleting plan');
        }
    };

    const openEdit = (plan: PricingPlan) => {
        setEditingPlan({ ...plan }); // Deep copy needed if nested objects
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setEditingPlan({ ...DEFAULT_PLAN, features: [] });
        setIsDialogOpen(true);
    };

    // Feature Management Helpers
    const addFeature = () => {
        if (!editingPlan) return;
        setEditingPlan({
            ...editingPlan,
            features: [...editingPlan.features, { name: 'New Feature', included: true }]
        });
    };

    const updateFeature = (index: number, field: keyof PricingFeature, value: any) => {
        if (!editingPlan) return;
        const newFeatures = [...editingPlan.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setEditingPlan({ ...editingPlan, features: newFeatures });
    };

    const removeFeature = (index: number) => {
        if (!editingPlan) return;
        const newFeatures = [...editingPlan.features];
        newFeatures.splice(index, 1);
        setEditingPlan({ ...editingPlan, features: newFeatures });
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Pricing & Plans</h2>
                    <p className="text-muted-foreground">Manage subscription plans, features, and pricing.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchPlans} variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                    <Button onClick={openCreate} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Plan
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {plans.map((plan) => (
                    <Card key={plan.id} className={!plan.isActive ? 'opacity-60' : ''}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{plan.name}</CardTitle>
                                    <CardDescription>{plan.id}</CardDescription>
                                </div>
                                {plan.popular && <Badge variant="secondary">Popular</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-2xl font-bold">
                                ₹{(plan.priceMonthly / 100).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/mo</span>
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                                {plan.description}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {plan.features.slice(0, 3).map((f, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{f.name}</Badge>
                                ))}
                                {plan.features.length > 3 && <Badge variant="outline" className="text-xs">+{plan.features.length - 3}</Badge>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEdit(plan)}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(plan.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="text-xs text-muted-foreground flex flex-col items-end">
                                <span>{plan.razorpayIdMonthly ? '✅ Synced' : '⚠️ Unsynced'}</span>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{editingPlan?.id ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
                        <DialogDescription>Configure plan details, pricing, and features.</DialogDescription>
                    </DialogHeader>

                    {editingPlan && (
                        <ScrollArea className="flex-1 pr-4">
                            <Tabs defaultValue="general" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="general">General & Pricing</TabsTrigger>
                                    <TabsTrigger value="features">Features</TabsTrigger>
                                    <TabsTrigger value="ui">UI & Config</TabsTrigger>
                                </TabsList>

                                <TabsContent value="general" className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Plan ID (Unique)</Label>
                                            <Input
                                                value={editingPlan.id}
                                                onChange={e => setEditingPlan({ ...editingPlan, id: e.target.value })}
                                                disabled={!!plans.find(p => p.id === editingPlan.id && p.id !== '')} // Disable ID edit if exists
                                                placeholder="e.g. PRO"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input
                                                value={editingPlan.name}
                                                onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                                placeholder="e.g. Pro Plan"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Tagline</Label>
                                        <Input
                                            value={editingPlan.tagline}
                                            onChange={e => setEditingPlan({ ...editingPlan, tagline: e.target.value })}
                                            placeholder="e.g. The Daily Driver"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={editingPlan.description}
                                            onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                                            placeholder="Plan description..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                                        <div className="space-y-2">
                                            <Label>Monthly Price (₹)</Label>
                                            <Input
                                                type="number"
                                                value={editingPlan.priceMonthly / 100}
                                                onChange={e => setEditingPlan({ ...editingPlan, priceMonthly: parseFloat(e.target.value) * 100 })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Yearly Price (₹)</Label>
                                            <Input
                                                type="number"
                                                value={editingPlan.priceYearly / 100}
                                                onChange={e => setEditingPlan({ ...editingPlan, priceYearly: parseFloat(e.target.value) * 100 })}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="features" className="space-y-4 py-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-medium">Plan Features</h3>
                                        <Button size="sm" onClick={addFeature} variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Feature</Button>
                                    </div>

                                    <div className="space-y-3">
                                        {editingPlan.features.map((feature, idx) => (
                                            <div key={idx} className="flex gap-2 items-start border p-2 rounded-md bg-muted/20">
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        value={feature.name}
                                                        onChange={e => updateFeature(idx, 'name', e.target.value)}
                                                        placeholder="Feature Name"
                                                        className="h-8"
                                                    />
                                                    <Input
                                                        value={feature.description || ''}
                                                        onChange={e => updateFeature(idx, 'description', e.target.value)}
                                                        placeholder="Description (optional)"
                                                        className="h-8 text-xs"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2 items-center pt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs">Inc.</Label>
                                                        <Switch
                                                            checked={feature.included}
                                                            onCheckedChange={c => updateFeature(idx, 'included', c)}
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Label className="text-xs">High.</Label>
                                                        <Switch
                                                            checked={feature.highlight}
                                                            onCheckedChange={c => updateFeature(idx, 'highlight', c)}
                                                        />
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFeature(idx)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="ui" className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>CTA Text</Label>
                                            <Input
                                                value={editingPlan.cta}
                                                onChange={e => setEditingPlan({ ...editingPlan, cta: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Badge Text</Label>
                                            <Input
                                                value={editingPlan.badge || ''}
                                                onChange={e => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                                                placeholder="e.g. Most Popular"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border p-3 rounded-md">
                                        <Label>Popular Plan?</Label>
                                        <Switch
                                            checked={editingPlan.popular}
                                            onCheckedChange={c => setEditingPlan({ ...editingPlan, popular: c })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between border p-3 rounded-md">
                                        <Label>Active?</Label>
                                        <Switch
                                            checked={editingPlan.isActive}
                                            onCheckedChange={c => setEditingPlan({ ...editingPlan, isActive: c })}
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </ScrollArea>
                    )}

                    <DialogFooter className="pt-4 border-t">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save & Sync
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
