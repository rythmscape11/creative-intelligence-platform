// This is a Server Component (async data fetching)

import { ProtectedRoute } from '@/components/auth/protected-route';
import DashboardLayoutShell from '@/components/layout/dashboard-layout-shell';
import { getFeatureFlags, DEFAULT_FEATURE_FLAGS } from '@/lib/features';
import { FeatureProvider } from '@/context/feature-context';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Safely fetch feature flags with fallback to defaults
  let flags = DEFAULT_FEATURE_FLAGS;
  try {
    flags = await getFeatureFlags();
  } catch (error) {
    console.error('[Dashboard Layout] Failed to fetch feature flags:', error);
    // Continue with default flags
  }

  return (
    <ProtectedRoute>
      <FeatureProvider flags={flags}>
        <DashboardLayoutShell>
          {children}
        </DashboardLayoutShell>
      </FeatureProvider>
    </ProtectedRoute>
  );
}
