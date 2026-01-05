'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toaster';
import { Loader2, Save, Upload, Palette, Globe, Layout, Shield } from 'lucide-react';

interface BrandingSettings {
    logoUrl?: string;
    logoLightUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    customDomain?: string;
    hideAureonBranding?: boolean;
    customFooterText?: string;
}

export default function AgencyBrandingPage() {
    const [settings, setSettings] = useState<BrandingSettings>({
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#06b6d4',
        hideAureonBranding: true
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/agency/branding');
                if (res.ok) {
                    const data = await res.json();
                    if (data.id) setSettings(data);
                }
            } catch (error) {
                console.error('Failed to load settings', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (key: keyof BrandingSettings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/agency/branding', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!res.ok) throw new Error('Failed to save');

            toast({ title: 'Success', description: 'Branding settings updated.', type: 'success' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update settings.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-96"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-8 p-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Agency Branding</h1>
                <p className="text-muted-foreground mt-2">
                    Customize the look and feel of your client reports and portal.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Visual Identity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-primary" />
                            Visual Assets
                        </CardTitle>
                        <CardDescription>Upload your agency logo and favicon.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Dark Mode Logo URL</Label>
                            <Input
                                placeholder="https://..."
                                value={settings.logoUrl || ''}
                                onChange={e => handleChange('logoUrl', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Used on dark backgrounds (dashboard sidebar).</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Light Mode Logo URL</Label>
                            <Input
                                placeholder="https://..."
                                value={settings.logoLightUrl || ''}
                                onChange={e => handleChange('logoLightUrl', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">Used on light backgrounds (PDF reports).</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Favicon URL</Label>
                            <Input
                                placeholder="https://..."
                                value={settings.faviconUrl || ''}
                                onChange={e => handleChange('faviconUrl', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Brand Colors */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-purple-500" />
                            Brand Colors
                        </CardTitle>
                        <CardDescription>Define your primary brand colors for reports.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Primary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="w-12 h-10 p-1 cursor-pointer"
                                        value={settings.primaryColor}
                                        onChange={e => handleChange('primaryColor', e.target.value)}
                                    />
                                    <Input
                                        value={settings.primaryColor}
                                        onChange={e => handleChange('primaryColor', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Secondary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="w-12 h-10 p-1 cursor-pointer"
                                        value={settings.secondaryColor}
                                        onChange={e => handleChange('secondaryColor', e.target.value)}
                                    />
                                    <Input
                                        value={settings.secondaryColor}
                                        onChange={e => handleChange('secondaryColor', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Accent Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        className="w-12 h-10 p-1 cursor-pointer"
                                        value={settings.accentColor}
                                        onChange={e => handleChange('accentColor', e.target.value)}
                                    />
                                    <Input
                                        value={settings.accentColor}
                                        onChange={e => handleChange('accentColor', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-lg border border-border bg-gradient-to-r from-card to-muted flex items-center justify-center gap-4">
                            <span className="text-sm font-medium">Preview:</span>
                            <div className="h-8 w-8 rounded shadow" style={{ backgroundColor: settings.primaryColor }}></div>
                            <div className="h-8 w-8 rounded shadow" style={{ backgroundColor: settings.secondaryColor }}></div>
                            <div className="h-8 w-8 rounded shadow" style={{ backgroundColor: settings.accentColor }}></div>
                        </div>
                    </CardContent>
                </Card>

                {/* Whitelabel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-green-500" />
                            White-label Settings
                        </CardTitle>
                        <CardDescription>Control branding visibility on reports.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                            <Label htmlFor="hide-brand" className="flex flex-col space-y-1">
                                <span>Hide "Powered by Aureon One"</span>
                                <span className="font-normal text-xs text-muted-foreground">Remove platform branding from exported PDFs.</span>
                            </Label>
                            <Switch
                                id="hide-brand"
                                checked={settings.hideAureonBranding}
                                onCheckedChange={c => handleChange('hideAureonBranding', c)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Custom Footer Text</Label>
                            <Input
                                placeholder="e.g. Generated by Acme Agency for Client Corp."
                                value={settings.customFooterText || ''}
                                onChange={e => handleChange('customFooterText', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Domain (Placeholder) */}
                <Card className="opacity-75 relative">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" />
                            Custom Domain
                        </CardTitle>
                        <CardDescription>Connect your own domain (e.g. portal.acme.com).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Domain</Label>
                            <Input
                                placeholder="Enter domain..."
                                value={settings.customDomain || ''}
                                onChange={e => handleChange('customDomain', e.target.value)}
                                disabled
                            />
                            <p className="text-xs text-muted-foreground flex items-center gap-1 text-yellow-500">
                                <Shield className="w-3 h-3" /> Enterprise Feature (Coming Soon)
                            </p>
                        </div>
                    </CardContent>
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">

                    </div>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={isSaving} size="lg">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
        </div>
    );
}
