import { z } from 'zod';

// --- Contact Form Request ---

export const ContactFormRequestSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    company: z.string().optional(),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    source: z.string().optional(), // Where they came from
    utmParams: z.record(z.string()).optional(),
});

export type ContactFormRequestDTO = z.infer<typeof ContactFormRequestSchema>;

// --- Contact Form Response ---

export const ContactFormResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    leadId: z.string().optional(),
});

export type ContactFormResponseDTO = z.infer<typeof ContactFormResponseSchema>;

// --- Lead Record ---

export const LeadRecordSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    company: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']).default('NEW'),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type LeadRecordDTO = z.infer<typeof LeadRecordSchema>;

// --- Lead List Response ---

export const LeadListResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        leads: z.array(LeadRecordSchema),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
    }),
});

export type LeadListResponseDTO = z.infer<typeof LeadListResponseSchema>;

// --- Newsletter Subscribe ---

export const NewsletterSubscribeRequestSchema = z.object({
    email: z.string().email('Valid email is required'),
    source: z.string().optional(),
});

export type NewsletterSubscribeRequestDTO = z.infer<typeof NewsletterSubscribeRequestSchema>;
