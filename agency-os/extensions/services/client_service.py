"""
Client Service

Business logic for agency clients - combines Plane workspace data
with agency extension data.
"""
from typing import Optional, List, Dict, Any
from dataclasses import dataclass

from extensions.api.adapters import PlaneAPIAdapter
from extensions.models import AgencyClient


@dataclass
class ClientSummary:
    """Summary view of a client with campaign stats"""
    client_id: str
    client_name: str
    sla_tier: Optional[str]
    is_active: bool
    total_campaigns: int
    active_campaigns: int
    total_budget: float
    contract_end_date: Optional[str]


class ClientService:
    """
    Business logic for agency clients.
    
    Combines data from Plane workspaces with extension tables.
    """
    
    def __init__(self, plane_adapter: Optional[PlaneAPIAdapter] = None):
        self.plane_adapter = plane_adapter or PlaneAPIAdapter()
        
    async def get_client_summary(self, client_id: str) -> Optional[ClientSummary]:
        """
        Get summary view of a client with campaign statistics.
        
        Args:
            client_id: UUID of the agency client
            
        Returns:
            ClientSummary with aggregated data
        """
        client = await self._get_client(client_id)
        if not client:
            return None
            
        # Get campaign stats
        from extensions.models import AgencyCampaign
        campaigns = AgencyCampaign.objects.filter(
            client_id=client_id,
            deleted_at__isnull=True
        )
        
        total_campaigns = await campaigns.acount()
        active_campaigns = await campaigns.filter(status='active').acount()
        
        # Calculate total budget
        total_budget = 0.0
        async for campaign in campaigns:
            if campaign.budget_allocated:
                total_budget += float(campaign.budget_allocated)
        
        return ClientSummary(
            client_id=str(client.id),
            client_name=client.client_name,
            sla_tier=client.sla_tier.name if client.sla_tier else None,
            is_active=client.is_active,
            total_campaigns=total_campaigns,
            active_campaigns=active_campaigns,
            total_budget=total_budget,
            contract_end_date=client.contract_end_date.isoformat() if client.contract_end_date else None,
        )
    
    async def list_all_clients(
        self,
        active_only: bool = False
    ) -> List[ClientSummary]:
        """
        List all clients with their summaries.
        
        Args:
            active_only: If True, only return active clients
            
        Returns:
            List of ClientSummary objects
        """
        from extensions.models import AgencyClient
        
        queryset = AgencyClient.objects.filter(deleted_at__isnull=True)
        if active_only:
            queryset = queryset.filter(is_active=True)
            
        summaries = []
        async for client in queryset.select_related('sla_tier'):
            summary = await self.get_client_summary(str(client.id))
            if summary:
                summaries.append(summary)
                
        return summaries
    
    async def sync_client_with_workspace(
        self, 
        client_id: str
    ) -> Dict[str, Any]:
        """
        Sync client data with corresponding Plane workspace.
        
        Returns information about the sync status.
        """
        client = await self._get_client(client_id)
        if not client:
            return {'status': 'error', 'message': 'Client not found'}
            
        workspace = await self.plane_adapter.get_workspace(
            str(client.plane_workspace_id)
        )
        
        if not workspace:
            return {
                'status': 'warning',
                'message': 'Linked Plane workspace not found',
                'workspace_id': str(client.plane_workspace_id),
            }
            
        return {
            'status': 'synced',
            'client_name': client.client_name,
            'workspace_name': workspace.get('name'),
            'workspace_slug': workspace.get('slug'),
        }
    
    async def _get_client(self, client_id: str) -> Optional[AgencyClient]:
        """Fetch client from database"""
        try:
            return await AgencyClient.objects.select_related('sla_tier').aget(
                id=client_id,
                deleted_at__isnull=True
            )
        except AgencyClient.DoesNotExist:
            return None
