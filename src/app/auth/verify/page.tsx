"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowLeft, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
  const { toast } = useToast();
  
  const email = searchParams.get('email');
  const returnTo = searchParams.get('returnTo') || searchParams.get('redirect_to');
  const token = searchParams.get('token');
  const type = searchParams.get('type');
  const code = searchParams.get('code');

  // Handle email verification when page loads with token or code
  useEffect(() => {
    const handleVerification = async () => {
      console.log('🔍 VERIFICATION DEBUG:', { 
        hasToken: !!token,
        hasCode: !!code,
        hasEmail: !!email,
        userVerified: user?.email_confirmed_at ? 'yes' : 'no'
      });
      
      // Only show verified status if we have verification parameters
      // This prevents automatic redirect to homepage
      if (user && user.email_confirmed_at && (!token && !code)) {
        console.log('✅ User already verified, showing success page');
        setVerificationStatus('verified');
        return;
      }

       // Handle PKCE codes (new flow)
       if (code) {
         try {
           setVerificationStatus('checking');
           console.log('Exchanging PKCE code for session...', { code: code.substring(0, 20) + '...' });
           
           // Try the standard PKCE exchange first
           const { data, error } = await supabase.auth.exchangeCodeForSession(code);
           
          if (error) {
            console.error('❌ PKCE code exchange error:', error);
            
            // If PKCE exchange fails due to missing code_verifier, try OTP verification
            if (error.message?.includes('code verifier') || error.message?.includes('non-empty')) {
              console.log('🔄 PKCE code_verifier missing, trying OTP verification...');
              
              try {
                const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
                  token_hash: code,
                  type: 'signup'
                });
                
                if (otpError) {
                  console.error('❌ OTP verification failed:', otpError);
                  
                  // If OTP also fails, try direct token verification
                  console.log('🔄 OTP failed, trying direct token verification...');
                  try {
                    const { data: tokenData, error: tokenError } = await supabase.auth.verifyOtp({
                      token: code,
                      type: 'signup',
                      email: email || 'test2@whistleblower.ng'
                    });
                    
                    if (tokenError) {
                      console.error('❌ Direct token verification failed:', tokenError);
                      
                      // All verification methods failed - this is likely an expired link
                      console.log('🔄 All verification methods failed - link likely expired');
                      setVerificationStatus('error');
                      setErrorMessage('The verification link has expired or is invalid. Please request a new one.');
                    } else {
                      console.log('✅ Direct token verification successful:', tokenData);
                      
                      // Update user verification status in database
                      if (tokenData.user) {
                        try {
                          await supabase
                            .from('users')
                            .update({ 
                              email_verified_at: new Date().toISOString(),
                              is_active: true 
                            })
                            .eq('id', tokenData.user.id);
                          console.log('✅ User verification status updated in database');
                        } catch (dbError) {
                          console.error('❌ Error updating user verification status:', dbError);
                        }
                      }
                      
                      // Redirect immediately to dashboard - no intermediate page
                      router.push('/dashboard/wishlist');
                    }
                  } catch (tokenError) {
                    console.error('❌ Direct token verification error:', tokenError);
                    setVerificationStatus('error');
                    setErrorMessage('The verification link has expired or is invalid. Please request a new one.');
                  }
                } else {
                  console.log('✅ OTP verification successful:', otpData);
                  
                  // Update user verification status in database
                  if (otpData.user) {
                    try {
                      await supabase
                        .from('users')
                        .update({ 
                          email_verified_at: new Date().toISOString(),
                          is_active: true 
                        })
                        .eq('id', otpData.user.id);
                      console.log('✅ User verification status updated in database');
                    } catch (dbError) {
                      console.error('❌ Error updating user verification status:', dbError);
                    }
                  }
                  
                  // Redirect immediately to dashboard - no intermediate page
                  router.push('/dashboard/wishlist');
                }
              } catch (otpError) {
                console.error('❌ OTP verification error:', otpError);
                setVerificationStatus('error');
                setErrorMessage('The verification link has expired or is invalid. Please request a new one.');
              }
            } else {
              // Other PKCE errors
              setVerificationStatus('error');
              setErrorMessage(`Verification failed: ${error.message || 'Please request a new verification link.'}`);
            }
           } else {
             console.log('PKCE code exchanged successfully:', data);
             
             // Update user verification status in database
             if (data.user) {
               try {
                 await supabase
                   .from('users')
                   .update({ 
                     email_verified_at: new Date().toISOString(),
                     is_active: true 
                   })
                   .eq('id', data.user.id);
                 console.log('✅ User verification status updated in database');
               } catch (dbError) {
                 console.error('❌ Error updating user verification status:', dbError);
               }
             }
             
             // Redirect immediately to dashboard - no intermediate page
             router.push('/dashboard/wishlist');
           }
         } catch (error) {
           console.error('PKCE verification error:', error);
           setVerificationStatus('error');
           setErrorMessage('An unexpected error occurred during verification');
         }
         return;
       }

      // Handle PKCE tokens (legacy format with pkce_ prefix)
      if (token && token.startsWith('pkce_') && type === 'signup') {
        try {
          setVerificationStatus('checking');
          console.log('Using PKCE token verification...', { token: token.substring(0, 20) + '...', type });
          
          // Try to use the token as a PKCE code
          console.log('🔄 Attempting PKCE exchange...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(token);

          if (error) {
            console.error('❌ PKCE token verification error:', error);
            // If PKCE exchange fails, this token may be invalid or expired
            setVerificationStatus('error');
            setErrorMessage('The verification link has expired or is invalid. Please request a new one.');
          } else {
            console.log('✅ PKCE token verification successful:', data);
            
            // Update user verification status in database
            if (data.user) {
              try {
                await supabase
                  .from('users')
                  .update({ 
                    email_verified_at: new Date().toISOString(),
                    is_active: true 
                  })
                  .eq('id', data.user.id);
                console.log('✅ User verification status updated in database');
              } catch (dbError) {
                console.error('❌ Error updating user verification status:', dbError);
              }
            }
            
            // Redirect immediately to dashboard - no intermediate page
            router.push('/dashboard/wishlist');
          }
        } catch (error) {
          console.error('❌ PKCE token verification error:', error);
          setVerificationStatus('error');
          setErrorMessage('An unexpected error occurred during verification');
        }
      } else if (!token && !code) {
        setVerificationStatus('pending');
      }
    };

    handleVerification();
  }, [token, type, code, user, router]);

  const handleContinueContributing = async () => {
    setIsCheckingSession(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(returnTo || '/dashboard/wishlist');
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
        router.push('/dashboard/wishlist');
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


  const handleResendVerification = async () => {
    // Try to get email from URL params or use a fallback
    const emailToUse = email || 'test2@whistleblower.ng'; // Fallback for testing
    
    // Validate email is present
    if (!emailToUse) {
      toast({
        title: "Error",
        description: "Email address is missing. Please try registering again.",
        variant: "destructive",
      });
      router.push('/auth/register');
      return;
    }

    try {
      console.log('Resending verification email to:', emailToUse);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailToUse
      });
      
      if (error) {
        console.error('Error resending verification:', error);
        toast({
          title: "Error",
          description: "Failed to resend verification email. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Verification email resent successfully');
        toast({
          title: "Verification Email Sent",
          description: "Please check your email for the verification link.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
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
                onClick={() => router.push(returnTo || '/dashboard/wishlist')}
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
                onClick={handleResendVerification}
              >
                Resend Verification Email
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
              Please check your email for a verification link to confirm your account.
            </p>
            <p className="text-sm text-white/80">
              If you don't see the email, check your spam folder or try resending the verification email.
            </p>
            <p className="text-xs text-white/60 bg-white/5 p-2 border border-white/10">
              💡 <strong>Mobile users:</strong> If you're having trouble with the verification link, try opening it in your default browser or copy the link and paste it in a new tab.
            </p>
            <div className="flex flex-col gap-3">
              {/* @ts-ignore */}
              <Button 
                type="button"
                variant="custom" 
                className="bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]" 
                onClick={handleResendVerification}
              >
                Resend Verification Email
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