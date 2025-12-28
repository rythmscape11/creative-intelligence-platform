"""
Macro Scoring Engine - Mission 9
Converts micro-signals into pillar scores and final creative score.
"""
from typing import Dict, Any, List, Tuple, Optional
from dataclasses import dataclass
import numpy as np
import structlog

logger = structlog.get_logger()


@dataclass
class PillarScore:
    name: str
    score: float
    confidence_lower: float
    confidence_upper: float
    weight: float
    explanation: str
    contributing_signals: List[Dict[str, Any]]


@dataclass
class FinalScore:
    overall: float
    confidence_band: Tuple[float, float]
    pillars: List[PillarScore]
    funnel_fit: float
    platform_fit: float
    explanation: str


# Pillar configurations with signal mappings
PILLAR_CONFIG = {
    "attention_capture": {
        "weight": 0.18,
        "signals": {
            "attention_capture": 1.0,
            "contrast_rms": 0.8,
            "saliency_mean": 0.9,
            "face_count": 0.7,
            "saturation_mean": 0.5
        }
    },
    "brand_presence": {
        "weight": 0.15,
        "signals": {
            "logo_visible": 1.0,
            "brand_integration_score": 0.9,
            "product_visible": 0.8,
            "product_prominence": 0.7
        }
    },
    "message_clarity": {
        "weight": 0.20,
        "signals": {
            "visual_hierarchy_clarity": 1.0,
            "copy_readability": 0.9,
            "claim_specificity": 0.8,
            "cognitive_load": -0.8,  # Negative = high load is bad
            "processing_friction": -0.7
        }
    },
    "emotional_resonance": {
        "weight": 0.15,
        "signals": {
            "positive_expression": 0.9,
            "emotional_appeal": 1.0,
            "story_clarity": 0.8,
            "narrative_present": 0.7,
            "memory_encoding_likelihood": 0.6
        }
    },
    "cultural_relevance": {
        "weight": 0.15,
        "signals": {
            "india_relevance": 1.0,
            "cultural_sensitivity_flags": -1.0,  # Negative = flags are bad
            "claim_credibility": 0.6
        }
    },
    "action_motivation": {
        "weight": 0.17,
        "signals": {
            "cta_present": 0.8,
            "cta_prominence": 0.9,
            "cta_clarity": 1.0,
            "cta_urgency": 0.7,
            "trust_marker_count": 0.6
        }
    }
}


class ScoringEngine:
    """Converts micro-signals to pillar scores and final score."""
    
    def __init__(self, benchmarks: Dict[str, Dict] = None):
        self.benchmarks = benchmarks or {}
        self.pillar_config = PILLAR_CONFIG
    
    def calculate_scores(
        self, 
        all_signals: Dict[str, Dict],
        category: str = "general",
        platform: str = "general",
        funnel_stage: str = "awareness"
    ) -> FinalScore:
        """Calculate all pillar scores and final score."""
        
        # Flatten all signals from different sources
        flat_signals = self._flatten_signals(all_signals)
        
        # Calculate each pillar
        pillars = []
        for pillar_name, config in self.pillar_config.items():
            pillar_score = self._calculate_pillar(pillar_name, config, flat_signals)
            pillars.append(pillar_score)
        
        # Apply context-based weight adjustments
        adjusted_pillars = self._adjust_weights(pillars, category, platform, funnel_stage)
        
        # Calculate final score
        overall, confidence = self._calculate_overall(adjusted_pillars)
        
        # Calculate fit scores
        funnel_fit = self._calculate_funnel_fit(adjusted_pillars, funnel_stage)
        platform_fit = self._calculate_platform_fit(adjusted_pillars, flat_signals, platform)
        
        # Generate explanation
        explanation = self._generate_explanation(adjusted_pillars, overall)
        
        return FinalScore(
            overall=overall,
            confidence_band=confidence,
            pillars=adjusted_pillars,
            funnel_fit=funnel_fit,
            platform_fit=platform_fit,
            explanation=explanation
        )
    
    def _flatten_signals(self, all_signals: Dict[str, Dict]) -> Dict[str, float]:
        """Flatten nested signal structure to simple key-value."""
        flat = {}
        for source, signals in all_signals.items():
            for name, data in signals.items():
                if isinstance(data, dict):
                    value = data.get("value", 0)
                    # Normalize boolean to 0-100
                    if data.get("unit") == "boolean":
                        value = value * 100
                    flat[name] = value
                else:
                    flat[name] = data
        return flat
    
    def _calculate_pillar(
        self, 
        pillar_name: str, 
        config: Dict, 
        signals: Dict[str, float]
    ) -> PillarScore:
        """Calculate a single pillar score."""
        
        weighted_sum = 0
        total_weight = 0
        contributing = []
        
        for signal_name, signal_weight in config["signals"].items():
            if signal_name in signals:
                value = signals[signal_name]
                
                # Handle negative weights (inverse relationship)
                if signal_weight < 0:
                    value = 100 - value  # Invert
                    signal_weight = abs(signal_weight)
                
                # Normalize value to 0-100 if needed
                value = min(max(value, 0), 100)
                
                weighted_sum += value * signal_weight
                total_weight += signal_weight
                
                contributing.append({
                    "signal": signal_name,
                    "value": signals[signal_name],
                    "weight": signal_weight,
                    "contribution": value * signal_weight
                })
        
        # Calculate score
        if total_weight > 0:
            score = weighted_sum / total_weight
        else:
            score = 50  # Default neutral score
        
        # Calculate confidence band based on signal coverage
        coverage = len(contributing) / len(config["signals"])
        uncertainty = (1 - coverage) * 15
        
        # Generate explanation
        explanation = self._explain_pillar(pillar_name, contributing, score)
        
        return PillarScore(
            name=pillar_name,
            score=round(score, 1),
            confidence_lower=round(max(0, score - uncertainty), 1),
            confidence_upper=round(min(100, score + uncertainty), 1),
            weight=config["weight"],
            explanation=explanation,
            contributing_signals=contributing
        )
    
    def _explain_pillar(
        self, 
        pillar_name: str, 
        contributing: List[Dict], 
        score: float
    ) -> str:
        """Generate human-readable explanation for pillar score."""
        
        if not contributing:
            return f"Insufficient signals for {pillar_name} analysis."
        
        # Sort by contribution
        sorted_signals = sorted(contributing, key=lambda x: x["contribution"], reverse=True)
        
        # Build explanation
        parts = []
        
        if score >= 75:
            parts.append(f"Strong {pillar_name.replace('_', ' ')}.")
        elif score >= 50:
            parts.append(f"Moderate {pillar_name.replace('_', ' ')}.")
        else:
            parts.append(f"Weak {pillar_name.replace('_', ' ')}.")
        
        # Top contributor
        top = sorted_signals[0]
        parts.append(f"Driven by {top['signal'].replace('_', ' ')} ({top['value']:.0f}).")
        
        # Weak areas
        weak = [s for s in sorted_signals if s["value"] < 40]
        if weak:
            weak_names = [s["signal"].replace("_", " ") for s in weak[:2]]
            parts.append(f"Improve: {', '.join(weak_names)}.")
        
        return " ".join(parts)
    
    def _adjust_weights(
        self, 
        pillars: List[PillarScore],
        category: str,
        platform: str,
        funnel_stage: str
    ) -> List[PillarScore]:
        """Adjust pillar weights based on context."""
        
        # Context-based weight multipliers
        adjustments = {
            # Funnel stage adjustments
            "awareness": {"attention_capture": 1.3, "brand_presence": 1.2, "action_motivation": 0.7},
            "consideration": {"message_clarity": 1.2, "emotional_resonance": 1.2},
            "conversion": {"action_motivation": 1.5, "message_clarity": 1.2, "attention_capture": 0.8},
            
            # Platform adjustments
            "instagram": {"attention_capture": 1.3, "emotional_resonance": 1.2},
            "youtube": {"emotional_resonance": 1.3, "brand_presence": 1.1},
            "facebook": {"message_clarity": 1.2, "action_motivation": 1.1},
            "search": {"message_clarity": 1.3, "action_motivation": 1.3, "emotional_resonance": 0.7}
        }
        
        adjusted = []
        for pillar in pillars:
            new_weight = pillar.weight
            
            # Apply funnel adjustment
            if funnel_stage in adjustments:
                mult = adjustments[funnel_stage].get(pillar.name, 1.0)
                new_weight *= mult
            
            # Apply platform adjustment
            if platform in adjustments:
                mult = adjustments[platform].get(pillar.name, 1.0)
                new_weight *= mult
            
            adjusted.append(PillarScore(
                name=pillar.name,
                score=pillar.score,
                confidence_lower=pillar.confidence_lower,
                confidence_upper=pillar.confidence_upper,
                weight=new_weight,
                explanation=pillar.explanation,
                contributing_signals=pillar.contributing_signals
            ))
        
        # Normalize weights to sum to 1
        total_weight = sum(p.weight for p in adjusted)
        for pillar in adjusted:
            pillar.weight = pillar.weight / total_weight
        
        return adjusted
    
    def _calculate_overall(self, pillars: List[PillarScore]) -> Tuple[float, Tuple[float, float]]:
        """Calculate weighted overall score."""
        
        weighted_sum = sum(p.score * p.weight for p in pillars)
        overall = round(weighted_sum, 1)
        
        # Confidence band
        lower = sum(p.confidence_lower * p.weight for p in pillars)
        upper = sum(p.confidence_upper * p.weight for p in pillars)
        
        return overall, (round(lower, 1), round(upper, 1))
    
    def _calculate_funnel_fit(self, pillars: List[PillarScore], funnel_stage: str) -> float:
        """Calculate how well the creative fits the funnel stage."""
        
        critical_pillars = {
            "awareness": ["attention_capture", "brand_presence"],
            "consideration": ["message_clarity", "emotional_resonance", "cultural_relevance"],
            "conversion": ["action_motivation", "message_clarity"]
        }
        
        pillars_dict = {p.name: p.score for p in pillars}
        critical = critical_pillars.get(funnel_stage, list(pillars_dict.keys()))
        
        if critical:
            fit = sum(pillars_dict.get(p, 50) for p in critical) / len(critical)
        else:
            fit = 50
        
        return round(fit, 1)
    
    def _calculate_platform_fit(
        self, 
        pillars: List[PillarScore], 
        signals: Dict[str, float],
        platform: str
    ) -> float:
        """Calculate platform-specific fit."""
        
        # Platform requirements
        requirements = {
            "instagram": {"attention_capture": 70, "emotional_resonance": 60},
            "youtube": {"emotional_resonance": 65, "brand_presence": 60},
            "facebook": {"message_clarity": 65, "action_motivation": 60},
            "search": {"message_clarity": 70, "action_motivation": 70}
        }
        
        pillars_dict = {p.name: p.score for p in pillars}
        reqs = requirements.get(platform, {})
        
        if not reqs:
            return 70  # Default neutral fit
        
        scores = []
        for pillar, threshold in reqs.items():
            actual = pillars_dict.get(pillar, 50)
            # Score based on how close to threshold
            if actual >= threshold:
                scores.append(100)
            else:
                scores.append(actual / threshold * 100)
        
        return round(sum(scores) / len(scores), 1)
    
    def _generate_explanation(self, pillars: List[PillarScore], overall: float) -> str:
        """Generate overall score explanation."""
        
        sorted_pillars = sorted(pillars, key=lambda p: p.score, reverse=True)
        
        # Rating
        if overall >= 80:
            rating = "Excellent creative with strong fundamentals."
        elif overall >= 65:
            rating = "Good creative with room for optimization."
        elif overall >= 50:
            rating = "Average creative needing targeted improvements."
        else:
            rating = "Below average creative requiring significant work."
        
        # Strengths
        strengths = [p.name.replace("_", " ") for p in sorted_pillars[:2] if p.score >= 65]
        strength_text = f"Strengths: {', '.join(strengths)}." if strengths else ""
        
        # Weaknesses
        weaknesses = [p.name.replace("_", " ") for p in sorted_pillars[-2:] if p.score < 50]
        weakness_text = f"Focus areas: {', '.join(weaknesses)}." if weaknesses else ""
        
        return f"{rating} {strength_text} {weakness_text}".strip()


def calculate_creative_score(all_signals: Dict, category: str = "general", 
                            platform: str = "general", funnel_stage: str = "awareness") -> Dict[str, Any]:
    """Convenience function for scoring."""
    engine = ScoringEngine()
    result = engine.calculate_scores(all_signals, category, platform, funnel_stage)
    
    return {
        "overall_score": result.overall,
        "confidence_band": result.confidence_band,
        "funnel_fit_score": result.funnel_fit,
        "platform_fit_score": result.platform_fit,
        "explanation": result.explanation,
        "pillars": [{
            "name": p.name,
            "score": p.score,
            "confidence_lower": p.confidence_lower,
            "confidence_upper": p.confidence_upper,
            "weight": round(p.weight, 3),
            "explanation": p.explanation
        } for p in result.pillars]
    }
