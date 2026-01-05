import { getGenerativeModel } from '@/lib/gcp/vertex';

export interface ReportData {
    clientName: string;
    projectName: string;
    period: string;
    metrics: {
        impressions?: number;
        clicks?: number;
        conversions?: number;
        spend?: number;
    };
    highlights: string[];
    issues: string[];
}

export const generateClientReport = async (data: ReportData) => {
    const model = getGenerativeModel();
    if (!model) throw new Error('AI Model not configured');

    const prompt = `
    You are a Senior Account Manager.
    Write a professional Monthly Performance Report for:
    Client: ${data.clientName}
    Project: ${data.projectName}
    Period: ${data.period}

    Key Metrics:
    - Impressions: ${data.metrics.impressions}
    - Clicks: ${data.metrics.clicks}
    - Conversions: ${data.metrics.conversions}
    - Spend: $${data.metrics.spend}

    Highlights: ${data.highlights.join(', ')}
    Issues/Challenges: ${data.issues.join(', ')}

    Output in JSON format suitable for a slide deck or PDF:
    {
      "executiveSummary": "...",
      "keyAchievements": ["...", "..."],
      "performanceAnalysis": "...",
      "recommendations": ["...", "..."],
      "nextSteps": "..."
    }
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0].content.parts[0].text;

    const jsonStr = text?.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(jsonStr || '{}');
    } catch (e) {
        return { error: 'Failed to generate report', raw: text };
    }
};
