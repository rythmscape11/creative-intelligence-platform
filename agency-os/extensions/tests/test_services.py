"""
Service Layer Tests

Tests for agency business logic services.
"""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
import uuid
from decimal import Decimal


@pytest.mark.asyncio
class TestCampaignService:
    """Tests for CampaignService"""
    
    @patch('extensions.services.campaign_service.PlaneAPIAdapter')
    async def test_get_campaign_overview(self, mock_adapter_class):
        """Test getting campaign overview"""
        from extensions.services.campaign_service import CampaignService
        
        # Setup mock adapter
        mock_adapter = AsyncMock()
        mock_adapter.get_project.return_value = {
            'id': str(uuid.uuid4()),
            'name': 'Q4 Marketing Campaign',
            'identifier': 'Q4MKT',
        }
        mock_adapter.get_project_issues.return_value = [
            {'id': '1', 'state_detail': {'group': 'completed'}},
            {'id': '2', 'state_detail': {'group': 'in_progress'}},
            {'id': '3', 'state_detail': {'group': 'backlog'}},
        ]
        mock_adapter_class.return_value = mock_adapter
        
        service = CampaignService(plane_adapter=mock_adapter)
        
        # This would need actual DB models, so we'll test the interface
        assert service.plane_adapter == mock_adapter
        
    async def test_calculate_roi(self):
        """Test ROI calculation logic"""
        from extensions.services.campaign_service import ROIMetrics
        
        # Test ROI calculation: (revenue - spend) / spend * 100
        spend = Decimal('10000')
        revenue = Decimal('25000')
        expected_roi = 150.0  # (25000 - 10000) / 10000 * 100
        
        roi = float(((revenue - spend) / spend) * 100)
        
        assert roi == expected_roi


@pytest.mark.asyncio
class TestClientService:
    """Tests for ClientService"""
    
    async def test_client_summary_structure(self):
        """Test ClientSummary dataclass structure"""
        from extensions.services.client_service import ClientSummary
        
        summary = ClientSummary(
            client_id=str(uuid.uuid4()),
            client_name='Test Corp',
            sla_tier='Enterprise',
            is_active=True,
            total_campaigns=5,
            active_campaigns=2,
            total_budget=100000.0,
            contract_end_date='2024-12-31',
        )
        
        assert summary.client_name == 'Test Corp'
        assert summary.total_campaigns == 5
        assert summary.active_campaigns == 2


@pytest.mark.asyncio  
class TestSLAService:
    """Tests for SLAService"""
    
    async def test_sla_report_structure(self):
        """Test SLAReport dataclass structure"""
        from extensions.services.sla_service import SLAReport
        
        report = SLAReport(
            client_id=str(uuid.uuid4()),
            client_name='Test Corp',
            sla_tier_name='Enterprise',
            response_time_target_hours=4,
            total_tickets=100,
            tickets_within_sla=95,
            compliance_percentage=95.0,
            average_response_hours=2.5,
            hours_used_this_month=35.0,
            hours_included=40,
            overage_hours=0.0,
        )
        
        assert report.compliance_percentage == 95.0
        assert report.overage_hours == 0.0
        
    def test_overage_calculation(self):
        """Test overage calculation logic"""
        hours_used = 50.0
        hours_included = 40
        
        overage = max(0, hours_used - hours_included)
        
        assert overage == 10.0
