"""
Extension Model Tests

Tests for agency extension models without touching Plane core.
"""
import pytest
import uuid
from decimal import Decimal
from datetime import date
from django.test import TestCase


class SLATierModelTests(TestCase):
    """Tests for SLATier model"""
    
    def test_create_sla_tier(self):
        """Test creating an SLA tier"""
        from extensions.models import SLATier
        
        tier = SLATier.objects.create(
            name='Enterprise',
            description='Enterprise tier with premium support',
            response_time_hours=4,
            monthly_hours_included=40,
            hourly_rate=Decimal('250.00'),
            monthly_retainer=Decimal('10000.00'),
            features=['Priority support', 'Dedicated account manager'],
            priority=100,
        )
        
        assert tier.id is not None
        assert tier.name == 'Enterprise'
        assert tier.response_time_hours == 4
        assert str(tier) == 'Enterprise (4hr response)'
        
    def test_soft_delete(self):
        """Test soft delete functionality"""
        from extensions.models import SLATier
        
        tier = SLATier.objects.create(
            name='Test Tier',
            response_time_hours=24,
            monthly_hours_included=10,
            hourly_rate=Decimal('100.00'),
        )
        
        assert tier.is_deleted is False
        
        tier.soft_delete()
        
        assert tier.is_deleted is True
        assert tier.deleted_at is not None


class AgencyClientModelTests(TestCase):
    """Tests for AgencyClient model"""
    
    def setUp(self):
        from extensions.models import SLATier
        
        self.sla_tier = SLATier.objects.create(
            name='Growth',
            response_time_hours=24,
            monthly_hours_included=20,
            hourly_rate=Decimal('200.00'),
        )
        
    def test_create_client(self):
        """Test creating a client linked to Plane workspace"""
        from extensions.models import AgencyClient
        
        workspace_id = uuid.uuid4()
        
        client = AgencyClient.objects.create(
            plane_workspace_id=workspace_id,
            client_name='Acme Corp',
            client_legal_name='Acme Corporation LLC',
            sla_tier=self.sla_tier,
            billing_contact_email='billing@acme.com',
            contract_start_date=date(2024, 1, 1),
            contract_end_date=date(2024, 12, 31),
            industry='Technology',
            client_type='retainer',
        )
        
        assert client.id is not None
        assert client.plane_workspace_id == workspace_id
        assert client.client_name == 'Acme Corp'
        assert client.sla_tier.name == 'Growth'
        assert client.is_active is True
        
    def test_contract_duration(self):
        """Test contract duration calculation"""
        from extensions.models import AgencyClient
        
        client = AgencyClient.objects.create(
            plane_workspace_id=uuid.uuid4(),
            client_name='Test Client',
            contract_start_date=date(2024, 1, 1),
            contract_end_date=date(2024, 12, 31),
        )
        
        assert client.contract_duration_days == 365


class AgencyCampaignModelTests(TestCase):
    """Tests for AgencyCampaign model"""
    
    def setUp(self):
        from extensions.models import AgencyClient
        
        self.client = AgencyClient.objects.create(
            plane_workspace_id=uuid.uuid4(),
            client_name='Test Client',
        )
        
    def test_create_campaign(self):
        """Test creating a campaign linked to Plane project"""
        from extensions.models import AgencyCampaign
        
        project_id = uuid.uuid4()
        
        campaign = AgencyCampaign.objects.create(
            plane_project_id=project_id,
            client=self.client,
            campaign_type='seo',
            budget_allocated=Decimal('50000.00'),
            budget_spent=Decimal('15000.00'),
            status='active',
            target_kpis={'impressions': 100000, 'clicks': 5000},
        )
        
        assert campaign.id is not None
        assert campaign.plane_project_id == project_id
        assert campaign.budget_remaining == Decimal('35000.00')
        assert campaign.budget_utilization_percent == 30.0
        assert campaign.is_over_budget is False


class CampaignChannelModelTests(TestCase):
    """Tests for CampaignChannel model"""
    
    def setUp(self):
        from extensions.models import AgencyClient, AgencyCampaign
        
        client = AgencyClient.objects.create(
            plane_workspace_id=uuid.uuid4(),
            client_name='Test Client',
        )
        
        self.campaign = AgencyCampaign.objects.create(
            plane_project_id=uuid.uuid4(),
            client=client,
            campaign_type='integrated',
            budget_allocated=Decimal('100000.00'),
        )
        
    def test_create_channel(self):
        """Test creating a campaign channel"""
        from extensions.models import CampaignChannel
        
        channel = CampaignChannel.objects.create(
            campaign=self.campaign,
            channel_type='ppc_google',
            budget_percentage=Decimal('30.00'),
            is_active=True,
        )
        
        assert channel.id is not None
        assert channel.calculated_budget == Decimal('30000.00')
