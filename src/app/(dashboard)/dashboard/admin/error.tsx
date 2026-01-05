'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/error-state';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin panel error:', error);
  }, [error]);

  return (
    <ErrorState
      error={error}
      retry={reset}
      title="Admin Panel Error"
      description="An error occurred while loading the admin panel. Please try again."
    />
  );
}

