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
import { Loader2, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { getUserFriendlyError } from '@/lib/utils';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ResetPasswordPageContent = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const type = searchParams.get('type');

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Check if we have the required parameters
        if (!token || type !== 'recovery') {
          setIsValidToken(false);
          setCheckingToken(false);
          return;
        }

        // For password recovery, we just need to check if the token exists
        // The actual validation happens when we submit the form
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
      // For password recovery with a token, we need to use verifyOtp with the recovery token
      const { error } = await supabase.auth.verifyOtp({
        token: token,
        type: 'recovery',
        password: password
      });

      if (error) {
        toast({
          title: "Error",
          description: getUserFriendlyError(error.message),
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
          <div className="w-full max-w-md p-8 space-y-6 bg-white border-2 border-black">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 flex items-center justify-center border-2 border-black">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-brand-purple-dark mt-4">Invalid Link</h1>
                <p className="text-gray-600 mt-2">
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>

              <Link href="/auth/forgot-password">
                <Button variant="custom" className="w-full bg-brand-orange text-black border-2 border-black shadow-[-4px_4px_0px_#161B47] hover:shadow-[-2px_2px_0px_#161B47] active:shadow-[0px_0px_0px_#161B47]">
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
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    autoComplete="new-password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="border-2 border-black"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    autoComplete="new-password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    className="border-2 border-black"
                  />
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