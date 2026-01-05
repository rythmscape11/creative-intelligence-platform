'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/services/logger-service';
import { ErrorState } from '@/components/ui/error-state';

/**
 * Global Error Component
 *
 * This catches errors in the root layout.
 * Note: This file must be placed in the app directory.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Global Error (Root)', error, { digest: error.digest });
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="bg-card rounded-xl shadow-xl p-8 max-w-lg w-full">
            <ErrorState
              error={error}
              retry={reset}
              title="Critical Error"
              description="We encountered a critical error. Please try refreshing the page."
            />
          </div>
        </div>
      </body>
    </html>
  );
}

