import { z } from "zod";

// --- Enums ---
export const UserRoleSchema = z.enum(['ADMIN', 'EDITOR', 'USER']);

// --- Base User Schema ---
// Fields available in most contexts
export const UserBaseSchema = z.object({
    id: z.string().cuid(),
    name: z.string().min(1),
    email: z.string().email(),
    avatar: z.string().nullable().optional(),
    role: UserRoleSchema,
    createdAt: z.coerce.date(),
});

// --- Public Profile Schema ---
// Safe for public display (e.g., blog author, team member)
export const UserProfileSchema = UserBaseSchema.pick({
    id: true,
    name: true,
    avatar: true,
    role: true,
});

export type UserProfileDTO = z.infer<typeof UserProfileSchema>;

// --- Private Profile Schema ---
// For the logged-in user (includes email, billing info, etc.)
export const UserPrivateProfileSchema = UserBaseSchema.extend({
    clerkId: z.string().nullable().optional(),
    updatedAt: z.coerce.date(),
    // Add other private fields as needed
});

export type UserPrivateProfileDTO = z.infer<typeof UserPrivateProfileSchema>;

// --- Update User Schema ---
export const UpdateUserSchema = z.object({
    name: z.string().min(1).optional(),
    avatar: z.string().url().optional().or(z.literal('')),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
