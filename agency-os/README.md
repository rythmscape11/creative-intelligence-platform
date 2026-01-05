# Agency OS

**Commercial-grade Agency Operating System built on Plane**

Agency OS extends [Plane](https://github.com/makeplane/plane) with agency-specific functionality without modifying the core platform.

## Quick Start

```bash
# 1. Setup
make setup

# Or manually:
cp .env.example .env
docker-compose -f docker-compose.agency.yml up -d

# 2. Access
# Plane UI:     http://localhost:3000
# API Docs:     http://localhost:8080/docs
```

## Architecture

```
┌─────────────────────────────────────────┐
│           Agency OS Layer               │
│  ┌─────────────────────────────────┐    │
│  │  FastAPI REST API (port 8080)   │    │
│  │  - /api/v1/clients              │    │
│  │  - /api/v1/campaigns            │    │
│  │  - /api/v1/dashboard            │    │
│  └─────────────────────────────────┘    │
│  Extension Tables (agency_*)            │
└──────────────────┬──────────────────────┘
                   │ UUID References
                   ▼
┌─────────────────────────────────────────┐
│         Plane Core (Untouched)          │
│  - Workspaces → Client Accounts         │
│  - Projects   → Campaigns               │
│  - Issues     → Deliverables            │
│  - Cycles     → Campaign Phases         │
└─────────────────────────────────────────┘
```

## Concept Mapping

| Plane | Agency OS | Description |
|-------|-----------|-------------|
| Workspace | Client Account | Client's workspace |
| Project | Campaign | Marketing campaign |
| Issue | Deliverable | Task/deliverable |
| Cycle | Phase | Time-boxed phase |

## Extension Tables

| Table | Purpose |
|-------|---------|
| `agency_sla_tiers` | SLA definitions |
| `agency_clients` | Client metadata |
| `agency_campaigns` | Campaign data |
| `agency_campaign_channels` | Marketing channels |

## Commands

```bash
make start      # Start services
make stop       # Stop services
make logs       # View logs
make test       # Run tests
make migrate    # Run migrations
make help       # All commands
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/v1/sla-tiers` | List SLA tiers |
| `GET /api/v1/clients` | List clients |
| `GET /api/v1/campaigns` | List campaigns |
| `GET /api/v1/dashboard/stats` | Dashboard stats |

Full API docs at: http://localhost:8080/docs

## Project Structure

```
agency-os/
├── plane/                  # Plane core (untouched)
├── extensions/
│   ├── api/main.py        # FastAPI app
│   ├── models/            # Extension models
│   ├── services/          # Business logic
│   ├── migrations/        # SQL migrations
│   └── tests/             # Test suite
├── docs/                  # Documentation
└── docker-compose.agency.yml
```

## Documentation

- [Architecture Diagram](docs/architecture_diagram.md)
- [Extension Schema](docs/extension_schema.md)
- [Core Protection List](docs/core_protection_list.md)
- [Risk Register](docs/risk_register.md)
- [Upgrade Safety](docs/upgrade_safety.md)

## Key Principles

1. **Zero Plane modifications** - All agency logic in extensions
2. **UUID references** - No Django FK to Plane
3. **Read-only API** - Mutations go through Plane
4. **Upgrade safe** - Extensions don't block updates

## License

Extension layer is MIT. Plane core is AGPL-3.0.
