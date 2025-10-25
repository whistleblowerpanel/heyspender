'use client'

import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AdminDashboardLayout from '@/components/layout/AdminDashboardLayout';
import { supabase } from '@/lib/customSupabaseClient';

export default function AdminDashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [roleLoaded, setRoleLoaded] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);
  const hasCheckedRef = React.useRef(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!authLoading && user && !hasCheckedRef.current) {
        hasCheckedRef.current = true;
        console.log('Admin layout: Checking user role from database...');
        
        try {
          const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (roleError) {
            console.error('Error fetching user role:', roleError);
            // If there's an error fetching role, redirect to login with return URL
            const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/auth/login?returnUrl=${returnUrl}`);
            return;
          }
          
          const role = userData?.role;
          setUserRole(role);
          setRoleLoaded(true);
          
          console.log('Admin layout: User role loaded:', role);
          
          // Check if user is NOT admin
          if (role !== 'admin') {
            console.log('User is not admin, redirecting to user dashboard. Role:', role);
            router.push('/dashboard/wishlist');
          } else {
            console.log('User is admin, rendering dashboard');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          router.push(`/auth/login?returnUrl=${returnUrl}`);
        }
      } else if (!authLoading && !user) {
        // User is not logged in, redirect to login with return URL
        console.log('Admin layout: User not logged in, redirecting to login');
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        router.push(`/auth/login?returnUrl=${returnUrl}`);
      }
    };

    checkUserRole();
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
  if (!roleLoaded || !userRole) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
      </div>
    );
  }

  // If role is loaded but not admin, don't render (will redirect via useEffect)
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <AdminDashboardLayout>
      {children}
    </AdminDashboardLayout>
  );
}

