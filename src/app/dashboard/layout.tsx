'use client'

import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const hasCheckedRef = React.useRef(false);

  useEffect(() => {
    // Only run auth check when user state changes (not on every render)
    if (!authLoading && user) {
      // User is loaded
      hasCheckedRef.current = true;
    } else if (!authLoading && !user && hasCheckedRef.current) {
      // User was logged out after being logged in
      console.log('User logged out, redirecting to login');
      router.push('/auth/login');
    }
    // Don't redirect on initial load when user is null - might just be loading
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect if needed
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
