import os
import json
import functions_framework
from supabase import create_client, Client
from openai import OpenAI

# Hard budget limit in INR
BUDGET_LIMIT_INR = 6000.0
# Hard stop threshold (90%)
HARD_STOP_THRESHOLD = 0.9

def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise ValueError("Supabase credentials not found in environment variables")
    return create_client(url, key)

def check_budget(supabase: Client) -> bool:
    """
    Checks if the total spend is within the safe threshold.
    Returns True if safe to proceed, False if budget exceeded.
    """
    try:
        # Fetch total spend from the budget_ledger table
        # Assuming a table 'budget_ledger' with a 'cost_inr' column
        response = supabase.table("budget_ledger").select("cost_inr").execute()
        
        total_spend = sum(record['cost_inr'] for record in response.data)
        
        limit = BUDGET_LIMIT_INR * HARD_STOP_THRESHOLD
        
        print(f"Current total spend: ₹{total_spend:.2f} / Limit: ₹{limit:.2f}")
        
        if total_spend >= limit:
            return False
        return True
    except Exception as e:
        print(f"Error checking budget: {e}")
        # Fail safe: If we can't check budget, we assume it's unsafe to proceed to prevent overruns
        # OR we could allow it but log a critical error. 
        # Given "Frugal Cloud Foundation", we should probably be conservative.
        return False

@functions_framework.http
def cms_governor(request):
    """
    HTTP Cloud Function that acts as a proxy for AI calls.
    """
    # 1. CORS Headers
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # 2. Parse Request
    try:
        request_json = request.get_json(silent=True)
        if not request_json:
            return (json.dumps({"error": "Invalid JSON"}), 400, headers)
    except Exception as e:
        return (json.dumps({"error": str(e)}), 400, headers)

    # 3. Budget Check
    try:
        supabase = get_supabase_client()
        if not check_budget(supabase):
            # 429 Hard Stop
            return (json.dumps({
                "error": "Budget Limit Exceeded",
                "message": "The service has reached its financial safety limit. Please contact support."
            }), 429, headers)
    except Exception as e:
        print(f"Infrastructure Error: {e}")
        return (json.dumps({"error": "Internal Server Error during budget check"}), 500, headers)

    # 4. Forward to LLM (Mock implementation for now, or actual call if keys present)
    # In a real scenario, we would parse the 'prompt' from request_json and call OpenAI
    
    # For P1.1, we demonstrate the governance logic. 
    # If we passed the budget check, we would proceed.
    
    return (json.dumps({
        "status": "success",
        "message": "Budget check passed. Request authorized.",
        "data": {
            "mock_response": "This is a mock response from the governed AI service."
        }
    }), 200, headers)
