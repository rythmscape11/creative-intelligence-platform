"""
Comparison Engine - Mission 10: Side-by-side creative comparison.
"""
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import structlog

logger = structlog.get_logger()


@dataclass
class ComparisonResult:
    overall_winner: str  # 'A', 'B', 'tie'
    pillar_winners: Dict[str, str]
    trade_offs: List[str]
    recommendation: str
    score_delta: float


class ComparisonEngine:
    """Compare creatives and generate insights."""
    
    SIGNIFICANCE_THRESHOLD = 5  # Point difference needed to declare winner
    
    def compare(
        self, 
        creative_a: Dict[str, Any], 
        creative_b: Dict[str, Any]
    ) -> ComparisonResult:
        """Compare two creative scores."""
        
        pillars_a = {p["name"]: p["score"] for p in creative_a.get("pillars", [])}
        pillars_b = {p["name"]: p["score"] for p in creative_b.get("pillars", [])}
        
        # Determine winners per pillar
        pillar_winners = {}
        trade_offs = []
        a_wins, b_wins = 0, 0
        
        for pillar in set(pillars_a.keys()) | set(pillars_b.keys()):
            a_score = pillars_a.get(pillar, 50)
            b_score = pillars_b.get(pillar, 50)
            diff = a_score - b_score
            
            if abs(diff) < self.SIGNIFICANCE_THRESHOLD:
                pillar_winners[pillar] = "tie"
            elif diff > 0:
                pillar_winners[pillar] = "A"
                a_wins += 1
            else:
                pillar_winners[pillar] = "B"
                b_wins += 1
        
        # Identify trade-offs
        a_strong = [p for p, w in pillar_winners.items() if w == "A"]
        b_strong = [p for p, w in pillar_winners.items() if w == "B"]
        
        if a_strong and b_strong:
            trade_offs.append(f"A excels in {', '.join(a_strong[:2])} while B leads in {', '.join(b_strong[:2])}")
        
        # Overall winner
        score_a = creative_a.get("overall_score", 50)
        score_b = creative_b.get("overall_score", 50)
        score_delta = score_a - score_b
        
        if abs(score_delta) < self.SIGNIFICANCE_THRESHOLD:
            overall_winner = "tie"
        elif score_delta > 0:
            overall_winner = "A"
        else:
            overall_winner = "B"
        
        # Generate recommendation
        recommendation = self._generate_recommendation(
            overall_winner, pillar_winners, score_a, score_b, 
            creative_a, creative_b
        )
        
        return ComparisonResult(
            overall_winner=overall_winner,
            pillar_winners=pillar_winners,
            trade_offs=trade_offs,
            recommendation=recommendation,
            score_delta=abs(score_delta)
        )
    
    def _generate_recommendation(
        self, winner: str, pillar_winners: Dict, 
        score_a: float, score_b: float,
        creative_a: Dict, creative_b: Dict
    ) -> str:
        """Generate actionable recommendation."""
        
        if winner == "tie":
            # Find differentiators
            a_strengths = [p for p, w in pillar_winners.items() if w == "A"]
            b_strengths = [p for p, w in pillar_winners.items() if w == "B"]
            
            if a_strengths and b_strengths:
                return (f"Use A for campaigns prioritizing {a_strengths[0].replace('_', ' ')}, "
                       f"B for {b_strengths[0].replace('_', ' ')} focus.")
            return "Both creatives perform similarly. Choose based on other factors."
        
        winning = "A" if winner == "A" else "B"
        losing = "B" if winner == "A" else "A"
        
        # Find biggest gaps
        winning_scores = creative_a if winner == "A" else creative_b
        losing_scores = creative_b if winner == "A" else creative_a
        
        winning_pillars = {p["name"]: p["score"] for p in winning_scores.get("pillars", [])}
        losing_pillars = {p["name"]: p["score"] for p in losing_scores.get("pillars", [])}
        
        gaps = [(p, winning_pillars.get(p, 50) - losing_pillars.get(p, 50)) 
                for p in winning_pillars.keys()]
        biggest_gap = max(gaps, key=lambda x: x[1])
        
        return (f"Select Creative {winning} (score: {winning_scores.get('overall_score', 0):.0f}). "
               f"Key advantage: {biggest_gap[0].replace('_', ' ')} (+{biggest_gap[1]:.0f} points).")
    
    def compare_against_benchmark(
        self, 
        creative: Dict[str, Any], 
        benchmarks: Dict[str, Dict]
    ) -> Dict[str, Any]:
        """Compare creative against category benchmarks."""
        
        results = {"percentiles": {}, "vs_median": {}, "strengths": [], "weaknesses": []}
        
        for pillar in creative.get("pillars", []):
            name = pillar["name"]
            score = pillar["score"]
            
            if name in benchmarks:
                bench = benchmarks[name]
                p50 = bench.get("p50", 50)
                p75 = bench.get("p75", 75)
                p25 = bench.get("p25", 25)
                
                # Calculate percentile
                if score >= p75:
                    percentile = 75 + (score - p75) / (100 - p75) * 25
                elif score >= p50:
                    percentile = 50 + (score - p50) / (p75 - p50) * 25
                elif score >= p25:
                    percentile = 25 + (score - p25) / (p50 - p25) * 25
                else:
                    percentile = score / p25 * 25
                
                results["percentiles"][name] = min(99, max(1, percentile))
                results["vs_median"][name] = score - p50
                
                if percentile >= 75:
                    results["strengths"].append(name)
                elif percentile <= 25:
                    results["weaknesses"].append(name)
        
        return results


def compare_creatives(a: Dict, b: Dict) -> Dict[str, Any]:
    """Convenience function for comparison."""
    engine = ComparisonEngine()
    result = engine.compare(a, b)
    return {
        "overall_winner": result.overall_winner,
        "pillar_winners": result.pillar_winners,
        "trade_offs": result.trade_offs,
        "recommendation": result.recommendation,
        "score_delta": result.score_delta
    }
