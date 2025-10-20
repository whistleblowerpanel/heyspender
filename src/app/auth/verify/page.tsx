"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowLeft, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const VerifyPageContent = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email');
  const returnTo = searchParams.get('returnTo');

  const handleContinueContributing = async () => {
    setIsCheckingSession(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(returnTo || '/dashboard');
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      router.push('/auth/login');
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleClose = async () => {
    setIsCheckingSession(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      router.push('/auth/login');
    } finally {
      setIsCheckingSession(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-6 bg-brand-purple-dark text-white border-2 border-black text-center"
        >
        <MailCheck className="w-16 h-16 mx-auto text-brand-green" />
        
        <h1 className="text-3xl font-bold text-white">Check Your Inbox!</h1>
        
        <p className="text-white/90">
          We've sent a verification link to your email address. Please click the link to confirm your account.
        </p>
        
        <p className="text-sm text-white/80">
          You can make contributions while waiting for verification, but you'll need to verify your email to access your dashboard.
        </p>

        <p className="text-xs text-white/60 bg-white/5 p-2 border border-white/10">
          💡 <strong>Mobile users:</strong> If you're having trouble with the verification link, try opening it in your default browser or copy the link and paste it in a new tab.
        </p>

        <div className="flex flex-col gap-3">
          {returnTo && (
            // @ts-ignore
            <Button 
              type="button"
              variant="custom" 
              className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
              onClick={handleContinueContributing}
              disabled={isCheckingSession}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>{isCheckingSession ? 'Checking session...' : 'Continue Contributing'}</span>
            </Button>
          )}
          {/* @ts-ignore */}
          <Button 
            type="button"
            variant="custom" 
            className="bg-brand-accent-red text-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
            onClick={handleClose} 
            disabled={isCheckingSession}
          >
            <X className="mr-2 h-4 w-4" />
            <span>{isCheckingSession ? 'Checking session...' : 'Go to Dashboard'}</span>
          </Button>
        </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

const VerifyPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-purple-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  );
};

export default VerifyPage;