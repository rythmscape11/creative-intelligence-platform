'use client';

import { useUser } from '@clerk/nextjs';
import { UserRole } from '@/types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn || !user) {
    return fallback || null;
  }

  const userRole = (user.publicMetadata?.role as UserRole) || 'USER';
  if (!allowedRoles.includes(userRole)) {
    return fallback || null;
  }

  return <>{children}</>;
}
