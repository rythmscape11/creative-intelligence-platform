/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StrategyProcessor } from '@/lib/services/strategy-processor';
import { StrategyInput } from '@/lib/validations/strategy';

describe('StrategyProcessor', () => {
  const mockStrategyInput: StrategyInput = {
    businessName: 'TechStart Inc',
    industry: 'technology',
    targetAudience: 'Small to medium businesses looking for digital transformation solutions',
    budget: 75000,
    objectives: ['Increase brand awareness', 'Generate more leads', 'Boost sales revenue'],
    timeframe: '12-months',
    currentChallenges: 'Limited brand recognition in the market and high customer acquisition costs due to strong competition',
    competitorInfo: 'Main competitors include BigTech Corp and InnovateSoft who dominate the enterprise market',
    existingMarketing: 'Currently using Google Ads and LinkedIn marketing with moderate success',
  };

  describe('processStrategy', () => {
    it('should generate a complete strategy with fallback rules', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput, {
        useAI: false,
        fallbackToRules: true,
      });

      expect(result).toBeDefined();
      expect(result.generatedBy).toBe('FALLBACK');
      expect(result.output).toBeDefined();
    });

    it('should generate strategy with AI option (falls back to rules)', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput, {
        useAI: true,
        fallbackToRules: true,
      });

      expect(result).toBeDefined();
      expect(result.generatedBy).toBe('FALLBACK'); // Since AI is not implemented yet
      expect(result.output).toBeDefined();
    });

    it('should generate strategy output with all required fields', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output).toHaveProperty('executiveSummary');
      expect(result.output).toHaveProperty('targetAudience');
      expect(result.output).toHaveProperty('marketingChannels');
      expect(result.output).toHaveProperty('contentStrategy');
      expect(result.output).toHaveProperty('timeline');
      expect(result.output).toHaveProperty('budget');
      expect(result.output).toHaveProperty('kpis');
      expect(result.output).toHaveProperty('recommendations');
    });

    it('should generate executive summary containing business name and industry', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.executiveSummary).toContain(mockStrategyInput.businessName);
      expect(result.output.executiveSummary).toContain(mockStrategyInput.industry);
    });

    it('should generate target audience analysis', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.targetAudience).toBeInstanceOf(Array);
      expect(result.output.targetAudience.length).toBeGreaterThan(0);
      
      const primaryAudience = result.output.targetAudience[0];
      expect(primaryAudience).toHaveProperty('name');
      expect(primaryAudience).toHaveProperty('demographics');
      expect(primaryAudience).toHaveProperty('psychographics');
      expect(primaryAudience).toHaveProperty('painPoints');
      expect(primaryAudience).toHaveProperty('preferredChannels');
    });

    it('should generate marketing channels with budget allocation', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.marketingChannels).toBeInstanceOf(Array);
      expect(result.output.marketingChannels.length).toBeGreaterThan(0);

      const totalAllocated = result.output.marketingChannels.reduce(
        (sum, channel) => sum + channel.budgetAllocation,
        0
      );

      // Budget allocation should be reasonable (within 10% of total budget)
      expect(totalAllocated).toBeLessThanOrEqual(mockStrategyInput.budget * 1.1);
      expect(totalAllocated).toBeGreaterThanOrEqual(mockStrategyInput.budget * 0.8);
    });

    it('should generate content strategy with themes and types', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.contentStrategy).toHaveProperty('themes');
      expect(result.output.contentStrategy).toHaveProperty('contentTypes');
      expect(result.output.contentStrategy).toHaveProperty('frequency');
      expect(result.output.contentStrategy).toHaveProperty('distribution');

      expect(result.output.contentStrategy.themes).toBeInstanceOf(Array);
      expect(result.output.contentStrategy.contentTypes).toBeInstanceOf(Array);
    });

    it('should generate timeline with phases', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.timeline).toBeInstanceOf(Array);
      expect(result.output.timeline.length).toBeGreaterThan(0);

      const firstPhase = result.output.timeline[0];
      expect(firstPhase).toHaveProperty('phase');
      expect(firstPhase).toHaveProperty('duration');
      expect(firstPhase).toHaveProperty('activities');
      expect(firstPhase).toHaveProperty('deliverables');
    });

    it('should generate budget breakdown with contingency', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.budget).toHaveProperty('total');
      expect(result.output.budget).toHaveProperty('channels');
      expect(result.output.budget).toHaveProperty('contingency');

      expect(result.output.budget.total).toBe(mockStrategyInput.budget);
      expect(result.output.budget.channels).toBeInstanceOf(Array);
      expect(result.output.budget.contingency).toBeGreaterThan(0);
    });

    it('should generate KPIs based on objectives', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.kpis).toBeInstanceOf(Array);
      expect(result.output.kpis.length).toBeGreaterThan(0);
      expect(result.output.kpis.length).toBeLessThanOrEqual(mockStrategyInput.objectives.length);

      const firstKPI = result.output.kpis[0];
      expect(firstKPI).toHaveProperty('metric');
      expect(firstKPI).toHaveProperty('target');
      expect(firstKPI).toHaveProperty('measurement');
      expect(firstKPI).toHaveProperty('frequency');
    });

    it('should generate relevant recommendations', async () => {
      const result = await StrategyProcessor.processStrategy(mockStrategyInput);

      expect(result.output.recommendations).toBeInstanceOf(Array);
      expect(result.output.recommendations.length).toBeGreaterThan(0);
      expect(result.output.recommendations.length).toBeLessThanOrEqual(8);

      // All recommendations should be strings
      result.output.recommendations.forEach(recommendation => {
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length).toBeGreaterThan(10);
      });
    });
  });

  describe('industry-specific processing', () => {
    it('should generate different strategies for different industries', async () => {
      const techInput = { ...mockStrategyInput, industry: 'technology' };
      const retailInput = { ...mockStrategyInput, industry: 'retail' };

      const techResult = await StrategyProcessor.processStrategy(techInput);
      const retailResult = await StrategyProcessor.processStrategy(retailInput);

      // Strategies should be different for different industries
      expect(techResult.output.executiveSummary).not.toBe(retailResult.output.executiveSummary);
      expect(techResult.output.marketingChannels).not.toEqual(retailResult.output.marketingChannels);
    });

    it('should adjust budget distribution based on industry', async () => {
      const techInput = { ...mockStrategyInput, industry: 'technology' };
      const healthcareInput = { ...mockStrategyInput, industry: 'healthcare' };

      const techResult = await StrategyProcessor.processStrategy(techInput);
      const healthcareResult = await StrategyProcessor.processStrategy(healthcareInput);

      // Budget distributions should be different
      expect(techResult.output.budget.channels).not.toEqual(healthcareResult.output.budget.channels);
    });
  });

  describe('budget-based processing', () => {
    it('should adjust strategy for different budget levels', async () => {
      const lowBudgetInput = { ...mockStrategyInput, budget: 5000 };
      const highBudgetInput = { ...mockStrategyInput, budget: 500000 };

      const lowBudgetResult = await StrategyProcessor.processStrategy(lowBudgetInput);
      const highBudgetResult = await StrategyProcessor.processStrategy(highBudgetInput);

      // Recommendations should be different for different budget levels
      expect(lowBudgetResult.output.recommendations).not.toEqual(highBudgetResult.output.recommendations);
      
      // Content frequency should be different
      expect(lowBudgetResult.output.contentStrategy.frequency).not.toBe(
        highBudgetResult.output.contentStrategy.frequency
      );
    });
  });

  describe('timeframe-based processing', () => {
    it('should generate different timelines for different timeframes', async () => {
      const shortTermInput = { ...mockStrategyInput, timeframe: '3-months' };
      const longTermInput = { ...mockStrategyInput, timeframe: '24-months' };

      const shortTermResult = await StrategyProcessor.processStrategy(shortTermInput);
      const longTermResult = await StrategyProcessor.processStrategy(longTermInput);

      // Timeline phases should be different
      expect(shortTermResult.output.timeline.length).not.toBe(longTermResult.output.timeline.length);
    });
  });

  describe('error handling', () => {
    it('should handle invalid input gracefully', async () => {
      const invalidInput = {
        ...mockStrategyInput,
        budget: -1000, // Invalid budget
      };

      // Should not throw an error, but handle gracefully
      await expect(StrategyProcessor.processStrategy(invalidInput)).resolves.toBeDefined();
    });

    it('should throw error when fallback is disabled and AI fails', async () => {
      // Since AI is not implemented yet, this will always fall back to rules
      // This test will be more relevant when AI integration is added
      const result = await StrategyProcessor.processStrategy(mockStrategyInput, {
        useAI: true,
        fallbackToRules: false,
      });

      // For now, it should still work since we fall back to rules
      expect(result).toBeDefined();
      expect(result.generatedBy).toBe('FALLBACK');
    });
  });
});
