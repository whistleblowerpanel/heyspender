"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import SettingsDashboard from '@/components/dashboard/SettingsDashboard';
import AuthGuard from '@/components/AuthGuard';

const SettingsPage = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: error.message
      });
    }
  };

  return (
    <AuthGuard>
    <div>
      <div className="px-4 pt-32 pb-28 sm:pb-36">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-purple-dark mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account, profile, and preferences
          </p>
        </div>

        <SettingsDashboard onSignOut={handleSignOut} />
        </div>
      </div>
    </div>
    </AuthGuard>
  );
};

export default SettingsPage;
