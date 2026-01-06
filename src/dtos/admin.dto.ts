import { z } from 'zod';
import { UserRoleSchema } from './user.dto';

// --- Admin User Management DTOs ---

export const AdminUserListItemSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: UserRoleSchema,
    createdAt: z.coerce.date(),
    subscription: z.object({
        plan: z.string(),
        status: z.string(),
    }).nullable().optional(),
});

export type AdminUserListItemDTO = z.infer<typeof AdminUserListItemSchema>;

export const AdminUserListResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        users: z.array(AdminUserListItemSchema),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
    }),
});

export type AdminUserListResponseDTO = z.infer<typeof AdminUserListResponseSchema>;

// --- Role Update ---

export const UpdateUserRoleRequestSchema = z.object({
    userId: z.string(),
    role: UserRoleSchema,
});

export type UpdateUserRoleRequestDTO = z.infer<typeof UpdateUserRoleRequestSchema>;

export const BulkRoleUpdateRequestSchema = z.object({
    userIds: z.array(z.string()).min(1),
    role: UserRoleSchema,
});

export type BulkRoleUpdateRequestDTO = z.infer<typeof BulkRoleUpdateRequestSchema>;

// --- Admin Stats ---

export const AdminStatsSchema = z.object({
    totalUsers: z.number(),
    activeSubscriptions: z.number(),
    totalStrategies: z.number(),
    totalBlogPosts: z.number(),
    revenueThisMonth: z.number().optional(),
});

export type AdminStatsDTO = z.infer<typeof AdminStatsSchema>;
