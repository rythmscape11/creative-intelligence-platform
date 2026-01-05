/**
 * Strategy Generator Modules
 * Unified exports for all strategy generation services
 */

export { SWOTAnalyzer } from './swot-analyzer';
export type { SWOTAnalysis } from './swot-analyzer';

export { CompetitiveBenchmarker } from './competitive-benchmark';
export type { CompetitiveBenchmark, CompetitorProfile, IndustryBenchmark } from './competitive-benchmark';

export { PersonaGenerator } from './persona-generator';
export type { MarketingPersona, PersonaSet } from './persona-generator';

export { KPIScorecardGenerator } from './kpi-scorecard';
export type { KPIScorecard, KPIMetric } from './kpi-scorecard';

export { BudgetHeatmapGenerator } from './budget-heatmap';
export type { BudgetHeatmap, ChannelAllocation, BudgetPhase } from './budget-heatmap';

/**
 * Strategy Complexity Levels
 */
export type StrategyComplexity = 'beginner' | 'standard' | 'advanced' | 'expert';

export interface StrategyComplexityConfig {
    level: StrategyComplexity;
    name: string;
    description: string;
    estimatedTime: string;
    features: string[];
    recommendedFor: string[];
}

export const STRATEGY_COMPLEXITY_LEVELS: StrategyComplexityConfig[] = [
    {
        level: 'beginner',
        name: 'Quick Start',
        description: 'Fast 5-minute strategy overview',
        estimatedTime: '5 minutes',
        features: [
            'Executive summary',
            'Top 3 channel recommendations',
            'Basic budget split',
            'Quick action items'
        ],
        recommendedFor: [
            'First-time users',
            'Quick validation',
            'Small projects'
        ]
    },
    {
        level: 'standard',
        name: 'Standard',
        description: 'Comprehensive 15-minute strategy',
        estimatedTime: '15 minutes',
        features: [
            'Full executive summary',
            'Target audience analysis',
            'All channel recommendations',
            'Detailed budget allocation',
            'Timeline & milestones',
            'KPI tracking'
        ],
        recommendedFor: [
            'Regular strategy needs',
            'Client presentations',
            'Quarterly planning'
        ]
    },
    {
        level: 'advanced',
        name: 'Advanced',
        description: 'Director-level 30-minute strategy',
        estimatedTime: '30 minutes',
        features: [
            'Everything in Standard',
            'SWOT analysis',
            'Competitive benchmarking',
            'Marketing personas',
            'Budget heatmap',
            'Funnel recommendations'
        ],
        recommendedFor: [
            'Enterprise clients',
            'Annual planning',
            'Major campaigns'
        ]
    },
    {
        level: 'expert',
        name: 'Expert',
        description: 'CMO-level comprehensive strategy',
        estimatedTime: '45-60 minutes',
        features: [
            'Everything in Advanced',
            'Multiple strategy versions',
            'Industry benchmark data',
            'Risk assessment',
            'Scenario planning',
            'Executive presentation deck'
        ],
        recommendedFor: [
            'C-suite presentations',
            'Board meetings',
            'Major pivots',
            'M&A considerations'
        ]
    }
];

export function getComplexityByLevel(level: StrategyComplexity): StrategyComplexityConfig {
    return STRATEGY_COMPLEXITY_LEVELS.find(c => c.level === level) || STRATEGY_COMPLEXITY_LEVELS[1];
}
