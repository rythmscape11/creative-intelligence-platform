'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { CsrfProvider } from './csrf-provider';
import { ThemeProvider } from '@/contexts/theme-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [csrfToken, setCsrfToken] = useState('');
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v3)
            retry: (failureCount, error: unknown) => {
              // Don't retry on 4xx errors
              const err = error as { status?: number };
              if (err?.status && err.status >= 400 && err.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  // Fetch CSRF token on mount
  useEffect(() => {
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token))
      .catch(err => console.error('Failed to fetch CSRF token:', err));
  }, []);

  return (
    <ThemeProvider>
      <ClerkProvider
        appearance={{
          layout: {
            socialButtonsVariant: 'iconButton',
            logoPlacement: 'none',
          },
          variables: {
            colorPrimary: '#F59E0B',
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <CsrfProvider token={csrfToken}>
            {children}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </CsrfProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
