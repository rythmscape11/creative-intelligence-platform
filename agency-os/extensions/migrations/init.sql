-- Agency OS Extension Tables Migration
-- This SQL creates extension tables in the Plane PostgreSQL database
-- Tables are prefixed with 'agency_' to avoid conflicts

-- =============================================
-- 1. SLA Tiers Table
-- =============================================
CREATE TABLE IF NOT EXISTS agency_sla_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    response_time_hours INTEGER NOT NULL DEFAULT 24,
    monthly_hours_included INTEGER NOT NULL DEFAULT 20,
    hourly_rate DECIMAL(8, 2) NOT NULL,
    monthly_retainer DECIMAL(10, 2),
    features JSONB DEFAULT '[]'::jsonb,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_agency_sla_tiers_deleted_at 
    ON agency_sla_tiers(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 2. Agency Clients Table
-- Links to Plane workspaces via UUID
-- =============================================
CREATE TABLE IF NOT EXISTS agency_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plane_workspace_id UUID NOT NULL UNIQUE,
    client_name VARCHAR(255) NOT NULL,
    client_legal_name VARCHAR(255) DEFAULT '',
    sla_tier_id UUID REFERENCES agency_sla_tiers(id) ON DELETE SET NULL,
    billing_contact_name VARCHAR(255) DEFAULT '',
    billing_contact_email VARCHAR(255) DEFAULT '',
    billing_address TEXT DEFAULT '',
    contract_start_date DATE,
    contract_end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    industry VARCHAR(100) DEFAULT '',
    client_type VARCHAR(50) DEFAULT 'retainer' 
        CHECK (client_type IN ('retainer', 'project', 'hybrid')),
    internal_notes TEXT DEFAULT '',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_agency_clients_plane_workspace_id 
    ON agency_clients(plane_workspace_id);
CREATE INDEX IF NOT EXISTS idx_agency_clients_is_active 
    ON agency_clients(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_agency_clients_deleted_at 
    ON agency_clients(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 3. Agency Campaigns Table
-- Links to Plane projects via UUID
-- =============================================
CREATE TABLE IF NOT EXISTS agency_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plane_project_id UUID NOT NULL UNIQUE,
    client_id UUID NOT NULL REFERENCES agency_clients(id) ON DELETE CASCADE,
    campaign_type VARCHAR(50) DEFAULT 'integrated'
        CHECK (campaign_type IN (
            'seo', 'ppc', 'social', 'email', 'content', 
            'branding', 'web', 'integrated', 'other'
        )),
    budget_allocated DECIMAL(12, 2),
    budget_spent DECIMAL(12, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    target_kpis JSONB DEFAULT '{}'::jsonb,
    actual_kpis JSONB DEFAULT '{}'::jsonb,
    campaign_brief TEXT DEFAULT '',
    internal_notes TEXT DEFAULT '',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_agency_campaigns_plane_project_id 
    ON agency_campaigns(plane_project_id);
CREATE INDEX IF NOT EXISTS idx_agency_campaigns_client_id 
    ON agency_campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_campaigns_status 
    ON agency_campaigns(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_agency_campaigns_deleted_at 
    ON agency_campaigns(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- 4. Campaign Channels Table
-- =============================================
CREATE TABLE IF NOT EXISTS agency_campaign_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES agency_campaigns(id) ON DELETE CASCADE,
    channel_type VARCHAR(50) NOT NULL,
    budget_percentage DECIMAL(5, 2) DEFAULT 0,
    budget_amount DECIMAL(12, 2),
    is_active BOOLEAN DEFAULT TRUE,
    performance_data JSONB DEFAULT '{}'::jsonb,
    external_account_id VARCHAR(255) DEFAULT '',
    external_campaign_id VARCHAR(255) DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(campaign_id, channel_type)
);

CREATE INDEX IF NOT EXISTS idx_agency_campaign_channels_campaign_id 
    ON agency_campaign_channels(campaign_id);
CREATE INDEX IF NOT EXISTS idx_agency_campaign_channels_is_active 
    ON agency_campaign_channels(is_active) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_agency_campaign_channels_deleted_at 
    ON agency_campaign_channels(deleted_at) WHERE deleted_at IS NULL;

-- =============================================
-- Trigger for updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_agency_sla_tiers_updated_at ON agency_sla_tiers;
CREATE TRIGGER update_agency_sla_tiers_updated_at
    BEFORE UPDATE ON agency_sla_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agency_clients_updated_at ON agency_clients;
CREATE TRIGGER update_agency_clients_updated_at
    BEFORE UPDATE ON agency_clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agency_campaigns_updated_at ON agency_campaigns;
CREATE TRIGGER update_agency_campaigns_updated_at
    BEFORE UPDATE ON agency_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agency_campaign_channels_updated_at ON agency_campaign_channels;
CREATE TRIGGER update_agency_campaign_channels_updated_at
    BEFORE UPDATE ON agency_campaign_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Seed Default SLA Tiers
-- =============================================
INSERT INTO agency_sla_tiers (name, description, response_time_hours, monthly_hours_included, hourly_rate, monthly_retainer, features, priority)
VALUES 
    ('Enterprise', 'Premium tier with dedicated support', 4, 40, 250.00, 10000.00, 
     '["Priority support", "Dedicated account manager", "Monthly strategy calls", "Quarterly business reviews"]'::jsonb, 100),
    ('Growth', 'Standard tier for growing businesses', 24, 20, 200.00, 4000.00,
     '["Email support", "Monthly reports", "Bi-weekly check-ins"]'::jsonb, 50),
    ('Starter', 'Entry tier for small businesses', 48, 10, 175.00, 1750.00,
     '["Email support", "Monthly reports"]'::jsonb, 10)
ON CONFLICT DO NOTHING;

-- =============================================
-- Comments for documentation
-- =============================================
COMMENT ON TABLE agency_sla_tiers IS 'SLA tier definitions for agency retainer clients';
COMMENT ON TABLE agency_clients IS 'Extends Plane workspaces with agency client metadata';
COMMENT ON TABLE agency_campaigns IS 'Extends Plane projects with campaign-specific data';
COMMENT ON TABLE agency_campaign_channels IS 'Marketing channels within campaigns';

COMMENT ON COLUMN agency_clients.plane_workspace_id IS 'UUID reference to Plane workspaces.id';
COMMENT ON COLUMN agency_campaigns.plane_project_id IS 'UUID reference to Plane projects.id';
