"""
LLM Copy Analysis Service - Mission 7: Copy, Semiotic & Cultural Analysis
Analyzes text content for effectiveness in Indian market context.
"""
import openai
from typing import Dict, Any, Optional
import structlog
import json
from tenacity import retry, stop_after_attempt, wait_exponential

logger = structlog.get_logger()


class CopyAnalysisService:
    """LLM-powered copy and cultural analysis."""
    
    ANALYSIS_PROMPT = """Analyze this advertising copy for effectiveness in the Indian market.

Copy text: {ocr_text}
Visual context: {visual_summary}
Category: {category}
Funnel stage: {funnel_stage}

Return ONLY valid JSON:
{{
  "claim_analysis": {{
    "main_claim": "string",
    "specificity": 0-100,
    "credibility": 0-100,
    "differentiation": 0-100,
    "generic_phrases": ["list of generic/overused phrases"]
  }},
  "cta_analysis": {{
    "cta_present": true/false,
    "cta_text": "string",
    "clarity": 0-100,
    "urgency": 0-100,
    "benefit_alignment": 0-100
  }},
  "cultural_fit": {{
    "india_relevance": 0-100,
    "regional_appeal": "string",
    "sensitivity_flags": ["any concerning elements"],
    "local_idiom_usage": true/false
  }},
  "language_quality": {{
    "readability": 0-100,
    "emotional_appeal": 0-100,
    "trust_markers": ["list of trust-building elements"],
    "risk_flags": ["any problematic claims"]
  }},
  "overall_copy_score": 0-100,
  "key_strengths": ["list"],
  "improvement_areas": ["list"]
}}"""

    def __init__(self, api_key: str, model: str = "gpt-4-turbo-preview"):
        self.client = openai.OpenAI(api_key=api_key)
        self.model = model
        self.max_tokens = 2500
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def analyze(
        self, 
        ocr_text: str, 
        visual_summary: str = "",
        category: str = "general",
        funnel_stage: str = "awareness"
    ) -> Dict[str, Any]:
        """Analyze copy for marketing effectiveness."""
        
        if not ocr_text or len(ocr_text.strip()) < 5:
            return {"error": "Insufficient text", "signals": {}}
        
        prompt = self.ANALYSIS_PROMPT.format(
            ocr_text=ocr_text[:2000],  # Limit text length
            visual_summary=visual_summary[:500] if visual_summary else "Not provided",
            category=category,
            funnel_stage=funnel_stage
        )
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=self.max_tokens,
            temperature=0
        )
        
        content = response.choices[0].message.content
        tokens_used = response.usage.total_tokens if response.usage else 0
        
        try:
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            analysis = json.loads(content[json_start:json_end]) if json_start >= 0 else {"error": "Parse failed"}
        except json.JSONDecodeError:
            analysis = {"error": "Invalid JSON"}
        
        signals = self._extract_signals(analysis)
        
        logger.info("copy_analysis_complete", tokens=tokens_used)
        return {"analysis": analysis, "signals": signals, "tokens_used": tokens_used}
    
    def _extract_signals(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Convert analysis to signals."""
        signals = {}
        
        if "error" in analysis:
            return signals
        
        # Claim signals
        claim = analysis.get("claim_analysis", {})
        signals["claim_specificity"] = {"value": claim.get("specificity", 50), "unit": "score_0_100", "confidence": 0.75}
        signals["claim_credibility"] = {"value": claim.get("credibility", 50), "unit": "score_0_100", "confidence": 0.7}
        signals["claim_differentiation"] = {"value": claim.get("differentiation", 50), "unit": "score_0_100", "confidence": 0.7}
        signals["generic_phrase_count"] = {"value": len(claim.get("generic_phrases", [])), "unit": "count", "confidence": 0.8}
        
        # CTA signals
        cta = analysis.get("cta_analysis", {})
        signals["cta_present_llm"] = {"value": 1 if cta.get("cta_present") else 0, "unit": "boolean", "confidence": 0.9}
        signals["cta_clarity"] = {"value": cta.get("clarity", 50), "unit": "score_0_100", "confidence": 0.75}
        signals["cta_urgency"] = {"value": cta.get("urgency", 50), "unit": "score_0_100", "confidence": 0.7}
        
        # Cultural signals
        culture = analysis.get("cultural_fit", {})
        signals["india_relevance"] = {"value": culture.get("india_relevance", 50), "unit": "score_0_100", "confidence": 0.7}
        signals["cultural_sensitivity_flags"] = {"value": len(culture.get("sensitivity_flags", [])), "unit": "count", "confidence": 0.8}
        
        # Language signals
        lang = analysis.get("language_quality", {})
        signals["copy_readability"] = {"value": lang.get("readability", 50), "unit": "score_0_100", "confidence": 0.75}
        signals["emotional_appeal"] = {"value": lang.get("emotional_appeal", 50), "unit": "score_0_100", "confidence": 0.7}
        signals["trust_marker_count"] = {"value": len(lang.get("trust_markers", [])), "unit": "count", "confidence": 0.75}
        
        # Overall
        signals["overall_copy_score"] = {"value": analysis.get("overall_copy_score", 50), "unit": "score_0_100", "confidence": 0.7}
        
        return signals
