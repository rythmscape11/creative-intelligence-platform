import { z } from 'zod';

// --- Integration Types ---

export const IntegrationTypeSchema = z.enum([
    'MAILCHIMP', 'GOOGLE_ANALYTICS', 'GOOGLE_ADS', 'META_ADS',
    'LINKEDIN', 'TWITTER', 'HUBSPOT', 'SALESFORCE', 'SLACK',
    'ZAPIER', 'WEBHOOK', 'CUSTOM'
]);

export type IntegrationType = z.infer<typeof IntegrationTypeSchema>;

// --- Integration Status ---

export const IntegrationStatusSchema = z.enum([
    'ACTIVE', 'INACTIVE', 'PENDING', 'ERROR', 'EXPIRED'
]);

export type IntegrationStatus = z.infer<typeof IntegrationStatusSchema>;

// --- Integration Record ---

export const IntegrationRecordSchema = z.object({
    id: z.string(),
    userId: z.string(),
    type: IntegrationTypeSchema,
    name: z.string(),
    status: IntegrationStatusSchema,
    isActive: z.boolean(),
    serverPrefix: z.string().nullable().optional(),
    settings: z.record(z.unknown()).nullable().optional(),
    lastSyncAt: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type IntegrationRecordDTO = z.infer<typeof IntegrationRecordSchema>;

// --- Create Integration Request ---

export const CreateIntegrationRequestSchema = z.object({
    type: IntegrationTypeSchema,
    name: z.string().min(1),
    apiKey: z.string().min(1),
    serverPrefix: z.string().optional(),
    settings: z.record(z.unknown()).optional(),
});

export type CreateIntegrationRequestDTO = z.infer<typeof CreateIntegrationRequestSchema>;

// --- Update Integration Request ---

export const UpdateIntegrationRequestSchema = z.object({
    name: z.string().optional(),
    apiKey: z.string().optional(),
    serverPrefix: z.string().optional(),
    settings: z.record(z.unknown()).optional(),
    isActive: z.boolean().optional(),
});

export type UpdateIntegrationRequestDTO = z.infer<typeof UpdateIntegrationRequestSchema>;

// --- Integration List Response ---

export const IntegrationListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(IntegrationRecordSchema),
});

export type IntegrationListResponseDTO = z.infer<typeof IntegrationListResponseSchema>;
