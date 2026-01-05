/**
 * BrandGuard Service
 * Compliance engine with RAG-based prompt interception
 * From Original Brief Specification
 */

import { prisma } from '@/lib/prisma';
import { generateTextWithVertexAI } from './forge-providers';

// Types
export interface BrandGuidelines {
    id: string;
    organizationId: string;
    clientName: string;
    colors: string[];
    toneOfVoice: string[];
    forbiddenImagery: string[];
    requiredElements: string[];
    loraModelPath?: string;
    loraWeight: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BrandGuardResult {
    originalPrompt: string;
    rewrittenPrompt: string;
    negativePrompt: string;
    complianceScore: number;
    violations: string[];
    enhancements: string[];
    sparksUsed: number;
}

/**
 * Parse PDF brand guidelines and extract rules
 */
export async function parseBrandGuidelines(
    pdfContent: string,
    clientName: string
): Promise<Partial<BrandGuidelines>> {
    // Use LLM to extract brand rules from PDF content
    const extractionPrompt = `
You are a brand compliance expert. Analyze the following brand guidelines document and extract:

1. Brand Colors (list hex codes or color names)
2. Tone of Voice descriptors (professional, playful, energetic, etc.)
3. Forbidden Imagery (things that should NEVER appear)
4. Required Elements (things that MUST appear, like logos or taglines)

Document Content:
${pdfContent.slice(0, 8000)} // Limit context

Output as JSON:
{
  "colors": ["#hex1", "#hex2"],
  "toneOfVoice": ["descriptor1", "descriptor2"],
  "forbiddenImagery": ["item1", "item2"],
  "requiredElements": ["element1", "element2"]
}
`;

    const result = await generateTextWithVertexAI({
        prompt: extractionPrompt,
        maxTokens: 1024,
        temperature: 0.3,
    });

    try {
        const extracted = JSON.parse(result.text);
        return {
            clientName,
            colors: extracted.colors || [],
            toneOfVoice: extracted.toneOfVoice || [],
            forbiddenImagery: extracted.forbiddenImagery || [],
            requiredElements: extracted.requiredElements || [],
            loraWeight: 0.8,
        };
    } catch {
        // Return defaults if parsing fails
        return {
            clientName,
            colors: [],
            toneOfVoice: [],
            forbiddenImagery: [],
            requiredElements: [],
            loraWeight: 0.8,
        };
    }
}

/**
 * Intercept and rewrite prompt for brand compliance
 * This is the core BrandGuard RAG function from the brief
 */
export async function interceptPrompt(
    originalPrompt: string,
    guidelines: BrandGuidelines
): Promise<BrandGuardResult> {
    const startTime = Date.now();

    // Build the interception prompt
    const interceptionPrompt = `
You are a BrandGuard AI compliance engine for ${guidelines.clientName}.

BRAND RULES:
- Colors: ${guidelines.colors.join(', ')}
- Tone: ${guidelines.toneOfVoice.join(', ')}
- FORBIDDEN (never include): ${guidelines.forbiddenImagery.join(', ')}
- REQUIRED (must include): ${guidelines.requiredElements.join(', ')}

USER PROMPT:
"${originalPrompt}"

Your task:
1. Analyze if the prompt violates any brand rules
2. Rewrite the prompt to be brand-compliant
3. Add any missing required brand elements
4. Generate a negative prompt with forbidden elements

Output as JSON:
{
  "rewrittenPrompt": "enhanced brand-compliant prompt",
  "negativePrompt": "comma-separated list of things to avoid",
  "violations": ["list of rule violations found"],
  "enhancements": ["list of improvements made"],
  "complianceScore": 0-100
}
`;

    const result = await generateTextWithVertexAI({
        prompt: interceptionPrompt,
        maxTokens: 1024,
        temperature: 0.3,
    });

    try {
        const parsed = JSON.parse(result.text);
        return {
            originalPrompt,
            rewrittenPrompt: parsed.rewrittenPrompt || originalPrompt,
            negativePrompt: parsed.negativePrompt || '',
            complianceScore: parsed.complianceScore || 100,
            violations: parsed.violations || [],
            enhancements: parsed.enhancements || [],
            sparksUsed: result.sparksUsed + 3, // BrandGuard overhead
        };
    } catch {
        // Return original prompt if parsing fails
        return {
            originalPrompt,
            rewrittenPrompt: originalPrompt,
            negativePrompt: guidelines.forbiddenImagery.join(', '),
            complianceScore: 50,
            violations: ['Unable to analyze prompt'],
            enhancements: [],
            sparksUsed: 3,
        };
    }
}

/**
 * Store brand guidelines in database
 */
export async function saveBrandGuidelines(
    orgId: string,
    guidelines: Partial<BrandGuidelines>
): Promise<BrandGuidelines> {
    // Use the ForgeFlow table to store brand kits as a special "kit" type
    // In production, you'd have a dedicated BrandKit table
    const result = await prisma.forgeFlow.create({
        data: {
            orgId,
            name: `Brand Kit: ${guidelines.clientName}`,
            description: 'Auto-generated brand compliance rules',
            status: 'published',
            definitionJson: {
                type: 'brandkit',
                clientName: guidelines.clientName,
                colors: guidelines.colors,
                toneOfVoice: guidelines.toneOfVoice,
                forbiddenImagery: guidelines.forbiddenImagery,
                requiredElements: guidelines.requiredElements,
                loraModelPath: guidelines.loraModelPath,
                loraWeight: guidelines.loraWeight,
            },
            version: 1,
        },
    });

    return {
        id: result.id,
        organizationId: result.orgId,
        clientName: guidelines.clientName || '',
        colors: guidelines.colors || [],
        toneOfVoice: guidelines.toneOfVoice || [],
        forbiddenImagery: guidelines.forbiddenImagery || [],
        requiredElements: guidelines.requiredElements || [],
        loraModelPath: guidelines.loraModelPath,
        loraWeight: guidelines.loraWeight || 0.8,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    };
}

/**
 * Get brand guidelines for an organization
 */
export async function getBrandGuidelines(
    orgId: string
): Promise<BrandGuidelines[]> {
    const flows = await prisma.forgeFlow.findMany({
        where: {
            orgId,
            name: { startsWith: 'Brand Kit:' },
        },
    });

    return flows.map((flow) => {
        const data = flow.definitionJson as Record<string, unknown>;
        return {
            id: flow.id,
            organizationId: flow.orgId,
            clientName: (data.clientName as string) || '',
            colors: (data.colors as string[]) || [],
            toneOfVoice: (data.toneOfVoice as string[]) || [],
            forbiddenImagery: (data.forbiddenImagery as string[]) || [],
            requiredElements: (data.requiredElements as string[]) || [],
            loraModelPath: data.loraModelPath as string | undefined,
            loraWeight: (data.loraWeight as number) || 0.8,
            createdAt: flow.createdAt,
            updatedAt: flow.updatedAt,
        };
    });
}

/**
 * Train LoRA model for brand kit
 * Dispatches to Fal.ai training endpoint
 */
export async function trainBrandLoRA(params: {
    brandKitId: string;
    imageUrls: string[];
    instancePrompt: string;
}): Promise<{ taskId: string; estimatedTime: number }> {
    const FAL_API_KEY = process.env.FAL_API_KEY;

    if (!FAL_API_KEY) {
        console.warn('Fal.ai API key not configured, returning mock training task');
        return {
            taskId: `mock-training-${Date.now()}`,
            estimatedTime: 300, // 5 minutes
        };
    }

    try {
        const response = await fetch('https://fal.run/fal-ai/flux-lora-trainer', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${FAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                images_data_url: params.imageUrls,
                instance_prompt: params.instancePrompt,
                trigger_word: params.instancePrompt.split(' ')[0],
                steps: 1000,
                learning_rate: 0.0001,
            }),
        });

        if (!response.ok) {
            throw new Error('Training request failed');
        }

        const data = await response.json();
        return {
            taskId: data.task_id || data.request_id,
            estimatedTime: 600, // ~10 minutes typical
        };
    } catch (error) {
        console.error('LoRA training error:', error);
        throw error;
    }
}
