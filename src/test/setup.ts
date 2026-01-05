/**
 * Vitest Setup File
 * 
 * Global test configuration and mocks
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn().mockResolvedValue(undefined),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: '/',
  query: {},
};

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => routerMock,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const useSessionMock = vi.fn(() => ({
  data: null,
  status: 'unauthenticated',
}));
const signOutMock = vi.fn();

vi.mock('next-auth/react', () => ({
  useSession: useSessionMock,
  signIn: vi.fn(),
  signOut: signOutMock,
  SessionProvider: ({ children }) => children,
}));

Object.assign(globalThis, {
  __routerMock: routerMock,
  __useSessionMock: useSessionMock,
  __signOutMock: signOutMock,
});

globalThis.fetch = vi.fn();

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: vi.fn(),
}));

// Mock environment variables
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Cleanup after each test
afterEach(() => {
  cleanup();
  Object.values(routerMock).forEach((fn) => fn?.mockClear && fn.mockClear());
  (globalThis.fetch as ReturnType<typeof vi.fn>).mockClear();
});
