'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import {
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  FlagIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { EnterpriseStrategyPlan } from '@/types';
import { StrategyComments } from './strategy-comments';
import { StrategyVersions } from './strategy-versions';
import { StrategyTags } from './strategy-tags';
import { StrategyNotes } from './strategy-notes';
import { StrategyStatus } from './strategy-status';
import { EnterprisePlanSections } from './enterprise-plan-sections';

interface StrategyData {
  id: string;
  userId: string;
  name?: string;
  input: {
    businessName: string;
    industry: string;
    targetAudience: string;
    budget: number;
    objectives: string[];
    timeframe: string;
    currentChallenges: string;
    competitorInfo?: string;
    existingMarketing?: string;
  };
  output: {
    executiveSummary: string;
    targetAudience: Array<{
      name: string;
      demographics: string;
      psychographics: string;
      painPoints: string[];
      preferredChannels: string[];
    }>;
    marketingChannels: Array<{
      name: string;
      description: string;
      budgetAllocation: number;
      expectedROI: string;
      tactics: string[];
      timeline: string;
    }>;
    contentStrategy: {
      themes: string[];
      contentTypes: Array<{
        type: string;
        description: string;
        frequency: string;
        platforms: string[];
      }>;
      frequency: string;
      distribution: string[];
    };
    timeline: Array<{
      phase: string;
      duration: string;
      activities: string[];
      deliverables: string[];
    }>;
    budget: {
      total: number;
      channels: Array<{
        channel: string;
        amount: number;
        percentage: number;
      }>;
      contingency: number;
    };
    kpis: Array<{
      metric: string;
      target: string;
      measurement: string;
      frequency: string;
    }>;
    recommendations: string[];
    enterprisePlan?: EnterpriseStrategyPlan;
  } | null;
  generatedBy: 'AI' | 'FALLBACK';
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  tags: string[];
  notes?: string;
  version: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface StrategyViewProps {
  strategy: StrategyData;
}



export function StrategyView({ strategy }: StrategyViewProps) {
  const [deleting, setDeleting] = useState(false);
  const enterprisePlan = strategy.output?.enterprisePlan;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Delete strategy
  const deleteStrategy = async () => {
    if (!confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch(`/api/strategies/${strategy.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete strategy');
      }

      toast({
        type: 'success',
        title: 'Strategy Deleted',
        description: 'The strategy has been deleted successfully.',
      });

      // Redirect to strategies list
      window.location.href = '/dashboard/strategies';
    } catch (error) {
      console.error('Delete strategy error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete strategy. Please try again.',
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatEnterprisePlanForCopy = (plan: EnterpriseStrategyPlan) => {
    const lines: string[] = [];
    lines.push('Enterprise Strategy (Global Structure)');
    lines.push('\n1. Executive Summary');
    lines.push(plan.executiveSummary.overview);
    lines.push(`Priorities: ${plan.executiveSummary.globalPriorities.join('; ')}`);
    lines.push(`Risks: ${plan.executiveSummary.globalRisks.join('; ')}`);
    lines.push('\n2. Global & Regional Market Overview');
    lines.push(plan.marketOverview.globalSnapshot);
    plan.marketOverview.regions.forEach((region) => {
      lines.push(
        `${region.region}: ${region.marketMaturity} | Opportunities: ${region.opportunities.join(
          '; '
        )}`
      );
    });
    lines.push('\n3. Segmentation, Target Audiences & Use Cases');
    plan.segmentationAndUseCases.globalSegments.forEach((segment) => {
      lines.push(`${segment.name}: ${segment.description}`);
    });
    lines.push('\n4. Business & Marketing Objectives Linked to Outcomes');
    plan.objectivesAndKPIs.forEach((objective) => {
      lines.push(`${objective.businessGoal} → ${objective.marketingObjective}`);
    });
    lines.push('\n5. Governance, Operating Model & Roles');
    lines.push(plan.governanceModel.decisionFramework);
    lines.push('\n6. Resourcing & Budget Framework');
    lines.push(plan.resourcingAndBudget.budgetModel.summary);
    lines.push('\n7. Technology, Data & Compliance');
    lines.push(
      `Martech Stack: ${plan.technologyDataCompliance.martechStack
        .map((tool) => `${tool.category} - ${tool.recommendation}`)
        .join('; ')}`
    );
    lines.push('\n8. Integrated Channel & Campaign Strategy');
    plan.integratedChannelStrategy.channels.forEach((channel) => {
      lines.push(`${channel.channel}: ${channel.role}`);
    });
    lines.push('\n9. Regional Playbooks');
    plan.regionalPlaybooks.forEach((region) => {
      lines.push(`${region.region}: ${region.localizedTactics.join('; ')}`);
    });
    lines.push('\n10. Measurement, Optimization & Reporting');
    lines.push(plan.measurementAndOptimization.globalDashboard.join('; '));
    lines.push('\n11. 90–180 Day Roadmap');
    lines.push(plan.roadmap90To180.quickWins90Days.join('; '));
    return lines.join('\n');
  };

  const handleCopyEnterprisePlan = async () => {
    if (!enterprisePlan) return;
    try {
      await navigator.clipboard.writeText(formatEnterprisePlanForCopy(enterprisePlan));
      toast({
        type: 'success',
        title: 'Copied',
        description: 'Enterprise strategy copied to clipboard.',
      });
    } catch (error) {
      console.error(error);
      toast({
        type: 'error',
        title: 'Unable to Copy',
        description: 'Please try again or copy manually.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/strategies">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Strategies
            </Link>
          </Button>
          <div className="flex space-x-2">
            <StrategyVersions
              strategyId={strategy.id}
              currentVersion={strategy.version}
              onRestore={() => window.location.reload()}
            />
            {enterprisePlan && (
              <Button variant="outline" onClick={handleCopyEnterprisePlan}>
                Copy Enterprise Plan
              </Button>
            )}

            <Button variant="outline" asChild>
              <Link href={`/dashboard/strategies/${strategy.id}/edit`}>
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="outline">
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export
            </Button>
            <Button
              variant="destructive"
              onClick={deleteStrategy}
              disabled={deleting}
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {strategy.name || strategy.input.businessName}
          </h1>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="capitalize">{strategy.input.industry}</span>
            <span>•</span>
            <span>Version {strategy.version}</span>
            <span>•</span>
            <span>Created {formatDate(strategy.createdAt)}</span>
            <span>•</span>
            <span>Updated {formatDate(strategy.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {enterprisePlan && (
            <EnterprisePlanSections plan={enterprisePlan} />
          )}

          {/* Strategy Input Summary */}
          <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Strategy Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-8 w-8 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Business</p>
                  <p className="text-sm text-text-secondary">{strategy.input.businessName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-8 w-8 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Budget</p>
                  <p className="text-sm text-text-secondary">{formatCurrency(strategy.input.budget)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-8 w-8 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Timeframe</p>
                  <p className="text-sm text-text-secondary">{strategy.input.timeframe.replace('-', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FlagIcon className="h-8 w-8 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">Objectives</p>
                  <p className="text-sm text-text-secondary">{strategy.input.objectives.length} goals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Output */}
          {strategy.output ? (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Executive Summary</h2>
                <p className="text-text-secondary leading-relaxed">{strategy.output.executiveSummary}</p>
              </div>

              {/* Marketing Channels */}
              <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">Marketing Channels</h2>
                <div className="grid gap-4">
                  {strategy.output.marketingChannels.map((channel, index) => (
                    <div key={index} className="border border-border-primary rounded-lg p-4 bg-bg-primary dark:bg-bg-secondary">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-text-primary">{channel.name}</h3>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(channel.budgetAllocation)}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{channel.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {channel.tactics.map((tactic, tacticIndex) => (
                          <span
                            key={tacticIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                          >
                            {tactic}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Key Recommendations</h2>
                  <ul className="space-y-2">
                    {strategy.output.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full mt-2 mr-3"></span>
                        <span className="text-text-secondary">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Generating Strategy</h3>
              <p className="text-text-secondary">
                Our AI is analyzing your inputs and creating a comprehensive marketing strategy.
                This usually takes 30-60 seconds.
              </p>
            </div>
          )}
        </div>


        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Selector */}
          <StrategyStatus
            strategyId={strategy.id}
            initialStatus={strategy.status}
            onUpdate={() => window.location.reload()}
          />

          {/* Tags */}
          <StrategyTags
            strategyId={strategy.id}
            initialTags={strategy.tags}
            onUpdate={() => window.location.reload()}
          />

          {/* Notes */}
          <StrategyNotes
            strategyId={strategy.id}
            initialNotes={strategy.notes || ''}
            onUpdate={() => { }}
          />

          {/* Comments */}
          <StrategyComments strategyId={strategy.id} />
        </div>
      </div>
    </div>

  );
}


