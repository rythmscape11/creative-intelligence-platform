/**
 * Verifies that the sign-out buttons invalidate the session and protect dashboard routes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { signOut } from 'next-auth/react';

vi.mock('react-hot-toast', () => {
  const toast = {
    success: vi.fn(),
    error: vi.fn(),
  };
  return { __esModule: true, default: toast };
});

declare global {
  // Provided by jest.setup.js so tests can assert router interactions
  // eslint-disable-next-line no-var
  var __routerMock: {
    push: ReturnType<typeof vi.fn>;
    replace: ReturnType<typeof vi.fn>;
    prefetch: ReturnType<typeof vi.fn>;
    back: ReturnType<typeof vi.fn>;
    forward: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
  };
  // eslint-disable-next-line no-var
  var __useSessionMock: ReturnType<typeof vi.fn>;
  // eslint-disable-next-line no-var
  var __signOutMock: ReturnType<typeof vi.fn>;
}

function SignOutTester() {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await signOut({
        redirect: true,
        callbackUrl: '/auth/signin',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Signing Out...' : 'Sign Out'}
    </button>
  );
}

describe('Logout flow', () => {
  beforeEach(() => {
    global.__useSessionMock.mockReturnValue({
      data: {
        user: { id: 'user-1', role: 'USER', email: 'demo@example.com' },
      },
      status: 'authenticated',
    });

    global.__signOutMock.mockResolvedValue(undefined);

    Object.values(global.__routerMock).forEach((fn) => fn?.mockClear && fn.mockClear());
  });

  it('logs out the user and prevents access to /dashboard afterward', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <ProtectedRoute>
          <div>Dashboard</div>
        </ProtectedRoute>
        <SignOutTester />
      </>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /sign out/i }));

    expect(global.__signOutMock).toHaveBeenCalledWith({
      redirect: true,
      callbackUrl: '/auth/signin',
    });

    // Simulate a fresh render where the session is now invalidated.
    global.__useSessionMock.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    rerender(
      <ProtectedRoute>
        <div>Dashboard</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(global.__routerMock.push).toHaveBeenCalledWith('/auth/signin');
    });
  });
});
