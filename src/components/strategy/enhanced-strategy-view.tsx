'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeftIcon, Copy, Check, Download, Sparkles, PencilIcon, TrashIcon } from 'lucide-react';
import { EnhancedStrategyOutput } from '@/lib/services/enhanced-strategy-generator';
import { PremiumStrategySection } from './premium-strategy-section';
import { ExportStrategy } from './export-strategy';
import {
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  Zap,
  Calendar,
  DollarSign,
  AlertTriangle,
  UserCheck,
  BarChart3,
  Search,
  Crosshair,
  MessageSquare,
  Map,
  LineChart,
  Trophy,
  Wrench,
  BookOpen,
} from 'lucide-react';

interface Props {
  strategy: {
    id: string;
    input: any;
    output: EnhancedStrategyOutput;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export function EnhancedStrategyView({ strategy }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [copiedAll, setCopiedAll] = useState(false);
  const { output } = strategy;

  const formatSectionForCopy = (content: any): string => {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      return content.map((item, idx) => `${idx + 1}. ${JSON.stringify(item, null, 2)}`).join('\n');
    }
    return JSON.stringify(content, null, 2);
  };

  const copyAllStrategy = async () => {
    try {
      const allContent = [
        '=== MARKETING STRATEGY ===\n',
        `Business: ${strategy.input.businessName}`,
        `Industry: ${strategy.input.industry}`,
        `Generated: ${new Date(strategy.createdAt).toLocaleDateString()}\n`,
        '=== EXECUTIVE SUMMARY ===',
        formatSectionForCopy(output.executiveSummary),
        '\n=== SITUATION ANALYSIS ===',
        formatSectionForCopy(output.situationAnalysis),
        '\n=== TARGET AUDIENCE PERSONAS ===',
        formatSectionForCopy(output.targetAudiencePersonas),
        '\n=== BRAND POSITIONING ===',
        formatSectionForCopy(output.brandPositioning),
        '\n=== MARKETING OBJECTIVES & KPIs ===',
        formatSectionForCopy(output.marketingObjectivesAndKPIs),
        '\n=== CHANNEL STRATEGY ===',
        formatSectionForCopy(output.channelStrategy),
        '\n=== QUICK WINS ===',
        formatSectionForCopy(output.quickWins),
        '\n=== IMPLEMENTATION TIMELINE ===',
        formatSectionForCopy(output.implementationTimeline),
        '\n=== BUDGET BREAKDOWN ===',
        formatSectionForCopy(output.budgetBreakdown),
        '\n=== RISK ASSESSMENT ===',
        formatSectionForCopy(output.riskAssessment),
        '\n=== TEAM STRUCTURE ===',
        formatSectionForCopy(output.teamStructure),
      ].join('\n');

      await navigator.clipboard.writeText(allContent);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      toast({
        title: 'Copied to clipboard',
        description: 'Full strategy copied successfully.',
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: 'Copy failed',
        description: 'Failed to copy strategy to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = async () => {
    try {
      const response = await fetch(`/api/strategies/${strategy.id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to duplicate');

      const data = await response.json();
      toast({
        title: 'Strategy Duplicated',
        description: 'Redirecting to the new copy...',
      });
      router.push(`/dashboard/strategies/${data.data.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate strategy',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/strategies/${strategy.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast({
        title: 'Strategy Deleted',
        description: 'Redirecting to strategies list...',
      });
      router.push('/dashboard/strategies');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete strategy',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-black dark:via-[#0A0A0A] dark:to-[#111111]">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12 px-4 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <Link href="/dashboard/strategies">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all text-white">
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/dashboard/strategies/${strategy.id}/edit`}>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all text-white">
                  <PencilIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
              </Link>

              <button
                onClick={handleDuplicate}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all text-white"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">Duplicate</span>
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg backdrop-blur-sm transition-all text-white border border-red-500/30"
              >
                <TrashIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>

              <button
                onClick={copyAllStrategy}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all text-white"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Copy All</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">{strategy.input.businessName} - Marketing Strategy</h1>
          </div>
          <p className="text-white/90 text-lg">
            Created {new Date(strategy.createdAt).toLocaleDateString()} • {strategy.input.industry}
          </p>
        </div>
      </div>

      {/* Premium Strategy Display */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Premium Input Summary Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1A1A1A] dark:to-[#111111] rounded-2xl p-8 border border-gray-200 dark:border-[#2A2A2A] shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Strategy Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🏢</span>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Business</p>
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{strategy.input.businessName}</p>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💼</span>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</p>
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{strategy.input.industry}</p>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-200 dark:border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📅</span>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</p>
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {new Date(strategy.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <ExportStrategy
            strategyId={strategy.id}
            businessName={strategy.input.businessName}
          />

          {/* Premium Strategy Sections */}
          <PremiumStrategySection
            title="Executive Summary"
            icon={BarChart3}
            content={output.executiveSummary}
            sectionId="executive-summary"
            defaultExpanded={true}
          />

          <PremiumStrategySection
            title="Situation Analysis"
            icon={Search}
            content={output.situationAnalysis}
            sectionId="situation-analysis"
          />

          <PremiumStrategySection
            title="Target Audience Personas"
            icon={Users}
            content={output.targetAudiencePersonas}
            sectionId="target-audience"
          />

          <PremiumStrategySection
            title="Brand Positioning"
            icon={Crosshair}
            content={output.brandPositioning}
            sectionId="brand-positioning"
          />

          <PremiumStrategySection
            title="Marketing Objectives & KPIs"
            icon={TrendingUp}
            content={output.marketingObjectivesAndKPIs}
            sectionId="objectives-kpis"
          />

          <PremiumStrategySection
            title="Channel Strategy"
            icon={Target}
            content={output.channelStrategy}
            sectionId="channel-strategy"
          />

          <PremiumStrategySection
            title="Content Strategy"
            icon={MessageSquare}
            content={output.contentStrategy}
            sectionId="content-strategy"
          />

          <PremiumStrategySection
            title="Customer Journey Mapping"
            icon={Map}
            content={output.customerJourneyMapping}
            sectionId="customer-journey"
          />

          <PremiumStrategySection
            title="Implementation Timeline"
            icon={Calendar}
            content={output.implementationTimeline}
            sectionId="implementation-timeline"
          />

          <PremiumStrategySection
            title="Budget Breakdown"
            icon={DollarSign}
            content={output.budgetBreakdown}
            sectionId="budget-breakdown"
          />

          <PremiumStrategySection
            title="Measurement & Analytics"
            icon={LineChart}
            content={output.measurementAndAnalytics}
            sectionId="measurement-analytics"
          />

          <PremiumStrategySection
            title="Risk Assessment"
            icon={AlertTriangle}
            content={output.riskAssessment}
            sectionId="risk-assessment"
          />

          <PremiumStrategySection
            title="Competitive Differentiation"
            icon={Trophy}
            content={output.competitiveDifferentiation}
            sectionId="competitive-differentiation"
          />

          <PremiumStrategySection
            title="Technology & Tools"
            icon={Wrench}
            content={output.technologyAndTools}
            sectionId="technology-tools"
          />

          <PremiumStrategySection
            title="Team Structure"
            icon={UserCheck}
            content={output.teamStructure}
            sectionId="team-structure"
          />

          <PremiumStrategySection
            title="Quick Wins (30-60-90 Day Plan)"
            icon={Zap}
            content={output.quickWins}
            sectionId="quick-wins"
          />

          <PremiumStrategySection
            title="Appendix"
            icon={BookOpen}
            content={output.appendix}
            sectionId="appendix"
          />
        </div>
      </div>
    </div>
  );
}
