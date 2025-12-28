"""
Antigravity Orchestrator - CMO-Grade Analysis Pipeline
Central coordinator implementing three-layer scoring with all guardrails.
"""
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
import uuid
import structlog
from PIL import Image
import os
import tempfile

from app.core.config import settings

logger = structlog.get_logger()


class AnalysisOrchestrator:
    """
    Coordinates the full creative analysis pipeline with CMO-grade scoring.
    
    Pipeline:
    1. Validate & Prepare
    2. Layer 1: Deterministic (OpenCV, OCR)
    3. Layer 2: Perceptual (GPT-4 Vision)
    4. Layer 3: Cognitive (LLM reasoning)
    5. Validate signals (anti-hallucination)
    6. Three-layer scoring with confidence
    7. Differentiation analysis
    8. Generate recommendations
    """
    
    def __init__(self):
        self.token_budget = settings.TOKEN_BUDGET_FREE
        self.tokens_used = 0
    
    async def analyze_creative(
        self,
        image_path: str,
        category: str = "general",
        platform: str = "general",
        funnel_stage: str = "awareness",
        brand_names: list = None,
        user_token_budget: int = None
    ) -> Dict[str, Any]:
        """
        Run full CMO-grade analysis pipeline.
        
        Returns complete analysis with:
        - Three-layer scores with confidence bands
        - CMO decision summary
        - Differentiation analysis
        - Recommendations with impact estimates
        - Warnings and contradictions
        """
        start_time = datetime.utcnow()
        analysis_id = str(uuid.uuid4())
        
        if user_token_budget:
            self.token_budget = user_token_budget
        
        logger.info("analysis_started", analysis_id=analysis_id, image=image_path)
        
        result = {
            "analysis_id": analysis_id,
            "status": "processing",
            "signals": {"layers": {}},
            "tokens_used": {},
            "errors": [],
            "warnings": []
        }
        
        try:
            # === PHASE 1: Validate & Prepare ===
            validated_path = await self._validate_and_prepare(image_path)
            
            # === PHASE 2: LAYER 1 - Deterministic Analysis (OpenCV/OCR) ===
            logger.info("layer_1_deterministic", analysis_id=analysis_id)
            
            opencv_signals = await self._run_opencv(validated_path)
            result["signals"]["opencv"] = opencv_signals
            result["signals"]["layers"]["deterministic"] = list(opencv_signals.keys())
            
            ocr_result = await self._run_ocr(validated_path, brand_names)
            result["signals"]["ocr"] = ocr_result.get("signals", {})
            result["signals"]["layers"]["deterministic"].extend(
                list(ocr_result.get("signals", {}).keys())
            )
            ocr_text = ocr_result.get("full_text", "")
            
            # === PHASE 3: LAYER 2 - Perceptual Analysis (GPT-4 Vision) ===
            if self._has_token_budget(2000):
                logger.info("layer_2_perceptual", analysis_id=analysis_id)
                
                vision_result = await self._run_vision(validated_path)
                result["signals"]["vision"] = vision_result.get("signals", {})
                result["signals"]["layers"]["perceptual"] = list(
                    vision_result.get("signals", {}).keys()
                )
                result["tokens_used"]["vision"] = vision_result.get("tokens_used", 0)
                self.tokens_used += vision_result.get("tokens_used", 0)
                visual_summary = str(vision_result.get("perception", {}))
            else:
                result["signals"]["vision"] = {}
                result["signals"]["layers"]["perceptual"] = []
                visual_summary = ""
                result["warnings"].append("Vision analysis skipped: token budget exceeded")
            
            # === PHASE 4: LAYER 3 - Cognitive Analysis (LLM) ===
            if self._has_token_budget(2500) and ocr_text:
                logger.info("layer_3_cognitive", analysis_id=analysis_id)
                
                copy_result = await self._run_copy_analysis(
                    ocr_text, visual_summary, category, funnel_stage
                )
                result["signals"]["copy"] = copy_result.get("signals", {})
                result["signals"]["layers"]["cognitive"] = list(
                    copy_result.get("signals", {}).keys()
                )
                result["tokens_used"]["copy"] = copy_result.get("tokens_used", 0)
                self.tokens_used += copy_result.get("tokens_used", 0)
            else:
                result["signals"]["copy"] = {}
                result["signals"]["layers"]["cognitive"] = []
            
            # Cognitive simulation
            cognitive_result = await self._run_cognitive_sim(
                result["signals"]["opencv"],
                result["signals"]["ocr"],
                result["signals"]["vision"]
            )
            result["signals"]["cognitive"] = cognitive_result.get("signals", {})
            result["signals"]["layers"]["cognitive"].extend(
                list(cognitive_result.get("signals", {}).keys())
            )
            
            # === PHASE 5: Validate Signals (Anti-Hallucination) ===
            validation = await self._validate_signals(result["signals"])
            result["validation"] = validation
            if validation.get("contradictions"):
                result["warnings"].extend(validation["contradictions"])
            
            # === PHASE 6: Three-Layer CMO-Grade Scoring ===
            logger.info("three_layer_scoring", analysis_id=analysis_id)
            
            scoring_result = await self._run_three_layer_scoring(
                result["signals"], category, platform, funnel_stage
            )
            result["score"] = scoring_result
            
            # Add scoring warnings
            if scoring_result.get("warnings"):
                result["warnings"].extend(scoring_result["warnings"])
            
            # === PHASE 7: Differentiation Analysis ===
            differentiation = await self._run_differentiation(
                ocr_text,
                result["signals"].get("copy", {}),
                result["signals"].get("vision", {}),
                category
            )
            result["differentiation"] = differentiation
            
            if differentiation.get("is_me_too"):
                result["warnings"].append(
                    "Creative shows low differentiation. Consider unique value proposition."
                )
            
            # === PHASE 8: Recommendations ===
            recommendations = await self._run_recommendations(
                result["signals"], scoring_result.get("pillars", [])
            )
            result["recommendations"] = recommendations
            
            result["status"] = "completed"
            
        except Exception as e:
            logger.error("analysis_failed", error=str(e), analysis_id=analysis_id)
            result["status"] = "failed"
            result["errors"].append(str(e))
        
        # Finalize
        end_time = datetime.utcnow()
        result["processing_time_ms"] = int((end_time - start_time).total_seconds() * 1000)
        result["total_tokens_used"] = self.tokens_used
        
        # Layer summary
        result["layer_summary"] = {
            "deterministic_signals": len(result["signals"]["layers"].get("deterministic", [])),
            "perceptual_signals": len(result["signals"]["layers"].get("perceptual", [])),
            "cognitive_signals": len(result["signals"]["layers"].get("cognitive", []))
        }
        
        logger.info("analysis_complete", 
                   analysis_id=analysis_id, 
                   status=result["status"], 
                   overall_score=result.get("score", {}).get("overall_score"),
                   confidence=result.get("score", {}).get("confidence"),
                   time_ms=result["processing_time_ms"])
        
        return result
    
    async def _validate_and_prepare(self, image_path: str) -> str:
        """Validate image and resize for analysis."""
        if not os.path.exists(image_path):
            raise ValueError(f"Image not found: {image_path}")
        
        try:
            img = Image.open(image_path)
            if img.format and img.format.upper() not in ["JPEG", "JPG", "PNG", "WEBP"]:
                raise ValueError(f"Unsupported format: {img.format}")
        except Exception as e:
            raise ValueError(f"Invalid image: {e}")
        
        # Resize if needed
        max_dim = max(settings.ANALYSIS_RESOLUTION)
        if max(img.size) > max_dim:
            ratio = max_dim / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            temp_path = os.path.join(tempfile.gettempdir(), f"analysis_{uuid.uuid4()}.jpg")
            img.save(temp_path, "JPEG", quality=85)
            return temp_path
        
        return image_path
    
    def _has_token_budget(self, required: int) -> bool:
        """Check if we have enough token budget."""
        return (self.tokens_used + required) <= self.token_budget
    
    async def _run_opencv(self, image_path: str) -> Dict[str, Any]:
        """Run OpenCV deterministic analysis."""
        from app.services.vision.opencv_analyzer import analyze_image
        return analyze_image(image_path)
    
    async def _run_ocr(self, image_path: str, brand_names: list = None) -> Dict[str, Any]:
        """Run OCR extraction."""
        from app.services.ocr.ocr_service import extract_text
        return extract_text(image_path, brand_names)
    
    async def _run_vision(self, image_path: str) -> Dict[str, Any]:
        """Run OpenAI Vision analysis."""
        from app.services.llm.vision_service import OpenAIVisionService
        service = OpenAIVisionService(api_key=settings.OPENAI_API_KEY)
        return service.analyze(image_path)
    
    async def _run_copy_analysis(
        self, ocr_text: str, visual_summary: str, category: str, funnel_stage: str
    ) -> Dict[str, Any]:
        """Run LLM copy analysis."""
        from app.services.llm.copy_analysis import CopyAnalysisService
        service = CopyAnalysisService(api_key=settings.OPENAI_API_KEY)
        return service.analyze(ocr_text, visual_summary, category, funnel_stage)
    
    async def _run_cognitive_sim(
        self, opencv: Dict, ocr: Dict, vision: Dict
    ) -> Dict[str, Any]:
        """Run cognitive simulation."""
        from app.services.scoring.cognitive_sim import simulate_cognition
        return simulate_cognition(opencv, ocr, vision)
    
    async def _validate_signals(self, all_signals: Dict) -> Dict[str, Any]:
        """Validate signals for contradictions."""
        from app.services.scoring.differentiation import validate_signals
        return validate_signals(all_signals)
    
    async def _run_three_layer_scoring(
        self, all_signals: Dict, category: str, platform: str, funnel_stage: str
    ) -> Dict[str, Any]:
        """Run three-layer CMO-grade scoring."""
        from app.services.scoring.three_layer_engine import score_creative_three_layer
        return score_creative_three_layer(all_signals, category, platform, funnel_stage)
    
    async def _run_differentiation(
        self, ocr_text: str, copy_signals: Dict, vision_signals: Dict, category: str
    ) -> Dict[str, Any]:
        """Run differentiation analysis."""
        from app.services.scoring.differentiation import analyze_differentiation
        return analyze_differentiation(ocr_text, copy_signals, vision_signals, category)
    
    async def _run_recommendations(
        self, all_signals: Dict, pillars: list
    ) -> list:
        """Generate recommendations."""
        from app.services.scoring.recommendation_engine import generate_recommendations
        return generate_recommendations(all_signals, pillars)


# Convenience function
async def analyze_creative(image_path: str, **kwargs) -> Dict[str, Any]:
    """Main entry point for CMO-grade creative analysis."""
    orchestrator = AnalysisOrchestrator()
    return await orchestrator.analyze_creative(image_path, **kwargs)
