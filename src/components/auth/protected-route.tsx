'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  fallbackUrl = '/auth/signin',
  loadingComponent,
}: ProtectedRouteProps) {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // Still loading

    if (!isSignedIn) {
      router.push(fallbackUrl);
      return;
    }

    const userRole = (user?.publicMetadata?.role as UserRole) || 'USER';
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, isLoaded, isSignedIn, router, allowedRoles, fallbackUrl]);

  if (!isLoaded) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const userRole = (user?.publicMetadata?.role as UserRole) || 'USER';
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
