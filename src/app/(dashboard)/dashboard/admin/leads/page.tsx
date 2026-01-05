'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  UserGroupIcon,
  EnvelopeIcon,
  CalendarIcon,
  GlobeAltIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { LeadSourceAnalytics } from '@/components/admin/lead-source-analytics';

interface Lead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  company: string | null;
  source: string;
  page: string | null;
  toolId: string | null;
  budgetRange: string | null;
  hearAboutUs: string | null;
  // UTM parameters
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  capturedAt: string;
}

interface LeadStats {
  total: number;
  bySource: Record<string, number>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeadAnalyticsData {
  sourceData: Array<{ source: string; count: number; percentage: number }>;
  utmSourceData: Array<{ utmSource?: string; count: number }>;
  utmMediumData: Array<{ utmMedium?: string; count: number }>;
  utmCampaignData: Array<{ utmCampaign?: string; count: number }>;
  totalLeads: number;
  dateRange: string;
}

export default function LeadsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({ total: 0, bySource: {} });
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Analytics state
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<LeadAnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const analyticsDateRange = '30';

  // RBAC check - redirect if not ADMIN
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
  }, [user, isLoaded, isSignedIn, router]);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        source: sourceFilter,
        search: searchQuery,
      });

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/admin/leads?${params}`);
      const data = await response.json();

      setLeads(data.leads);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  }, [endDate, pagination.limit, pagination.page, searchQuery, sourceFilter, startDate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const params = new URLSearchParams({
        dateRange: analyticsDateRange,
      });

      if (startDate && endDate) {
        params.set('startDate', startDate);
        params.set('endDate', endDate);
      }

      const response = await fetch(`/api/admin/leads/analytics?${params}`);
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [analyticsDateRange, endDate, startDate]);

  useEffect(() => {
    if (showAnalytics) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, showAnalytics]);

  // Handle export
  const handleExport = async () => {
    const params = new URLSearchParams({
      source: sourceFilter,
    });

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    window.open(`/api/admin/leads/export?${params}`, '_blank');
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedLeads.size} leads?`)) return;

    try {
      await Promise.all(
        Array.from(selectedLeads).map(id =>
          fetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
        )
      );
      setSelectedLeads(new Set());
      fetchLeads();
    } catch (error) {
      console.error('Error deleting leads:', error);
    }
  };

  // Toggle lead selection
  const toggleLead = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  // Toggle all leads
  const toggleAll = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(l => l.id)));
    }
  };

  // Get source badge color
  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'exit-intent': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'post-tool-use': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'newsletter': 'bg-green-500/20 text-green-400 border-green-500/30',
      'gated-content': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'contact-form': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    };
    return colors[source] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-highlight mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated or not admin (will redirect)
  if (!isLoaded || !isSignedIn || (user?.publicMetadata?.role as string) !== 'ADMIN') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Lead Capture Dashboard</h1>
            <p className="text-text-secondary mt-2">
              Track and manage leads from all touchpoints
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-6 py-3 bg-accent-highlight text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">Total Leads</p>
            <UserGroupIcon className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-4xl font-bold text-text-primary mb-1">{stats.total}</p>
          <p className="text-xs text-text-tertiary">All time</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">Exit Intent</p>
            <EnvelopeIcon className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-4xl font-bold text-text-primary mb-1">{stats.bySource['exit-intent'] || 0}</p>
          <p className="text-xs text-text-tertiary">Captured on exit</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">Tool Users</p>
            <GlobeAltIcon className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-4xl font-bold text-text-primary mb-1">{stats.bySource['post-tool-use'] || 0}</p>
          <p className="text-xs text-text-tertiary">After tool usage</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-500/40 transition-all rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">Newsletter</p>
            <CalendarIcon className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-4xl font-bold text-text-primary mb-1">{stats.bySource['newsletter'] || 0}</p>
          <p className="text-xs text-text-tertiary">Subscribed</p>
        </div>
      </div>

      {/* Analytics Toggle */}
      <div className="flex items-center justify-between bg-bg-secondary border border-border-primary rounded-lg p-4">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="h-6 w-6 text-accent-highlight" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Lead Source Analytics</h3>
            <p className="text-sm text-text-secondary">Detailed insights into lead sources and campaigns</p>
          </div>
        </div>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="px-4 py-2 bg-accent-highlight text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </button>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-highlight"></div>
            </div>
          ) : analyticsData ? (
            <LeadSourceAnalytics
              sourceData={analyticsData.sourceData}
              utmSourceData={analyticsData.utmSourceData}
              utmMediumData={analyticsData.utmMediumData}
              utmCampaignData={analyticsData.utmCampaignData}
              totalLeads={analyticsData.totalLeads}
              dateRange={analyticsData.dateRange}
            />
          ) : (
            <div className="text-center py-12 text-text-tertiary">
              No analytics data available
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-highlight/20 focus:border-accent-highlight outline-none transition-all placeholder:text-text-tertiary"
              />
            </div>
          </div>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-highlight/20 focus:border-accent-highlight outline-none transition-all"
          >
            <option value="all">All Sources</option>
            <option value="exit-intent">Exit Intent</option>
            <option value="post-tool-use">Post Tool Use</option>
            <option value="newsletter">Newsletter</option>
            <option value="gated-content">Gated Content</option>
            <option value="contact-form">Contact Form</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-hover transition-colors inline-flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border-primary grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-highlight/20 focus:border-accent-highlight outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-border-primary bg-bg-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-highlight/20 focus:border-accent-highlight outline-none transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedLeads.size > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between">
          <span className="text-text-primary font-medium">
            {selectedLeads.size} lead{selectedLeads.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors inline-flex items-center"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-highlight mb-4"></div>
            <p className="text-text-secondary">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-text-tertiary" />
            <p className="text-text-secondary">No leads found</p>
            <p className="text-text-tertiary text-sm mt-2">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-primary">
                <thead className="bg-bg-tertiary">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedLeads.size === leads.length && leads.length > 0}
                        onChange={toggleAll}
                        className="rounded border-border-primary bg-bg-secondary text-accent-highlight focus:ring-accent-highlight focus:ring-2 focus:ring-offset-0"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Captured At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={selectedLeads.has(lead.id) ? 'bg-blue-500/10' : 'hover:bg-bg-tertiary transition-colors'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLeads.has(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                          className="rounded border-border-primary bg-bg-secondary text-accent-highlight focus:ring-accent-highlight focus:ring-2 focus:ring-offset-0"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 text-text-tertiary mr-2" />
                          <span className="text-sm text-text-primary font-medium">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">
                          {lead.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">
                          {lead.phone || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">
                          {lead.company || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSourceColor(lead.source)}`}>
                          {lead.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-secondary">
                          {lead.budgetRange || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-text-secondary">
                          <CalendarIcon className="h-4 w-4 mr-2 text-text-tertiary" />
                          {format(new Date(lead.capturedAt), 'MMM d, yyyy HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Delete lead"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-bg-tertiary px-6 py-4 flex items-center justify-between border-t border-border-primary">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-border-primary bg-bg-secondary text-text-primary rounded-lg hover:bg-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 px-4 py-2 border border-border-primary bg-bg-secondary text-text-primary rounded-lg hover:bg-bg-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-text-secondary">
                    Showing <span className="font-medium text-text-primary">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium text-text-primary">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium text-text-primary">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-border-primary bg-bg-secondary text-sm font-medium text-text-secondary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination({ ...pagination, page: pageNum })}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${pagination.page === pageNum
                            ? 'bg-accent-highlight text-white border-accent-highlight'
                            : 'border-border-primary bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-border-primary bg-bg-secondary text-sm font-medium text-text-secondary hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
