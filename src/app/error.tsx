'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/services/logger-service';
import { ErrorState } from '@/components/ui/error-state';

/**
 * Global Error Component
 *
 * This is a Next.js 14 App Router error boundary that catches errors
 * in the root layout and all child components.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to monitoring service (automatically sends to Sentry in production)
    logger.error('Global Error', error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-lavender-50 to-pink-50 p-4">
      <div className="glass-card rounded-2xl p-8 shadow-xl max-w-2xl w-full bg-white/80 dark:bg-bg-primary/80 backdrop-blur-md">
        <ErrorState
          error={error}
          retry={reset}
          title="Oops! Something went wrong"
          description="We encountered an unexpected error. Don't worry, our team has been notified and we're working on it."
        />
      </div>
    </div>
  );
}

