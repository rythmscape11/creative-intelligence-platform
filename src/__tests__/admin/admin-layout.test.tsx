/**
 * Admin Layout Tests
 * 
 * Tests the admin layout component including navigation,
 * RBAC enforcement, and user interface elements.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import AdminLayout from '@/app/(admin)/admin/layout';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

describe('AdminLayout', () => {
  const mockPush = vi.fn();
  const mockUseRouter = useRouter as unknown as Mock;
  const mockUseSession = useSession as unknown as Mock;
  const mockUsePathname = usePathname as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush });
    mockUsePathname.mockReturnValue('/admin');
  });

  it('should show loading state while session is loading', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    expect(screen.getByText('Loading admin panel...')).toBeInTheDocument();
  });

  it('should redirect to signin when user is not authenticated', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/signin?callbackUrl=/admin');
    });
  });

  it('should redirect to unauthorized when user is not ADMIN', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          email: 'user@test.com',
          name: 'Test User',
          role: 'USER',
        },
      },
      status: 'authenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/unauthorized?message=Admin access required');
    });
  });

  it('should redirect EDITOR to unauthorized', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'editor-1',
          email: 'editor@test.com',
          name: 'Test Editor',
          role: 'EDITOR',
        },
      },
      status: 'authenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/unauthorized?message=Admin access required');
    });
  });

  it('should render admin layout for ADMIN users', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  it('should display user information in header', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Administrator')).toBeInTheDocument();
    });
  });

  it('should render all navigation tabs', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  it('should highlight active tab based on pathname', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    });

    mockUsePathname.mockReturnValue('/admin/users');

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      const usersTab = screen.getByRole('link', { name: 'Users' });
      expect(usersTab).toHaveClass('border-amber-500');
    });
  });

  it('should render back to dashboard link', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      const backLink = screen.getByText('Back to Dashboard');
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/dashboard');
    });
  });

  it('should render footer with copyright and links', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: 'admin-1',
          email: 'admin@test.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      },
      status: 'authenticated',
    });

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(screen.getByText(/MediaPlanPro. All rights reserved/)).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();
      expect(screen.getByText('Documentation')).toBeInTheDocument();
    });
  });
});
