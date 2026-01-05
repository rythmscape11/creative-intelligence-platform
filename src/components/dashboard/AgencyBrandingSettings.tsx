'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
    Palette,
    Upload,
    Globe,
    Save,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Eye,
    Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface BrandingSettings {
    logoUrl: string | null;
    logoLightUrl: string | null;
    faviconUrl: string | null;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
    customDomain: string | null;
    domainVerified: boolean;
    hideMediaPlanPro: boolean;
    customFooterText: string | null;
    pdfHeaderHtml: string | null;
    pdfFooterHtml: string | null;
}

const FONT_OPTIONS = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Playfair Display',
    'Source Sans Pro',
];

export function AgencyBrandingSettings() {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [settings, setSettings] = useState<BrandingSettings>({
        logoUrl: null,
        logoLightUrl: null,
        faviconUrl: null,
        primaryColor: '#6366f1',
        secondaryColor: '#8b5cf6',
        accentColor: '#06b6d4',
        headingFont: 'Inter',
        bodyFont: 'Inter',
        customDomain: null,
        domainVerified: false,
        hideMediaPlanPro: true,
        customFooterText: null,
        pdfHeaderHtml: null,
        pdfFooterHtml: null,
    });

    useEffect(() => {
        if (isLoaded) {
            fetchBrandingSettings();
        }
    }, [isLoaded]);

    const fetchBrandingSettings = async () => {
        try {
            const response = await fetch('/api/agency/branding');
            const data = await response.json();

            if (response.ok) {
                setHasAccess(true);
                setSettings(data.branding);
                setIsNew(data.isNew);
            } else if (response.status === 403) {
                setHasAccess(false);
            }
        } catch (error) {
            console.error('Failed to fetch branding settings:', error);
            toast.error('Failed to load branding settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/agency/branding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Branding settings saved successfully!');
                setIsNew(false);
            } else {
                toast.error(data.error || 'Failed to save settings');
            }
        } catch (error) {
            console.error('Failed to save branding settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleColorChange = (field: keyof BrandingSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (field: keyof BrandingSettings, value: string | boolean | null) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-xl p-8 text-center">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Agency Plan Required
                </h3>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                    White-label branding is available on the Agency plan. Customize your brand,
                    add your logo, and deliver professional reports under your own brand.
                </p>
                <Link href="/pricing?plan=agency">
                    <Button className="bg-purple-500 hover:bg-purple-600">
                        Upgrade to Agency - $299/mo
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Palette className="w-6 h-6 text-purple-400" />
                        Agency Branding
                    </h2>
                    <p className="text-text-secondary mt-1">
                        Customize your white-label reports and client deliverables
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-purple-500 hover:bg-purple-600"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            {isNew && (
                <div className="flex items-center gap-2 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-cyan-400" />
                    <p className="text-sm text-text-secondary">
                        Welcome! Set up your agency branding to start creating white-labeled reports.
                    </p>
                </div>
            )}

            {/* Logo Section */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-purple-400" />
                    Logo & Favicon
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Primary Logo */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Primary Logo (Dark BG)
                        </label>
                        <input
                            type="text"
                            value={settings.logoUrl || ''}
                            onChange={(e) => handleInputChange('logoUrl', e.target.value || null)}
                            placeholder="https://example.com/logo.png"
                            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {settings.logoUrl && (
                            <div className="mt-2 p-4 bg-gray-900 rounded-lg">
                                <img src={settings.logoUrl} alt="Logo preview" className="h-12 object-contain" />
                            </div>
                        )}
                    </div>

                    {/* Light Logo */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Light Logo (Light BG)
                        </label>
                        <input
                            type="text"
                            value={settings.logoLightUrl || ''}
                            onChange={(e) => handleInputChange('logoLightUrl', e.target.value || null)}
                            placeholder="https://example.com/logo-light.png"
                            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {settings.logoLightUrl && (
                            <div className="mt-2 p-4 bg-white rounded-lg">
                                <img src={settings.logoLightUrl} alt="Light logo preview" className="h-12 object-contain" />
                            </div>
                        )}
                    </div>

                    {/* Favicon */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Favicon
                        </label>
                        <input
                            type="text"
                            value={settings.faviconUrl || ''}
                            onChange={(e) => handleInputChange('faviconUrl', e.target.value || null)}
                            placeholder="https://example.com/favicon.ico"
                            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        {settings.faviconUrl && (
                            <div className="mt-2 flex items-center gap-2">
                                <img src={settings.faviconUrl} alt="Favicon preview" className="h-8 w-8 object-contain" />
                                <span className="text-xs text-text-tertiary">32x32 recommended</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Colors Section */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Brand Colors
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Primary Color */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Primary Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                                className="h-10 w-16 rounded cursor-pointer border-none"
                            />
                            <input
                                type="text"
                                value={settings.primaryColor}
                                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                                className="flex-1 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary uppercase"
                            />
                        </div>
                    </div>

                    {/* Secondary Color */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Secondary Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.secondaryColor}
                                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                                className="h-10 w-16 rounded cursor-pointer border-none"
                            />
                            <input
                                type="text"
                                value={settings.secondaryColor}
                                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                                className="flex-1 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary uppercase"
                            />
                        </div>
                    </div>

                    {/* Accent Color */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Accent Color
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.accentColor}
                                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                                className="h-10 w-16 rounded cursor-pointer border-none"
                            />
                            <input
                                type="text"
                                value={settings.accentColor}
                                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                                className="flex-1 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary uppercase"
                            />
                        </div>
                    </div>
                </div>

                {/* Color Preview */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Preview
                    </label>
                    <div className="flex gap-2">
                        <div
                            className="h-12 flex-1 rounded-lg flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: settings.primaryColor }}
                        >
                            Primary
                        </div>
                        <div
                            className="h-12 flex-1 rounded-lg flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: settings.secondaryColor }}
                        >
                            Secondary
                        </div>
                        <div
                            className="h-12 flex-1 rounded-lg flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: settings.accentColor }}
                        >
                            Accent
                        </div>
                    </div>
                </div>
            </div>

            {/* Typography Section */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Typography
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Heading Font */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Heading Font
                        </label>
                        <select
                            value={settings.headingFont}
                            onChange={(e) => handleInputChange('headingFont', e.target.value)}
                            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {FONT_OPTIONS.map((font) => (
                                <option key={font} value={font}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Body Font */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Body Font
                        </label>
                        <select
                            value={settings.bodyFont}
                            onChange={(e) => handleInputChange('bodyFont', e.target.value)}
                            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {FONT_OPTIONS.map((font) => (
                                <option key={font} value={font}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Custom Domain Section */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Custom Domain (Coming Soon)
                </h3>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Custom Report Domain
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={settings.customDomain || ''}
                            onChange={(e) => handleInputChange('customDomain', e.target.value || null)}
                            placeholder="reports.youragency.com"
                            disabled
                            className="flex-1 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder:text-text-tertiary opacity-50 cursor-not-allowed"
                        />
                        {settings.domainVerified ? (
                            <span className="flex items-center gap-1 text-green-400 text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                Verified
                            </span>
                        ) : (
                            <span className="text-xs text-text-tertiary">
                                Coming soon
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* White-label Settings */}
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                    White-Label Settings
                </h3>

                <div className="space-y-4">
                    {/* Hide MediaPlanPro */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={settings.hideMediaPlanPro}
                            onChange={(e) => handleInputChange('hideMediaPlanPro', e.target.checked)}
                            className="w-5 h-5 rounded border-border-primary bg-bg-tertiary text-purple-500 focus:ring-purple-500"
                        />
                        <div>
                            <span className="text-text-primary font-medium">Hide MediaPlanPro branding</span>
                            <p className="text-sm text-text-tertiary">
                                Remove "Powered by MediaPlanPro" from all reports and exports
                            </p>
                        </div>
                    </label>

                    {/* Custom Footer */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Custom Footer Text
                        </label>
                        <input
                            type="text"
                            value={settings.customFooterText || ''}
                            onChange={(e) => handleInputChange('customFooterText', e.target.value || null)}
                            placeholder="© 2024 Your Agency Name. All rights reserved."
                            className="w-full px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Preview Button */}
            <div className="flex justify-end">
                <Button variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Preview Report
                </Button>
            </div>
        </div>
    );
}
