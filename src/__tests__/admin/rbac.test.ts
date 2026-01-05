/**
 * Admin Panel RBAC Tests
 * 
 * Tests role-based access control for admin routes and functionality.
 * Ensures that only ADMIN users can access admin panel and that
 * USER and EDITOR roles are properly blocked.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Session } from 'next-auth';
import { requireAdmin, requireRole, requireAuth, isAdmin, isEditor, hasRole } from '@/lib/auth-utils';
import { UserRole } from '@/types';

// Mock next-auth
vi.mock('next-auth/next', () => ({
  getServerSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT: ${url}`);
  }),
}));

import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

type SessionResult = Session;
const buildSession = (role?: UserRole, overrides: Record<string, unknown> = {}): SessionResult =>
  ({
    user: role
      ? {
          id: `${role.toLowerCase()}-1`,
          email: `${role.toLowerCase()}@test.com`,
          role,
          ...overrides,
        }
      : Object.keys(overrides).length > 0
        ? overrides
        : undefined,
    expires: new Date('2999-01-01T00:00:00.000Z').toISOString(),
  }) as SessionResult;

describe('Admin RBAC - requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access for ADMIN users', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.ADMIN));

    const user = await requireAdmin();
    expect(user).toBeDefined();
    expect(user.role).toBe(UserRole.ADMIN);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('should redirect USER role to unauthorized', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.USER));

    await expect(requireAdmin()).rejects.toThrow('REDIRECT: /unauthorized');
    expect(redirect).toHaveBeenCalledWith('/unauthorized');
  });

  it('should redirect EDITOR role to unauthorized', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.EDITOR));

    await expect(requireAdmin()).rejects.toThrow('REDIRECT: /unauthorized');
    expect(redirect).toHaveBeenCalledWith('/unauthorized');
  });

  it('should redirect unauthenticated users to signin', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toThrow('REDIRECT: /auth/signin');
    expect(redirect).toHaveBeenCalledWith('/auth/signin');
  });
});

describe('Admin RBAC - requireRole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow access when user has required role', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.ADMIN));

    const user = await requireRole([UserRole.ADMIN, UserRole.EDITOR]);
    expect(user).toBeDefined();
    expect(user.role).toBe(UserRole.ADMIN);
  });

  it('should block access when user does not have required role', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.USER));

    await expect(requireRole([UserRole.ADMIN])).rejects.toThrow('REDIRECT: /unauthorized');
  });

  it('should allow EDITOR when EDITOR is in allowed roles', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.EDITOR));

    const user = await requireRole([UserRole.ADMIN, UserRole.EDITOR]);
    expect(user).toBeDefined();
    expect(user.role).toBe(UserRole.EDITOR);
  });
});

describe('Admin RBAC - Helper Functions', () => {
  it('isAdmin should return true only for ADMIN role', () => {
    expect(isAdmin(UserRole.ADMIN)).toBe(true);
    expect(isAdmin(UserRole.EDITOR)).toBe(false);
    expect(isAdmin(UserRole.USER)).toBe(false);
  });

  it('isEditor should return true for ADMIN and EDITOR roles', () => {
    expect(isEditor(UserRole.ADMIN)).toBe(true);
    expect(isEditor(UserRole.EDITOR)).toBe(true);
    expect(isEditor(UserRole.USER)).toBe(false);
  });

  it('hasRole should check if user has any of the allowed roles', () => {
    expect(hasRole(UserRole.ADMIN, [UserRole.ADMIN])).toBe(true);
    expect(hasRole(UserRole.ADMIN, [UserRole.ADMIN, UserRole.EDITOR])).toBe(true);
    expect(hasRole(UserRole.EDITOR, [UserRole.ADMIN, UserRole.EDITOR])).toBe(true);
    expect(hasRole(UserRole.USER, [UserRole.ADMIN, UserRole.EDITOR])).toBe(false);
  });
});

describe('Admin RBAC - Route Protection Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should protect /admin route from non-admin users', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.USER));

    await expect(requireAdmin()).rejects.toThrow('REDIRECT: /unauthorized');
  });

  it('should protect /admin/users route from non-admin users', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.EDITOR));

    await expect(requireAdmin()).rejects.toThrow('REDIRECT: /unauthorized');
  });

  it('should protect /admin/settings route from non-admin users', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.USER));

    await expect(requireAdmin()).rejects.toThrow('REDIRECT: /unauthorized');
  });

  it('should allow ADMIN access to all admin routes', async () => {
    vi.mocked(getServerSession).mockResolvedValue(buildSession(UserRole.ADMIN));

    const user = await requireAdmin();
    expect(user).toBeDefined();
    expect(user.role).toBe(UserRole.ADMIN);
  });
});

describe('Admin RBAC - Session Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle missing session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    await expect(requireAuth()).rejects.toThrow('REDIRECT: /auth/signin');
  });

  it('should handle session without user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({} as SessionResult);

    await expect(requireAuth()).rejects.toThrow('REDIRECT: /auth/signin');
  });

  it('should handle session with user but no role', async () => {
    vi.mocked(getServerSession).mockResolvedValue(
      buildSession(undefined, { id: 'user-1', email: 'user@test.com' })
    );

    const user = await requireAuth();
    expect(user).toBeDefined();
    // Role check would happen in requireRole/requireAdmin
  });
});
