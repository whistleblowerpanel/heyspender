"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const AdminPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && user.user_metadata?.role === 'admin') {
        router.push('/admin/dashboard/users');
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-16 w-16 animate-spin text-brand-purple-dark" />
    </div>
  );
};

export default AdminPage;
