"""
OCR Service - Mission 5: Extract text with bounding boxes.
"""
import pytesseract
from PIL import Image
import cv2
import numpy as np
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
import re
import structlog

logger = structlog.get_logger()


@dataclass
class TextBlock:
    text: str
    confidence: float
    bounding_box: Dict[str, int]
    font_size_estimate: Optional[float] = None
    is_cta: bool = False
    is_brand_mention: bool = False
    is_price: bool = False


@dataclass
class OCRResult:
    full_text: str
    text_blocks: List[TextBlock]
    text_area_percentage: float
    word_count: int
    signals: Dict[str, Any] = field(default_factory=dict)


class OCRService:
    CTA_PATTERNS = [r'\b(shop|buy|order|get|try|start|join|subscribe|download|learn more)\b']
    PRICE_PATTERNS = [r'₹\s*[\d,]+', r'\$\s*[\d,]+', r'\d+%\s*off']
    
    def extract(self, image_path: str, brand_names: List[str] = None) -> OCRResult:
        img_cv = cv2.imread(image_path)
        if img_cv is None:
            raise ValueError(f"Could not load image: {image_path}")
        
        gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
        binary = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        
        ocr_data = pytesseract.image_to_data(binary, output_type=pytesseract.Output.DICT, config='--psm 11')
        
        text_blocks = []
        for i in range(len(ocr_data['text'])):
            text = ocr_data['text'][i].strip()
            conf = int(ocr_data['conf'][i])
            if not text or conf < 30:
                continue
            
            block = TextBlock(
                text=text,
                confidence=conf / 100.0,
                bounding_box={'x': ocr_data['left'][i], 'y': ocr_data['top'][i], 
                              'width': ocr_data['width'][i], 'height': ocr_data['height'][i]},
                font_size_estimate=ocr_data['height'][i] * 0.75,
                is_cta=any(re.search(p, text.lower()) for p in self.CTA_PATTERNS),
                is_price=any(re.search(p, text) for p in self.PRICE_PATTERNS)
            )
            text_blocks.append(block)
        
        full_text = ' '.join([b.text for b in text_blocks])
        img_h, img_w = img_cv.shape[:2]
        text_area = sum(b.bounding_box['width'] * b.bounding_box['height'] for b in text_blocks)
        
        signals = {
            'text_area_percentage': {'value': text_area / (img_h * img_w) * 100, 'unit': 'percentage'},
            'word_count': {'value': len(full_text.split()), 'unit': 'count'},
            'cta_present': {'value': 1 if any(b.is_cta for b in text_blocks) else 0, 'unit': 'boolean'},
            'price_present': {'value': 1 if any(b.is_price for b in text_blocks) else 0, 'unit': 'boolean'},
        }
        
        return OCRResult(full_text=full_text, text_blocks=text_blocks, 
                        text_area_percentage=text_area / (img_h * img_w) * 100,
                        word_count=len(full_text.split()), signals=signals)


def extract_text(image_path: str, brand_names: List[str] = None) -> Dict[str, Any]:
    result = OCRService().extract(image_path, brand_names)
    return {'full_text': result.full_text, 'word_count': result.word_count, 
            'signals': result.signals, 'text_blocks': [{'text': b.text, 'confidence': b.confidence, 
            'bounding_box': b.bounding_box} for b in result.text_blocks]}
