'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  TestTube,
  RefreshCw,
} from 'lucide-react';
import { toast } from '@/components/ui/toaster';
import { MailchimpAnalytics } from '@/components/integrations/mailchimp-analytics';

type MailchimpAutomations = {
  syncContacts: boolean;
  syncInquiries: boolean;
  syncPurchases: boolean;
  sendBlogNewsletters: boolean;
};

type MailchimpSettings = {
  defaultAudienceId: string;
  automations: MailchimpAutomations;
};

type MailchimpIntegration = {
  id: string;
  serverPrefix?: string;
  settings?: MailchimpSettings;
};

type IntegrationListResponse = {
  success: boolean;
  integrations: MailchimpIntegration[];
};

type MailchimpAudience = {
  id: string;
  name: string;
  stats?: {
    member_count: number;
  };
};

type TestConnectionResponse = {
  success: boolean;
  connected?: boolean;
  audiences: MailchimpAudience[];
  error?: string;
};

type TestResult =
  | { success: true; audiences: MailchimpAudience[] }
  | { success: false; error?: string };

type FormState = {
  apiKey: string;
  serverPrefix: string;
  defaultAudienceId: string;
  automations: MailchimpAutomations;
};

const DEFAULT_AUTOMATIONS: MailchimpAutomations = {
  syncContacts: true,
  syncInquiries: true,
  syncPurchases: true,
  sendBlogNewsletters: false,
};

export default function MailchimpConfigPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [integration, setIntegration] = useState<MailchimpIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    apiKey: '',
    serverPrefix: '',
    defaultAudienceId: '',
    automations: DEFAULT_AUTOMATIONS,
  });

  const [audiences, setAudiences] = useState<MailchimpAudience[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const fetchIntegration = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/integrations?type=MAILCHIMP');
      const data: IntegrationListResponse = await response.json();

      const mailchimpIntegration = data.success ? data.integrations[0] : null;
      if (mailchimpIntegration) {
        setIntegration(mailchimpIntegration);
        setFormData({
          apiKey: '',
          serverPrefix: mailchimpIntegration.serverPrefix || '',
          defaultAudienceId: mailchimpIntegration.settings?.defaultAudienceId || '',
          automations: mailchimpIntegration.settings?.automations || DEFAULT_AUTOMATIONS,
        });
      } else {
        setIntegration(null);
        setFormData({
          apiKey: '',
          serverPrefix: '',
          defaultAudienceId: '',
          automations: DEFAULT_AUTOMATIONS,
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

  const handleTestConnection = async () => {
    if (!formData.apiKey || !formData.serverPrefix) {
      toast({
        type: 'error',
        title: 'Missing Credentials',
        description: 'Please enter both API key and server prefix',
      });
      return;
    }

    try {
      setTesting(true);
      setTestResult(null);

      const response = await fetch('/api/integrations/mailchimp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: formData.apiKey,
          serverPrefix: formData.serverPrefix,
          integrationId: integration?.id,
        }),
      });

      const data: TestConnectionResponse = await response.json();

      if (data.success && data.connected) {
        setTestResult({ success: true, audiences: data.audiences || [] });
        setAudiences(data.audiences || []);
        toast({
          type: 'success',
          title: 'Connection Successful',
          description: `Found ${data.audiences?.length || 0} audience(s)`,
        });
      } else {
        setTestResult({ success: false, error: data.error });
        toast({
          type: 'error',
          title: 'Connection Failed',
          description: data.error || 'Failed to connect to Mailchimp',
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect to Mailchimp';
      console.error('Test connection failed:', error);
      setTestResult({ success: false, error: message });
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
    if (!formData.apiKey || !formData.serverPrefix) {
      toast({
        type: 'error',
        title: 'Missing Credentials',
        description: 'Please enter both API key and server prefix',
      });
      return;
    }

    try {
      setSaving(true);

      const payload = {
        type: 'MAILCHIMP',
        category: 'EMAIL_MARKETING',
        name: 'Mailchimp',
        description: 'Email marketing and automation platform',
        apiKey: formData.apiKey,
        serverPrefix: formData.serverPrefix,
        settings: {
          defaultAudienceId: formData.defaultAudienceId,
          automations: formData.automations,
        },
        isActive: true,
      };

      const response = integration
        ? await fetch(`/api/integrations/${integration.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        : await fetch('/api/integrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

      const data = await response.json();

      if (data.success) {
        toast({
          type: 'success',
          title: 'Saved Successfully',
          description: 'Mailchimp integration has been configured',
        });
        await fetchIntegration();
      } else {
        throw new Error(data.error || 'Failed to save integration');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save integration';
      console.error('Save integration failed:', error);
      toast({
        type: 'error',
        title: 'Save Failed',
        description: message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-accent-secondary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading Mailchimp integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/dashboard/admin/integrations"
              className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Integrations
            </Link>
            <h1 className="text-4xl font-bold text-text-primary flex items-center gap-3">
              <Mail className="h-8 w-8 text-accent-secondary" />
              Mailchimp Integration
            </h1>
            <p className="text-text-secondary mt-2">
              Connect and sync your Mailchimp account with Aureon One
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-border-primary text-text-primary hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.apiKey || !formData.serverPrefix}
              className="inline-flex items-center px-6 py-3 rounded-lg bg-accent-secondary text-black font-semibold hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-bg-secondary rounded-xl border border-border-primary p-6 mb-8">
          <div className="flex items-center gap-4">
            {integration ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500/10 text-green-400">
                <CheckCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 text-red-400">
                <XCircle className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-sm text-text-secondary">Connection status</p>
              <p className="text-xl font-semibold text-text-primary">
                {integration ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
        </div>

        {/* Connection Form */}
        <div className="bg-bg-secondary rounded-xl border border-border-primary p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Connection Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter your Mailchimp API key"
                className="w-full px-4 py-3 rounded-lg border border-border-primary bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-secondary text-text-primary"
              />
              <p className="mt-2 text-sm text-text-secondary">
                Your API key is encrypted and never stored in plain text
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">
                Server Prefix <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.serverPrefix}
                onChange={(e) => setFormData({ ...formData, serverPrefix: e.target.value })}
                placeholder="e.g., us1, us2, us3"
                className="w-full px-4 py-3 rounded-lg border border-border-primary bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-secondary text-text-primary"
              />
              <p className="mt-2 text-sm text-text-secondary">
                Find this in your API key (the part after the dash, e.g., &quot;us1&quot; from &quot;abc123-us1&quot;)
              </p>
            </div>
          </div>

          {testResult && (
            <div
              className={`rounded-lg p-4 flex items-start gap-3 border ${testResult.success
                ? 'bg-green-500/5 border-green-500/40 text-green-400'
                : 'bg-red-500/5 border-red-500/40 text-red-400'
                }`}
            >
              <div className="mt-1">
                {testResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-semibold text-lg mb-1">
                  {testResult.success ? 'Connected' : 'Connection Failed'}
                </p>
                {testResult.success ? (
                  <p>Found {testResult.audiences.length} audiences available in your Mailchimp account.</p>
                ) : (
                  <p>{testResult.error || 'Unable to connect with the provided credentials.'}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Audience Selection */}
        {audiences.length > 0 && (
          <div className="bg-bg-secondary rounded-xl border border-border-primary p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Audience Settings</h2>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-primary">
                Default Audience
              </label>
              <select
                value={formData.defaultAudienceId}
                onChange={(e) => setFormData({ ...formData, defaultAudienceId: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border-primary bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-secondary text-text-primary"
              >
                <option value="">Select an audience...</option>
                {audiences.map((audience) => (
                  <option key={audience.id} value={audience.id}>
                    {audience.name}
                    {audience.stats ? ` (${audience.stats.member_count} members)` : ''}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-text-secondary">
                New contacts will be added to this audience by default
              </p>
            </div>
          </div>
        )}

        {/* Automation Settings */}
        <div className="bg-bg-secondary rounded-xl border border-border-primary p-8 mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Automation Settings</h2>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.automations.syncContacts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automations: { ...formData.automations, syncContacts: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded border-border-primary bg-bg-primary text-accent-secondary focus:ring-2 focus:ring-accent-secondary"
              />
              <span className="ml-3 text-text-primary">Sync contact form submissions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.automations.syncInquiries}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automations: { ...formData.automations, syncInquiries: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded border-border-primary bg-bg-primary text-accent-secondary focus:ring-2 focus:ring-accent-secondary"
              />
              <span className="ml-3 text-text-primary">Sync service inquiries</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.automations.syncPurchases}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automations: { ...formData.automations, syncPurchases: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded border-border-primary bg-bg-primary text-accent-secondary focus:ring-2 focus:ring-accent-secondary"
              />
              <span className="ml-3 text-text-primary">Sync service purchases (new customers)</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.automations.sendBlogNewsletters}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automations: { ...formData.automations, sendBlogNewsletters: e.target.checked },
                  })
                }
                className="w-5 h-5 rounded border-border-primary bg-bg-primary text-accent-secondary focus:ring-2 focus:ring-accent-secondary"
              />
              <span className="ml-3 text-text-primary">Send blog post newsletters</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !formData.apiKey || !formData.serverPrefix}
            className="px-8 py-4 bg-accent-secondary rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg inline-flex items-center"
            style={{ color: '#000000' }}
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" style={{ color: '#000000' }} />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" style={{ color: '#000000' }} />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      {integration && (
        <div className="mt-8">
          <MailchimpAnalytics integrationId={integration.id} />
        </div>
      )}
    </div>
  );
}
