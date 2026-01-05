# Risk & Conflict Register

## Overview

This register tracks what Plane functionality is reused, extended, or deferred.

---

## Reused (No Changes)

| Component | Plane Feature | Agency Use |
|-----------|---------------|------------|
| Authentication | Plane auth system | User login, sessions |
| Authorization | Workspace RBAC | Client access control |
| Workspace isolation | Multi-tenant boundaries | Client separation |
| Project management | Project CRUD | Campaign structure |
| Issue tracking | Issue lifecycle | Deliverable tracking |
| Cycles | Time-boxed sprints | Campaign phases |
| Modules | Issue grouping | Workstreams |
| Activity logs | Audit trail | Compliance |
| Views | Custom filters | Agency views |
| Analytics | Built-in analytics | Base reporting |

---

## Extended (Additions Only)

| Component | Extension | Risk Level |
|-----------|-----------|------------|
| Workspace | `agency_clients` table | Low |
| Project | `agency_campaigns` table | Low |
| — | `agency_campaign_channels` table | Low |
| — | `agency_sla_tiers` table | Low |
| API | PlaneAPIAdapter (read-only) | Low |
| Services | CampaignService, ClientService, SLAService | Low |
| UI | Terminology relabeling | Low |

---

## Deferred (Not Implemented)

| Feature | Reason | Future Path |
|---------|--------|-------------|
| Time tracking integration | Needs Plane time tracking API | Wait for Plane feature |
| Direct DB writes | Violates extension rules | Use Plane API |
| Custom workflow states | Requires Plane model changes | Submit upstream PR |
| Custom issue types | Plane has issue_type feature | Use native feature when ready |
| Real-time sync | Complex, needs websockets | Phase 2 |
| Billing integration | Outside Plane scope | Separate billing service |

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Plane schema changes break FK | Medium | High | Use UUID refs, not Django FK |
| Plane API changes | Medium | Medium | Version-pin Plane; adapter abstraction |
| Extension performance | Low | Medium | Read-only queries; caching |
| Data inconsistency | Low | High | Reconciliation jobs; eventual consistency |
| UI fork drift | Medium | Medium | Minimal UI changes; overlay approach |
| AGPL license issues | Low | High | Keep source open or negotiate license |

---

## Conflict Resolution Process

1. **Detect**: Monitor Plane releases for schema/API changes
2. **Assess**: Check if changes affect extension FK references
3. **Plan**: Create migration plan before updating Plane
4. **Test**: Run full test suite in staging
5. **Deploy**: Update Plane and extensions together
6. **Verify**: Confirm FK integrity post-deployment
