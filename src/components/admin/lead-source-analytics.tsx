'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Target, Globe, Mail } from 'lucide-react';

interface LeadSourceData {
  source: string;
  count: number;
  percentage: number;
  trend?: number; // Percentage change from previous period
}

interface UTMData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  count: number;
}

interface LeadSourceAnalyticsProps {
  sourceData: LeadSourceData[];
  utmSourceData: UTMData[];
  utmMediumData: UTMData[];
  utmCampaignData: UTMData[];
  totalLeads: number;
  dateRange: string;
}

// Color palette for charts (dark theme compatible)
const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
];

// Source name mapping for better display
const SOURCE_LABELS: Record<string, string> = {
  'service_inquiry': 'Service Inquiry',
  'contact_form': 'Contact Form',
  'exit-intent': 'Exit Intent',
  'post-tool-use': 'Tool Users',
  'newsletter': 'Newsletter',
  'gated-content': 'Gated Content',
  'strategy_builder': 'Strategy Builder',
  'blog': 'Blog',
  'unknown': 'Direct/Unknown',
};

export function LeadSourceAnalytics({
  sourceData,
  utmSourceData,
  utmMediumData,
  utmCampaignData,
  totalLeads,
  dateRange,
}: LeadSourceAnalyticsProps) {
  // Prepare data for pie chart
  const pieChartData = useMemo(() => {
    return sourceData.map((item) => ({
      name: SOURCE_LABELS[item.source] || item.source,
      value: item.count,
      percentage: item.percentage,
    }));
  }, [sourceData]);

  // Prepare data for bar chart
  const barChartData = useMemo(() => {
    return sourceData.map((item) => ({
      name: SOURCE_LABELS[item.source] || item.source,
      leads: item.count,
      percentage: item.percentage,
    }));
  }, [sourceData]);

  // Calculate top performing source
  const topSource = useMemo(() => {
    if (sourceData.length === 0) return null;
    return sourceData.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
  }, [sourceData]);

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-elevated border border-border-primary rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-semibold">{payload[0].name}</p>
          <p className="text-text-secondary text-sm">
            Leads: <span className="text-accent-highlight font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-text-secondary text-sm">
            Percentage: <span className="text-accent-highlight font-semibold">{payload[0].payload.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-elevated border border-border-primary rounded-lg p-3 shadow-lg">
          <p className="text-text-primary font-semibold">{payload[0].payload.name}</p>
          <p className="text-text-secondary text-sm">
            Leads: <span className="text-accent-highlight font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-text-secondary text-sm">
            Percentage: <span className="text-accent-highlight font-semibold">{payload[0].payload.percentage.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Lead Source Analytics</h2>
          <p className="text-text-secondary mt-1">
            Analyze lead distribution and campaign performance ({dateRange})
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">Total Leads</p>
          <p className="text-3xl font-bold text-accent-highlight">{totalLeads.toLocaleString()}</p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Top Source */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">Top Source</p>
            <Target className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-text-primary mb-1">
            {topSource ? SOURCE_LABELS[topSource.source] || topSource.source : 'N/A'}
          </p>
          <p className="text-xs text-text-tertiary">
            {topSource ? `${topSource.count} leads (${topSource.percentage.toFixed(1)}%)` : 'No data'}
          </p>
        </div>

        {/* Total Sources */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">Active Sources</p>
            <Globe className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-text-primary mb-1">{sourceData.length}</p>
          <p className="text-xs text-text-tertiary">Lead sources</p>
        </div>

        {/* UTM Campaigns */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">UTM Campaigns</p>
            <Mail className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-text-primary mb-1">{utmCampaignData.length}</p>
          <p className="text-xs text-text-tertiary">Active campaigns</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 hover:border-amber-500/40 transition-all rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-text-secondary">Avg. per Source</p>
            <Users className="h-5 w-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-text-primary mb-1">
            {sourceData.length > 0 ? Math.round(totalLeads / sourceData.length) : 0}
          </p>
          <p className="text-xs text-text-tertiary">Leads per source</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Lead Distribution by Source</h3>
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${entry.percentage.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-tertiary">
              No data available
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Leads by Source</h3>
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis 
                  dataKey="name" 
                  stroke="#A0A0A0" 
                  tick={{ fill: '#A0A0A0', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#A0A0A0" tick={{ fill: '#A0A0A0' }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="leads" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-text-tertiary">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* UTM Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* UTM Source */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Top UTM Sources</h3>
          <div className="space-y-2">
            {utmSourceData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-bg-tertiary rounded-lg">
                <span className="text-text-primary text-sm">{item.utmSource || 'Direct'}</span>
                <span className="text-accent-highlight font-semibold">{item.count}</span>
              </div>
            ))}
            {utmSourceData.length === 0 && (
              <p className="text-text-tertiary text-sm text-center py-4">No UTM source data</p>
            )}
          </div>
        </div>

        {/* UTM Medium */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Top UTM Mediums</h3>
          <div className="space-y-2">
            {utmMediumData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-bg-tertiary rounded-lg">
                <span className="text-text-primary text-sm">{item.utmMedium || 'Organic'}</span>
                <span className="text-accent-highlight font-semibold">{item.count}</span>
              </div>
            ))}
            {utmMediumData.length === 0 && (
              <p className="text-text-tertiary text-sm text-center py-4">No UTM medium data</p>
            )}
          </div>
        </div>

        {/* UTM Campaign */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Top Campaigns</h3>
          <div className="space-y-2">
            {utmCampaignData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-bg-tertiary rounded-lg">
                <span className="text-text-primary text-sm truncate max-w-[150px]" title={item.utmCampaign}>
                  {item.utmCampaign || 'No campaign'}
                </span>
                <span className="text-accent-highlight font-semibold">{item.count}</span>
              </div>
            ))}
            {utmCampaignData.length === 0 && (
              <p className="text-text-tertiary text-sm text-center py-4">No campaign data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

