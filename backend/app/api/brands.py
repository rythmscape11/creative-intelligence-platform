"""
Brands API Router - CRUD operations for brand management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.models import User, Brand
from app.models.schemas import BrandCreate, BrandResponse

router = APIRouter(prefix="/brands", tags=["Brands"])


@router.get("/", response_model=List[BrandResponse])
async def list_brands(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all brands for the current user."""
    result = await db.execute(
        select(Brand).where(Brand.user_id == current_user.id).order_by(Brand.created_at.desc())
    )
    return [BrandResponse.model_validate(b) for b in result.scalars().all()]


@router.post("/", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
async def create_brand(
    brand_data: BrandCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new brand."""
    brand = Brand(
        id=uuid.uuid4(),
        user_id=current_user.id,
        name=brand_data.name,
        category=brand_data.category,
        sub_category=brand_data.sub_category,
        logo_url=brand_data.logo_url,
        brand_colors=brand_data.brand_colors,
        guidelines_url=brand_data.guidelines_url
    )
    
    db.add(brand)
    await db.commit()
    await db.refresh(brand)
    
    return BrandResponse.model_validate(brand)


@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(
    brand_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific brand."""
    result = await db.execute(
        select(Brand).where(Brand.id == brand_id, Brand.user_id == current_user.id)
    )
    brand = result.scalar_one_or_none()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return BrandResponse.model_validate(brand)


@router.put("/{brand_id}", response_model=BrandResponse)
async def update_brand(
    brand_id: uuid.UUID,
    brand_data: BrandCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a brand."""
    result = await db.execute(
        select(Brand).where(Brand.id == brand_id, Brand.user_id == current_user.id)
    )
    brand = result.scalar_one_or_none()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    brand.name = brand_data.name
    brand.category = brand_data.category
    brand.sub_category = brand_data.sub_category
    brand.logo_url = brand_data.logo_url
    brand.brand_colors = brand_data.brand_colors
    brand.guidelines_url = brand_data.guidelines_url
    
    await db.commit()
    await db.refresh(brand)
    
    return BrandResponse.model_validate(brand)


@router.delete("/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_brand(
    brand_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a brand."""
    result = await db.execute(
        select(Brand).where(Brand.id == brand_id, Brand.user_id == current_user.id)
    )
    brand = result.scalar_one_or_none()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    await db.delete(brand)
    await db.commit()
