import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignInForm } from '@/app/auth/signin/SignInForm';
import { signIn, getSession } from 'next-auth/react';
import { toast } from '@/components/ui/toaster';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
  getSession: vi.fn(),
  useSession: () => ({ data: null, status: 'unauthenticated' }),
}));

vi.mock('@/components/ui/toaster', () => ({
  toast: vi.fn(),
}));

const mockSignIn = signIn as unknown as vi.Mock;
const mockGetSession = getSession as unknown as vi.Mock;
const mockToast = toast as unknown as vi.Mock;

const originalLocation = window.location;

describe('SignInForm', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockGetSession.mockReset();
    mockToast.mockClear();

    delete (window as any).location;
    (window as any).location = {
      href: 'https://example.com/',
      origin: 'https://example.com',
      assign: vi.fn((url: string) => {
        // Vitest's window.location mock does not update href automatically, so
        // we mirror the browser behavior here for assertions.
        (window as any).location.href = url;
      }),
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('shows an error message when credentials fail', async () => {
    mockSignIn.mockResolvedValue({ ok: false, error: 'Invalid credentials' });

    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email address/i), 'demo@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error', title: 'Sign In Failed' })
      );
    });
  });

  it('redirects to the dashboard after a successful sign-in', async () => {
    mockSignIn.mockResolvedValue({ ok: true, url: '/dashboard' });
    mockGetSession.mockResolvedValue({ user: { role: 'USER' } });

    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email address/i), 'demo@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'super-secret');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'success', title: 'Welcome back!' })
      );
      expect(window.location.assign).toHaveBeenCalledWith('https://example.com/dashboard');
    }, { timeout: 2000 });

    expect(mockSignIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({
        email: 'demo@example.com',
        password: 'super-secret',
        redirect: false,
      })
    );
    expect(mockGetSession).toHaveBeenCalled();
  });
});
