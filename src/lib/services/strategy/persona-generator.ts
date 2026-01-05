/**
 * Persona Generator Module
 * Creates detailed marketing personas with psychographics
 */

import OpenAI from 'openai';
import { AICacheService } from '../ai-cache';
import { TokenLogger } from '../token-logger';
import { selectOptimalModel } from '../model-selector';
import type { PlanTier } from '@/config/tool-access';

export interface MarketingPersona {
    id: string;
    name: string;
    avatar: string; // emoji or description
    tagline: string;
    demographics: {
        ageRange: string;
        gender: string;
        location: string;
        income: string;
        education: string;
        occupation: string;
        familyStatus: string;
    };
    psychographics: {
        values: string[];
        interests: string[];
        lifestyle: string;
        personality: string[];
        motivations: string[];
        frustrations: string[];
    };
    behavior: {
        onlineBehavior: string[];
        purchaseBehavior: string[];
        decisionFactors: string[];
        brandAffinities: string[];
        mediaConsumption: string[];
    };
    journey: {
        awareness: string;
        consideration: string;
        decision: string;
        retention: string;
    };
    messaging: {
        tone: string;
        keyMessages: string[];
        objections: string[];
        objectionsResponses: string[];
    };
    channels: {
        primary: string[];
        secondary: string[];
        avoid: string[];
    };
    marketingTips: string[];
}

export interface PersonaSet {
    personas: MarketingPersona[];
    primaryPersona: string; // id of the most important persona
    segmentOverlap: string;
    recommendedApproach: string;
}

interface PersonaInput {
    businessName: string;
    industry: string;
    products: string[];
    pricePoint: string;
    currentCustomers: string;
    idealCustomerDescription: string;
    numberOfPersonas: number;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class PersonaGenerator {
    static async generate(
        input: PersonaInput,
        userId: string,
        userPlan: PlanTier
    ): Promise<PersonaSet> {
        const modelConfig = selectOptimalModel('strategy', userPlan);
        const numPersonas = Math.min(Math.max(input.numberOfPersonas, 1), 5);

        const prompt = `
You are a customer research expert creating detailed marketing personas.

Business: ${input.businessName}
Industry: ${input.industry}
Products/Services: ${input.products.join(', ')}
Price Point: ${input.pricePoint}
Current Customers: ${input.currentCustomers}
Ideal Customer: ${input.idealCustomerDescription}

Generate ${numPersonas} detailed marketing persona(s) in the following JSON format:
{
  "personas": [
    {
      "id": "persona-1",
      "name": "Creative name like 'Tech-Savvy Sarah'",
      "avatar": "emoji that represents them",
      "tagline": "One-line description",
      "demographics": {
        "ageRange": "25-34",
        "gender": "Female",
        "location": "Urban areas",
        "income": "$75,000-$100,000",
        "education": "Bachelor's degree",
        "occupation": "Marketing Manager",
        "familyStatus": "Married, no kids"
      },
      "psychographics": {
        "values": ["efficiency", "innovation"],
        "interests": ["technology", "productivity"],
        "lifestyle": "Busy professional lifestyle",
        "personality": ["ambitious", "detail-oriented"],
        "motivations": ["career growth", "making impact"],
        "frustrations": ["wasted time", "inefficient tools"]
      },
      "behavior": {
        "onlineBehavior": ["LinkedIn daily", "reads industry blogs"],
        "purchaseBehavior": ["research-driven", "reads reviews"],
        "decisionFactors": ["ROI", "ease of use", "support"],
        "brandAffinities": ["Apple", "Slack", "HubSpot"],
        "mediaConsumption": ["podcasts", "newsletters"]
      },
      "journey": {
        "awareness": "How they discover solutions",
        "consideration": "How they evaluate options",
        "decision": "What triggers purchase",
        "retention": "What keeps them loyal"
      },
      "messaging": {
        "tone": "Professional but friendly",
        "keyMessages": ["Save time", "Get results"],
        "objections": ["Is it worth the cost?"],
        "objectionsResponses": ["Show ROI calculator"]
      },
      "channels": {
        "primary": ["LinkedIn", "Email"],
        "secondary": ["Webinars", "Industry events"],
        "avoid": ["TikTok", "Traditional ads"]
      },
      "marketingTips": ["Focus on efficiency messaging", "Use case studies"]
    }
  ],
  "primaryPersona": "persona-1",
  "segmentOverlap": "Description of how personas overlap",
  "recommendedApproach": "Overall marketing strategy recommendation"
}

Make each persona distinct and actionable for marketing purposes.
`;

        // Check cache first
        const cached = await AICacheService.get(prompt, modelConfig.model);
        if (cached.hit && cached.response) {
            return JSON.parse(cached.response);
        }

        try {
            const response = await openai.chat.completions.create({
                model: modelConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert customer researcher and persona specialist. Always respond with valid JSON only.'
                    },
                    { role: 'user', content: prompt }
                ],
                max_tokens: modelConfig.maxTokens,
                temperature: 0.8, // Higher creativity for personas
                response_format: { type: 'json_object' }
            });

            const content = response.choices[0]?.message?.content || '{}';
            const personaSet = JSON.parse(content) as PersonaSet;

            // Log token usage
            await TokenLogger.log({
                userId,
                model: modelConfig.model,
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                feature: 'persona_generation'
            });

            // Cache the response
            await AICacheService.set(prompt, modelConfig.model, content, {
                model: modelConfig.model,
                ttlHours: modelConfig.cacheTTLHours
            });

            return personaSet;

        } catch (error) {
            console.error('Persona generation error:', error);
            throw new Error('Failed to generate personas');
        }
    }
}

export default PersonaGenerator;
