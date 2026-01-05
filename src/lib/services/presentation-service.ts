import PptxGenJS from 'pptxgenjs';
import { EnhancedStrategyInput } from '@/lib/validations/enhanced-strategy';

export class PresentationService {
    private pptx: PptxGenJS;

    constructor() {
        this.pptx = new PptxGenJS();
        this.setupTheme();
    }

    private setupTheme() {
        this.pptx.layout = 'LAYOUT_16x9';
        this.pptx.theme = { headFontFace: 'Arial', bodyFontFace: 'Arial' };
    }

    public async generateStrategyPresentation(data: EnhancedStrategyInput, strategyContent: any): Promise<Buffer> {
        // 1. Title Slide
        this.createTitleSlide(data.businessName, 'Comprehensive Marketing Strategy');

        // 2. Executive Summary
        this.createContentSlide('Executive Summary', [
            'This strategy outlines a comprehensive approach to achieve your marketing objectives.',
            `Focus Area: ${data.industry} Industry`,
            `Target Audience: ${data.targetAudience}`,
            `Primary Goal: ${data.primaryKPI}`,
        ]);

        // 3. Market Analysis
        this.createContentSlide('Market Context', [
            `Market Maturity: ${data.targetMarketMaturity}`,
            `Competitive Landscape: ${data.competitiveLandscape}`,
            `Geographic Scope: ${data.geographicScope}`,
        ]);

        // 4. Objectives & KPIs
        this.createContentSlide('Objectives & KPIs', [
            'Primary Objective:',
            `• ${data.primaryKPI}`,
            '',
            'Secondary Objectives:',
            ...(data.marketingObjectives || []).map(obj => `• ${obj}`),
            '',
            'Key Performance Indicators:',
            ...(data.secondaryKPIs || []).map(kpi => `• ${kpi}`),
        ]);

        // 5. Strategy Overview (from AI content)
        if (strategyContent?.executiveSummary) {
            this.createContentSlide('Strategy Overview', [strategyContent.executiveSummary]);
        }

        // 6. Channel Strategy
        this.createChannelSlide('Channel Strategy & Budget', data.preferredChannels || [], strategyContent?.budgetAllocation);

        // 7. Implementation Plan
        this.createTimelineSlide('Implementation Timeline', strategyContent?.implementationTimeline);

        // 8. Next Steps
        this.createContentSlide('Next Steps', [
            '1. Review and approve strategy',
            '2. Set up necessary tools and accounts',
            '3. Begin Phase 1 implementation',
        ]);

        // Generate Buffer
        return (await this.pptx.write({ outputType: 'nodebuffer' })) as Buffer;
    }

    private createTitleSlide(title: string, subtitle: string) {
        const slide = this.pptx.addSlide();
        slide.background = { color: 'FFFFFF' };
        slide.addText(title, {
            x: 1, y: 2.5, w: '80%', h: 1,
            fontSize: 44, color: '000000', bold: true, align: 'left', fontFace: 'Arial'
        });
        slide.addText(subtitle, {
            x: 1, y: 3.5, w: '80%', h: 1,
            fontSize: 24, color: '666666', align: 'left', fontFace: 'Arial'
        });
        // Minimalist accent line
        slide.addShape(this.pptx.ShapeType.rect, { x: 1, y: 2.2, w: 1, h: 0.1, fill: { color: '000000' } });
    }

    private createContentSlide(title: string, bullets: string[]) {
        const slide = this.pptx.addSlide();
        slide.background = { color: 'FFFFFF' };

        // Header
        slide.addText(title, {
            x: 0.5, y: 0.5, w: '90%', h: 0.5,
            fontSize: 28, color: '000000', bold: true, fontFace: 'Arial'
        });
        slide.addShape(this.pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 0.5, h: 0.05, fill: { color: '000000' } });

        // Content
        slide.addText(bullets.map(b => ({ text: b, options: { breakLine: true } })), {
            x: 0.5, y: 1.5, w: '90%', h: 5,
            fontSize: 16, color: '333333', lineSpacing: 28, fontFace: 'Arial',
            bullet: { type: 'number', code: '2022' }
        });
    }

    private createChannelSlide(title: string, channels: string[], budget: any) {
        const slide = this.pptx.addSlide();
        slide.background = { color: 'FFFFFF' };

        slide.addText(title, {
            x: 0.5, y: 0.5, w: '90%', h: 0.5,
            fontSize: 28, color: '000000', bold: true, fontFace: 'Arial'
        });
        slide.addShape(this.pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 0.5, h: 0.05, fill: { color: '000000' } });

        // Table Data
        const rows: any[] = [
            [
                { text: 'Channel', options: { bold: true, fill: { color: 'F5F5F5' } } },
                { text: 'Focus', options: { bold: true, fill: { color: 'F5F5F5' } } },
            ]
        ];

        channels.forEach(ch => {
            rows.push([
                { text: ch, options: { fill: { color: 'FFFFFF' } } },
                { text: 'High Priority', options: { fill: { color: 'FFFFFF' } } } // Placeholder, ideally from strategyContent
            ]);
        });

        slide.addTable(rows, {
            x: 0.5, y: 1.5, w: 9,
            colW: [3, 6],
            border: { pt: 1, color: 'E0E0E0' },
            fontSize: 14, fontFace: 'Arial'
        });
    }

    private createTimelineSlide(title: string, timeline: any) {
        const slide = this.pptx.addSlide();
        slide.background = { color: 'FFFFFF' };

        slide.addText(title, {
            x: 0.5, y: 0.5, w: '90%', h: 0.5,
            fontSize: 28, color: '000000', bold: true, fontFace: 'Arial'
        });
        slide.addShape(this.pptx.ShapeType.rect, { x: 0.5, y: 1.1, w: 0.5, h: 0.05, fill: { color: '000000' } });

        if (timeline?.phases) {
            let y = 1.5;
            timeline.phases.forEach((phase: any, i: number) => {
                slide.addText(`Phase ${i + 1}: ${phase.name}`, {
                    x: 0.5, y: y, w: 9, h: 0.4,
                    fontSize: 16, bold: true, color: '000000'
                });
                slide.addText(`Duration: ${phase.duration} | Activities: ${phase.activities.join(', ')}`, {
                    x: 0.5, y: y + 0.4, w: 9, h: 0.4,
                    fontSize: 12, color: '666666'
                });
                y += 1.2;
            });
        }
    }
}
