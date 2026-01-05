/**
 * UI/UX Tests for Strategy Builder Components
 *
 * This test suite verifies the user interface and user experience
 * of the Strategy Builder Engine components.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrategyBuilder } from '@/components/strategy/strategy-builder';
import { BusinessInfoStep } from '@/components/strategy/business-info-step';
import { AudienceBudgetStep } from '@/components/strategy/audience-budget-step';
import { ObjectivesTimeframeStep } from '@/components/strategy/objectives-timeframe-step';
import { ChallengesContextStep } from '@/components/strategy/challenges-context-step';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock toaster
vi.mock('@/components/ui/toaster', () => ({
  toast: vi.fn(),
}));

// Mock API calls
global.fetch = vi.fn();

describe('Strategy Builder UI/UX Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: { id: 'test-strategy-id' }
      }),
    });
  });

  describe('Multi-Step Form Navigation', () => {
    it('should render the initial business info step', () => {
      render(<StrategyBuilder />);
      
      expect(screen.getByText('Business Information')).toBeInTheDocument();
      expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    });

    it('should navigate to next step when business info is valid', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);
      
      // Fill in business info
      await user.type(screen.getByLabelText(/business name/i), 'Test Company');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      
      // Click next button
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      // Should show audience & budget step
      await waitFor(() => {
        expect(screen.getByText('Target Audience & Budget')).toBeInTheDocument();
      });
    });

    it('should show validation errors for invalid business info', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);
      
      // Try to proceed without filling required fields
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/business name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should allow navigation back to previous steps', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);
      
      // Fill business info and go to next step
      await user.type(screen.getByLabelText(/business name/i), 'Test Company');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      // Should be on audience & budget step
      await waitFor(() => {
        expect(screen.getByText('Target Audience & Budget')).toBeInTheDocument();
      });
      
      // Click back button
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);
      
      // Should be back on business info step
      await waitFor(() => {
        expect(screen.getByText('Business Information')).toBeInTheDocument();
      });
    });

    it('should show progress indicator', () => {
      render(<StrategyBuilder />);

      // Should show step indicators (dots)
      const progressDots = document.querySelectorAll('.w-3.h-3.rounded-full');
      expect(progressDots).toHaveLength(4);

      // First dot should be active (primary color)
      expect(progressDots[0]).toHaveClass('bg-primary-600');
      // Others should be inactive (gray)
      expect(progressDots[1]).toHaveClass('bg-gray-300');
      expect(progressDots[2]).toHaveClass('bg-gray-300');
      expect(progressDots[3]).toHaveClass('bg-gray-300');
    });
  });

  describe('Form Validation and Error Handling', () => {
    it('should validate business name length', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);
      
      // Test too short name
      await user.type(screen.getByLabelText(/business name/i), 'A');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/business name must be at least 2 characters/i)).toBeInTheDocument();
      });
      
      // Test too long name
      await user.clear(screen.getByLabelText(/business name/i));
      await user.type(screen.getByLabelText(/business name/i), 'A'.repeat(101));
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/business name must be less than 100 characters/i)).toBeInTheDocument();
      });
    });

    it('should validate budget range', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);

      // Navigate to audience & budget step
      await user.type(screen.getByLabelText(/business name/i), 'Test Business');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Test budget too low
      const budgetInput = screen.getByLabelText(/budget/i);
      await user.clear(budgetInput);
      await user.type(budgetInput, '500');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/minimum budget is \$1,000/i)).toBeInTheDocument();
      });
      
      // Test budget too high
      await user.clear(budgetInput);
      await user.type(budgetInput, '15000000');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/budget must be less than \$10,000,000/i)).toBeInTheDocument();
      });
    });

    it('should validate objectives selection', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);

      // Navigate to objectives step
      await user.type(screen.getByLabelText(/business name/i), 'Test Business');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await user.type(screen.getByLabelText(/target audience/i), 'Test audience description');
      await user.type(screen.getByLabelText(/budget/i), '5000');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Try to proceed without selecting objectives
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/please select at least one objective/i)).toBeInTheDocument();
      });
    });

    it('should validate text area minimum length', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);

      // Navigate to challenges step
      await user.type(screen.getByLabelText(/business name/i), 'Test Business');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await user.type(screen.getByLabelText(/target audience/i), 'Test audience description');
      await user.type(screen.getByLabelText(/budget/i), '5000');
      await user.click(screen.getByRole('button', { name: /next/i }));

      await user.click(screen.getByLabelText(/increase brand awareness/i));
      await user.selectOptions(screen.getByLabelText(/timeframe/i), '6-months');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Test too short challenges text
      await user.type(screen.getByLabelText(/current marketing challenges/i), 'AB');
      await user.click(screen.getByRole('button', { name: /create strategy/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/current challenges description must be at least 10 characters/i)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<StrategyBuilder />);
      
      // Check if mobile-specific classes are applied
      const container = screen.getByTestId('strategy-builder-container');
      expect(container).toHaveClass('px-4'); // Mobile padding
    });

    it('should adapt to tablet viewport', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<StrategyBuilder />);
      
      // Check if tablet-specific classes are applied
      const container = screen.getByTestId('strategy-builder-container');
      expect(container).toHaveClass('md:px-6'); // Tablet padding
    });

    it('should adapt to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      render(<StrategyBuilder />);
      
      // Check if desktop-specific classes are applied
      const container = screen.getByTestId('strategy-builder-container');
      expect(container).toHaveClass('lg:px-8'); // Desktop padding
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels', () => {
      render(<StrategyBuilder />);
      
      expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);
      
      // Tab through form elements
      await user.tab();
      expect(screen.getByLabelText(/business name/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByLabelText(/industry/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /next/i })).toHaveFocus();
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<StrategyBuilder />);
      
      // Trigger validation error
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/business name must be at least 2 characters/i);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });

    it('should have proper heading hierarchy', () => {
      render(<StrategyBuilder />);

      // Check heading levels - should have h2 for step titles
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByText('Business Information')).toBeInTheDocument();
    });
  });

  describe('Strategy Generation Process', () => {
    it('should show loading state during strategy generation', async () => {
      const user = userEvent.setup();
      
      // Mock delayed API response
      (global.fetch as vi.Mock).mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: { id: 'test-id' } })
          }), 1000)
        )
      );
      
      render(<StrategyBuilder />);

      // Fill out all steps and submit

      // Step 1: Business Info
      await user.type(screen.getByLabelText(/business name/i), 'Test Business');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 2: Audience & Budget
      await user.type(screen.getByLabelText(/target audience/i), 'Test audience description');
      await user.type(screen.getByLabelText(/budget/i), '5000');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 3: Objectives & Timeline
      await user.click(screen.getByLabelText(/increase brand awareness/i));
      await user.selectOptions(screen.getByLabelText(/timeframe/i), '6-months');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 4: Challenges & Context
      await user.type(screen.getByLabelText(/current marketing challenges/i), 'Test challenges description');
      await user.click(screen.getByRole('button', { name: /create strategy/i }));

      // Should show loading indicator
      await waitFor(() => {
        expect(screen.getByText(/generating strategy\.\.\./i)).toBeInTheDocument();
      });
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock API error
      (global.fetch as vi.Mock).mockRejectedValue(new Error('API Error'));
      
      render(<StrategyBuilder />);

      // Fill out form and submit
      // Step 1: Business Info
      await user.type(screen.getByLabelText(/business name/i), 'Test Business');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 2: Audience & Budget
      await user.type(screen.getByLabelText(/target audience/i), 'Test audience description');
      await user.type(screen.getByLabelText(/budget/i), '5000');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 3: Objectives & Timeline
      await user.click(screen.getByLabelText(/increase brand awareness/i));
      await user.selectOptions(screen.getByLabelText(/timeframe/i), '6-months');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 4: Challenges & Context
      await user.type(screen.getByLabelText(/current marketing challenges/i), 'Test challenges description');
      await user.click(screen.getByRole('button', { name: /create strategy/i }));

      await waitFor(() => {
        expect(screen.getByText(/error generating strategy\. please try again\./i)).toBeInTheDocument();
      });
    });

    it('should show success message after strategy creation', async () => {
      const user = userEvent.setup();

      // Mock successful API response
      (global.fetch as vi.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: { id: 'test-id' } })
      });

      render(<StrategyBuilder />);

      // Fill out all steps and submit
      // Step 1: Business Info
      await user.type(screen.getByLabelText(/business name/i), 'Test Business');
      await user.selectOptions(screen.getByLabelText(/industry/i), 'technology');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 2: Audience & Budget
      await user.type(screen.getByLabelText(/target audience/i), 'Test audience description');
      await user.type(screen.getByLabelText(/budget/i), '5000');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 3: Objectives & Timeline
      await user.click(screen.getByLabelText(/increase brand awareness/i));
      await user.selectOptions(screen.getByLabelText(/timeframe/i), '6-months');
      await user.click(screen.getByRole('button', { name: /next/i }));

      // Step 4: Challenges & Context
      await user.type(screen.getByLabelText(/current marketing challenges/i), 'Test challenges description');
      await user.click(screen.getByRole('button', { name: /create strategy/i }));

      await waitFor(() => {
        expect(screen.getByText(/strategy created successfully! redirecting to your new strategy\.\.\./i)).toBeInTheDocument();
      });
    });
  });
});
