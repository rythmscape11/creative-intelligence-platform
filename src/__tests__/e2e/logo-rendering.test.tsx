/* eslint-disable @next/next/no-img-element */
/**
 * Logo Rendering E2E Tests
 * 
 * Comprehensive tests to verify premium logo rendering across all pages
 * including Header, Footer, and Dashboard components.
 */

import type React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useUser } from '@clerk/nextjs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

type MockImageProps = React.ComponentProps<'img'> & {
  priority?: boolean;
};

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, priority, className, ...props }: MockImageProps) => (
    <img
      src={src}
      alt={alt ?? ''}
      width={width}
      height={height}
      data-priority={priority}
      className={className}
      data-testid={(props as { 'data-testid'?: string })['data-testid'] ?? 'logo-image'}
      {...props}
    />
  ),
}));

describe('Logo Rendering E2E Tests', () => {
  const mockUseSession = vi.mocked(useSession);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Header Logo', () => {
    it('should render premium icon logo with correct dimensions', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<Header />);

      const logoImage = screen.getByTestId('header-logo');
      expect(logoImage).toBeInTheDocument();
      expect(screen.getAllByTestId('header-logo')).toHaveLength(1);
      expect(logoImage).toHaveAttribute('src', '/images/logos/mediaplanpro-premium-icon-64.png');
      expect(logoImage).toHaveAttribute('width', '48');
      expect(logoImage).toHaveAttribute('height', '48');
      expect(logoImage).toHaveAttribute('alt', 'MediaPlanPro Logo');
    });

    it('should have priority loading for header logo', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<Header />);

      const logoImage = screen.getByTestId('header-logo');
      expect(logoImage).toHaveAttribute('data-priority', 'true');
    });

    it('should render MediaPlanPro text alongside logo', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<Header />);

      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();
      expect(screen.getAllByTestId('header-logo')).toHaveLength(1);
      expect(screen.getByTestId('header-logo')).toBeInTheDocument();
      expect(screen.getByText('MediaPlanPro')).toBeInTheDocument();
    });

    it('should have proper styling classes for logo container', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<Header />);

      const logoImage = screen.getByTestId('header-logo');
      expect(logoImage).toHaveClass('object-contain');
    });

    it('should render logo for authenticated users', () => {
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

      render(<Header />);

      const logoImage = screen.getByTestId('header-logo');
      expect(logoImage).toBeInTheDocument();
      expect(screen.getAllByTestId('header-logo')).toHaveLength(1);
      expect(logoImage).toHaveAttribute('src', '/images/logos/mediaplanpro-premium-icon-64.png');
    });
  });

  describe('Footer Logo', () => {
    it('should render premium icon logo with correct dimensions', () => {
      render(<Footer />);

      const logoImage = screen.getByTestId('footer-logo');
      expect(logoImage).toBeInTheDocument();
      expect(screen.getAllByTestId('footer-logo')).toHaveLength(1);
      expect(logoImage).toHaveAttribute('src', '/images/logos/mediaplanpro-premium-icon-64.png');
      expect(logoImage).toHaveAttribute('width', '40');
      expect(logoImage).toHaveAttribute('height', '40');
      expect(logoImage).toHaveAttribute('alt', 'MediaPlanPro Logo');
    });

    it('should render MediaPlanPro text in footer', () => {
      render(<Footer />);

      const logoTexts = screen.getAllByText('MediaPlanPro');
      expect(screen.getAllByTestId('footer-logo')).toHaveLength(1);
      expect(logoTexts.length).toBeGreaterThan(0);
    });

    it('should have proper styling for footer logo', () => {
      render(<Footer />);

      const logoImage = screen.getByTestId('footer-logo');
      expect(logoImage).toHaveClass('object-contain');
    });

    it('should render copyright text with current year', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${currentYear}.*MediaPlanPro`))).toBeInTheDocument();
    });
  });

  describe('Dashboard Header Logo', () => {
    it('should render premium icon logo for authenticated users', () => {
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

      render(<DashboardHeader />);

      const logoImage = screen.getByTestId('dashboard-header-logo');
      expect(logoImage).toBeInTheDocument();
      expect(screen.getAllByTestId('dashboard-header-logo')).toHaveLength(1);
      expect(logoImage).toHaveAttribute('src', '/images/logos/mediaplanpro-premium-icon-64.png');
      expect(logoImage).toHaveAttribute('width', '40');
      expect(logoImage).toHaveAttribute('height', '40');
    });

    it('should have priority loading for dashboard logo', () => {
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

      render(<DashboardHeader />);

      const logoImage = screen.getByTestId('dashboard-header-logo');
      expect(logoImage).toHaveAttribute('data-priority', 'true');
    });

    it('should render for ADMIN users', () => {
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

      render(<DashboardHeader />);

      const logoImage = screen.getByTestId('dashboard-header-logo');
      expect(logoImage).toBeInTheDocument();
      expect(screen.getAllByTestId('dashboard-header-logo')).toHaveLength(1);
    });

    it('should render for EDITOR users', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: 'editor-1',
            email: 'editor@test.com',
            name: 'Editor User',
            role: 'EDITOR',
          },
        },
        status: 'authenticated',
      });

      render(<DashboardHeader />);

      const logoImage = screen.getByTestId('dashboard-header-logo');
      expect(logoImage).toBeInTheDocument();
      expect(screen.getAllByTestId('dashboard-header-logo')).toHaveLength(1);
    });
  });

  describe('Logo Consistency', () => {
    it('should use the same premium icon across all components', () => {
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

      const { unmount: unmountHeader } = render(<Header />);
      const headerLogo = screen.getByTestId('header-logo');
      const headerSrc = headerLogo.getAttribute('src');
      unmountHeader();

      const { unmount: unmountFooter } = render(<Footer />);
      const footerLogo = screen.getByTestId('footer-logo');
      const footerSrc = footerLogo.getAttribute('src');
      unmountFooter();

      const { unmount: unmountDashboard } = render(<DashboardHeader />);
      const dashboardLogo = screen.getByTestId('dashboard-header-logo');
      const dashboardSrc = dashboardLogo.getAttribute('src');
      unmountDashboard();

      // All should use the same premium icon
      expect(headerSrc).toBe('/images/logos/mediaplanpro-premium-icon-64.png');
      expect(footerSrc).toBe('/images/logos/mediaplanpro-premium-icon-64.png');
      expect(dashboardSrc).toBe('/images/logos/mediaplanpro-premium-icon-64.png');
    });

    it('should have consistent alt text across components', () => {
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

      const { unmount: unmountHeader } = render(<Header />);
      const headerLogo = screen.getByTestId('header-logo');
      expect(headerLogo).toHaveAttribute('alt', 'MediaPlanPro Logo');
      unmountHeader();

      const { unmount: unmountFooter } = render(<Footer />);
      const footerLogo = screen.getByTestId('footer-logo');
      expect(footerLogo).toHaveAttribute('alt', 'MediaPlanPro Logo');
      unmountFooter();

      const { unmount: unmountDashboard } = render(<DashboardHeader />);
      const dashboardLogo = screen.getByTestId('dashboard-header-logo');
      expect(dashboardLogo).toHaveAttribute('alt', 'MediaPlanPro Logo');
      unmountDashboard();
    });
  });

  describe('Logo Accessibility', () => {
    it('should have proper alt text for screen readers', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(<Header />);

      const logoImage = screen.getByAltText('MediaPlanPro Logo');
      expect(logoImage).toBeInTheDocument();
    });

    it('should be keyboard accessible via parent link', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      const { container } = render(<Header />);

      const logoLink = container.querySelector('a[href="/"]');
      expect(logoLink).toBeInTheDocument();
    });
  });
});
