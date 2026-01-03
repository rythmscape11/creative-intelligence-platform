export interface User {
    id: string;
    email: string;
    org_name: string | null;
    tier: string;
    token_budget: number;
    tokens_used: number;
}

export interface Pillar {
    name: string;
    score: number;
    confidence: string;
    confidence_reason: string;
    vs_category_avg: number;
    explanation: {
        what_drove_this: string[];
        what_hurt_this: string[];
        what_to_fix_first: string;
        expected_fix_impact: number;
        boardroom_summary: string;
    };
}

export interface AnalysisResult {
    analysis_id: string;
    status: string;
    score?: {
        overall_score: number;
        confidence: string;
        confidence_band: [number, number];
        decision_summary: {
            run_decision: string;
            platform_fit: string;
            success_rationale: string;
            priority_improvement: string;
            expected_uplift: string;
        };
        pillars: Pillar[];
        warnings: string[];
        contradictions: string[];
    };
    differentiation?: {
        distinctiveness_score: number;
        is_me_too: boolean;
        generic_claims: string[];
        suggestions: string[];
    };
    layer_summary?: {
        deterministic_signals: number;
        perceptual_signals: number;
        cognitive_signals: number;
    };
    processing_time_ms?: number;
    total_tokens_used?: number;
    warnings?: string[];
    errors?: string[];
}
