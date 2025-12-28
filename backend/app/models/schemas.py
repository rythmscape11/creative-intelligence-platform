"""
Pydantic Schemas for API request/response validation.
"""
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from enum import Enum
import uuid


# ============== ENUMS ==============

class UserTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class CreativeStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class MediaType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"


class AnalysisSource(str, Enum):
    OPENCV = "opencv"
    OCR = "ocr"
    OPENAI_VISION = "openai_vision"
    OPENAI_LLM = "openai_llm"
    COGNITIVE_SIM = "cognitive_sim"


# ============== AUTH ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    org_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    org_name: Optional[str]
    tier: UserTier
    token_budget: int
    tokens_used: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============== BRAND ==============

class BrandCreate(BaseModel):
    name: str
    category: Optional[str] = None
    sub_category: Optional[str] = None
    logo_url: Optional[str] = None
    brand_colors: Optional[Dict[str, str]] = None
    guidelines_url: Optional[str] = None


class BrandResponse(BaseModel):
    id: uuid.UUID
    name: str
    category: Optional[str]
    sub_category: Optional[str]
    logo_url: Optional[str]
    brand_colors: Optional[Dict[str, str]]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============== CAMPAIGN ==============

class CampaignCreate(BaseModel):
    brand_id: uuid.UUID
    name: str
    platform: Optional[str] = None
    funnel_stage: Optional[str] = None
    objective: Optional[str] = None
    target_audience: Optional[Dict[str, Any]] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class CampaignResponse(BaseModel):
    id: uuid.UUID
    brand_id: uuid.UUID
    name: str
    platform: Optional[str]
    funnel_stage: Optional[str]
    objective: Optional[str]
    target_audience: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============== CREATIVE ==============

class CreativeUpload(BaseModel):
    campaign_id: uuid.UUID


class CreativeResponse(BaseModel):
    id: uuid.UUID
    campaign_id: uuid.UUID
    media_url: str
    media_type: MediaType
    thumbnail_url: Optional[str]
    width: Optional[int]
    height: Optional[int]
    status: CreativeStatus
    final_score: Optional[float]
    score_confidence: Optional[float]
    funnel_fit_score: Optional[float]
    platform_fit_score: Optional[float]
    analyzed_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class CreativeDetail(CreativeResponse):
    """Extended creative response with analysis details."""
    pillars: List["ScorePillarResponse"] = []
    recommendations: List["RecommendationResponse"] = []
    signal_count: int = 0


# ============== MICRO SIGNAL ==============

class MicroSignalResponse(BaseModel):
    id: uuid.UUID
    signal_name: str
    signal_value: float
    signal_unit: Optional[str]
    source: AnalysisSource
    confidence: float
    benchmark_percentile: Optional[float]
    
    class Config:
        from_attributes = True


# ============== SCORE PILLAR ==============

class ScorePillarResponse(BaseModel):
    id: uuid.UUID
    pillar_name: str
    score: float
    confidence_lower: Optional[float]
    confidence_upper: Optional[float]
    weight: float
    explanation: Optional[str]
    contributing_signals: Optional[List[Dict[str, Any]]]
    
    class Config:
        from_attributes = True


# ============== RECOMMENDATION ==============

class RecommendationResponse(BaseModel):
    id: uuid.UUID
    priority: int
    signal_source: Optional[str]
    fix_category: Optional[str]
    fix_text: str
    example: Optional[str]
    impact_score: Optional[float]
    simulated_uplift: Optional[float]
    implementation_difficulty: Optional[str]
    
    class Config:
        from_attributes = True


# ============== ANALYSIS ==============

class AnalysisResponse(BaseModel):
    creative_id: uuid.UUID
    status: CreativeStatus
    final_score: Optional[float]
    pillars: List[ScorePillarResponse]
    signals_by_source: Dict[str, List[MicroSignalResponse]]
    recommendations: List[RecommendationResponse]
    token_usage: Dict[str, int]
    processing_time_ms: int


# ============== COMPARISON ==============

class CompareRequest(BaseModel):
    creative_a_id: uuid.UUID
    creative_b_id: uuid.UUID


class CompareResponse(BaseModel):
    creative_a_id: uuid.UUID
    creative_b_id: uuid.UUID
    overall_winner: str  # 'A', 'B', 'tie'
    pillar_winners: Dict[str, str]
    trade_offs: List[str]
    recommendation: str
    created_at: datetime


# ============== BENCHMARK ==============

class BenchmarkResponse(BaseModel):
    category: str
    platform: Optional[str]
    funnel_stage: Optional[str]
    signal_name: str
    p25: Optional[float]
    p50: Optional[float]
    p75: Optional[float]
    p90: Optional[float]
    sample_size: Optional[int]
    
    class Config:
        from_attributes = True


# ============== SCORE EXPLANATION ==============

class ScoreExplanation(BaseModel):
    """Full explainability for a creative score."""
    overall_score: float
    confidence_band: tuple[float, float]
    pillar_breakdown: List[Dict[str, Any]]
    top_strengths: List[str]
    top_weaknesses: List[str]
    signal_sources: Dict[str, int]  # Source -> signal count
    reasoning_chain: List[str]  # Step-by-step explanation


# ============== REPORT ==============

class ReportRequest(BaseModel):
    creative_ids: List[uuid.UUID]
    format: str = "pdf"  # pdf, pptx, png
    include_comparison: bool = False
    include_recommendations: bool = True


class ReportResponse(BaseModel):
    id: uuid.UUID
    status: str
    download_url: Optional[str]
    created_at: datetime


# Update forward references
CreativeDetail.model_rebuild()
