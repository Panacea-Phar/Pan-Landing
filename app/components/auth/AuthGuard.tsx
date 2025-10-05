"use client";

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiresAuth = true,
  requiredRoles = [],
  fallbackPath
}) => {
  const { user, membership, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const orgName = params?.orgName as string;

  useEffect(() => {
    if (isLoading) {
      return; // Still loading, don't redirect yet
    }

    if (requiresAuth && !isAuthenticated) {
      // Not authenticated, redirect to login
      const loginPath = orgName ? `/${orgName}/login` : '/login';
      router.push(fallbackPath || loginPath);
      return;
    }

    if (requiredRoles.length > 0 && membership) {
      const userRole = membership.role?.toLowerCase();
      const hasRequiredRole = requiredRoles.some(role =>
        role.toLowerCase() === userRole
      );

      if (!hasRequiredRole) {
        // User doesn't have required role, redirect to unauthorized page or dashboard
        const unauthorizedPath = orgName ? `/${orgName}/unauthorized` : '/unauthorized';
        router.push(fallbackPath || unauthorizedPath);
        return;
      }
    }
  }, [isLoading, isAuthenticated, membership, requiresAuth, requiredRoles, router, orgName, fallbackPath]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, show nothing
  // (redirect will happen via useEffect)
  if (requiresAuth && !isAuthenticated) {
    return null;
  }

  // If specific roles are required but user doesn't have them, show nothing
  if (requiredRoles.length > 0 && membership) {
    const userRole = membership.role?.toLowerCase();
    const hasRequiredRole = requiredRoles.some(role =>
      role.toLowerCase() === userRole
    );

    if (!hasRequiredRole) {
      return null;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default AuthGuard;
