# Feature Access Matrix - MediaPlanPro

**Date:** 2025-10-29  
**Purpose:** Document role-based and plan-based feature access control

---

## Role-Based Access Control (RBAC)

### User Roles
MediaPlanPro uses three primary roles:

| Role | Description | Typical Use Case |
|------|-------------|------------------|
| **USER** | Basic user with limited access | Free plan users, individual marketers |
| **EDITOR** | Content creator with blog management access | Pro/Team plan users, content managers |
| **ADMIN** | Full system access including integrations | Enterprise users, system administrators |

---

## Feature Access by Role

### Core Features (All Roles)

| Feature | USER | EDITOR | ADMIN | Implementation Status |
|---------|------|--------|-------|----------------------|
| **Authentication** | ✅ | ✅ | ✅ | ✅ Complete |
| Sign In/Sign Up | ✅ | ✅ | ✅ | ✅ Complete |
| Password Reset | ✅ | ✅ | ✅ | ✅ Complete |
| Profile Management | ✅ | ✅ | ✅ | ✅ Complete |
| **Marketing Tools** | ✅ | ✅ | ✅ | ✅ Complete |
| All 30 Growth Suite Tools | ✅ | ✅ | ✅ | ✅ Complete |
| Unlimited Tool Usage | ✅ | ✅ | ✅ | ✅ Complete |
| Basic Export (CSV, JSON) | ✅ | ✅ | ✅ | ✅ Complete |
| **Strategy Builder** | ✅ | ✅ | ✅ | ✅ Complete |
| Create Strategies | ✅ | ✅ | ✅ | ✅ Complete |
| View Own Strategies | ✅ | ✅ | ✅ | ✅ Complete |
| Edit Own Strategies | ✅ | ✅ | ✅ | ✅ Complete |
| Delete Own Strategies | ✅ | ✅ | ✅ | ✅ Complete |

### Premium Features (EDITOR & ADMIN)

| Feature | USER | EDITOR | ADMIN | Implementation Status |
|---------|------|--------|-------|----------------------|
| **Blog Management** | ❌ | ✅ | ✅ | ✅ Complete |
| Create Blog Posts | ❌ | ✅ | ✅ | ✅ Complete |
| Edit Blog Posts | ❌ | ✅ | ✅ | ✅ Complete |
| Publish Blog Posts | ❌ | ✅ | ✅ | ✅ Complete |
| Manage Categories/Tags | ❌ | ✅ | ✅ | ✅ Complete |
| Blog Analytics | ❌ | ✅ | ✅ | ✅ Complete |
| **Advanced Features** | ❌ | ✅ | ✅ | ⚠️ Partial |
| Save Unlimited Results | ❌ | ✅ | ✅ | ✅ Complete |
| Result History | ❌ | ✅ | ✅ | ✅ Complete |
| Premium PDF Exports | ❌ | ✅ | ✅ | ⚠️ Partial |
| Branded Reports | ❌ | ✅ | ✅ | ❌ Not Implemented |
| AI-Powered Recommendations | ❌ | ✅ | ✅ | ❌ Not Implemented |
| Advanced Analytics | ❌ | ✅ | ✅ | ⚠️ Partial |

### Admin-Only Features (ADMIN)

| Feature | USER | EDITOR | ADMIN | Implementation Status |
|---------|------|--------|-------|----------------------|
| **User Management** | ❌ | ❌ | ✅ | ✅ Complete |
| View All Users | ❌ | ❌ | ✅ | ✅ Complete |
| Edit User Roles | ❌ | ❌ | ✅ | ✅ Complete |
| Delete Users | ❌ | ❌ | ✅ | ✅ Complete |
| Bulk Role Updates | ❌ | ❌ | ✅ | ✅ Complete |
| **Integrations** | ❌ | ❌ | ✅ | ✅ Complete |
| Mailchimp Integration | ❌ | ❌ | ✅ | ✅ Complete |
| Google Analytics Integration | ❌ | ❌ | ✅ | ✅ Complete |
| ConvertKit Integration | ❌ | ❌ | ✅ | ✅ Complete |
| Google Sheets Integration | ❌ | ❌ | ✅ | ⚠️ Partial |
| Custom Webhooks | ❌ | ❌ | ✅ | ❌ Not Implemented |
| **Lead Management** | ❌ | ❌ | ✅ | ✅ Complete |
| View All Leads | ❌ | ❌ | ✅ | ✅ Complete |
| Export Leads (CSV) | ❌ | ❌ | ✅ | ✅ Complete |
| Delete Leads | ❌ | ❌ | ✅ | ✅ Complete |
| Lead Analytics | ❌ | ❌ | ✅ | ✅ Complete |
| **System Administration** | ❌ | ❌ | ✅ | ✅ Complete |
| View All Strategies | ❌ | ❌ | ✅ | ✅ Complete |
| System Analytics | ❌ | ❌ | ✅ | ✅ Complete |
| Activity Logs | ❌ | ❌ | ✅ | ✅ Complete |
| Tracking Codes | ❌ | ❌ | ✅ | ✅ Complete |
| System Settings | ❌ | ❌ | ✅ | ✅ Complete |
| System Health | ❌ | ❌ | ✅ | ✅ Complete |

---

## Plan-Based Access Control

### Pricing Tiers
MediaPlanPro offers four pricing tiers:

| Plan | Monthly Price | Yearly Price | Target Audience |
|------|--------------|--------------|-----------------|
| **FREE** | $0 | $0 | Individual users, trying out tools |
| **PRO** | $39 | $390 ($32.50/mo) | Serious marketers, content creators |
| **TEAM** | $99 | $990 ($82.50/mo) | Marketing teams, agencies |
| **ENTERPRISE** | Custom | Custom | Large organizations, custom needs |

### Feature Access by Plan

| Feature | FREE | PRO | TEAM | ENTERPRISE |
|---------|------|-----|------|------------|
| **Core Tools** |
| All 30 Marketing Tools | ✅ | ✅ | ✅ | ✅ |
| Unlimited Tool Usage | ✅ | ✅ | ✅ | ✅ |
| Basic Export (CSV, JSON) | ✅ | ✅ | ✅ | ✅ |
| Community Support | ✅ | ✅ | ✅ | ✅ |
| **Premium Features** |
| Save Results | ❌ | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| Result History | ❌ | ✅ Complete | ✅ Complete | ✅ Complete |
| Premium PDF Exports | ❌ | ✅ | ✅ | ✅ |
| Branded Reports | ❌ | ✅ | ✅ | ✅ |
| AI-Powered Recommendations | ❌ | ✅ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ | ✅ |
| Priority Email Support | ❌ | ✅ | ✅ | ✅ |
| Export to Multiple Formats | ❌ | ✅ | ✅ | ✅ |
| **Team Features** |
| Team Members | 1 | 1 | Up to 10 | Unlimited |
| Shared Workspaces | ❌ | ❌ | ✅ | ✅ |
| Team Collaboration | ❌ | ❌ | ✅ | ✅ |
| Share Results with Team | ❌ | ❌ | ✅ | ✅ |
| Admin Controls | ❌ | ❌ | ✅ | ✅ |
| Usage Analytics Dashboard | ❌ | ❌ | ✅ | ✅ |
| Priority Chat Support | ❌ | ❌ | ✅ | ✅ |
| Onboarding Call | ❌ | ❌ | ✅ | ✅ |
| **Enterprise Features** |
| White-Label Solution | ❌ | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ❌ | ✅ |
| Custom Integrations | ❌ | ❌ | ❌ | ✅ |
| Dedicated Account Manager | ❌ | ❌ | ❌ | ✅ |
| SLA Guarantee | ❌ | ❌ | ❌ | ✅ |
| Custom Training | ❌ | ❌ | ❌ | ✅ |
| Advanced Security | ❌ | ❌ | ❌ | ✅ |

---

## Role-to-Plan Mapping

**Important:** Roles and Plans are separate concepts:
- **Roles** control access to admin features (USER, EDITOR, ADMIN)
- **Plans** control access to premium features (FREE, PRO, TEAM, ENTERPRISE)

### Typical Mapping:
- **FREE Plan** → USER role (default for new signups)
- **PRO Plan** → USER or EDITOR role (can be upgraded)
- **TEAM Plan** → EDITOR role (for team members)
- **ENTERPRISE Plan** → ADMIN role (for system administrators)

**Note:** An ADMIN user can have any plan tier. Admin features (integrations, user management) are role-based, not plan-based.

---

## API Route Protection

### Integration API Routes (ADMIN Only)

All integration management routes require ADMIN role:

| Route | Method | Role Required | Status |
|-------|--------|---------------|--------|
| `/api/integrations` | GET | ADMIN | ✅ Protected |
| `/api/integrations` | POST | ADMIN | ✅ Protected |
| `/api/integrations/[id]` | GET | ADMIN | ✅ Protected |
| `/api/integrations/[id]` | PATCH | ADMIN | ✅ Protected |
| `/api/integrations/[id]` | DELETE | ADMIN | ✅ Protected |
| `/api/integrations/[id]/analytics` | GET | ADMIN | ✅ Protected |
| `/api/integrations/mailchimp/test` | POST | ADMIN | ✅ Protected |
| `/api/integrations/mailchimp/sync` | POST | Public* | ✅ Protected |
| `/api/integrations/mailchimp/bulk-sync` | POST | ADMIN | ✅ Protected |
| `/api/integrations/mailchimp/send-newsletter` | POST | ADMIN | ✅ Protected |
| `/api/integrations/google-analytics/auth` | GET | ADMIN | ✅ Protected |
| `/api/integrations/google-analytics/callback` | GET | ADMIN | ✅ Protected |
| `/api/integrations/google-analytics/test` | POST | ADMIN | ✅ Protected |
| `/api/integrations/google-analytics/track` | POST | ADMIN | ✅ Protected |
| `/api/integrations/google-analytics/reports` | GET | ADMIN | ✅ Protected |
| `/api/integrations/convertkit/connect` | POST | ADMIN | ✅ Protected |
| `/api/integrations/convertkit/test` | POST | ADMIN | ✅ Protected |
| `/api/integrations/convertkit/sync` | POST | ADMIN | ✅ Protected |
| `/api/integrations/convertkit/tags` | GET | ADMIN | ✅ Protected |

*Note: `/api/integrations/mailchimp/sync` allows public access for newsletter signups but requires authentication for admin features.

### Admin API Routes (ADMIN Only)

| Route | Method | Role Required | Status |
|-------|--------|---------------|--------|
| `/api/admin/users` | GET | ADMIN | ✅ Protected |
| `/api/admin/users/[id]` | PATCH | ADMIN | ✅ Protected |
| `/api/admin/users/[id]` | DELETE | ADMIN | ✅ Protected |
| `/api/admin/users/[id]/role` | PATCH | ADMIN | ✅ Protected |
| `/api/admin/leads` | GET | ADMIN | ✅ Protected |
| `/api/admin/leads/[id]` | DELETE | ADMIN | ✅ Protected |
| `/api/admin/leads/export` | GET | ADMIN | ✅ Protected |
| `/api/admin/strategies` | GET | ADMIN | ✅ Protected |
| `/api/admin/analytics` | GET | ADMIN | ✅ Protected |
| `/api/admin/activity` | GET | ADMIN | ✅ Protected |
| `/api/admin/stats` | GET | ADMIN | ✅ Protected |
| `/api/admin/settings` | GET/PATCH | ADMIN | ✅ Protected |
| `/api/admin/tracking-codes` | GET/POST | ADMIN | ✅ Protected |
| `/api/admin/health` | GET | ADMIN | ✅ Protected |

### Blog API Routes (EDITOR & ADMIN)

| Route | Method | Role Required | Status |
|-------|--------|---------------|--------|
| `/api/blog/posts` | GET | Public | ✅ Public |
| `/api/blog/posts` | POST | EDITOR/ADMIN | ⚠️ Needs Check |
| `/api/blog/posts/[id]` | GET | Public | ✅ Public |
| `/api/blog/posts/[id]` | PATCH | EDITOR/ADMIN | ⚠️ Needs Check |
| `/api/blog/posts/[id]` | DELETE | EDITOR/ADMIN | ⚠️ Needs Check |
| `/api/admin/blog/posts` | GET | EDITOR/ADMIN | ⚠️ Needs Check |
| `/api/admin/blog/categories` | GET/POST | EDITOR/ADMIN | ⚠️ Needs Check |
| `/api/admin/blog/tags` | GET/POST | EDITOR/ADMIN | ⚠️ Needs Check |

---

## Client-Side Protection

### Dashboard Pages

| Page | Role Required | Status |
|------|---------------|--------|
| `/dashboard` | Authenticated | ✅ Protected |
| `/dashboard/profile` | Authenticated | ✅ Protected |
| `/dashboard/settings` | Authenticated | ✅ Protected |
| `/dashboard/strategies` | Authenticated | ✅ Protected |
| `/dashboard/blog` | EDITOR/ADMIN | ⚠️ Needs Check |
| `/dashboard/admin/integrations` | ADMIN | ✅ Protected |
| `/dashboard/admin/integrations/mailchimp` | ADMIN | ✅ Protected |
| `/dashboard/admin/integrations/google-analytics` | ADMIN | ✅ Protected |
| `/dashboard/admin/leads` | ADMIN | ✅ Protected |
| `/admin` | ADMIN | ✅ Protected |
| `/admin/users` | ADMIN | ✅ Protected |
| `/admin/strategies` | ADMIN | ✅ Protected |
| `/admin/analytics` | ADMIN | ✅ Protected |
| `/admin/activity` | ADMIN | ✅ Protected |
| `/admin/tracking` | ADMIN | ✅ Protected |
| `/admin/settings` | ADMIN | ✅ Protected |

---

## Recommendations

### Immediate Actions Required:
1. ✅ **Add client-side RBAC to integration pages** - COMPLETE
2. ⚠️ **Add EDITOR role checks to blog API routes** - TODO
3. ⚠️ **Add client-side RBAC to blog dashboard** - TODO
4. ❌ **Implement plan-based feature limits** - TODO
5. ❌ **Add visual indicators for premium features** - TODO

### Future Enhancements:
1. Implement middleware for automatic route protection
2. Add feature flags for gradual rollout
3. Implement usage tracking and quota enforcement
4. Add role-based UI customization
5. Implement team collaboration features

---

## Testing Checklist

- [ ] Test USER role cannot access admin panel
- [ ] Test USER role cannot access integrations
- [ ] Test EDITOR role can access blog management
- [ ] Test EDITOR role cannot access integrations
- [ ] Test ADMIN role can access all features
- [ ] Test unauthenticated users are redirected to sign-in
- [ ] Test API routes return 403 for unauthorized roles
- [ ] Test client-side redirects work correctly

