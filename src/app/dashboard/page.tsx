"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AuthGuard from '@/components/AuthGuard';

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      // Redirect to wishlist page as the default dashboard page
      router.push('/dashboard/wishlist/');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" /></div>;
  }

  if (!user) {
    // Allow dashboard access even without user - they'll see verification banner
    console.log('⚠️ No user in dashboard, but allowing access with verification banner');
    return (
      <div className="px-4 pt-32 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-purple-dark mb-8">Dashboard</h1>
          <div className="text-center py-16">
            <p>Welcome to HeySpender! Please verify your email to access all features.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  return <div className="flex justify-center items-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" /></div>;
};

export default DashboardPage;