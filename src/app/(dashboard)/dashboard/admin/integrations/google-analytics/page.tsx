'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  XCircle,
  Save,
  TestTube,
  RefreshCw,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { toast } from '@/components/ui/toaster';

type AutomationSettings = {
  trackPageViews: boolean;
  trackEvents: boolean;
  trackConversions: boolean;
  trackEcommerce: boolean;
};

type GoogleAnalyticsSettings = {
  propertyId: string;
  measurementId: string;
  apiSecret?: string;
  automations: AutomationSettings;
};

type GoogleAnalyticsIntegration = {
  id: string;
  type: string;
  status?: string;
  settings?: GoogleAnalyticsSettings;
  lastSyncAt?: string | null;
};

type IntegrationListResponse = {
  success: boolean;
  integrations: GoogleAnalyticsIntegration[];
};

type GoogleAnalyticsProperty = {
  propertyId: string;
  measurementId?: string;
  displayName?: string;
  name?: string;
};

type TestConnectionResponse = {
  success: boolean;
  message?: string;
  error?: string;
  properties?: GoogleAnalyticsProperty[];
};

type TestResult =
  | { success: true; message?: string; properties?: GoogleAnalyticsProperty[] }
  | { success: false; message: string };

export default function GoogleAnalyticsConfigPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [integration, setIntegration] = useState<GoogleAnalyticsIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const [formData, setFormData] = useState<GoogleAnalyticsSettings>({
    propertyId: '',
    measurementId: '',
    apiSecret: '',
    automations: {
      trackPageViews: true,
      trackEvents: true,
      trackConversions: true,
      trackEcommerce: false,
    },
  });

  const [properties, setProperties] = useState<GoogleAnalyticsProperty[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const fetchIntegration = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/integrations?type=GOOGLE_ANALYTICS');
      const data: IntegrationListResponse = await response.json();

      const gaIntegration = data.success ? data.integrations[0] : null;
      if (gaIntegration) {
        setIntegration(gaIntegration);

        const settings = gaIntegration.settings;
        setFormData({
          propertyId: settings?.propertyId || '',
          measurementId: settings?.measurementId || '',
          apiSecret: '',
          automations: settings?.automations || {
            trackPageViews: true,
            trackEvents: true,
            trackConversions: true,
            trackEcommerce: false,
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch integration:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/auth/signin');
      return;
    }

    if ((user?.publicMetadata?.role as string) !== 'ADMIN') {
      router.push('/unauthorized');
      return;
    }

    fetchIntegration();
  }, [fetchIntegration, router, user, isLoaded, isSignedIn]);

  const handleConnect = async () => {
    try {
      setConnecting(true);

      // Redirect to OAuth authorization endpoint
      window.location.href = '/api/integrations/google-analytics/auth';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect to Google Analytics';
      console.error('Failed to initiate OAuth:', error);
      toast({
        type: 'error',
        title: 'Connection Failed',
        description: message,
      });
      setConnecting(false);
    }
  };

  const handleTestConnection = async () => {
    if (!integration) {
      toast({
        type: 'error',
        title: 'Not Connected',
        description: 'Please connect to Google Analytics first',
      });
      return;
    }

    try {
      setTesting(true);
      setTestResult(null);

      const response = await fetch('/api/integrations/google-analytics/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data: TestConnectionResponse = await response.json();

      if (data.success) {
        setTestResult({
          success: true,
          message: data.message,
          properties: data.properties,
        });

        setProperties(data.properties || []);

        toast({
          type: 'success',
          title: 'Connection Successful',
          description: `Found ${data.properties?.length || 0} GA4 properties`,
        });
      } else {
        const message = data.error || 'Connection test failed';
        setTestResult({
          success: false,
          message,
        });

        toast({
          type: 'error',
          title: 'Connection Failed',
          description: message,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection test failed';
      console.error('Test connection error:', error);
      setTestResult({
        success: false,
        message,
      });

      toast({
        type: 'error',
        title: 'Test Failed',
        description: message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!integration) {
      toast({
        type: 'error',
        title: 'Not Connected',
        description: 'Please connect to Google Analytics first',
      });
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/integrations/${integration.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: {
            ...integration.settings,
            propertyId: formData.propertyId,
            measurementId: formData.measurementId,
            apiSecret: formData.apiSecret || integration.settings?.apiSecret,
            automations: formData.automations,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          type: 'success',
          title: 'Settings Saved',
          description: 'Google Analytics configuration updated successfully',
        });

        fetchIntegration();
      } else {
        toast({
          type: 'error',
          title: 'Save Failed',
          description: data.error || 'Failed to save settings',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save settings';
      console.error('Save error:', error);
      toast({
        type: 'error',
        title: 'Save Failed',
        description: message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!integration) return;

    if (!confirm('Are you sure you want to disconnect Google Analytics? This will stop all tracking and reporting.')) {
      return;
    }

    try {
      const response = await fetch(`/api/integrations/${integration.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          type: 'success',
          title: 'Disconnected',
          description: 'Google Analytics has been disconnected',
        });

        setIntegration(null);
        setFormData({
          propertyId: '',
          measurementId: '',
          apiSecret: '',
          automations: {
            trackPageViews: true,
            trackEvents: true,
            trackConversions: true,
            trackEcommerce: false,
          },
        });
      } else {
        toast({
          type: 'error',
          title: 'Disconnect Failed',
          description: data.error || 'Failed to disconnect',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect';
      console.error('Disconnect error:', error);
      toast({
        type: 'error',
        title: 'Disconnect Failed',
        description: message,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#F59E0B] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Google Analytics configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin/integrations"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Integrations
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Google Analytics</h1>
                <p className="text-gray-400 mt-1">Web analytics and event tracking</p>
              </div>
            </div>

            {integration && (
              <div className="flex items-center space-x-2">
                {integration.status === 'ACTIVE' ? (
                  <span className="flex items-center text-green-400">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center text-red-400">
                    <XCircle className="w-5 h-5 mr-2" />
                    Disconnected
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Connection Status Card */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Connection Status</h2>

          {!integration ? (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">
                Connect your Google Analytics account to start tracking website analytics and user behavior.
              </p>
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="px-6 py-3 bg-[#F59E0B] text-black rounded-lg hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold inline-flex items-center"
              >
                {connecting ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Connect Google Analytics
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-white font-medium">{integration.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Synced</p>
                  <p className="text-white font-medium">
                    {integration.lastSyncAt
                      ? new Date(integration.lastSyncAt).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                >
                  {testing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </button>

                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Disconnect
                </button>
              </div>

              {testResult && (
                <div
                  className={`mt-4 p-4 rounded-lg ${testResult.success
                    ? 'bg-green-900/20 border border-green-800'
                    : 'bg-red-900/20 border border-red-800'
                    }`}
                >
                  <div className="flex items-start">
                    {testResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={testResult.success ? 'text-green-400' : 'text-red-400'}>
                        {testResult.message}
                      </p>
                      {testResult.success && testResult.properties && testResult.properties.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-400 mb-2">Available Properties:</p>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {testResult.properties.map((prop: GoogleAnalyticsProperty, index: number) => (
                              <li key={index}>• {prop.displayName} ({prop.name})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configuration Form */}
        {integration && (
          <>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>

              <div className="space-y-4">
                {/* Property Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GA4 Property ID
                  </label>
                  {properties.length > 0 ? (
                    <select
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]"
                    >
                      <option value="">Select a property</option>
                      {properties.map((prop) => (
                        <option key={prop.name} value={prop.name}>
                          {prop.displayName} ({prop.name})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                      placeholder="properties/123456789"
                      className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F59E0B]"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Test connection to load available properties
                  </p>
                </div>

                {/* Measurement ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Measurement ID
                  </label>
                  <input
                    type="text"
                    value={formData.measurementId}
                    onChange={(e) => setFormData({ ...formData, measurementId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F59E0B]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Required for event tracking via Measurement Protocol
                  </p>
                </div>

                {/* API Secret */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Measurement Protocol API Secret
                  </label>
                  <input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    placeholder="Enter API secret (leave blank to keep existing)"
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F59E0B]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Create in GA4: Admin → Data Streams → Measurement Protocol API secrets
                  </p>
                </div>
              </div>
            </div>

            {/* Automation Settings */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Automation Settings</h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg cursor-pointer hover:bg-[#222222] transition-colors">
                  <span className="text-white">Track Page Views</span>
                  <input
                    type="checkbox"
                    checked={formData.automations.trackPageViews}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        automations: { ...formData.automations, trackPageViews: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-[#F59E0B] bg-gray-700 border-gray-600 rounded focus:ring-[#F59E0B]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg cursor-pointer hover:bg-[#222222] transition-colors">
                  <span className="text-white">Track Custom Events</span>
                  <input
                    type="checkbox"
                    checked={formData.automations.trackEvents}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        automations: { ...formData.automations, trackEvents: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-[#F59E0B] bg-gray-700 border-gray-600 rounded focus:ring-[#F59E0B]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg cursor-pointer hover:bg-[#222222] transition-colors">
                  <span className="text-white">Track Conversions</span>
                  <input
                    type="checkbox"
                    checked={formData.automations.trackConversions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        automations: { ...formData.automations, trackConversions: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-[#F59E0B] bg-gray-700 border-gray-600 rounded focus:ring-[#F59E0B]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg cursor-pointer hover:bg-[#222222] transition-colors">
                  <span className="text-white">Track E-commerce</span>
                  <input
                    type="checkbox"
                    checked={formData.automations.trackEcommerce}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        automations: { ...formData.automations, trackEcommerce: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-[#F59E0B] bg-gray-700 border-gray-600 rounded focus:ring-[#F59E0B]"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-3">
              <Link
                href="/dashboard/admin/integrations/google-analytics/reports"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View Reports
              </Link>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-[#F59E0B] text-black rounded-lg hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold inline-flex items-center"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
