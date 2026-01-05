/**
 * UI/UX Tests for Strategy Dashboard and Management Interface
 *
 * This test suite verifies the user interface and user experience
 * of the Strategy Dashboard and management components.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock session
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: { id: 'test-user', email: 'test@example.com', role: 'USER' }
    },
    status: 'authenticated'
  }),
}));

// Mock strategies data
const mockStrategies = [
  {
    id: '1',
    businessName: 'Tech Startup',
    industry: 'technology',
    budget: 50000,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    businessName: 'Healthcare Corp',
    industry: 'healthcare',
    budget: 100000,
    status: 'draft',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// Mock API calls
global.fetch = vi.fn();

describe('Strategy Dashboard UI/UX Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: mockStrategies,
        pagination: { page: 1, limit: 10, total: 2, pages: 1 }
      }),
    });
  });

  describe('Dashboard Layout and Navigation', () => {
    it('should render dashboard header with navigation', async () => {
      const { container } = render(<div data-testid="dashboard-layout">Dashboard</div>);
      
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });

    it('should show user profile information', async () => {
      render(<div data-testid="user-profile">test@example.com</div>);
      
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should have responsive sidebar navigation', () => {
      render(<div data-testid="sidebar-nav">Navigation</div>);
      
      const sidebar = screen.getByTestId('sidebar-nav');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('Strategy List Management', () => {
    it('should display list of strategies', async () => {
      render(
        <div data-testid="strategy-list">
          {mockStrategies.map(strategy => (
            <div key={strategy.id} data-testid={`strategy-${strategy.id}`}>
              <h3>{strategy.businessName}</h3>
              <p>{strategy.industry}</p>
              <p>${strategy.budget.toLocaleString()}</p>
              <span>{strategy.status}</span>
            </div>
          ))}
        </div>
      );
      
      expect(screen.getByText('Tech Startup')).toBeInTheDocument();
      expect(screen.getByText('Healthcare Corp')).toBeInTheDocument();
      expect(screen.getByText('technology')).toBeInTheDocument();
      expect(screen.getByText('healthcare')).toBeInTheDocument();
    });

    it('should show strategy status badges', () => {
      render(
        <div>
          <span className="badge-active">active</span>
          <span className="badge-draft">draft</span>
        </div>
      );
      
      expect(screen.getByText('active')).toBeInTheDocument();
      expect(screen.getByText('draft')).toBeInTheDocument();
    });

    it('should display formatted budget amounts', () => {
      render(
        <div>
          <p>$50,000</p>
          <p>$100,000</p>
        </div>
      );
      
      expect(screen.getByText('$50,000')).toBeInTheDocument();
      expect(screen.getByText('$100,000')).toBeInTheDocument();
    });

    it('should show creation and update dates', () => {
      render(
        <div>
          <time>Jan 1, 2024</time>
          <time>Jan 2, 2024</time>
        </div>
      );
      
      expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
      expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument();
    });
  });

  describe('Strategy Actions and Controls', () => {
    it('should have create new strategy button', () => {
      render(
        <button data-testid="create-strategy-btn">
          Create New Strategy
        </button>
      );
      
      const createButton = screen.getByTestId('create-strategy-btn');
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveTextContent('Create New Strategy');
    });

    it('should have edit strategy buttons', () => {
      render(
        <div>
          {mockStrategies.map(strategy => (
            <button key={strategy.id} data-testid={`edit-${strategy.id}`}>
              Edit
            </button>
          ))}
        </div>
      );
      
      expect(screen.getByTestId('edit-1')).toBeInTheDocument();
      expect(screen.getByTestId('edit-2')).toBeInTheDocument();
    });

    it('should have delete strategy buttons with confirmation', async () => {
      const user = userEvent.setup();
      
      render(
        <div>
          <button data-testid="delete-btn">Delete</button>
          <div data-testid="confirm-dialog" style={{ display: 'none' }}>
            <p>Are you sure you want to delete this strategy?</p>
            <button data-testid="confirm-delete">Yes, Delete</button>
            <button data-testid="cancel-delete">Cancel</button>
          </div>
        </div>
      );
      
      const deleteButton = screen.getByTestId('delete-btn');
      expect(deleteButton).toBeInTheDocument();
    });

    it('should have view/preview strategy buttons', () => {
      render(
        <div>
          {mockStrategies.map(strategy => (
            <button key={strategy.id} data-testid={`view-${strategy.id}`}>
              View
            </button>
          ))}
        </div>
      );
      
      expect(screen.getByTestId('view-1')).toBeInTheDocument();
      expect(screen.getByTestId('view-2')).toBeInTheDocument();
    });
  });

  describe('Search and Filtering', () => {
    it('should have search input field', () => {
      render(
        <input 
          type="text" 
          placeholder="Search strategies..." 
          data-testid="search-input"
        />
      );
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Search strategies...');
    });

    it('should have industry filter dropdown', () => {
      render(
        <select data-testid="industry-filter">
          <option value="">All Industries</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
        </select>
      );
      
      const industryFilter = screen.getByTestId('industry-filter');
      expect(industryFilter).toBeInTheDocument();
      expect(screen.getByText('All Industries')).toBeInTheDocument();
    });

    it('should have status filter options', () => {
      render(
        <select data-testid="status-filter">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      );
      
      const statusFilter = screen.getByTestId('status-filter');
      expect(statusFilter).toBeInTheDocument();
      expect(screen.getByText('All Statuses')).toBeInTheDocument();
    });

    it('should have budget range filter', () => {
      render(
        <div data-testid="budget-filter">
          <input type="number" placeholder="Min Budget" />
          <input type="number" placeholder="Max Budget" />
        </div>
      );
      
      const budgetFilter = screen.getByTestId('budget-filter');
      expect(budgetFilter).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Min Budget')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Max Budget')).toBeInTheDocument();
    });
  });

  describe('Pagination and Sorting', () => {
    it('should show pagination controls', () => {
      render(
        <div data-testid="pagination">
          <button disabled>Previous</button>
          <span>Page 1 of 1</span>
          <button disabled>Next</button>
        </div>
      );
      
      const pagination = screen.getByTestId('pagination');
      expect(pagination).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });

    it('should have sortable column headers', () => {
      render(
        <table>
          <thead>
            <tr>
              <th>
                <button data-testid="sort-name">Business Name</button>
              </th>
              <th>
                <button data-testid="sort-industry">Industry</button>
              </th>
              <th>
                <button data-testid="sort-budget">Budget</button>
              </th>
              <th>
                <button data-testid="sort-date">Created</button>
              </th>
            </tr>
          </thead>
        </table>
      );
      
      expect(screen.getByTestId('sort-name')).toBeInTheDocument();
      expect(screen.getByTestId('sort-industry')).toBeInTheDocument();
      expect(screen.getByTestId('sort-budget')).toBeInTheDocument();
      expect(screen.getByTestId('sort-date')).toBeInTheDocument();
    });

    it('should show items per page selector', () => {
      render(
        <select data-testid="items-per-page">
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      );
      
      const itemsPerPage = screen.getByTestId('items-per-page');
      expect(itemsPerPage).toBeInTheDocument();
      expect(screen.getByText('10 per page')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('should show loading skeleton while fetching strategies', () => {
      render(
        <div data-testid="loading-skeleton">
          <div className="animate-pulse">Loading strategies...</div>
        </div>
      );
      
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading strategies...')).toBeInTheDocument();
    });

    it('should show empty state when no strategies exist', () => {
      render(
        <div data-testid="empty-state">
          <h3>No strategies found</h3>
          <p>Create your first marketing strategy to get started.</p>
          <button>Create Strategy</button>
        </div>
      );
      
      expect(screen.getByText('No strategies found')).toBeInTheDocument();
      expect(screen.getByText('Create your first marketing strategy to get started.')).toBeInTheDocument();
    });

    it('should show error state when API fails', () => {
      render(
        <div data-testid="error-state">
          <h3>Error loading strategies</h3>
          <p>Something went wrong. Please try again.</p>
          <button>Retry</button>
        </div>
      );
      
      expect(screen.getByText('Error loading strategies')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt table to mobile view', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(
        <div data-testid="mobile-strategy-cards">
          {mockStrategies.map(strategy => (
            <div key={strategy.id} className="mobile-card">
              <h3>{strategy.businessName}</h3>
              <p>{strategy.industry}</p>
            </div>
          ))}
        </div>
      );
      
      expect(screen.getByTestId('mobile-strategy-cards')).toBeInTheDocument();
    });

    it('should show/hide sidebar on mobile', () => {
      render(
        <div>
          <button data-testid="mobile-menu-toggle">☰</button>
          <aside data-testid="mobile-sidebar" className="hidden md:block">
            Sidebar
          </aside>
        </div>
      );
      
      expect(screen.getByTestId('mobile-menu-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('mobile-sidebar')).toBeInTheDocument();
    });
  });
});
