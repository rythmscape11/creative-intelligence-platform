"""
SQLAlchemy Models - Database-agnostic version for SQLite development and PostgreSQL production.
Covers Mission 2: Data Models & Scoring Foundations
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, 
    ForeignKey, JSON, Index, Enum as SQLEnum, TypeDecorator
)
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base
from app.core.config import settings


# ============== CUSTOM UUID TYPE (Works with SQLite and PostgreSQL) ==============

class GUID(TypeDecorator):
    """Platform-independent UUID type.
    Uses PostgreSQL's UUID type when available, otherwise uses String(36).
    """
    impl = String
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            from sqlalchemy.dialects.postgresql import UUID as PG_UUID
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(String(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == 'postgresql':
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            return uuid.UUID(value)
        return value


# ============== ENUMS ==============

class UserTier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class CreativeStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class MediaType(str, enum.Enum):
    IMAGE = "image"
    VIDEO = "video"


class AnalysisSource(str, enum.Enum):
    OPENCV = "opencv"
    OCR = "ocr"
    OPENAI_VISION = "openai_vision"
    OPENAI_LLM = "openai_llm"
    COGNITIVE_SIM = "cognitive_sim"


# ============== USER & ORG ==============

class User(Base):
    """User account with organization and token budget."""
    __tablename__ = "users"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    org_name = Column(String(255))
    tier = Column(SQLEnum(UserTier), default=UserTier.FREE)
    token_budget = Column(Integer, default=10000)
    tokens_used = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    brands = relationship("Brand", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


# ============== BRAND ==============

class Brand(Base):
    """Brand entity with category and guidelines."""
    __tablename__ = "brands"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), index=True)
    sub_category = Column(String(100))
    logo_url = Column(Text)
    brand_colors = Column(JSON)  # {"primary": "#fff", "secondary": "#000"}
    guidelines_url = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="brands")
    campaigns = relationship("Campaign", back_populates="brand", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index("idx_brands_user_category", "user_id", "category"),
    )


# ============== CAMPAIGN ==============

class Campaign(Base):
    """Campaign with platform, funnel stage, and targeting."""
    __tablename__ = "campaigns"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    brand_id = Column(GUID(), ForeignKey("brands.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    platform = Column(String(50), index=True)  # instagram, facebook, youtube, etc.
    funnel_stage = Column(String(50), index=True)  # awareness, consideration, conversion
    objective = Column(String(100))  # engagement, traffic, sales
    target_audience = Column(JSON)  # {"age": "25-34", "gender": "all", "interests": [...]}
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    brand = relationship("Brand", back_populates="campaigns")
    creatives = relationship("Creative", back_populates="campaign", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index("idx_campaigns_brand_platform", "brand_id", "platform"),
    )


# ============== CREATIVE ==============

class Creative(Base):
    """Creative asset with analysis status and final score."""
    __tablename__ = "creatives"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(GUID(), ForeignKey("campaigns.id", ondelete="CASCADE"), nullable=False)
    
    # Media info
    media_url = Column(Text, nullable=False)
    media_type = Column(SQLEnum(MediaType), nullable=False)
    thumbnail_url = Column(Text)
    file_size = Column(Integer)  # bytes
    width = Column(Integer)
    height = Column(Integer)
    duration_seconds = Column(Float)  # for videos
    
    # Analysis status
    status = Column(SQLEnum(CreativeStatus), default=CreativeStatus.PENDING, index=True)
    
    # Final scores (populated after analysis)
    final_score = Column(Float, index=True)
    score_confidence = Column(Float)
    funnel_fit_score = Column(Float)
    platform_fit_score = Column(Float)
    
    # Timestamps
    analyzed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    campaign = relationship("Campaign", back_populates="creatives")
    analyses = relationship("CreativeAnalysis", back_populates="creative", cascade="all, delete-orphan")
    micro_signals = relationship("MicroSignal", back_populates="creative", cascade="all, delete-orphan")
    score_pillars = relationship("ScorePillar", back_populates="creative", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="creative", cascade="all, delete-orphan")
    embeddings = relationship("CreativeEmbedding", back_populates="creative", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index("idx_creatives_campaign_status", "campaign_id", "status"),
        Index("idx_creatives_score", "final_score"),
    )


# ============== CREATIVE ANALYSIS ==============

class CreativeAnalysis(Base):
    """Raw analysis output from each processing layer."""
    __tablename__ = "creative_analyses"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    creative_id = Column(GUID(), ForeignKey("creatives.id", ondelete="CASCADE"), nullable=False)
    analysis_type = Column(String(50), nullable=False, index=True)  # opencv, ocr, vision, llm
    raw_output = Column(JSON, nullable=False)
    signals_extracted = Column(JSON)
    tokens_used = Column(Integer)
    processing_time_ms = Column(Integer)
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    creative = relationship("Creative", back_populates="analyses")
    
    __table_args__ = (
        Index("idx_analysis_creative_type", "creative_id", "analysis_type"),
    )


# ============== MICRO SIGNAL ==============

class MicroSignal(Base):
    """Individual measurement signal (100+ per creative)."""
    __tablename__ = "micro_signals"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    creative_id = Column(GUID(), ForeignKey("creatives.id", ondelete="CASCADE"), nullable=False)
    signal_name = Column(String(100), nullable=False, index=True)
    signal_value = Column(Float, nullable=False)
    signal_unit = Column(String(50))  # percentage, ratio, count, score
    source = Column(SQLEnum(AnalysisSource), nullable=False, index=True)
    confidence = Column(Float, default=1.0)
    raw_data = Column(JSON)  # Additional context
    benchmark_percentile = Column(Float)  # Percentile vs category benchmark
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    creative = relationship("Creative", back_populates="micro_signals")
    
    __table_args__ = (
        Index("idx_signals_creative_source", "creative_id", "source"),
        Index("idx_signals_name_value", "signal_name", "signal_value"),
    )


# ============== SCORE PILLAR ==============

class ScorePillar(Base):
    """Aggregated pillar score from micro-signals."""
    __tablename__ = "score_pillars"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    creative_id = Column(GUID(), ForeignKey("creatives.id", ondelete="CASCADE"), nullable=False)
    pillar_name = Column(String(100), nullable=False, index=True)
    score = Column(Float, nullable=False)  # 0-100
    confidence_lower = Column(Float)
    confidence_upper = Column(Float)
    weight = Column(Float, default=1.0)  # Dynamic weight applied
    explanation = Column(Text)
    contributing_signals = Column(JSON)  # List of signals that contributed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    creative = relationship("Creative", back_populates="score_pillars")
    
    __table_args__ = (
        Index("idx_pillars_creative_name", "creative_id", "pillar_name"),
    )


# ============== RECOMMENDATION ==============

class Recommendation(Base):
    """Specific fix recommendation with impact estimate."""
    __tablename__ = "recommendations"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    creative_id = Column(GUID(), ForeignKey("creatives.id", ondelete="CASCADE"), nullable=False)
    priority = Column(Integer, nullable=False)  # 1 = highest
    signal_source = Column(String(100))  # Which signal triggered this
    fix_category = Column(String(100))  # visual, copy, brand, layout
    fix_text = Column(Text, nullable=False)
    example = Column(Text)  # Specific example or before/after
    impact_score = Column(Float)  # Estimated score impact
    simulated_uplift = Column(Float)  # % improvement estimate
    implementation_difficulty = Column(String(20))  # easy, medium, hard
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    creative = relationship("Creative", back_populates="recommendations")
    
    __table_args__ = (
        Index("idx_recommendations_creative_priority", "creative_id", "priority"),
    )


# ============== BENCHMARK ==============

class Benchmark(Base):
    """Category/platform/funnel benchmark statistics."""
    __tablename__ = "benchmarks"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    category = Column(String(100), nullable=False)
    platform = Column(String(50))
    funnel_stage = Column(String(50))
    signal_name = Column(String(100), nullable=False)
    p25 = Column(Float)
    p50 = Column(Float)  # Median
    p75 = Column(Float)
    p90 = Column(Float)
    mean = Column(Float)
    std_dev = Column(Float)
    sample_size = Column(Integer)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index("idx_benchmarks_lookup", "category", "platform", "funnel_stage", "signal_name", unique=True),
    )


# ============== PILLAR WEIGHT ==============

class PillarWeight(Base):
    """Dynamic pillar weights by context."""
    __tablename__ = "pillar_weights"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    category = Column(String(100))
    platform = Column(String(50))
    funnel_stage = Column(String(50))
    pillar_name = Column(String(100), nullable=False)
    weight = Column(Float, nullable=False)
    rationale = Column(Text)
    
    __table_args__ = (
        Index("idx_weights_lookup", "category", "platform", "funnel_stage", "pillar_name", unique=True),
    )


# ============== CREATIVE EMBEDDING ==============

class CreativeEmbedding(Base):
    """Vector embeddings for similarity search (PostgreSQL only with pgvector)."""
    __tablename__ = "creative_embeddings"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    creative_id = Column(GUID(), ForeignKey("creatives.id", ondelete="CASCADE"), nullable=False)
    embedding_type = Column(String(50), nullable=False)  # visual, text, combined
    embedding_data = Column(Text)  # JSON string for SQLite, use pgvector Vector type in production
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    creative = relationship("Creative", back_populates="embeddings")


# ============== AUDIT LOG ==============

class AuditLog(Base):
    """Full audit trail for all mutations."""
    __tablename__ = "audit_logs"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(GUID(), nullable=False)
    action = Column(String(50), nullable=False)  # create, update, delete, analyze
    user_id = Column(GUID(), ForeignKey("users.id"))
    payload = Column(JSON)  # Changed data
    ip_address = Column(String(45))  # IPv6 max length
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")
    
    __table_args__ = (
        Index("idx_audit_entity", "entity_type", "entity_id"),
        Index("idx_audit_user_time", "user_id", "created_at"),
    )


# ============== COMPARISON ==============

class CreativeComparison(Base):
    """Stored comparison between creatives."""
    __tablename__ = "creative_comparisons"
    
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    creative_a_id = Column(GUID(), ForeignKey("creatives.id"), nullable=False)
    creative_b_id = Column(GUID(), ForeignKey("creatives.id"), nullable=False)
    overall_winner = Column(String(10))  # 'A', 'B', 'tie'
    pillar_winners = Column(JSON)  # {pillar: winner}
    trade_offs = Column(JSON)
    recommendation = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        Index("idx_comparison_creatives", "creative_a_id", "creative_b_id"),
    )
