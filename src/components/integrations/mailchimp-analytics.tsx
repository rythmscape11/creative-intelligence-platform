'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, TrendingUp, Users, Mail, Calendar } from 'lucide-react';

interface MailchimpAnalyticsProps {
  integrationId: string;
}

interface SyncLog {
  id: string;
  type: string;
  status: string;
  action: string;
  recordsProcessed: number | null;
  errorMessage: string | null;
  createdAt: string;
}

interface Analytics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  totalContactsSynced: number;
  successRate: number;
  last7Days: Array<{ date: string; count: number }>;
  recentLogs: SyncLog[];
}

export function MailchimpAnalytics({ integrationId }: MailchimpAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); // days

  useEffect(() => {
    fetchAnalytics();
  }, [integrationId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/integrations/${integrationId}/analytics?days=${dateRange}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F59E0B] mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8">
        <p className="text-gray-400 text-center">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Analytics & Sync Logs</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Syncs</span>
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-white">{analytics.totalSyncs}</p>
        </div>

        <div className="bg-[#1A1A1A] border border-green-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Successful</span>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-500">{analytics.successfulSyncs}</p>
        </div>

        <div className="bg-[#1A1A1A] border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Failed</span>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-500">{analytics.failedSyncs}</p>
        </div>

        <div className="bg-[#1A1A1A] border border-[#F59E0B]/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Success Rate</span>
            <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <p className="text-3xl font-bold text-[#F59E0B]">{analytics.successRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Contacts Synced */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-[#F59E0B]" />
          <h3 className="text-xl font-bold text-white">Total Contacts Synced</h3>
        </div>
        <p className="text-4xl font-bold text-white">{analytics.totalContactsSynced.toLocaleString()}</p>
        <p className="text-sm text-gray-400 mt-2">Across all sync operations</p>
      </div>

      {/* Activity Chart (Simple Bar Chart) */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">Sync Activity</h3>
        <div className="space-y-3">
          {analytics.last7Days.map((day, index) => {
            const maxCount = Math.max(...analytics.last7Days.map(d => d.count), 1);
            const percentage = (day.count / maxCount) * 100;
            
            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-sm font-semibold text-white">{day.count} syncs</span>
                </div>
                <div className="w-full bg-[#2A2A2A] rounded-full h-2">
                  <div
                    className="bg-[#F59E0B] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sync Logs */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">Recent Sync Logs</h3>
        
        {analytics.recentLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No sync logs yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A2A]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Records</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Error</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#2A2A2A] hover:bg-[#2A2A2A]/50 transition-colors">
                    <td className="py-3 px-4">
                      {log.status === 'SUCCESS' ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Success</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-500">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Failed</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-white">{log.action.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-white">{log.recordsProcessed || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-400">
                        {new Date(log.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {log.errorMessage ? (
                        <span className="text-xs text-red-400 truncate max-w-xs block">
                          {log.errorMessage}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

