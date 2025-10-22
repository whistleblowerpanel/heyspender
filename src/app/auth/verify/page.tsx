"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowLeft, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const VerifyPageContent = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('checking'); // 'checking', 'verified', 'error', 'pending'
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email');
  const returnTo = searchParams.get('returnTo') || searchParams.get('redirect_to');
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const code = searchParams.get('code');

  // Handle email verification when page loads with token or code
  useEffect(() => {
    const handleVerification = async () => {
      console.log('Verification attempt:', { token, type, code, email });
      
      // Check if user is already verified
      if (user && user.email_confirmed_at) {
        setVerificationStatus('verified');
        return;
      }

      // New PKCE flow: handle code parameter
      if (code) {
        try {
          setVerificationStatus('checking');
          console.log('Exchanging code for session...');
          
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Code exchange error:', error);
            setVerificationStatus('error');
            setErrorMessage(error.message || 'Verification failed');
          } else {
            console.log('Code exchanged successfully');
            setVerificationStatus('verified');
            // Refresh the auth state
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        } catch (error) {
          console.error('Code exchange error:', error);
          setVerificationStatus('error');
          setErrorMessage('An unexpected error occurred during verification');
        }
        return;
      }

      // If we have a token but no code, it's likely a malformed URL
      // In Supabase's new PKCE flow, verification should always come with a code
      if (token && !code) {
        console.log('Token present but no code - this might be a malformed verification URL');
        setVerificationStatus('error');
        setErrorMessage('Invalid verification link. Please check your email for the correct verification link.');
      } else if (!token && !code) {
        setVerificationStatus('pending');
      }
    };

    handleVerification();
  }, [token, type, code, user]);

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

  const renderContent = () => {
    switch (verificationStatus) {
      case 'checking':
        return (
          <>
            <Loader2 className="w-16 h-16 mx-auto text-brand-green animate-spin" />
            <h1 className="text-3xl font-bold text-white">Verifying Your Email...</h1>
            <p className="text-white/90">
              Please wait while we verify your email address.
            </p>
          </>
        );

      case 'verified':
        return (
          <>
            <CheckCircle className="w-16 h-16 mx-auto text-brand-green" />
            <h1 className="text-3xl font-bold text-white">Email Verified!</h1>
            <p className="text-white/90">
              Your email has been successfully verified. You can now access all features of your account.
            </p>
            <div className="flex flex-col gap-3">
              {/* @ts-ignore */}
              <Button 
                type="button"
                variant="custom" 
                className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
                onClick={() => router.push(returnTo || '/dashboard')}
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        );

      case 'error':
        return (
          <>
            <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
            <h1 className="text-3xl font-bold text-white">Verification Failed</h1>
            <p className="text-white/90">
              {errorMessage || 'There was an error verifying your email address.'}
            </p>
            <p className="text-sm text-white/80">
              The verification link may have expired or already been used. Please try registering again or contact support.
            </p>
            <div className="flex flex-col gap-3">
              {/* @ts-ignore */}
              <Button 
                type="button"
                variant="custom" 
                className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
                onClick={() => router.push('/auth/register')}
              >
                Try Again
              </Button>
              {/* @ts-ignore */}
              <Button 
                type="button"
                variant="custom" 
                className="bg-brand-accent-red text-white border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
                onClick={() => router.push('/auth/login')}
              >
                Go to Login
              </Button>
            </div>
          </>
        );

      case 'pending':
      default:
        return (
          <>
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
          </>
        );
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
          {renderContent()}
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