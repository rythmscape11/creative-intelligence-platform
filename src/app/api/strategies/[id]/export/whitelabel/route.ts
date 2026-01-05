import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { ExportService } from '@/lib/services/export-service';
import { canAccessFeature } from '@/config/pricing';

// POST /api/strategies/[id]/export/whitelabel - Export strategy with agency branding
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                subscription: {
                    select: {
                        plan: true,
                        status: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has AGENCY or ENTERPRISE subscription for white-label
        const userPlan = user.subscription?.plan || 'FREE';

        if (!canAccessFeature(userPlan as any, 'whiteLabel')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'White-label exports require Agency or Enterprise plan',
                    upgradeRequired: true,
                    requiredPlan: 'AGENCY',
                },
                { status: 403 }
            );
        }

        // Fetch agency branding settings
        const branding = await prisma.agencyBranding.findUnique({
            where: { userId },
        });

        // Check if strategy exists and user has access
        const strategy = await prisma.marketingStrategy.findFirst({
            where: {
                id,
                OR: [
                    { userId: user.id },
                    {
                        shares: {
                            some: {
                                isActive: true,
                                OR: [
                                    { sharedWith: user.email },
                                    { sharedWith: null },
                                ],
                            },
                        },
                    },
                ],
            },
        });

        if (!strategy) {
            return NextResponse.json(
                { success: false, message: 'Strategy not found or access denied' },
                { status: 404 }
            );
        }

        const body = await req.json();
        const {
            format = 'pptx',
            clientWorkspaceId,
            overrideBranding
        } = body;

        if (!['pptx', 'docx', 'xlsx', 'pdf'].includes(format)) {
            return NextResponse.json(
                { success: false, message: 'Invalid export format. Supported: pptx, docx, xlsx, pdf' },
                { status: 400 }
            );
        }

        // Parse strategy data
        const input = JSON.parse(strategy.input);
        const output = strategy.output ? JSON.parse(strategy.output) : null;

        if (!output) {
            return NextResponse.json(
                { success: false, message: 'Strategy has no generated output' },
                { status: 400 }
            );
        }

        // Build white-label customization
        let whiteLabelConfig: any = {
            hideMediaPlanPro: true,
            theme: 'agency',
        };

        // Apply agency branding if available
        if (branding) {
            whiteLabelConfig = {
                ...whiteLabelConfig,
                logoUrl: branding.logoUrl,
                logoLightUrl: branding.logoLightUrl,
                primaryColor: branding.primaryColor,
                secondaryColor: branding.secondaryColor,
                accentColor: branding.accentColor,
                headingFont: branding.headingFont,
                bodyFont: branding.bodyFont,
                customFooterText: branding.customFooterText,
                pdfHeaderHtml: branding.pdfHeaderHtml,
                pdfFooterHtml: branding.pdfFooterHtml,
            };
        }

        // If exporting for a specific client workspace, apply client branding overrides
        if (clientWorkspaceId) {
            const clientWorkspace = await prisma.clientWorkspace.findFirst({
                where: {
                    id: clientWorkspaceId,
                    ownerId: userId,
                    isActive: true,
                },
            });

            if (clientWorkspace) {
                // Override with client-specific branding
                if (clientWorkspace.clientLogoUrl) {
                    whiteLabelConfig.logoUrl = clientWorkspace.clientLogoUrl;
                }
                if (clientWorkspace.primaryColor) {
                    whiteLabelConfig.primaryColor = clientWorkspace.primaryColor;
                }
                if (clientWorkspace.secondaryColor) {
                    whiteLabelConfig.secondaryColor = clientWorkspace.secondaryColor;
                }
                whiteLabelConfig.clientName = clientWorkspace.clientName;
                whiteLabelConfig.clientCompany = clientWorkspace.clientCompany;
            }
        }

        // Apply any override branding from the request
        if (overrideBranding) {
            whiteLabelConfig = { ...whiteLabelConfig, ...overrideBranding };
        }

        // Prepare strategy data for export
        let strategyData;

        // Check if this is an enhanced strategy
        if ('targetAudiencePersonas' in output) {
            // Enhanced Strategy Mapping
            strategyData = {
                input,
                output,
                executiveSummary: output.executiveSummary?.overview || '',
                targetAudience: output.targetAudiencePersonas || [],
                channels: output.channelStrategy || [],
                tactics: output.contentStrategy?.contentPillars || [],
                budget: output.budgetBreakdown || {},
                timeline: output.implementationTimeline || [],
                kpis: (output.marketingObjectivesAndKPIs || []).flatMap((obj: any) =>
                    (obj.primaryMetrics || []).map((metric: string, i: number) => ({
                        metric,
                        target: obj.targetValues?.[i] || 'N/A',
                        timeframe: obj.timeline || 'N/A'
                    }))
                ),
            };
        } else {
            // Basic Strategy Mapping (Legacy)
            strategyData = {
                input,
                output,
                executiveSummary: output.executiveSummary?.summary || '',
                targetAudience: output.targetAudience?.segments || [],
                channels: output.channelStrategy?.channels || [],
                tactics: output.contentStrategy?.contentPillars || [],
                budget: output.budgetAllocation || {},
                timeline: output.implementationTimeline?.phases || [],
                kpis: output.kpiFramework?.kpis || [],
            };
        }

        const businessName = input.businessName || whiteLabelConfig.clientCompany || 'Business';

        // Export strategy with white-label customization
        const result = await ExportService.exportStrategy(
            strategyData,
            businessName,
            {
                format: format as 'pptx' | 'docx' | 'xlsx',
                customization: whiteLabelConfig,
            }
        );

        // Log activity
        await prisma.userActivity.create({
            data: {
                userId: user.id,
                action: 'EXPORT_STRATEGY_WHITELABEL',
                entityType: 'STRATEGY',
                entityId: id,
                details: JSON.stringify({
                    format,
                    clientWorkspaceId,
                    brandingApplied: !!branding
                }),
            },
        });

        // If exporting for a client workspace, update the client strategy
        if (clientWorkspaceId) {
            await prisma.clientStrategy.upsert({
                where: {
                    id: `${clientWorkspaceId}_${id}`,
                },
                create: {
                    id: `${clientWorkspaceId}_${id}`,
                    workspaceId: clientWorkspaceId,
                    name: strategy.name || businessName,
                    input: strategy.input,
                    output: strategy.output || '',
                    status: 'EXPORTED',
                    exportedAt: new Date(),
                    brandingApplied: true,
                },
                update: {
                    exportedAt: new Date(),
                    brandingApplied: true,
                },
            });
        }

        // Return file as download
        return new NextResponse(result.buffer as unknown as BodyInit, {
            headers: {
                'Content-Type': result.mimeType,
                'Content-Disposition': `attachment; filename="${result.filename}"`,
                'Content-Length': result.buffer.length.toString(),
            },
        });
    } catch (error) {
        console.error('White-label export error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to export strategy', error: String(error) },
            { status: 500 }
        );
    }
}
