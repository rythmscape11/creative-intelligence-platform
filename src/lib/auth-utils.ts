import { auth, currentUser } from '@clerk/nextjs/server';
import { UserRole } from '@/types';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  // Fetch user from database to get role if not in metadata
  // Or rely on metadata if we are syncing it correctly
  // For now, let's fetch from DB to be safe and consistent with previous behavior
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return dbUser;
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    // This shouldn't happen if webhooks are working, but just in case
    redirect('/sign-in');
  }

  return user;
}

/**
 * API-safe version of requireAuth that throws an error instead of redirecting
 * Use this in API routes instead of requireAuth
 */
export async function requireAuthApi() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized: No user session');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Unauthorized: User not found in database');
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as UserRole)) {
    redirect('/unauthorized');
  }
  return user;
}

/**
 * API-safe version of requireRole that throws an error instead of redirecting
 * Use this in API routes instead of requireRole
 */
export async function requireRoleApi(allowedRoles: UserRole[]) {
  const user = await requireAuthApi();
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new Error(`Forbidden: User role '${user.role}' is not authorized`);
  }
  return user;
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMIN]);
}

/**
 * API-safe version of requireAdmin
 */
export async function requireAdminApi() {
  return requireRoleApi([UserRole.ADMIN]);
}

export async function requireEditor() {
  return requireRole([UserRole.ADMIN, UserRole.EDITOR]);
}

/**
 * API-safe version of requireEditor
 */
export async function requireEditorApi() {
  return requireRoleApi([UserRole.ADMIN, UserRole.EDITOR]);
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

export function isEditor(userRole: UserRole): boolean {
  return userRole === UserRole.EDITOR || userRole === UserRole.ADMIN;
}

export function canAccessResource(userRole: UserRole, resourceOwnerId: string, userId: string): boolean {
  // Admins can access everything
  if (userRole === UserRole.ADMIN) {
    return true;
  }

  // Users can only access their own resources
  return resourceOwnerId === userId;
}
