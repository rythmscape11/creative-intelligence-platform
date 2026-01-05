# v1 Release Plan & Audit Findings

## Current State Audit

### 1. The Strategiser (Status: 95% Ready)
- **UI**: `/dashboard/strategies` exists and is functional.
- **Backend**: `EnhancedStrategyGenerator` with OpenAI/Static fallback.
- **Missing**: Final verification of export features and rate limiting.

### 2. The Analyser (Status: 80% Ready)
- **UI**: `/dashboard/competition` exists.
- **Backend**: `/api/competition/analyze-edge` implementation needs strict verification of "realness" vs mock.
- **Action**: Verify pipeline integrity.

### 3. Agency OS (Status: 40% Ready)
- **UI**: Landing page `/dashboard/agency-os` exists.
- **Missing Routes**:
  - `/dashboard/agency-branding` (Critical)
  - `/dashboard/client-workspaces` (Critical)
- **Backend**: Team management exists (`/dashboard/team`), but workspace logic is missing.

### 4. GEO Engine (Status: Backend Only)
- **Backend**: `seo-service.ts` exists.
- **UI**: No dedicated dashboard found.
- **Action**: Set to **COMING_SOON** to avoid broken promises.

### 5. The Optimiser (Status: Mismatch)
- **UI**: `/dashboard/marketing` exists but is an **Email Marketing** tool (Mailchimp).
- **Promise**: Sales page promises "Paid Media Optimization".
- **Action**: Set to **COMING_SOON** or **HIDDEN** to avoid misleading users.

---

## Execution Plan: The 6 Phases

### Phase 1: Global Feature Visibility System (CRITICAL)
- **Goal**: Safely hide incomplete features without code deletion.
- **Tech**: Admin Settings DB-backed flags.
- **Components**:
  - `FeatureGuard` component.
  - `useFeature` hook.
  - Admin Panel Toggles.

### Phase 2: The Strategiser (Release Candidate)
- **Goal**: Polish to perfection.
- **Tasks**:
  - Verify all CRUD operations.
  - Test PDF/Markdown export.

### Phase 3: The Analyser (Release Candidate)
- **Goal**: Ensure valuable output.
- **Tasks**:
  - Confirm API robustness.
  - Polish Results UI.

### Phase 4: Agency OS (The Big Build)
- **Goal**: Build missing core features.
- **Tasks**:
  - Build `AgencyBranding` page (Logo, Colors).
  - Build `ClientWorkspaces` (CRUD, Lists).
  - Connect "Getting Started" checklist.

### Phase 5: Safety Nets
- **Goal**: Handle GEO and Optimiser.
- **Tasks**:
  - Hide/Gate routes.
  - Add "Join Waitlist" UI for Coming Soon pages.

### Phase 6: QA & Launch
- **Goal**: Zero broken links.
- **Tasks**:
  - End-to-end user journey test.
  - Final consistency check.
