'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, Plus, TrendingUp, TrendingDown, Search, ExternalLink, Download, FileText, X, AlertCircle } from 'lucide-react';
import { ToolGate } from '@/components/access/tool-gate';
import {
  analyzeCompetitor,
  generateKeywordComparisons,
  identifyOpportunities,
  normalizeDomain,
  isValidDomain,
  exportCompetitorCSV,
  generateTrackingReport,
  type Competitor,
  type KeywordComparison,
  type KeywordOpportunity
} from '@/lib/growth-suite/competitor-scanner';

export default function CompetitorsPage() {
  const [newCompetitor, setNewCompetitor] = useState('');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);
  const [keywordComparisons, setKeywordComparisons] = useState<KeywordComparison[]>([]);
  const [opportunities, setOpportunities] = useState<KeywordOpportunity[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newCompetitor.trim()) {
      setError('Please enter a domain');
      return;
    }

    const normalized = normalizeDomain(newCompetitor);

    if (!isValidDomain(normalized)) {
      setError('Please enter a valid domain (e.g., example.com)');
      return;
    }

    if (competitors.some(c => c.domain === normalized)) {
      setError('Already tracking this competitor');
      return;
    }

    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const competitor = analyzeCompetitor(normalized);
    setCompetitors(prev => [...prev, competitor]);
    setSelectedCompetitor(competitor);

    const comparisons = generateKeywordComparisons(normalized, 10);
    setKeywordComparisons(comparisons);

    const opps = identifyOpportunities(comparisons);
    setOpportunities(opps);

    setIsAnalyzing(false);
    setNewCompetitor('');
  };

  const handleSelectCompetitor = (competitor: Competitor) => {
    setSelectedCompetitor(competitor);
    const comparisons = generateKeywordComparisons(competitor.domain, 10);
    setKeywordComparisons(comparisons);
    const opps = identifyOpportunities(comparisons);
    setOpportunities(opps);
  };

  const handleRemoveCompetitor = (competitorId: string) => {
    setCompetitors(prev => prev.filter(c => c.id !== competitorId));
    if (selectedCompetitor?.id === competitorId) {
      setSelectedCompetitor(null);
      setKeywordComparisons([]);
      setOpportunities([]);
    }
  };

  const handleExportCSV = () => {
    if (!selectedCompetitor) return;
    const csv = exportCompetitorCSV(selectedCompetitor, keywordComparisons);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitor-analysis-${selectedCompetitor.domain}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportReport = () => {
    if (!selectedCompetitor) return;
    const report = generateTrackingReport(selectedCompetitor, keywordComparisons, opportunities);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competitor-report-${selectedCompetitor.domain}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolGate toolId="competitor-analysis">
      <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-[#F59E0B]">
                <Target className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-text-primary">
                Competitor Scanner
              </h1>
            </div>
            <p className="text-lg text-text-secondary">
              Track competitor rankings and discover keyword opportunities
            </p>
          </div>

          {/* Add Competitor Form */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              Add Competitor
            </h2>
            <form onSubmit={handleAddCompetitor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">
                  Competitor Domain
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    placeholder="e.g., competitor.com"
                    className="flex-1 px-4 py-3 rounded-lg border border-[#F59E0B] bg-bg-tertiary text-text-primary placeholder:text-text-tertiary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isAnalyzing}
                    className="px-8 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin h-5 w-5 mr-2 border-2 border-black border-t-transparent rounded-full"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5 mr-2" />
                        Add Competitor
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-2 flex items-center text-sm text-red-400">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {error}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Competitors List */}
            <div>
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-text-primary">
                  Your Competitors ({competitors.length})
                </h2>

                {competitors.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto mb-3 text-text-tertiary" />
                    <p className="text-sm text-text-secondary">
                      No competitors tracked yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {competitors.map((comp) => (
                      <div
                        key={comp.id}
                        className={`p-4 rounded-lg transition-all border ${selectedCompetitor?.id === comp.id
                          ? 'bg-[#F59E0B]/10 border-[#F59E0B]'
                          : 'bg-bg-tertiary border-border-primary hover:border-border-hover'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <button
                            onClick={() => handleSelectCompetitor(comp)}
                            className="flex-1 text-left"
                          >
                            <div className="font-medium text-text-primary flex items-center">
                              {comp.domain}
                              <ExternalLink className="h-3 w-3 ml-1 text-[#F59E0B]" />
                            </div>
                          </button>
                          <button
                            onClick={() => handleRemoveCompetitor(comp.id)}
                            className="text-text-tertiary hover:text-red-400 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex justify-between text-xs text-text-secondary">
                          <span>{comp.keywords} keywords</span>
                          <span className={comp.change > 0 ? 'text-green-400' : 'text-red-400'}>
                            {comp.change > 0 ? '+' : ''}{comp.change}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-text-tertiary">
                          DA: {comp.domainAuthority} | Avg Pos: {comp.avgPosition}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Keyword Comparison */}
            <div className="lg:col-span-2">
              <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Keyword Comparison
                  </h2>
                  {selectedCompetitor && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center text-sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                      </button>
                      <button
                        onClick={handleExportReport}
                        className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center text-sm"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </button>
                    </div>
                  )}
                </div>

                {selectedCompetitor ? (
                  <div className="space-y-4">
                    {keywordComparisons.map((kw, index) => (
                      <div key={index} className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <Search className="h-4 w-4 mr-2 text-[#F59E0B]" />
                              <span className="font-semibold text-text-primary">{kw.keyword}</span>
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${kw.opportunity === 'high' ? 'bg-green-500/20 text-green-400' :
                                kw.opportunity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                {kw.opportunity} opp.
                              </span>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <div>
                                <span className="text-text-tertiary">Volume:</span>
                                <span className="ml-1 font-medium text-text-primary">{kw.volume.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-text-tertiary">Difficulty:</span>
                                <span className={`ml-1 font-medium ${kw.difficulty < 40 ? 'text-green-400' :
                                  kw.difficulty < 60 ? 'text-yellow-400' :
                                    'text-red-400'
                                  }`}>{kw.difficulty}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-primary">
                          <div className="text-center">
                            <div className="text-xs mb-1 text-text-tertiary">Your Rank</div>
                            <div className="text-2xl font-bold flex items-center justify-center text-[#F59E0B]">
                              #{kw.yourRank}
                              {kw.yourRank > kw.competitorRank ? (
                                <TrendingDown className="h-4 w-4 ml-1 text-red-400" />
                              ) : (
                                <TrendingUp className="h-4 w-4 ml-1 text-green-400" />
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs mb-1 text-text-tertiary">Competitor Rank</div>
                            <div className="text-2xl font-bold text-[#F59E0B]">#{kw.competitorRank}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-bg-elevated rounded-lg p-12 text-center">
                    <Target className="h-16 w-16 mx-auto mb-4 text-text-tertiary" />
                    <p className="text-text-secondary">Add and select a competitor to view keyword comparison</p>
                  </div>
                )}
              </div>

              {/* Opportunities */}
              {selectedCompetitor && opportunities.length > 0 && (
                <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4 text-text-primary">
                    Keyword Opportunities ({opportunities.length})
                  </h2>
                  <div className="space-y-3">
                    {opportunities.map((opp, i) => (
                      <div key={i} className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
                        <div className="flex items-start">
                          <TrendingUp className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <span className="font-semibold text-text-primary">{opp.keyword}</span>
                              <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-[#F59E0B]/20 text-[#F59E0B]">
                                {opp.type.replace('-', ' ')}
                              </span>
                            </div>
                            <p className="text-sm text-text-secondary mb-2">{opp.potential}</p>
                            <div className="flex gap-3 text-xs text-text-tertiary">
                              <span>Your: #{opp.currentRank}</span>
                              <span>Comp: #{opp.competitorRank}</span>
                              <span>{opp.volume.toLocaleString()}/mo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Free Tier Notice */}
          <div className="mt-8 bg-bg-tertiary border border-border-primary rounded-lg p-6">
            <div className="flex items-start">
              <Target className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
              <div>
                <h4 className="font-semibold mb-1 text-text-primary">Session-Based Tracking</h4>
                <p className="text-sm text-text-secondary">
                  Competitor data is stored in your browser session. Data resets when you close the tab.
                  <Link href="/pricing" className="ml-1 underline text-[#F59E0B] hover:text-[#D97706]">
                    Upgrade for persistent tracking
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolGate>
  );
}

