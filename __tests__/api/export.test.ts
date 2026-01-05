/**
 * @vitest-environment node
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { POST as exportStrategy } from '@/app/api/strategies/[id]/export/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { ExportService } from '@/lib/services/export-service';

// Mock dependencies
vi.mock('next-auth');
vi.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
        },
        marketingStrategy: {
            findFirst: vi.fn(),
        },
        userActivity: {
            create: vi.fn(),
        },
    },
}));

vi.mock('@/lib/services/export-service', () => ({
    ExportService: {
        exportStrategy: vi.fn(),
    },
}));

const mockGetServerSession = getServerSession as vi.MockedFunction<typeof getServerSession>;
const mockPrisma = prisma as vi.Mocked<typeof prisma>;
const mockExportService = ExportService as vi.Mocked<typeof ExportService>;

describe('Export Feature Tests', () => {
    const mockUser = {
        id: 'user-123',
        email: 'pro@example.com',
        name: 'Pro User',
        role: 'USER',
    };

    const mockSession = {
        user: mockUser,
        expires: '2024-12-31',
    };

    const mockStrategy = {
        id: 'strategy-123',
        userId: mockUser.id,
        input: JSON.stringify({
            businessName: 'Test Business',
            industry: 'Tech',
            targetAudience: 'Tech professionals',
            budget: 50000,
            objectives: ['Increase sales'],
            timeframe: '6-months',
            currentChallenges: 'Competition',
        }),
        output: JSON.stringify({
            executiveSummary: { summary: 'Test summary' },
            targetAudience: { segments: [{ name: 'Segment 1', description: 'Description' }] },
            channelStrategy: { channels: [{ name: 'Social Media', budget: 10000 }] },
            implementationTimeline: { phases: [{ name: 'Phase 1', duration: '1 month', activities: ['Activity 1'] }] },
            kpiFramework: { kpis: [{ metric: 'Sales', target: '100' }] },
        }),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Subscription Checks', () => {
        it('should allow PRO user to export strategy', async () => {
            mockGetServerSession.mockResolvedValue(mockSession);

            mockPrisma.user.findUnique.mockResolvedValue({
                id: mockUser.id,
                email: mockUser.email,
                subscription: {
                    plan: 'PRO',
                    status: 'ACTIVE',
                },
            } as any);

            mockPrisma.marketingStrategy.findFirst.mockResolvedValue(mockStrategy as any);

            mockExportService.exportStrategy.mockResolvedValue({
                buffer: Buffer.from('test'),
                filename: 'test.pptx',
                mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            });

            mockPrisma.userActivity.create.mockResolvedValue({} as any);

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'pptx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'pptx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });

            expect(response.status).toBe(200);
            expect(mockExportService.exportStrategy).toHaveBeenCalled();
            expect(mockPrisma.userActivity.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        action: 'EXPORT_STRATEGY',
                        entityType: 'STRATEGY',
                    }),
                })
            );
        });

        it('should allow ENTERPRISE user to export strategy', async () => {
            mockGetServerSession.mockResolvedValue(mockSession);

            mockPrisma.user.findUnique.mockResolvedValue({
                id: mockUser.id,
                email: mockUser.email,
                subscription: {
                    plan: 'ENTERPRISE',
                    status: 'ACTIVE',
                },
            } as any);

            mockPrisma.marketingStrategy.findFirst.mockResolvedValue(mockStrategy as any);

            mockExportService.exportStrategy.mockResolvedValue({
                buffer: Buffer.from('test'),
                filename: 'test.docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            mockPrisma.userActivity.create.mockResolvedValue({} as any);

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'docx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'docx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });

            expect(response.status).toBe(200);
        });

        it('should deny FREE user from exporting strategy', async () => {
            mockGetServerSession.mockResolvedValue(mockSession);

            mockPrisma.user.findUnique.mockResolvedValue({
                id: mockUser.id,
                email: mockUser.email,
                subscription: {
                    plan: 'FREE',
                    status: 'ACTIVE',
                },
            } as any);

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'pptx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'pptx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.success).toBe(false);
            expect(data.upgradeRequired).toBe(true);
            expect(data.message).toContain('PRO and ENTERPRISE');
        });

        it('should deny user with no subscription from exporting', async () => {
            mockGetServerSession.mockResolvedValue(mockSession);

            mockPrisma.user.findUnique.mockResolvedValue({
                id: mockUser.id,
                email: mockUser.email,
                subscription: null,
            } as any);

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'pptx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'pptx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.upgradeRequired).toBe(true);
        });
    });

    describe('Export Formats', () => {
        beforeEach(() => {
            mockGetServerSession.mockResolvedValue(mockSession);
            mockPrisma.user.findUnique.mockResolvedValue({
                id: mockUser.id,
                email: mockUser.email,
                subscription: { plan: 'PRO', status: 'ACTIVE' },
            } as any);
            mockPrisma.marketingStrategy.findFirst.mockResolvedValue(mockStrategy as any);
            mockPrisma.userActivity.create.mockResolvedValue({} as any);
        });

        it('should export strategy as PPTX', async () => {
            mockExportService.exportStrategy.mockResolvedValue({
                buffer: Buffer.from('pptx content'),
                filename: 'Test_Business_Marketing_Strategy.pptx',
                mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            });

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'pptx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'pptx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });

            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toContain('presentationml');
            expect(response.headers.get('Content-Disposition')).toContain('.pptx');
        });

        it('should export strategy as DOCX', async () => {
            mockExportService.exportStrategy.mockResolvedValue({
                buffer: Buffer.from('docx content'),
                filename: 'Test_Business_Marketing_Strategy.docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'docx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'docx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });

            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toContain('wordprocessingml');
            expect(response.headers.get('Content-Disposition')).toContain('.docx');
        });

        it('should export strategy as XLSX', async () => {
            mockExportService.exportStrategy.mockResolvedValue({
                buffer: Buffer.from('xlsx content'),
                filename: 'Test_Business_Marketing_Strategy.xlsx',
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'xlsx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'xlsx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });

            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toContain('spreadsheetml');
            expect(response.headers.get('Content-Disposition')).toContain('.xlsx');
        });

        it('should reject invalid export format', async () => {
            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'pdf' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'pdf' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.message).toContain('Invalid export format');
        });
    });

    describe('Strategy Access Control', () => {
        beforeEach(() => {
            mockGetServerSession.mockResolvedValue(mockSession);
            mockPrisma.user.findUnique.mockResolvedValue({
                id: mockUser.id,
                email: mockUser.email,
                subscription: { plan: 'PRO', status: 'ACTIVE' },
            } as any);
        });

        it('should deny export if strategy not found', async () => {
            mockPrisma.marketingStrategy.findFirst.mockResolvedValue(null);

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/non-existent/export',
                body: { format: 'pptx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'pptx' });

            const response = await exportStrategy(req, { params: { id: 'non-existent' } });
            const data = await response.json();

            expect(response.status).toBe(404);
            expect(data.message).toContain('not found or access denied');
        });

        it('should deny export if strategy has no output', async () => {
            mockPrisma.marketingStrategy.findFirst.mockResolvedValue({
                ...mockStrategy,
                output: null,
            } as any);

            const { req } = createMocks({
                method: 'POST',
                url: 'http://localhost:3000/api/strategies/strategy-123/export',
                body: { format: 'pptx' },
            });
            req.json = vi.fn().mockResolvedValue({ format: 'pptx' });

            const response = await exportStrategy(req, { params: { id: 'strategy-123' } });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.message).toContain('no generated output');
        });
    });

    describe('Activity Logging', () => {
        it('should log export activity for each format', async () => {
            mockGetServerSession.mockResolvedValue(mockSession);
            mockPrisma.user.findUnique.mockResolvedValue({
                id: mockUser.id,
                email: mockUser.email,
                subscription: { plan: 'PRO', status: 'ACTIVE' },
            } as any);
            mockPrisma.marketingStrategy.findFirst.mockResolvedValue(mockStrategy as any);
            mockExportService.exportStrategy.mockResolvedValue({
                buffer: Buffer.from('test'),
                filename: 'test.pptx',
                mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            });
            mockPrisma.userActivity.create.mockResolvedValue({} as any);

            const formats = ['pptx', 'docx', 'xlsx'];

            for (const format of formats) {
                const { req } = createMocks({
                    method: 'POST',
                    url: `http://localhost:3000/api/strategies/strategy-123/export`,
                    body: { format },
                });
                req.json = vi.fn().mockResolvedValue({ format });

                await exportStrategy(req, { params: { id: 'strategy-123' } });

                expect(mockPrisma.userActivity.create).toHaveBeenCalledWith({
                    data: {
                        userId: mockUser.id,
                        action: 'EXPORT_STRATEGY',
                        entityType: 'STRATEGY',
                        entityId: 'strategy-123',
                        details: JSON.stringify({ format }),
                    },
                });
            }
        });
    });
});
