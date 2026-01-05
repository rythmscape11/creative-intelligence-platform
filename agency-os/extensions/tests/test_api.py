"""
API Integration Tests

Tests for the FastAPI endpoints with mocked database.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import patch, AsyncMock

# Import app after setting up mocks
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def mock_db():
    """Mock database connection"""
    with patch('db.Database.connect', new_callable=AsyncMock) as mock_connect, \
         patch('db.Database.disconnect', new_callable=AsyncMock) as mock_disconnect, \
         patch('db.Database.get_pool', new_callable=AsyncMock) as mock_pool:
        mock_pool.return_value = AsyncMock()
        yield {
            'connect': mock_connect,
            'disconnect': mock_disconnect,
            'pool': mock_pool,
        }


@pytest.fixture
async def client(mock_db):
    """Create test client"""
    from api.main import app
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
class TestHealthEndpoints:
    """Tests for health check endpoints"""
    
    async def test_root_endpoint(self, client):
        """Test root endpoint returns API info"""
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "Agency OS Extension API"
        assert data["version"] == "1.0.0"
        
    async def test_health_check(self, client):
        """Test health check endpoint"""
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "version" in data


@pytest.mark.asyncio
class TestSLATierEndpoints:
    """Tests for SLA tier endpoints"""
    
    @patch('api.main.SLATierRepository')
    async def test_list_sla_tiers_empty(self, mock_repo, client):
        """Test listing SLA tiers when empty"""
        mock_repo.get_all = AsyncMock(return_value=[])
        
        response = await client.get("/api/v1/sla-tiers")
        assert response.status_code == 200
        assert response.json() == []
        
    @patch('api.main.SLATierRepository')
    async def test_list_sla_tiers_with_data(self, mock_repo, client):
        """Test listing SLA tiers with data"""
        import uuid
        from datetime import datetime
        
        mock_repo.get_all = AsyncMock(return_value=[
            {
                'id': uuid.uuid4(),
                'name': 'Enterprise',
                'description': 'Premium tier',
                'response_time_hours': 4,
                'monthly_hours_included': 40,
                'hourly_rate': 250.00,
                'monthly_retainer': 10000.00,
                'features': ['Priority support'],
                'priority': 100,
                'created_at': datetime.now(),
            }
        ])
        
        response = await client.get("/api/v1/sla-tiers")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]['name'] == 'Enterprise'


@pytest.mark.asyncio
class TestClientEndpoints:
    """Tests for client endpoints"""
    
    @patch('api.main.ClientRepository')
    async def test_list_clients_empty(self, mock_repo, client):
        """Test listing clients when empty"""
        mock_repo.get_all = AsyncMock(return_value=[])
        
        response = await client.get("/api/v1/clients")
        assert response.status_code == 200
        assert response.json() == []
        
    @patch('api.main.ClientRepository')
    async def test_get_client_not_found(self, mock_repo, client):
        """Test getting non-existent client"""
        mock_repo.get_by_id = AsyncMock(return_value=None)
        
        response = await client.get("/api/v1/clients/non-existent-id")
        assert response.status_code == 404


@pytest.mark.asyncio
class TestCampaignEndpoints:
    """Tests for campaign endpoints"""
    
    @patch('api.main.CampaignRepository')
    async def test_list_campaigns_empty(self, mock_repo, client):
        """Test listing campaigns when empty"""
        mock_repo.get_all = AsyncMock(return_value=[])
        
        response = await client.get("/api/v1/campaigns")
        assert response.status_code == 200
        assert response.json() == []
        
    @patch('api.main.CampaignRepository')
    async def test_list_campaigns_with_filters(self, mock_repo, client):
        """Test listing campaigns with filters"""
        mock_repo.get_all = AsyncMock(return_value=[])
        
        response = await client.get("/api/v1/campaigns?status=active&limit=10")
        assert response.status_code == 200


@pytest.mark.asyncio
class TestDashboardEndpoints:
    """Tests for dashboard endpoints"""
    
    @patch('api.main.CampaignRepository')
    @patch('api.main.ClientRepository')
    async def test_dashboard_stats(self, mock_client_repo, mock_campaign_repo, client):
        """Test dashboard stats endpoint"""
        mock_client_repo.count = AsyncMock(side_effect=[10, 8])  # total, active
        mock_campaign_repo.count = AsyncMock(side_effect=[25, 15])  # total, active
        mock_campaign_repo.get_budget_totals = AsyncMock(return_value={
            'total_allocated': 500000,
            'total_spent': 250000,
        })
        
        response = await client.get("/api/v1/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        assert 'total_clients' in data
        assert 'total_campaigns' in data
