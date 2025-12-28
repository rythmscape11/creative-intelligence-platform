"""
Differentiation & Anti-Hallucination Module
Detects generic claims, visual tropes, and validates signal consistency.
"""
from typing import Dict, Any, List, Tuple
from dataclasses import dataclass
import structlog
import re

logger = structlog.get_logger()


# ============== GENERIC CLAIM DETECTION ==============

GENERIC_CLAIMS = [
    r"best.*(quality|product|service)",
    r"premium\s+quality",
    r"world\s*class",
    r"leading\s+(brand|company)",
    r"trusted\s+by\s+millions",
    r"#1\s+(choice|brand)",
    r"100%\s+(satisfaction|guaranteed)",
    r"unbeatable\s+(price|quality)",
    r"the\s+best\s+in\s+class",
    r"revolutionar(y|izing)",
    r"game\s*changer",
    r"next\s+generation",
    r"cutting\s*edge",
    r"state\s+of\s+the\s+art",
    r"innovative\s+solution",
]

COMMODITY_PHRASES = [
    r"shop\s+now",
    r"buy\s+now",
    r"limited\s+time",
    r"hurry",
    r"don'?t\s+miss",
    r"exclusive\s+offer",
    r"special\s+discount",
    r"free\s+shipping",
    r"order\s+today",
]

INDIA_SPECIFIC_TROPES = [
    r"made\s+in\s+india",
    r"swadeshi",
    r"desi\s+(quality|brand)",
    r"bharatiya",
    r"sabse\s+(acha|sasta)",
]


@dataclass
class DifferentiationResult:
    """Result of differentiation analysis."""
    distinctiveness_score: float
    generic_claim_count: int
    generic_claims_found: List[str]
    commodity_phrase_count: int
    visual_uniqueness_score: float
    category_distinctiveness: float
    improvement_suggestions: List[str]
    is_me_too: bool


class DifferentiationAnalyzer:
    """Analyze creative distinctiveness vs category norms."""
    
    def analyze(
        self,
        ocr_text: str,
        copy_signals: Dict,
        vision_signals: Dict,
        category: str = "general"
    ) -> DifferentiationResult:
        """Analyze distinctiveness of the creative."""
        
        # Detect generic claims
        generic_found = self._detect_generic_claims(ocr_text)
        commodity_found = self._detect_commodity_phrases(ocr_text)
        
        # Score claim specificity
        claim_specificity = copy_signals.get("claim_specificity", {}).get("value", 50)
        
        # Visual uniqueness (inverse of common tropes)
        visual_uniqueness = self._score_visual_uniqueness(vision_signals)
        
        # Category distinctiveness
        category_distinctiveness = self._score_category_fit(
            copy_signals, vision_signals, category
        )
        
        # Overall distinctiveness
        distinctiveness = self._calculate_distinctiveness(
            len(generic_found), len(commodity_found),
            claim_specificity, visual_uniqueness, category_distinctiveness
        )
        
        # Generate suggestions
        suggestions = self._generate_suggestions(
            generic_found, commodity_found, claim_specificity
        )
        
        # Determine if "me-too"
        is_me_too = distinctiveness < 40 or len(generic_found) >= 3
        
        return DifferentiationResult(
            distinctiveness_score=distinctiveness,
            generic_claim_count=len(generic_found),
            generic_claims_found=generic_found,
            commodity_phrase_count=len(commodity_found),
            visual_uniqueness_score=visual_uniqueness,
            category_distinctiveness=category_distinctiveness,
            improvement_suggestions=suggestions,
            is_me_too=is_me_too
        )
    
    def _detect_generic_claims(self, text: str) -> List[str]:
        """Find generic claims in text."""
        found = []
        text_lower = text.lower()
        
        for pattern in GENERIC_CLAIMS:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            if matches:
                # Find the actual text that matched
                match = re.search(pattern, text_lower, re.IGNORECASE)
                if match:
                    found.append(text[match.start():match.end()])
        
        return found
    
    def _detect_commodity_phrases(self, text: str) -> List[str]:
        """Find commodity/overused phrases."""
        found = []
        text_lower = text.lower()
        
        for pattern in COMMODITY_PHRASES:
            if re.search(pattern, text_lower, re.IGNORECASE):
                match = re.search(pattern, text_lower, re.IGNORECASE)
                if match:
                    found.append(text[match.start():match.end()])
        
        return found
    
    def _score_visual_uniqueness(self, vision_signals: Dict) -> float:
        """Score visual uniqueness (0-100)."""
        
        # Factors that indicate uniqueness
        uniqueness = 50  # Base
        
        # Unique composition
        if vision_signals.get("scene_type", "") not in ["studio", "white_background", "stock"]:
            uniqueness += 10
        
        # Human presence (unique faces)
        face_count = vision_signals.get("face_count", {})
        if isinstance(face_count, dict):
            face_count = face_count.get("value", 0)
        if face_count > 0:
            uniqueness += 15
        
        # Story/narrative
        story = vision_signals.get("narrative_present", {})
        if isinstance(story, dict):
            story = story.get("value", 0)
        if story:
            uniqueness += 20
        
        # Emotional content
        emotion = vision_signals.get("emotional_appeal", {})
        if isinstance(emotion, dict):
            emotion = emotion.get("value", 50)
        uniqueness += (emotion - 50) * 0.1
        
        return min(100, max(0, uniqueness))
    
    def _score_category_fit(
        self,
        copy_signals: Dict,
        vision_signals: Dict,
        category: str
    ) -> float:
        """Score how distinct from category norms."""
        
        # Higher = more distinct from generic category creative
        distinctiveness = 50
        
        # Check for category-specific tropes
        india_score = copy_signals.get("india_relevance", {})
        if isinstance(india_score, dict):
            india_score = india_score.get("value", 50)
        
        # India relevance increases distinctiveness for non-Indian brands
        if india_score > 60:
            distinctiveness += 15
        
        # Claim credibility indicates thoughtful messaging
        credibility = copy_signals.get("claim_credibility", {})
        if isinstance(credibility, dict):
            credibility = credibility.get("value", 50)
        distinctiveness += (credibility - 50) * 0.2
        
        return min(100, max(0, distinctiveness))
    
    def _calculate_distinctiveness(
        self,
        generic_count: int,
        commodity_count: int,
        claim_specificity: float,
        visual_uniqueness: float,
        category_distinctiveness: float
    ) -> float:
        """Calculate overall distinctiveness score."""
        
        # Start with base
        score = 60
        
        # Penalize generic claims heavily
        score -= generic_count * 12
        
        # Penalize commodity phrases
        score -= commodity_count * 5
        
        # Add claim specificity
        score += (claim_specificity - 50) * 0.3
        
        # Add visual uniqueness
        score += (visual_uniqueness - 50) * 0.2
        
        # Add category distinctiveness
        score += (category_distinctiveness - 50) * 0.2
        
        return min(100, max(0, score))
    
    def _generate_suggestions(
        self,
        generic_claims: List[str],
        commodity_phrases: List[str],
        claim_specificity: float
    ) -> List[str]:
        """Generate improvement suggestions."""
        
        suggestions = []
        
        if generic_claims:
            suggestions.append(
                f"Replace generic claims ({', '.join(generic_claims[:2])}) with specific, " 
                "provable benefits"
            )
        
        if commodity_phrases:
            suggestions.append(
                "Replace commodity CTAs with brand-specific action language"
            )
        
        if claim_specificity < 50:
            suggestions.append(
                "Add specific numbers, percentages, or proof points to claims"
            )
        
        if not suggestions:
            suggestions.append("Strong differentiation - maintain current approach")
        
        return suggestions


# ============== ANTI-HALLUCINATION CHECKS ==============

@dataclass
class ValidationResult:
    """Result of signal validation."""
    is_valid: bool
    sanity_passed: bool
    contradictions: List[str]
    warnings: List[str]
    adjusted_confidence: float


class AntiHallucinationValidator:
    """Validate signals and detect hallucinations/contradictions."""
    
    # Sanity thresholds
    THRESHOLDS = {
        "contrast_rms": (0, 100),
        "saturation_mean": (0, 255),
        "white_space_percentage": (0, 100),
        "text_area_percentage": (0, 100),
        "word_count": (0, 500),
        "cta_prominence": (0, 100),
        "cognitive_load": (0, 100),
        "claim_specificity": (0, 100),
    }
    
    # Expected correlations (positive = should move together)
    CORRELATIONS = [
        ("cognitive_load", "word_count", 0.5, "positive"),
        ("white_space_percentage", "clutter_index", -0.5, "negative"),
        ("contrast_rms", "text_contrast_ratio", 0.3, "positive"),
        ("cta_present", "cta_prominence", 0.7, "positive"),
    ]
    
    def validate(self, all_signals: Dict[str, Dict]) -> ValidationResult:
        """Run all validation checks."""
        
        flat_signals = self._flatten(all_signals)
        
        # Run sanity checks
        sanity_passed, sanity_warnings = self._sanity_check(flat_signals)
        
        # Check for contradictions
        contradictions = self._check_contradictions(flat_signals)
        
        # Calculate adjusted confidence
        base_confidence = 1.0
        if not sanity_passed:
            base_confidence -= 0.2
        base_confidence -= len(contradictions) * 0.1
        
        is_valid = sanity_passed and len(contradictions) < 3
        
        return ValidationResult(
            is_valid=is_valid,
            sanity_passed=sanity_passed,
            contradictions=contradictions,
            warnings=sanity_warnings,
            adjusted_confidence=max(0.3, base_confidence)
        )
    
    def _flatten(self, all_signals: Dict) -> Dict[str, float]:
        """Flatten signals to simple key-value."""
        flat = {}
        for source, signals in all_signals.items():
            for name, data in signals.items():
                if isinstance(data, dict):
                    flat[name] = data.get("value", 0)
                else:
                    flat[name] = data
        return flat
    
    def _sanity_check(self, signals: Dict[str, float]) -> Tuple[bool, List[str]]:
        """Check signals are within expected ranges."""
        
        warnings = []
        passed = True
        
        for signal_name, (min_val, max_val) in self.THRESHOLDS.items():
            if signal_name in signals:
                value = signals[signal_name]
                if value < min_val or value > max_val:
                    warnings.append(
                        f"{signal_name} value ({value}) outside expected range [{min_val}, {max_val}]"
                    )
                    passed = False
        
        return passed, warnings
    
    def _check_contradictions(self, signals: Dict[str, float]) -> List[str]:
        """Check for contradictory signal pairs."""
        
        contradictions = []
        
        for sig1, sig2, threshold, direction in self.CORRELATIONS:
            if sig1 in signals and sig2 in signals:
                val1 = signals[sig1]
                val2 = signals[sig2]
                
                # Normalize to 0-1 scale
                norm1 = min(1, val1 / 100)
                norm2 = min(1, val2 / 100)
                
                if direction == "positive":
                    # Both should be high or both low
                    if abs(norm1 - norm2) > threshold:
                        if norm1 > 0.7 and norm2 < 0.3:
                            contradictions.append(
                                f"Contradiction: {sig1} is high ({val1:.0f}) but {sig2} is low ({val2:.0f})"
                            )
                else:  # negative
                    # When one is high, other should be low
                    if norm1 + norm2 > 1.5:
                        contradictions.append(
                            f"Contradiction: both {sig1} ({val1:.0f}) and {sig2} ({val2:.0f}) are high (expected inverse)"
                        )
        
        return contradictions


# ============== CONVENIENCE FUNCTIONS ==============

def analyze_differentiation(
    ocr_text: str,
    copy_signals: Dict,
    vision_signals: Dict,
    category: str = "general"
) -> Dict[str, Any]:
    """Analyze creative differentiation."""
    
    analyzer = DifferentiationAnalyzer()
    result = analyzer.analyze(ocr_text, copy_signals, vision_signals, category)
    
    return {
        "distinctiveness_score": result.distinctiveness_score,
        "is_me_too": result.is_me_too,
        "generic_claims": result.generic_claims_found,
        "visual_uniqueness": result.visual_uniqueness_score,
        "category_distinctiveness": result.category_distinctiveness,
        "suggestions": result.improvement_suggestions
    }


def validate_signals(all_signals: Dict) -> Dict[str, Any]:
    """Validate signals for hallucinations."""
    
    validator = AntiHallucinationValidator()
    result = validator.validate(all_signals)
    
    return {
        "is_valid": result.is_valid,
        "sanity_passed": result.sanity_passed,
        "contradictions": result.contradictions,
        "warnings": result.warnings,
        "adjusted_confidence": result.adjusted_confidence
    }
