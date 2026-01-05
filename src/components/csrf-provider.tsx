'use client';

import { createContext, useContext, ReactNode } from 'react';

interface CsrfContextType {
  token: string;
  isLoaded: boolean;
}

const CsrfContext = createContext<CsrfContextType | undefined>(undefined);

export function CsrfProvider({
  children,
  token
}: {
  children: ReactNode;
  token: string;
}) {
  const isLoaded = token !== '';

  return (
    <CsrfContext.Provider value={{ token, isLoaded }}>
      {children}
    </CsrfContext.Provider>
  );
}

export function useCsrf() {
  const context = useContext(CsrfContext);
  if (context === undefined) {
    throw new Error('useCsrf must be used within a CsrfProvider');
  }
  return context;
}

/**
 * Hook to get CSRF headers for fetch requests
 */
export function useCsrfHeaders() {
  const { token } = useCsrf();

  return {
    'X-CSRF-Token': token,
  };
}

/**
 * Hook to get CSRF token for form submissions
 */
export function useCsrfToken() {
  const { token } = useCsrf();
  return token;
}

/**
 * Hook to check if CSRF token is loaded
 */
export function useCsrfLoaded() {
  const { isLoaded } = useCsrf();
  return isLoaded;
}

