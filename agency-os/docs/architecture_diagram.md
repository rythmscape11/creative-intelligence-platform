# Agency OS Architecture Diagram

## System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           AGENCY OS LAYER                                │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────────┐  │
│  │   Agency UI     │  │  Agency API      │  │  Extension Services    │  │
│  │   (Relabeled)   │  │  Adapter         │  │  - CampaignService     │  │
│  │   - Campaigns   │  │  - Read-only     │  │  - ClientService       │  │
│  │   - Deliverables│  │  - Plane→Agency  │  │  - SLAService          │  │
│  │   - Client Accts│  │                  │  │                        │  │
│  └────────┬────────┘  └────────┬─────────┘  └───────────┬────────────┘  │
│           │                    │                        │               │
│           │                    │                        │               │
│  ┌────────┴────────────────────┴────────────────────────┴────────────┐  │
│  │                    EXTENSION DATABASE                              │  │
│  │  ┌──────────────┐ ┌───────────────┐ ┌─────────────────────────┐   │  │
│  │  │agency_clients│ │agency_campaigns│ │agency_campaign_channels │   │  │
│  │  │--------------│ │---------------│ │-------------------------│   │  │
│  │  │plane_wksp_id │→│plane_proj_id  │ │campaign_id              │   │  │
│  │  │client_name   │ │client_id      │→│channel_type             │   │  │
│  │  │sla_tier_id   │←│budget_alloc   │ │budget_percentage        │   │  │
│  │  └──────────────┘ └───────────────┘ └─────────────────────────┘   │  │
│  │                                                                    │  │
│  │  ┌──────────────┐                                                  │  │
│  │  │agency_sla_   │                                                  │  │
│  │  │tiers         │   → = FK reference to Plane UUID                 │  │
│  │  │--------------│   ← = FK reference within extensions             │  │
│  │  │name          │                                                  │  │
│  │  │response_hrs  │                                                  │  │
│  │  └──────────────┘                                                  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                    │  UUID FK References (No Django FK)
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         PLANE CORE (UNTOUCHED)                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                        Plane API Server                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐   │   │
│  │  │ Workspaces   │  │  Projects    │  │  Issues               │   │   │
│  │  │ (Clients)    │  │  (Campaigns) │  │  (Deliverables)       │   │   │
│  │  └──────────────┘  └──────────────┘  └───────────────────────┘   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐   │   │
│  │  │   Cycles     │  │   Modules    │  │  Activity Logs        │   │   │
│  │  │   (Phases)   │  │ (Workstreams)│  │  (Audit Trail)        │   │   │
│  │  └──────────────┘  └──────────────┘  └───────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     Plane Web Frontend                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                     Plane Database (PostgreSQL)                   │   │
│  │  Tables: workspaces, projects, issues, cycles, modules, etc.      │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action                    Extension Layer                   Plane Core
-----------                    ---------------                   ----------
                                                                      
Create Client    ─────────────►  AgencyClient                         
                                     │                                
                                     │ Trigger                        
                                     ▼                                
                               Create Workspace  ────────────────►  Workspace
                                     │                              (created)
                                     │                                
                                     ▼                                
                               Link workspace_id                      
                                                                      
                                                                      
View Campaign    ◄─────────────  CampaignService                      
Overview                             │                                
                                     │ Fetch                          
                                     ▼                                
                               PlaneAPIAdapter ──────────────────►  Project
                                     │                              Issues
                                     │                              Cycles
                                     ▼                                
                               Combine with                           
                               AgencyCampaign                         
                               extension data                         
```

## Key Boundaries

| Boundary | Description |
|----------|-------------|
| **Core→Extension** | Extensions read Plane via API or stored UUID references |
| **Extension→Core** | No writes to Plane core tables; use Plane UI/API for mutations |
| **Database** | Shared PostgreSQL; extension tables prefixed with `agency_` |
| **Authentication** | Uses Plane's auth; extension validates against Plane sessions |
