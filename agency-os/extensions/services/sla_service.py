"""
SLA Service

Business logic for SLA compliance tracking.
"""
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timedelta
from decimal import Decimal

from extensions.api.adapters import PlaneAPIAdapter
from extensions.models import AgencyClient, SLATier


@dataclass
class SLAReport:
    """SLA compliance report for a client"""
    client_id: str
    client_name: str
    sla_tier_name: str
    response_time_target_hours: int
    
    # Compliance metrics
    total_tickets: int
    tickets_within_sla: int
    compliance_percentage: float
    average_response_hours: float
    
    # Hours tracking
    hours_used_this_month: float
    hours_included: int
    overage_hours: float
    

class SLAService:
    """
    SLA compliance tracking and reporting.
    
    Uses Plane issue data to calculate response times and compliance.
    """
    
    def __init__(self, plane_adapter: Optional[PlaneAPIAdapter] = None):
        self.plane_adapter = plane_adapter or PlaneAPIAdapter()
        
    async def get_sla_report(
        self, 
        client_id: str,
        workspace_slug: str
    ) -> Optional[SLAReport]:
        """
        Generate SLA compliance report for a client.
        
        Args:
            client_id: UUID of the agency client
            workspace_slug: Slug of the Plane workspace
            
        Returns:
            SLAReport with compliance metrics
        """
        from extensions.models import AgencyClient, AgencyCampaign
        
        # Get client and SLA tier
        try:
            client = await AgencyClient.objects.select_related('sla_tier').aget(
                id=client_id,
                deleted_at__isnull=True
            )
        except AgencyClient.DoesNotExist:
            return None
            
        if not client.sla_tier:
            return None
            
        # Get all projects for this client
        campaigns = AgencyCampaign.objects.filter(
            client_id=client_id,
            deleted_at__isnull=True
        )
        
        total_tickets = 0
        tickets_within_sla = 0
        total_response_hours = 0.0
        
        async for campaign in campaigns:
            issues = await self.plane_adapter.get_project_issues(
                workspace_slug,
                str(campaign.plane_project_id)
            )
            
            for issue in issues:
                total_tickets += 1
                
                # Calculate response time from created_at to first comment/activity
                created_at = issue.get('created_at')
                first_response = issue.get('first_response_at')  # May need adjustment based on Plane API
                
                if created_at and first_response:
                    created = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    responded = datetime.fromisoformat(first_response.replace('Z', '+00:00'))
                    response_hours = (responded - created).total_seconds() / 3600
                    
                    total_response_hours += response_hours
                    
                    if response_hours <= client.sla_tier.response_time_hours:
                        tickets_within_sla += 1
        
        compliance_percentage = 0.0
        average_response_hours = 0.0
        
        if total_tickets > 0:
            compliance_percentage = (tickets_within_sla / total_tickets) * 100
            average_response_hours = total_response_hours / total_tickets
        
        # Get hours used this month (from time tracking if available)
        hours_used = await self._get_hours_used_this_month(client_id)
        overage = max(0, hours_used - client.sla_tier.monthly_hours_included)
        
        return SLAReport(
            client_id=str(client.id),
            client_name=client.client_name,
            sla_tier_name=client.sla_tier.name,
            response_time_target_hours=client.sla_tier.response_time_hours,
            total_tickets=total_tickets,
            tickets_within_sla=tickets_within_sla,
            compliance_percentage=round(compliance_percentage, 1),
            average_response_hours=round(average_response_hours, 1),
            hours_used_this_month=hours_used,
            hours_included=client.sla_tier.monthly_hours_included,
            overage_hours=overage,
        )
    
    async def list_sla_tiers(self) -> List[Dict[str, Any]]:
        """List all available SLA tiers"""
        from extensions.models import SLATier
        
        tiers = []
        async for tier in SLATier.objects.filter(deleted_at__isnull=True).order_by('-priority'):
            tiers.append({
                'id': str(tier.id),
                'name': tier.name,
                'response_time_hours': tier.response_time_hours,
                'monthly_hours_included': tier.monthly_hours_included,
                'hourly_rate': float(tier.hourly_rate),
                'monthly_retainer': float(tier.monthly_retainer) if tier.monthly_retainer else None,
                'features': tier.features,
            })
        return tiers
    
    async def _get_hours_used_this_month(self, client_id: str) -> float:
        """
        Get hours used this month for a client.
        
        This would integrate with time tracking data if available.
        For now, returns 0 as a placeholder.
        """
        # TODO: Integrate with time tracking system
        # This could query Plane's time tracking if enabled,
        # or an external time tracking system
        return 0.0
