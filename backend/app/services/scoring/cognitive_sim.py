"""
Cognitive Simulation Service - Mission 8
Simulates human attention and cognitive processing.
"""
import numpy as np
from typing import Dict, Any, List, Tuple
from dataclasses import dataclass
import structlog

logger = structlog.get_logger()


@dataclass
class AttentionPoint:
    x: float
    y: float
    weight: float
    element: str


class CognitiveSimulator:
    """Simulates human visual processing and attention."""
    
    # Attention weights by factor
    ATTENTION_WEIGHTS = {
        "size": 0.25,
        "contrast": 0.25,
        "position": 0.20,
        "faces": 0.15,
        "text": 0.15
    }
    
    # Position importance (F-pattern and Z-pattern combined)
    POSITION_IMPORTANCE = {
        "top_left": 1.0, "top_center": 0.9, "top_right": 0.7,
        "middle_left": 0.6, "middle_center": 0.8, "middle_right": 0.5,
        "bottom_left": 0.4, "bottom_center": 0.6, "bottom_right": 0.5
    }
    
    def simulate(self, opencv_signals: Dict, ocr_signals: Dict, vision_signals: Dict) -> Dict[str, Any]:
        """Run cognitive simulation on extracted signals."""
        
        signals = {}
        
        # Cognitive Load
        cognitive_load = self._estimate_cognitive_load(opencv_signals, ocr_signals)
        signals["cognitive_load"] = {"value": cognitive_load, "unit": "score_0_100", "confidence": 0.7}
        signals["cognitive_load_rating"] = {
            "value": "low" if cognitive_load < 35 else "optimal" if cognitive_load < 65 else "high",
            "unit": "category", "confidence": 0.7
        }
        
        # Attention Capture
        attention_score = self._estimate_attention_capture(opencv_signals, vision_signals)
        signals["attention_capture"] = {"value": attention_score, "unit": "score_0_100", "confidence": 0.75}
        
        # Visual Hierarchy Clarity
        hierarchy_score = self._estimate_visual_hierarchy(opencv_signals, ocr_signals)
        signals["visual_hierarchy_clarity"] = {"value": hierarchy_score, "unit": "score_0_100", "confidence": 0.7}
        
        # Scan Path Efficiency
        scan_efficiency = self._estimate_scan_efficiency(opencv_signals, ocr_signals)
        signals["scan_path_efficiency"] = {"value": scan_efficiency, "unit": "score_0_100", "confidence": 0.65}
        
        # Memory Encoding Likelihood
        memory_score = self._estimate_memory_encoding(opencv_signals, vision_signals)
        signals["memory_encoding_likelihood"] = {"value": memory_score, "unit": "score_0_100", "confidence": 0.6}
        
        # Processing Friction
        friction = self._estimate_processing_friction(opencv_signals, ocr_signals)
        signals["processing_friction"] = {"value": friction, "unit": "score_0_100", "confidence": 0.7}
        
        # First Fixation Prediction
        first_fixation = self._predict_first_fixation(opencv_signals, vision_signals)
        signals["first_fixation_element"] = {"value": first_fixation, "unit": "category", "confidence": 0.6}
        
        logger.info("cognitive_simulation_complete", signals_count=len(signals))
        return {"signals": signals}
    
    def _get_signal_value(self, signals: Dict, key: str, default: float = 50) -> float:
        """Safely get signal value."""
        if key in signals:
            sig = signals[key]
            return sig.get("value", default) if isinstance(sig, dict) else sig
        return default
    
    def _estimate_cognitive_load(self, opencv: Dict, ocr: Dict) -> float:
        """Estimate cognitive load based on visual complexity."""
        # Factors that increase cognitive load
        element_count = self._get_signal_value(opencv, "element_count", 10)
        text_area = self._get_signal_value(ocr, "text_area_percentage", 10)
        clutter = self._get_signal_value(opencv, "clutter_index", 30)
        entropy = self._get_signal_value(opencv, "visual_entropy", 5)
        word_count = self._get_signal_value(ocr, "word_count", 20)
        
        # Normalize and combine
        element_factor = min(element_count / 20, 1) * 100
        text_factor = min(text_area / 30, 1) * 100
        clutter_factor = clutter
        entropy_factor = min(entropy / 8, 1) * 100
        word_factor = min(word_count / 50, 1) * 100
        
        # Weighted combination
        load = (element_factor * 0.2 + text_factor * 0.2 + clutter_factor * 0.25 + 
                entropy_factor * 0.15 + word_factor * 0.2)
        
        return min(max(load, 0), 100)
    
    def _estimate_attention_capture(self, opencv: Dict, vision: Dict) -> float:
        """Estimate attention-grabbing potential."""
        contrast = self._get_signal_value(opencv, "contrast_rms", 40)
        saturation = self._get_signal_value(opencv, "saturation_mean", 100)
        saliency = self._get_signal_value(opencv, "saliency_mean", 50)
        face_count = self._get_signal_value(vision, "face_count", 0)
        
        # Normalize
        contrast_score = min(contrast / 60, 1) * 100
        saturation_score = min(saturation / 150, 1) * 100
        saliency_score = min(saliency / 100, 1) * 100
        face_score = min(face_count, 3) / 3 * 100  # Faces are attention magnets
        
        # Combine with attention weights
        score = (contrast_score * 0.25 + saturation_score * 0.2 + 
                 saliency_score * 0.35 + face_score * 0.2)
        
        return min(max(score, 0), 100)
    
    def _estimate_visual_hierarchy(self, opencv: Dict, ocr: Dict) -> float:
        """Estimate clarity of visual hierarchy."""
        # Strong hierarchy = clear size/contrast differences
        font_variance = self._get_signal_value(ocr, "font_size_variance", 0)
        saliency_concentration = self._get_signal_value(opencv, "saliency_concentration", 1000)
        center_weight = self._get_signal_value(opencv, "center_weight_ratio", 1.0)
        
        # Higher variance in font sizes = clearer text hierarchy
        font_hierarchy = min(font_variance / 500, 1) * 100
        
        # Higher saliency concentration = clearer focal point
        saliency_score = min(saliency_concentration / 3000, 1) * 100
        
        # Center weight should be higher than 1 for good hierarchy
        center_score = min(max(center_weight - 0.5, 0) * 2, 1) * 100
        
        return (font_hierarchy * 0.3 + saliency_score * 0.4 + center_score * 0.3)
    
    def _estimate_scan_efficiency(self, opencv: Dict, ocr: Dict) -> float:
        """Estimate how efficiently viewers can scan the creative."""
        # Good scan = clear visual flow, not too cluttered
        thirds_alignment = self._get_signal_value(opencv, "rule_of_thirds_alignment", 50)
        balance = self._get_signal_value(opencv, "quadrant_balance", 50)
        clutter = self._get_signal_value(opencv, "clutter_index", 30)
        
        # Low clutter helps scanning
        clutter_score = max(0, 100 - clutter)
        
        # Combine
        return (thirds_alignment * 0.3 + balance * 0.3 + clutter_score * 0.4)
    
    def _estimate_memory_encoding(self, opencv: Dict, vision: Dict) -> float:
        """Estimate likelihood of being remembered."""
        # Memorable = distinctive, emotional, simple
        face_count = self._get_signal_value(vision, "face_count", 0)
        positive = self._get_signal_value(vision, "positive_expression", 0)
        narrative = self._get_signal_value(vision, "narrative_present", 0)
        story_clarity = self._get_signal_value(vision, "story_clarity", 50)
        color_count = self._get_signal_value(opencv, "color_count", 4)
        
        # Faces and emotions help memory
        face_score = min(face_count, 2) / 2 * 100
        emotion_score = positive * 100
        
        # Story helps memory
        story_score = narrative * story_clarity
        
        # Limited colors (distinctiveness) helps
        color_score = 100 if 2 <= color_count <= 5 else 50
        
        return (face_score * 0.3 + emotion_score * 0.2 + story_score * 0.3 + color_score * 0.2)
    
    def _estimate_processing_friction(self, opencv: Dict, ocr: Dict) -> float:
        """Estimate cognitive friction (lower is better)."""
        text_contrast = self._get_signal_value(ocr, "text_contrast_ratio", 4)
        noise = self._get_signal_value(opencv, "noise_level", 10)
        cognitive_load = self._estimate_cognitive_load(opencv, ocr)
        
        # Low contrast = high friction
        contrast_friction = max(0, 100 - (text_contrast / 7 * 100))
        
        # High noise = friction
        noise_friction = min(noise / 20, 1) * 100
        
        return (contrast_friction * 0.3 + noise_friction * 0.3 + cognitive_load * 0.4)
    
    def _predict_first_fixation(self, opencv: Dict, vision: Dict) -> str:
        """Predict what element gets first look."""
        face_count = self._get_signal_value(vision, "face_count", 0)
        logo_visible = self._get_signal_value(vision, "logo_visible", 0)
        product_prominence = self._get_signal_value(vision, "product_prominence", 0)
        saliency_centrality = self._get_signal_value(opencv, "saliency_centrality", 50)
        
        # Priority: Faces > Product > Logo > Center
        if face_count > 0:
            return "face"
        elif product_prominence > 70:
            return "product"
        elif logo_visible and saliency_centrality < 40:
            return "logo"
        else:
            return "center_focal"


def simulate_cognition(opencv_signals: Dict, ocr_signals: Dict, vision_signals: Dict) -> Dict[str, Any]:
    """Convenience function for cognitive simulation."""
    simulator = CognitiveSimulator()
    return simulator.simulate(opencv_signals, ocr_signals, vision_signals)
