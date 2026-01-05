import { getGenerativeModel } from '@/lib/gcp/vertex';

export const generateCreativeBrief = async (
    clientName: string,
    projectName: string,
    objective: string,
    audience: string,
    keyMessage: string
) => {
    const model = getGenerativeModel();
    if (!model) throw new Error('AI Model not configured');

    const prompt = `
    You are an expert Creative Director at a top-tier ad agency.
    Create a detailed creative brief for the following project:
    
    Client: ${clientName}
    Project: ${projectName}
    Objective: ${objective}
    Target Audience: ${audience}
    Key Message: ${keyMessage}

    Output the brief in JSON format with the following structure:
    {
      "title": "Creative Brief: ${projectName}",
      "background": "...",
      "challenge": "...",
      "insight": "...",
      "idea": "...",
      "deliverables": ["...", "..."],
      "brandTone": "..."
    }
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0].content.parts[0].text;

    // Basic cleaning of markdown code blocks if present
    const jsonStr = text?.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(jsonStr || '{}');
    } catch (e) {
        console.error('Failed to parse AI response', e);
        return { error: 'Failed to generate valid JSON', raw: text };
    }
};

export const draftMediaPlan = async (
    budget: number,
    currency: string,
    duration: string,
    objective: string,
    targetAudience: string
) => {
    const model = getGenerativeModel();
    if (!model) throw new Error('AI Model not configured');

    const prompt = `
    You are a Media Planning Director.
    Create a high-level media plan for a budget of ${currency} ${budget} over ${duration}.
    Objective: ${objective}
    Target Audience: ${targetAudience}

    Allocate the budget across suitable channels (Meta, Google, LinkedIn, TikTok, Programmatic, etc.) based on the objective using Pareto principle (80% on proven performers).

    Output in JSON format:
    {
      "summary": "...",
      "totalBudget": ${budget},
      "channels": [
        {
          "channel": "...",
          "allocation": 0,
          "rationale": "...",
          "kpis": ["...", "..."]
        }
      ],
      "estimatedResults": {
        "impressions": "...",
        "clicks": "...",
        "conversions": "..."
      }
    }
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.candidates?.[0].content.parts[0].text;

    const jsonStr = text?.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(jsonStr || '{}');
    } catch (e) {
        return { error: 'Failed to parse media plan', raw: text };
    }
};
