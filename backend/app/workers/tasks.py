"""
Celery tasks for async processing.
"""
from celery import shared_task
from app.workers.celery_app import celery_app
import structlog

logger = structlog.get_logger()


@celery_app.task(bind=True, max_retries=3)
def analyze_creative_task(self, creative_id: str, image_path: str):
    """
    Background task to analyze a creative.
    """
    import asyncio
    from app.services.orchestrator import analyze_creative
    from app.core.database import AsyncSessionLocal
    from app.models.models import Creative, CreativeStatus
    from sqlalchemy import select
    
    logger.info("analysis_task_started", creative_id=creative_id)
    
    async def run_analysis():
        async with AsyncSessionLocal() as db:
            try:
                # Update status
                result = await db.execute(select(Creative).where(Creative.id == creative_id))
                creative = result.scalar_one_or_none()
                
                if not creative:
                    logger.error("creative_not_found", creative_id=creative_id)
                    return
                
                creative.status = CreativeStatus.PROCESSING
                await db.commit()
                
                # Run analysis
                analysis_result = await analyze_creative(image_path)
                
                # Update with results
                if analysis_result.get("score"):
                    creative.status = CreativeStatus.COMPLETED
                    creative.final_score = analysis_result["score"].get("overall_score")
                    creative.funnel_fit_score = analysis_result["score"].get("funnel_fit_score")
                    creative.platform_fit_score = analysis_result["score"].get("platform_fit_score")
                else:
                    creative.status = CreativeStatus.FAILED
                
                await db.commit()
                logger.info("analysis_task_completed", creative_id=creative_id)
                
            except Exception as e:
                logger.error("analysis_task_failed", creative_id=creative_id, error=str(e))
                if creative:
                    creative.status = CreativeStatus.FAILED
                    await db.commit()
                raise
    
    asyncio.run(run_analysis())


@celery_app.task
def generate_report_task(creative_ids: list, format: str, user_id: str):
    """
    Background task to generate reports.
    """
    logger.info("report_task_started", creative_ids=creative_ids, format=format)
    # Report generation logic would go here
    pass
