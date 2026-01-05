"""
Plane API Adapter

Read-only adapter for fetching data from Plane's API.
Used for agency dashboards and reporting without modifying Plane core.
"""
import os
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
import httpx


@dataclass
class PlaneConfig:
    """Configuration for Plane API connection"""
    base_url: str = "http://localhost:8000"
    api_key: Optional[str] = None
    timeout: int = 30
    
    @classmethod
    def from_env(cls) -> 'PlaneConfig':
        return cls(
            base_url=os.getenv('PLANE_API_URL', 'http://localhost:8000'),
            api_key=os.getenv('PLANE_API_KEY'),
            timeout=int(os.getenv('PLANE_API_TIMEOUT', '30')),
        )


class PlaneAPIAdapter:
    """
    Read-only adapter to Plane API for agency dashboards.
    
    This adapter provides a clean interface to fetch data from Plane
    without exposing internal Plane API details to the agency layer.
    
    IMPORTANT: This adapter is READ-ONLY by design.
    All mutations should go through Plane's UI or API directly.
    """
    
    def __init__(self, config: Optional[PlaneConfig] = None):
        self.config = config or PlaneConfig.from_env()
        self._client: Optional[httpx.AsyncClient] = None
        
    @property
    def headers(self) -> Dict[str, str]:
        """Build request headers with API key if available"""
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        if self.config.api_key:
            headers['X-Api-Key'] = self.config.api_key
        return headers
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.config.base_url,
                headers=self.headers,
                timeout=self.config.timeout,
            )
        return self._client
    
    async def close(self):
        """Close the HTTP client"""
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            
    # =====================
    # Workspace Operations
    # =====================
    
    async def get_workspace(self, workspace_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch a single workspace by ID.
        
        Args:
            workspace_id: UUID of the Plane workspace
            
        Returns:
            Workspace data dict or None if not found
        """
        client = await self._get_client()
        try:
            response = await client.get(f"/api/v1/workspaces/{workspace_id}/")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
            
    async def get_workspace_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """
        Fetch workspace by slug.
        
        Args:
            slug: Workspace slug
            
        Returns:
            Workspace data dict or None if not found
        """
        client = await self._get_client()
        try:
            response = await client.get(f"/api/v1/workspaces/{slug}/")
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    # =====================
    # Project Operations
    # =====================
    
    async def get_project(self, workspace_slug: str, project_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch a single project by ID.
        
        Args:
            workspace_slug: Slug of the parent workspace
            project_id: UUID of the Plane project
            
        Returns:
            Project data dict or None if not found
        """
        client = await self._get_client()
        try:
            response = await client.get(
                f"/api/v1/workspaces/{workspace_slug}/projects/{project_id}/"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
            
    async def list_projects(self, workspace_slug: str) -> List[Dict[str, Any]]:
        """
        List all projects in a workspace.
        
        Args:
            workspace_slug: Slug of the workspace
            
        Returns:
            List of project data dicts
        """
        client = await self._get_client()
        response = await client.get(f"/api/v1/workspaces/{workspace_slug}/projects/")
        response.raise_for_status()
        return response.json().get('results', [])
    
    # =====================
    # Issue Operations
    # =====================
    
    async def get_project_issues(
        self, 
        workspace_slug: str, 
        project_id: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch all issues for a project (campaign deliverables).
        
        Args:
            workspace_slug: Slug of the workspace
            project_id: UUID of the project
            filters: Optional query filters
            
        Returns:
            List of issue data dicts
        """
        client = await self._get_client()
        params = filters or {}
        response = await client.get(
            f"/api/v1/workspaces/{workspace_slug}/projects/{project_id}/issues/",
            params=params
        )
        response.raise_for_status()
        return response.json().get('results', [])
    
    async def get_issue(
        self, 
        workspace_slug: str, 
        project_id: str,
        issue_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch a single issue by ID.
        
        Args:
            workspace_slug: Slug of the workspace
            project_id: UUID of the project
            issue_id: UUID of the issue
            
        Returns:
            Issue data dict or None if not found
        """
        client = await self._get_client()
        try:
            response = await client.get(
                f"/api/v1/workspaces/{workspace_slug}/projects/{project_id}/issues/{issue_id}/"
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return None
            raise
    
    # =====================
    # Cycle Operations
    # =====================
    
    async def get_project_cycles(
        self, 
        workspace_slug: str, 
        project_id: str
    ) -> List[Dict[str, Any]]:
        """
        Fetch all cycles for a project (campaign phases).
        
        Args:
            workspace_slug: Slug of the workspace
            project_id: UUID of the project
            
        Returns:
            List of cycle data dicts
        """
        client = await self._get_client()
        response = await client.get(
            f"/api/v1/workspaces/{workspace_slug}/projects/{project_id}/cycles/"
        )
        response.raise_for_status()
        return response.json().get('results', [])
    
    async def get_cycle_burndown(
        self, 
        workspace_slug: str, 
        project_id: str,
        cycle_id: str
    ) -> Dict[str, Any]:
        """
        Fetch burndown chart data for a cycle.
        
        Args:
            workspace_slug: Slug of the workspace
            project_id: UUID of the project
            cycle_id: UUID of the cycle
            
        Returns:
            Burndown chart data
        """
        client = await self._get_client()
        response = await client.get(
            f"/api/v1/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/burndown/"
        )
        response.raise_for_status()
        return response.json()
    
    # =====================
    # Activity Operations
    # =====================
    
    async def get_project_activity(
        self, 
        workspace_slug: str, 
        project_id: str,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Fetch recent activity for a project.
        
        Args:
            workspace_slug: Slug of the workspace
            project_id: UUID of the project
            limit: Maximum number of activities to return
            
        Returns:
            List of activity data dicts
        """
        client = await self._get_client()
        response = await client.get(
            f"/api/v1/workspaces/{workspace_slug}/projects/{project_id}/activities/",
            params={'limit': limit}
        )
        response.raise_for_status()
        return response.json().get('results', [])
    
    # =====================
    # Analytics Operations
    # =====================
    
    async def get_project_analytics(
        self, 
        workspace_slug: str, 
        project_id: str
    ) -> Dict[str, Any]:
        """
        Fetch analytics for a project.
        
        Args:
            workspace_slug: Slug of the workspace
            project_id: UUID of the project
            
        Returns:
            Analytics data
        """
        client = await self._get_client()
        response = await client.get(
            f"/api/v1/workspaces/{workspace_slug}/projects/{project_id}/analytics/"
        )
        response.raise_for_status()
        return response.json()
