'use client'

import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';

export default function AdminDashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [roleLoaded, setRoleLoaded] = React.useState(false);
  const hasCheckedRef = React.useRef(false);

  useEffect(() => {
    // Only run auth check when user state changes (not on every render)
    if (!authLoading && user && user.user_metadata?.role) {
      // User and role are both loaded
      console.log('Admin layout: User and role loaded:', user.user_metadata.role);
      setRoleLoaded(true);
      hasCheckedRef.current = true;
      
      // Check if user is NOT admin
      if (user.user_metadata.role !== 'admin') {
        console.log('User is not admin, redirecting to user dashboard. Role:', user.user_metadata.role);
        router.push('/dashboard/wishlist');
      } else {
        console.log('User is admin, rendering dashboard');
      }
    } else if (!authLoading && user && !user.user_metadata?.role) {
      // User loaded but role not yet - wait a bit longer
      console.log('Admin layout: User loaded, waiting for role...');
    } else if (!authLoading && !user && hasCheckedRef.current) {
      // User was logged out after being logged in
      console.log('Admin layout: User logged out, redirecting to login');
      router.push('/auth/login');
    }
    // Don't redirect on initial load when user is null - might just be loading
  }, [user, authLoading, router]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
      </div>
    );
  }

  // Show loading if no user (will redirect)
  if (!user) {
    return null;
  }

  // Wait for role to be loaded before rendering admin dashboard
  // This prevents the redirect-on-refresh bug
  if (!roleLoaded || !user.user_metadata?.role) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
      </div>
    );
  }

  // If role is loaded but not admin, don't render (will redirect via useEffect)
  if (user.user_metadata.role !== 'admin') {
    return null;
  }

  return (
    <AdminDashboardLayout>
      {children}
    </AdminDashboardLayout>
  );
}

