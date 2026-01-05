import {
  strategyInputSchema,
  businessInfoSchema,
  audienceAndBudgetSchema,
  objectivesAndTimeframeSchema,
  challengesAndContextSchema,
  type StrategyInput,
} from '@/lib/validations/strategy';

describe('Strategy Validation Schemas', () => {
  describe('businessInfoSchema', () => {
    it('should validate valid business info', () => {
      const validData = {
        businessName: 'Test Company',
        industry: 'technology',
      };

      const result = businessInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject business name that is too short', () => {
      const invalidData = {
        businessName: 'A',
        industry: 'technology',
      };

      const result = businessInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 2 characters');
      }
    });

    it('should reject business name that is too long', () => {
      const invalidData = {
        businessName: 'A'.repeat(101),
        industry: 'technology',
      };

      const result = businessInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('less than 100 characters');
      }
    });

    it('should reject invalid industry', () => {
      const invalidData = {
        businessName: 'Test Company',
        industry: 'A',
      };

      const result = businessInfoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('audienceAndBudgetSchema', () => {
    it('should validate valid audience and budget', () => {
      const validData = {
        targetAudience: 'Young professionals aged 25-35 interested in technology',
        budget: 50000,
      };

      const result = audienceAndBudgetSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject target audience that is too short', () => {
      const invalidData = {
        targetAudience: 'Too short',
        budget: 50000,
      };

      const result = audienceAndBudgetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 10 characters');
      }
    });

    it('should reject budget that is too low', () => {
      const invalidData = {
        targetAudience: 'Young professionals aged 25-35 interested in technology',
        budget: 50,
      };

      const result = audienceAndBudgetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least $100');
      }
    });

    it('should reject budget that is too high', () => {
      const invalidData = {
        targetAudience: 'Young professionals aged 25-35 interested in technology',
        budget: 20000000,
      };

      const result = audienceAndBudgetSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('less than $10,000,000');
      }
    });
  });

  describe('objectivesAndTimeframeSchema', () => {
    it('should validate valid objectives and timeframe', () => {
      const validData = {
        objectives: ['Increase brand awareness', 'Generate more leads'],
        timeframe: '6-months',
      };

      const result = objectivesAndTimeframeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty objectives array', () => {
      const invalidData = {
        objectives: [],
        timeframe: '6-months',
      };

      const result = objectivesAndTimeframeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('At least one objective is required');
      }
    });

    it('should reject too many objectives', () => {
      const invalidData = {
        objectives: Array(11).fill('Objective'),
        timeframe: '6-months',
      };

      const result = objectivesAndTimeframeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Maximum 10 objectives allowed');
      }
    });

    it('should reject invalid timeframe', () => {
      const invalidData = {
        objectives: ['Increase brand awareness'],
        timeframe: 'invalid-timeframe',
      };

      const result = objectivesAndTimeframeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('Invalid timeframe selected');
      }
    });
  });

  describe('challengesAndContextSchema', () => {
    it('should validate valid challenges and context', () => {
      const validData = {
        currentChallenges: 'We are struggling with low brand awareness and high customer acquisition costs',
        competitorInfo: 'Main competitors include Company A and Company B',
        existingMarketing: 'Currently using Google Ads and social media',
      };

      const result = challengesAndContextSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with optional fields empty', () => {
      const validData = {
        currentChallenges: 'We are struggling with low brand awareness and high customer acquisition costs',
        competitorInfo: '',
        existingMarketing: '',
      };

      const result = challengesAndContextSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject current challenges that are too short', () => {
      const invalidData = {
        currentChallenges: 'Too short',
        competitorInfo: '',
        existingMarketing: '',
      };

      const result = challengesAndContextSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 10 characters');
      }
    });
  });

  describe('strategyInputSchema', () => {
    const validStrategyInput: StrategyInput = {
      businessName: 'Test Company',
      industry: 'technology',
      targetAudience: 'Young professionals aged 25-35 interested in technology and innovation',
      budget: 50000,
      objectives: ['Increase brand awareness', 'Generate more leads'],
      timeframe: '6-months',
      currentChallenges: 'We are struggling with low brand awareness and high customer acquisition costs in a competitive market',
      competitorInfo: 'Main competitors include Company A and Company B who have strong social media presence',
      existingMarketing: 'Currently using Google Ads and social media marketing with limited success',
    };

    it('should validate complete valid strategy input', () => {
      const result = strategyInputSchema.safeParse(validStrategyInput);
      expect(result.success).toBe(true);
    });

    it('should validate strategy input with optional fields undefined', () => {
      const inputWithoutOptionals = {
        ...validStrategyInput,
        competitorInfo: undefined,
        existingMarketing: undefined,
      };

      const result = strategyInputSchema.safeParse(inputWithoutOptionals);
      expect(result.success).toBe(true);
    });

    it('should reject strategy input with missing required fields', () => {
      const invalidInput = {
        businessName: 'Test Company',
        // Missing other required fields
      };

      const result = strategyInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject strategy input with invalid field values', () => {
      const invalidInput = {
        ...validStrategyInput,
        budget: 50, // Too low
        objectives: [], // Empty array
      };

      const result = strategyInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(1);
      }
    });
  });
});
