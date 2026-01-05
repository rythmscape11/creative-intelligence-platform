/**
 * OpenAI Integration Tests
 *
 * This test suite verifies the OpenAI integration functionality,
 * including API connectivity, strategy generation, and fallback behavior.
 *
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import 'openai/shims/node';

// Mock OpenAI for controlled testing
vi.mock('openai', () => {
  const mockCreate = vi.fn();
  return vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate
      }
    }
  }));
});

import { OpenAIStrategyService } from '@/lib/services/openai-client';
import { StrategyProcessor } from '@/lib/services/strategy-processor';

describe('OpenAI Integration Tests', () => {
  const validStrategyInput = {
    businessName: 'TechCorp Solutions',
    industry: 'technology',
    targetAudience: 'Small to medium businesses looking for digital transformation',
    budget: 75000,
    objectives: ['increase_brand_awareness', 'generate_leads', 'improve_customer_retention'],
    timeframe: '12_months',
    currentChallenges: 'Limited online presence and difficulty reaching target audience',
    competitorInfo: 'Competing with larger consulting firms and established SaaS providers',
    existingMarketing: 'Basic website and LinkedIn presence, occasional trade show participation',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OpenAI API Connection', () => {
    it('should test connection successfully', async () => {
      // Get the mocked OpenAI instance
      const OpenAI = require('openai');
      const mockInstance = new OpenAI();
      mockInstance.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: 'Hello' } }]
      });

      const result = await OpenAIStrategyService.testConnection();
      expect(result).toBe(true);
    });

    it('should handle connection failures gracefully', async () => {
      const OpenAI = require('openai');
      const mockInstance = new OpenAI();
      mockInstance.chat.completions.create.mockRejectedValue(new Error('API Error'));

      const result = await OpenAIStrategyService.testConnection();
      expect(result).toBe(false);
    });

    it('should handle API key validation', async () => {
      const OpenAI = require('openai');
      const mockInstance = new OpenAI();
      mockInstance.chat.completions.create.mockRejectedValue(new Error('Invalid API key'));

      const result = await OpenAIStrategyService.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('AI Strategy Generation', () => {
    it('should generate comprehensive strategy with AI', async () => {
      const mockAIResponse = {
        executiveSummary: 'TechCorp Solutions is positioned to capture significant market share in the digital transformation space through a comprehensive 12-month marketing strategy focused on thought leadership, lead generation, and customer retention.',
        targetAudience: [
          {
            name: 'SMB Decision Makers',
            demographics: 'Business owners and IT managers at companies with 10-500 employees',
            psychographics: 'Tech-forward, budget-conscious, seeking efficiency improvements',
            painPoints: ['Limited technical expertise', 'Budget constraints', 'Time limitations'],
            preferredChannels: ['LinkedIn', 'Industry publications', 'Webinars', 'Email']
          }
        ],
        marketingChannels: [
          {
            name: 'Content Marketing',
            description: 'Thought leadership content including blogs, whitepapers, and case studies',
            budgetAllocation: 22500,
            expectedROI: '300-400%',
            tactics: ['Weekly blog posts', 'Monthly whitepapers', 'Customer case studies'],
            timeline: 'Ongoing throughout 12 months'
          },
          {
            name: 'LinkedIn Advertising',
            description: 'Targeted LinkedIn campaigns for lead generation',
            budgetAllocation: 18000,
            expectedROI: '250-350%',
            tactics: ['Sponsored content', 'Message ads', 'Event promotion'],
            timeline: 'Months 2-12'
          }
        ],
        contentStrategy: {
          themes: ['Digital Transformation', 'Efficiency Optimization', 'Technology ROI'],
          contentTypes: [
            {
              type: 'Blog Posts',
              description: 'Educational content addressing common SMB challenges',
              frequency: 'Weekly',
              platforms: ['Website', 'LinkedIn', 'Medium']
            }
          ],
          frequency: 'Daily social media, weekly blog, monthly whitepaper',
          distribution: ['Website', 'LinkedIn', 'Email newsletter', 'Partner networks']
        },
        timeline: [
          {
            phase: 'Foundation (Months 1-3)',
            duration: '3 months',
            activities: ['Brand positioning', 'Content creation', 'Website optimization'],
            deliverables: ['Brand guidelines', 'Content calendar', 'Optimized website']
          }
        ],
        budget: {
          total: 75000,
          channels: [
            { channel: 'Content Marketing', amount: 22500, percentage: 30 },
            { channel: 'LinkedIn Advertising', amount: 18000, percentage: 24 }
          ],
          contingency: 7500
        },
        kpis: [
          {
            metric: 'Lead Generation',
            target: '500 qualified leads',
            measurement: 'CRM tracking and attribution',
            frequency: 'Monthly'
          }
        ],
        recommendations: [
          'Invest in marketing automation platform',
          'Develop strategic partnerships',
          'Create customer advocacy program'
        ]
      };

      const OpenAI = require('openai');
      const mockInstance = new OpenAI();
      mockInstance.chat.completions.create.mockResolvedValue({
        choices: [{ message: { content: JSON.stringify(mockAIResponse) } }]
      });

      const result = await OpenAIStrategyService.generateStrategy(validStrategyInput);

      expect(result).toBeDefined();
      expect(result.executiveSummary).toBe(mockAIResponse.executiveSummary);
      expect(result.targetAudience).toHaveLength(1);
      expect(result.marketingChannels).toHaveLength(2);
      expect(result.budget.total).toBe(75000);
      expect(result.budget.contingency).toBe(7500);
    });

    it('should handle AI response parsing errors', async () => {
      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'Invalid JSON response' } }]
          })
        }
      };

      await expect(OpenAIStrategyService.generateStrategy(validStrategyInput))
        .rejects.toThrow('AI strategy generation failed');
    });

    it('should handle OpenAI API rate limits', async () => {
      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockRejectedValue(new Error('Rate limit exceeded'))
        }
      };

      await expect(OpenAIStrategyService.generateStrategy(validStrategyInput))
        .rejects.toThrow('AI strategy generation failed: Rate limit exceeded');
    });

    it('should validate and format AI response budget', async () => {
      const mockAIResponse = {
        executiveSummary: 'Test summary',
        targetAudience: [],
        marketingChannels: [],
        contentStrategy: { themes: [], contentTypes: [], frequency: '', distribution: [] },
        timeline: [],
        budget: {
          total: 80000, // Incorrect total
          channels: [
            { channel: 'Channel 1', amount: 30000, percentage: 40 },
            { channel: 'Channel 2', amount: 37500, percentage: 50 }
          ],
          contingency: 5000
        },
        kpis: [],
        recommendations: []
      };

      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockAIResponse) } }]
          })
        }
      };

      const result = await OpenAIStrategyService.generateStrategy(validStrategyInput);

      // Should correct the budget to match input
      expect(result.budget.total).toBe(75000);
      expect(result.budget.contingency).toBe(7500); // 10% of total
    });
  });

  describe('AI Integration with Strategy Processor', () => {
    it('should use AI when available and enabled', async () => {
      const mockAIResponse = {
        executiveSummary: 'AI-generated strategy',
        targetAudience: [],
        marketingChannels: [],
        contentStrategy: { themes: [], contentTypes: [], frequency: '', distribution: [] },
        timeline: [],
        budget: { total: 75000, channels: [], contingency: 7500 },
        kpis: [],
        recommendations: []
      };

      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockAIResponse) } }]
          })
        }
      };

      const result = await StrategyProcessor.processStrategy(validStrategyInput, { useAI: true });

      expect(result.generatedBy).toBe('AI');
      expect(result.output.executiveSummary).toBe('AI-generated strategy');
    });

    it('should fallback to rules engine when AI fails', async () => {
      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockRejectedValue(new Error('AI service unavailable'))
        }
      };

      const result = await StrategyProcessor.processStrategy(
        validStrategyInput, 
        { useAI: true, fallbackToRules: true }
      );

      expect(result.generatedBy).toBe('FALLBACK');
      expect(result.output).toBeDefined();
      expect(result.output.executiveSummary).toContain('TechCorp Solutions');
    });

    it('should throw error when AI fails and fallback is disabled', async () => {
      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockRejectedValue(new Error('AI service unavailable'))
        }
      };

      await expect(StrategyProcessor.processStrategy(
        validStrategyInput, 
        { useAI: true, fallbackToRules: false }
      )).rejects.toThrow('AI service unavailable');
    });

    it('should skip AI when disabled', async () => {
      const result = await StrategyProcessor.processStrategy(
        validStrategyInput, 
        { useAI: false }
      );

      expect(result.generatedBy).toBe('FALLBACK');
      expect(result.output).toBeDefined();
    });
  });

  describe('AI Response Quality Validation', () => {
    it('should ensure AI response has all required fields', async () => {
      const incompleteAIResponse = {
        executiveSummary: 'Test summary',
        // Missing required fields
      };

      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(incompleteAIResponse) } }]
          })
        }
      };

      // Should handle incomplete response gracefully
      const result = await OpenAIStrategyService.generateStrategy(validStrategyInput);
      
      // Should have default values for missing fields
      expect(result.targetAudience).toBeDefined();
      expect(result.marketingChannels).toBeDefined();
      expect(result.budget).toBeDefined();
    });

    it('should validate budget allocation consistency', async () => {
      const mockAIResponse = {
        executiveSummary: 'Test',
        targetAudience: [],
        marketingChannels: [
          { name: 'Channel 1', budgetAllocation: 20000 },
          { name: 'Channel 2', budgetAllocation: 25000 }
        ],
        contentStrategy: { themes: [], contentTypes: [], frequency: '', distribution: [] },
        timeline: [],
        budget: {
          total: 75000,
          channels: [
            { channel: 'Channel 1', amount: 22500, percentage: 30 },
            { channel: 'Channel 2', amount: 22500, percentage: 30 }
          ],
          contingency: 7500
        },
        kpis: [],
        recommendations: []
      };

      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockAIResponse) } }]
          })
        }
      };

      const result = await OpenAIStrategyService.generateStrategy(validStrategyInput);

      // Should sync marketing channels budget with budget breakdown
      expect(result.marketingChannels[0].budgetAllocation).toBe(result.budget.channels[0].amount);
      expect(result.marketingChannels[1].budgetAllocation).toBe(result.budget.channels[1].amount);
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle multiple concurrent AI requests', async () => {
      const mockAIResponse = {
        executiveSummary: 'Concurrent test',
        targetAudience: [],
        marketingChannels: [],
        contentStrategy: { themes: [], contentTypes: [], frequency: '', distribution: [] },
        timeline: [],
        budget: { total: 75000, channels: [], contingency: 7500 },
        kpis: [],
        recommendations: []
      };

      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockAIResponse) } }]
          })
        }
      };

      const promises = Array(5).fill(null).map(() => 
        StrategyProcessor.processStrategy(validStrategyInput, { useAI: true })
      );

      const results = await Promise.all(promises);

      results.forEach(result => {
        expect(result.generatedBy).toBe('AI');
        expect(result.output.executiveSummary).toBe('Concurrent test');
      });
    });

    it('should handle AI timeout scenarios', async () => {
      const mockOpenAI = require('openai');
      mockOpenAI.prototype.chat = {
        completions: {
          create: vi.fn().mockImplementation(() => 
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), 100)
            )
          )
        }
      };

      const result = await StrategyProcessor.processStrategy(
        validStrategyInput, 
        { useAI: true, fallbackToRules: true }
      );

      expect(result.generatedBy).toBe('FALLBACK');
    });
  });
});
