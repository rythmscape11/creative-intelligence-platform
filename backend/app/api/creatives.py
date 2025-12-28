"""
Creatives API Router - Upload, analysis, and management of creative assets.
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
import uuid
import os
import tempfile

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, Brand, Campaign, Creative, CreativeStatus, MediaType
from app.models.schemas import CreativeResponse, CreativeDetail

router = APIRouter(prefix="/creatives", tags=["Creatives"])


@router.get("/", response_model=List[CreativeResponse])
async def list_creatives(
    campaign_id: uuid.UUID = None,
    status_filter: CreativeStatus = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List creatives with optional filters."""
    query = (
        select(Creative)
        .join(Campaign)
        .join(Brand)
        .where(Brand.user_id == current_user.id)
    )
    
    if campaign_id:
        query = query.where(Creative.campaign_id == campaign_id)
    if status_filter:
        query = query.where(Creative.status == status_filter)
    
    query = query.order_by(Creative.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    
    return [CreativeResponse.model_validate(c) for c in result.scalars().all()]


@router.post("/upload", response_model=CreativeResponse, status_code=status.HTTP_201_CREATED)
async def upload_creative(
    campaign_id: uuid.UUID,
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload a creative for analysis."""
    # Verify campaign ownership
    result = await db.execute(
        select(Campaign).join(Brand).where(
            Campaign.id == campaign_id,
            Brand.user_id == current_user.id
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    # Validate file type
    content_type = file.content_type or ""
    if content_type.startswith("image/"):
        media_type = MediaType.IMAGE
    elif content_type.startswith("video/"):
        media_type = MediaType.VIDEO
    else:
        raise HTTPException(status_code=400, detail="Only image and video files are supported")
    
    # Save file to temp storage (in production, use S3/MinIO)
    file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
    file_id = str(uuid.uuid4())
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, f"creative_{file_id}.{file_ext}")
    
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Create creative record
    creative = Creative(
        id=uuid.uuid4(),
        campaign_id=campaign_id,
        media_url=file_path,  # In production, this would be S3 URL
        media_type=media_type,
        file_size=len(content),
        status=CreativeStatus.PENDING
    )
    
    db.add(creative)
    await db.commit()
    await db.refresh(creative)
    
    # Queue analysis in background (if background_tasks available)
    if background_tasks:
        background_tasks.add_task(run_analysis, str(creative.id), file_path, db)
    
    return CreativeResponse.model_validate(creative)


async def run_analysis(creative_id: str, file_path: str, db: AsyncSession):
    """Background task to run creative analysis."""
    from app.services.orchestrator import analyze_creative
    
    try:
        # Update status to processing
        result = await db.execute(select(Creative).where(Creative.id == creative_id))
        creative = result.scalar_one_or_none()
        if creative:
            creative.status = CreativeStatus.PROCESSING
            await db.commit()
        
        # Run analysis
        analysis_result = await analyze_creative(file_path)
        
        # Update creative with results
        if creative and analysis_result.get("score"):
            creative.status = CreativeStatus.COMPLETED
            creative.final_score = analysis_result["score"].get("overall_score")
            creative.score_confidence = analysis_result["score"].get("confidence_band", [0, 0])[0]
            creative.funnel_fit_score = analysis_result["score"].get("funnel_fit_score")
            creative.platform_fit_score = analysis_result["score"].get("platform_fit_score")
            await db.commit()
            
    except Exception as e:
        if creative:
            creative.status = CreativeStatus.FAILED
            await db.commit()


@router.get("/{creative_id}", response_model=CreativeDetail)
async def get_creative(
    creative_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed creative including analysis results."""
    result = await db.execute(
        select(Creative)
        .options(
            selectinload(Creative.score_pillars),
            selectinload(Creative.recommendations)
        )
        .join(Campaign)
        .join(Brand)
        .where(Creative.id == creative_id, Brand.user_id == current_user.id)
    )
    creative = result.scalar_one_or_none()
    
    if not creative:
        raise HTTPException(status_code=404, detail="Creative not found")
    
    return CreativeDetail.model_validate(creative)


@router.post("/{creative_id}/reanalyze", response_model=CreativeResponse)
async def reanalyze_creative(
    creative_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Trigger re-analysis of a creative."""
    result = await db.execute(
        select(Creative)
        .join(Campaign)
        .join(Brand)
        .where(Creative.id == creative_id, Brand.user_id == current_user.id)
    )
    creative = result.scalar_one_or_none()
    
    if not creative:
        raise HTTPException(status_code=404, detail="Creative not found")
    
    creative.status = CreativeStatus.PENDING
    await db.commit()
    
    background_tasks.add_task(run_analysis, str(creative.id), creative.media_url, db)
    
    return CreativeResponse.model_validate(creative)


@router.delete("/{creative_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_creative(
    creative_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a creative."""
    result = await db.execute(
        select(Creative)
        .join(Campaign)
        .join(Brand)
        .where(Creative.id == creative_id, Brand.user_id == current_user.id)
    )
    creative = result.scalar_one_or_none()
    
    if not creative:
        raise HTTPException(status_code=404, detail="Creative not found")
    
    # Delete file if exists
    if creative.media_url and os.path.exists(creative.media_url):
        os.remove(creative.media_url)
    
    await db.delete(creative)
    await db.commit()
