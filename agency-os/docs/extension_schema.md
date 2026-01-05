# Extension Schema Documentation

## Overview

Agency OS extends Plane through **extension tables** that reference Plane entities via UUID. These tables live in the same PostgreSQL database but are prefixed with `agency_` to distinguish them.

> **Key Principle**: Extension tables store UUIDs as plain fields, NOT as Django ForeignKeys. This avoids coupling and ensures Plane can be upgraded independently.

---

## Tables

### `agency_sla_tiers`

Defines service level agreement tiers for retainer clients.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | VARCHAR(100) | Tier name (e.g., "Enterprise") |
| `description` | TEXT | Tier description |
| `response_time_hours` | INT | Max response time SLA |
| `monthly_hours_included` | INT | Hours included in retainer |
| `hourly_rate` | DECIMAL(8,2) | Rate for overage hours |
| `monthly_retainer` | DECIMAL(10,2) | Fixed monthly fee |
| `features` | JSONB | Array of included features |
| `priority` | INT | Display ordering |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update |
| `deleted_at` | TIMESTAMP | Soft delete marker |

**Justification**: Agency-specific concept with no Plane equivalent. Enables client tiering.

---

### `agency_clients`

Extends Plane Workspace with agency client metadata.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `plane_workspace_id` | UUID | **Links to Plane `workspaces.id`** |
| `client_name` | VARCHAR(255) | Business name |
| `client_legal_name` | VARCHAR(255) | Legal entity name |
| `sla_tier_id` | UUID | FK → `agency_sla_tiers.id` |
| `billing_contact_*` | TEXT | Billing contact info |
| `contract_start_date` | DATE | Contract start |
| `contract_end_date` | DATE | Contract end |
| `is_active` | BOOLEAN | Active status |
| `industry` | VARCHAR(100) | Client industry |
| `client_type` | VARCHAR(50) | retainer/project/hybrid |
| `internal_notes` | TEXT | Internal notes |
| `metadata` | JSONB | Flexible metadata |
| `created_at`, `updated_at`, `deleted_at` | TIMESTAMP | Audit fields |

**Justification**: Adds billing, SLA, contract data to Plane workspaces without modifying workspace schema.

---

### `agency_campaigns`

Extends Plane Project with campaign metadata.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `plane_project_id` | UUID | **Links to Plane `projects.id`** |
| `client_id` | UUID | FK → `agency_clients.id` |
| `campaign_type` | VARCHAR(50) | seo/ppc/social/etc. |
| `budget_allocated` | DECIMAL(12,2) | Total budget |
| `budget_spent` | DECIMAL(12,2) | Spent to date |
| `start_date` | DATE | Campaign start |
| `end_date` | DATE | Campaign end |
| `status` | VARCHAR(20) | draft/active/paused/completed/cancelled |
| `target_kpis` | JSONB | Target metrics |
| `actual_kpis` | JSONB | Achieved metrics |
| `campaign_brief` | TEXT | Brief/objectives |
| `internal_notes` | TEXT | Internal notes |
| `metadata` | JSONB | Flexible metadata |
| `created_at`, `updated_at`, `deleted_at` | TIMESTAMP | Audit fields |

**Justification**: Tracks campaign-specific budget, KPIs, and type—data Plane's generic project doesn't capture.

---

### `agency_campaign_channels`

Tracks marketing channels within a campaign.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `campaign_id` | UUID | FK → `agency_campaigns.id` |
| `channel_type` | VARCHAR(50) | Channel identifier |
| `budget_percentage` | DECIMAL(5,2) | % of campaign budget |
| `budget_amount` | DECIMAL(12,2) | Fixed amount override |
| `is_active` | BOOLEAN | Channel active status |
| `performance_data` | JSONB | Metrics (impressions, clicks, etc.) |
| `external_account_id` | VARCHAR(255) | Platform account ID |
| `external_campaign_id` | VARCHAR(255) | Platform campaign ID |
| `notes` | TEXT | Channel notes |
| `created_at`, `updated_at`, `deleted_at` | TIMESTAMP | Audit fields |

**Justification**: Pure extension entity—agencies need to track multiple channels per campaign with budget splits.

---

## Relationships

```
┌────────────────┐
│agency_sla_tiers│
└───────┬────────┘
        │ 1:N
        ▼
┌────────────────┐         ┌─────────────────┐
│ agency_clients │─────────│ Plane Workspace │ (UUID ref)
└───────┬────────┘         └─────────────────┘
        │ 1:N
        ▼
┌─────────────────┐        ┌─────────────────┐
│agency_campaigns │────────│  Plane Project  │ (UUID ref)
└───────┬─────────┘        └─────────────────┘
        │ 1:N
        ▼
┌──────────────────────────┐
│agency_campaign_channels  │
└──────────────────────────┘
```

---

## Migration Strategy

1. Run Plane migrations first (Plane owns its schema)
2. Run extension migrations separately with prefix `agency_`
3. Extension migrations never alter Plane tables
4. Use reversible migrations for rollback safety
