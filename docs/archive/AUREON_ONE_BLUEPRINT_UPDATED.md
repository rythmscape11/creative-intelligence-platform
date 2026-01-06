# Aureon One - Complete Platform Blueprint

## Platform Overview

**Aureon One** is an enterprise-grade marketing intelligence platform comprising 7 core product modules, designed to provide end-to-end marketing operations management.

**Live URL:** https://mediaplanpro.com  
**Last Updated:** December 13, 2024

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Modules** | 7 |
| **Total Pages/Routes** | 50+ |
| **API Endpoints** | 20+ |
| **Development Hours** | ~800+ hours |
| **Platform Status** | Production |

---

## Product Modules

### 1. Agency OS
**Status:** ✅ Production Ready  
**Development Hours:** ~200 hours

| Feature | Status | Workflow |
|---------|--------|----------|
| Dashboard | ✅ Live | View metrics → Drill into projects |
| Clients Management | ✅ Live | Add client → Assign projects → Track status |
| Projects | ✅ Live | Create → Assign team → Track progress |
| Tasks | ✅ Live | Create task → Assign → Track completion |
| Gantt Chart | ✅ Live | View timeline → Adjust dependencies |
| Workload View | ✅ Live | View capacity → Balance assignments |
| Time Tracker | ✅ Live | Start timer → Log hours → Generate reports |
| Campaigns | ✅ Live | Create campaign → Set budget → Track performance |
| Ads Manager | ✅ Live | Connect platforms → Manage ads |
| Content Calendar | ✅ Live | Schedule content → Approve → Publish |
| Assets Library | ✅ Live | Upload → Tag → Search → Use |
| AI Studio | ✅ Live | Generate content → Edit → Export |
| Analytics | ✅ Live | View reports → Export data |
| Automations | ✅ Live | Create rule → Set triggers → Monitor |
| Integrations | ✅ Live | Connect OAuth → Sync data |
| Client Portal | ✅ Live | Share access → Approve assets |
| Settings | ✅ Live | Configure workspace |

**Key APIs:**
- `/api/agency/automations` - CRUD for automation rules
- `/api/agency/portal` - Client portal management
- `/api/agency/workload` - Team capacity
- `/api/agency/integrations` - Third-party integrations

---

### 2. The Optimiser
**Status:** ✅ Production Ready  
**Development Hours:** ~120 hours

| Feature | Status | Workflow |
|---------|--------|----------|
| Dashboard | ✅ Live | View campaign performance metrics |
| Connections | ✅ Live | OAuth connect → Sync accounts |
| Campaigns | ✅ Live | Fetch campaigns → View metrics |
| Copilot | ✅ Live | Ask questions → Get AI insights |
| Creative Intel | ✅ Live | Analyze creatives → Get recommendations |
| Experiments | ✅ Live | Create A/B test → Track results |
| Reports | ✅ Live | Generate → Export PDF |
| Automations | ✅ Live | Set rules → Auto-optimize |
| Settings | ✅ Live | Configure accounts |

**Key APIs:**
- `/api/optimizer/connections` - Platform OAuth connections
- `/api/optimizer/campaigns` - Campaign data with metrics

---

### 3. The Analyser
**Status:** ✅ Production Ready  
**Development Hours:** ~100 hours

| Feature | Status | Workflow |
|---------|--------|----------|
| Dashboard | ✅ Live | Aggregated SEO metrics |
| SEO Audit | ✅ Live | Enter URL → Run audit → View report |
| Keywords | ✅ Live | Research → Analyze → Track |
| Backlinks | ✅ Live | Check profile → Monitor changes |
| SERP Analysis | ✅ Live | Enter keyword → View rankings |
| Domain Analysis | ✅ Live | Analyze competitor domains |
| GEO Engine | ✅ Live | AI brand visibility analysis |

**Key APIs:**
- `/api/analyser/dashboard` - Aggregated metrics
- DataForSEO integration via service layer

---

### 4. The Strategiser
**Status:** ✅ Production Ready  
**Development Hours:** ~150 hours

| Feature | Status | Workflow |
|---------|--------|----------|
| Dashboard | ✅ Live | View strategies → Quick actions |
| Create Strategy | ✅ Live | Input business data → AI generates strategy |
| Strategies List | ✅ Live | Browse → Filter → Open |
| Channel Mix | ✅ Live | View allocation → Adjust budgets |
| Personas | ✅ Live | Generate → Edit → Use in strategy |
| Insights | ✅ Live | AI-powered recommendations |
| Reports | ✅ Live | Export PDF/PPTX |
| Templates | ✅ Live | Use preset → Customize |
| Copilot | ✅ Live | Ask strategic questions |
| Settings | ✅ Live | Configure defaults |

**Key APIs:**
- `/api/strategiser/templates` - Strategy templates CRUD
- Export service for PDF/PPTX generation

---

### 5. Aureon Forge
**Status:** ✅ Production Ready  
**Development Hours:** ~130 hours

| Feature | Status | Workflow |
|---------|--------|----------|
| Overview | ✅ Live | View Sparks usage → Recent flows |
| API Keys | ✅ Live | Generate → Manage → Revoke |
| Flows | ✅ Live | Build visual workflow → Execute |
| Pipelines | ✅ Live | Create reusable pipelines |
| Brand Kits | ✅ Live | Upload assets → Train LoRA |
| Logs | ✅ Live | View execution history |

**Key APIs:**
- `/api/forge/brand-kits` - Brand kit management
- `/api/forge/logs` - Usage and execution logs

---

### 6. Growth Suite
**Status:** ⚠️ Coming Soon  
**Development Hours:** ~60 hours (partial)

| Feature | Status | Workflow |
|---------|--------|----------|
| Dashboard | 🔨 In Progress | View growth metrics |
| Attribution | ✅ API Ready | Track UTM → First/last touch |
| Heatmaps | ✅ API Ready | Embed script → View clicks/scrolls |
| Widgets | ✅ API Ready | Configure → Embed → Track |
| Experiments | ✅ API Ready | Create A/B tests → Track |
| Session Recording | 🔨 Coming Soon | Record → Replay |

**Key APIs:**
- `/api/growth-suite/attribution` - UTM tracking
- `/api/growth-suite/heatmaps` - Click/scroll data
- `/api/growth-suite/widgets` - Embeddable widgets
- `/api/growth-suite/experiments` - A/B testing

**Embeddable Scripts:**
- `/widgets/lead-capture.js`
- `/widgets/heatmap-tracker.js`
- `/widgets/cta.js`
- `/widgets/announcement.js`

---

### 7. Admin Dashboard
**Status:** ✅ Production Ready  
**Development Hours:** ~40 hours

| Feature | Status | Workflow |
|---------|--------|----------|
| Admin Hub | ✅ Live | Navigate to admin sections |
| User Management | ✅ Live | View → Edit → Manage roles |
| Billing Dashboard | ✅ Live | View MRR/ARR → Subscriptions |
| API Configuration | ✅ Live | Configure third-party keys |
| Platform Analytics | ✅ Live | View usage metrics |

---

## Technical Architecture

### Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Clerk
- **Payments:** Razorpay
- **Hosting:** Vercel

### Database Models
- 50+ Prisma models
- Key models: User, MarketingStrategy, AutomationRule, BrandKit, OptimizerConnection, Integration

### API Endpoints Created
| Category | Count |
|----------|-------|
| Agency OS | 5 |
| Forge | 2 |
| Strategiser | 1 |
| Growth Suite | 4 |
| Analyser | 1 |
| Optimizer | 2 |
| OAuth | 2 |
| Cron | 1 |
| **Total** | **18+** |

---

## Development Hours Summary

| Module | Hours | Status |
|--------|-------|--------|
| Agency OS | 200 | ✅ Complete |
| The Optimiser | 120 | ✅ Complete |
| The Analyser | 100 | ✅ Complete |
| The Strategiser | 150 | ✅ Complete |
| Aureon Forge | 130 | ✅ Complete |
| Growth Suite | 60 | ⚠️ Partial |
| Admin Dashboard | 40 | ✅ Complete |
| **Total** | **~800** | **95%** |

---

## Monetization

### Subscription Tiers
| Tier | Monthly | Features |
|------|---------|----------|
| Free | ₹0 | Basic features, watermarks |
| Starter | ₹2,499 | All modules, 100 Sparks |
| Pro | ₹4,999 | Unlimited, 500 Sparks |
| Enterprise | Custom | White-label, API access |

### Sparks (Usage Credits)
- Forge operations consume Sparks
- Auto-renew monthly
- Top-up available

---

## Workflows by Module

### Agency OS Workflow
```
1. Create Client → Assign to Workspace
2. Create Project → Set Timeline
3. Add Tasks → Assign Team Members
4. Track Progress via Gantt/Workload
5. Generate Reports → Approve via Portal
```

### Strategiser Workflow
```
1. Input Business Details
2. AI Generates Strategy
3. Review Channel Mix
4. Adjust Personas
5. Export PDF/PPTX
```

### Forge Workflow
```
1. Create Flow → Add Nodes
2. Configure Triggers
3. Execute Pipeline
4. Review Logs
5. Consume Sparks
```

### Growth Suite Workflow
```
1. Embed Tracking Script
2. Capture Events (clicks, scrolls)
3. Track Attribution (UTM)
4. View Heatmaps
5. A/B Test Widgets
```

---

## Contact

**Platform:** Aureon One  
**URL:** https://mediaplanpro.com  
**Support:** support@mediaplanpro.com

---

*Document generated: December 13, 2024*
