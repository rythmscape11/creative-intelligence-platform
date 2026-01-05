/**
 * Document Export API
 * Generates professional PDF, DOCX, PPTX exports using FREE open-source libraries
 * No external API costs!
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { FreeDocumentExportService, ExportFormat, StrategyData } from '@/lib/exports/document-export-service';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { strategyId, format = 'pdf', data: providedData } = body as {
            strategyId?: string;
            format?: ExportFormat;
            data?: StrategyData;
        };

        // Fetch strategy if ID provided
        let strategyData: StrategyData = providedData || { title: 'Marketing Strategy' };

        if (strategyId) {
            const strategy = await prisma.strategy.findUnique({
                where: { id: strategyId, userId },
            });

            if (!strategy) {
                return NextResponse.json({ error: 'Strategy not found' }, { status: 404 });
            }

            strategyData = {
                title: strategy.title,
                businessName: strategy.businessName || undefined,
                industry: strategy.industry || undefined,
                budget: strategy.budget ? Number(strategy.budget) : undefined,
                executiveSummary: strategy.executiveSummary || undefined,
                targetAudience: strategy.targetAudience || undefined,
                objectives: strategy.objectives as string[] || [],
                channels: strategy.channels as any || [],
                tactics: strategy.tactics as string[] || [],
                kpis: strategy.kpis as string[] || [],
                timeline: strategy.timeline || undefined,
                createdAt: strategy.createdAt,
            };
        }

        // Generate document using FREE open-source libraries
        const result = await FreeDocumentExportService.export(strategyData, format);

        if (!result.success) {
            return NextResponse.json({
                error: 'Export failed',
                message: result.error,
            }, { status: 500 });
        }

        // Log export for analytics
        try {
            console.log(`Export: user=${userId}, strategy=${strategyId}, format=${format}`);
        } catch (e) {
            // Ignore logging errors
        }

        return NextResponse.json({
            success: true,
            fileName: result.fileName,
            dataUri: result.dataUri,
            format,
            method: 'free-local-generation',
        });

    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({
            error: 'Export failed',
            message: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    // Return export service status - all FREE!
    return NextResponse.json({
        status: 'ready',
        method: 'free-local-generation',
        message: 'Using open-source libraries - no API costs!',
        supportedFormats: {
            pdf: { available: true, library: 'jsPDF' },
            docx: { available: true, library: 'docx' },
            pptx: { available: true, library: 'pptxgenjs' },
        },
        features: [
            'Professional formatted documents',
            'Tables and charts',
            'Branded colors and styling',
            'No external API calls',
            'Works offline',
            'Unlimited exports',
        ],
    });
}
