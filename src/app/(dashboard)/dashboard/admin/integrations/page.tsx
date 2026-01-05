'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Mail,
  Send,
  Palette,
  ShoppingCart,
  BarChart3,
  Users,
  Share2,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import { toast } from '@/components/ui/toaster';

type IntegrationRecord = {
  id: string;
  type: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
  lastSyncAt?: string;
  lastError?: string;
};

type IntegrationResponse = {
  success: boolean;
  integrations: IntegrationRecord[];
};

type IntegrationMetadata = {
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
  color: string;
  setupUrl?: string;
};

const INTEGRATION_METADATA: Record<string, IntegrationMetadata> = {
  MAILCHIMP: {
    name: 'Mailchimp',
    description: 'Email marketing and automation platform',
    category: 'EMAIL_MARKETING',
    icon: Mail,
    color: '#FFE01B',
    setupUrl: '/dashboard/admin/integrations/mailchimp',
  },
  CONVERTKIT: {
    name: 'ConvertKit',
    description: 'Email marketing for creators',
    category: 'EMAIL_MARKETING',
    icon: Mail,
    color: '#FB6970',
  },
  SENDGRID: {
    name: 'SendGrid',
    description: 'Email delivery service',
    category: 'EMAIL_MARKETING',
    icon: Send,
    color: '#1A82E2',
  },
  BREVO: {
    name: 'Brevo (Sendinblue)',
    description: 'Email and SMS marketing',
    category: 'EMAIL_MARKETING',
    icon: Mail,
    color: '#0B996E',
  },
  CANVA: {
    name: 'Canva',
    description: 'Design tool integration',
    category: 'DESIGN_TOOLS',
    icon: Palette,
    color: '#00C4CC',
  },
  STRIPE: {
    name: 'Stripe',
    description: 'Payment processing',
    category: 'ECOMMERCE',
    icon: ShoppingCart,
    color: '#635BFF',
  },
  GOOGLE_ANALYTICS: {
    name: 'Google Analytics',
    description: 'Web analytics platform',
    category: 'ANALYTICS',
    icon: BarChart3,
    color: '#E37400',
    setupUrl: '/dashboard/admin/integrations/google-analytics',
  },
  HUBSPOT: {
    name: 'HubSpot',
    description: 'CRM and marketing automation',
    category: 'CRM',
    icon: Users,
    color: '#FF7A59',
  },
  BUFFER: {
    name: 'Buffer',
    description: 'Social media management',
    category: 'SOCIAL_MEDIA',
    icon: Share2,
    color: '#168EEA',
  },
};

const CATEGORIES = [
  { id: 'ALL', name: 'All Integrations', icon: Filter },
  { id: 'EMAIL_MARKETING', name: 'Email Marketing', icon: Mail },
  { id: 'BLOG_TOOLS', name: 'Blog Tools', icon: Send },
  { id: 'DESIGN_TOOLS', name: 'Design Tools', icon: Palette },
  { id: 'ECOMMERCE', name: 'E-commerce', icon: ShoppingCart },
  { id: 'ANALYTICS', name: 'Analytics', icon: BarChart3 },
  { id: 'CRM', name: 'CRM', icon: Users },
  { id: 'SOCIAL_MEDIA', name: 'Social Media', icon: Share2 },
];

export default function IntegrationsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [integrations, setIntegrations] = useState<IntegrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/integrations');
      const data: IntegrationResponse = await response.json();

      if (data.success) {
        setIntegrations(data.integrations);
      }
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to load integrations',
      });
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

    fetchIntegrations();
  }, [fetchIntegrations, router, user, isLoaded, isSignedIn]);

  const handleDisconnect = async (integrationId: string, integrationName: string) => {
    if (!confirm(`Disconnect ${integrationName}? Configuration will be preserved for future use.`)) {
      return;
    }

    try {
      setDisconnecting(integrationId);

      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: false,
          status: 'INACTIVE',
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          type: 'success',
          title: 'Integration Disconnected',
          description: `${integrationName} has been disconnected successfully.`,
        });

        await fetchIntegrations();
      } else {
        throw new Error(data.error || 'Failed to disconnect integration');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disconnect integration';
      console.error('Failed to disconnect integration:', error);
      toast({
        type: 'error',
        title: 'Disconnect Failed',
        description: message,
      });
    } finally {
      setDisconnecting(null);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Connected';
      case 'ERROR':
        return 'Error';
      case 'PENDING':
        return 'Pending';
      case 'INACTIVE':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory = selectedCategory === 'ALL' || integration.category === selectedCategory;
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedTypes = new Set(integrations.map((integration) => integration.type));
  const availableIntegrations = Object.entries(INTEGRATION_METADATA).filter(([type, meta]) => {
    if (connectedTypes.has(type)) return false;
    const matchesCategory = selectedCategory === 'ALL' || meta.category === selectedCategory;
    const matchesSearch =
      meta.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meta.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-secondary mb-4"></div>
          <p className="text-text-secondary">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Integrations</h1>
          <p className="text-text-secondary">
            Connect Aureon One with your favorite tools and services
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-bg-secondary border border-border-primary rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-secondary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 inline-flex items-center ${isActive
                      ? 'bg-accent-secondary text-black'
                      : 'bg-bg-secondary text-text-secondary border border-border-primary hover:border-accent-secondary'
                    }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {filteredIntegrations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Connected Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => {
                const metadata = INTEGRATION_METADATA[integration.type];
                const Icon = metadata?.icon || Settings;

                return (
                  <div
                    key={integration.id}
                    className="bg-bg-secondary rounded-xl border border-border-primary hover:border-accent-secondary transition-all duration-300 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className="p-3 rounded-lg mr-4"
                          style={{ backgroundColor: metadata ? `${metadata.color}20` : 'rgba(255,255,255,0.1)' }}
                        >
                          <Icon className="h-6 w-6" style={{ color: metadata?.color }} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-text-primary">
                            {integration.name}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {integration.description || metadata?.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getStatusIcon(integration.status)}
                        <span className="ml-2 text-sm text-text-secondary">
                          {getStatusText(integration.status)}
                        </span>
                      </div>
                      {integration.lastSyncAt && (
                        <span className="text-xs text-text-tertiary">
                          Last sync: {new Date(integration.lastSyncAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {integration.lastError && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-400">{integration.lastError}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (metadata?.setupUrl) {
                            router.push(metadata.setupUrl);
                          } else {
                            toast({
                              type: 'info',
                              title: 'Coming Soon',
                              description: `${integration.name} configuration page is coming soon.`,
                            });
                          }
                        }}
                        className="flex-1 px-4 py-2 bg-accent-secondary rounded-lg hover:bg-accent-hover transition-colors font-semibold"
                        style={{ color: '#000000' }}
                      >
                        Configure
                      </button>
                      <button
                        onClick={() => handleDisconnect(integration.id, integration.name)}
                        disabled={disconnecting === integration.id}
                        className="px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {disconnecting === integration.id ? 'Disconnecting...' : 'Disconnect'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {availableIntegrations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">Available Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableIntegrations.map(([type, metadata]) => {
                const Icon = metadata.icon;

                return (
                  <div
                    key={type}
                    className="bg-bg-secondary rounded-xl border border-border-primary hover:border-accent-secondary transition-all duration-300 p-6"
                  >
                    <div className="flex items-start mb-4">
                      <div
                        className="p-3 rounded-lg mr-4"
                        style={{ backgroundColor: `${metadata.color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: metadata.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-text-primary">{metadata.name}</h3>
                        <p className="text-sm text-text-secondary">{metadata.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (metadata.setupUrl) {
                          router.push(metadata.setupUrl);
                        } else {
                          toast({
                            type: 'info',
                            title: 'Coming Soon',
                            description: `${metadata.name} setup flow is coming soon.`,
                          });
                        }
                      }}
                      className="w-full px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-hover transition-colors font-semibold"
                    >
                      Connect
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
