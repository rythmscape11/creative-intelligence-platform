'use client';

import { useState, useEffect } from 'react';
import { GitBranch, Download, TrendingUp, DollarSign, Users, BarChart3, RefreshCw } from 'lucide-react';
import {
  type AttributionModel,
  type Journey,
  type AttributionReport,
  generateSampleJourneys,
  generateAttributionReport,
  exportAttributionCSV
} from '@/lib/growth-suite/attribution';

const attributionModels: { id: AttributionModel; name: string; description: string }[] = [
  { id: 'first-touch', name: 'First Touch', description: 'All credit to first interaction' },
  { id: 'last-touch', name: 'Last Touch', description: 'All credit to last interaction' },
  { id: 'linear', name: 'Linear', description: 'Equal credit to all touchpoints' },
  { id: 'position-based', name: 'Position-Based', description: '40% first, 40% last, 20% middle' },
  { id: 'time-decay', name: 'Time Decay', description: 'More credit to recent touchpoints' },
];

export default function AttributionPage() {
  const [selectedModel, setSelectedModel] = useState<AttributionModel>('first-touch');
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [report, setReport] = useState<AttributionReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate initial journeys
  useEffect(() => {
    const savedJourneys = localStorage.getItem('attribution-journeys');
    if (savedJourneys) {
      setJourneys(JSON.parse(savedJourneys));
    } else {
      const newJourneys = generateSampleJourneys(200);
      setJourneys(newJourneys);
      localStorage.setItem('attribution-journeys', JSON.stringify(newJourneys));
    }
  }, []);

  // Generate report when model or journeys change
  useEffect(() => {
    if (journeys.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        const newReport = generateAttributionReport(journeys, selectedModel);
        setReport(newReport);
        setIsLoading(false);
      }, 500);
    }
  }, [selectedModel, journeys]);

  const handleRefreshData = () => {
    const newJourneys = generateSampleJourneys(200);
    setJourneys(newJourneys);
    localStorage.setItem('attribution-journeys', JSON.stringify(newJourneys));
  };

  const handleExportCSV = () => {
    if (!report) return;
    
    const csv = exportAttributionCSV(report);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attribution-${selectedModel}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getModelComparison = () => {
    if (journeys.length === 0) return [];
    
    return attributionModels.map(model => {
      const modelReport = generateAttributionReport(journeys, model.id);
      return {
        model: model.name,
        conversions: modelReport.totalConversions,
        revenue: modelReport.totalRevenue
      };
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-[#F59E0B]">
                  <GitBranch className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-4xl font-bold text-text-primary">Attribution Explorer</h1>
              </div>
              <p className="text-lg text-text-secondary">
                Understand your customer journey with multi-touch attribution
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefreshData}
                className="bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover rounded-lg px-4 py-2 flex items-center gap-2 transition-all"
              >
                <RefreshCw className="h-5 w-5" />
                Refresh Data
              </button>
              <button
                onClick={handleExportCSV}
                disabled={!report}
                className="bg-[#F59E0B] text-black hover:bg-[#D97706] rounded-lg px-4 py-2 flex items-center gap-2 transition-all font-semibold disabled:opacity-50"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Attribution Model Selection */}
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Select Attribution Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {attributionModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedModel === model.id
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]'
                    : 'bg-bg-tertiary border-border-primary hover:border-border-hover'
                }`}
              >
                <div className={`font-semibold mb-1 ${selectedModel === model.id ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {model.name}
                </div>
                <div className="text-xs text-text-tertiary">{model.description}</div>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-12 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-[#F59E0B] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-text-secondary">Calculating attribution...</p>
          </div>
        ) : report ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-secondary">Total Sessions</span>
                  <Users className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  {report.totalSessions.toLocaleString()}
                </div>
              </div>

              <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-secondary">Conversions</span>
                  <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  {report.totalConversions.toLocaleString()}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {((report.totalConversions / report.totalSessions) * 100).toFixed(2)}% CVR
                </div>
              </div>

              <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-secondary">Total Revenue</span>
                  <DollarSign className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  ${report.totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  ${(report.totalRevenue / report.totalConversions).toFixed(2)} AOV
                </div>
              </div>

              <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-secondary">Avg Touchpoints</span>
                  <BarChart3 className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  {report.journeyStats.avgTouchpoints}
                </div>
                <div className="text-sm text-text-tertiary mt-1">
                  {report.journeyStats.avgJourneyLength} days avg
                </div>
              </div>
            </div>

            {/* Journey Insights */}
            <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Journey Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bg-tertiary rounded-lg p-4">
                  <div className="text-sm text-text-tertiary mb-1">Multi-Touch Journeys</div>
                  <div className="text-2xl font-bold text-text-primary">
                    {report.journeyStats.multiTouchJourneys}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    {((report.journeyStats.multiTouchJourneys / report.totalConversions) * 100).toFixed(1)}% of conversions
                  </div>
                </div>
                <div className="bg-bg-tertiary rounded-lg p-4">
                  <div className="text-sm text-text-tertiary mb-1">Avg Journey Length</div>
                  <div className="text-2xl font-bold text-text-primary">
                    {report.journeyStats.avgJourneyLength} days
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    From first touch to conversion
                  </div>
                </div>
                <div className="bg-bg-tertiary rounded-lg p-4">
                  <div className="text-sm text-text-tertiary mb-1">Avg Touchpoints</div>
                  <div className="text-2xl font-bold text-text-primary">
                    {report.journeyStats.avgTouchpoints}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    Interactions before conversion
                  </div>
                </div>
              </div>
            </div>

            {/* Channel Performance Table */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Channel Performance</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Channel</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Sessions</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Conversions</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">CVR</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Revenue</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Rev/Session</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.channels.map((channel, index) => (
                      <tr key={channel.channel} className={index % 2 === 0 ? 'bg-bg-tertiary/50' : ''}>
                        <td className="py-3 px-4 text-text-primary font-medium">{channel.channel}</td>
                        <td className="py-3 px-4 text-right text-text-primary">{channel.sessions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-text-primary">{channel.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-text-primary">{channel.conversionRate}%</td>
                        <td className="py-3 px-4 text-right text-text-primary">${channel.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-text-primary">${channel.revenuePerSession.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded text-sm font-semibold">
                            {channel.credit.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Model Comparison */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Model Comparison</h2>
              <p className="text-sm text-text-secondary mb-4">
                See how different attribution models affect conversion and revenue credit
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-primary">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">Model</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Conversions</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Revenue</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getModelComparison().map((model, index) => {
                      const diff = index > 0 
                        ? ((model.conversions - getModelComparison()[0].conversions) / getModelComparison()[0].conversions) * 100
                        : 0;
                      
                      return (
                        <tr key={model.model} className={index % 2 === 0 ? 'bg-bg-tertiary/50' : ''}>
                          <td className="py-3 px-4 text-text-primary font-medium">{model.model}</td>
                          <td className="py-3 px-4 text-right text-text-primary">{model.conversions.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-text-primary">${model.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            {index === 0 ? (
                              <span className="text-text-tertiary">-</span>
                            ) : (
                              <span className={diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-text-tertiary'}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

