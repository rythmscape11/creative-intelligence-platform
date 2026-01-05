/**
 * Keyword Opportunity Scorer
 * 
 * Identifies high-value keyword opportunities based on:
 * - Search volume vs competition
 * - Current ranking position
 * - CTR potential
 * - Traffic opportunity
 */

export interface KeywordData {
    keyword: string;
    volume: number;          // Monthly search volume
    cpc?: number;            // Cost per click
    competition?: number;    // 0-1 competition index
    position?: number;       // Current ranking position (if ranking)
    impressions?: number;    // GSC impressions
    clicks?: number;         // GSC clicks
    ctr?: number;            // Click-through rate
}

export interface OpportunityScore {
    keyword: string;
    overallScore: number;    // 0-100
    difficulty: 'easy' | 'medium' | 'hard';
    potential: 'low' | 'medium' | 'high';
    type: OpportunityType;
    trafficPotential: number;
    recommendation: string;
    factors: {
        volumeScore: number;
        competitionScore: number;
        positionScore: number;
        ctrScore: number;
    };
}

export type OpportunityType =
    | 'quick_win'        // Position 8-20, high impressions
    | 'low_hanging'      // Low competition, decent volume
    | 'high_value'       // High volume, worth competing
    | 'ctr_opportunity'  // Good position, low CTR
    | 'new_opportunity'  // Not ranking, but good potential
    | 'competitive';      // High competition, needs effort

/**
 * Score a single keyword opportunity
 */
export function scoreKeywordOpportunity(data: KeywordData): OpportunityScore {
    const factors = {
        volumeScore: scoreVolume(data.volume),
        competitionScore: scoreCompetition(data.competition),
        positionScore: scorePosition(data.position),
        ctrScore: scoreCtr(data.position, data.ctr),
    };

    // Weighted calculation
    const weights = {
        volume: 0.30,
        competition: 0.25,
        position: 0.25,
        ctr: 0.20,
    };

    const overallScore = Math.round(
        factors.volumeScore * weights.volume +
        factors.competitionScore * weights.competition +
        factors.positionScore * weights.position +
        factors.ctrScore * weights.ctr
    );

    // Determine opportunity type
    const type = determineOpportunityType(data, factors, overallScore);

    // Calculate traffic potential
    const trafficPotential = estimateTrafficPotential(data);

    // Determine difficulty and potential labels
    const difficulty = overallScore >= 70 ? 'easy' : overallScore >= 40 ? 'medium' : 'hard';
    const potential = data.volume >= 5000 ? 'high' : data.volume >= 1000 ? 'medium' : 'low';

    // Generate recommendation
    const recommendation = generateRecommendation(type, data, factors);

    return {
        keyword: data.keyword,
        overallScore,
        difficulty,
        potential,
        type,
        trafficPotential,
        recommendation,
        factors,
    };
}

/**
 * Rank multiple keywords by opportunity
 */
export function rankOpportunities(keywords: KeywordData[]): OpportunityScore[] {
    return keywords
        .map(scoreKeywordOpportunity)
        .sort((a, b) => {
            // Sort by overall score, then by traffic potential
            if (b.overallScore !== a.overallScore) {
                return b.overallScore - a.overallScore;
            }
            return b.trafficPotential - a.trafficPotential;
        });
}

/**
 * Get top opportunities by type
 */
export function getTopOpportunities(
    keywords: KeywordData[],
    limit: number = 10
): {
    quickWins: OpportunityScore[];
    lowHanging: OpportunityScore[];
    highValue: OpportunityScore[];
    ctrOpportunities: OpportunityScore[];
} {
    const all = rankOpportunities(keywords);

    return {
        quickWins: all.filter(k => k.type === 'quick_win').slice(0, limit),
        lowHanging: all.filter(k => k.type === 'low_hanging').slice(0, limit),
        highValue: all.filter(k => k.type === 'high_value').slice(0, limit),
        ctrOpportunities: all.filter(k => k.type === 'ctr_opportunity').slice(0, limit),
    };
}

// --- Scoring functions ---

function scoreVolume(volume: number): number {
    if (volume >= 10000) return 100;
    if (volume >= 5000) return 90;
    if (volume >= 1000) return 75;
    if (volume >= 500) return 60;
    if (volume >= 100) return 40;
    return 20;
}

function scoreCompetition(competition?: number): number {
    if (competition === undefined) return 50; // Unknown
    // Lower competition = higher score
    if (competition <= 0.1) return 100;
    if (competition <= 0.2) return 85;
    if (competition <= 0.4) return 70;
    if (competition <= 0.6) return 50;
    if (competition <= 0.8) return 30;
    return 15;
}

function scorePosition(position?: number): number {
    if (position === undefined) return 30; // Not ranking
    // Position 1-3 = already winning (different strategy)
    if (position <= 3) return 40;
    // Position 4-10 = good, slight push needed
    if (position <= 10) return 70;
    // Position 11-20 = sweet spot for quick wins
    if (position <= 20) return 100;
    // Position 21-50 = still opportunity
    if (position <= 50) return 60;
    // Position 50+ = needs work
    return 30;
}

function scoreCtr(position?: number, ctr?: number): number {
    if (position === undefined || ctr === undefined) return 50;

    // Expected CTR by position (approximate)
    const expectedCtr: Record<number, number> = {
        1: 0.32, 2: 0.24, 3: 0.18, 4: 0.13, 5: 0.10,
        6: 0.08, 7: 0.06, 8: 0.05, 9: 0.04, 10: 0.03,
    };

    const posKey = Math.min(position, 10);
    const expected = expectedCtr[posKey] || 0.02;

    // If CTR is below expected, there's opportunity
    if (ctr < expected * 0.5) return 90; // Much lower than expected - big opportunity
    if (ctr < expected * 0.75) return 70;
    if (ctr < expected) return 50;
    return 30; // Already performing well
}

function determineOpportunityType(
    data: KeywordData,
    factors: OpportunityScore['factors'],
    overallScore: number
): OpportunityType {
    const { position, impressions, ctr, volume, competition } = data;

    // Quick Win: Position 8-20, high impressions
    if (position && position >= 8 && position <= 20 && impressions && impressions > 100) {
        return 'quick_win';
    }

    // CTR Opportunity: Good position but low CTR
    if (position && position <= 10 && factors.ctrScore >= 70) {
        return 'ctr_opportunity';
    }

    // Low Hanging: Low competition, decent volume
    if ((competition === undefined || competition < 0.3) && volume >= 500) {
        return 'low_hanging';
    }

    // High Value: High volume, worth competing
    if (volume >= 5000) {
        return 'high_value';
    }

    // New Opportunity: Not ranking but good potential
    if (!position && overallScore >= 60) {
        return 'new_opportunity';
    }

    return 'competitive';
}

function estimateTrafficPotential(data: KeywordData): number {
    const { volume, position } = data;

    // CTR by position (approximate)
    const ctrByPosition: Record<number, number> = {
        1: 0.32, 2: 0.24, 3: 0.18, 4: 0.13, 5: 0.10,
        6: 0.08, 7: 0.06, 8: 0.05, 9: 0.04, 10: 0.03,
    };

    // Estimate potential traffic if reaching top 3
    const targetCtr = 0.18; // Position 3
    const currentCtr = position ? (ctrByPosition[Math.min(position, 10)] || 0.02) : 0;

    const potentialClicks = Math.round(volume * targetCtr);
    const currentClicks = Math.round(volume * currentCtr);

    return potentialClicks - currentClicks;
}

function generateRecommendation(
    type: OpportunityType,
    data: KeywordData,
    factors: OpportunityScore['factors']
): string {
    switch (type) {
        case 'quick_win':
            return `Ranking at position ${data.position}. Optimize title/meta, add internal links, and update content to reach top 5.`;

        case 'ctr_opportunity':
            return `Good ranking but low CTR. Improve title tag and meta description to be more compelling.`;

        case 'low_hanging':
            return `Low competition keyword with ${data.volume} monthly searches. Create targeted content to capture this traffic.`;

        case 'high_value':
            return `High-value keyword (${data.volume.toLocaleString()} vol). Worth investing in comprehensive content.`;

        case 'new_opportunity':
            return `Not currently ranking. Create optimized content targeting "${data.keyword}".`;

        case 'competitive':
            return `Competitive keyword. Consider long-tail variations or build topical authority first.`;

        default:
            return `Analyze this keyword further and create targeted content.`;
    }
}

export default {
    scoreKeywordOpportunity,
    rankOpportunities,
    getTopOpportunities,
};
