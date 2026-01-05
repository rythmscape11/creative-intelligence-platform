import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { CompetitionAnalysisService } from '@/lib/services/competition-analysis-service';
import { prisma } from '@/lib/prisma';

// Using Node.js Serverless Runtime (60s timeout) instead of Edge (30s)

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { competitors, industry, focusArea, mode, marketData, competitorData } = body;

        // Mode-based routing for Multi-Stage Pipeline
        if (mode === 'MARKET') {
            const result = await CompetitionAnalysisService.analyzeMarket(industry, 'Global'); // Default to Global for now
            return NextResponse.json(result);
        }

        if (mode === 'COMPETITOR') {
            // Expects a single competitor object in the 'competitors' array (or a specific 'competitor' field)
            const competitor = competitors[0];
            if (!competitor) return NextResponse.json({ error: 'No competitor provided' }, { status: 400 });

            const result = await CompetitionAnalysisService.analyzeCompetitor(competitor);
            return NextResponse.json(result);
        }

        if (mode === 'SYNTHESIS') {
            if (!marketData || !competitorData) return NextResponse.json({ error: 'Missing data for synthesis' }, { status: 400 });

            const result = await CompetitionAnalysisService.synthesizeReport(marketData, competitorData);

            // Reconstruct full object to save
            const fullReport = {
                ...result,
                marketData: marketData.marketData, // Assuming structure
                competitorInsights: competitorData,
                industryNews: marketData.industryNews, // Assuming structure
                keywordTrends: marketData.keywordTrends // Assuming structure
            };

            // Save Report
            const report = await prisma.competitionReport.create({
                data: {
                    userId,
                    industry: marketData.industry || 'Unknown',
                    focusArea: 'Synthesis',
                    competitors: JSON.stringify(competitorData.map((c: any) => c.name)),
                    result: JSON.stringify(fullReport)
                }
            });

            return NextResponse.json({ ...result, id: report.id });
        }

        // Legacy / Default Behavior (Monolithic)
        if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
            return NextResponse.json({ error: 'Competitors list is required' }, { status: 400 });
        }
        if (!industry) {
            return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
        }

        // Ensure competitors are in the correct format
        const formattedCompetitors = competitors.map((c: any) => ({
            name: typeof c === 'string' ? c : c.name,
            url: typeof c === 'string' ? undefined : c.url
        }));

        const result = await CompetitionAnalysisService.analyze({
            competitors: formattedCompetitors,
            industry,
            focusArea,
        });

        // Save to Database
        const report = await prisma.competitionReport.create({
            data: {
                userId,
                industry,
                focusArea,
                competitors: JSON.stringify(formattedCompetitors),
                result: JSON.stringify(result)
            }
        });

        return NextResponse.json({ ...result, id: report.id });
    } catch (error: any) {
        console.error('Edge API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
