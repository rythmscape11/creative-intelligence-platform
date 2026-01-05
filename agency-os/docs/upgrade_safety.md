# Upgrade Safety Plan

## Overview

This document describes how to safely upgrade the Plane core while maintaining extension compatibility.

---

## Version Strategy

| Component | Pinning Strategy |
|-----------|------------------|
| Plane repo | Git tag/SHA in submodule |
| Plane Docker images | `:stable` tag or specific version |
| Extension layer | Semantic versioning |

### Current Pinned Version
```
plane: stable (latest at time of setup)
```

---

## Upgrade Process

### 1. Pre-Upgrade Assessment

```bash
# 1. Check current Plane version
cd agency-os/plane
git describe --tags

# 2. Fetch new releases
git fetch origin --tags

# 3. Review changelog between versions
git log --oneline <current>..<target>

# 4. Check for model changes
git diff <current>..<target> -- apps/api/plane/db/models/
```

### 2. Schema Impact Analysis

Focus on these files for breaking changes:

| File | What to Check |
|------|---------------|
| `workspace.py` | `id` field, new required fields |
| `project.py` | `id` field, workspace FK |
| `issue.py` | `id` field, project FK |
| `cycle.py` | `id` field, project FK |
| `base.py` | UUID pattern, deleted_at |

### 3. Upgrade Steps

```bash
# Step 1: Create backup
pg_dump plane > backup-$(date +%Y%m%d).sql

# Step 2: Update Plane to new version
cd agency-os/plane
git checkout v<new-version>

# Step 3: Run Plane migrations in staging
docker-compose -f docker-compose.agency.yml up plane-db
cd plane/apps/api
python manage.py migrate --check

# Step 4: Run extension integrity tests
cd agency-os/extensions
pytest tests/test_fk_integrity.py -v

# Step 5: If all pass, deploy to production
docker-compose -f docker-compose.agency.yml up -d
```

### 4. Rollback Plan

```bash
# If upgrade fails:

# 1. Stop services
docker-compose -f docker-compose.agency.yml down

# 2. Restore database
psql plane < backup-<date>.sql

# 3. Revert Plane version
cd agency-os/plane
git checkout v<previous-version>

# 4. Restart services
docker-compose -f docker-compose.agency.yml up -d
```

---

## Compatibility Testing

### Automated Tests

```python
# tests/test_fk_integrity.py

def test_client_workspace_exists():
    """Verify all agency_clients reference valid workspaces"""
    from extensions.models import AgencyClient
    from plane.db.models import Workspace
    
    for client in AgencyClient.objects.all():
        assert Workspace.objects.filter(id=client.plane_workspace_id).exists()

def test_campaign_project_exists():
    """Verify all agency_campaigns reference valid projects"""
    from extensions.models import AgencyCampaign
    from plane.db.models import Project
    
    for campaign in AgencyCampaign.objects.all():
        assert Project.objects.filter(id=campaign.plane_project_id).exists()
```

### Manual Checks

- [ ] Create new workspace/client pair
- [ ] Create new project/campaign pair
- [ ] Verify agency dashboard shows combined data
- [ ] Check SLA reports generate correctly
- [ ] Confirm activity logs work

---

## Breaking Change Scenarios

### Scenario 1: UUID Field Change

**Impact**: All extension FK references break
**Likelihood**: Very Low
**Response**: This would require major Plane version; wait for LTS

### Scenario 2: New Required Field

**Impact**: Extension API adapter may fail
**Likelihood**: Medium
**Response**: Update adapter, handle missing fields gracefully

### Scenario 3: API Endpoint Change

**Impact**: PlaneAPIAdapter may fail
**Likelihood**: Medium
**Response**: Version adapter; maintain backward compat

### Scenario 4: Auth System Change

**Impact**: Extension auth validation fails
**Likelihood**: Low
**Response**: Update extension auth middleware

---

## Upgrade Schedule

| Frequency | Action |
|-----------|--------|
| Weekly | Check Plane releases |
| Monthly | Assess upgrade feasibility |
| Quarterly | Plan major version upgrades |
| As-needed | Security patch upgrades |
