'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  RefreshCw,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Download,
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
};

type IntegrationListResponse = {
  success: boolean;
  integrations: GoogleAnalyticsIntegration[];
};

type ReportHeader = { name: string };

type ReportMetric = { value: string };

type ReportRow = {
  dimensions?: string[];
  metrics: ReportMetric[];
};

type AnalyticsReport = {
  rowCount?: number;
  dimensionHeaders?: ReportHeader[];
  metricHeaders: ReportHeader[];
  data: ReportRow[];
};

type ReportResponse = {
  success: boolean;
  report?: AnalyticsReport;
  error?: string;
};

const DEFAULT_AUTOMATIONS: AutomationSettings = {
  trackPageViews: true,
  trackEvents: true,
  trackConversions: true,
  trackEcommerce: false,
};

export default function GoogleAnalyticsReportsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [integration, setIntegration] = useState<GoogleAnalyticsIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingReport, setFetchingReport] = useState(false);

  const [reportType, setReportType] = useState<'standard' | 'realtime'>('standard');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [reportData, setReportData] = useState<AnalyticsReport | null>(null);

  const fetchIntegration = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/integrations?type=GOOGLE_ANALYTICS');
      const data: IntegrationListResponse = await response.json();

      const gaIntegration = data.success ? data.integrations[0] : null;
      if (gaIntegration) {
        setIntegration({
          ...gaIntegration,
          settings: gaIntegration.settings || {
            propertyId: '',
            measurementId: '',
            automations: DEFAULT_AUTOMATIONS,
            apiSecret: '',
          },
        });
      } else {
        setIntegration(null);
      }
    } catch (error) {
      console.error('Failed to fetch integration:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReport = useCallback(async () => {
    if (!integration) {
      toast({
        type: 'error',
        title: 'Not Connected',
        description: 'Please connect Google Analytics first',
      });
      return;
    }

    try {
      setFetchingReport(true);

      const requestPayload: Record<string, unknown> = {
        reportType,
        metrics: ['activeUsers', 'sessions', 'screenPageViews', 'averageSessionDuration'],
      };

      if (reportType === 'standard') {
        requestPayload.dimensions = ['date'];
        requestPayload.dateRange = dateRange;
      }

      const response = await fetch('/api/integrations/google-analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const data: ReportResponse = await response.json();

      if (data.success && data.report) {
        setReportData(data.report);
        toast({
          type: 'success',
          title: 'Report Fetched',
          description: `Retrieved ${data.report.rowCount || 0} rows of data`,
        });
      } else {
        setReportData(null);
        toast({
          type: 'error',
          title: 'Fetch Failed',
          description: data.error || 'Failed to fetch report',
        });
      }
    } catch (error) {
      console.error('Fetch report error:', error);
      toast({
        type: 'error',
        title: 'Fetch Failed',
        description: 'Failed to fetch report',
      });
      setReportData(null);
    } finally {
      setFetchingReport(false);
    }
  }, [dateRange, integration, reportType]);

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

    if (user) {
      fetchIntegration();
    }
  }, [fetchIntegration, router, user, isLoaded, isSignedIn]);

  const handleExport = () => {
    if (!reportData) {
      toast({
        type: 'error',
        title: 'No Data',
        description: 'No report data to export',
      });
      return;
    }

    const headers = [
      ...((reportData.dimensionHeaders ?? []).map((header) => header.name)),
      ...reportData.metricHeaders.map((header) => header.name),
    ];

    const rows = reportData.data.map((row) => [
      ...(row.dimensions || []),
      ...row.metrics.map((metric) => metric.value),
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `google-analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);

    toast({
      type: 'success',
      title: 'Exported',
      description: 'Report exported successfully',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#F59E0B] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics reports...</p>
        </div>
      </div>
    );
  }

  if (!integration || integration.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/dashboard/admin/integrations/google-analytics"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Configuration
          </Link>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Google Analytics Not Connected</h2>
            <p className="text-gray-400 mb-6">
              Please connect your Google Analytics account to view reports.
            </p>
            <Link
              href="/dashboard/admin/integrations/google-analytics"
              className="inline-flex items-center px-6 py-3 bg-[#F59E0B] text-black rounded-lg hover:bg-[#D97706] transition-colors font-semibold"
            >
              Connect Google Analytics
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin/integrations/google-analytics"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Configuration
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Analytics Reports</h1>
                <p className="text-gray-400 mt-1">View your Google Analytics data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as 'standard' | 'realtime')}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]"
              >
                <option value="standard">Standard</option>
                <option value="realtime">Real-time</option>
              </select>
            </div>

            {/* Date Range (only for standard reports) */}
            {reportType === 'standard' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex items-end space-x-2">
              <button
                onClick={fetchReport}
                disabled={fetchingReport}
                className="flex-1 px-4 py-2 bg-[#F59E0B] text-black rounded-lg hover:bg-[#D97706] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold inline-flex items-center justify-center"
              >
                {fetchingReport ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Fetch
                  </>
                )}
              </button>

              {reportData && (
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Report Data */}
        {reportData && (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {reportType === 'realtime' ? 'Real-time Data' : 'Historical Data'}
              </h2>
              <span className="text-sm text-gray-400">
                {reportData.rowCount || reportData.data.length} rows
              </span>
            </div>

            {/* Summary Cards */}
            {reportData.data.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {reportData.metricHeaders.map((header, index) => {
                  const totalValue = reportData.data.reduce((sum, row) => {
                    const metricValue = row.metrics[index]?.value ?? '0';
                    return sum + Number.parseFloat(metricValue || '0');
                  }, 0);

                  const averageValue = totalValue / reportData.data.length || 0;

                  return (
                    <div key={header.name} className="bg-[#1A1A1A] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{header.name}</span>
                        {index === 0 && <Users className="w-4 h-4 text-blue-400" />}
                        {index === 1 && <Eye className="w-4 h-4 text-green-400" />}
                        {index === 2 && <TrendingUp className="w-4 h-4 text-purple-400" />}
                        {index === 3 && <Clock className="w-4 h-4 text-orange-400" />}
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {index === 3
                          ? `${Math.round(averageValue)}s`
                          : totalValue.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    {reportData.dimensionHeaders?.map((header) => (
                      <th key={header.name} className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                        {header.name}
                      </th>
                    ))}
                    {reportData.metricHeaders.map((header) => (
                      <th key={header.name} className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                        {header.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-800 hover:bg-[#1A1A1A] transition-colors">
                      {row.dimensions?.map((dim, dimIndex) => (
                        <td key={`${rowIndex}-dim-${dimIndex}`} className="py-3 px-4 text-sm text-white">
                          {dim}
                        </td>
                      ))}
                      {row.metrics.map((metric, metricIndex) => (
                        <td key={`${rowIndex}-metric-${metricIndex}`} className="py-3 px-4 text-sm text-white text-right">
                          {metricIndex === 3
                            ? `${Math.round(Number.parseFloat(metric.value))}s`
                            : Number.parseFloat(metric.value).toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!reportData && !fetchingReport && (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Report Data</h2>
            <p className="text-gray-400">
              Click &quot;Fetch&quot; to load your analytics data
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
