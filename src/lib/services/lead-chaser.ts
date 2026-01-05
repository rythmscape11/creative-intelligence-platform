import { prisma } from '@/lib/prisma';
import { emailService } from './email-service';
import OpenAI from 'openai';

// OpenAI initialized lazily


export class LeadChaserService {
    /**
     * Starts a new lead nurturing sequence for a captured lead
     */
    async startSequence(leadCaptureId: string, context: any) {
        // Calculate first run time (e.g., 1 hour from now, or immediate)
        // For now, let's say 30 minutes after capture to seem natural
        const nextRunAt = new Date(Date.now() + 30 * 60 * 1000);

        return await prisma.leadSequence.create({
            data: {
                leadCaptureId,
                status: 'ACTIVE',
                currentStep: 1,
                nextRunAt,
                aiContext: JSON.stringify(context),
            },
        });
    }

    /**
     * Processes all active sequences that are due for the next step
     */
    async processDueSequences() {
        const now = new Date();

        // Find active sequences due for a run
        const dueSequences = await prisma.leadSequence.findMany({
            where: {
                status: 'ACTIVE',
                nextRunAt: {
                    lte: now,
                },
            },
            include: {
                leadCapture: true,
            },
            take: 10, // Process in batches to avoid timeouts
        });

        console.log(`Found ${dueSequences.length} due sequences`);

        const results = [];

        for (const sequence of dueSequences) {
            try {
                const result = await this.processSequenceStep(sequence);
                results.push({ id: sequence.id, status: 'success', result });
            } catch (error: any) {
                console.error(`Error processing sequence ${sequence.id}:`, error);
                results.push({ id: sequence.id, status: 'error', error: error.message });
            }
        }

        return results;
    }

    /**
     * Processes a single step for a sequence
     */
    private async processSequenceStep(sequence: any) {
        const { leadCapture, currentStep, aiContext } = sequence;
        const context = JSON.parse(aiContext || '{}');

        // 1. Generate Email Content using OpenAI
        const emailContent = await this.generateEmailContent(leadCapture, currentStep, context);

        if (!emailContent) {
            throw new Error('Failed to generate email content');
        }

        // 2. Send Email
        await emailService.send({
            to: leadCapture.email,
            subject: emailContent.subject,
            html: emailContent.body,
            text: emailContent.plainText, // You might want to generate this too or strip HTML
        });

        // 3. Log Email
        await prisma.leadEmail.create({
            data: {
                sequenceId: sequence.id,
                subject: emailContent.subject,
                content: emailContent.body,
                sentAt: new Date(),
            },
        });

        // 4. Update Sequence
        // 6-Month Nurturing Sequence (12 steps):
        // Step 1 -> Step 2: 1 day (quick follow-up)
        // Step 2 -> Step 3: 3 days
        // Step 3 -> Step 4: 7 days (1 week)
        // Step 4 -> Step 5: 14 days (2 weeks)
        // Step 5 -> Step 6: 14 days (1 month mark)
        // Step 6 -> Step 7: 21 days (~6 weeks)
        // Step 7 -> Step 8: 21 days (2 months)
        // Step 8 -> Step 9: 30 days (3 months)
        // Step 9 -> Step 10: 30 days (4 months)
        // Step 10 -> Step 11: 30 days (5 months)
        // Step 11 -> Step 12: 30 days (6 months)
        // Max 12 steps over ~6 months

        let nextRunAt: Date | null = new Date();
        let nextStep = currentStep + 1;
        let status = 'ACTIVE';

        const stepIntervals: Record<number, number> = {
            1: 1,    // 1 day
            2: 3,    // 3 days
            3: 7,    // 1 week
            4: 14,   // 2 weeks
            5: 14,   // 2 weeks (1 month total)
            6: 21,   // 3 weeks (~6 weeks total)
            7: 21,   // 3 weeks (2 months total)
            8: 30,   // 1 month (3 months total)
            9: 30,   // 1 month (4 months total)
            10: 30,  // 1 month (5 months total)
            11: 30,  // 1 month (6 months total)
        };

        if (currentStep >= 12) {
            // End of 6-month sequence
            nextRunAt = null;
            status = 'COMPLETED';
        } else {
            const daysToAdd = stepIntervals[currentStep] || 30;
            nextRunAt.setDate(nextRunAt.getDate() + daysToAdd);
        }

        await prisma.leadSequence.update({
            where: { id: sequence.id },
            data: {
                currentStep: nextStep,
                lastRunAt: new Date(),
                nextRunAt,
                status,
            },
        });

        return { sent: true, nextStep, status };
    }

    /**
     * Generates email subject and body using OpenAI with website-branded design
     */
    private async generateEmailContent(lead: any, step: number, context: any) {
        const systemPrompt = `
You are an expert marketing consultant named "Sarah from Aureon One".
Your goal is to nurture leads who have used our free marketing tools but haven't signed up for a paid plan yet.
Be helpful, provide value, and gently nudge them towards signing up or booking a strategy call.
Keep the tone professional yet conversational and friendly.

Lead Name: ${lead.name || 'there'}
Lead Source: ${lead.source || 'Website'}
Context: ${JSON.stringify(context)}

Current Step in Sequence: ${step} of 12 (6-month nurturing program)

WEBSITE OFFERINGS TO HIGHLIGHT (as relevant to each step):
- Free Marketing Tools: 50+ calculators, generators, and analyzers
- Strategy Generator: AI-powered marketing strategy creation
- Agency OS: Complete agency management platform
- Content Calendar: Automated content planning
- Lead Chaser: AI-powered lead nurturing (what we're using!)
- Competition Analysis: Deep competitor insights
- Pricing: Pro at $49/mo, Agency at $299/mo

Sequence Strategy (adapts based on step):
Step 1: Welcome + Value Add - Send a relevant tip related to what they were looking for.
Step 2: Case Study - Share a quick success story.
Step 3: Tool Recommendation - Suggest a specific free tool they might find useful.
Step 4: Educational Content - Share industry insights or trends.
Step 5: Feature Spotlight - Showcase Strategy Generator or a popular tool.
Step 6: Check-in - Friendly check-in asking about their marketing progress.
Step 7: Social Proof - Share customer testimonials or metrics.
Step 8: Pro Plan Benefits - Highlight Pro plan features with soft pitch.
Step 9: Advanced Tips - Share expert-level marketing strategies.
Step 10: Webinar/Resource Invite - Invite to blog content or resources.
Step 11: Re-engagement - Ask for feedback on what would help them most.
Step 12: Final Appreciation - Thank them, offer one last special discount.

EMAIL DESIGN REQUIREMENTS:
Generate beautiful, responsive HTML email that matches our website design:
- Use a clean, modern design with plenty of whitespace
- Primary color: #F59E0B (amber/gold for buttons and accents)
- Background: Light gradient from #1F2937 to #111827 for header
- Body background: #FFFFFF
- Text: #374151 for body, #1F2937 for headings
- Include a styled header with "Aureon One" logo text
- Use a prominent CTA button with amber color
- Include footer with unsubscribe link placeholder
- Make it mobile-responsive with max-width: 600px

Output JSON format:
{
  "subject": "Engaging subject line (under 50 chars)",
  "body": "Complete responsive HTML email with inline styles"
}`;

        const userPrompt = `Generate a beautiful, branded HTML email for Step ${step} of our 6-month nurturing sequence. Make it look premium and professional.`;

        const openai = new OpenAI({
            apiKey: (process.env.OPENAI_API_KEY || '').trim(),
        });

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            model: 'gpt-4-turbo-preview',
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0].message.content;
        if (!content) return null;

        try {
            const parsed = JSON.parse(content);
            return {
                subject: parsed.subject,
                body: parsed.body,
                plainText: parsed.body.replace(/<[^>]*>?/gm, ''), // Simple strip tags
            };
        } catch (e) {
            console.error('Error parsing AI response:', e);
            return null;
        }
    }
}

export const leadChaserService = new LeadChaserService();
