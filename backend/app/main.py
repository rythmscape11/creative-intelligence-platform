"""
FastAPI Main Application - Creative Intelligence Platform
Production-ready with full API routes and middleware.
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import structlog
import time

from app.core.config import settings
from app.core.database import init_db
from app.api import auth, brands, campaigns, creatives, analysis

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    logger.info("starting_application", version=settings.APP_VERSION)
    await init_db()
    yield
    logger.info("shutting_down_application")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered creative scoring and optimization for CMOs and agencies",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS - configure for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", error=str(exc), path=request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__}
    )


# ============== ROUTES ==============

# Include API routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(brands.router, prefix="/api/v1")
app.include_router(campaigns.router, prefix="/api/v1")
app.include_router(creatives.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")


# ============== HEALTH ==============

@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "service": "creative-intelligence-api"
    }


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
