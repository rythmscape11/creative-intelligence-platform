"""
Campaign Service

Business logic for agency campaigns - combines Plane project data
with agency extension data.
"""
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from decimal import Decimal

from extensions.api.adapters import PlaneAPIAdapter
from extensions.models import AgencyCampaign, CampaignChannel


@dataclass
class CampaignOverview:
    """Combined view of Plane project + agency campaign data"""
    # From extension
    campaign_id: str
    client_name: str
    campaign_type: str
    status: str
    budget_allocated: Optional[Decimal]
    budget_spent: Decimal
    budget_remaining: Optional[Decimal]
    
    # From Plane
    plane_project_id: str
    project_name: str
    project_identifier: str
    
    # Aggregated
    total_deliverables: int
    completed_deliverables: int
    active_channels: int


@dataclass
class ROIMetrics:
    """ROI calculation for a campaign"""
    campaign_id: str
    total_spend: Decimal
    total_revenue: Optional[Decimal]
    roi_percentage: Optional[float]
    cost_per_acquisition: Optional[Decimal]
    
    
class CampaignService:
    """
    Business logic for campaigns.
    
    This service combines data from:
    - Plane API (project, issues, cycles)
    - Extension tables (campaign metadata, channels)
    
    DOES NOT modify Plane core data.
    """
    
    def __init__(self, plane_adapter: Optional[PlaneAPIAdapter] = None):
        self.plane_adapter = plane_adapter or PlaneAPIAdapter()
        
    async def get_campaign_overview(
        self, 
        campaign_id: str,
        workspace_slug: str
    ) -> Optional[CampaignOverview]:
        """
        Get combined overview of campaign + Plane project.
        
        Args:
            campaign_id: UUID of the agency campaign
            workspace_slug: Slug of the Plane workspace
            
        Returns:
            CampaignOverview with combined data
        """
        # Get extension data
        try:
            campaign = await self._get_campaign(campaign_id)
            if not campaign:
                return None
        except Exception:
            return None
            
        # Get Plane project data
        project = await self.plane_adapter.get_project(
            workspace_slug, 
            str(campaign.plane_project_id)
        )
        if not project:
            return None
            
        # Get deliverables (issues)
        issues = await self.plane_adapter.get_project_issues(
            workspace_slug,
            str(campaign.plane_project_id)
        )
        
        # Count completed
        completed = sum(
            1 for issue in issues 
            if issue.get('state_detail', {}).get('group') == 'completed'
        )
        
        # Count active channels
        active_channels = await self._count_active_channels(campaign_id)
        
        return CampaignOverview(
            campaign_id=str(campaign.id),
            client_name=campaign.client.client_name,
            campaign_type=campaign.get_campaign_type_display(),
            status=campaign.status,
            budget_allocated=campaign.budget_allocated,
            budget_spent=campaign.budget_spent,
            budget_remaining=campaign.budget_remaining,
            plane_project_id=str(campaign.plane_project_id),
            project_name=project.get('name', ''),
            project_identifier=project.get('identifier', ''),
            total_deliverables=len(issues),
            completed_deliverables=completed,
            active_channels=active_channels,
        )
    
    async def calculate_campaign_roi(
        self, 
        campaign_id: str,
        revenue: Optional[Decimal] = None
    ) -> ROIMetrics:
        """
        Calculate ROI metrics for a campaign.
        
        Args:
            campaign_id: UUID of the agency campaign
            revenue: Optional revenue to use (otherwise from campaign metadata)
            
        Returns:
            ROIMetrics with calculated values
        """
        campaign = await self._get_campaign(campaign_id)
        if not campaign:
            raise ValueError(f"Campaign not found: {campaign_id}")
            
        total_spend = campaign.budget_spent
        
        # Try to get revenue from metadata if not provided
        if revenue is None:
            revenue = campaign.metadata.get('revenue')
            if revenue:
                revenue = Decimal(str(revenue))
        
        roi_percentage = None
        if revenue and total_spend > 0:
            roi_percentage = float(((revenue - total_spend) / total_spend) * 100)
        
        # Get CPA if we have conversion count
        conversions = campaign.actual_kpis.get('conversions', 0)
        cost_per_acquisition = None
        if conversions > 0 and total_spend > 0:
            cost_per_acquisition = total_spend / Decimal(conversions)
        
        return ROIMetrics(
            campaign_id=str(campaign.id),
            total_spend=total_spend,
            total_revenue=revenue,
            roi_percentage=roi_percentage,
            cost_per_acquisition=cost_per_acquisition,
        )
    
    async def get_campaign_deliverables_status(
        self,
        campaign_id: str,
        workspace_slug: str
    ) -> Dict[str, int]:
        """
        Get deliverable status breakdown for a campaign.
        
        Returns:
            Dict with status counts, e.g., {'todo': 5, 'in_progress': 3, 'done': 10}
        """
        campaign = await self._get_campaign(campaign_id)
        if not campaign:
            return {}
            
        issues = await self.plane_adapter.get_project_issues(
            workspace_slug,
            str(campaign.plane_project_id)
        )
        
        status_counts = {}
        for issue in issues:
            state_group = issue.get('state_detail', {}).get('group', 'unknown')
            status_counts[state_group] = status_counts.get(state_group, 0) + 1
            
        return status_counts
    
    async def list_client_campaigns(
        self,
        client_id: str
    ) -> List[Dict[str, Any]]:
        """
        List all campaigns for a client.
        
        Args:
            client_id: UUID of the agency client
            
        Returns:
            List of campaign summaries
        """
        from extensions.models import AgencyCampaign
        
        campaigns = AgencyCampaign.objects.filter(
            client_id=client_id,
            deleted_at__isnull=True
        ).select_related('client')
        
        return [
            {
                'id': str(c.id),
                'campaign_type': c.get_campaign_type_display(),
                'status': c.status,
                'budget_allocated': float(c.budget_allocated) if c.budget_allocated else None,
                'budget_spent': float(c.budget_spent),
                'start_date': c.start_date.isoformat() if c.start_date else None,
                'end_date': c.end_date.isoformat() if c.end_date else None,
            }
            for c in campaigns
        ]
    
    # =====================
    # Private Helpers
    # =====================
    
    async def _get_campaign(self, campaign_id: str) -> Optional[AgencyCampaign]:
        """Fetch campaign from database"""
        from extensions.models import AgencyCampaign
        try:
            return await AgencyCampaign.objects.select_related('client').aget(
                id=campaign_id,
                deleted_at__isnull=True
            )
        except AgencyCampaign.DoesNotExist:
            return None
            
    async def _count_active_channels(self, campaign_id: str) -> int:
        """Count active channels for a campaign"""
        from extensions.models import CampaignChannel
        return await CampaignChannel.objects.filter(
            campaign_id=campaign_id,
            is_active=True,
            deleted_at__isnull=True
        ).acount()
