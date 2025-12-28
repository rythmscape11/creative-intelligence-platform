"""
OpenAI Vision Service - Mission 6: AI Perception Layer
Uses GPT-4 Vision to understand visual content.
"""
import openai
import base64
from typing import Dict, Any, Optional
import structlog
import json
from tenacity import retry, stop_after_attempt, wait_exponential

logger = structlog.get_logger()


class OpenAIVisionService:
    """OpenAI Vision API for creative perception."""
    
    VISION_PROMPT = """Analyze this advertising creative for effectiveness.

Return ONLY valid JSON with this exact structure:
{
  "objects": [{"name": "string", "prominence": 0-100, "position": "string"}],
  "people": {"count": 0, "expressions": ["string"], "demographics": "string"},
  "scene": {"type": "string", "setting": "string", "mood": "string"},
  "brand": {"logo_visible": true/false, "integration_quality": "poor/fair/good/excellent"},
  "product": {"visible": true/false, "prominence": 0-100, "clarity": "string"},
  "storytelling": {"narrative_present": true/false, "story_clarity": 0-100},
  "visual_quality": {"professional_grade": 0-100, "issues": ["string"]}
}

Be precise. Only report what you see with high confidence."""

    def __init__(self, api_key: str, model: str = "gpt-4-vision-preview"):
        self.client = openai.OpenAI(api_key=api_key)
        self.model = model
        self.max_tokens = 2000
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    def analyze(self, image_path: str) -> Dict[str, Any]:
        """Analyze image using GPT-4 Vision."""
        # Encode image to base64
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        # Determine image type
        ext = image_path.lower().split('.')[-1]
        media_type = "image/jpeg" if ext in ["jpg", "jpeg"] else f"image/{ext}"
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": self.VISION_PROMPT},
                    {"type": "image_url", "image_url": {
                        "url": f"data:{media_type};base64,{image_data}",
                        "detail": "high"
                    }}
                ]
            }],
            max_tokens=self.max_tokens,
            temperature=0
        )
        
        # Parse response
        content = response.choices[0].message.content
        tokens_used = response.usage.total_tokens if response.usage else 0
        
        try:
            # Extract JSON from response
            json_start = content.find('{')
            json_end = content.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                perception = json.loads(content[json_start:json_end])
            else:
                perception = {"error": "Could not parse JSON", "raw": content}
        except json.JSONDecodeError:
            perception = {"error": "Invalid JSON", "raw": content}
        
        # Convert to signals
        signals = self._extract_signals(perception)
        
        logger.info("vision_analysis_complete", tokens=tokens_used)
        return {"perception": perception, "signals": signals, "tokens_used": tokens_used}
    
    def _extract_signals(self, perception: Dict[str, Any]) -> Dict[str, Any]:
        """Convert perception to scored signals."""
        signals = {}
        
        if "error" in perception:
            return signals
        
        # Object signals
        objects = perception.get("objects", [])
        signals["object_count"] = {"value": len(objects), "unit": "count", "confidence": 0.9}
        if objects:
            max_prominence = max(o.get("prominence", 0) for o in objects)
            signals["main_object_prominence"] = {"value": max_prominence, "unit": "score_0_100", "confidence": 0.8}
        
        # People signals
        people = perception.get("people", {})
        signals["face_count"] = {"value": people.get("count", 0), "unit": "count", "confidence": 0.9}
        expressions = people.get("expressions", [])
        positive = ["happy", "smiling", "joyful", "excited", "confident"]
        signals["positive_expression"] = {
            "value": 1 if any(e.lower() in positive for e in expressions) else 0,
            "unit": "boolean", "confidence": 0.7
        }
        
        # Brand signals
        brand = perception.get("brand", {})
        signals["logo_visible"] = {"value": 1 if brand.get("logo_visible") else 0, "unit": "boolean", "confidence": 0.85}
        quality_map = {"poor": 25, "fair": 50, "good": 75, "excellent": 100}
        signals["brand_integration_score"] = {
            "value": quality_map.get(brand.get("integration_quality", "fair"), 50),
            "unit": "score_0_100", "confidence": 0.7
        }
        
        # Product signals
        product = perception.get("product", {})
        signals["product_visible"] = {"value": 1 if product.get("visible") else 0, "unit": "boolean", "confidence": 0.85}
        signals["product_prominence"] = {"value": product.get("prominence", 0), "unit": "score_0_100", "confidence": 0.8}
        
        # Visual quality
        quality = perception.get("visual_quality", {})
        signals["professional_grade"] = {"value": quality.get("professional_grade", 50), "unit": "score_0_100", "confidence": 0.75}
        signals["visual_issues_count"] = {"value": len(quality.get("issues", [])), "unit": "count", "confidence": 0.8}
        
        # Storytelling
        story = perception.get("storytelling", {})
        signals["narrative_present"] = {"value": 1 if story.get("narrative_present") else 0, "unit": "boolean", "confidence": 0.7}
        signals["story_clarity"] = {"value": story.get("story_clarity", 50), "unit": "score_0_100", "confidence": 0.7}
        
        return signals
