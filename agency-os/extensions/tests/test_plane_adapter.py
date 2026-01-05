"""
Plane API Adapter Tests

Tests for the read-only Plane API adapter.
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
import httpx

from extensions.api.adapters.plane_adapter import PlaneAPIAdapter, PlaneConfig


@pytest.fixture
def config():
    return PlaneConfig(
        base_url='http://localhost:8000',
        api_key='test-api-key',
        timeout=10,
    )


@pytest.fixture
def adapter(config):
    return PlaneAPIAdapter(config)


@pytest.mark.asyncio
class TestPlaneAPIAdapter:
    """Tests for PlaneAPIAdapter"""
    
    async def test_headers_include_api_key(self, adapter):
        """Test that headers include API key when configured"""
        assert 'X-Api-Key' in adapter.headers
        assert adapter.headers['X-Api-Key'] == 'test-api-key'
        
    async def test_headers_no_api_key(self):
        """Test headers without API key"""
        config = PlaneConfig(base_url='http://localhost:8000')
        adapter = PlaneAPIAdapter(config)
        
        assert 'X-Api-Key' not in adapter.headers
        
    @patch('httpx.AsyncClient')
    async def test_get_workspace(self, mock_client_class, adapter):
        """Test fetching a workspace"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'id': '123e4567-e89b-12d3-a456-426614174000',
            'name': 'Test Workspace',
            'slug': 'test-workspace',
        }
        mock_response.raise_for_status = MagicMock()
        
        mock_client = AsyncMock()
        mock_client.get = AsyncMock(return_value=mock_response)
        mock_client.is_closed = False
        mock_client_class.return_value = mock_client
        
        # Force create new client
        adapter._client = mock_client
        
        result = await adapter.get_workspace('123e4567-e89b-12d3-a456-426614174000')
        
        assert result is not None
        assert result['name'] == 'Test Workspace'
        
    @patch('httpx.AsyncClient')
    async def test_get_workspace_not_found(self, mock_client_class, adapter):
        """Test fetching a non-existent workspace"""
        mock_response = MagicMock()
        mock_response.status_code = 404
        
        error = httpx.HTTPStatusError(
            "Not Found",
            request=MagicMock(),
            response=mock_response
        )
        
        mock_client = AsyncMock()
        mock_client.get = AsyncMock(side_effect=error)
        mock_client.is_closed = False
        
        adapter._client = mock_client
        
        result = await adapter.get_workspace('non-existent-id')
        
        assert result is None
        
    @patch('httpx.AsyncClient')
    async def test_get_project_issues(self, mock_client_class, adapter):
        """Test fetching project issues"""
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'results': [
                {'id': 'issue-1', 'name': 'Issue 1'},
                {'id': 'issue-2', 'name': 'Issue 2'},
            ]
        }
        mock_response.raise_for_status = MagicMock()
        
        mock_client = AsyncMock()
        mock_client.get = AsyncMock(return_value=mock_response)
        mock_client.is_closed = False
        
        adapter._client = mock_client
        
        result = await adapter.get_project_issues('test-workspace', 'project-id')
        
        assert len(result) == 2
        assert result[0]['name'] == 'Issue 1'


class TestPlaneConfig:
    """Tests for PlaneConfig"""
    
    def test_default_values(self):
        """Test default configuration values"""
        config = PlaneConfig()
        
        assert config.base_url == 'http://localhost:8000'
        assert config.api_key is None
        assert config.timeout == 30
        
    @patch.dict('os.environ', {
        'PLANE_API_URL': 'http://plane:8000',
        'PLANE_API_KEY': 'my-key',
        'PLANE_API_TIMEOUT': '60',
    })
    def test_from_env(self):
        """Test configuration from environment variables"""
        config = PlaneConfig.from_env()
        
        assert config.base_url == 'http://plane:8000'
        assert config.api_key == 'my-key'
        assert config.timeout == 60
