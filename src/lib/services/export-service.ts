import pptxgen from 'pptxgenjs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
import * as XLSX from 'xlsx';
import { StrategyInput } from '@/lib/validations/strategy';

// Define StrategyOutput type for export service
export interface StrategyOutput {
  input: StrategyInput;
  output: any; // AI-generated strategy output
  executiveSummary?: string;
  targetAudience?: any;
  channels?: any[];
  tactics?: any[];
  budget?: any;
  timeline?: any;
  kpis?: any[];
}

export interface ExportOptions {
  format: 'pptx' | 'docx' | 'xlsx';
  template?: string;
  customization?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
    fonts?: {
      heading?: string;
      body?: string;
    };
    logo?: string;
  };
}

export interface ExportResult {
  buffer: Buffer;
  filename: string;
  mimeType: string;
}

export class ExportService {
  /**
   * Export strategy to specified format
   */
  static async exportStrategy(
    strategy: StrategyOutput,
    businessName: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    switch (options.format) {
      case 'pptx':
        return this.exportToPPTX(strategy, businessName, options);
      case 'docx':
        return this.exportToDOCX(strategy, businessName, options);
      case 'xlsx':
        return this.exportToXLSX(strategy, businessName, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Export strategy to PowerPoint (PPTX)
   */
  private static async exportToPPTX(
    strategy: StrategyOutput,
    businessName: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    const { PresentationService } = await import('./presentation-service');
    const presentationService = new PresentationService();

    // Convert StrategyOutput to EnhancedStrategyInput format for the service
    // This is a mapping step to ensure data compatibility
    const inputAny = strategy.input as any;
    const inputData: any = {
      ...inputAny,
      // Ensure arrays are present
      marketingObjectives: inputAny.marketingObjectives || [],
      preferredChannels: inputAny.preferredChannels || [],
    };

    const buffer = await presentationService.generateStrategyPresentation(inputData, strategy.output);

    return {
      buffer,
      filename: `${businessName.replace(/[^a-zA-Z0-9]/g, '_')}_Marketing_Strategy.pptx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };
  }

  /**
   * Export strategy to Word Document (DOCX)
   */
  private static async exportToDOCX(
    strategy: StrategyOutput,
    businessName: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    const doc = new Document({
      creator: 'MediaPlanPro',
      title: `${businessName} - Marketing Strategy`,
      description: `Comprehensive marketing strategy for ${businessName}`,
      styles: {
        paragraphStyles: [
          {
            id: 'heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 32,
              bold: true,
              color: '0F172A', // Slate 900
              font: 'Arial',
            },
            paragraph: {
              spacing: { before: 400, after: 200 },
            },
          },
          {
            id: 'heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            run: {
              size: 24,
              bold: true,
              color: '3B82F6', // Blue 500
              font: 'Arial',
            },
            paragraph: {
              spacing: { before: 300, after: 150 },
            },
          },
          {
            id: 'normal',
            name: 'Normal',
            run: {
              size: 22, // 11pt
              color: '334155', // Slate 700
              font: 'Arial',
            },
            paragraph: {
              spacing: { line: 276, after: 150 }, // 1.15 line spacing
            },
          },
        ],
      },
      sections: [
        {
          properties: {},
          children: [
            // Title Page
            new Paragraph({
              text: 'MARKETING STRATEGY',
              heading: HeadingLevel.TITLE,
              alignment: 'center',
              spacing: { before: 3000, after: 400 },
              run: {
                size: 28,
                color: '64748B',
                bold: true,
                font: 'Arial',
              }
            }),
            new Paragraph({
              text: businessName,
              heading: HeadingLevel.TITLE,
              alignment: 'center',
              spacing: { after: 400 },
              run: {
                size: 64,
                color: '0F172A',
                bold: true,
                font: 'Arial',
              }
            }),
            new Paragraph({
              text: `Generated on ${new Date().toLocaleDateString()}`,
              alignment: 'center',
              spacing: { after: 4000 },
              run: {
                size: 24,
                color: '94A3B8',
                font: 'Arial',
              }
            }),
            new Paragraph({
              text: 'CONFIDENTIAL',
              alignment: 'center',
              run: {
                size: 20,
                color: 'CBD5E1',
                bold: true,
                font: 'Arial',
              },
              pageBreakBefore: true, // Start content on next page
            }),

            // Executive Summary
            new Paragraph({
              text: 'Executive Summary',
              style: 'heading1',
            }),

            new Paragraph({
              text: strategy.executiveSummary,
              style: 'normal',
            }),

            // Target Audience
            new Paragraph({
              text: 'Target Audience Analysis',
              style: 'heading1',
            }),

            ...strategy.targetAudience.flatMap((segment: any) => [
              new Paragraph({
                text: segment.name,
                style: 'heading2',
              }),
              new Paragraph({
                text: segment.description,
                style: 'normal',
              }),
            ]),

            // Marketing Channels
            new Paragraph({
              text: 'Marketing Channels & Budget Allocation',
              style: 'heading1',
            }),

            // Budget table
            (() => {
              const channels = (strategy as any).marketingChannels || (strategy as any).channelStrategy?.channels || [];
              return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: 'Channel', run: { bold: true, color: 'FFFFFF' } })],
                        shading: { fill: '0F172A' },
                        verticalAlign: 'center',
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: 'Budget', run: { bold: true, color: 'FFFFFF' } })],
                        shading: { fill: '0F172A' },
                        verticalAlign: 'center',
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: 'Percentage', run: { bold: true, color: 'FFFFFF' } })],
                        shading: { fill: '0F172A' },
                        verticalAlign: 'center',
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: 'Focus', run: { bold: true, color: 'FFFFFF' } })],
                        shading: { fill: '0F172A' },
                        verticalAlign: 'center',
                      }),
                    ],
                  }),
                  ...channels.map((channel: any) =>
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ text: channel.name || channel.channel })] }),
                        new TableCell({ children: [new Paragraph({ text: `$${(channel.budget || channel.budgetAllocation || 0).toLocaleString()}` })] }),
                        new TableCell({ children: [new Paragraph({ text: `${channel.percentage || channel.budgetPercentage || 0}%` })] }),
                        new TableCell({ children: [new Paragraph({ text: channel.focus || channel.rationale || '' })] }),
                      ],
                    })
                  ),
                ],
              });
            })(),

            // Content Strategy
            new Paragraph({
              text: 'Content Strategy',
              style: 'heading1',
            }),

            new Paragraph({
              text: `Themes: ${((strategy as any).contentStrategy?.themes || (strategy as any).contentStrategy?.contentThemes || []).join(', ')}`,
              style: 'normal',
            }),

            new Paragraph({
              text: `Content Types: ${((strategy as any).contentStrategy?.types || (strategy as any).contentStrategy?.contentPillars?.map((p: any) => p.pillar) || []).join(', ')}`,
              style: 'normal',
            }),

            // Timeline
            new Paragraph({
              text: 'Implementation Timeline',
              style: 'heading1',
            }),

            ...(() => {
              const timeline = (strategy as any).timeline || (strategy as any).implementationTimeline || [];
              const timelineArray = Array.isArray(timeline) ? timeline : (timeline.phases || []);
              return timelineArray.flatMap((phase: any, index: number) => [
                new Paragraph({
                  text: `Phase ${index + 1}: ${phase.name || phase.phase}`,
                  style: 'heading2',
                }),
                new Paragraph({
                  text: `Duration: ${phase.duration}`,
                  style: 'normal',
                }),
                new Paragraph({
                  text: `Activities: ${(phase.activities || []).join(', ')}`,
                  style: 'normal',
                }),
              ]);
            })(),

            // KPIs
            new Paragraph({
              text: 'Key Performance Indicators',
              style: 'heading1',
            }),

            ...((strategy as any).kpis || []).map((kpi: any) =>
              new Paragraph({
                text: `• ${kpi.metric}: ${kpi.target} (${kpi.timeframe || 'N/A'})`,
                style: 'normal',
              })
            ),

            // Recommendations
            new Paragraph({
              text: 'Recommendations',
              style: 'heading1',
            }),

            ...((strategy as any).recommendations || []).map((rec: any) =>
              new Paragraph({
                text: `• ${rec.title}: ${rec.description}`,
                style: 'normal',
              })
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return {
      buffer,
      filename: `${businessName.replace(/[^a-zA-Z0-9]/g, '_')}_Marketing_Strategy.docx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
  }

  /**
   * Export strategy to Excel Spreadsheet (XLSX)
   */
  private static async exportToXLSX(
    strategy: StrategyOutput,
    businessName: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Marketing Strategy Summary'],
      ['Business Name', businessName],
      ['Generated Date', new Date().toLocaleDateString()],
      [''],
      ['Executive Summary'],
      [strategy.executiveSummary],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Target Audience Sheet
    const audienceData = [
      ['Target Audience Analysis'],
      ['Segment Name', 'Description', 'Demographics', 'Psychographics'],
      ...strategy.targetAudience.map((segment: any) => [
        segment.name,
        segment.description,
        segment.demographics || '',
        segment.psychographics || '',
      ]),
    ];

    const audienceSheet = XLSX.utils.aoa_to_sheet(audienceData);
    XLSX.utils.book_append_sheet(workbook, audienceSheet, 'Target Audience');

    // Marketing Channels & Budget Sheet
    const xlsxChannels = (strategy as any).marketingChannels || (strategy as any).channelStrategy?.channels || [];
    const channelsData = [
      ['Marketing Channels & Budget'],
      ['Channel', 'Budget ($)', 'Percentage (%)', 'Focus', 'Expected ROI'],
      ...xlsxChannels.map((channel: any) => [
        channel.name || channel.channel,
        channel.budget || channel.budgetAllocation || 0,
        channel.percentage || channel.budgetPercentage || 0,
        channel.focus || channel.rationale || '',
        channel.expectedROI || channel.expectedROI || '',
      ]),
      [''],
      ['Total Budget', (strategy as any).budget?.total || (strategy as any).budgetBreakdown?.totalBudget || 0],
      ['Allocated Budget', (strategy as any).budget?.allocated || 0],
      ['Contingency', (strategy as any).budget?.contingency || (strategy as any).budgetBreakdown?.contingency || 0],
    ];

    const channelsSheet = XLSX.utils.aoa_to_sheet(channelsData);
    XLSX.utils.book_append_sheet(workbook, channelsSheet, 'Budget & Channels');

    // Timeline Sheet
    const xlsxTimeline = (strategy as any).timeline || (strategy as any).implementationTimeline || [];
    const xlsxTimelineArray = Array.isArray(xlsxTimeline) ? xlsxTimeline : (xlsxTimeline.phases || []);
    const timelineData = [
      ['Implementation Timeline'],
      ['Phase', 'Name', 'Duration', 'Activities', 'Deliverables'],
      ...xlsxTimelineArray.map((phase: any, index: number) => [
        `Phase ${index + 1}`,
        phase.name || phase.phase,
        phase.duration,
        (phase.activities || []).join('; '),
        (phase.deliverables || []).join('; '),
      ]),
    ];

    const timelineSheet = XLSX.utils.aoa_to_sheet(timelineData);
    XLSX.utils.book_append_sheet(workbook, timelineSheet, 'Timeline');

    // KPIs Sheet
    const kpiData = [
      ['Key Performance Indicators'],
      ['Metric', 'Target', 'Timeframe', 'Measurement Method'],
      ...((strategy as any).kpis || []).map((kpi: any) => [
        kpi.metric,
        kpi.target,
        kpi.timeframe || 'N/A',
        kpi.measurementMethod || '',
      ]),
    ];

    const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');

    // Content Strategy Sheet
    const contentData = [
      ['Content Strategy'],
      ['Themes', ((strategy as any).contentStrategy?.themes || (strategy as any).contentStrategy?.contentThemes || []).join('; ')],
      ['Content Types', ((strategy as any).contentStrategy?.types || (strategy as any).contentStrategy?.contentPillars?.map((p: any) => p.pillar) || []).join('; ')],
      [''],
      ['Recommendations'],
      ['Title', 'Description', 'Priority'],
      ...((strategy as any).recommendations || []).map((rec: any) => [
        rec.title,
        rec.description,
        rec.priority || 'Medium',
      ]),
    ];

    const contentSheet = XLSX.utils.aoa_to_sheet(contentData);
    XLSX.utils.book_append_sheet(workbook, contentSheet, 'Content & Recommendations');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return {
      buffer,
      filename: `${businessName.replace(/[^a-zA-Z0-9]/g, '_')}_Marketing_Strategy.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }
}
