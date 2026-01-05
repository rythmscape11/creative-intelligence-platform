'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, BarChart3, Tag, Facebook } from 'lucide-react';

export function TrackingSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    gaTrackingId: process.env.NEXT_PUBLIC_GA_TRACKING_ID || '',
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX',
    fbPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  });

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast({
      title: 'Settings Saved',
      description: 'Tracking settings have been updated. Please restart the application for changes to take effect.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Google Analytics 4 */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>Google Analytics 4</CardTitle>
              <CardDescription>
                Track website traffic and user behavior
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gaTrackingId">Measurement ID</Label>
            <Input
              id="gaTrackingId"
              value={settings.gaTrackingId}
              onChange={(e) => handleChange('gaTrackingId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
            <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
              Find your Measurement ID in Google Analytics → Admin → Data Streams
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--color-primary-yellow-light)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-charcoal)' }}>
              Tracked Events:
            </p>
            <ul className="text-sm space-y-1" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
              <li>• Page views</li>
              <li>• Strategy creation</li>
              <li>• Strategy exports</li>
              <li>• Blog post views</li>
              <li>• User registrations</li>
              <li>• User logins</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Google Tag Manager */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--gradient-secondary)' }}
            >
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>Google Tag Manager</CardTitle>
              <CardDescription>
                Manage all your marketing tags in one place
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gtmId">Container ID</Label>
            <Input
              id="gtmId"
              value={settings.gtmId}
              onChange={(e) => handleChange('gtmId', e.target.value)}
              placeholder="GTM-XXXXXXX"
            />
            <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
              Find your Container ID in Google Tag Manager → Admin → Container Settings
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--color-accent-amber-light)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-charcoal)' }}>
              Current Container ID:
            </p>
            <code className="text-sm font-mono px-2 py-1 rounded" style={{ background: 'white' }}>
              {settings.gtmId}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Facebook Pixel */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--gradient-accent)' }}
            >
              <Facebook className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>Facebook Pixel</CardTitle>
              <CardDescription>
                Track conversions and build audiences for Facebook Ads
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fbPixelId">Pixel ID</Label>
            <Input
              id="fbPixelId"
              value={settings.fbPixelId}
              onChange={(e) => handleChange('fbPixelId', e.target.value)}
              placeholder="XXXXXXXXXXXXXXX"
            />
            <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
              Find your Pixel ID in Facebook Events Manager → Data Sources
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'var(--color-secondary-peach-light)' }}>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-neutral-charcoal)' }}>
              Tracked Events:
            </p>
            <ul className="text-sm space-y-1" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.8 }}>
              <li>• PageView</li>
              <li>• Lead (strategy creation)</li>
              <li>• CompleteRegistration (user signup, export)</li>
              <li>• ViewContent (blog views)</li>
              <li>• Share (strategy sharing)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card className="glass-card">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}>
              Note: Changes require application restart to take effect
            </p>
            <Button onClick={handleSave} className="btn btn-primary">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Variables Info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
          <CardDescription>
            Add these to your .env.local file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg font-mono text-sm" style={{ background: 'var(--color-neutral-charcoal)', color: 'white' }}>
            <pre>
{`NEXT_PUBLIC_GA_TRACKING_ID=${settings.gaTrackingId || 'G-XXXXXXXXXX'}
NEXT_PUBLIC_GTM_ID=${settings.gtmId}
NEXT_PUBLIC_FB_PIXEL_ID=${settings.fbPixelId || 'XXXXXXXXXXXXXXX'}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

