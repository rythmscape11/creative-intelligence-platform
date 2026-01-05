'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { FeatureKey, FeatureStatus, DEFAULT_FEATURE_FLAGS } from '@/lib/features';
import { useFeatures } from '@/context/feature-context';

const FEATURE_LABELS: Record<FeatureKey, string> = {
    strategiser: 'The Strategiser',
    analyser: 'The Analyser',
    agency_os: 'Agency OS',
    geo_engine: 'GEO Engine',
    optimiser: 'The Optimiser',
};

export function FeatureFlagSettings() {
    const { flags: initialFlags } = useFeatures();
    const [flags, setFlags] = useState<Record<FeatureKey, FeatureStatus>>(initialFlags);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleChange = (key: FeatureKey, value: FeatureStatus) => {
        setFlags((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feature_flags: flags,
                }),
            });

            if (!response.ok) throw new Error('Failed to update settings');

            toast({
                title: 'Settings saved',
                description: 'Feature flags have been updated successfully.',
            });

            router.refresh();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save feature flags.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
                <CardTitle>Feature Visibility</CardTitle>
                <CardDescription>
                    Manage which features are visible to users. 'Hidden' removes them entirely, 'Coming Soon' shows a placeholder, 'Live' enables full access.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {(Object.keys(DEFAULT_FEATURE_FLAGS) as FeatureKey[]).map((key) => (
                        <div key={key} className="space-y-2">
                            <Label className="text-base font-medium flex items-center justify-between">
                                {FEATURE_LABELS[key]}
                                <span className={`text-xs px-2 py-0.5 rounded-full ${flags[key] === 'LIVE' ? 'bg-green-500/20 text-green-500' :
                                    flags[key] === 'COMING_SOON' ? 'bg-amber-500/20 text-amber-500' :
                                        'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {flags[key]}
                                </span>
                            </Label>
                            <Select
                                value={flags[key]}
                                onValueChange={(value) => handleChange(key, value as FeatureStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LIVE">Live</SelectItem>
                                    <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                                    <SelectItem value="HIDDEN">Hidden</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-border-primary">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
