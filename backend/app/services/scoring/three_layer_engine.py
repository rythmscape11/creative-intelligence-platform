"""
Three-Layer Scoring Engine - CMO-Grade Scoring System
Implements sophisticated, defensible scoring with confidence bands.

Scoring Philosophy:
- No single-signal scoring
- No intuition-only scoring  
- No unexplainable averages
- Every score = Deterministic + AI Perception + Marketing Science
"""
from typing import Dict, Any, List, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum
import numpy as np
import structlog

logger = structlog.get_logger()


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class SignalLayer(str, Enum):
    DETERMINISTIC = "deterministic"  # OpenCV, OCR
    PERCEPTUAL = "perceptual"  # GPT-4 Vision
    COGNITIVE = "cognitive"  # LLM reasoning


@dataclass
class MicroSignal:
    """Individual measurement with full metadata."""
    name: str
    value: float
    layer: SignalLayer
    weight: float = 1.0
    directionality: str = "positive"  # positive = higher is better
    threshold_min: float = 0
    threshold_max: float = 100
    confidence: float = 1.0
    unit: str = "score"
    raw_data: Any = None


@dataclass
class ScoreExplanation:
    """CMO-grade explanation for a score."""
    what_drove_this: List[str]
    what_hurt_this: List[str]
    what_to_fix_first: str
    expected_fix_impact: float
    boardroom_summary: str


@dataclass
class PillarResult:
    """Complete result for a macro pillar."""
    name: str
    score: float
    confidence: ConfidenceLevel
    confidence_score: float  # 0-1
    confidence_reason: str
    contributing_signals: List[Dict]
    explanation: ScoreExplanation
    layer_breakdown: Dict[str, float]
    data_completeness: float
    benchmark_percentile: Optional[float] = None
    vs_category_avg: Optional[float] = None


@dataclass
class FinalScoreResult:
    """Complete scoring output with all guardrails."""
    overall_score: float
    confidence: ConfidenceLevel
    confidence_band: Tuple[float, float]
    pillars: List[PillarResult]
    decision_summary: Dict[str, str]  # CMO actionable output
    warnings: List[str]
    contradictions: List[str]
    data_quality_score: float


# ============== PILLAR DEFINITIONS (5-12 signals each) ==============

PILLAR_DEFINITIONS = {
    "attention_capture": {
        "description": "Ability to grab and hold viewer attention",
        "target_signals": {
            # Layer 1: Deterministic
            "contrast_rms": {"layer": "deterministic", "weight": 0.12, "direction": "positive"},
            "saturation_mean": {"layer": "deterministic", "weight": 0.08, "direction": "positive"},
            "saliency_concentration": {"layer": "deterministic", "weight": 0.15, "direction": "positive"},
            "edge_density": {"layer": "deterministic", "weight": 0.08, "direction": "positive"},
            # Layer 2: Perceptual
            "face_count": {"layer": "perceptual", "weight": 0.15, "direction": "positive"},
            "scene_complexity": {"layer": "perceptual", "weight": 0.08, "direction": "negative"},
            "visual_interest": {"layer": "perceptual", "weight": 0.12, "direction": "positive"},
            # Layer 3: Cognitive
            "attention_capture": {"layer": "cognitive", "weight": 0.12, "direction": "positive"},
            "first_fixation_element": {"layer": "cognitive", "weight": 0.10, "direction": "positive"},
        },
        "min_signals": 5,
        "benchmarks": {"fmcg": 65, "tech": 60, "fashion": 70}
    },
    "brand_presence": {
        "description": "Visibility and integration of brand elements",
        "target_signals": {
            "logo_visible": {"layer": "perceptual", "weight": 0.20, "direction": "positive"},
            "logo_area_percentage": {"layer": "deterministic", "weight": 0.15, "direction": "positive"},
            "brand_mention_count": {"layer": "deterministic", "weight": 0.12, "direction": "positive"},
            "product_visible": {"layer": "perceptual", "weight": 0.18, "direction": "positive"},
            "product_prominence": {"layer": "perceptual", "weight": 0.15, "direction": "positive"},
            "brand_integration_score": {"layer": "cognitive", "weight": 0.20, "direction": "positive"},
        },
        "min_signals": 4,
        "benchmarks": {"fmcg": 70, "tech": 60, "fashion": 55}
    },
    "message_clarity": {
        "description": "Clarity and communicability of the core message",
        "target_signals": {
            "text_contrast_ratio": {"layer": "deterministic", "weight": 0.12, "direction": "positive"},
            "font_size_variance": {"layer": "deterministic", "weight": 0.08, "direction": "positive"},
            "white_space_percentage": {"layer": "deterministic", "weight": 0.10, "direction": "positive"},
            "word_count": {"layer": "deterministic", "weight": 0.08, "direction": "negative"},
            "copy_readability": {"layer": "perceptual", "weight": 0.15, "direction": "positive"},
            "claim_specificity": {"layer": "cognitive", "weight": 0.18, "direction": "positive"},
            "cognitive_load": {"layer": "cognitive", "weight": 0.15, "direction": "negative"},
            "visual_hierarchy_clarity": {"layer": "cognitive", "weight": 0.14, "direction": "positive"},
        },
        "min_signals": 5,
        "benchmarks": {"fmcg": 68, "tech": 72, "fashion": 58}
    },
    "emotional_resonance": {
        "description": "Emotional impact and storytelling effectiveness",
        "target_signals": {
            "positive_expression": {"layer": "perceptual", "weight": 0.18, "direction": "positive"},
            "emotional_appeal": {"layer": "perceptual", "weight": 0.20, "direction": "positive"},
            "story_clarity": {"layer": "perceptual", "weight": 0.15, "direction": "positive"},
            "narrative_present": {"layer": "perceptual", "weight": 0.12, "direction": "positive"},
            "memory_encoding_likelihood": {"layer": "cognitive", "weight": 0.20, "direction": "positive"},
            "human_connection": {"layer": "cognitive", "weight": 0.15, "direction": "positive"},
        },
        "min_signals": 4,
        "benchmarks": {"fmcg": 62, "tech": 55, "fashion": 72}
    },
    "cultural_relevance": {
        "description": "Cultural appropriateness and local market fit (India-first)",
        "target_signals": {
            "india_relevance": {"layer": "cognitive", "weight": 0.35, "direction": "positive"},
            "cultural_sensitivity_flags": {"layer": "cognitive", "weight": 0.25, "direction": "negative"},
            "local_context_score": {"layer": "perceptual", "weight": 0.20, "direction": "positive"},
            "claim_credibility": {"layer": "cognitive", "weight": 0.20, "direction": "positive"},
        },
        "min_signals": 3,
        "benchmarks": {"fmcg": 70, "tech": 60, "fashion": 65}
    },
    "action_motivation": {
        "description": "Effectiveness at driving desired action",
        "target_signals": {
            "cta_present": {"layer": "deterministic", "weight": 0.15, "direction": "positive"},
            "cta_prominence": {"layer": "deterministic", "weight": 0.18, "direction": "positive"},
            "cta_clarity": {"layer": "cognitive", "weight": 0.20, "direction": "positive"},
            "cta_urgency": {"layer": "cognitive", "weight": 0.12, "direction": "positive"},
            "trust_marker_count": {"layer": "deterministic", "weight": 0.15, "direction": "positive"},
            "value_proposition_clarity": {"layer": "cognitive", "weight": 0.20, "direction": "positive"},
        },
        "min_signals": 4,
        "benchmarks": {"fmcg": 65, "tech": 70, "fashion": 55}
    }
}


class ThreeLayerScoringEngine:
    """
    CMO-Grade scoring engine implementing the three-layer model:
    1. Deterministic (OpenCV/OCR) - repeatable, measurable
    2. Perceptual (GPT-4 Vision) - AI interpretation
    3. Cognitive (LLM) - marketing science reasoning
    """
    
    def __init__(self, benchmarks: Dict = None, category: str = "general"):
        self.benchmarks = benchmarks or {}
        self.category = category
        self.warnings = []
        self.contradictions = []
    
    def score(
        self,
        all_signals: Dict[str, Dict],
        category: str = "general",
        platform: str = "general",
        funnel_stage: str = "awareness"
    ) -> FinalScoreResult:
        """Execute full three-layer scoring with all guardrails."""
        
        self.category = category
        self.warnings = []
        self.contradictions = []
        
        # Flatten and classify signals
        classified_signals = self._classify_signals(all_signals)
        
        # Check for layer completeness
        layer_coverage = self._check_layer_coverage(classified_signals)
        
        # Score each pillar
        pillars = []
        for pillar_name, pillar_def in PILLAR_DEFINITIONS.items():
            pillar_result = self._score_pillar(
                pillar_name, pillar_def, classified_signals, category
            )
            pillars.append(pillar_result)
        
        # Cross-validate and detect contradictions
        self._cross_validate(pillars, classified_signals)
        
        # Calculate final weighted score
        overall, confidence_band = self._calculate_weighted_final(pillars, funnel_stage, platform)
        
        # Determine overall confidence
        data_quality = self._calculate_data_quality(layer_coverage, pillars)
        confidence = self._determine_confidence(data_quality, pillars)
        
        # Generate CMO decision summary
        decision_summary = self._generate_decision_summary(
            overall, pillars, platform, funnel_stage
        )
        
        logger.info("three_layer_scoring_complete", 
                   overall=overall, confidence=confidence, 
                   warnings=len(self.warnings))
        
        return FinalScoreResult(
            overall_score=round(overall, 1),
            confidence=confidence,
            confidence_band=confidence_band,
            pillars=pillars,
            decision_summary=decision_summary,
            warnings=self.warnings,
            contradictions=self.contradictions,
            data_quality_score=data_quality
        )
    
    def _classify_signals(self, all_signals: Dict) -> Dict[str, MicroSignal]:
        """Flatten and classify signals by layer."""
        classified = {}
        
        layer_mapping = {
            "opencv": SignalLayer.DETERMINISTIC,
            "ocr": SignalLayer.DETERMINISTIC,
            "vision": SignalLayer.PERCEPTUAL,
            "copy": SignalLayer.COGNITIVE,
            "cognitive": SignalLayer.COGNITIVE,
        }
        
        for source, signals in all_signals.items():
            layer = layer_mapping.get(source, SignalLayer.DETERMINISTIC)
            
            for name, data in signals.items():
                if isinstance(data, dict):
                    value = data.get("value", 0)
                    if data.get("unit") == "boolean":
                        value = value * 100 if value else 0
                    confidence = data.get("confidence", 1.0)
                else:
                    value = data
                    confidence = 1.0
                
                classified[name] = MicroSignal(
                    name=name,
                    value=value,
                    layer=layer,
                    confidence=confidence
                )
        
        return classified
    
    def _check_layer_coverage(self, signals: Dict[str, MicroSignal]) -> Dict[str, float]:
        """Check coverage of each layer."""
        layer_counts = {layer: 0 for layer in SignalLayer}
        
        for signal in signals.values():
            layer_counts[signal.layer] += 1
        
        coverage = {}
        expected = {
            SignalLayer.DETERMINISTIC: 20,
            SignalLayer.PERCEPTUAL: 10,
            SignalLayer.COGNITIVE: 8
        }
        
        for layer, count in layer_counts.items():
            coverage[layer.value] = min(1.0, count / expected.get(layer, 10))
        
        # Warn if any layer is low
        for layer, cov in coverage.items():
            if cov < 0.5:
                self.warnings.append(f"Low {layer} signal coverage ({cov*100:.0f}%). Score confidence reduced.")
        
        return coverage
    
    def _score_pillar(
        self,
        name: str,
        definition: Dict,
        signals: Dict[str, MicroSignal],
        category: str
    ) -> PillarResult:
        """Score a single pillar with three-layer validation."""
        
        target_signals = definition["target_signals"]
        min_signals = definition.get("min_signals", 5)
        
        # Collect matching signals
        matched = []
        layer_scores = {layer.value: [] for layer in SignalLayer}
        
        for signal_name, config in target_signals.items():
            if signal_name in signals:
                signal = signals[signal_name]
                
                # Apply directionality
                value = signal.value
                if config.get("direction") == "negative":
                    value = 100 - min(100, max(0, value))
                else:
                    value = min(100, max(0, value))
                
                weighted_value = value * config["weight"]
                
                matched.append({
                    "name": signal_name,
                    "raw_value": signal.value,
                    "normalized_value": value,
                    "weight": config["weight"],
                    "contribution": weighted_value,
                    "layer": config["layer"],
                    "confidence": signal.confidence
                })
                
                layer_scores[config["layer"]].append(weighted_value)
        
        # Check minimum signal requirement
        if len(matched) < min_signals:
            self.warnings.append(
                f"{name}: Only {len(matched)}/{min_signals} signals available. Score degraded."
            )
        
        # Calculate layer breakdown
        layer_breakdown = {}
        total_score = 0
        total_weight = 0
        
        for layer, scores in layer_scores.items():
            if scores:
                layer_breakdown[layer] = sum(scores)
                total_score += sum(scores)
        
        # Normalize score
        if matched:
            weight_sum = sum(m["weight"] for m in matched)
            score = (total_score / weight_sum) if weight_sum > 0 else 50
        else:
            score = 50  # Default neutral
        
        # Calculate data completeness
        data_completeness = len(matched) / len(target_signals)
        
        # Determine confidence
        confidence_score, confidence, confidence_reason = self._calculate_pillar_confidence(
            matched, data_completeness, layer_breakdown
        )
        
        # Get benchmark comparison
        benchmark = definition.get("benchmarks", {}).get(category, 60)
        vs_category_avg = score - benchmark
        
        # Generate explanation
        explanation = self._generate_pillar_explanation(
            name, score, matched, vs_category_avg
        )
        
        return PillarResult(
            name=name,
            score=round(score, 1),
            confidence=confidence,
            confidence_score=confidence_score,
            confidence_reason=confidence_reason,
            contributing_signals=matched,
            explanation=explanation,
            layer_breakdown=layer_breakdown,
            data_completeness=data_completeness,
            benchmark_percentile=None,  # Would need benchmark data
            vs_category_avg=round(vs_category_avg, 1)
        )
    
    def _calculate_pillar_confidence(
        self,
        matched: List,
        completeness: float,
        layer_breakdown: Dict
    ) -> Tuple[float, ConfidenceLevel, str]:
        """Calculate confidence level for a pillar."""
        
        # Base confidence from data completeness
        confidence_score = completeness * 0.4
        
        # Add confidence from layer coverage
        layers_with_data = sum(1 for v in layer_breakdown.values() if v > 0)
        layer_bonus = (layers_with_data / 3) * 0.3
        confidence_score += layer_bonus
        
        # Add confidence from signal quality
        if matched:
            avg_signal_confidence = np.mean([m["confidence"] for m in matched])
            confidence_score += avg_signal_confidence * 0.3
        
        # Determine level
        if confidence_score >= 0.75:
            level = ConfidenceLevel.HIGH
            reason = "Strong data from all three layers"
        elif confidence_score >= 0.5:
            level = ConfidenceLevel.MEDIUM
            reason = f"Partial data ({completeness*100:.0f}% signals available)"
        else:
            level = ConfidenceLevel.LOW
            reason = f"Insufficient data ({completeness*100:.0f}% signals, {layers_with_data}/3 layers)"
        
        return confidence_score, level, reason
    
    def _generate_pillar_explanation(
        self,
        name: str,
        score: float,
        matched: List,
        vs_avg: float
    ) -> ScoreExplanation:
        """Generate CMO-grade explanation for a pillar."""
        
        # Sort by contribution
        sorted_signals = sorted(matched, key=lambda x: x["contribution"], reverse=True)
        
        # What drove this (top positive contributors)
        drivers = []
        for s in sorted_signals[:3]:
            if s["normalized_value"] >= 60:
                drivers.append(
                    f"{s['name'].replace('_', ' ').title()}: {s['raw_value']:.0f} (strong)"
                )
        
        # What hurt this (bottom contributors)
        detractors = []
        for s in sorted_signals[-3:]:
            if s["normalized_value"] < 40:
                detractors.append(
                    f"{s['name'].replace('_', ' ').title()}: {s['raw_value']:.0f} (weak)"
                )
        
        # What to fix first (lowest weighted contributor)
        if detractors:
            fix_target = sorted_signals[-1]
            fix_first = f"Improve {fix_target['name'].replace('_', ' ')}"
            fix_impact = min(15, (60 - fix_target['normalized_value']) * fix_target['weight'])
        else:
            fix_first = "No critical issues identified"
            fix_impact = 0
        
        # Boardroom summary
        if score >= 75:
            rating = "Strong"
        elif score >= 60:
            rating = "Good"
        elif score >= 45:
            rating = "Average"
        else:
            rating = "Needs attention"
        
        vs_text = f"{abs(vs_avg):.0f} pts {'above' if vs_avg >= 0 else 'below'} category average"
        
        boardroom = f"{rating} {name.replace('_', ' ')} ({score:.0f}/100). {vs_text}."
        
        return ScoreExplanation(
            what_drove_this=drivers or ["No standout positive signals"],
            what_hurt_this=detractors or ["No major detractors"],
            what_to_fix_first=fix_first,
            expected_fix_impact=round(fix_impact, 1),
            boardroom_summary=boardroom
        )
    
    def _cross_validate(self, pillars: List[PillarResult], signals: Dict):
        """Cross-validate between deterministic and AI signals."""
        
        # Check for contradictions
        for pillar in pillars:
            det_scores = pillar.layer_breakdown.get("deterministic", 0)
            ai_scores = pillar.layer_breakdown.get("perceptual", 0) + pillar.layer_breakdown.get("cognitive", 0)
            
            # Normalize
            det_contributors = sum(1 for s in pillar.contributing_signals if s["layer"] == "deterministic")
            ai_contributors = sum(1 for s in pillar.contributing_signals if s["layer"] in ["perceptual", "cognitive"])
            
            if det_contributors and ai_contributors:
                det_avg = det_scores / det_contributors if det_contributors else 0
                ai_avg = ai_scores / ai_contributors if ai_contributors else 0
                
                # Flag large discrepancy
                if abs(det_avg - ai_avg) > 25:
                    self.contradictions.append(
                        f"{pillar.name}: Deterministic and AI signals diverge by {abs(det_avg - ai_avg):.0f} pts. "
                        f"Review manually."
                    )
    
    def _calculate_weighted_final(
        self,
        pillars: List[PillarResult],
        funnel_stage: str,
        platform: str
    ) -> Tuple[float, Tuple[float, float]]:
        """Calculate weighted final score with context adjustments."""
        
        # Base weights
        weights = {
            "attention_capture": 0.18,
            "brand_presence": 0.15,
            "message_clarity": 0.20,
            "emotional_resonance": 0.15,
            "cultural_relevance": 0.15,
            "action_motivation": 0.17
        }
        
        # Funnel stage adjustments
        funnel_mods = {
            "awareness": {"attention_capture": 1.3, "action_motivation": 0.7},
            "consideration": {"message_clarity": 1.2, "emotional_resonance": 1.2},
            "conversion": {"action_motivation": 1.5, "message_clarity": 1.2, "attention_capture": 0.8}
        }
        
        # Platform adjustments
        platform_mods = {
            "instagram": {"attention_capture": 1.3, "emotional_resonance": 1.2},
            "youtube": {"emotional_resonance": 1.3, "brand_presence": 1.1},
            "facebook": {"message_clarity": 1.2, "action_motivation": 1.1},
            "search": {"message_clarity": 1.3, "action_motivation": 1.3, "emotional_resonance": 0.7}
        }
        
        # Apply adjustments
        adjusted_weights = weights.copy()
        for pillar, mod in funnel_mods.get(funnel_stage, {}).items():
            if pillar in adjusted_weights:
                adjusted_weights[pillar] *= mod
        
        for pillar, mod in platform_mods.get(platform, {}).items():
            if pillar in adjusted_weights:
                adjusted_weights[pillar] *= mod
        
        # Normalize
        total_weight = sum(adjusted_weights.values())
        adjusted_weights = {k: v/total_weight for k, v in adjusted_weights.items()}
        
        # Calculate weighted score
        weighted_sum = 0
        weighted_lower = 0
        weighted_upper = 0
        
        for pillar in pillars:
            w = adjusted_weights.get(pillar.name, 0.15)
            weighted_sum += pillar.score * w
            
            # Confidence-based range
            uncertainty = (1 - pillar.confidence_score) * 10
            weighted_lower += (pillar.score - uncertainty) * w
            weighted_upper += (pillar.score + uncertainty) * w
        
        return (
            weighted_sum,
            (round(max(0, weighted_lower), 1), round(min(100, weighted_upper), 1))
        )
    
    def _calculate_data_quality(
        self,
        layer_coverage: Dict,
        pillars: List[PillarResult]
    ) -> float:
        """Calculate overall data quality score."""
        
        # Layer coverage contribution (40%)
        layer_score = np.mean(list(layer_coverage.values())) * 0.4
        
        # Pillar completeness contribution (40%)
        pillar_completeness = np.mean([p.data_completeness for p in pillars]) * 0.4
        
        # Confidence contribution (20%)
        confidence_score = np.mean([p.confidence_score for p in pillars]) * 0.2
        
        return layer_score + pillar_completeness + confidence_score
    
    def _determine_confidence(
        self,
        data_quality: float,
        pillars: List[PillarResult]
    ) -> ConfidenceLevel:
        """Determine overall confidence level."""
        
        # Check for low-confidence pillars
        low_confidence_pillars = sum(1 for p in pillars if p.confidence == ConfidenceLevel.LOW)
        
        if low_confidence_pillars >= 3:
            return ConfidenceLevel.LOW
        
        if data_quality >= 0.75 and self.contradictions == []:
            return ConfidenceLevel.HIGH
        elif data_quality >= 0.5:
            return ConfidenceLevel.MEDIUM
        else:
            return ConfidenceLevel.LOW
    
    def _generate_decision_summary(
        self,
        overall: float,
        pillars: List[PillarResult],
        platform: str,
        funnel_stage: str
    ) -> Dict[str, str]:
        """Generate CMO-actionable decision summary."""
        
        sorted_pillars = sorted(pillars, key=lambda p: p.score, reverse=True)
        strengths = [p.name.replace("_", " ").title() for p in sorted_pillars[:2] if p.score >= 65]
        weaknesses = [p.name.replace("_", " ").title() for p in sorted_pillars[-2:] if p.score < 50]
        
        # Which creative to run
        if overall >= 70:
            run_decision = "Strong candidate for deployment"
        elif overall >= 55:
            run_decision = "Deploy with optimization recommendations applied"
        else:
            run_decision = "Significant revision needed before deployment"
        
        # Where to run it
        if platform != "general":
            where_decision = f"Optimized for {platform.title()}"
        else:
            best_platform = "Instagram" if "Emotional" in strengths else "Facebook"
            where_decision = f"Consider {best_platform} based on strengths"
        
        # Why it will work (or won't)
        if overall >= 65:
            why_decision = f"Strong {', '.join(strengths[:2]).lower()} will resonate"
        else:
            why_decision = f"Address weak {', '.join(weaknesses[:1]).lower()} for better performance"
        
        # What to improve next
        worst = sorted_pillars[-1]
        improve_decision = worst.explanation.what_to_fix_first
        
        return {
            "run_decision": run_decision,
            "platform_fit": where_decision,
            "success_rationale": why_decision,
            "priority_improvement": improve_decision,
            "expected_uplift": f"+{worst.explanation.expected_fix_impact:.1f} pts from top fix"
        }


def score_creative_three_layer(
    all_signals: Dict,
    category: str = "general",
    platform: str = "general",
    funnel_stage: str = "awareness"
) -> Dict[str, Any]:
    """Convenience function for three-layer scoring."""
    
    engine = ThreeLayerScoringEngine(category=category)
    result = engine.score(all_signals, category, platform, funnel_stage)
    
    return {
        "overall_score": result.overall_score,
        "confidence": result.confidence.value,
        "confidence_band": result.confidence_band,
        "data_quality": round(result.data_quality_score, 2),
        "decision_summary": result.decision_summary,
        "warnings": result.warnings,
        "contradictions": result.contradictions,
        "pillars": [{
            "name": p.name,
            "score": p.score,
            "confidence": p.confidence.value,
            "confidence_reason": p.confidence_reason,
            "vs_category_avg": p.vs_category_avg,
            "layer_breakdown": p.layer_breakdown,
            "explanation": {
                "what_drove_this": p.explanation.what_drove_this,
                "what_hurt_this": p.explanation.what_hurt_this,
                "what_to_fix_first": p.explanation.what_to_fix_first,
                "expected_fix_impact": p.explanation.expected_fix_impact,
                "boardroom_summary": p.explanation.boardroom_summary
            }
        } for p in result.pillars]
    }
