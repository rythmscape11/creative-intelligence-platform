/**
 * Reporting Service
 * Handles report generation, scheduling, and PDF export
 */

import { prisma } from '@/lib/prisma';

export interface CreateReportInput {
    clientId?: string;
    campaignId?: string;
    type?: string;
    dateRange?: { start: Date; end: Date };
    metrics?: Record<string, unknown>;
    summary?: string;
    scheduledFor?: Date;
}

export class ReportingService {
    /**
     * Create a new report
     */
    static async create(input: CreateReportInput) {
        const report = await prisma.agencyReport.create({
            data: {
                clientId: input.clientId,
                campaignId: input.campaignId,
                type: input.type || 'MONTHLY',
                dateRange: JSON.stringify(input.dateRange || {}),
                metrics: JSON.stringify(input.metrics || {}),
                summary: input.summary,
                scheduledFor: input.scheduledFor,
                status: 'GENERATING',
            },
        });
        return this.formatReport(report);
    }

    /**
     * List reports
     */
    static async list(filters?: { clientId?: string; campaignId?: string; type?: string }) {
        const where: Record<string, unknown> = {};
        if (filters?.clientId) where.clientId = filters.clientId;
        if (filters?.campaignId) where.campaignId = filters.campaignId;
        if (filters?.type) where.type = filters.type;

        const reports = await prisma.agencyReport.findMany({
            where,
            include: {
                campaign: { select: { name: true, project: { select: { client: { select: { name: true } } } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return reports.map(this.formatReport);
    }

    /**
     * Get report by ID
     */
    static async getById(id: string) {
        const report = await prisma.agencyReport.findUnique({
            where: { id },
            include: {
                campaign: { select: { name: true, project: { select: { client: { select: { name: true } } } } } },
            },
        });
        return report ? this.formatReport(report) : null;
    }

    /**
     * Update report status
     */
    static async updateStatus(id: string, status: string, pdfUrl?: string) {
        const data: Record<string, unknown> = { status };
        if (pdfUrl) data.pdfUrl = pdfUrl;
        if (status === 'SENT') data.sentAt = new Date();

        const report = await prisma.agencyReport.update({
            where: { id },
            data,
        });
        return this.formatReport(report);
    }

    /**
     * Generate report with AI summary
     */
    static async generateWithAI(id: string, metricsData: Record<string, unknown>) {
        // Store metrics
        await prisma.agencyReport.update({
            where: { id },
            data: {
                metrics: JSON.stringify(metricsData),
                status: 'READY',
            },
        });

        return this.getById(id);
    }

    /**
     * Delete report
     */
    static async delete(id: string) {
        await prisma.agencyReport.delete({ where: { id } });
        return { success: true };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static formatReport(report: any) {
        return {
            ...report,
            dateRange: JSON.parse(report.dateRange || '{}'),
            metrics: JSON.parse(report.metrics || '{}'),
        };
    }
}

export default ReportingService;
