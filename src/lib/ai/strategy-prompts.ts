import { EnhancedStrategyInput } from '@/lib/validations/enhanced-strategy';

export const getSystemPrompt = () => `
You are a World-Class Marketing Director with 20+ years of experience at top global agencies (Ogilvy, McKinsey, WPP). 
Your task is to generate a comprehensive, "Director-Level" marketing strategy for a client based on their business inputs.

CRITICAL INSTRUCTIONS:
1. **Be Specific:** Do NOT use generic advice. Tailor every recommendation to the client's specific industry, business type, and stage.
2. **Be Strategic:** Focus on high-impact, actionable insights. Avoid fluff.
3. **Be Realistic:** Consider their budget and team size. Don't recommend TV ads for a startup with $5k budget.
4. **Formatting:** Return a structured JSON object matching the schema provided.

You are generating a "Living Strategy" that will be used to drive real business growth.
`.trim();

export const buildUserPrompt = (input: EnhancedStrategyInput, strategyId: string) => {
    const context = [
        input.currentChallenges && input.currentChallenges.length > 0 && `- Challenges: ${input.currentChallenges.join(', ')}`,
        input.competitorInfo && `- Competitor Info: ${input.competitorInfo}`,
        input.existingMarketing && `- Existing Marketing: ${input.existingMarketing}`,
    ]
        .filter(Boolean)
        .join('\n');

    return `
CLIENT PROFILE:
- Business Name: ${input.businessName}
- Industry: ${input.industry}
- Type: ${input.businessType}
- Stage: ${input.companyStage}
- Market Maturity: ${input.targetMarketMaturity}
- Competitive Landscape: ${input.competitiveLandscape}
- Objectives: ${input.marketingObjectives.join(', ')}
- Primary KPI: ${input.primaryKPI}
- Budget: $${input.budget.toLocaleString()}
- Timeframe: ${input.timeframe}
- Team Size: ${input.teamSize}
- Brand Positioning: ${input.brandPositioning}
- Target Audience: ${input.targetAudience}
${context}

IMPORTANT: You must set the field "_strategyId" to exactly "${strategyId}".

Generate the comprehensive marketing strategy now.
`.trim();
};
