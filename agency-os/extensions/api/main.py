"""
Agency OS Extension API

FastAPI-based REST API for agency extension functionality.
Fully wired to database repositories.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal
import uuid
import os
import json

# Import database utilities
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import Database, SLATierRepository, ClientRepository, CampaignRepository


# =============================================================================
# Lifespan Events
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - connect/disconnect database"""
    # Startup
    print("🚀 Starting Agency OS Extension API...")
    try:
        await Database.connect()
        print("✅ Database connected")
    except Exception as e:
        print(f"⚠️ Database connection failed: {e}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down...")
    await Database.disconnect()
    print("✅ Database disconnected")


# Create FastAPI app with lifespan
app = FastAPI(
    title="Agency OS Extension API",
    description="REST API for Agency OS extension layer on Plane",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# Pydantic Models (Request/Response)
# =============================================================================

class SLATierCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: str = ""
    response_time_hours: int = 24
    monthly_hours_included: int = 20
    hourly_rate: Decimal
    monthly_retainer: Optional[Decimal] = None
    features: List[str] = []
    priority: int = 0


class SLATierResponse(BaseModel):
    id: str
    name: str
    description: str
    response_time_hours: int
    monthly_hours_included: int
    hourly_rate: float
    monthly_retainer: Optional[float] = None
    features: List[str] = []
    priority: int = 0
    created_at: Optional[str] = None


class ClientCreate(BaseModel):
    plane_workspace_id: str
    client_name: str = Field(..., max_length=255)
    client_legal_name: str = ""
    sla_tier_id: Optional[str] = None
    billing_contact_email: str = ""
    contract_start_date: Optional[date] = None
    contract_end_date: Optional[date] = None
    industry: str = ""
    client_type: str = "retainer"


class ClientResponse(BaseModel):
    id: str
    plane_workspace_id: str
    client_name: str
    sla_tier_name: Optional[str] = None
    is_active: bool
    contract_end_date: Optional[str] = None
    created_at: Optional[str] = None


class CampaignCreate(BaseModel):
    plane_project_id: str
    client_id: str
    campaign_type: str = "integrated"
    budget_allocated: Optional[Decimal] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str = "draft"
    target_kpis: dict = {}


class CampaignResponse(BaseModel):
    id: str
    plane_project_id: str
    client_id: str
    client_name: Optional[str] = None
    campaign_type: str
    budget_allocated: Optional[float] = None
    budget_spent: float = 0
    status: str
    created_at: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    database_connected: bool


class DashboardStats(BaseModel):
    total_clients: int
    active_clients: int
    total_campaigns: int
    active_campaigns: int
    total_budget_allocated: float
    total_budget_spent: float


# =============================================================================
# Helper Functions
# =============================================================================

def format_row(row: dict) -> dict:
    """Format database row for JSON response"""
    if not row:
        return None
    result = {}
    for key, value in row.items():
        if isinstance(value, uuid.UUID):
            result[key] = str(value)
        elif hasattr(value, 'isoformat'):  # datetime/date
            result[key] = value.isoformat()
        elif isinstance(value, Decimal):
            result[key] = float(value)
        elif isinstance(value, str) and value.startswith('[') and value.endswith(']'):
            # Parse JSON array strings from database
            try:
                result[key] = json.loads(value)
            except json.JSONDecodeError:
                result[key] = value
        elif isinstance(value, str) and value.startswith('{') and value.endswith('}'):
            # Parse JSON object strings from database
            try:
                result[key] = json.loads(value)
            except json.JSONDecodeError:
                result[key] = value
        else:
            result[key] = value
    return result


# =============================================================================
# Health Check
# =============================================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check service health and database connectivity"""
    db_connected = False
    try:
        pool = await Database.get_pool()
        db_connected = pool is not None
    except Exception:
        pass
        
    return HealthResponse(
        status="healthy" if db_connected else "degraded",
        version="1.0.0",
        database_connected=db_connected,
    )


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint with API info"""
    return {
        "service": "Agency OS Extension API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# =============================================================================
# SLA Tier Endpoints
# =============================================================================

@app.get("/api/v1/sla-tiers", response_model=List[SLATierResponse], tags=["SLA Tiers"])
async def list_sla_tiers():
    """List all SLA tiers"""
    try:
        rows = await SLATierRepository.get_all()
        return [format_row(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/sla-tiers", response_model=SLATierResponse, status_code=201, tags=["SLA Tiers"])
async def create_sla_tier(tier: SLATierCreate):
    """Create a new SLA tier"""
    try:
        row = await SLATierRepository.create(
            name=tier.name,
            description=tier.description,
            response_time_hours=tier.response_time_hours,
            monthly_hours_included=tier.monthly_hours_included,
            hourly_rate=tier.hourly_rate,
            monthly_retainer=tier.monthly_retainer,
            features=tier.features,
            priority=tier.priority,
        )
        return format_row(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/sla-tiers/{tier_id}", response_model=SLATierResponse, tags=["SLA Tiers"])
async def get_sla_tier(tier_id: str):
    """Get a specific SLA tier"""
    try:
        row = await SLATierRepository.get_by_id(tier_id)
        if not row:
            raise HTTPException(status_code=404, detail="SLA tier not found")
        return format_row(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Client Endpoints
# =============================================================================

@app.get("/api/v1/clients", response_model=List[ClientResponse], tags=["Clients"])
async def list_clients(
    active_only: bool = Query(False, description="Only return active clients"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """List all agency clients"""
    try:
        rows = await ClientRepository.get_all(active_only=active_only, skip=skip, limit=limit)
        return [format_row(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/clients/{client_id}", response_model=ClientResponse, tags=["Clients"])
async def get_client(client_id: str):
    """Get a specific client"""
    try:
        row = await ClientRepository.get_by_id(client_id)
        if not row:
            raise HTTPException(status_code=404, detail="Client not found")
        return format_row(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/clients/workspace/{workspace_id}", response_model=ClientResponse, tags=["Clients"])
async def get_client_by_workspace(workspace_id: str):
    """Get client by Plane workspace ID"""
    try:
        row = await ClientRepository.get_by_workspace_id(workspace_id)
        if not row:
            raise HTTPException(status_code=404, detail="Client not found for this workspace")
        return format_row(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Campaign Endpoints
# =============================================================================

@app.get("/api/v1/campaigns", response_model=List[CampaignResponse], tags=["Campaigns"])
async def list_campaigns(
    client_id: Optional[str] = Query(None, description="Filter by client"),
    status: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """List all campaigns"""
    try:
        rows = await CampaignRepository.get_all(
            client_id=client_id,
            status=status,
            skip=skip,
            limit=limit
        )
        return [format_row(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/campaigns/{campaign_id}", response_model=CampaignResponse, tags=["Campaigns"])
async def get_campaign(campaign_id: str):
    """Get a specific campaign"""
    try:
        row = await CampaignRepository.get_by_id(campaign_id)
        if not row:
            raise HTTPException(status_code=404, detail="Campaign not found")
        return format_row(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Dashboard Endpoints
# =============================================================================

@app.get("/api/v1/dashboard/stats", response_model=DashboardStats, tags=["Dashboard"])
async def get_dashboard_stats():
    """Get agency dashboard statistics"""
    try:
        total_clients = await ClientRepository.count()
        active_clients = await ClientRepository.count(active_only=True)
        total_campaigns = await CampaignRepository.count()
        active_campaigns = await CampaignRepository.count(status='active')
        budget_totals = await CampaignRepository.get_budget_totals()
        
        return DashboardStats(
            total_clients=total_clients or 0,
            active_clients=active_clients or 0,
            total_campaigns=total_campaigns or 0,
            active_campaigns=active_campaigns or 0,
            total_budget_allocated=float(budget_totals.get('total_allocated', 0) or 0),
            total_budget_spent=float(budget_totals.get('total_spent', 0) or 0),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Application Entry Point
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8080")),
        reload=os.getenv("DEBUG", "false").lower() == "true",
    )
