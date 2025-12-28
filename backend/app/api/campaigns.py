"""
Campaigns API Router - CRUD operations for campaign management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, Brand, Campaign
from app.models.schemas import CampaignCreate, CampaignResponse

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


@router.get("/", response_model=List[CampaignResponse])
async def list_campaigns(
    brand_id: uuid.UUID = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List campaigns, optionally filtered by brand."""
    query = select(Campaign).join(Brand).where(Brand.user_id == current_user.id)
    
    if brand_id:
        query = query.where(Campaign.brand_id == brand_id)
    
    result = await db.execute(query.order_by(Campaign.created_at.desc()))
    return [CampaignResponse.model_validate(c) for c in result.scalars().all()]


@router.post("/", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
async def create_campaign(
    campaign_data: CampaignCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new campaign."""
    # Verify brand ownership
    result = await db.execute(
        select(Brand).where(Brand.id == campaign_data.brand_id, Brand.user_id == current_user.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Brand not found")
    
    campaign = Campaign(
        id=uuid.uuid4(),
        brand_id=campaign_data.brand_id,
        name=campaign_data.name,
        platform=campaign_data.platform,
        funnel_stage=campaign_data.funnel_stage,
        objective=campaign_data.objective,
        target_audience=campaign_data.target_audience,
        start_date=campaign_data.start_date,
        end_date=campaign_data.end_date
    )
    
    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)
    
    return CampaignResponse.model_validate(campaign)


@router.get("/{campaign_id}", response_model=CampaignResponse)
async def get_campaign(
    campaign_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific campaign."""
    result = await db.execute(
        select(Campaign).join(Brand).where(
            Campaign.id == campaign_id, 
            Brand.user_id == current_user.id
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return CampaignResponse.model_validate(campaign)


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_campaign(
    campaign_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a campaign."""
    result = await db.execute(
        select(Campaign).join(Brand).where(
            Campaign.id == campaign_id,
            Brand.user_id == current_user.id
        )
    )
    campaign = result.scalar_one_or_none()
    
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    await db.delete(campaign)
    await db.commit()
