# Core Protection List

## Overview

This document lists Plane files and modules that **MUST remain unmodified** to ensure upgrade safety and core stability.

> **Rule**: If it's in this list, DO NOT MODIFY IT. If you need functionality from a listed component, extend via adapters, wrappers, or UI overlays.

---

## Protected Directories

| Directory | Description | Modification Allowed |
|-----------|-------------|----------------------|
| `plane/apps/api/plane/db/models/` | All database models | ❌ NEVER |
| `plane/apps/api/plane/db/mixins/` | Model mixins | ❌ NEVER |
| `plane/apps/api/plane/db/migrations/` | Database migrations | ❌ NEVER |
| `plane/apps/api/plane/authentication/` | Auth logic | ❌ NEVER |
| `plane/apps/api/plane/permission/` | Permission checks | ❌ NEVER |
| `plane/apps/api/plane/api/views/` | API views | ❌ NEVER |
| `plane/apps/api/plane/api/serializers/` | API serializers | ❌ NEVER |
| `plane/apps/web/` | Web frontend | ⚠️ UI overlay only |
| `plane/apps/space/` | Public space | ⚠️ UI overlay only |

---

## Protected Files (Critical)

### Database Models
- `plane/apps/api/plane/db/models/workspace.py` - Workspace model
- `plane/apps/api/plane/db/models/project.py` - Project model
- `plane/apps/api/plane/db/models/issue.py` - Issue model
- `plane/apps/api/plane/db/models/cycle.py` - Cycle model
- `plane/apps/api/plane/db/models/module.py` - Module model
- `plane/apps/api/plane/db/models/user.py` - User model
- `plane/apps/api/plane/db/models/base.py` - Base model

### Authentication & Authorization
- `plane/apps/api/plane/authentication/*.py` - All auth files
- `plane/apps/api/plane/permission/*.py` - All permission files
- `plane/apps/api/plane/middleware/*.py` - All middleware

### Core API
- `plane/apps/api/plane/api/urls/*.py` - URL routing
- `plane/apps/api/plane/settings/*.py` - Django settings

---

## Protected Behavior (DO NOT OVERRIDE)

| Behavior | Description |
|----------|-------------|
| Workspace isolation | Multi-tenant boundaries |
| Permission checks | RBAC enforcement |
| State transitions | Issue workflow states |
| Audit logging | Activity trail |
| Soft delete | `deleted_at` pattern |
| UUID primary keys | `id` field pattern |

---

## Allowed Modifications

### UI Layer Only

You MAY customize these **without modifying source**:

| Customization | Method |
|---------------|--------|
| Terminology (Project→Campaign) | i18n override / UI wrapper |
| Colors, logo, branding | CSS override / theme config |
| Hidden features | Conditional rendering |
| Additional navigation | Extension routes |

### Extension Layer

You MAY create new files in:
- `agency-os/extensions/` - All extension code
- `agency-os/ui-adaptations/` - UI customizations
- `agency-os/docs/` - Documentation

---

## How to Handle Conflicts

If you need functionality that would require modifying a protected file:

1. **Document the requirement** in `docs/deferred_requirements.md`
2. **Check if Plane exposes hooks** (webhooks, API events)
3. **Build adapter in extension layer** if possible
4. **Submit upstream PR to Plane** if it's a general feature
5. **Last resort**: Fork with explicit tracking in `docs/fork_changelog.md`
