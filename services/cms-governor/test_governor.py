import pytest
from unittest.mock import MagicMock, patch
import json
from main import cms_governor, check_budget, BUDGET_LIMIT_INR, HARD_STOP_THRESHOLD

@pytest.fixture
def mock_supabase():
    with patch('main.get_supabase_client') as mock_get:
        mock_client = MagicMock()
        mock_get.return_value = mock_client
        yield mock_client

def test_check_budget_safe(mock_supabase):
    # Mock data: Total spend is 1000 (well below limit)
    mock_supabase.table.return_value.select.return_value.execute.return_value.data = [
        {'cost_inr': 500}, {'cost_inr': 500}
    ]
    
    assert check_budget(mock_supabase) is True

def test_check_budget_exceeded(mock_supabase):
    # Mock data: Total spend is 5500 (above 90% of 6000 which is 5400)
    mock_supabase.table.return_value.select.return_value.execute.return_value.data = [
        {'cost_inr': 3000}, {'cost_inr': 2500}
    ]
    
    assert check_budget(mock_supabase) is False

def test_cms_governor_hard_stop(mock_supabase):
    # Mock budget check to return False
    with patch('main.check_budget', return_value=False):
        # Create a mock request
        mock_request = MagicMock()
        mock_request.method = 'POST'
        mock_request.get_json.return_value = {"prompt": "test"}
        
        response = cms_governor(mock_request)
        
        # Check response
        body, status_code, headers = response
        assert status_code == 429
        assert "Budget Limit Exceeded" in body

def test_cms_governor_success(mock_supabase):
    # Mock budget check to return True
    with patch('main.check_budget', return_value=True):
        # Create a mock request
        mock_request = MagicMock()
        mock_request.method = 'POST'
        mock_request.get_json.return_value = {"prompt": "test"}
        
        response = cms_governor(mock_request)
        
        # Check response
        body, status_code, headers = response
        assert status_code == 200
        assert "Budget check passed" in body
