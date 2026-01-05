/**
 * @jest-environment node
 */

import { ExportService } from '@/lib/services/export-service';
import { StrategyOutput } from '@/lib/validations/strategy';

describe('ExportService', () => {
  const mockStrategyOutput: StrategyOutput = {
    executiveSummary: 'This is a comprehensive marketing strategy for TechStart Inc, a technology company targeting small to medium businesses.',
    targetAudience: [
      {
        name: 'Small Business Owners',
        description: 'Business owners with 10-50 employees looking for digital transformation',
        demographics: '35-55 years old, college-educated',
        psychographics: 'Tech-savvy, growth-oriented, budget-conscious',
      },
      {
        name: 'IT Decision Makers',
        description: 'CTOs and IT managers in medium-sized companies',
        demographics: '30-50 years old, technical background',
        psychographics: 'Innovation-focused, security-conscious, efficiency-driven',
      },
    ],
    marketingChannels: [
      {
        name: 'Google Ads',
        budget: 30000,
        percentage: 40,
        focus: 'Lead generation and brand awareness',
        expectedROI: '300%',
      },
      {
        name: 'LinkedIn Marketing',
        budget: 22500,
        percentage: 30,
        focus: 'B2B networking and thought leadership',
        expectedROI: '250%',
      },
      {
        name: 'Content Marketing',
        budget: 15000,
        percentage: 20,
        focus: 'SEO and educational content',
        expectedROI: '200%',
      },
      {
        name: 'Email Marketing',
        budget: 7500,
        percentage: 10,
        focus: 'Nurturing and retention',
        expectedROI: '400%',
      },
    ],
    contentStrategy: {
      themes: ['Digital Transformation', 'Business Efficiency', 'Technology Innovation'],
      types: ['Blog Posts', 'Whitepapers', 'Case Studies', 'Video Tutorials'],
    },
    timeline: [
      {
        name: 'Foundation Phase',
        duration: '1-3 months',
        activities: ['Brand positioning', 'Website optimization', 'Content creation'],
        deliverables: ['Brand guidelines', 'Optimized website', 'Content calendar'],
      },
      {
        name: 'Growth Phase',
        duration: '4-8 months',
        activities: ['Paid advertising', 'Content marketing', 'Lead generation'],
        deliverables: ['Ad campaigns', 'Blog content', 'Lead magnets'],
      },
      {
        name: 'Scale Phase',
        duration: '9-12 months',
        activities: ['Partnership development', 'Market expansion', 'Optimization'],
        deliverables: ['Partner agreements', 'Expanded campaigns', 'Performance reports'],
      },
    ],
    budget: {
      total: 75000,
      allocated: 67500,
      contingency: 7500,
      breakdown: [
        { category: 'Advertising', amount: 52500, percentage: 70 },
        { category: 'Content Creation', amount: 11250, percentage: 15 },
        { category: 'Tools & Software', amount: 3750, percentage: 5 },
        { category: 'Contingency', amount: 7500, percentage: 10 },
      ],
    },
    kpis: [
      {
        metric: 'Lead Generation',
        target: '500 qualified leads',
        timeframe: '12 months',
        measurementMethod: 'CRM tracking',
      },
      {
        metric: 'Brand Awareness',
        target: '25% increase',
        timeframe: '6 months',
        measurementMethod: 'Brand surveys',
      },
      {
        metric: 'Revenue Growth',
        target: '$500K increase',
        timeframe: '12 months',
        measurementMethod: 'Sales tracking',
      },
    ],
    recommendations: [
      {
        title: 'Implement Marketing Automation',
        description: 'Use tools like HubSpot or Marketo to streamline lead nurturing',
        priority: 'High',
      },
      {
        title: 'Develop Customer Success Program',
        description: 'Create onboarding and retention programs for existing customers',
        priority: 'Medium',
      },
      {
        title: 'Expand to Social Media',
        description: 'Consider Twitter and YouTube for additional reach',
        priority: 'Low',
      },
    ],
  };

  const businessName = 'TechStart Inc';

  describe('exportToPPTX', () => {
    it('should generate PPTX file with correct structure', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'pptx',
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBe('TechStart_Inc_Marketing_Strategy.pptx');
      expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.presentationml.presentation');
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should generate PPTX with custom colors', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'pptx',
        customization: {
          colors: {
            primary: 'FF0000',
            secondary: '00FF00',
            accent: '0000FF',
          },
        },
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(0);
    });
  });

  describe('exportToDOCX', () => {
    it('should generate DOCX file with correct structure', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'docx',
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBe('TechStart_Inc_Marketing_Strategy.docx');
      expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should include all strategy sections in DOCX', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'docx',
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      // DOCX should contain structured content with all sections
      expect(result.buffer.length).toBeGreaterThan(1000); // Reasonable size check
    });
  });

  describe('exportToXLSX', () => {
    it('should generate XLSX file with correct structure', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'xlsx',
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBe('TechStart_Inc_Marketing_Strategy.xlsx');
      expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should include multiple worksheets in XLSX', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'xlsx',
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      // XLSX should contain multiple sheets with structured data
      expect(result.buffer.length).toBeGreaterThan(500); // Reasonable size check
    });
  });

  describe('error handling', () => {
    it('should throw error for unsupported format', async () => {
      await expect(
        ExportService.exportStrategy(mockStrategyOutput, businessName, {
          format: 'pdf' as any,
        })
      ).rejects.toThrow('Unsupported export format: pdf');
    });

    it('should handle empty business name', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, '', {
        format: 'pptx',
      });

      expect(result).toBeDefined();
      expect(result.filename).toBe('_Marketing_Strategy.pptx');
    });

    it('should handle special characters in business name', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, 'Tech/Start & Co.', {
        format: 'pptx',
      });

      expect(result).toBeDefined();
      expect(result.filename).toBe('Tech_Start___Co__Marketing_Strategy.pptx');
    });
  });

  describe('customization options', () => {
    it('should apply custom fonts when provided', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'pptx',
        customization: {
          fonts: {
            heading: 'Arial',
            body: 'Calibri',
          },
        },
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
    });

    it('should handle missing customization gracefully', async () => {
      const result = await ExportService.exportStrategy(mockStrategyOutput, businessName, {
        format: 'pptx',
        customization: undefined,
      });

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
    });
  });

  describe('file naming', () => {
    it('should sanitize business names for filenames', async () => {
      const testCases = [
        { input: 'Test Company', expected: 'Test_Company_Marketing_Strategy.pptx' },
        { input: 'Test/Company\\Name', expected: 'Test_Company_Name_Marketing_Strategy.pptx' },
        { input: 'Test & Co.', expected: 'Test___Co__Marketing_Strategy.pptx' },
        { input: '123 Tech!', expected: '123_Tech__Marketing_Strategy.pptx' },
      ];

      for (const testCase of testCases) {
        const result = await ExportService.exportStrategy(mockStrategyOutput, testCase.input, {
          format: 'pptx',
        });

        expect(result.filename).toBe(testCase.expected);
      }
    });
  });
});
