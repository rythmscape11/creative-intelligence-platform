import { describe, expect, it } from 'vitest';
import { allocateBudget } from '@/lib/tools/advertising/budgetAllocator';


describe('allocateROIOptimized', () => {
  it('distributes mixed ROI and zero-ROI channels without exceeding the total budget', () => {
    const totalBudget = 10000;
    const { allocations } = allocateBudget(totalBudget, [
      { name: 'Search', roi: 200 },
      { name: 'Social', roi: 120 },
      { name: 'Display', roi: 0 },
      { name: 'Affiliate', roi: 0 }
    ], 'roi-optimized');

    const allocatedAmount = allocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    const allocatedPercentage = allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);

    expect(allocatedAmount).toBeCloseTo(totalBudget, 2);
    expect(allocatedPercentage).toBeCloseTo(100, 2);
  });
});
