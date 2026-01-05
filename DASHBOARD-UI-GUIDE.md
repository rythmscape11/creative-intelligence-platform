# Aureon One Dashboard UI Guide

## Overview

This document describes the unified dashboard design system for Aureon One's logged-in experience. All module pages (Agency OS, The Optimiser, The Analyser, GEO Engine, The Strategiser) follow this consistent design language.

---

## Layout Structure

### Page Shell
Every dashboard page uses a consistent layout:
- **Sidebar** (left): 260px expanded, 72px collapsed
- **Header** (top): 64px height with search and user menu
- **Content area** (center): Scrollable main content

```
┌─────────┬────────────────────────────────────────┐
│         │  Header (title, search, notifications) │
│Sidebar  ├────────────────────────────────────────┤
│         │                                        │
│(collap- │          Page Content                  │
│ sible)  │                                        │
│         │                                        │
└─────────┴────────────────────────────────────────┘
```

---

## Theme & Colors

| Token | Value | Usage |
|-------|-------|-------|
| `bgApp` | `#050709` | Main background |
| `bgSidebar` | `#050709` | Sidebar background |
| `bgHeader` | `#0B0C10` | Header background |
| `bgCard` | `#111827` | Card/panel backgrounds |
| `bgCardHover` | `#1F2933` | Card hover state |
| `textPrimary` | `#FFFFFF` | Main text |
| `textSecondary` | `#9CA3AF` | Secondary text |
| `textTertiary` | `#6B7280` | Labels, hints |
| `aureonGold` | `#F1C40F` | Accent highlights |
| `marsRed` | `#B3001B` | Primary actions |
| `borderDefault` | `#1F2937` | Default borders |
| `success` | `#10B981` | Success states |
| `warning` | `#F59E0B` | Warning states |
| `error` | `#EF4444` | Error states |

---

## Components

### `DashboardLayout`
Main wrapper component. Import and use in page layouts.

```tsx
import { DashboardLayout } from '@/components/dashboard';

export default function MyPage() {
  return (
    <DashboardLayout title="Page Title" breadcrumb="Module / Section">
      {/* Page content */}
    </DashboardLayout>
  );
}
```

### `StatCard`
Display KPIs with optional trend indicators.

```tsx
import { StatCard } from '@/components/dashboard';

<StatCard
  title="Active Clients"
  value="24"
  change={{ value: 12, label: 'vs last week' }}
  icon={Users}
/>
```

### `DashboardCard`
Generic card for content sections.

```tsx
import { DashboardCard } from '@/components/dashboard';

<DashboardCard
  title="Recent Activity"
  subtitle="Last 7 days"
  action={<Button>View all</Button>}
>
  {/* Content */}
</DashboardCard>
```

### `TabBar`
Module-level tab navigation.

```tsx
import { TabBar } from '@/components/dashboard';

<TabBar
  tabs={[
    { name: 'Overview', href: '/module' },
    { name: 'Projects', href: '/module/projects' },
    { name: 'Tasks', href: '/module/tasks', count: 5 },
  ]}
  activeTab="/module/projects"
/>
```

### `StatusBadge` / `StatusChip`
Status indicators with auto-coloring.

```tsx
import { StatusBadge, StatusChip } from '@/components/dashboard';

<StatusBadge variant="success">Active</StatusBadge>
<StatusChip status="In Progress" />  // Auto-colors based on status text
```

---

## Adding New Pages

1. Create page file: `src/app/[module]/[page]/page.tsx`

2. The layout is inherited from the module's `layout.tsx`

3. Use dashboard components for consistency:

```tsx
import { DashboardCard, StatCard, StatusChip } from '@/components/dashboard';

export default function NewPage() {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Metric 1" value="123" />
        <StatCard title="Metric 2" value="456" />
      </div>
      
      {/* Content Card */}
      <DashboardCard title="Section Title">
        <p className="text-gray-400">Content here...</p>
      </DashboardCard>
    </div>
  );
}
```

---

## File Structure

```
src/components/dashboard/
├── index.ts              # Exports all components
├── DashboardLayout.tsx   # Main layout wrapper
├── DashboardSidebar.tsx  # Navigation sidebar
├── DashboardHeader.tsx   # Top header bar
├── StatCard.tsx          # KPI cards
├── DashboardCard.tsx     # Content panels
├── TabBar.tsx            # Tab navigation
└── StatusBadge.tsx       # Status indicators

src/lib/
└── dashboard-theme.ts    # Theme tokens
```

---

## Responsive Behavior

- **Desktop** (1024px+): Full sidebar visible, collapsible
- **Tablet** (768-1023px): Sidebar collapsed by default
- **Mobile** (<768px): Sidebar as overlay drawer

---

## Do's and Don'ts

✅ **Do:**
- Use `#050709` for app background
- Use `#111827` for card backgrounds
- Use Mars Red (`#B3001B`) for primary actions
- Use Aureon Gold (`#F1C40F`) sparingly for accents
- Keep layouts airy with 16-24px spacing

❌ **Don't:**
- Use large gold or red backgrounds
- Use "MediaPlanPro" anywhere
- Mix old light theme styles with new dark theme
- Forget to use the unified sidebar navigation
