"""
Creative Intelligence Platform - Core Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # App
    APP_NAME: str = "Creative Intelligence Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/creative_intel"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL_VISION: str = "gpt-4-vision-preview"
    OPENAI_MODEL_TEXT: str = "gpt-4-turbo-preview"
    OPENAI_MAX_TOKENS_VISION: int = 2000
    OPENAI_MAX_TOKENS_TEXT: int = 3000
    
    # Storage
    S3_BUCKET: str = "creative-intel-media"
    S3_ENDPOINT: Optional[str] = None
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    
    # Media Processing
    MAX_IMAGE_SIZE_MB: int = 10
    MAX_VIDEO_SIZE_MB: int = 100
    ANALYSIS_RESOLUTION: tuple = (1024, 1024)
    
    # Token Budgets
    TOKEN_BUDGET_FREE: int = 10000
    TOKEN_BUDGET_PRO: int = 100000
    TOKEN_BUDGET_ENTERPRISE: int = 1000000
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()


settings = get_settings()
