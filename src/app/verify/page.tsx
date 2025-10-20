"use client";

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MailCheck, X, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthGuard from '@/components/AuthGuard';

const VerifyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { user } = useAuth();
  const [isCheckingSession, setIsCheckingSession] = useState(false);

  const handleContinueContributing = async () => {
    setIsCheckingSession(true);
    
    try {
      console.log('🔍 Checking session for contribution access...');
      
      // Try to get session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session check result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        returnTo: returnTo,
        error: error?.message
      });
      
      if (session?.user) {
        console.log('✅ User has valid session, navigating to contribution');
        router.push(returnTo || '/dashboard/wishlist/');
      } else {
        console.log('⚠️ No session found, but allowing access to return URL');
        // Allow access even without session
        if (returnTo) {
          router.push(returnTo);
        } else {
          router.push('/dashboard/wishlist/');
        }
      }
    } catch (error) {
      console.error('❌ Error checking session:', error);
      // Even on error, allow access
      console.log('⚠️ Error occurred, but allowing access anyway');
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push('/dashboard/wishlist/');
      }
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleClose = async () => {
    setIsCheckingSession(true);
    
    try {
      console.log('🔍 Checking session for dashboard access...');
      
      // Try to get session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Session check result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
        emailConfirmed: session?.user?.email_confirmed_at,
        error: error?.message
      });
      
      if (session?.user) {
        console.log('✅ User has valid session, navigating to dashboard');
        const isAdmin = session.user.user_metadata?.role === 'admin';
        router.push(isAdmin ? '/admin/dashboard' : '/dashboard/wishlist/');
      } else {
        console.log('⚠️ No session found, but allowing dashboard access anyway');
        // Allow access to dashboard even without session - they'll see the verification banner
        router.push('/dashboard/wishlist/');
      }
    } catch (error) {
      console.error('❌ Error checking session:', error);
      // Even on error, allow dashboard access
      console.log('⚠️ Error occurred, but allowing dashboard access anyway');
      router.push('/dashboard/wishlist/');
    } finally {
      setIsCheckingSession(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                Email Verification
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-brand-purple-dark">Check Your</span>
                <br />
                <span className="text-gray-800">Inbox!</span>
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Verification Message */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-brand-purple-dark text-white p-8 border-2 border-black shadow-flat-left text-center"
            >
              <MailCheck className="w-16 h-16 mx-auto text-brand-green mb-6" />
              
              <h2 className="text-3xl font-bold text-white mb-4">Check Your Inbox!</h2>
              <p className="text-white/90 mb-6">
                We've sent a verification link to your email address. Please click the link to confirm your account.
              </p>
              <p className="text-sm text-white/80 mb-6">
                You can make contributions while waiting for verification, but you'll need to verify your email to access your dashboard.
              </p>
              
              <div className="text-xs text-white/60 bg-white/5 p-3 rounded border border-white/10 mb-6">
                💡 <strong>Mobile users:</strong> If you're having trouble with the verification link, try opening it in your default browser or copy the link and paste it in a new tab.
              </div>
              
              {user && (
                <div className="text-xs text-white/60 bg-white/10 p-3 rounded mb-6">
                  <p>Current user: {user.email}</p>
                  <p>Verified: {user.email_confirmed_at ? 'Yes' : 'No'}</p>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                {returnTo && (
                  <Button 
                    variant="custom" 
                    className="bg-brand-green text-black cursor-pointer" 
                    onClick={handleContinueContributing}
                    disabled={isCheckingSession}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {isCheckingSession ? 'Checking session...' : 'Continue Contributing'}
                  </Button>
                )}
                <Button 
                  variant="custom" 
                  className="bg-brand-accent-red text-white cursor-pointer" 
                  onClick={handleClose} 
                  disabled={isCheckingSession}
                >
                  <X className="mr-2 h-4 w-4" />
                  {isCheckingSession ? 'Checking session...' : 'Go to Dashboard'}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Need Help?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                If you didn't receive the email or need assistance, we're here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/contact')}
                  size="lg"
                  variant="custom"
                  className="bg-brand-green text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>Contact Support</span>
                </Button>
                <Button
                  onClick={() => router.push('/faq')}
                  size="lg"
                  variant="custom"
                  className="bg-brand-orange text-black w-full sm:w-auto cursor-pointer"
                >
                  <span>View FAQ</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

const VerifyPage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple-dark" />
        </div>
      }>
        <VerifyForm />
      </Suspense>
    </AuthGuard>
  );
};

export default VerifyPage;
