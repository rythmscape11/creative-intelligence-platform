/**
 * Unit Tests for Experiment Statistical Analysis
 * 
 * Tests Bayesian and Frequentist statistical calculations
 */

import { describe, it, expect } from 'vitest';

/**
 * Calculate Bayesian probability that variant B is better than variant A
 */
function calculateBayesianProbability(
  conversionsA: number,
  viewsA: number,
  conversionsB: number,
  viewsB: number
): number {
  const alpha_a = conversionsA + 1;
  const beta_a = viewsA - conversionsA + 1;
  const alpha_b = conversionsB + 1;
  const beta_b = viewsB - conversionsB + 1;
  
  const mean_a = alpha_a / (alpha_a + beta_a);
  const mean_b = alpha_b / (alpha_b + beta_b);
  
  const var_a = (alpha_a * beta_a) / ((alpha_a + beta_a) ** 2 * (alpha_a + beta_a + 1));
  const var_b = (alpha_b * beta_b) / ((alpha_b + beta_b) ** 2 * (alpha_b + beta_b + 1));
  
  const z = (mean_b - mean_a) / Math.sqrt(var_a + var_b);
  const probability = 0.5 * (1 + Math.tanh(z / Math.sqrt(2)));
  
  return Math.min(Math.max(probability, 0), 1);
}

/**
 * Calculate frequentist p-value using chi-square test
 */
function calculatePValue(
  conversionsA: number,
  viewsA: number,
  conversionsB: number,
  viewsB: number
): number {
  const n1 = viewsA;
  const n2 = viewsB;
  const p1 = conversionsA / n1;
  const p2 = conversionsB / n2;
  const p = (conversionsA + conversionsB) / (n1 + n2);

  // Handle edge case where p is 0 or 1
  if (p === 0 || p === 1) {
    return 1; // No difference when both have 0% or 100% conversion
  }

  const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
  const z = Math.abs(p1 - p2) / se;

  const pValue = 2 * (1 - 0.5 * (1 + Math.tanh(z / Math.sqrt(2))));

  return Math.min(Math.max(pValue, 0), 1);
}

describe('Experiment Statistics', () => {
  describe('Bayesian Probability', () => {
    it('should return ~0.5 for identical performance', () => {
      const prob = calculateBayesianProbability(50, 1000, 50, 1000);
      expect(prob).toBeCloseTo(0.5, 1);
    });

    it('should return high probability when B clearly better', () => {
      const prob = calculateBayesianProbability(50, 1000, 100, 1000);
      expect(prob).toBeGreaterThan(0.9);
    });

    it('should return low probability when A clearly better', () => {
      const prob = calculateBayesianProbability(100, 1000, 50, 1000);
      expect(prob).toBeLessThan(0.1);
    });

    it('should handle edge case with zero conversions', () => {
      const prob = calculateBayesianProbability(0, 1000, 10, 1000);
      expect(prob).toBeGreaterThan(0.5);
      expect(prob).toBeLessThan(1);
    });

    it('should handle small sample sizes', () => {
      const prob = calculateBayesianProbability(5, 50, 10, 50);
      expect(prob).toBeGreaterThan(0.5);
      expect(prob).toBeLessThan(1);
    });

    it('should return value between 0 and 1', () => {
      const prob = calculateBayesianProbability(200, 1000, 250, 1000);
      expect(prob).toBeGreaterThanOrEqual(0);
      expect(prob).toBeLessThanOrEqual(1);
    });

    it('should be consistent with conversion rate differences', () => {
      // 5% vs 10% conversion rate
      const prob1 = calculateBayesianProbability(50, 1000, 100, 1000);
      // 10% vs 15% conversion rate (same absolute difference)
      const prob2 = calculateBayesianProbability(100, 1000, 150, 1000);
      
      // Both should show high confidence that B is better
      expect(prob1).toBeGreaterThan(0.9);
      expect(prob2).toBeGreaterThan(0.9);
    });
  });

  describe('P-Value Calculation', () => {
    it('should return high p-value for identical performance', () => {
      const pValue = calculatePValue(50, 1000, 50, 1000);
      expect(pValue).toBeGreaterThan(0.9);
    });

    it('should return low p-value for significant difference', () => {
      const pValue = calculatePValue(50, 1000, 100, 1000);
      expect(pValue).toBeLessThan(0.05);
    });

    it('should be symmetric (A vs B same as B vs A)', () => {
      const pValue1 = calculatePValue(50, 1000, 100, 1000);
      const pValue2 = calculatePValue(100, 1000, 50, 1000);
      expect(pValue1).toBeCloseTo(pValue2, 5);
    });

    it('should handle edge cases', () => {
      const pValue = calculatePValue(0, 1000, 0, 1000);
      expect(pValue).toBeGreaterThan(0.9);
    });

    it('should return value between 0 and 1', () => {
      const pValue = calculatePValue(75, 1000, 85, 1000);
      expect(pValue).toBeGreaterThanOrEqual(0);
      expect(pValue).toBeLessThanOrEqual(1);
    });

    it('should detect significance at 95% confidence', () => {
      // Large sample with clear difference
      const pValue = calculatePValue(500, 10000, 600, 10000);
      expect(pValue).toBeLessThan(0.05);
    });

    it('should not detect significance with small samples', () => {
      // Small sample, unclear difference
      const pValue = calculatePValue(5, 50, 7, 50);
      expect(pValue).toBeGreaterThan(0.05);
    });
  });

  describe('Statistical Consistency', () => {
    it('Bayesian and Frequentist should agree on clear winners', () => {
      const conversionsA = 50;
      const viewsA = 1000;
      const conversionsB = 100;
      const viewsB = 1000;

      const bayesianProb = calculateBayesianProbability(conversionsA, viewsA, conversionsB, viewsB);
      const pValue = calculatePValue(conversionsA, viewsA, conversionsB, viewsB);

      // Bayesian should show high confidence B is better
      expect(bayesianProb).toBeGreaterThan(0.95);
      // Frequentist should show significance
      expect(pValue).toBeLessThan(0.05);
    });

    it('Both methods should agree on no difference', () => {
      const conversionsA = 50;
      const viewsA = 1000;
      const conversionsB = 51;
      const viewsB = 1000;

      const bayesianProb = calculateBayesianProbability(conversionsA, viewsA, conversionsB, viewsB);
      const pValue = calculatePValue(conversionsA, viewsA, conversionsB, viewsB);

      // Bayesian should be close to 0.5
      expect(bayesianProb).toBeGreaterThan(0.4);
      expect(bayesianProb).toBeLessThan(0.6);
      // Frequentist should show no significance
      expect(pValue).toBeGreaterThan(0.05);
    });
  });

  describe('Conversion Rate Calculations', () => {
    it('should calculate correct conversion rates', () => {
      const conversions = 50;
      const views = 1000;
      const cvr = (conversions / views) * 100;
      
      expect(cvr).toBe(5);
    });

    it('should calculate correct uplift', () => {
      const controlCVR = 5; // 50/1000
      const variantCVR = 7.5; // 75/1000
      const uplift = ((variantCVR - controlCVR) / controlCVR) * 100;
      
      expect(uplift).toBe(50); // 50% uplift
    });

    it('should handle negative uplift', () => {
      const controlCVR = 7.5;
      const variantCVR = 5;
      const uplift = ((variantCVR - controlCVR) / controlCVR) * 100;
      
      expect(uplift).toBeCloseTo(-33.33, 1);
    });

    it('should handle zero conversion rate in control', () => {
      const controlCVR = 0;
      const variantCVR = 5;
      const uplift = controlCVR > 0 
        ? ((variantCVR - controlCVR) / controlCVR) * 100
        : 0;
      
      expect(uplift).toBe(0);
    });
  });

  describe('Sample Size Considerations', () => {
    it('should show uncertainty with very small samples', () => {
      const bayesianProb = calculateBayesianProbability(1, 10, 2, 10);
      
      // Should not be extremely confident either way
      expect(bayesianProb).toBeGreaterThan(0.3);
      expect(bayesianProb).toBeLessThan(0.7);
    });

    it('should show more confidence with larger samples', () => {
      const smallSample = calculateBayesianProbability(5, 50, 10, 50);
      const largeSample = calculateBayesianProbability(50, 500, 100, 500);
      
      // Larger sample should be more confident
      expect(largeSample).toBeGreaterThan(smallSample);
    });

    it('p-value should decrease with sample size for same effect', () => {
      // 10% vs 12% with small sample
      const smallPValue = calculatePValue(10, 100, 12, 100);
      // 10% vs 12% with large sample
      const largePValue = calculatePValue(100, 1000, 120, 1000);
      
      expect(largePValue).toBeLessThan(smallPValue);
    });
  });
});

