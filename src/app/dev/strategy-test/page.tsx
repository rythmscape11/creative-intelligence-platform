'use client';

import { useState, useEffect } from 'react';
import { EnhancedStrategyGenerator } from '@/lib/services/enhanced-strategy-generator';
import { EnhancedStrategyInput } from '@/lib/validations/enhanced-strategy';
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
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Sparkles,
  BarChart3,
} from 'lucide-react';

// Test scenarios with diverse inputs
const TEST_SCENARIOS: EnhancedStrategyInput[] = [
  // Scenario 1: B2B SaaS Startup
  {
    businessName: 'CloudSync Pro',
    industry: 'Enterprise Software',
    businessType: 'SAAS',
    companyStage: 'STARTUP',
    targetMarketMaturity: 'GROWING',
    competitiveLandscape: 'RED_OCEAN',
    geographicScope: 'NATIONAL',
    targetAudience: 'Mid-market IT directors and CTOs at companies with 50-500 employees, looking for cloud collaboration solutions to improve team productivity',
    marketingObjectives: ['BRAND_AWARENESS', 'LEAD_GENERATION', 'PRODUCT_LAUNCH'],
    primaryKPI: 'LEADS',
    budget: 50000,
    timeframe: '6-12-months',
    teamSize: 'SMALL_2_5',
    marketingMaturity: 'INTERMEDIATE',
    brandPositioning: 'INNOVATIVE',
    preferredChannels: ['SEO', 'CONTENT_MARKETING', 'SOCIAL_MEDIA_PAID'],
    currentChallenges: ['LOW_BRAND_AWARENESS', 'LIMITED_BUDGET', 'INTENSE_COMPETITION'],
    existingMarTech: ['CRM', 'ANALYTICS'],
  },

  // Scenario 2: D2C E-commerce Growth Stage
  {
    businessName: 'EcoLux Home',
    industry: 'Sustainable Home Goods',
    businessType: 'D2C',
    companyStage: 'GROWTH',
    targetMarketMaturity: 'MATURE',
    competitiveLandscape: 'NICHE',
    geographicScope: 'NATIONAL',
    targetAudience: 'Environmentally conscious homeowners aged 28-45, middle to upper-middle income, seeking premium sustainable home products',
    marketingObjectives: ['CUSTOMER_ACQUISITION', 'REVENUE_GROWTH', 'CUSTOMER_RETENTION'],
    primaryKPI: 'REVENUE',
    budget: 150000,
    timeframe: '6-12-months',
    teamSize: 'MEDIUM_6_15',
    marketingMaturity: 'ADVANCED',
    brandPositioning: 'PREMIUM',
    preferredChannels: ['SOCIAL_MEDIA_PAID', 'INFLUENCER_MARKETING', 'EMAIL_MARKETING', 'CONTENT_MARKETING'],
    currentChallenges: ['POOR_CONVERSION', 'CUSTOMER_RETENTION'],
    existingMarTech: ['CRM', 'EMAIL_PLATFORM', 'ANALYTICS', 'SOCIAL_MEDIA_MANAGEMENT'],
    competitorInfo: 'Competing with established brands like West Elm and CB2, plus emerging DTC sustainable brands',
    seasonalityFactors: 'Peak sales during Q4 holidays and spring home refresh season (March-May)',
  },

  // Scenario 3: B2B Service Company - Mature
  {
    businessName: 'Strategic Consulting Partners',
    industry: 'Management Consulting',
    businessType: 'B2B',
    companyStage: 'MATURE',
    targetMarketMaturity: 'MATURE',
    competitiveLandscape: 'RED_OCEAN',
    geographicScope: 'INTERNATIONAL',
    targetAudience: 'C-suite executives and senior VPs at Fortune 1000 companies, primarily in financial services and technology sectors',
    marketingObjectives: ['THOUGHT_LEADERSHIP', 'LEAD_GENERATION', 'MARKET_SHARE'],
    primaryKPI: 'CLV',
    budget: 500000,
    timeframe: '12-24-months',
    teamSize: 'LARGE_16_50',
    marketingMaturity: 'EXPERT',
    brandPositioning: 'RELIABLE',
    preferredChannels: ['CONTENT_MARKETING', 'EVENTS', 'PR', 'PARTNERSHIPS'],
    currentChallenges: ['INTENSE_COMPETITION', 'LONG_SALES_CYCLES'],
    existingMarTech: ['CRM', 'MARKETING_AUTOMATION', 'ANALYTICS', 'CONTENT_MANAGEMENT', 'CUSTOMER_DATA_PLATFORM'],
    existingMarketing: 'Strong brand recognition in North America, expanding to EMEA and APAC. Active thought leadership program with published research and speaking engagements.',
  },

  // Scenario 4: Local Service Business - Small
  {
    businessName: 'FitLife Personal Training',
    industry: 'Health & Fitness',
    businessType: 'SERVICE',
    companyStage: 'STARTUP',
    targetMarketMaturity: 'GROWING',
    competitiveLandscape: 'NICHE',
    geographicScope: 'LOCAL',
    targetAudience: 'Health-conscious professionals aged 30-50 in the greater Austin area, seeking personalized fitness coaching and accountability',
    marketingObjectives: ['CUSTOMER_ACQUISITION', 'BRAND_AWARENESS', 'CUSTOMER_ENGAGEMENT'],
    primaryKPI: 'CUSTOMERS',
    budget: 15000,
    timeframe: '3-6-months',
    teamSize: 'SOLO',
    marketingMaturity: 'BEGINNER',
    brandPositioning: 'CUSTOMER_CENTRIC',
    preferredChannels: ['SOCIAL_MEDIA_ORGANIC', 'COMMUNITY', 'PARTNERSHIPS'],
    currentChallenges: ['LIMITED_BUDGET', 'LACK_OF_EXPERTISE', 'LOW_BRAND_AWARENESS'],
    existingMarTech: [],
  },
];

const SCENARIO_LABELS = [
  'B2B SaaS Startup ($50K Budget)',
  'D2C E-commerce Growth ($150K Budget)',
  'B2B Consulting Mature ($500K Budget)',
  'Local Service Startup ($15K Budget)',
];

export default function StrategyTestPage() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const generateAllStrategies = async () => {
      setLoading(true);
      const generatedStrategies = await Promise.all(
        TEST_SCENARIOS.map(scenario => EnhancedStrategyGenerator.generateStrategy(scenario, 'dev-test-user'))
      );
      setStrategies(generatedStrategies);
      setLoading(false);
    };

    generateAllStrategies();
  }, []);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatContentForCopy = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((item, index) => {
        if (typeof item === 'object') {
          return `${index + 1}. ${formatObjectForCopy(item)}`;
        }
        return `• ${item}`;
      }).join('\n');
    }

    if (typeof content === 'object') {
      return formatObjectForCopy(content);
    }

    return String(content);
  };

  const formatObjectForCopy = (obj: any): string => {
    return Object.entries(obj).map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
      if (Array.isArray(value)) {
        return `${formattedKey}:\n${value.map(v => `  • ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n')}`;
      }
      if (typeof value === 'object' && value !== null) {
        return `${formattedKey}:\n${formatObjectForCopy(value)}`;
      }
      return `${formattedKey}: ${value}`;
    }).join('\n\n');
  };

  const copyAllStrategy = () => {
    const strategy = strategies[selectedStrategy];
    if (!strategy) return;

    const sections = [
      { title: 'Situation Analysis', content: strategy.situationAnalysis },
      { title: 'Target Audience', content: strategy.targetAudience },
      { title: 'Brand Positioning', content: strategy.brandPositioning },
      { title: 'Marketing Objectives & KPIs', content: strategy.objectivesAndKPIs },
      { title: 'Channel Strategy', content: strategy.channelStrategy },
      { title: 'Quick Wins', content: strategy.quickWins },
      { title: 'Implementation Timeline', content: strategy.implementationTimeline },
      { title: 'Budget Breakdown', content: strategy.budgetBreakdown },
      { title: 'Risk Assessment', content: strategy.riskAssessment },
      { title: 'Team Structure', content: strategy.teamStructure },
    ];

    const fullText = sections
      .map(section => `=== ${section.title.toUpperCase()} ===\n\n${formatContentForCopy(section.content)}`)
      .join('\n\n---\n\n');

    copyToClipboard(fullText, 'all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-black dark:via-[#0A0A0A] dark:to-[#111111] flex items-center justify-center">
        <div className="text-center">
          {/* Skeleton Loading Animation */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-[#2A2A2A]"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#F59E0B] border-t-transparent animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-[#F59E0B] animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Generating Test Strategies
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
            Creating 4 diverse marketing strategies...
          </p>

          {/* Progress Indicators */}
          <div className="max-w-md mx-auto space-y-3">
            {['B2B SaaS Startup', 'D2C E-commerce', 'B2B Consulting', 'Local Service'].map((label, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white dark:bg-[#1A1A1A] rounded-lg p-3 border border-gray-200 dark:border-[#2A2A2A]">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 dark:text-gray-500 text-sm mt-6">
            This may take 10-15 seconds
          </p>
        </div>
      </div>
    );
  }

  const currentStrategy = strategies[selectedStrategy];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-black dark:via-[#0A0A0A] dark:to-[#111111]">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12 px-4 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold">Strategy Builder Quality Test</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Testing 4 diverse scenarios to evaluate strategy generation quality and output consistency
          </p>
        </div>
      </div>

      {/* Premium Strategy Selector */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-gray-200 dark:border-[#2A2A2A] py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Select Test Scenario</h2>
            <button
              onClick={copyAllStrategy}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F59E0B] to-amber-600 text-white rounded-lg hover:from-[#F59E0B]/90 hover:to-amber-600/90 transition-all shadow-md hover:shadow-lg"
            >
              {copiedSection === 'all' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="font-medium">Copy All</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCENARIO_LABELS.map((label, index) => (
              <button
                key={index}
                onClick={() => setSelectedStrategy(index)}
                className={`group relative p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${selectedStrategy === index
                    ? 'border-[#F59E0B] bg-gradient-to-br from-[#F59E0B]/10 to-amber-500/5 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-[#F59E0B]/50 hover:shadow-md hover:scale-102'
                  }`}
              >
                {/* Decorative Corner */}
                {selectedStrategy === index && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#F59E0B]/20 to-transparent rounded-bl-3xl"></div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${selectedStrategy === index
                        ? 'bg-[#F59E0B] text-white'
                        : 'bg-gray-100 dark:bg-[#2A2A2A] text-gray-600 dark:text-gray-400'
                      }`}>
                      {index + 1}
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wide ${selectedStrategy === index
                        ? 'text-[#F59E0B]'
                        : 'text-gray-500 dark:text-gray-500'
                      }`}>
                      Scenario
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                    {label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Strategy Display */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentStrategy && (
          <div className="space-y-6">
            {/* Premium Input Summary Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1A1A1A] dark:to-[#111111] rounded-2xl p-8 border border-gray-200 dark:border-[#2A2A2A] shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Input Parameters
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Business', value: TEST_SCENARIOS[selectedStrategy].businessName, icon: '🏢' },
                  { label: 'Industry', value: TEST_SCENARIOS[selectedStrategy].industry, icon: '🏭' },
                  { label: 'Type', value: TEST_SCENARIOS[selectedStrategy].businessType, icon: '📊' },
                  { label: 'Stage', value: TEST_SCENARIOS[selectedStrategy].companyStage, icon: '📈' },
                  { label: 'Budget', value: `$${TEST_SCENARIOS[selectedStrategy].budget.toLocaleString()}`, icon: '💰' },
                  { label: 'Timeframe', value: TEST_SCENARIOS[selectedStrategy].timeframe, icon: '⏱️' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#0A0A0A] rounded-xl p-4 border border-gray-100 dark:border-[#2A2A2A]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                    </div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Sections with Icons */}
            <StrategySection
              title="Situation Analysis"
              icon={Target}
              content={currentStrategy.situationAnalysis}
              isExpanded={expandedSections.has('situation')}
              onToggle={() => toggleSection('situation')}
              onCopy={(text) => copyToClipboard(text, 'situation')}
              isCopied={copiedSection === 'situation'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Target Audience Personas"
              icon={Users}
              content={currentStrategy.targetAudience}
              isExpanded={expandedSections.has('audience')}
              onToggle={() => toggleSection('audience')}
              onCopy={(text) => copyToClipboard(text, 'audience')}
              isCopied={copiedSection === 'audience'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Brand Positioning"
              icon={Lightbulb}
              content={currentStrategy.brandPositioning}
              isExpanded={expandedSections.has('positioning')}
              onToggle={() => toggleSection('positioning')}
              onCopy={(text) => copyToClipboard(text, 'positioning')}
              isCopied={copiedSection === 'positioning'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Marketing Objectives & KPIs"
              icon={TrendingUp}
              content={currentStrategy.objectivesAndKPIs}
              isExpanded={expandedSections.has('objectives')}
              onToggle={() => toggleSection('objectives')}
              onCopy={(text) => copyToClipboard(text, 'objectives')}
              isCopied={copiedSection === 'objectives'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Channel Strategy"
              icon={BarChart3}
              content={currentStrategy.channelStrategy}
              isExpanded={expandedSections.has('channels')}
              onToggle={() => toggleSection('channels')}
              onCopy={(text) => copyToClipboard(text, 'channels')}
              isCopied={copiedSection === 'channels'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Quick Wins"
              icon={Zap}
              content={currentStrategy.quickWins}
              isExpanded={expandedSections.has('quickwins')}
              onToggle={() => toggleSection('quickwins')}
              onCopy={(text) => copyToClipboard(text, 'quickwins')}
              isCopied={copiedSection === 'quickwins'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Implementation Timeline"
              icon={Calendar}
              content={currentStrategy.implementationTimeline}
              isExpanded={expandedSections.has('timeline')}
              onToggle={() => toggleSection('timeline')}
              onCopy={(text) => copyToClipboard(text, 'timeline')}
              isCopied={copiedSection === 'timeline'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Budget Breakdown"
              icon={DollarSign}
              content={currentStrategy.budgetBreakdown}
              isExpanded={expandedSections.has('budget')}
              onToggle={() => toggleSection('budget')}
              onCopy={(text) => copyToClipboard(text, 'budget')}
              isCopied={copiedSection === 'budget'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Risk Assessment"
              icon={AlertTriangle}
              content={currentStrategy.riskAssessment}
              isExpanded={expandedSections.has('risks')}
              onToggle={() => toggleSection('risks')}
              onCopy={(text) => copyToClipboard(text, 'risks')}
              isCopied={copiedSection === 'risks'}
              formatContent={formatContentForCopy}
            />

            <StrategySection
              title="Team Structure"
              icon={UserCheck}
              content={currentStrategy.teamStructure}
              isExpanded={expandedSections.has('team')}
              onToggle={() => toggleSection('team')}
              onCopy={(text) => copyToClipboard(text, 'team')}
              isCopied={copiedSection === 'team'}
              formatContent={formatContentForCopy}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Premium Strategy Section Component
interface StrategySectionProps {
  title: string;
  icon: any;
  content: any;
  isExpanded: boolean;
  onToggle: () => void;
  onCopy: (text: string) => void;
  isCopied: boolean;
  formatContent: (content: any) => string;
}

function StrategySection({
  title,
  icon: Icon,
  content,
  isExpanded,
  onToggle,
  onCopy,
  isCopied,
  formatContent,
}: StrategySectionProps) {
  if (!content) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-8 border border-gray-200 dark:border-[#2A2A2A] shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 dark:bg-[#2A2A2A] rounded-xl">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 italic">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1A1A1A] dark:to-[#111111] rounded-2xl border border-gray-200 dark:border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-200 dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click to {isExpanded ? 'collapse' : 'expand'} section
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopy(formatContent(content))}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#3A3A3A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-all shadow-sm hover:shadow-md"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Copy</span>
                </>
              )}
            </button>

            <button
              onClick={onToggle}
              className="p-2 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#3A3A3A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-all"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {renderContent(content)}
        </div>
      )}
    </div>
  );
}

// Premium Content Rendering Functions
function renderContent(content: any): React.ReactNode {
  if (typeof content === 'string') {
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    );
  }

  if (Array.isArray(content)) {
    return (
      <div className="space-y-4">
        {content.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#2A2A2A] hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            {typeof item === 'object' ? renderObject(item) : (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{String(item)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof content === 'object') {
    return renderObject(content);
  }

  return <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{String(content)}</p>;
}

function renderObject(obj: any): React.ReactNode {
  return (
    <div className="space-y-6">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
          </div>

          {typeof value === 'string' ? (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-4 pl-4 border-l-2 border-gray-200 dark:border-[#2A2A2A] whitespace-pre-wrap">
              {value}
            </p>
          ) : Array.isArray(value) ? (
            <ul className="ml-4 space-y-3">
              {value.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  {typeof item === 'object' ? (
                    <div className="flex-1 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-[#2A2A2A]">
                      <div className="space-y-2">
                        {Object.entries(item).map(([k, v]) => (
                          <div key={k} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white min-w-[120px]">
                              {k}:
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 flex-1">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{String(item)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : typeof value === 'object' && value !== null ? (
            <div className="ml-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-[#2A2A2A] space-y-3">
              {Object.entries(value).map(([k, v]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white min-w-[140px]">
                    {k}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">{String(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 ml-4 pl-4 border-l-2 border-gray-200 dark:border-[#2A2A2A]">
              {String(value)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
