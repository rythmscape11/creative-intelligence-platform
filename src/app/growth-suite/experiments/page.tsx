'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, Plus, Play, Pause, CheckCircle, Clock, Download, Trash2, BarChart3 } from 'lucide-react';
import {
  type Experiment,
  createExperiment,
  startExperiment,
  pauseExperiment,
  completeExperiment,
  simulateExperimentData,
  calculateUplift,
  exportExperimentCSV,
  generateExperimentReport
} from '@/lib/growth-suite/experiments';

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExperimentName, setNewExperimentName] = useState('');
  const [newExperimentDescription, setNewExperimentDescription] = useState('');
  const [variantCount, setVariantCount] = useState(2);
  const [variantNames, setVariantNames] = useState(['Control', 'Variant A']);

  // Load experiments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('experiments');
    if (saved) {
      setExperiments(JSON.parse(saved));
    }
  }, []);

  // Save experiments to localStorage
  useEffect(() => {
    if (experiments.length > 0) {
      localStorage.setItem('experiments', JSON.stringify(experiments));
    }
  }, [experiments]);

  // Simulate data for running experiments
  useEffect(() => {
    const interval = setInterval(() => {
      setExperiments(prev => prev.map(exp => {
        if (exp.status === 'running' && exp.startDate) {
          const daysRunning = Math.ceil(
            (Date.now() - new Date(exp.startDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          return simulateExperimentData(exp, Math.max(1, daysRunning));
        }
        return exp;
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCreateExperiment = () => {
    if (!newExperimentName.trim()) return;
    
    const experiment = createExperiment(
      newExperimentName,
      newExperimentDescription,
      variantNames
    );
    
    setExperiments(prev => [experiment, ...prev]);
    setShowCreateModal(false);
    setNewExperimentName('');
    setNewExperimentDescription('');
    setVariantNames(['Control', 'Variant A']);
    setVariantCount(2);
  };

  const handleStartExperiment = (id: string) => {
    setExperiments(prev => prev.map(exp => 
      exp.id === id ? startExperiment(exp) : exp
    ));
  };

  const handlePauseExperiment = (id: string) => {
    setExperiments(prev => prev.map(exp => 
      exp.id === id ? pauseExperiment(exp) : exp
    ));
  };

  const handleCompleteExperiment = (id: string) => {
    setExperiments(prev => prev.map(exp => 
      exp.id === id ? completeExperiment(exp) : exp
    ));
  };

  const handleDeleteExperiment = (id: string) => {
    setExperiments(prev => prev.filter(exp => exp.id !== id));
  };

  const handleExportCSV = (experiment: Experiment) => {
    const csv = exportExperimentCSV(experiment);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-${experiment.id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportReport = (experiment: Experiment) => {
    const report = generateExperimentReport(experiment);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-report-${experiment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateVariantName = (index: number, name: string) => {
    const newNames = [...variantNames];
    newNames[index] = name;
    setVariantNames(newNames);
  };

  const updateVariantCount = (count: number) => {
    setVariantCount(count);
    const newNames = ['Control'];
    for (let i = 1; i < count; i++) {
      newNames.push(variantNames[i] || `Variant ${String.fromCharCode(64 + i)}`);
    }
    setVariantNames(newNames);
  };

  const runningCount = experiments.filter(e => e.status === 'running').length;
  const draftCount = experiments.filter(e => e.status === 'draft').length;
  const completedCount = experiments.filter(e => e.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'paused': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-text-tertiary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
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
                  <FlaskConical className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-4xl font-bold text-text-primary">Experiments</h1>
              </div>
              <p className="text-lg text-text-secondary">
                Create and manage A/B tests with real-time statistics
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#F59E0B] text-black hover:bg-[#D97706] rounded-lg px-4 py-2 flex items-center gap-2 transition-all font-semibold"
            >
              <Plus className="h-5 w-5" />
              New Experiment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Running</span>
              <Play className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{runningCount}</div>
          </div>

          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Draft</span>
              <Clock className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{draftCount}</div>
          </div>

          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Completed</span>
              <CheckCircle className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="text-3xl font-bold text-text-primary">{completedCount}</div>
          </div>
        </div>

        {/* Experiments List */}
        <div className="space-y-6">
          {experiments.length === 0 ? (
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-12 text-center">
              <FlaskConical className="h-16 w-16 mx-auto mb-4 text-text-tertiary" />
              <h3 className="text-xl font-semibold mb-2 text-text-primary">No experiments yet</h3>
              <p className="text-text-secondary mb-6">
                Create your first A/B test to start optimizing conversions
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#F59E0B] text-black hover:bg-[#D97706] rounded-lg px-6 py-3 font-semibold transition-all"
              >
                Create Experiment
              </button>
            </div>
          ) : (
            experiments.map((experiment) => (
              <div key={experiment.id} className="bg-bg-secondary border border-border-primary rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-text-primary">{experiment.name}</h3>
                      <span className={`flex items-center gap-1 text-sm font-medium ${getStatusColor(experiment.status)}`}>
                        {getStatusIcon(experiment.status)}
                        {experiment.status}
                      </span>
                      {experiment.winner && (
                        <span className="text-sm bg-green-500/10 text-green-400 px-2 py-1 rounded">
                          Winner: {experiment.variants.find(v => v.id === experiment.winner)?.name}
                        </span>
                      )}
                    </div>
                    <p className="text-text-secondary">{experiment.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {experiment.status === 'draft' && (
                      <button
                        onClick={() => handleStartExperiment(experiment.id)}
                        className="px-3 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all text-sm font-medium"
                      >
                        Start
                      </button>
                    )}
                    {experiment.status === 'running' && (
                      <>
                        <button
                          onClick={() => handlePauseExperiment(experiment.id)}
                          className="px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-all text-sm font-medium"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => handleCompleteExperiment(experiment.id)}
                          className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-sm font-medium"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {experiment.status === 'paused' && (
                      <button
                        onClick={() => handleStartExperiment(experiment.id)}
                        className="px-3 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all text-sm font-medium"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => handleExportCSV(experiment)}
                      className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-all text-sm"
                      title="Export CSV"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleExportReport(experiment)}
                      className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-all text-sm"
                      title="Export Report"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExperiment(experiment.id)}
                      className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {experiment.totalViews > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-bg-tertiary rounded-lg">
                    <div>
                      <div className="text-sm text-text-tertiary">Total Views</div>
                      <div className="text-2xl font-bold text-text-primary">{experiment.totalViews.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-tertiary">Conversions</div>
                      <div className="text-2xl font-bold text-text-primary">{experiment.totalConversions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-tertiary">Confidence</div>
                      <div className="text-2xl font-bold text-text-primary">{experiment.confidence}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-tertiary">Best Uplift</div>
                      <div className="text-2xl font-bold text-green-400">
                        +{Math.max(...experiment.variants.slice(1).map((v) => 
                          calculateUplift(experiment.variants[0].conversionRate, v.conversionRate)
                        ))}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Variants */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {experiment.variants.map((variant, index) => (
                    <div key={variant.id} className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-text-primary">{variant.name}</h4>
                        <span className="text-sm text-text-tertiary">{variant.traffic}% traffic</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-tertiary">Views</span>
                          <span className="text-text-primary font-medium">{variant.views.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-tertiary">Conversions</span>
                          <span className="text-text-primary font-medium">{variant.conversions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-tertiary">Conv. Rate</span>
                          <span className="text-text-primary font-bold">{variant.conversionRate}%</span>
                        </div>
                        {index > 0 && (
                          <div className="flex justify-between text-sm pt-2 border-t border-border-primary">
                            <span className="text-text-tertiary">Uplift</span>
                            <span className={`font-bold ${
                              calculateUplift(experiment.variants[0].conversionRate, variant.conversionRate) > 0 
                                ? 'text-green-400' 
                                : 'text-red-400'
                            }`}>
                              {calculateUplift(experiment.variants[0].conversionRate, variant.conversionRate) > 0 ? '+' : ''}
                              {calculateUplift(experiment.variants[0].conversionRate, variant.conversionRate)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-secondary border border-border-primary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary">
              <h2 className="text-2xl font-bold text-text-primary">Create New Experiment</h2>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Experiment Name</label>
                <input
                  type="text"
                  value={newExperimentName}
                  onChange={(e) => setNewExperimentName(e.target.value)}
                  placeholder="e.g., Homepage CTA Button Test"
                  className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Description</label>
                <textarea
                  value={newExperimentDescription}
                  onChange={(e) => setNewExperimentDescription(e.target.value)}
                  placeholder="What are you testing and why?"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Number of Variants</label>
                <select
                  value={variantCount}
                  onChange={(e) => updateVariantCount(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                >
                  <option value={2}>2 (Control + 1 Variant)</option>
                  <option value={3}>3 (Control + 2 Variants)</option>
                  <option value={4}>4 (Control + 3 Variants)</option>
                  <option value={5}>5 (Control + 4 Variants)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text-primary">Variant Names</label>
                <div className="space-y-2">
                  {variantNames.map((name, index) => (
                    <input
                      key={index}
                      type="text"
                      value={name}
                      onChange={(e) => updateVariantName(index, e.target.value)}
                      placeholder={index === 0 ? 'Control' : `Variant ${String.fromCharCode(64 + index)}`}
                      className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-text-primary">Traffic Split</h4>
                <p className="text-sm text-text-secondary mb-2">
                  Traffic will be split evenly: {Math.floor(100 / variantCount)}% per variant
                </p>
                <div className="flex gap-2">
                  {variantNames.map((name, index) => (
                    <div key={index} className="flex-1 bg-[#F59E0B]/20 rounded px-2 py-1 text-center text-sm text-text-primary">
                      {name}: {Math.floor(100 / variantCount)}%
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border-primary flex gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateExperiment}
                disabled={!newExperimentName.trim()}
                className="px-4 py-2 rounded-lg bg-[#F59E0B] text-black hover:bg-[#D97706] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
