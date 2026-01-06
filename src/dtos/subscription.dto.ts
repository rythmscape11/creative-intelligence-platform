import { z } from 'zod';

// --- Enums (Mirroring Prisma) ---

export const SubscriptionPlanSchema = z.enum(['FREE', 'PRO', 'AGENCY', 'TEAM', 'ENTERPRISE']);
export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const SubscriptionStatusSchema = z.enum([
    'ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING',
    'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'UNPAID'
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;

export const PaymentGatewaySchema = z.string().nullable().optional();
export type PaymentGateway = z.infer<typeof PaymentGatewaySchema>;

// --- Response Schemas ---

export const SubscriptionResponseSchema = z.object({
    id: z.string().cuid().optional(), // Optional for fallback FREE plan
    userId: z.string().optional(),
    plan: SubscriptionPlanSchema,
    status: SubscriptionStatusSchema,
    paymentGateway: z.string().nullable().optional(),
    currentPeriodStart: z.coerce.date().nullable().optional(),
    currentPeriodEnd: z.coerce.date().nullable().optional(),
    cancelAtPeriodEnd: z.boolean(),
    canceledAt: z.coerce.date().nullable().optional(),
    trialStart: z.coerce.date().nullable().optional(),
    trialEnd: z.coerce.date().nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export type SubscriptionResponseDTO = z.infer<typeof SubscriptionResponseSchema>;

// --- API Response Wrappers ---

export const GetSubscriptionResponseSchema = z.object({
    subscription: SubscriptionResponseSchema,
});

export type GetSubscriptionResponseDTO = z.infer<typeof GetSubscriptionResponseSchema>;

export const CancelSubscriptionResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type CancelSubscriptionResponseDTO = z.infer<typeof CancelSubscriptionResponseSchema>;

// --- Request Schemas (for future use) ---

export const UpdateSubscriptionRequestSchema = z.object({
    plan: SubscriptionPlanSchema.optional(),
    // Add other updatable fields as needed
});

export type UpdateSubscriptionRequestDTO = z.infer<typeof UpdateSubscriptionRequestSchema>;
