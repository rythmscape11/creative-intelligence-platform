"""
Analysis API Router - Direct analysis endpoints for creatives.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, Any
import uuid
import os
import tempfile
import numpy as np

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.config import settings
from app.models.models import User
from app.services.orchestrator import AnalysisOrchestrator

router = APIRouter(prefix="/analysis", tags=["Analysis"])


def convert_numpy_types(obj: Any) -> Any:
    """Recursively convert numpy types to native Python types for JSON serialization."""
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, (np.float32, np.float64, np.floating)):
        return float(obj)
    elif isinstance(obj, (np.int32, np.int64, np.integer)):
        return int(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(item) for item in obj]
    return obj


@router.post("/")
async def analyze_image(
    file: UploadFile = File(...),
    category: str = "general",
    platform: str = "general",
    funnel_stage: str = "awareness",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze a creative image with full pipeline.
    Returns scores, signals, and recommendations.
    """
    # Check token budget
    if current_user.tokens_used >= current_user.token_budget:
        raise HTTPException(
            status_code=402,
            detail="Token budget exceeded. Upgrade your plan for more analysis."
        )
    
    # Validate file
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are supported")
    
    # Save to temp
    file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
    temp_path = os.path.join(tempfile.gettempdir(), f"analysis_{uuid.uuid4()}.{file_ext}")
    
    try:
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)
        
        # Run analysis with user's remaining token budget
        remaining_budget = current_user.token_budget - current_user.tokens_used
        orchestrator = AnalysisOrchestrator()
        
        result = await orchestrator.analyze_creative(
            image_path=temp_path,
            category=category,
            platform=platform,
            funnel_stage=funnel_stage,
            user_token_budget=remaining_budget
        )
        
        # Convert numpy types to native Python types for JSON serialization
        result = convert_numpy_types(result)
        
        # Update user's token usage
        current_user.tokens_used += result.get("total_tokens_used", 0)
        await db.commit()
        
        return result
        
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@router.post("/compare")
async def compare_creatives(
    creative_a: UploadFile = File(...),
    creative_b: UploadFile = File(...),
    category: str = "general",
    platform: str = "general",
    funnel_stage: str = "awareness",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Compare two creatives side-by-side."""
    from app.services.scoring.comparison_engine import compare_creatives as compare_fn
    
    # Analyze both
    results = []
    temp_files = []
    
    try:
        for file in [creative_a, creative_b]:
            file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
            temp_path = os.path.join(tempfile.gettempdir(), f"compare_{uuid.uuid4()}.{file_ext}")
            temp_files.append(temp_path)
            
            content = await file.read()
            with open(temp_path, "wb") as f:
                f.write(content)
            
            orchestrator = AnalysisOrchestrator()
            result = await orchestrator.analyze_creative(
                image_path=temp_path,
                category=category,
                platform=platform,
                funnel_stage=funnel_stage
            )
            results.append(result)
        
        # Compare
        comparison = compare_fn(
            results[0].get("score", {}),
            results[1].get("score", {})
        )
        
        return {
            "creative_a": results[0],
            "creative_b": results[1],
            "comparison": comparison
        }
        
    finally:
        for temp_path in temp_files:
            if os.path.exists(temp_path):
                os.remove(temp_path)


@router.get("/benchmarks")
async def get_benchmarks(
    category: str = "general",
    platform: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get benchmark data for a category/platform."""
    from app.models.models import Benchmark
    
    query = select(Benchmark).where(Benchmark.category == category)
    if platform:
        query = query.where(Benchmark.platform == platform)
    
    result = await db.execute(query)
    benchmarks = result.scalars().all()
    
    return {
        "category": category,
        "platform": platform,
        "benchmarks": [
            {
                "signal_name": b.signal_name,
                "p25": b.p25,
                "p50": b.p50,
                "p75": b.p75,
                "sample_size": b.sample_size
            }
            for b in benchmarks
        ]
    }
