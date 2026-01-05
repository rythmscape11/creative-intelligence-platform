'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { Upload, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface BrandingSettingsProps {
  initialSettings?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    darkModePrimaryColor?: string;
    darkModeSecondaryColor?: string;
    darkModeAccentColor?: string;
  };
}

const DEFAULT_COLORS = {
  primaryColor: '#F59E0B',
  secondaryColor: '#8B5CF6',
  accentColor: '#10B981',
  darkModePrimaryColor: '#F59E0B',
  darkModeSecondaryColor: '#A78BFA',
  darkModeAccentColor: '#34D399',
};

export function BrandingSettings({ initialSettings }: BrandingSettingsProps) {
  const [logo, setLogo] = useState(initialSettings?.logo || '');
  const [logoPreview, setLogoPreview] = useState(initialSettings?.logo || '');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Color states
  const [primaryColor, setPrimaryColor] = useState(initialSettings?.primaryColor || DEFAULT_COLORS.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialSettings?.secondaryColor || DEFAULT_COLORS.secondaryColor);
  const [accentColor, setAccentColor] = useState(initialSettings?.accentColor || DEFAULT_COLORS.accentColor);
  const [darkModePrimaryColor, setDarkModePrimaryColor] = useState(initialSettings?.darkModePrimaryColor || DEFAULT_COLORS.darkModePrimaryColor);
  const [darkModeSecondaryColor, setDarkModeSecondaryColor] = useState(initialSettings?.darkModeSecondaryColor || DEFAULT_COLORS.darkModeSecondaryColor);
  const [darkModeAccentColor, setDarkModeAccentColor] = useState(initialSettings?.darkModeAccentColor || DEFAULT_COLORS.darkModeAccentColor);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        type: 'error',
        title: 'File Too Large',
        description: 'Logo must be less than 5MB',
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        type: 'error',
        title: 'Invalid File Type',
        description: 'Please upload a PNG, JPG, WEBP, or SVG file',
      });
      return;
    }

    setIsUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append('logo', file);

      const response = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload logo');
      }

      setLogo(data.data.url);
      setLogoPreview(data.data.url);

      toast({
        type: 'success',
        title: 'Logo Uploaded',
        description: 'Your logo has been uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        type: 'error',
        title: 'Upload Failed',
        description: error.message || 'Failed to upload logo',
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogo('');
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveColors = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logo,
          primaryColor,
          secondaryColor,
          accentColor,
          darkModePrimaryColor,
          darkModeSecondaryColor,
          darkModeAccentColor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      toast({
        type: 'success',
        title: 'Settings Saved',
        description: 'Your branding settings have been saved successfully. Refresh the page to see changes.',
      });

      // Reload page to apply new settings
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        type: 'error',
        title: 'Save Failed',
        description: error.message || 'Failed to save settings',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetColors = () => {
    setPrimaryColor(DEFAULT_COLORS.primaryColor);
    setSecondaryColor(DEFAULT_COLORS.secondaryColor);
    setAccentColor(DEFAULT_COLORS.accentColor);
    setDarkModePrimaryColor(DEFAULT_COLORS.darkModePrimaryColor);
    setDarkModeSecondaryColor(DEFAULT_COLORS.darkModeSecondaryColor);
    setDarkModeAccentColor(DEFAULT_COLORS.darkModeAccentColor);

    toast({
      type: 'success',
      title: 'Colors Reset',
      description: 'Colors have been reset to defaults. Click Save to apply.',
    });
  };

  return (
    <div className="space-y-8">
      {/* Logo Upload Section */}
      <div className="bg-bg-secondary rounded-lg border border-border-primary p-6">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Logo</h2>
        <p className="text-text-secondary mb-6">
          Upload your website logo. Supported formats: PNG, JPG, WEBP, SVG (max 5MB)
        </p>

        <div className="space-y-4">
          {/* Logo Preview */}
          {logoPreview && (
            <div className="relative inline-block">
              <div className="relative w-48 h-48 bg-bg-tertiary rounded-lg border-2 border-border-primary p-4 flex items-center justify-center">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={176}
                  height={176}
                  className="object-contain"
                />
              </div>
              <button
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                title="Remove logo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <Button
                type="button"
                variant="outline"
                disabled={isUploadingLogo}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              >
                {isUploadingLogo ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </>
                )}
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Color Scheme Section */}
      <div className="bg-bg-secondary rounded-lg border border-border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Color Scheme</h2>
            <p className="text-text-secondary mt-1">
              Customize your website's color palette
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetColors}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Light Mode Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Light Mode</h3>
            
            <ColorPicker
              label="Primary Color"
              value={primaryColor}
              onChange={setPrimaryColor}
            />
            
            <ColorPicker
              label="Secondary Color"
              value={secondaryColor}
              onChange={setSecondaryColor}
            />
            
            <ColorPicker
              label="Accent Color"
              value={accentColor}
              onChange={setAccentColor}
            />
          </div>

          {/* Dark Mode Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Dark Mode</h3>
            
            <ColorPicker
              label="Primary Color"
              value={darkModePrimaryColor}
              onChange={setDarkModePrimaryColor}
            />
            
            <ColorPicker
              label="Secondary Color"
              value={darkModeSecondaryColor}
              onChange={setDarkModeSecondaryColor}
            />
            
            <ColorPicker
              label="Accent Color"
              value={darkModeAccentColor}
              onChange={setDarkModeAccentColor}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSaveColors}
            disabled={isSaving}
            size="lg"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Color Picker Component
function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <label className="flex-1 text-sm font-medium text-text-primary">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded border-2 border-border-primary cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-3 py-2 rounded border border-border-primary bg-bg-tertiary text-text-primary text-sm font-mono"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
    </div>
  );
}

