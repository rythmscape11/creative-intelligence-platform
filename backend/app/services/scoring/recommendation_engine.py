"""
Recommendation Engine - Mission 12: Specific fixes with impact simulation.
"""
from typing import Dict, Any, List
from dataclasses import dataclass
import structlog

logger = structlog.get_logger()


@dataclass
class Recommendation:
    priority: int
    signal: str
    fix_category: str
    fix_text: str
    example: str
    current_value: float
    target_value: float
    estimated_uplift: float
    difficulty: str


# Signal-specific fix recommendations
SIGNAL_FIXES = {
    "contrast_rms": {
        "category": "visual",
        "fix": "Increase contrast between text and background",
        "example": "Use darker text on light backgrounds or add subtle text shadows",
        "difficulty": "easy"
    },
    "cta_present": {
        "category": "copy",
        "fix": "Add a clear call-to-action",
        "example": "Include 'Shop Now', 'Learn More', or 'Get Started' button",
        "difficulty": "easy"
    },
    "cta_prominence": {
        "category": "layout",
        "fix": "Make the CTA more visually prominent",
        "example": "Increase CTA size, use contrasting color, position in lower-right",
        "difficulty": "easy"
    },
    "claim_specificity": {
        "category": "copy",
        "fix": "Replace generic claims with specific benefits",
        "example": "Change 'Best Quality' to '30% longer lasting than competitors'",
        "difficulty": "medium"
    },
    "india_relevance": {
        "category": "cultural",
        "fix": "Incorporate India-specific context and references",
        "example": "Use local settings, festivals, or culturally relevant imagery",
        "difficulty": "medium"
    },
    "logo_visible": {
        "category": "brand",
        "fix": "Add or increase logo visibility",
        "example": "Position logo in top-left or bottom-right corner with adequate size",
        "difficulty": "easy"
    },
    "white_space_percentage": {
        "category": "layout",
        "fix": "Increase breathing room around key elements",
        "example": "Add margins around text blocks, reduce element density",
        "difficulty": "medium"
    },
    "cognitive_load": {
        "category": "layout",
        "fix": "Simplify the visual composition",
        "example": "Reduce text, remove secondary elements, focus on one key message",
        "difficulty": "medium"
    },
    "emotional_appeal": {
        "category": "creative",
        "fix": "Add emotional triggers to the creative",
        "example": "Include people showing genuine emotions, lifestyle imagery",
        "difficulty": "hard"
    },
    "trust_marker_count": {
        "category": "copy",
        "fix": "Add trust-building elements",
        "example": "Include certifications, testimonials, 'As seen in', ratings",
        "difficulty": "medium"
    },
    "face_count": {
        "category": "creative",
        "fix": "Include human faces for better connection",
        "example": "Add person using product with positive expression",
        "difficulty": "hard"
    },
    "story_clarity": {
        "category": "creative",
        "fix": "Create a clearer visual narrative",
        "example": "Show before/after, problem/solution, or journey sequence",
        "difficulty": "hard"
    }
}

# Pillar impact weights for uplift calculation
PILLAR_SIGNAL_IMPACT = {
    "attention_capture": ["contrast_rms", "saturation_mean", "face_count"],
    "brand_presence": ["logo_visible", "product_prominence"],
    "message_clarity": ["claim_specificity", "cognitive_load", "white_space_percentage"],
    "emotional_resonance": ["emotional_appeal", "face_count", "story_clarity"],
    "cultural_relevance": ["india_relevance"],
    "action_motivation": ["cta_present", "cta_prominence", "trust_marker_count"]
}


class RecommendationEngine:
    """Generate specific, actionable recommendations with impact estimates."""
    
    def __init__(self, benchmarks: Dict[str, Dict] = None):
        self.benchmarks = benchmarks or {}
    
    def generate(
        self, 
        all_signals: Dict[str, Dict],
        pillars: List[Dict],
        max_recommendations: int = 5
    ) -> List[Recommendation]:
        """Generate prioritized recommendations."""
        
        recommendations = []
        flat_signals = self._flatten_signals(all_signals)
        pillar_scores = {p["name"]: p["score"] for p in pillars}
        
        for signal_name, fix_info in SIGNAL_FIXES.items():
            if signal_name not in flat_signals:
                continue
            
            current = flat_signals[signal_name]
            target = self._get_target(signal_name)
            
            # Skip if already performing well
            if self._is_performing_well(signal_name, current, target):
                continue
            
            # Calculate impact
            impact = self._estimate_impact(signal_name, current, target, pillar_scores)
            
            if impact < 1:  # Skip low-impact fixes
                continue
            
            recommendations.append(Recommendation(
                priority=0,  # Will be set after sorting
                signal=signal_name,
                fix_category=fix_info["category"],
                fix_text=fix_info["fix"],
                example=fix_info["example"],
                current_value=current,
                target_value=target,
                estimated_uplift=impact,
                difficulty=fix_info["difficulty"]
            ))
        
        # Sort by impact (descending) and difficulty (ascending)
        difficulty_order = {"easy": 1, "medium": 2, "hard": 3}
        recommendations.sort(key=lambda r: (-r.estimated_uplift, difficulty_order[r.difficulty]))
        
        # Assign priorities
        for i, rec in enumerate(recommendations[:max_recommendations]):
            rec.priority = i + 1
        
        logger.info("recommendations_generated", count=len(recommendations[:max_recommendations]))
        return recommendations[:max_recommendations]
    
    def _flatten_signals(self, all_signals: Dict) -> Dict[str, float]:
        flat = {}
        for source, signals in all_signals.items():
            for name, data in signals.items():
                if isinstance(data, dict):
                    value = data.get("value", 0)
                    if data.get("unit") == "boolean":
                        value = value * 100
                    flat[name] = value
                else:
                    flat[name] = data
        return flat
    
    def _get_target(self, signal_name: str) -> float:
        """Get target value from benchmarks or defaults."""
        if signal_name in self.benchmarks:
            return self.benchmarks[signal_name].get("p75", 75)
        
        # Default targets
        defaults = {
            "cta_present": 100, "logo_visible": 100, "face_count": 50,
            "contrast_rms": 60, "claim_specificity": 70, "india_relevance": 70,
            "cognitive_load": 40, "white_space_percentage": 25
        }
        return defaults.get(signal_name, 70)
    
    def _is_performing_well(self, signal_name: str, current: float, target: float) -> bool:
        """Check if signal is already at acceptable level."""
        # Inverted signals (lower is better)
        inverted = ["cognitive_load", "clutter_index", "generic_phrase_count"]
        
        if signal_name in inverted:
            return current <= target
        return current >= target * 0.8  # 80% of target is acceptable
    
    def _estimate_impact(
        self, 
        signal_name: str, 
        current: float, 
        target: float,
        pillar_scores: Dict[str, float]
    ) -> float:
        """Estimate overall score uplift from fixing this signal."""
        
        # Find which pillars this signal affects
        affected_pillars = []
        for pillar, signals in PILLAR_SIGNAL_IMPACT.items():
            if signal_name in signals:
                affected_pillars.append(pillar)
        
        if not affected_pillars:
            return 0
        
        # Calculate potential improvement
        inverted = signal_name in ["cognitive_load", "clutter_index"]
        if inverted:
            improvement = max(0, current - target)
        else:
            improvement = max(0, target - current)
        
        # Estimate pillar impact (assume signal contributes ~20% to pillar)
        signal_contribution = 0.2
        
        # Weight by pillar scores (low-scoring pillars have more room to improve)
        total_impact = 0
        for pillar in affected_pillars:
            pillar_score = pillar_scores.get(pillar, 50)
            pillar_headroom = 100 - pillar_score
            pillar_impact = improvement * signal_contribution * (pillar_headroom / 100)
            total_impact += pillar_impact
        
        # Estimate overall score impact (pillars have ~16% weight each)
        overall_impact = total_impact * 0.16
        
        return round(overall_impact, 1)
    
    def simulate_optimization(
        self, 
        current_score: float,
        recommendations: List[Recommendation]
    ) -> Dict[str, Any]:
        """Simulate score after applying recommendations."""
        
        # Sum up impacts (with diminishing returns)
        total_uplift = 0
        for i, rec in enumerate(recommendations):
            # Each subsequent recommendation has 80% of previous effectiveness
            diminishing_factor = 0.8 ** i
            total_uplift += rec.estimated_uplift * diminishing_factor
        
        projected_score = min(100, current_score + total_uplift)
        
        return {
            "current_score": current_score,
            "projected_score": round(projected_score, 1),
            "total_uplift": round(total_uplift, 1),
            "confidence": "medium" if total_uplift < 10 else "low",
            "recommendations_applied": len(recommendations)
        }


def generate_recommendations(signals: Dict, pillars: List, max_recs: int = 5) -> List[Dict]:
    """Convenience function for generating recommendations."""
    engine = RecommendationEngine()
    recs = engine.generate(signals, pillars, max_recs)
    return [{
        "priority": r.priority,
        "signal": r.signal,
        "category": r.fix_category,
        "fix": r.fix_text,
        "example": r.example,
        "current": r.current_value,
        "target": r.target_value,
        "uplift": r.estimated_uplift,
        "difficulty": r.difficulty
    } for r in recs]
