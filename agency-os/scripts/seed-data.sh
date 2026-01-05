#!/bin/bash
# Seed sample data for Agency OS development

set -e

echo "🌱 Seeding sample data..."

# Connect to database and insert sample data
docker-compose -f docker-compose.agency.yml exec -T plane-db psql -U plane -d plane << 'EOF'

-- Sample SLA Tiers (if not already seeded)
INSERT INTO agency_sla_tiers (name, description, response_time_hours, monthly_hours_included, hourly_rate, monthly_retainer, features, priority)
VALUES 
    ('Enterprise', 'Premium tier with dedicated support', 4, 40, 250.00, 10000.00, 
     '["Priority support", "Dedicated account manager", "Monthly strategy calls", "Quarterly business reviews"]'::jsonb, 100)
ON CONFLICT DO NOTHING;

INSERT INTO agency_sla_tiers (name, description, response_time_hours, monthly_hours_included, hourly_rate, monthly_retainer, features, priority)
VALUES 
    ('Growth', 'Standard tier for growing businesses', 24, 20, 200.00, 4000.00,
     '["Email support", "Monthly reports", "Bi-weekly check-ins"]'::jsonb, 50)
ON CONFLICT DO NOTHING;

INSERT INTO agency_sla_tiers (name, description, response_time_hours, monthly_hours_included, hourly_rate, monthly_retainer, features, priority)
VALUES 
    ('Starter', 'Entry tier for small businesses', 48, 10, 175.00, 1750.00,
     '["Email support", "Monthly reports"]'::jsonb, 10)
ON CONFLICT DO NOTHING;

-- Sample Clients (with fake Plane workspace UUIDs)
INSERT INTO agency_clients (plane_workspace_id, client_name, client_legal_name, industry, client_type, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Acme Corporation', 'Acme Corp LLC', 'Technology', 'retainer', true),
    ('22222222-2222-2222-2222-222222222222', 'GlobalTech Industries', 'GlobalTech Industries Inc', 'Manufacturing', 'retainer', true),
    ('33333333-3333-3333-3333-333333333333', 'StartupXYZ', 'StartupXYZ LLC', 'SaaS', 'project', true),
    ('44444444-4444-4444-4444-444444444444', 'LocalBiz LLC', 'LocalBiz LLC', 'Retail', 'hybrid', false)
ON CONFLICT (plane_workspace_id) DO NOTHING;

-- Link clients to SLA tiers
UPDATE agency_clients SET sla_tier_id = (SELECT id FROM agency_sla_tiers WHERE name = 'Enterprise' LIMIT 1)
WHERE client_name = 'Acme Corporation';

UPDATE agency_clients SET sla_tier_id = (SELECT id FROM agency_sla_tiers WHERE name = 'Growth' LIMIT 1)
WHERE client_name = 'GlobalTech Industries';

UPDATE agency_clients SET sla_tier_id = (SELECT id FROM agency_sla_tiers WHERE name = 'Starter' LIMIT 1)
WHERE client_name = 'StartupXYZ';

-- Sample Campaigns
INSERT INTO agency_campaigns (plane_project_id, client_id, campaign_type, budget_allocated, budget_spent, status, target_kpis)
SELECT 
    'aaaa1111-1111-1111-1111-111111111111',
    id,
    'seo',
    50000.00,
    15000.00,
    'active',
    '{"organic_traffic": 50000, "rankings_improved": 25}'::jsonb
FROM agency_clients WHERE client_name = 'Acme Corporation'
ON CONFLICT (plane_project_id) DO NOTHING;

INSERT INTO agency_campaigns (plane_project_id, client_id, campaign_type, budget_allocated, budget_spent, status, target_kpis)
SELECT 
    'bbbb2222-2222-2222-2222-222222222222',
    id,
    'ppc',
    100000.00,
    45000.00,
    'active',
    '{"impressions": 500000, "clicks": 25000, "conversions": 1000}'::jsonb
FROM agency_clients WHERE client_name = 'Acme Corporation'
ON CONFLICT (plane_project_id) DO NOTHING;

INSERT INTO agency_campaigns (plane_project_id, client_id, campaign_type, budget_allocated, budget_spent, status, target_kpis)
SELECT 
    'cccc3333-3333-3333-3333-333333333333',
    id,
    'social',
    30000.00,
    12000.00,
    'active',
    '{"followers": 10000, "engagement_rate": 5.0}'::jsonb
FROM agency_clients WHERE client_name = 'GlobalTech Industries'
ON CONFLICT (plane_project_id) DO NOTHING;

-- Sample Campaign Channels
INSERT INTO agency_campaign_channels (campaign_id, channel_type, budget_percentage, is_active)
SELECT id, 'ppc_google', 60.00, true FROM agency_campaigns WHERE campaign_type = 'ppc' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO agency_campaign_channels (campaign_id, channel_type, budget_percentage, is_active)
SELECT id, 'ppc_meta', 40.00, true FROM agency_campaigns WHERE campaign_type = 'ppc' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO agency_campaign_channels (campaign_id, channel_type, budget_percentage, is_active)
SELECT id, 'social_instagram', 50.00, true FROM agency_campaigns WHERE campaign_type = 'social' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO agency_campaign_channels (campaign_id, channel_type, budget_percentage, is_active)
SELECT id, 'social_linkedin', 50.00, true FROM agency_campaigns WHERE campaign_type = 'social' LIMIT 1
ON CONFLICT DO NOTHING;

-- Verify data
SELECT 'SLA Tiers: ' || COUNT(*)::text FROM agency_sla_tiers WHERE deleted_at IS NULL;
SELECT 'Clients: ' || COUNT(*)::text FROM agency_clients WHERE deleted_at IS NULL;
SELECT 'Campaigns: ' || COUNT(*)::text FROM agency_campaigns WHERE deleted_at IS NULL;
SELECT 'Channels: ' || COUNT(*)::text FROM agency_campaign_channels WHERE deleted_at IS NULL;

EOF

echo ""
echo "✅ Sample data seeded successfully!"
echo ""
echo "Try these API calls:"
echo "  curl http://localhost:8080/api/v1/sla-tiers"
echo "  curl http://localhost:8080/api/v1/clients"
echo "  curl http://localhost:8080/api/v1/campaigns"
echo "  curl http://localhost:8080/api/v1/dashboard/stats"
