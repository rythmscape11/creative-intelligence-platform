import { redirect } from 'next/navigation';

/**
 * Legacy Enhanced Strategy Builder Page
 * Redirects to the unified strategy builder
 */
export default function CreateEnhancedStrategyPage() {
  // Redirect to the main strategy builder (which is already the enhanced version)
  redirect('/dashboard/strategies/create');
}

