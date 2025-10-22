"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ResetPasswordPageContent = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const type = searchParams.get('type');
  // Supabase may include email as 'email' or 'to' in query params
  const emailFromUrl = searchParams.get('email') || searchParams.get('to');

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Check if we have the required parameters
        if (!token || type !== 'recovery') {
          setIsValidToken(false);
          setCheckingToken(false);
          return;
        }

        // If the email is present, proactively verify to establish a session
        // so that updateUser can succeed without calling verify during submit
        if (emailFromUrl) {
          try {
            await supabase.auth.verifyOtp({
              type: 'recovery',
              token: token,
              email: emailFromUrl
            } as any);
          } catch (e) {
            // ignore; user can still try submit which will report error
          }
        }
        setIsValidToken(true);
      } catch (error) {
        console.error('Token check error:', error);
        setIsValidToken(false);
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [token, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // After recovery verification, a session should exist; then simply updateUser
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Try to create a session now if email provided
        if (emailFromUrl) {
          await supabase.auth.verifyOtp({ type: 'recovery', token: token || '', email: emailFromUrl } as any);
        }
      }

      const { error: updateErr } = await supabase.auth.updateUser({ password });

      if (updateErr) {
        toast({
          title: "Error",
          description: getUserFriendlyError(updateErr.message),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Password reset successfully! You can now log in with your new password.",
        });
        router.push('/auth/login');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  if (checkingToken) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Verifying reset link...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isValidToken) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md p-8 space-y-6 bg-brand-accent-red text-white border-2 border-black text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-white flex items-center justify-center border-2 border-black">
                  <AlertCircle className="w-8 h-8 text-brand-accent-red" />
                </div>
                <h1 className="text-3xl font-bold text-white mt-4">Invalid Link</h1>
                <p className="text-white/90 mt-2">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>

              <Link href="/auth/forgot-password">
                {/* @ts-ignore */}
                <Button variant="custom" className="mt-6 w-full bg-white text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]">
                  Request New Link
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-brand-green flex items-center justify-center border-2 border-black">
                    <Lock className="w-6 h-6 text-black" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-brand-purple-dark">Reset Password</h1>
                <p className="text-gray-600 mt-2">
                  Enter your new password below
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      autoComplete="new-password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="border-2 border-black"
                    />
                    {/* @ts-ignore */}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 bottom-1 h-7 w-7" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      autoComplete="new-password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                      className="border-2 border-black"
                    />
                    {/* @ts-ignore */}
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 bottom-1 h-7 w-7" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                variant="custom" 
                className="w-full bg-brand-green text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span>Reset Password</span>}
                {!loading && <CheckCircle className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-purple-dark border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  );
};

export default ResetPasswordPage;