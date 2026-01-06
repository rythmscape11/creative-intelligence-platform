import { z } from "zod";

/**
 * Standard API Response Envelope
 * Usage:
 * const Response = createResponseSchema(LoginResponseSchema);
 * type ResponseType = z.infer<typeof Response>;
 */
export function createResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
    return z.object({
        success: z.boolean(),
        data: dataSchema.optional(),
        error: z.string().optional(),
        meta: z
            .object({
                page: z.number().int().optional(),
                total: z.number().int().optional(),
                totalPages: z.number().int().optional(),
            })
            .optional(),
    });
}

/**
 * Standard Pagination Request Schema
 */
export const PaginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
});

export type PaginationDTO = z.infer<typeof PaginationSchema>;
