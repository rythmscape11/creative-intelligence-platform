import { OpenAI } from 'openai';

// Define the strict schema for the output
export interface ComplianceSummary {
    risk_score_1_10: number;
    actionable_steps: string[];
}

/**
 * Generates a cost-optimized regulatory compliance summary.
 * Enforces JSON output to minimize tokens.
 */
export async function generateComplianceSummary(
    industry: string,
    region: string,
    businessSize: string,
    userId: string
): Promise<ComplianceSummary> {
    // Initialize OpenAI client (in production, this would call the CMS Governor proxy)
    const openai = new OpenAI({
        apiKey: (process.env.OPENAI_API_KEY || '').trim(),
        // baseURL: process.env.CMS_GOVERNOR_URL // Uncomment to route through Governor
    });

    // Import GovernorService dynamically
    const { GovernorService } = await import('@/lib/governor');

    const systemPrompt = `
You are a Regulatory Compliance Expert.
You must practice extreme token minimization.
Your output must be strictly JSON and contain no conversational filler.
You must adhere to the following schema:
{
  "risk_score_1_10": number,
  "actionable_steps": [string]
}
`;

    const userPrompt = `Generate a compliance summary for a ${businessSize} business in the ${industry} industry located in ${region}.`;
    const model = 'gpt-3.5-turbo-0125';

    try {
        const response = await openai.chat.completions.create({
            model: model, // Use a cheaper model for frugality
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' }, // Enforce JSON mode
            temperature: 0.3, // Low temperature for consistent, factual output
            max_tokens: 150, // Strict token limit
        });

        const content = response.choices[0].message.content;

        // Track usage
        if (response.usage) {
            await GovernorService.trackUsage(
                userId,
                model,
                response.usage.prompt_tokens,
                response.usage.completion_tokens,
                'compliance-tool'
            );
        }

        if (!content) {
            throw new Error('No content generated');
        }

        const result = JSON.parse(content) as ComplianceSummary;
        return result;
    } catch (error) {
        console.error('Error generating compliance summary:', error);
        // Fallback for error handling
        return {
            risk_score_1_10: 0,
            actionable_steps: ['Error generating report. Please try again.'],
        };
    }
}
