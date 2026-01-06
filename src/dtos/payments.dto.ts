import { z } from 'zod';

// --- Payment Status ---

export const PaymentStatusSchema = z.enum([
    'PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'CANCELED'
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

// --- Payment Record ---

export const PaymentRecordSchema = z.object({
    id: z.string(),
    userId: z.string(),
    amount: z.number(),
    currency: z.string().default('INR'),
    status: PaymentStatusSchema,
    paymentGateway: z.string().nullable().optional(),
    razorpayPaymentId: z.string().nullable().optional(),
    razorpayOrderId: z.string().nullable().optional(),
    stripePaymentId: z.string().nullable().optional(),
    createdAt: z.coerce.date(),
});

export type PaymentRecordDTO = z.infer<typeof PaymentRecordSchema>;

// --- Create Order Request (Razorpay) ---

export const CreateOrderRequestSchema = z.object({
    amount: z.number().min(100, 'Minimum amount is 100 paise (1 INR)'),
    currency: z.string().default('INR'),
    receipt: z.string().optional(),
    notes: z.record(z.string()).optional(),
});

export type CreateOrderRequestDTO = z.infer<typeof CreateOrderRequestSchema>;

// --- Create Order Response ---

export const CreateOrderResponseSchema = z.object({
    success: z.boolean(),
    orderId: z.string(),
    amount: z.number(),
    currency: z.string(),
    key: z.string().optional(), // Razorpay key for frontend
});

export type CreateOrderResponseDTO = z.infer<typeof CreateOrderResponseSchema>;

// --- Verify Payment Request ---

export const VerifyPaymentRequestSchema = z.object({
    razorpay_order_id: z.string(),
    razorpay_payment_id: z.string(),
    razorpay_signature: z.string(),
});

export type VerifyPaymentRequestDTO = z.infer<typeof VerifyPaymentRequestSchema>;

// --- Verify Payment Response ---

export const VerifyPaymentResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    paymentId: z.string().optional(),
});

export type VerifyPaymentResponseDTO = z.infer<typeof VerifyPaymentResponseSchema>;
