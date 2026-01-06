import { z } from "zod";

// --- Login Contract ---

export const LoginRequestSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
    token: z.string(),
    expiresAt: z.string().datetime(),
    user: z.object({
        id: z.string(),
        email: z.string(),
        name: z.string().nullable(),
        role: z.string(),
    }),
});

export type LoginResponseDTO = z.infer<typeof LoginResponseSchema>;

// --- Session Contract ---

export const UserSessionSchema = z.object({
    userId: z.string(),
    isValid: z.boolean(),
    lastActive: z.date(),
    metadata: z.record(z.unknown()).optional(),
});

export type UserSessionDTO = z.infer<typeof UserSessionSchema>;

// --- Register Contract ---

export const RegisterRequestSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>;

export const RegisterResponseSchema = z.object({
    message: z.string(),
    user: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        role: z.string(),
        createdAt: z.coerce.date(),
    }),
});

export type RegisterResponseDTO = z.infer<typeof RegisterResponseSchema>;
